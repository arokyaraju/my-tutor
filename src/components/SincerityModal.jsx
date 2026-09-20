import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, Send, Sparkles } from 'lucide-react';
import { verifySincerityCheck } from '../services/api';

export default function SincerityModal({
  isOpen,
  breachReason,
  checkpoint,
  onResolve
}) {
  if (!isOpen) return null;

  const [studentAnswer, setStudentAnswer] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const defaultQuestion = checkpoint?.question || 
    "Before we continue to the next section, explain in your own words the key concept Dr. Nova just covered.";
  const expectedKeywords = checkpoint?.expected_keywords || ["complexity", "asymptotic", "memory", "invariant"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const res = await verifySincerityCheck(defaultQuestion, studentAnswer, expectedKeywords);
      if (res.passed) {
        onResolve(true);
      } else {
        setErrorMessage(res.reason || "AI Evaluation: Answer was too brief or missed the core concept. Please elaborate!");
      }
    } catch (err) {
      // Fallback local verification
      if (studentAnswer.trim().length > 15) {
        onResolve(true);
      } else {
        setErrorMessage("Please provide a more detailed sentence explaining what you just learned.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 13, 22, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel-glow attention-lock-active" style={{
        maxWidth: '560px',
        width: '100%',
        borderRadius: '18px',
        border: '2px solid #ef4444',
        padding: '28px',
        background: 'rgba(17, 24, 39, 0.95)',
        boxShadow: '0 20px 50px rgba(239, 68, 68, 0.3)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={26} color="#ef4444" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171', letterSpacing: '0.02em' }}>
              ATTENTION LOCK TRIGGERED
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {breachReason === 'user_switched_tabs' 
                ? 'Lesson paused because you switched tabs or minimized the active window.'
                : 'Lesson paused due to prolonged input inactivity.'}
            </p>
          </div>
        </div>

        {/* Cold Call Challenge Question Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Sparkles size={13} />
            Dr. Nova's Sincerity Check:
          </div>
          <p style={{ fontSize: '0.94rem', color: '#ffffff', fontWeight: 600, lineHeight: 1.5 }}>
            {defaultQuestion}
          </p>
        </div>

        {/* Answer input */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <textarea
              rows={4}
              placeholder="Type your explanation here to verify your sincerity and unlock the lesson..."
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              style={{
                width: '100%',
                fontSize: '0.92rem',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#ffffff'
              }}
            />
          </div>

          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.84rem',
              marginBottom: '14px'
            }}>
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={isVerifying || !studentAnswer.trim()}
              className="btn btn-danger"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              {isVerifying ? (
                <span>Evaluating Sincerity Score...</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={17} /> Verify Comprehension & Resume
                </span>
              )}
            </button>
          </div>
        </form>

        <p style={{ fontSize: '0.74rem', color: '#64748b', textAlign: 'center', marginTop: '12px' }}>
          MyTutor Sincerity Engine guarantees deep retention by preventing passive listening.
        </p>

      </div>
    </div>
  );
}
