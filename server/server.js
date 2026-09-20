import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { 
  loadCourses, 
  saveCourses, 
  loadStudentState, 
  saveStudentState, 
  updateStudentExamScore,
  getCatalog,
  getOrSynthesizeCourse,
  logStudentActivity,
  getAdminAuditData
} from './services/courseEngine.js';
import { extractTextFromFile, synthesizeCurriculumFromText } from './services/documentParser.js';
import { evaluateStudentWriting, evaluateSincerityResponse } from './services/aiEvaluator.js';
import { getMatchingVideoLecture } from './services/videoLectureMatcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 30 * 1024 * 1024 } });

// --- REST API Endpoints ---

// 0. Get entire 24-domain categorized Course Catalog
app.get('/api/catalog', (req, res) => {
  const catalog = getCatalog();
  res.json({ status: 'success', ...catalog });
});

// 1. Get all saved/active courses
app.get('/api/courses', (req, res) => {
  const courses = loadCourses();
  res.json({ status: 'success', courses });
});

// 2. Get specific course by ID
app.get('/api/courses/:id', (req, res) => {
  const courses = loadCourses();
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ status: 'error', message: 'Course not found' });
  }
  res.json({ status: 'success', course });
});

// 2b. Structure & Elaborately Teach clicked course
app.post('/api/courses/structure-and-teach', (req, res) => {
  const { courseId, courseTitle, domain } = req.body;
  if (!courseId && !courseTitle) {
    return res.status(400).json({ status: 'error', message: 'courseId or courseTitle is required' });
  }

  const result = getOrSynthesizeCourse(courseId || courseTitle, domain);
  res.json({
    status: 'success',
    course: result.course,
    wasNewlySynthesized: result.wasNewlySynthesized,
    message: result.wasNewlySynthesized 
      ? `AI has successfully structured the 3-tier master curriculum for ${result.course.title}!`
      : `Loaded curriculum for ${result.course.title}`
  });
});

// 3. Generate new course from custom topic prompt
app.post('/api/courses/generate', (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ status: 'error', message: 'Topic is required' });
  }
  const synthesized = synthesizeCurriculumFromText(`Comprehensive Guide and Principles for ${topic}.\nModule 1 explains foundations and terminology.\nModule 2 explains system architecture and implementation trade-offs.\nModule 3 covers production optimization, scale, and fault tolerance.`, topic);
  const courses = loadCourses();
  courses.push(synthesized);
  saveCourses(courses);
  res.json({ status: 'success', course: synthesized });
});


// 4. Ingest document (PDF, Word, Excel, TXT) and build 3-tier curriculum
app.post('/api/courses/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    // Extract text from uploaded document
    const extractedText = await extractTextFromFile(filePath, originalName);

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Could not extract sufficient text from the uploaded document.' 
      });
    }

    // Synthesize structured syllabus across Basics, Advanced, Expert
    const course = synthesizeCurriculumFromText(extractedText, originalName);

    // Save into courses catalog
    const courses = loadCourses();
    courses.unshift(course);
    saveCourses(courses);

    // Clean up temporary file
    fs.unlink(filePath, () => {});

    res.json({
      status: 'success',
      message: 'Course material parsed and structured across 3 tiers successfully!',
      course
    });
  } catch (err) {
    console.error('File upload & parsing error:', err);
    res.status(500).json({ status: 'error', message: err.message || 'File processing failed' });
  }
});

// 5. Get current student state and leaderboard
app.get('/api/student', (req, res) => {
  const state = loadStudentState();
  res.json({ status: 'success', ...state });
});

// 6. Sincerity and attention check endpoint
app.post('/api/student/sincerity-check', (req, res) => {
  const { question, student_answer, expected_keywords } = req.body;
  const result = evaluateSincerityResponse(question, student_answer, expected_keywords);

  logStudentActivity({
    type: result.passed ? 'SINCERITY_CHECK_PASSED' : 'SINCERITY_CHECK_FAILED',
    question,
    student_answer,
    passed: result.passed,
    details: result.reason
  });

  res.json({ status: 'success', ...result });
});

