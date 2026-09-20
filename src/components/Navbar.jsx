import React from 'react';
import { 
  GraduationCap, 
  Flame, 
  Trophy, 
  BookOpen, 
  FileText, 
  PenTool, 
  Terminal, 
  UploadCloud, 
  ShieldAlert,
  Sparkles,
  Lock
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  student,
  activeCourse,
  activeModule,
  onOpenUpload,
  fastDemoMode,
  setFastDemoMode,
  onOpenAdmin
}) {
  const currentRank = 4; // Alex Mercer

  return (
    <header className="glass-panel" style={{ margin: '14px 20px 24px', padding: '12px 24px', position: 'sticky', top: '12px', zIndex: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Active Course Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}>
              <GraduationCap size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>MyTutor</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 700 }}>AI PRO</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {activeCourse ? activeCourse.title : 'Personal Adaptive Tutor'}
              </p>
            </div>
          </div>

          {activeModule && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '14px', borderLeft: '1px solid var(--border-subtle)' }}>
              <span className={`badge badge-${activeModule.tier}`}>
                {activeModule.tier}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600, maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeModule.title}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('courses')}
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          >
            <GraduationCap size={17} />
            Courses (24 Domains)
          </button>

          <button
            onClick={() => setActiveTab('classroom')}
            className={`tab-btn ${activeTab === 'classroom' ? 'active' : ''}`}
          >
            <BookOpen size={17} />
            Classroom & Canvas
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          >
            <FileText size={17} />
            Notes & 1/2/5/10 Qs
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`tab-btn ${activeTab === 'exam' ? 'active' : ''}`}
          >
            <PenTool size={17} />
            Daily Exam
          </button>

          {activeModule?.tier === 'expert' && (
            <button
              onClick={() => setActiveTab('code')}
              className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            >
              <Terminal size={17} />
              Expert Sandbox
            </button>
          )}

          <button
            onClick={() => setActiveTab('progress')}
            className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          >
            <Trophy size={17} />
            Leaderboard
          </button>
        </nav>

        {/* Actions & Student Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onOpenUpload}
            className="btn btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.84rem' }}
            title="Upload custom PDF, Word, Excel or Text to generate 3-tier course"
          >
            <UploadCloud size={16} />
            Upload File
          </button>

          {/* Quick Demo Mode Toggle for Inactivity */}
          <button
            onClick={() => setFastDemoMode(!fastDemoMode)}
            style={{
              padding: '6px 10px',
              fontSize: '0.74rem',
              borderRadius: '6px',
              border: fastDemoMode ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
              background: fastDemoMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: fastDemoMode ? '#f87171' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Toggles sincerity AFK trigger from 3 mins down to 15 secs for quick evaluation"
          >
            <ShieldAlert size={14} />
            {fastDemoMode ? '15s AFK Test (ON)' : 'AFK Demo (3m)'}
          </button>

          {/* User XP & Streak Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '5px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem' }}>
              <Flame size={16} fill="#f59e0b" />
              <span>{student?.current_streak_days || 6}d</span>
            </div>
            <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={15} color="#6366f1" />
              <span style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.88rem' }}>
                {student?.total_xp || 1850} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>XP</span>
              </span>
            </div>
          </div>

          {/* Discreet Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              opacity: 0.65
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.opacity = '0.65'; }}
            title="Administrator Inspection (Secret Access • Shortcut: Ctrl+Shift+A)"
          >
            <Lock size={15} />
          </button>
        </div>

      </div>
    </header>
  );
}
