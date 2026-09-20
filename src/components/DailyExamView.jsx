import React, { useState } from 'react';
import { 
  PenTool, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Send, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  Check, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitExamAnswers } from '../services/api';

export default function DailyExamView({
  activeModule,
  onExamCompleted
}) {
  const examData = activeModule?.daily_exam || {};
  const objectiveList = examData.objective_questions || [];
  const writingList = examData.writing_questions || [];

  // Objective state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [objSubmitted, setObjSubmitted] = useState(false);
  const [objScore, setObjScore] = useState(0);

  // Writing state
  const [writtenAnswers, setWrittenAnswers] = useState({});
  const [isGradingWriting, setIsGradingWriting] = useState(false);
  const [writingEvaluation, setWritingEvaluation] = useState(null);

  // Overall Submission Result
  const [finalResult, setFinalResult] = useState(null);

  if (!activeModule) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Select a lesson to begin your Daily Exam.</p>
      </div>
    );
  }

  // Handle MCQ selection
  const handleSelectOption = (qId, optionIdx) => {
    if (objSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  // Check objective answers
  const handleGradeObjective = () => {
    let correct = 0;
    objectiveList.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_index) {
        correct++;
      }
    });
    setObjScore(correct);
    setObjSubmitted(true);
  };

  // Submit complete exam for full academic AI evaluation
  const handleSubmitFullExam = async () => {
    setIsGradingWriting(true);

    try {
      const firstWriting = writingList[0] || {};
      const studentText = writtenAnswers[firstWriting.id] || '';

      const res = await submitExamAnswers({
        moduleId: activeModule.id,
        moduleTitle: activeModule.title,
        objectiveAnswers: {
          score: objScore,
          total: objectiveList.length || 1
        },
        writingSubmission: {
          question: firstWriting.question,
          mark_weight: firstWriting.mark_weight || 5,
          answer_key: firstWriting.answer_key,
          essential_keywords: firstWriting.essential_keywords || [],
          student_answer: studentText
        }
      });

      if (res.status === 'success') {
        setFinalResult(res);
        setWritingEvaluation(res.writing_evaluation);
        if (onExamCompleted) onExamCompleted(res);

        if (res.exam_result.total_percentage >= 60) {
          confetti({
            particleCount: 90,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.error('Exam submission failed:', err);
      alert('Failed to submit exam: ' + err.message);
    } finally {
      setIsGradingWriting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Exam Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className={`badge badge-${activeModule.tier}`}>{activeModule.tier} Level</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Comprehensive Assessment</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
              Daily Dual Exam: {activeModule.title}
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
              Test both quick recall (Objective MCQs) and deep conceptual synthesis (Descriptive Writing).
            </p>
          </div>

          <div style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            padding: '8px 16px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>Passing Target</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>60% Overall</div>
          </div>
        </div>
      </div>

      {/* Part 1: Objective Module (MCQs) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#38bdf8" />
            Part 1: Objective MCQs ({objectiveList.length} Questions)
          </h3>
          {objSubmitted && (
            <span style={{
              fontSize: '0.84rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}>
              Score: {objScore} / {objectiveList.length} ({Math.round((objScore / objectiveList.length) * 100)}%)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {objectiveList.map((mcq, idx) => {
            const selectedOpt = selectedAnswers[mcq.id];
            const isCorrect = selectedOpt === mcq.correct_index;

            return (
              <div
                key={mcq.id || idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '16px'
                }}
              >
                <p style={{ fontSize: '0.94rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                  {idx + 1}. {mcq.question}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                  {mcq.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    let optBg = 'rgba(255, 255, 255, 0.04)';
                    let optBorder = 'var(--border-subtle)';

                    if (objSubmitted) {
                      if (optIdx === mcq.correct_index) {
                        optBg = 'rgba(16, 185, 129, 0.2)';
                        optBorder = '#10b981';
                      } else if (isSelected && !isCorrect) {
                        optBg = 'rgba(239, 68, 68, 0.2)';
                        optBorder = '#ef4444';
                      }
                    } else if (isSelected) {
                      optBg = 'rgba(99, 102, 241, 0.25)';
                      optBorder = '#6366f1';
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(mcq.id, optIdx)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: optBg,
                          border: `1px solid ${optBorder}`,
                          cursor: objSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.88rem',
                          color: '#e2e8f0',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `1px solid ${optBorder}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation on reveal */}
                {objSubmitted && (
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                    fontSize: '0.82rem',
                    color: '#cbd5e1'
                  }}>
                    <strong>{isCorrect ? '✓ Correct!' : '✗ Explanation:'}</strong> {mcq.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!objSubmitted && (
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleGradeObjective}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="btn btn-secondary"
              style={{ fontSize: '0.86rem' }}
            >
              Check Objective Answers
            </button>
          </div>
        )}
      </div>

      {/* Part 2: Descriptive Writing Assessment */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenTool size={18} color="#ec4899" />
            Part 2: Descriptive Writing Assessment (Evaluated by AI Rubric Engine)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Write out your comprehensive technical answer. The AI Academic Evaluator will grade your key phrase coverage, fact accuracy, and provide detailed constructive feedback.
          </p>
        </div>

        {writingList.map((wq, idx) => (
          <div key={wq.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-advanced">{wq.mark_weight || 5} MARKS</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Long-Form Analysis</span>
              </div>
              <p style={{ fontSize: '0.96rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.5 }}>
                {wq.question}
              </p>
            </div>

            {/* Writing Input Pad */}
            <textarea
              rows={7}
              placeholder="Type your structured academic response here. Include technical definitions, operational steps, or trade-offs..."
              value={writtenAnswers[wq.id] || ''}
              onChange={(e) => setWrittenAnswers(prev => ({ ...prev, [wq.id]: e.target.value }))}
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.6,
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            />
          </div>
        ))}

        {/* Submit Full Assessment Button */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={handleSubmitFullExam}
            disabled={isGradingWriting}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Sparkles size={16} />
            {isGradingWriting ? 'AI Grading Engine Analyzing Rubric...' : 'Submit Exam for AI Evaluation & Ranking'}
          </button>
        </div>
      </div>

      {/* AI Evaluation Report Card Breakdown */}
      {finalResult && writingEvaluation && (
        <div className="glass-panel-glow" style={{ padding: '28px', borderRadius: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: finalResult.exam_result.total_percentage >= 60 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={26} color={finalResult.exam_result.total_percentage >= 60 ? '#10b981' : '#ef4444'} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  Official AI Academic Grading Breakdown
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Assessed against official solution keys and technical criteria.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase' }}>Gained Skill Points</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
                  +{finalResult.gained_xp} XP
                </div>
              </div>
              <div style={{
                padding: '8px 18px',
                borderRadius: '10px',
                background: finalResult.exam_result.total_percentage >= 60 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                border: `1px solid ${finalResult.exam_result.total_percentage >= 60 ? '#10b981' : '#ef4444'}`
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                  {finalResult.exam_result.total_percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>DESCRIPTIVE SCORE</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                {writingEvaluation.assigned_score} / {writingEvaluation.max_score} Marks
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>FACT ACCURACY</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {writingEvaluation.fact_accuracy_score}%
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>KEY PHRASES DETECTED</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {writingEvaluation.key_phrases_found.length} Matches
              </div>
            </div>
          </div>

          {/* Key Phrases Found vs Missing Keywords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                ✓ Key Phrases Identified in Answer:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {writingEvaluation.key_phrases_found.map((kw, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                    {kw}
                  </span>
                ))}
                {writingEvaluation.key_phrases_found.length === 0 && (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>No exact keywords identified.</span>
                )}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                ✗ Missing Concepts to Incorporate:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {writingEvaluation.missing_keywords.map((kw, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                    {kw}
                  </span>
                ))}
                {writingEvaluation.missing_keywords.length === 0 && (
                  <span style={{ fontSize: '0.78rem', color: '#34d399' }}>All key concepts addressed!</span>
                )}
              </div>
            </div>
          </div>

          {/* Constructive AI Feedback */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Sparkles size={14} /> AI Assessor Evaluative Feedback:
            </span>
            <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6 }}>
              {writingEvaluation.constructive_feedback}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