// 6b. Generic student telemetry & section step log endpoint
app.post('/api/student/activity-log', (req, res) => {
  const { eventType, details, courseTitle, moduleTitle, sectionIndex } = req.body;
  const logged = logStudentActivity({
    type: eventType || 'STUDENT_ACTIVITY',
    course_title: courseTitle,
    module_title: moduleTitle,
    section_index: sectionIndex,
    details: details || 'Student performed an action.'
  });
  res.json({ status: 'success', log: logged });
});

// 7. Submit daily exam (objective + descriptive writing with AI rubric)
app.post('/api/student/submit-exam', (req, res) => {
  const { 
    module_id, 
    module_title, 
    objective_answers, 
    writing_submission 
  } = req.body;

  // Grade descriptive writing if present
  let writingEvaluation = null;
  if (writing_submission && writing_submission.student_answer) {
    writingEvaluation = evaluateStudentWriting({
      question: writing_submission.question,
      markWeight: writing_submission.mark_weight || 5,
      answerKey: writing_submission.answer_key,
      essentialKeywords: writing_submission.essential_keywords || [],
      studentAnswer: writing_submission.student_answer
    });
  }

  // Calculate overall percentage
  const objPct = objective_answers ? (objective_answers.score / objective_answers.total) * 100 : 80;
  const writePct = writingEvaluation ? writingEvaluation.percentage : 80;
  const totalPercentage = Math.round((objPct * 0.5) + (writePct * 0.5));

  const examResult = {
    module_id,
    module_title: module_title || 'Module Assessment',
    objective_score: objPct,
    writing_score: writingEvaluation ? writingEvaluation.assigned_score : 0,
    max_writing_score: writingEvaluation ? writingEvaluation.max_score : 5,
    total_percentage: totalPercentage,
    ai_feedback: writingEvaluation 
      ? writingEvaluation.constructive_feedback 
      : 'Good effort on this assessment!',
    writing_evaluation: writingEvaluation,
    status: totalPercentage >= 60 ? 'passed' : 'needs_revision'
  };

  const updatedState = updateStudentExamScore(examResult);

  // Secretly record exam performance in audit logs
  logStudentActivity({
    type: 'DAILY_EXAM_SUBMITTED',
    module_id,
    module_title: module_title || 'Module Assessment',
    total_percentage: totalPercentage,
    objective_score: objPct,
    writing_score: writingEvaluation ? writingEvaluation.assigned_score : 0,
    max_writing_score: writingEvaluation ? writingEvaluation.max_score : 5,
    ai_feedback: examResult.ai_feedback,
    status: examResult.status
  });

  res.json({
    status: 'success',
    exam_result: examResult,
    writing_evaluation: writingEvaluation,
    user: updatedState.user,
    leaderboard: updatedState.leaderboard,
    gained_xp: updatedState.gainedXP
  });
});

// 8. Secret Admin Audit & Student Telemetry Portal (Password: 3791552)
app.post('/api/admin/verify-and-logs', (req, res) => {
  const { password } = req.body;
  const result = getAdminAuditData(password);
  if (!result.authorized) {
    return res.status(401).json({ status: 'error', message: result.message });
  }
  res.json({ status: 'success', ...result });
});

// 9. Log Student Learning Telemetry / Step Transitions
app.post('/api/student/activity-log', (req, res) => {
  const { eventType, details, courseTitle, moduleTitle, sectionIndex } = req.body;
  const recorded = logStudentActivity({
    type: eventType || 'STUDENT_ACTIVITY',
    details,
    courseTitle,
    moduleTitle,
    sectionIndex,
    timestamp: new Date().toISOString()
  });
  res.json({ status: 'success', success: true, recorded });
});

