import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Award, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  Sparkles,
  Layers,
  GraduationCap,
  SlidersHorizontal,
  Flame,
  Zap,
  Loader2
} from 'lucide-react';

export default function CourseCatalog({
  catalogDomains = [],
  courses = [],
  activeCourseId,
  onSelectCourse,
  activeModuleId,
  onSelectModule,
  completedModules = [],
  onGenerateCustomTopic,
  onStructureAndTeachCourse,
  structuringCourseId = null
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all'); // 'all' | 'basics' | 'advanced' | 'expert'
  const [customTopic, setCustomTopic] = useState('');
  const [isCustomGenerating, setIsCustomGenerating] = useState(false);

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    setIsCustomGenerating(true);
    try {
      await onGenerateCustomTopic(customTopic.trim());
      setCustomTopic('');
    } finally {
      setIsCustomGenerating(false);
    }
  };

  // Build a unified view of all courses across 24 domains
  const displayedDomains = useMemo(() => {
    if (!catalogDomains || catalogDomains.length === 0) return [];

    return catalogDomains
      .filter(domain => selectedDomainId === 'all' || domain.id === selectedDomainId)
      .map(domain => {
        const matchingCourses = domain.courses.filter(c => {
          const matchQuery = !searchQuery.trim() || 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.focus && c.focus.toLowerCase().includes(searchQuery.toLowerCase())) ||
            domain.name.toLowerCase().includes(searchQuery.toLowerCase());
          return matchQuery;
        });

        return {
          ...domain,
          courses: matchingCourses
        };
      })
      .filter(domain => domain.courses.length > 0);
  }, [catalogDomains, selectedDomainId, searchQuery]);

  const totalMatchingCourses = displayedDomains.reduce((acc, d) => acc + d.courses.length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Top Banner: Master 24-Domain Curriculum Hub */}
      <div className="glass-panel" style={{ padding: '22px' }}>
        
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.4rem' }}>🏛️</span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Master Academic & Industry Curriculum Directory (24 Disciplines)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
              Click any subject below — the AI will synthesize the 3-tier master syllabus (Basics, Advanced, Expert) and begin elaborately teaching with live speech and interactive whiteboard drawings.
            </p>
          </div>

          {/* Quick Custom Topic Generator */}
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px', minWidth: '320px', flex: '1 1 320px', maxWidth: '440px' }}>
            <input
              type="text"
              placeholder="Or enter any custom subject to synthesize..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '9px 14px', flex: 1 }}
            />
            <button
              type="submit"
              disabled={isCustomGenerating || !customTopic.trim()}
              className="btn btn-primary"
              style={{ padding: '9px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              <Sparkles size={14} />
              {isCustomGenerating ? 'Synthesizing...' : 'Build Syllabus'}
            </button>
          </form>
        </div>

        {/* Search & Domain Filter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search across all 150+ specialized subjects, keywords, or governing theories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                fontSize: '0.88rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Domain Category Pills Carousel / Scrollable Row */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'thin'
          }}>
            <button
              onClick={() => setSelectedDomainId('all')}
              className={`btn ${selectedDomainId === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                fontSize: '0.78rem',
                padding: '7px 14px',
                whiteSpace: 'nowrap',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🌐</span>
              All Domains (150+ Courses)
            </button>

            {catalogDomains.map(domain => {
              const isSelected = selectedDomainId === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomainId(domain.id)}
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '0.78rem',
                    padding: '7px 14px',
                    whiteSpace: 'nowrap',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-subtle)'
                  }}
                >
                  <span>{domain.emoji}</span>
                  <span>{domain.shortName || domain.name}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    {domain.courses.length}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Showing <strong style={{ color: '#ffffff' }}>{totalMatchingCourses}</strong> subjects across <strong style={{ color: '#ffffff' }}>{displayedDomains.length}</strong> discipline categories
          </span>
          {activeCourse && (
            <span style={{ fontSize: '0.76rem', color: '#818cf8', fontWeight: 600 }}>
              Currently Active: {activeCourse.title}
            </span>
          )}
        </div>

        {/* Domain Sections & Course Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Featured Ingested Document Curriculums (e.g. Sunil Gavaskar & uploaded files) */}
          {courses && courses.filter(c => c.id === 'course-lesson1-sunil-gavaskar' || c.id?.startsWith('course-custom') || c.id?.startsWith('course-uploaded') || c.title?.includes('Sunil Gavaskar')).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
                borderLeft: '4px solid #10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.4rem' }}>⭐</span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Featured & Uploaded Lesson Material
                      <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#090d16', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>READY</span>
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0 }}>
                      Authentic 3-tier master curriculum grounded directly in uploaded documents, literature chapters, and study guides.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '14px'
              }}>
                {courses.filter(c => c.id === 'course-lesson1-sunil-gavaskar' || c.id?.startsWith('course-custom') || c.id?.startsWith('course-uploaded') || c.title?.includes('Sunil Gavaskar')).map(course => {
                  const isCurrentActive = activeCourse && (activeCourse.id === course.id || activeCourse.title === course.title);
                  return (
                    <div
                      key={course.id}
                      onClick={() => onSelectCourse(course.id)}
                      style={{
                        padding: '18px',
                        borderRadius: '14px',
                        background: isCurrentActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(15, 23, 42, 0.8)',
                        border: isCurrentActive ? '1px solid #10b981' : '1px solid rgba(16, 185, 129, 0.25)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        boxShadow: isCurrentActive ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 9px',
                            borderRadius: '6px',
                            background: 'rgba(16, 185, 129, 0.25)',
                            color: '#34d399'
                          }}>
                            {course.domain || 'Languages & Literature'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {course.total_estimated_hours || 12}h Masterclass
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px', lineHeight: 1.35 }}>
                          {course.title}
                        </h4>
                        <p style={{
                          fontSize: '0.78rem',
                          color: '#94a3b8',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {course.scope_summary || 'Authentic curriculum with multi-tier examination syllabus and video lecture.'}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '12px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: isCurrentActive ? '#10b981' : '#64748b', fontWeight: 700 }}>
                          {isCurrentActive ? <><CheckCircle2 size={14} /> Active in Classroom</> : 'Ready to Learn'}
                        </span>
                        <button
                          className={isCurrentActive ? "btn btn-primary" : "btn btn-secondary"}
                          style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
                        >
                          <Sparkles size={13} />
                          {isCurrentActive ? 'Resume Classroom' : 'Launch Syllabus'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {displayedDomains.map(domain => (
            <div key={domain.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Category Section Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderLeft: `4px solid ${domain.accentColor || '#6366f1'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.25rem' }}>{domain.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {domain.name}
                    </h3>
                    <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
                      {domain.description}
                    </p>
                  </div>
                </div>

                <span style={{ fontSize: '0.72rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.06)', padding: '3px 9px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                  {domain.courses.length} courses
                </span>
              </div>

              {/* Course Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '12px'
              }}>
                {domain.courses.map(course => {
                  const isCurrentActive = activeCourse && (
                    activeCourse.id === course.id || 
                    activeCourse.id === `course-${course.id}` || 
                    activeCourse.title.toLowerCase() === course.title.toLowerCase()
                  );
                  const isStructuringThis = structuringCourseId === course.id || structuringCourseId === course.title;

                  return (
                    <div
                      key={course.id}
                      onClick={() => onStructureAndTeachCourse(course, domain.name)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: isCurrentActive ? 'rgba(99, 102, 241, 0.16)' : 'rgba(15, 23, 42, 0.65)',
                        border: isCurrentActive ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = domain.accentColor || '#6366f1';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = isCurrentActive ? '#6366f1' : 'var(--border-subtle)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div>
                        {/* Card Tag & Hours */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: isCurrentActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                            color: isCurrentActive ? '#818cf8' : '#94a3b8'
                          }}>
                            {domain.shortName || domain.name}
                          </span>

                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> 36h Master
                          </span>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px', lineHeight: 1.35 }}>
                          {course.title}
                        </h4>

                        {/* Focus description */}
                        {course.focus && (
                          <p style={{
                            fontSize: '0.76rem',
                            color: '#94a3b8',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {course.focus}
                          </p>
                        )}
                      </div>

                      {/* Action Button & Status Bar */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '10px'
                      }}>
                        {isStructuringThis ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#818cf8', fontWeight: 600 }}>
                            <Loader2 size={13} className="spin" /> Structuring Curriculum...
                          </span>
                        ) : isCurrentActive ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
                            <CheckCircle2 size={13} /> Active in Classroom
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            3-Tier Syllabus Ready
                          </span>
                        )}

                        <button
                          className={isCurrentActive ? "btn btn-primary" : "btn btn-secondary"}
                          style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Sparkles size={12} />
                          {isCurrentActive ? 'Resume' : 'Teach Course'}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Scope Breakdown & 3-Tier Roadmap for the currently selected Course */}
      {activeCourse && (
        <div className="glass-panel" style={{ padding: '22px' }}>
          
          {/* Active Course Scope Header */}
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Layers size={22} color="#6366f1" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {activeCourse.title} — 3-Tier Syllabus Roadmap
              </h3>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.5 }}>
              {activeCourse.scope_summary}
            </p>

            {/* Prerequisites */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>PREREQUISITES:</span>
              {(activeCourse.prerequisites || []).map((prereq, idx) => (
                <span key={idx} style={{
                  fontSize: '0.72rem',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#e2e8f0',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {prereq}
                </span>
              ))}
            </div>
          </div>

          {/* Tier Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            {['all', 'basics', 'advanced', 'expert'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`btn ${selectedTier === t ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem', textTransform: 'capitalize' }}
              >
                {t === 'all' ? 'All Tiers' : `${t} Tier`}
              </button>
            ))}
          </div>

          {/* Tiered Module Roadmaps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {['basics', 'advanced', 'expert'].map(tierName => {
              if (selectedTier !== 'all' && selectedTier !== tierName) return null;

              const modules = activeCourse.tiers?.[tierName] || [];
              if (modules.length === 0) return null;

              return (
                <div key={tierName} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge badge-${tierName}`}>
                      {tierName} Tier
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {tierName === 'basics' ? 'Core terminology, axioms, formulas & 1-2 mark questions' :
                       tierName === 'advanced' ? 'Architecture, dynamics, trade-off matrices & 5-mark questions' :
                       'Master failure analysis, phase transitions & 10-mark blueprints'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                    {modules.map(mod => {
                      const isActive = mod.id === activeModuleId;
                      const isCompleted = completedModules.includes(mod.id);

                      return (
                        <div
                          key={mod.id}
                          onClick={() => onSelectModule(mod)}
                          style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                            border: isActive ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> {mod.estimated_minutes} mins
                              </span>
                              {isCompleted ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.74rem', fontWeight: 700 }}>
                                  <CheckCircle2 size={13} /> Completed
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>In Progress</span>
                              )}
                            </div>

                            <h5 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px', lineHeight: 1.35 }}>
                              {mod.title}
                            </h5>

                            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                              {mod.summary}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 600 }}>
                              {mod.questions_1_mark?.length || 1}x 1M • {mod.questions_2_mark?.length || 1}x 2M • {mod.questions_5_mark?.length || 1}x 5M • {mod.questions_10_mark?.length || 1}x 10M
                            </span>

                            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.76rem' }}>
                              Launch Lesson <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
