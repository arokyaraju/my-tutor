import React from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function ProgressDashboard({
  student,
  leaderboard = [],
  courses = []
}) {
  const user = student || {};
  const mastery = user.tier_mastery || { basics: 60, advanced: 30, expert: 10 };
  const history = user.exam_history || [];

  // Determine what has been covered vs what remains to be covered
  const completedIds = user.completed_modules || [];
  const allModules = [];
  courses.forEach(c => {
    ['basics', 'advanced', 'expert'].forEach(t => {
      (c.tiers[t] || []).forEach(m => {
        allModules.push({ ...m, courseTitle: c.title });
      });
    });
  });

  const coveredModules = allModules.filter(m => completedIds.includes(m.id));
  const remainingModules = allModules.filter(m => !completedIds.includes(m.id));

  // Find user's rank on leaderboard
  const myRankEntry = leaderboard.find(l => l.name.includes(user.name || 'You') || l.name.includes('Alex')) || { rank: 4 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>GLOBAL STANDING</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            Rank #{myRankEntry.rank}
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>of {leaderboard.length} Scholars</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL SKILL POINTS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', marginTop: '6px' }}>
            {user.total_xp || 1850} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>XP</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>AVERAGE EXAM GRADE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
            88.5%
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>SINCERITY & ATTENTION</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
            {user.sincerity_score || 92}%
          </div>
        </div>
      </div>

      {/* Syllabus Progress Report: 3 Mastery Tiers */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#6366f1" />
            3-Tier Syllabus Mastery Roadmap
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Real-time track of topics covered vs. curriculum topics to be mastered.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Basics Level Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, color: '#34d399' }}>🟢 Basics Level (Core Terms & Definitions)</span>
              <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#ffffff' }}>{mastery.basics}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${mastery.basics}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)', borderRadius: '999px', transition: 'width 0.8s ease' }} />
            </div>
          </div>

          {/* Advanced Level Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, color: '#fbbf24' }}>🟡 Advanced Level (Application & Architecture)</span>
              <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#ffffff' }}>{mastery.advanced}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${mastery.advanced}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)', borderRadius: '999px', transition: 'width 0.8s ease' }} />
            </div>
          </div>

          {/* Expert Level Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, color: '#f87171' }}>🔴 Expert Level (Complex Scenarios & Systems Design)</span>
              <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#ffffff' }}>{mastery.expert}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${mastery.expert}%`, height: '100%', background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)', borderRadius: '999px', transition: 'width 0.8s ease' }} />
            </div>
          </div>

        </div>

        {/* Covered vs To Be Covered Modules Split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginTop: '24px' }}>
          
          {/* Covered Modules */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Topics Covered ({coveredModules.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {coveredModules.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px' }}>
                  <span style={{ color: '#e2e8f0' }}>{m.title}</span>
                  <span className={`badge badge-${m.tier}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>{m.tier}</span>
                </div>
              ))}
              {coveredModules.length === 0 && (
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Complete your first lesson exam to add covered topics.</p>
              )}
            </div>
          </div>

          {/* To Be Covered Modules */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> To Be Covered ({remainingModules.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {remainingModules.slice(0, 5).map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>{m.title}</span>
                  <span className={`badge badge-${m.tier}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>{m.tier}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Diagnostics & Leaderboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Exam Assessments History */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
            Recent Academic Assessments
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                      {item.module_title}
                    </h5>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    fontFamily: 'JetBrains Mono',
                    color: item.total_percentage >= 60 ? '#34d399' : '#f87171'
                  }}>
                    {item.total_percentage}%
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, marginTop: '4px' }}>
                  {item.ai_feedback}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Competitor Leaderboard */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color="#f59e0b" />
              Global Competitor Leaderboard
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Live Elo Rankings</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboard.map(lb => {
              const isMe = lb.name.includes(user.name || 'You') || lb.name.includes('Alex');

              return (
                <div
                  key={lb.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: isMe ? 'rgba(99, 102, 241, 0.2)' : lb.rank === 1 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: isMe ? '1px solid #6366f1' : lb.rank === 1 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: lb.rank === 1 ? '#fbbf24' : lb.rank === 2 ? '#e2e8f0' : lb.rank === 3 ? '#d97706' : '#94a3b8'
                    }}>
                      {lb.rank}
                    </span>

                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isMe ? '#818cf8' : '#ffffff' }}>
                        {lb.name}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {lb.badge}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#f59e0b' }}>
                      {lb.xp} <span style={{ fontSize: '0.7rem' }}>XP</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      🔥 {lb.streak}d streak
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
