import React, { useState } from 'react';
import { RefreshCw, Lightbulb, Compass, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AnalogyRemediation({
  analogies = [],
  onSelectAnalogy,
  activeLevel = 1,
  onUnderstood
}) {
  const [currentLevel, setCurrentLevel] = useState(activeLevel);

  const handleLevelChange = (lvl) => {
    setCurrentLevel(lvl);
    const selected = analogies.find(a => a.level === lvl);
    if (selected && onSelectAnalogy) {
      onSelectAnalogy(selected);
    }
  };

  const activeAnalogy = analogies.find(a => a.level === currentLevel) || analogies[0];

  return (
    <div className="glass-panel" style={{ padding: '18px', marginTop: '16px' }}>
      
      {/* Header with "Infinite Analogy Loop" Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lightbulb size={16} color="#f59e0b" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff' }}>
              Adaptive "Infinite Analogy" Loop
            </h4>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Still confused? Dr. Nova shifts teaching angles until you achieve 100% clarity.
            </p>
          </div>
        </div>

        <button
          onClick={onUnderstood}
          className="btn btn-success"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <CheckCircle2 size={15} />
          I Get It Now!
        </button>
      </div>

      {/* 4-Level Step Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '16px'
      }}>
        {[
          { lvl: 1, name: 'L1: Academic', desc: 'Formal Math & Invariants' },
          { lvl: 2, name: 'L2: Real-World', desc: 'Everyday Analogies' },
          { lvl: 3, name: 'L3: ELI5', desc: 'Extreme Simplicity' },
          { lvl: 4, name: 'L4: Step-by-Step', desc: 'Interactive Walkthrough' }
        ].map(item => (
          <button
            key={item.lvl}
            onClick={() => handleLevelChange(item.lvl)}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: currentLevel === item.lvl ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
              background: currentLevel === item.lvl ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: currentLevel === item.lvl ? '#ffffff' : '#94a3b8',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: currentLevel === item.lvl ? '#818cf8' : '#e2e8f0' }}>
              {item.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
              {item.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Active Analogy Card */}
      {activeAnalogy && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
              {activeAnalogy.type}
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
              "{activeAnalogy.title}"
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {activeAnalogy.content}
          </p>

          {activeAnalogy.formula && (
            <div style={{
              marginTop: '6px',
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '6px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.86rem',
              color: '#38bdf8'
            }}>
              {activeAnalogy.formula}
            </div>
          )}
        </div>
      )}

      {/* Quick Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button
          onClick={() => handleLevelChange(currentLevel < 4 ? currentLevel + 1 : 1)}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <RefreshCw size={14} />
          {currentLevel < 4 ? 'Try Simpler Analogy' : 'Cycle Back to Concept'}
        </button>
      </div>

    </div>
  );
}
