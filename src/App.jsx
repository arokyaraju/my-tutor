import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import AvatarCompanion from './components/AvatarCompanion';
import WhiteboardCanvas from './components/WhiteboardCanvas';
import SincerityModal from './components/SincerityModal';
import CourseCatalog from './components/CourseCatalog';
import AnalogyRemediation from './components/AnalogyRemediation';
import LessonNotesView from './components/LessonNotesView';
import DailyExamView from './components/DailyExamView';
import CodeSandboxView from './components/CodeSandboxView';
import ProgressDashboard from './components/ProgressDashboard';
import DocumentUploadModal from './components/DocumentUploadModal';
import AdminLogsModal from './components/AdminLogsModal';
import VideoLectureQuizModal from './components/VideoLectureQuizModal';

import { useSpeechTutor } from './hooks/useSpeechTutor';
import { useSincerityTracker } from './hooks/useSincerityTracker';
import { 
  fetchCourses, 
  fetchStudentState, 
  generateCourseFromTopic, 
  fetchCatalog, 
  structureAndTeachCourse,
  logStudentTelemetry,
  fetchVideoLectureContent,
  deleteCourse,
  clearAllCourses
} from './services/api';
import { 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Mic, 
  Film, 
  Maximize2, 
  Minimize2, 
  ArrowRight,
  Send,
  HelpCircle,
  Trash2
} from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [catalogDomains, setCatalogDomains] = useState([]);
  const [student, setStudent] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeTab, setActiveTab] = useState('classroom'); // 'courses' | 'classroom' | 'notes' | 'exam' | 'code' | 'progress'
  const [activeMark, setActiveMark] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [structuringCourseId, setStructuringCourseId] = useState(null);
  const [structuringMessage, setStructuringMessage] = useState('');

  // Multi-step lesson progression & dual board state
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [boardMode, setBoardMode] = useState('ai_whiteboard'); // 'ai_whiteboard' | 'video_lecture'
  const [isImmersiveStage, setIsImmersiveStage] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPipAvatarCollapsed, setIsPipAvatarCollapsed] = useState(false);

  // Professional Video Lecture & 10-Question Exam states
  const [isVideoQuizOpen, setIsVideoQuizOpen] = useState(false);
  const [videoQuizQuestions, setVideoQuizQuestions] = useState([]);
  const [currentAILectureSummary, setCurrentAILectureSummary] = useState(null);
  const [currentVideoLecture, setCurrentVideoLecture] = useState(null);

  const socketRef = useRef(null);

  // Secret Admin Shortcut: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Speech Tutor Hook
  const {
    isSpeaking,
    mouthOpenRatio,
    speakingEmotion,
    setSpeakingEmotion,
    voiceList,
    selectedVoice,
    setSelectedVoice,
    speechRate,
    setSpeechRate,
    speakSSML,
    interruptTeacher,
    isListening,
    listenForStudentQuestion
  } = useSpeechTutor({
    onMarkReached: (markName) => {
      setActiveMark(markName);
    },
    onSpeakingStateChange: (speaking) => {
      if (!speaking) {
        // finished
      }
    }
  });

  // Initialize Sincerity Logic Tracker (Tab switch & AFK detector)
  const {
    isLocked,
    breachReason,
    unlockLesson,
    fastDemoMode,
    setFastDemoMode
  } = useSincerityTracker({
    enabled: true,
    inactivityThresholdMs: 180000,
    onAttentionBreached: (reason) => {
      interruptTeacher();
      setSpeakingEmotion('warning');
    }
  });

  // Load initial courses, 24-domain catalog, and student records
  useEffect(() => {
    async function init() {
      try {
        const [fetchedCourses, catalogData, studentData] = await Promise.all([
          fetchCourses(),
          fetchCatalog(),
          fetchStudentState()
        ]);

        if (catalogData && catalogData.domains) {
          setCatalogDomains(catalogData.domains);
        }

        // Clear legacy demo course cache if present
        try {
          localStorage.removeItem('mytutor_courses');
          localStorage.removeItem('mytutor_courses_v2');
        } catch (e) {}

        setCourses(fetchedCourses || []);
        if (fetchedCourses && fetchedCourses.length > 0) {
          const firstCourse = fetchedCourses[0];
          setActiveCourse(firstCourse);
          const firstMod = firstCourse.tiers?.basics?.[0] || firstCourse.tiers?.advanced?.[0];
          setActiveModule(firstMod);
        } else {
          setActiveCourse(null);
          setActiveModule(null);
          setActiveTab('courses');
        }

        if (studentData) {
          setStudent(studentData.currentUser);
          setLeaderboard(studentData.leaderboard || []);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    init();
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socket = new WebSocket(`${wsProtocol}//${window.location.host}/ws/tutor`);
      socketRef.current = socket;

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'interruption_response') {
            speakSSML(`<speak><emphasis level="strong">Great question!</emphasis> ${msg.clarification_text}</speak>`, 'attentive');
          }
        } catch (e) {
          console.error('WebSocket parse error:', e);
        }
      };

      return () => {
        if (socket.readyState === WebSocket.OPEN) socket.close();
      };
    } catch (e) {
      console.warn('WebSocket connection not initialized', e);
    }
  }, [speakSSML]);

  // Get active section safely (ensures 3-4 sections available)
  const getActiveSections = useCallback(() => {
    if (activeModule?.sections && activeModule.sections.length > 0) {
      return activeModule.sections;
    }
    return [{
      id: 'sec_default',
      title: activeModule?.title || 'Core Theory',
      speech_ssml: activeModule?.speech_ssml || '',
      whiteboard_commands: activeModule?.whiteboard_commands || [],
      notes_content: activeModule?.summary || '',
      key_takeaways: ['Understand core foundations', 'Inspect whiteboard illustrations'],
      video_lecture: activeModule?.video_lecture
    }];
  }, [activeModule]);

  // Start current lesson speech for active section
  const handleTeachLesson = () => {
    if (!activeModule) return;
    setActiveMark(null);
    const sections = getActiveSections();
    const curSec = sections[activeSectionIndex] || sections[0];
    const ssml = curSec?.speech_ssml || activeModule.speech_ssml;
    speakSSML(ssml, 'explaining');
  };

  // Student clicks "I Get It Now" -> Auto-advance to next theory section, or trigger Daily Exam on final section
  const handleNextSection = () => {
    const sections = getActiveSections();
    const total = sections.length;
    const currentSec = sections[activeSectionIndex] || sections[0];

    // Log telemetry for student audit
    logStudentTelemetry({
      eventType: 'section_step_completed',
      details: `Student clicked 'I Get It Now' on Step ${activeSectionIndex + 1} of ${total}: "${currentSec?.title}"`,
      courseTitle: activeCourse?.title,
      moduleTitle: activeModule?.title,
      sectionIndex: activeSectionIndex
    });

    if (activeSectionIndex < total - 1) {
      const nextIndex = activeSectionIndex + 1;
      setActiveSectionIndex(nextIndex);
      setActiveMark(null);
      const nextSec = sections[nextIndex];
      if (nextSec?.speech_ssml) {
        speakSSML(nextSec.speech_ssml, 'explaining');
      }
    } else {
      // Completed all 4 theory sections -> Auto transition to Daily Exam
      logStudentTelemetry({
        eventType: 'all_theory_sections_completed',
        details: `Completed all ${total} theory sections for "${activeModule?.title}". Auto-advancing to Daily Exam.`,
        courseTitle: activeCourse?.title,
        moduleTitle: activeModule?.title,
        sectionIndex: activeSectionIndex
      });

      speakSSML("<speak><emphasis level='strong'>Brilliant work!</emphasis> You have completed all theory sections of this lesson. Let us now conduct your Daily Examination!</speak>", 'happy');
      setActiveTab('exam');
    }
  };

  // Switch between AI Whiteboard and Professional Video Lecture
  // Requirement: When user clicks on video lecture, AI tutor must immediately stop speaking
  const handleSetBoardMode = useCallback((mode) => {
    if (mode === 'video_lecture') {
      interruptTeacher();
    }
    setBoardMode(mode);
  }, [interruptTeacher]);

  // Auto-fetch verified video content and 10 quiz questions whenever video lecture mode is entered
  useEffect(() => {
    if (boardMode === 'video_lecture') {
      interruptTeacher();

      const sections = getActiveSections();
      const curSec = sections[activeSectionIndex] || sections[0];

      if (curSec?.video_quiz && curSec.video_quiz.length > 0) {
        setVideoQuizQuestions(curSec.video_quiz);
      }
      if (curSec?.ai_lecture_summary) {
        setCurrentAILectureSummary(curSec.ai_lecture_summary);
      }
      if (curSec?.video_lecture) {
        setCurrentVideoLecture(curSec.video_lecture);
      }

      if (activeCourse) {
        fetchVideoLectureContent({
          courseId: activeCourse.id,
          courseTitle: activeCourse.title,
          domain: activeCourse.domain || activeCourse.domainName,
          sectionIndex: activeSectionIndex
        }).then(data => {
          if (data?.video_lecture) setCurrentVideoLecture(data.video_lecture);
          if (data?.video_quiz && data.video_quiz.length > 0) setVideoQuizQuestions(data.video_quiz);
          if (data?.ai_lecture_summary) setCurrentAILectureSummary(data.ai_lecture_summary);
        }).catch(err => {
          console.warn('Could not auto-fetch video lecture content:', err);
        });
      }
    }
  }, [boardMode, activeCourse, activeSectionIndex, interruptTeacher, getActiveSections]);

  // Handle 10-Question Video Lecture Quiz Pass (80% and above):
  // User qualified -> advance to next step or exam
  const handleVideoQuizPass = () => {
    setIsVideoQuizOpen(false);
    setBoardMode('ai_whiteboard');
    speakSSML("<speak><emphasis level='strong'>Congratulations!</emphasis> You achieved 80% or above on the video lecture exam and have qualified to advance!</speak>", 'happy');
    handleNextSection();
  };

  // Handle 10-Question Video Lecture Quiz Fail (< 80%):
  // Requirement: "display the message that you are not qualified. Repeat the same lesson please."
  const handleVideoQuizFail = () => {
    setIsVideoQuizOpen(false);
    setBoardMode('ai_whiteboard');
    // Display & announce the exact required prompt message
    speakSSML("<speak><emphasis level='strong'>You are not qualified. Repeat the same lesson please.</emphasis> Let us carefully review this lesson from the beginning.</speak>", 'warning');
    
    // Repeat the lesson
    const sections = getActiveSections();
    const curSec = sections[activeSectionIndex] || sections[0];
    setTimeout(() => {
      if (curSec?.speech_ssml) {
        speakSSML(curSec.speech_ssml, 'explaining');
      }
    }, 2400);
  };

  // Student asks question / interrupts teacher
  const handleAskQuestion = (questionText) => {
    interruptTeacher();
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'interrupt',
        question: questionText,
        current_concept: activeModule?.title
      }));
    } else {
      // Local fallback reply
      const reply = `That is an excellent question regarding ${activeModule?.title || 'this topic'}! Notice how the fundamental invariant ensures correctness even under extreme edge cases. Let's inspect the whiteboard diagram.`;
      speakSSML(`<speak><emphasis level="strong">Good question!</emphasis> ${reply}</speak>`, 'attentive');
    }
  };

  // Voice Question Toggle
  const handleVoiceQuestionToggle = () => {
    listenForStudentQuestion((transcript) => {
      if (transcript) {
        handleAskQuestion(transcript);
      }
    });
  };

  // Handle Analogy Switch in Infinite Analogy Loop
  const handleSelectAnalogy = (analogy) => {
    interruptTeacher();
    const ssml = `<speak><mark name="clear_board"/> Let's look at this through a different lens: <emphasis level="strong">${analogy.title}</emphasis>. <break time="300ms"/> ${analogy.content}</speak>`;
    speakSSML(ssml, 'explaining');
  };

  // Select a new course or module
  const handleSelectCourse = (courseOrId, autoLaunch = false) => {
    const course = typeof courseOrId === 'string'
      ? courses.find(c => c.id === courseOrId) || { id: courseOrId, title: courseOrId }
      : courseOrId;

    if (!course) return;

    setActiveCourse(course);
    const mod = course.tiers?.basics?.[0] || course.tiers?.advanced?.[0] || course.tiers?.expert?.[0];
    setActiveModule(mod);
    setActiveSectionIndex(0);
    setActiveMark(null);
    interruptTeacher();

    if (autoLaunch) {
      setActiveTab('classroom');
      setIsCatalogOpen(false);
      if (mod) {
        setTimeout(() => {
          const firstSec = mod.sections?.[0];
          const ssml = firstSec?.speech_ssml || mod.speech_ssml;
          if (ssml) speakSSML(ssml, 'explaining');
        }, 400);
      }
    }

    // Reset video state & proactively fetch matching video lecture for this selected course
    setCurrentVideoLecture(null);
    setCurrentAILectureSummary(null);
    setVideoQuizQuestions([]);

    fetchVideoLectureContent({
      courseId: course.id,
      courseTitle: course.title,
      domain: course.domain || course.domainName,
      sectionIndex: 0
    }).then(data => {
      if (data?.video_lecture) setCurrentVideoLecture(data.video_lecture);
      if (data?.video_quiz) setVideoQuizQuestions(data.video_quiz);
      if (data?.ai_lecture_summary) setCurrentAILectureSummary(data.ai_lecture_summary);
    }).catch(console.warn);
  };

  const handleSelectModule = (mod) => {
    setActiveModule(mod);
    setActiveSectionIndex(0);
    setActiveMark(null);
    interruptTeacher();
    setActiveTab('classroom');

    // Proactively fetch matching video lecture for this module
    fetchVideoLectureContent({
      courseId: activeCourse?.id,
      courseTitle: activeCourse?.title || mod.title,
      domain: activeCourse?.domain || activeCourse?.domainName,
      sectionIndex: 0
    }).then(data => {
      if (data?.video_lecture) setCurrentVideoLecture(data.video_lecture);
      if (data?.video_quiz) setVideoQuizQuestions(data.video_quiz);
      if (data?.ai_lecture_summary) setCurrentAILectureSummary(data.ai_lecture_summary);
    }).catch(console.warn);

    // Start teaching Step 1 of the selected module
    setTimeout(() => {
      const firstSec = mod.sections?.[0];
      const ssml = firstSec?.speech_ssml || mod.speech_ssml;
      speakSSML(ssml, 'explaining');
    }, 400);
  };

  // Click any of the 150+ courses: AI finds best content, structures 3-tier master curriculum, and starts elaborately teaching!
  const handleStructureAndTeachCourse = async (courseOrId, domainName) => {
    const course = typeof courseOrId === 'string'
      ? courses.find(c => c.id === courseOrId) || { id: courseOrId, title: courseOrId }
      : courseOrId;

    if (!course) return;

    // Fast-path: If course already has full structured tiers (e.g. Sunil Gavaskar, uploaded PDF, Excel Masterclass), immediately launch and teach!
    if (course.tiers && (course.tiers.basics?.length > 0 || course.tiers.advanced?.length > 0 || course.tiers.expert?.length > 0)) {
      setActiveCourse(course);
      const firstMod = course.tiers?.basics?.[0] || 
                       course.tiers?.advanced?.[0] || 
                       course.tiers?.expert?.[0];
      setActiveModule(firstMod);
      setActiveSectionIndex(0);
      setActiveMark(null);
      interruptTeacher();
      setActiveTab('classroom');
      setIsCatalogOpen(false);

      // Reset and auto-fetch matched video for this course
      setCurrentVideoLecture(null);
      setCurrentAILectureSummary(null);
      setVideoQuizQuestions([]);

      fetchVideoLectureContent({
        courseId: course.id,
        courseTitle: course.title,
        domain: domainName || course.domainName || course.domain,
        sectionIndex: 0
      }).then(data => {
        if (data?.video_lecture) setCurrentVideoLecture(data.video_lecture);
        if (data?.video_quiz) setVideoQuizQuestions(data.video_quiz);
        if (data?.ai_lecture_summary) setCurrentAILectureSummary(data.ai_lecture_summary);
      }).catch(console.warn);

      // AI Teacher Avatar begins teaching Section 1 immediately!
      setTimeout(() => {
        if (firstMod) {
          const firstSec = firstMod.sections?.[0];
          const intro = `<speak>Welcome to <emphasis level="strong">${course.title}</emphasis>! <break time="400ms"/> Let us begin Step 1 on <emphasis level="strong">${firstSec?.title || firstMod.title}</emphasis>. <break time="500ms"/> `;
          const lessonContent = (firstSec?.speech_ssml || firstMod.speech_ssml || '').replace(/<\/?speak>/gi, '');
          speakSSML(`${intro}${lessonContent}</speak>`, 'explaining');
        }
      }, 500);
      return;
    }

    const courseKey = course.id || course.title;
    setStructuringCourseId(courseKey);
    setStructuringMessage(`AI is structuring the 3-tier master curriculum for ${course.title}...`);

    try {
      const response = await structureAndTeachCourse({
        courseId: course.id,
        courseTitle: course.title,
        domain: domainName || course.domainName || course.domain
      });

      const structuredCourse = response.course;

      // Update loaded courses
      setCourses(prev => {
        const filtered = prev.filter(c => c.id !== structuredCourse.id);
        return [structuredCourse, ...filtered];
      });

      // Update active selection
      setActiveCourse(structuredCourse);
      const firstMod = structuredCourse.tiers?.basics?.[0] || 
                       structuredCourse.tiers?.advanced?.[0] || 
                       structuredCourse.tiers?.expert?.[0];
      setActiveModule(firstMod);
      setActiveSectionIndex(0);
      setActiveMark(null);
      interruptTeacher();
      setActiveTab('classroom');
      setIsCatalogOpen(false);

      // Reset and auto-fetch matched video for this newly structured course
      setCurrentVideoLecture(null);
      setCurrentAILectureSummary(null);
      setVideoQuizQuestions([]);

      fetchVideoLectureContent({
        courseId: structuredCourse.id,
        courseTitle: structuredCourse.title,
        domain: domainName || structuredCourse.domainName,
        sectionIndex: 0
      }).then(data => {
        if (data?.video_lecture) setCurrentVideoLecture(data.video_lecture);
        if (data?.video_quiz) setVideoQuizQuestions(data.video_quiz);
        if (data?.ai_lecture_summary) setCurrentAILectureSummary(data.ai_lecture_summary);
      }).catch(console.warn);

      // AI Teacher Avatar begins teaching Section 1 immediately!
      setTimeout(() => {
        if (firstMod) {
          const firstSec = firstMod.sections?.[0];
          const intro = response.wasNewlySynthesized
            ? `<speak>Welcome to <emphasis level="strong">${structuredCourse.title}</emphasis>! <break time="400ms"/> I have structured your comprehensive theory sections. Let us begin Step 1 on <emphasis level="strong">${firstSec?.title || firstMod.title}</emphasis>. <break time="600ms"/> `
            : `<speak>Welcome back to <emphasis level="strong">${structuredCourse.title}</emphasis>! <break time="400ms"/> Let us resume with Step 1: <emphasis level="strong">${firstSec?.title || firstMod.title}</emphasis>. <break time="500ms"/> `;

          const lessonContent = (firstSec?.speech_ssml || firstMod.speech_ssml).replace(/<\/?speak>/gi, '');
          speakSSML(`${intro}${lessonContent}</speak>`, 'explaining');
        }
      }, 600);

    } catch (err) {
      console.error('Failed to structure and teach course:', err);
      alert(`Could not structure course: ${err.message}`);
    } finally {
      setStructuringCourseId(null);
      setStructuringMessage('');
    }
  };

  // Generate on-demand custom syllabus from topic
  const handleGenerateCustomTopic = async (topic) => {
    setStructuringCourseId(topic);
    setStructuringMessage(`AI synthesizing 3-tier curriculum for "${topic}"...`);
    try {
      const course = await generateCourseFromTopic(topic);
      setCourses(prev => [course, ...prev]);
      handleSelectCourse(course);
      setActiveTab('classroom');
      setIsCatalogOpen(false);
      setTimeout(() => {
        const firstMod = course.tiers?.basics?.[0];
        if (firstMod) {
          speakSSML(firstMod.speech_ssml, 'explaining');
        }
      }, 600);
    } finally {
      setStructuringCourseId(null);
      setStructuringMessage('');
    }
  };

  // Callback when student passes an exam
  const handleExamCompleted = (result) => {
    if (result.user) setStudent(result.user);
    if (result.leaderboard) setLeaderboard(result.leaderboard);
  };

  // Delete single course or clear all courses
  const handleDeleteCourse = async (courseId, courseTitle = '') => {
    if (courseId === 'all') {
      if (!window.confirm('Are you sure you want to delete ALL courses and uploaded study materials?')) {
        return;
      }
      await clearAllCourses();
      setCourses([]);
      setActiveCourse(null);
      setActiveModule(null);
      setActiveTab('courses');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${courseTitle || 'this course'}"?`)) {
      return;
    }

    const updated = await deleteCourse(courseId);
    setCourses(updated);

    if (activeCourse && (activeCourse.id === courseId || activeCourse.title === courseId)) {
      if (updated.length > 0) {
        const nextCourse = updated[0];
        setActiveCourse(nextCourse);
        const nextMod = nextCourse.tiers?.basics?.[0] || nextCourse.tiers?.advanced?.[0];
        setActiveModule(nextMod);
      } else {
        setActiveCourse(null);
        setActiveModule(null);
        setActiveTab('courses');
      }
    }
  };

  const currentSections = getActiveSections();
  const currentSection = currentSections[activeSectionIndex] || currentSections[0];
  const totalSections = currentSections.length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        activeCourse={activeCourse}
        activeModule={activeModule}
        onOpenUpload={() => setIsUploadOpen(true)}
        fastDemoMode={fastDemoMode}
        setFastDemoMode={setFastDemoMode}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Attention Lock Sincerity Modal */}
      <SincerityModal
        isOpen={isLocked}
        breachReason={breachReason}
        checkpoint={activeModule?.sincerity_checkpoint}
        onResolve={() => {
          unlockLesson();
          speakSSML("<speak><emphasis level='moderate'>Attention verified! Let us proceed with the lesson.</emphasis></speak>", 'happy');
        }}
      />

      {/* Document Uploader Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCourseCreated={(course) => {
          setCourses(prev => [course, ...prev.filter(c => c.id !== course.id)]);
          handleStructureAndTeachCourse(course, course.domain || 'Uploaded Documents');
        }}
      />

      {/* Floating Structuring Overlay Indicator */}
      {structuringCourseId && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #6366f1',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
          borderRadius: '14px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backdropFilter: 'blur(12px)',
          animation: 'pulse 2s infinite'
        }}>
          <Loader2 size={20} className="spin" color="#818cf8" />
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#f59e0b" />
              AI Pedagogical Engine Active
            </div>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: 0 }}>
              {structuringMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main App Content Viewport */}
      <main className="app-container">
        
        {/* Tab 0: Comprehensive 24-Domain Course Directory */}
        {activeTab === 'courses' && (
          <CourseCatalog
            catalogDomains={catalogDomains}
            courses={courses}
            activeCourseId={activeCourse?.id}
            onSelectCourse={handleSelectCourse}
            activeModuleId={activeModule?.id}
            onSelectModule={handleSelectModule}
            completedModules={student?.completed_modules || []}
            onGenerateCustomTopic={handleGenerateCustomTopic}
            onStructureAndTeachCourse={handleStructureAndTeachCourse}
            structuringCourseId={structuringCourseId}
            onOpenUpload={() => setIsUploadOpen(true)}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {/* Tab 1: Live Interactive Classroom & Whiteboard */}
        {activeTab === 'classroom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Quick Scope & Lesson Step Header Bar */}
            <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge badge-${activeModule?.tier || 'basics'}`}>
                  {activeModule?.tier || 'basics'}
                </span>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {activeModule ? activeModule.title : 'Select a course to begin learning...'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700 }}>
                      Step {activeSectionIndex + 1} of {totalSections}:
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      {currentSection?.title}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Stage Layout View Mode Toggle */}
                <button
                  onClick={() => setIsImmersiveStage(!isImmersiveStage)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  title={isImmersiveStage ? 'Switch to Split View' : 'Switch to Full Screen Fit Stage'}
                >
                  {isImmersiveStage ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  {isImmersiveStage ? 'Side-by-Side View' : 'Full Stage View'}
                </button>

                <button
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  {isCatalogOpen ? 'Hide Course Browser' : 'Browse All 24 Domains & Courses'}
                </button>

                {activeCourse && (
                  <button
                    onClick={() => handleDeleteCourse(activeCourse.id, activeCourse.title)}
                    className="btn btn-secondary"
                    style={{
                      fontSize: '0.82rem',
                      padding: '6px 12px',
                      color: '#f87171',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="Delete this active course and return to catalog"
                  >
                    <Trash2 size={14} />
                    Delete Course
                  </button>
                )}
              </div>
            </div>

            {/* Course Catalog Scope Explorer (Toggleable) */}
            {isCatalogOpen && (
              <CourseCatalog
                catalogDomains={catalogDomains}
                courses={courses}
                activeCourseId={activeCourse?.id}
                onSelectCourse={handleSelectCourse}
                activeModuleId={activeModule?.id}
                onSelectModule={handleSelectModule}
                completedModules={student?.completed_modules || []}
                onGenerateCustomTopic={handleGenerateCustomTopic}
                onStructureAndTeachCourse={handleStructureAndTeachCourse}
                structuringCourseId={structuringCourseId}
                onOpenUpload={() => setIsUploadOpen(true)}
                onDeleteCourse={handleDeleteCourse}
              />
            )}

            {/* VIEW MODE 1: Full Screen Fit Immersive Whiteboard Stage with Floating HUD and Floating PiP Avatar */}
            {isImmersiveStage ? (
              <div className="immersive-stage" style={{ minHeight: '620px', position: 'relative' }}>
                
                {/* Whiteboard Canvas (Full Stage Fit) */}
                <WhiteboardCanvas
                  activeMark={activeMark}
                  whiteboardCommands={currentSection?.whiteboard_commands || activeModule?.whiteboard_commands || []}
                  onClearBoard={() => setActiveMark(null)}
                  currentConceptTitle={`${activeModule?.title} • ${currentSection?.title}`}
                  videoLecture={currentVideoLecture || currentSection?.video_lecture || activeModule?.video_lecture}
                  aiLectureSummary={currentAILectureSummary || currentSection?.ai_lecture_summary}
                  boardMode={boardMode}
                  onToggleBoardMode={() => handleSetBoardMode(boardMode === 'ai_whiteboard' ? 'video_lecture' : 'ai_whiteboard')}
                  onOpenVideoQuiz={() => setIsVideoQuizOpen(true)}
                />

                {/* Floating PiP Avatar Companion in Corner */}
                <div 
                  className={`floating-pip-avatar ${isPipAvatarCollapsed ? 'collapsed' : ''}`}
                  onClick={isPipAvatarCollapsed ? () => setIsPipAvatarCollapsed(false) : undefined}
                  title={isPipAvatarCollapsed ? 'Expand Dr. Nova AI Teacher' : undefined}
                >
                  {isPipAvatarCollapsed ? (
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: isSpeaking ? '#10b981' : '#6366f1' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#818cf8' }}>
                          {isSpeaking ? 'TEACHING' : 'READY'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsPipAvatarCollapsed(true); }}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.7rem' }}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 240 240" style={{ width: '100%', height: '100%' }} className={isSpeaking ? 'animate-avatar-float' : ''}>
                          <defs>
                            <linearGradient id="pipSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbd5b5" />
                              <stop offset="100%" stopColor="#f3b88c" />
                            </linearGradient>
                            <linearGradient id="pipSuit" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#1e1b4b" />
                              <stop offset="100%" stopColor="#312e81" />
                            </linearGradient>
                          </defs>
                          <circle cx="120" cy="120" r="110" fill="#0f172a" />
                          <path d="M 40 230 Q 120 185 200 230 Z" fill="url(#pipSuit)" />
                          <ellipse cx="120" cy="115" rx="55" ry="65" fill="url(#pipSkin)" />
                          <circle cx="98" cy="108" r="7" fill="#1e293b" />
                          <circle cx="142" cy="108" r="7" fill="#1e293b" />
                          <rect x="85" y="96" width="28" height="22" rx="6" fill="none" stroke="#818cf8" strokeWidth="2.5" />
                          <rect x="127" y="96" width="28" height="22" rx="6" fill="none" stroke="#818cf8" strokeWidth="2.5" />
                          <line x1="113" y1="107" x2="127" y2="107" stroke="#818cf8" strokeWidth="2.5" />
                          <ellipse cx="120" cy="148" rx="14" ry={Math.max(2, mouthOpenRatio * 16)} fill="#881337" />
                        </svg>
                      </div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                        Dr. Nova
                      </div>
                    </div>
                  )}
                </div>

                {/* FLOATING HUD CONTROLS BAR ("Interrupt", "I Get It Now", "Dual-Mode", etc.) */}
                <div className="floating-hud">
                  {/* Step Pill Indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#818cf8' }}>
                      Step {activeSectionIndex + 1} of {totalSections}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#e2e8f0', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentSection?.title}
                    </span>
                  </div>

                  {/* "I Get It Now" Button: In video mode opens the 10-question exam; in whiteboard advances step or moves to exam */}
                  {boardMode === 'video_lecture' ? (
                    <button
                      onClick={() => setIsVideoQuizOpen(true)}
                      className="hud-btn hud-btn-primary"
                      id="btn-video-i-get-it"
                      title="Open 10-Question Video Lecture Examination"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: '1px solid #34d399' }}
                    >
                      <CheckCircle2 size={16} />
                      <span>I Get It (Take 10-Question Exam)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNextSection}
                      className="hud-btn hud-btn-primary"
                      id="btn-i-get-it-now"
                      title={activeSectionIndex < totalSections - 1 ? `Advance to Step ${activeSectionIndex + 2}` : 'Complete Lesson Theory & Launch Daily Exam'}
                    >
                      <CheckCircle2 size={16} />
                      <span>{activeSectionIndex < totalSections - 1 ? 'I Get It Now (Next Step)' : 'I Get It Now (Take Daily Exam)'}</span>
                    </button>
                  )}

                  {/* Interrupt Button */}
                  <button
                    onClick={interruptTeacher}
                    className="hud-btn hud-btn-danger"
                    id="btn-interrupt-hud"
                    title="Immediately pause teacher speech"
                  >
                    <VolumeX size={15} />
                    <span>Interrupt</span>
                  </button>

                  {/* Voice Question Button */}
                  <button
                    onClick={handleVoiceQuestionToggle}
                    className={`hud-btn ${isListening ? 'hud-btn-danger' : 'hud-btn-secondary'}`}
                    title="Speak your question verbally via microphone"
                  >
                    <Mic size={15} color={isListening ? '#ef4444' : '#a5b4fc'} />
                    <span>{isListening ? 'Listening...' : 'Ask Voice'}</span>
                  </button>

                  {/* Dual-Mode Toggle: AI Teacher Canvas ⇄ YouTube / Professional Video Lecture */}
                  <button
                    onClick={() => handleSetBoardMode(boardMode === 'ai_whiteboard' ? 'video_lecture' : 'ai_whiteboard')}
                    className="hud-btn hud-btn-secondary"
                    id="btn-dual-mode-toggle"
                    title="Toggle between AI Whiteboard and Professional Video Lecture"
                  >
                    {boardMode === 'ai_whiteboard' ? (
                      <>
                        <Film size={15} color="#38bdf8" />
                        <span>Watch Video Lecture</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} color="#818cf8" />
                        <span>AI Whiteboard</span>
                      </>
                    )}
                  </button>

                  {/* Replay/Teach Section */}
                  <button
                    onClick={handleTeachLesson}
                    className="hud-btn hud-btn-secondary"
                    title="Teach/replay speech for current section"
                  >
                    <Volume2 size={15} />
                    <span>{isSpeaking ? 'Replay' : 'Teach'}</span>
                  </button>
                </div>

              </div>
            ) : (
              /* VIEW MODE 2: Standard Two-Column Layout */
              <div className="grid-main">
                {/* Left Column: Animated AI Teacher Avatar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AvatarCompanion
                    isSpeaking={isSpeaking}
                    mouthOpenRatio={mouthOpenRatio}
                    speakingEmotion={speakingEmotion}
                    speechRate={speechRate}
                    setSpeechRate={setSpeechRate}
                    voiceList={voiceList}
                    selectedVoice={selectedVoice}
                    setSelectedVoice={setSelectedVoice}
                    onStartSpeech={handleTeachLesson}
                    onInterrupt={interruptTeacher}
                    onAskQuestion={handleAskQuestion}
                    isListening={isListening}
                    onVoiceInputToggle={handleVoiceQuestionToggle}
                    attentionLocked={isLocked}
                  />

                  {/* Quick Sincerity Cold Call Trigger for testing */}
                  <div className="glass-panel" style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>SINCERITY CHECKPOINT</span>
                      <button
                        onClick={() => {
                          interruptTeacher();
                          setSpeakingEmotion('warning');
                          unlockLesson();
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      >
                        Inspect Checkpoint
                      </button>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: '6px', lineHeight: 1.4 }}>
                      {activeModule?.sincerity_checkpoint?.question || "What is the dominant growth factor in this module?"}
                    </p>
                  </div>
                </div>

                {/* Right Column: Dynamic Vector Whiteboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <WhiteboardCanvas
                    activeMark={activeMark}
                    whiteboardCommands={currentSection?.whiteboard_commands || activeModule?.whiteboard_commands || []}
                    onClearBoard={() => setActiveMark(null)}
                    currentConceptTitle={`${activeModule?.title} • ${currentSection?.title}`}
                    videoLecture={currentVideoLecture || currentSection?.video_lecture || activeModule?.video_lecture}
                    aiLectureSummary={currentAILectureSummary || currentSection?.ai_lecture_summary}
                    boardMode={boardMode}
                    onToggleBoardMode={() => handleSetBoardMode(boardMode === 'ai_whiteboard' ? 'video_lecture' : 'ai_whiteboard')}
                    onOpenVideoQuiz={() => setIsVideoQuizOpen(true)}
                  />
                </div>
              </div>
            )}

            {/* Theory Sections Navigation Timeline */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8' }}>
                  Theory Sections ({totalSections}):
                </span>
                {currentSections.map((sec, idx) => (
                  <button
                    key={sec.id || idx}
                    onClick={() => {
                      setActiveSectionIndex(idx);
                      setActiveMark(null);
                      if (sec.speech_ssml) speakSSML(sec.speech_ssml, 'explaining');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: activeSectionIndex === idx ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                      background: activeSectionIndex === idx ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: activeSectionIndex === idx ? '#c7d2fe' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{idx + 1}. {sec.title}</span>
                    {activeSectionIndex > idx && <CheckCircle2 size={12} color="#10b981" />}
                  </button>
                ))}
              </div>

              {/* Action Trigger for Next Step */}
              <button
                onClick={handleNextSection}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.86rem' }}
              >
                <CheckCircle2 size={16} />
                {activeSectionIndex < totalSections - 1 ? 'I Get It Now (Next Step)' : 'I Get It Now (Start Daily Exam)'}
              </button>
            </div>

            {/* Adaptive Infinite Analogy Remediation */}
            <AnalogyRemediation
              analogies={activeModule?.analogies || []}
              onSelectAnalogy={handleSelectAnalogy}
              onUnderstood={() => {
                speakSSML("<speak><emphasis level='strong'>Excellent!</emphasis> Now that the concept is crystal clear, let's proceed to the daily exam questions!</speak>", 'happy');
              }}
            />

          </div>
        )}

        {/* Tab 2: Detailed Notes & 1, 2, 5, 10 Marker Blueprints */}
        {activeTab === 'notes' && (
          <LessonNotesView activeModule={activeModule} activeCourse={activeCourse} />
        )}

        {/* Tab 3: Daily Dual Exam (Objective MCQs + Descriptive AI Rubric Evaluation) */}
        {activeTab === 'exam' && (
          <DailyExamView
            activeModule={activeModule}
            onExamCompleted={handleExamCompleted}
          />
        )}

        {/* Tab 4: Expert Code Sandbox */}
        {activeTab === 'code' && (
          <CodeSandboxView
            challenge={activeModule?.daily_exam?.coding_challenge}
            onPassedValidation={() => {
              if (student) {
                setStudent(prev => ({ ...prev, total_xp: (prev.total_xp || 0) + 50 }));
              }
            }}
          />
        )}

        {/* Tab 5: Progress Reports, Syllabus Roadmap & Competitor Leaderboard */}
        {activeTab === 'progress' && (
          <ProgressDashboard
            student={student}
            leaderboard={leaderboard}
            courses={courses}
          />
        )}

      </main>

      {/* Secret Administrator Inspection Modal (Protected by password: 3791552) */}
      <AdminLogsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* 10-Question Professional Video Lecture Evaluation Modal (100% Score, 80% passing bar) */}
      <VideoLectureQuizModal
        isOpen={isVideoQuizOpen}
        onClose={() => setIsVideoQuizOpen(false)}
        quizQuestions={videoQuizQuestions && videoQuizQuestions.length > 0 ? videoQuizQuestions : (currentSection?.video_quiz || activeModule?.video_quiz || [])}
        courseTitle={activeCourse?.title || 'Academic Course'}
        moduleTitle={currentSection?.title || activeModule?.title || 'Video Lecture'}
        sectionIndex={activeSectionIndex}
        onPass={handleVideoQuizPass}
        onFailRepeat={handleVideoQuizFail}
      />

    </div>
  );
}
