import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Award, 
  CheckCircle, 
  Copy, 
  Download, 
  BookOpen, 
  ListChecks,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles
} from 'lucide-react';

export default function LessonNotesView({ activeModule, activeCourse }) {
  const [activeQuestionTab, setActiveQuestionTab] = useState('1m'); // '1m' | '2m' | '5m' | '10m' | 'all'
  const [expandedSolutions, setExpandedSolutions] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  if (!activeModule) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Please select a course module from the catalog to review study notes.</p>
      </div>
    );
  }

  const toggleSolution = (id) => {
    setExpandedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const q1 = activeModule.questions_1_mark || [];
  const q2 = activeModule.questions_2_mark || [];
  const q5 = activeModule.questions_5_mark || [];
  const q10 = activeModule.questions_10_mark || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Master Course Syllabus & 'How and WHY' Pedagogical Breakdown */}
      {activeCourse?.course_description && (
        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #6366f1' }}>
          <details style={{ width: '100%' }}>
            <summary style={{
              cursor: 'pointer',
              fontWeight: 700,
              color: '#c7d2fe',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="#818cf8" />
                <span>{activeCourse.title} — Master "How and WHY" Course Syllabus</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#818cf8', fontWeight: 600 }}>
                Expand Syllabus
              </span>
            </summary>
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              whiteSpace: 'pre-line',
              lineHeight: '1.65',
              fontSize: '0.83rem',
              color: '#cbd5e1',
              maxHeight: '320px',
              overflowY: 'auto'
            }}>
              {activeCourse.course_description}
            </div>
          </details>
        </div>
      )}

      {/* Module Overview Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className={`badge badge-${activeModule.tier}`}>{activeModule.tier} Level</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Study Guide & Blueprint</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
              {activeModule.title}
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', marginTop: '4px' }}>
              {activeModule.summary}
            </p>
          </div>

          <button
            onClick={() => {
              const blob = new Blob([`${activeModule.detailed_notes}\n\n# Questions\n` + JSON.stringify({ q1, q2, q5, q10 }, null, 2)], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${activeModule.id}-study-notes.md`;
              a.click();
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <Download size={15} /> Export Markdown Notes
          </button>
        </div>

        {/* Detailed Comprehensive Study Guide Markdown Render */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '20px',
          color: '#e2e8f0',
          fontSize: '0.92rem',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap'
        }}>
          {activeModule.detailed_notes}
        </div>
      </div>

      {/* Sequential Theory Sections (3-4 Steps for Lesson Notes) */}
      {activeModule.sections && activeModule.sections.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#8b5cf6" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  Lesson Theory Breakdown ({activeModule.sections.length} Sequential Steps)
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Curated lecture sections taught sequentially before the daily evaluation exam.
              </p>
            </div>
            <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', fontWeight: 600 }}>
              {activeModule.sections.length} Theory Steps
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeModule.sections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.82rem'
                    }}>
                      {idx + 1}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {sec.title}
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#818cf8', fontWeight: 600, background: 'rgba(99, 102, 241, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                    Section {idx + 1} of {activeModule.sections.length}
                  </span>
                </div>

                {/* Section Notes Content */}
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  {sec.notes_content || sec.speech_ssml?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
                </p>

                {/* Key Takeaways */}
                {sec.key_takeaways && sec.key_takeaways.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}>
                    <div style={{ fontSize: '0.76rem', color: '#a5b4fc', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Key Theory Takeaways:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#e2e8f0', fontSize: '0.84rem', lineHeight: 1.5 }}>
                      {sec.key_takeaways.map((point, pIdx) => (
                        <li key={pIdx} style={{ marginBottom: '3px' }}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Tier Question Blueprint (1, 2, 5, 10 Markers) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListChecks size={20} color="#6366f1" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Multi-Tier Question Blueprints & Marking Rubrics
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Detailed 1, 2, 5, and 10 marker questions with official model solutions, rubrics, and key phrases.
            </p>
          </div>

          {/* Tier Switcher Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: '1m', label: `1-Marker (${q1.length})`, color: '#38bdf8' },
              { id: '2m', label: `2-Marker (${q2.length})`, color: '#34d399' },
              { id: '5m', label: `5-Marker (${q5.length})`, color: '#fbbf24' },
              { id: '10m', label: `10-Marker (${q10.length})`, color: '#f87171' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveQuestionTab(tab.id)}
                className={`btn ${activeQuestionTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Render 1-Marker Questions */}
          {activeQuestionTab === '1m' && q1.map((q, idx) => (
            <QuestionCard
              key={q.id || idx}
              weight={1}
              badgeColor="#38bdf8"
              question={q.question}
              modelAnswer={q.model_answer}
              rubric={q.rubric}
              isExpanded={expandedSolutions[q.id] !== false}
              onToggle={() => toggleSolution(q.id)}
              onCopy={() => copyToClipboard(q.model_answer, q.id)}
              isCopied={copiedId === q.id}
            />
          ))}

          {/* Render 2-Marker Questions */}
          {activeQuestionTab === '2m' && q2.map((q, idx) => (
            <QuestionCard
              key={q.id || idx}
              weight={2}
              badgeColor="#34d399"
              question={q.question}
              modelAnswer={q.model_answer}
              keyPoints={q.key_points}
              rubric={q.rubric}
              isExpanded={expandedSolutions[q.id] !== false}
              onToggle={() => toggleSolution(q.id)}
              onCopy={() => copyToClipboard(q.model_answer, q.id)}
              isCopied={copiedId === q.id}
            />
          ))}

          {/* Render 5-Marker Questions */}
          {activeQuestionTab === '5m' && q5.map((q, idx) => (
            <QuestionCard
              key={q.id || idx}
              weight={5}
              badgeColor="#fbbf24"
              question={q.question}
              modelAnswer={q.model_answer}
              keyPoints={q.key_points}
              rubric={q.rubric}
              isExpanded={expandedSolutions[q.id] !== false}
              onToggle={() => toggleSolution(q.id)}
              onCopy={() => copyToClipboard(q.model_answer, q.id)}
              isCopied={copiedId === q.id}
            />
          ))}

          {/* Render 10-Marker Questions */}
          {activeQuestionTab === '10m' && q10.map((q, idx) => (
            <QuestionCard
              key={q.id || idx}
              weight={10}
              badgeColor="#f87171"
              question={q.question}
              modelAnswer={q.model_answer}
              keyPoints={q.key_points}
              rubric={q.rubric}
              isExpanded={expandedSolutions[q.id] !== false}
              onToggle={() => toggleSolution(q.id)}
              onCopy={() => copyToClipboard(q.model_answer, q.id)}
              isCopied={copiedId === q.id}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

function QuestionCard({
  weight,
  badgeColor,
  question,
  modelAnswer,
  keyPoints,
  rubric,
  isExpanded,
  onToggle,
  onCopy,
  isCopied
}) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      
      {/* Question Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{
            fontSize: '0.74rem',
            padding: '3px 8px',
            borderRadius: '6px',
            background: `${badgeColor}22`,
            color: badgeColor,
            border: `1px solid ${badgeColor}44`,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            marginTop: '2px'
          }}>
            {weight} MARKS
          </span>

          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.4 }}>
            {question}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onCopy}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.74rem' }}
            title="Copy Model Solution"
          >
            <Copy size={13} /> {isCopied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={onToggle}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.74rem' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Solution & Rubric Breakdown */}
      {isExpanded && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(9, 13, 22, 0.4)' }}>
          
          {/* Official Model Solution */}
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckCircle size={14} /> Model Answer / Solution Key:
            </div>
            <div style={{
              background: 'rgba(17, 24, 39, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '14px',
              color: '#f1f5f9',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {modelAnswer}
            </div>
          </div>

          {/* Key Phrases / Points required */}
          {keyPoints && keyPoints.length > 0 && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Required Essential Key Points:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {keyPoints.map((pt, i) => (
                  <span key={i} style={{
                    fontSize: '0.78rem',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#fef3c7'
                  }}>
                    • {pt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Academic Rubric */}
          {rubric && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award size={16} color="#818cf8" />
              <span><strong>Marking Rubric:</strong> {rubric}</span>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
