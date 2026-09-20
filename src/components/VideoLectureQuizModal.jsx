import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  X, 
  Sparkles,
  HelpCircle,
  Film
} from 'lucide-react';
import { submitVideoQuizResult } from '../services/api';

export default function VideoLectureQuizModal({
  isOpen,
  onClose,
  quizQuestions = [],
  courseTitle = 'Course',
  moduleTitle = 'Lesson',
  sectionIndex = 0,
  onPass,
  onFailRepeat
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const questions = quizQuestions && quizQuestions.length > 0 ? quizQuestions : [
    {
      id: 1,
      question: `What constitutes the primary governing invariant in ${courseTitle}?`,
      options: [
        'Boundary constraints must be confirmed before state commitment',
        'Throughput is prioritized over deterministic convergence',
        'Heuristic approximations replace rigorous validation',
        'Ad-hoc caching without invalidation protocols'
      ],
      correct_index: 0,
      marks: 10,
      explanation: 'Boundary validation prior to state commitment guarantees zero irreversible entropy divergence.'
    },
    {
      id: 2,
      question: 'During production scale-up, why are asynchronous buffers essential?',
      options: [
        'They eliminate the need for error logging',
        'They decouple producer-consumer rates and isolate blast radius',
        'They allow memory leaks to self-correct',
        'They bypass security protocols'
      ],
      correct_index: 1,
      marks: 10,
      explanation: 'Decoupled buffers absorb volatile load spikes and prevent single-point failures from cascading.'
    }
  ];

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = questions.length;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_index) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 80;

    const result = {
      correctCount,
      totalQuestions,
      percentage,
      passed,
      score: correctCount * 10,
      maxScore: totalQuestions * 10
    };

    setResultData(result);
    setIsSubmitted(true);

    try {
      await submitVideoQuizResult({
        courseTitle,
        moduleTitle,
        sectionIndex,
        score: result.score,
        percentage,
        passed,
        totalQuestions
      });
    } catch (e) {
      console.warn('Failed to log video quiz result:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResultData(null);
    if (onFailRepeat) {
      onFailRepeat();
    }
  };

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
        maxWidth: '860px',
        maxHeight: '92vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.25)'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Film size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Video Lecture Qualifying Exam
                </h3>
                <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700 }}>
                  80% REQUIRED TO PASS
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0' }}>
                {courseTitle} • 10 Questions for 100% Evaluation Score
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Questions Body */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>

          {/* Submission Banner Result */}
          {isSubmitted && resultData && (
            <div style={{
              padding: '20px',
              borderRadius: '14px',
              border: resultData.passed ? '1px solid #10b981' : '1px solid #ef4444',
              background: resultData.passed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {resultData.passed ? (
                    <CheckCircle2 size={32} color="#10b981" />
                  ) : (
                    <XCircle size={32} color="#ef4444" />
                  )}
                  <div>
                    <h4 style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      margin: 0,
                      color: resultData.passed ? '#34d399' : '#f87171'
                    }}>
                      {resultData.passed ? '🎉 Qualified! Next Level Unlocked' : 'You are not qualified. Repeat the same lesson please.'}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: '4px 0 0' }}>
                      {resultData.passed 
                        ? `Outstanding! You achieved ${resultData.percentage}% (${resultData.correctCount}/${resultData.totalQuestions} correct). You have successfully qualified to advance.`
                        : `Your score: ${resultData.percentage}% (${resultData.correctCount}/${resultData.totalQuestions} correct). The minimum qualification threshold is 80%. Please review the video lecture and master the concepts.`
                      }
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.35)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Score</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: resultData.passed ? '#34d399' : '#f87171' }}>
                    {resultData.percentage}%
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Banner */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                {resultData.passed ? (
                  <button
                    onClick={() => {
                      onClose();
                      if (onPass) onPass();
                    }}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    <ArrowRight size={16} />
                    Advance to Next Level / Step
                  </button>
                ) : (
                  <button
                    onClick={handleRetry}
                    className="btn btn-danger"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    <RotateCcw size={16} />
                    Repeat the Same Lesson Please
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Question List */}
          {questions.map((q, qIdx) => {
            const isAnswered = selectedAnswers[qIdx] !== undefined;
            const selectedOpt = selectedAnswers[qIdx];
            const isCorrect = isSubmitted && selectedOpt === q.correct_index;
            const isWrong = isSubmitted && isAnswered && selectedOpt !== q.correct_index;

            return (
              <div
                key={q.id || qIdx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: isSubmitted
                    ? isCorrect ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(239, 68, 68, 0.5)'
                    : isAnswered ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {qIdx + 1}
                    </span>
                    <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.4 }}>
                      {q.question}
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    10 Marks
                  </span>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selectedOpt === optIdx;
                    const isOptionCorrect = isSubmitted && optIdx === q.correct_index;
                    const isOptionWrongSelected = isSubmitted && isOptionSelected && optIdx !== q.correct_index;

                    let optBg = 'rgba(255, 255, 255, 0.03)';
                    let optBorder = 'rgba(255, 255, 255, 0.08)';
                    let optColor = '#cbd5e1';

                    if (isOptionCorrect) {
                      optBg = 'rgba(16, 185, 129, 0.2)';
                      optBorder = '#10b981';
                      optColor = '#34d399';
                    } else if (isOptionWrongSelected) {
                      optBg = 'rgba(239, 68, 68, 0.2)';
                      optBorder = '#ef4444';
                      optColor = '#fca5a5';
                    } else if (isOptionSelected) {
                      optBg = 'rgba(99, 102, 241, 0.2)';
                      optBorder = '#6366f1';
                      optColor = '#ffffff';
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: optBg,
                          border: `1px solid ${optBorder}`,
                          color: optColor,
                          fontSize: '0.86rem',
                          cursor: isSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isOptionSelected ? '5px solid #6366f1' : '2px solid #64748b',
                          background: isOptionSelected ? '#ffffff' : 'transparent'
                        }} />
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation after submission */}
                {isSubmitted && q.explanation && (
                  <div style={{
                    marginTop: '6px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    fontSize: '0.78rem',
                    color: '#94a3b8'
                  }}>
                    <strong style={{ color: '#818cf8' }}>Explanation: </strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Answered: <strong style={{ color: '#fff' }}>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions
            {!isSubmitted && answeredCount < totalQuestions && (
              <span style={{ color: '#f59e0b', marginLeft: '8px' }}>(Answer all questions for 100% scoring)</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0 || isSubmitting}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                {isSubmitting ? 'Grading Answers...' : 'Submit & Grade Exam (100 Marks)'}
              </button>
            ) : resultData?.passed ? (
              <button
                onClick={() => {
                  onClose();
                  if (onPass) onPass();
                }}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                <ArrowRight size={16} /> Proceed to Next Level
              </button>
            ) : (
              <button
                onClick={handleRetry}
                className="btn btn-danger"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                <RotateCcw size={16} /> Repeat Lesson Please
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