// 10. Fetch Video Lecture, AI Listener Summary & 10-Question Quiz
app.post('/api/courses/video-lecture-content', async (req, res) => {
  try {
    const { courseId, courseTitle, domain, sectionIndex = 0 } = req.body;
    const courseResult = getOrSynthesizeCourse(courseId || courseTitle, domain);
    const course = courseResult.course;
    const mod = course.tiers?.basics?.[0];
    const sec = mod?.sections?.[sectionIndex] || mod?.sections?.[0];

    const titleToMatch = course.title || courseTitle;
    const domainToMatch = domain || course.domain || '';
    const matchedVideo = await getMatchingVideoLecture(titleToMatch, domainToMatch, sectionIndex);

    // Attach dynamically matched video to current section & module
    if (sec) sec.video_lecture = matchedVideo;
    if (mod) mod.video_lecture = matchedVideo;
    course.video_lecture = matchedVideo;

    res.json({
      status: 'success',
      video_lecture: matchedVideo,
      ai_lecture_summary: sec?.ai_lecture_summary || mod?.ai_lecture_summary || course.ai_lecture_summary,
      video_quiz: sec?.video_quiz || mod?.video_quiz || course.video_quiz,
      courseTitle: course.title,
      sectionTitle: sec?.title || mod?.title
    });
  } catch (err) {
    console.error('Error in /api/courses/video-lecture-content:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 11. Submit Video Quiz Results (80% qualifying score)
app.post('/api/student/video-quiz-result', (req, res) => {
  const { courseTitle, moduleTitle, sectionIndex, score, percentage, passed, totalQuestions = 10 } = req.body;

  logStudentActivity({
    type: passed ? 'VIDEO_LECTURE_QUALIFIED' : 'VIDEO_LECTURE_NOT_QUALIFIED',
    courseTitle,
    moduleTitle,
    sectionIndex,
    score,
    percentage,
    passed,
    details: passed 
      ? `Student scored ${percentage}% on 10-question video quiz (>= 80%). QUALIFIED to advance to next level.` 
      : `Student scored ${percentage}% on 10-question video quiz (< 80%). NOT QUALIFIED. Repeating lesson.`
  });

  if (passed) {
    const state = loadStudentState();
    state.currentUser.total_xp = (state.currentUser.total_xp || 0) + 35;
    saveStudentState(state);
  }

  res.json({
    status: 'success',
    passed,
    percentage,
    message: passed 
      ? `Congratulations! You scored ${percentage}% and unlocked the next level.`
      : 'You are not qualified. Repeat the same lesson please.'
  });
});


// --- WebSocket Real-Time Tutoring & Interruption Engine ---
wss.on('connection', (ws) => {
  console.log('Client connected to AI Tutor WebSocket');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'start_lesson') {
        const { module } = data;
        // Broadcast ready state
        ws.send(JSON.stringify({
          type: 'lesson_started',
          module_id: module.id,
          speech_ssml: module.speech_ssml,
          whiteboard_commands: module.whiteboard_commands
        }));
      } else if (data.type === 'interrupt') {
        const { question, current_concept } = data;
        // AI Teacher answers the sudden question immediately
        const clarification = `That is an insightful question regarding ${current_concept || 'this concept'}! Let me illustrate the answer on the board:`;
        ws.send(JSON.stringify({
          type: 'interruption_response',
          clarification_text: `${clarification} When analyzing this, remember that the invariant must hold across all execution branches.`,
          whiteboard_update: {
            action: 'draw_clarification_box',
            label: `Clarification: ${question.slice(0, 30)}...`,
            note: 'Answers student question directly'
          }
        }));
      } else if (data.type === 'request_analogy') {
        const { level, module } = data;
        const analogies = module.analogies || [];
        const selected = analogies.find(a => a.level === level) || analogies[0];
        ws.send(JSON.stringify({
          type: 'analogy_response',
          analogy: selected
        }));
      }
    } catch (e) {
      console.error('WS message error:', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from AI Tutor WebSocket');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`AI Personal Tutor Backend running at http://localhost:${PORT}`);
});
