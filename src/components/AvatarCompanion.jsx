import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Sliders,
  AlertCircle
} from 'lucide-react';

export default function AvatarCompanion({
  isSpeaking,
  mouthOpenRatio,
  speakingEmotion,
  speechRate,
  setSpeechRate,
  voiceList,
  selectedVoice,
  setSelectedVoice,
  onStartSpeech,
  onInterrupt,
  onAskQuestion,
  isListening,
  onVoiceInputToggle,
  attentionLocked
}) {
  const [blink, setBlink] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Natural spontaneous eye blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleSendQuestion = (e) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    onAskQuestion(questionInput.trim());
    setQuestionInput('');
  };

  // SVG parameters based on emotion and mouth movement
  const mouthHeight = Math.max(3, mouthOpenRatio * 22);
  const eyebrowOffset = speakingEmotion === 'warning' ? -4 : speakingEmotion === 'attentive' ? -2 : 0;
  const eyebrowAngle = speakingEmotion === 'warning' ? 12 : speakingEmotion === 'attentive' ? -6 : 0;

  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Speech Wave Glow */}
      {isSpeaking && (
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'speechPulse 1.6s ease-in-out infinite'
        }} />
      )}

      {/* Header with Status & Settings Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', zIndex: 2, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: attentionLocked ? '#ef4444' : isSpeaking ? '#10b981' : isListening ? '#f59e0b' : '#64748b',
            boxShadow: attentionLocked ? '0 0 10px #ef4444' : isSpeaking ? '0 0 10px #10b981' : 'none'
          }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
            {attentionLocked ? 'ATTENTION LOCK' : isSpeaking ? 'Teaching Lesson' : isListening ? 'Listening...' : 'Ready / Standing By'}
          </span>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary"
          style={{ padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
          title="Voice & Speech Settings"
        >
          <Sliders size={15} color="#94a3b8" />
        </button>
      </div>

      {/* Voice & Speech Controls Drawer */}
      {showSettings && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.82rem',
          zIndex: 10,
          position: 'relative'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>Tutor Voice</label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const v = voiceList.find(item => item.name === e.target.value);
                if (v) setSelectedVoice(v);
              }}
              style={{ padding: '6px 10px', fontSize: '0.82rem' }}
            >
              {voiceList.map((v, i) => (
                <option key={i} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '4px' }}>
              <span>Speech Speed</span>
              <span style={{ fontWeight: 700, color: '#6366f1' }}>{speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>
        </div>
      )}

      {/* SVG Realistic Animated Talking Avatar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '230px',
        position: 'relative',
        zIndex: 1
      }}>
        <svg
          viewBox="0 0 240 240"
          style={{
            width: '210px',
            height: '210px',
            filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5))'
          }}
          className={isSpeaking ? "animate-avatar-float" : ""}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="avatarSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbd5b5" />
              <stop offset="100%" stopColor="#f3b88c" />
            </linearGradient>

            <linearGradient id="avatarJacket" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>

            <linearGradient id="avatarShirt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="glassesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Shoulders & Blazer */}
          <path
            d="M 35 240 C 35 185 85 175 120 175 C 155 175 205 185 205 240 Z"
            fill="url(#avatarJacket)"
          />
          {/* Inner Collared Shirt */}
          <polygon points="100,175 120,210 140,175" fill="url(#avatarShirt)" />
          {/* Tie */}
          <polygon points="117,192 123,192 125,235 120,240 115,235" fill="#ec4899" />

          {/* Neck */}
          <rect x="106" y="145" width="28" height="35" rx="6" fill="#e9a478" />

          {/* Head & Face */}
          <ellipse cx="120" cy="115" rx="55" ry="62" fill="url(#avatarSkin)" />

          {/* Hair */}
          <path
            d="M 64 105 C 60 70 85 45 120 45 C 155 45 180 70 176 105 C 165 72 145 62 120 62 C 95 62 75 72 64 105 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M 62 95 C 68 60 100 48 135 50 C 150 51 170 60 178 90 C 168 70 140 64 115 65 C 90 66 75 78 62 95 Z"
            fill="#1e293b"
          />

          {/* Eyebrows (reactive to emotion) */}
          <path
            d={`M 88 ${86 + eyebrowOffset} Q 102 ${82 + eyebrowOffset} 108 ${88 + eyebrowOffset}`}
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            transform={`rotate(${eyebrowAngle}, 98, 86)`}
          />
          <path
            d={`M 132 ${88 + eyebrowOffset} Q 138 ${82 + eyebrowOffset} 152 ${86 + eyebrowOffset}`}
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            transform={`rotate(${-eyebrowAngle}, 142, 86)`}
          />

          {/* Glasses Frame */}
          <rect x="80" y="88" width="34" height="24" rx="8" fill="none" stroke="url(#glassesGrad)" strokeWidth="2.8" />
          <rect x="126" y="88" width="34" height="24" rx="8" fill="none" stroke="url(#glassesGrad)" strokeWidth="2.8" />
          <line x1="114" y1="98" x2="126" y2="98" stroke="url(#glassesGrad)" strokeWidth="2.8" />

          {/* Eyes (Blinking mechanic) */}
          {blink ? (
            <>
              <line x1="88" y1="100" x2="106" y2="100" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="134" y1="100" x2="152" y2="100" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <ellipse cx="97" cy="100" rx="7" ry="5.5" fill="#ffffff" />
              <circle cx="98" cy="100" r="3.6" fill="#1e293b" />
              <circle cx="99.5" cy="98.5" r="1.2" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="143" cy="100" rx="7" ry="5.5" fill="#ffffff" />
              <circle cx="144" cy="100" r="3.6" fill="#1e293b" />
              <circle cx="145.5" cy="98.5" r="1.2" fill="#ffffff" />
            </>
          )}

          {/* Nose */}
          <path d="M 120 108 L 117 122 L 123 122" fill="none" stroke="#d9825b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dynamic Lip-Sync Animated Mouth */}
          {mouthOpenRatio > 0.05 ? (
            <g>
              {/* Open cavity */}
              <ellipse cx="120" cy="142" rx="14" ry={mouthHeight} fill="#7f1d1d" />
              {/* Teeth */}
              <rect x="111" y={142 - mouthHeight * 0.7} width="18" height={Math.min(4, mouthHeight * 0.5)} rx="1" fill="#ffffff" />
              {/* Tongue */}
              {mouthHeight > 8 && (
                <ellipse cx="120" cy={142 + mouthHeight * 0.5} rx="8" ry="4" fill="#f43f5e" />
              )}
            </g>
          ) : (
            /* Closed friendly smile */
            <path d="M 110 141 Q 120 146 130 141" fill="none" stroke="#881337" strokeWidth="2.8" strokeLinecap="round" />
          )}

          {/* Subtle blush */}
          <ellipse cx="82" cy="120" rx="7" ry="4" fill="rgba(244, 63, 94, 0.15)" />
          <ellipse cx="158" cy="120" rx="7" ry="4" fill="rgba(244, 63, 94, 0.15)" />
        </svg>

        {/* Emotion Badge */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          padding: '4px 10px',
          borderRadius: '999px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.74rem',
          fontWeight: 600,
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <Sparkles size={12} color="#6366f1" />
          <span>Dr. Nova • AI Teacher</span>
        </div>
      </div>

      {/* Real-Time Teacher Controls */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Play/Stop Lesson Button */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={onStartSpeech}
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.86rem' }}
          >
            <Volume2 size={16} />
            {isSpeaking ? 'Restart Speech' : 'Teach Lesson'}
          </button>

          <button
            onClick={onInterrupt}
            className="btn btn-danger"
            style={{ width: '100%', fontSize: '0.86rem' }}
            title="Immediately pauses the AI teacher so you can ask a question"
          >
            <VolumeX size={16} />
            Interrupt
          </button>
        </div>

        {/* Ask Question / Interruption Chat Field */}
        <form onSubmit={handleSendQuestion} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            placeholder="Ask Dr. Nova anything mid-lesson..."
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
          />

          <button
            type="button"
            onClick={onVoiceInputToggle}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', background: isListening ? 'rgba(239, 68, 68, 0.2)' : undefined }}
            title="Speak your question verbally via microphone"
          >
            {isListening ? <Mic size={16} color="#ef4444" /> : <Mic size={16} />}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '8px 14px' }}
            disabled={!questionInput.trim()}
          >
            <Send size={15} />
          </button>
        </form>

        <p style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
          Tip: Interrupt at any millisecond to ask for clarification, proofs, or analogies!
        </p>
      </div>

    </div>
  );
}
