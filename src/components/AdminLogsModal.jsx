import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Clock, 
  User, 
  Award, 
  Activity, 
  RefreshCw, 
  X, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Terminal,
  Download
} from 'lucide-react';
import { fetchAdminLogs } from '../services/api';

export default function AdminLogsModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'sincerity' | 'exams' | 'student'
  const [searchFilter, setSearchFilter] = useState('');

  // Handle password submission
  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!password) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchAdminLogs(password);
      setAdminData(data);
      setIsAuthenticated(true);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!password) return;
    setIsLoading(true);
    try {
      const data = await fetchAdminLogs(password);
      setAdminData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const logs = adminData?.logs || [];
  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchFilter.trim() || 
      JSON.stringify(log).toLowerCase().includes(searchFilter.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'sincerity') return matchesSearch && (log.type?.includes('SINCERITY') || log.type?.includes('AFK') || log.type?.includes('ATTENTION'));
    if (activeTab === 'exams') return matchesSearch && (log.type?.includes('EXAM'));
    if (activeTab === 'lessons') return matchesSearch && (log.type?.includes('LESSON') || log.type?.includes('SECTION'));
    return matchesSearch;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 13, 0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '960px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.25)'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
            }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Instructor Confidential Telemetry Portal
                </h3>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700 }}>
                  TOP SECRET AUDIT
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                Discrete surveillance of student sincerity breaches, lesson section pacing, and AI examination rubrics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '6px', borderRadius: '8px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Lock size={32} color="#ef4444" />
            </div>

            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Administrator Authorization Required
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', maxWidth: '440px', marginBottom: '24px' }}>
              Please enter the 7-digit administrative security passkey to decrypt and view live student telemetry logs.
            </p>

            <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="password"
                placeholder="Enter secret admin key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                style={{
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  letterSpacing: '0.15em',
                  padding: '12px',
                  borderRadius: '10px'
                }}
              />

              {errorMsg && (
                <div style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginTop: '6px' }}
              >
                <Unlock size={16} />
                {isLoading ? 'Verifying Credentials...' : 'Authenticate & Unlock Telemetry'}
              </button>

              <button
                type="button"
                onClick={() => { setPassword('3791552'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: '4px'
                }}
              >
                Auto-fill Admin Passcode (3791552)
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            
            {/* Top Stat Pills Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              padding: '16px 24px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STUDENT PROFILE</span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {adminData?.student?.name || 'Alex Mercer'}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#818cf8' }}>XP: {adminData?.student?.total_xp || 1850}</span>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL LOG EVENTS</span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  {adminData?.totalLogsCount || logs.length} Records
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Surveillance active</span>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>EXAMS TAKEN</span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                  {(adminData?.student?.exam_history || []).length} Submitted
                </div>
                <span style={{ fontSize: '0.72rem', color: '#10b981' }}>Pass Rate: 100%</span>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>CATALOG DEPLOYMENT</span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  24 Domains (164 Subjects)
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>3-tier active engine</span>
              </div>
            </div>

            {/* Filter and Tab controls */}
            <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'all', label: 'All Telemetry' },
                  { id: 'sincerity', label: 'Sincerity & Attention' },
                  { id: 'exams', label: 'Exams & Rubrics' },
                  { id: 'lessons', label: 'Lesson Steps' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Filter logs..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{ padding: '6px 10px 6px 30px', fontSize: '0.78rem', borderRadius: '6px' }}
                  />
                </div>

                <button
                  onClick={handleRefresh}
                  className="btn btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.76rem' }}
                  title="Refresh Telemetry"
                >
                  <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
                </button>
              </div>
            </div>

            {/* Log Stream List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '0.88rem' }}>
                  No telemetry logs matching criteria.
                </div>
              ) : (
                filteredLogs.map(log => {
                  const isBreach = log.type?.includes('FAIL') || log.type?.includes('BREACH');
                  const isExam = log.type?.includes('EXAM');
                  const isLesson = log.type?.includes('SECTION') || log.type?.includes('LESSON');

                  return (
                    <div
                      key={log.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: isBreach ? 'rgba(239, 68, 68, 0.08)' : isExam ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.65)',
                        border: isBreach ? '1px solid rgba(239, 68, 68, 0.3)' : isExam ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: isBreach ? '#ef4444' : isExam ? '#f59e0b' : '#3b82f6',
                            color: '#ffffff'
                          }}>
                            {log.type}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: '#e2e8f0', fontWeight: 600 }}>
                            {log.course_title || log.module_title || log.student_name || 'System Telemetry'}
                          </span>
                        </div>

                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'JetBrains Mono' }}>
                          <Clock size={12} /> {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                        {log.details || log.ai_feedback || JSON.stringify(log)}
                      </p>

                      {log.total_percentage !== undefined && (
                        <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                          <span>Total Score: <strong style={{ color: '#10b981' }}>{log.total_percentage}%</strong></span>
                          <span>Objective: <strong>{log.objective_score}%</strong></span>
                          <span>Descriptive Writing: <strong>{log.writing_score}/{log.max_writing_score}</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
