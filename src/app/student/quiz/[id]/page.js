'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { materials, questionBanks } from '@/lib/data';
import {
  Brain, ArrowLeft, CheckCircle, Clock, AlertCircle, Award,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export default function StudentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const materialId = Number(params.id);

  const material = materials.find(m => m.id === materialId);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Get the questions for this quiz
  const questions = (() => {
    if (!material) return [];
    if (material.quizQuestionIds && material.quizQuestionIds.length > 0) {
      const bank = questionBanks.find(b => b.programId === material.programId);
      if (!bank) return [];
      return material.quizQuestionIds
        .map(qId => bank.questions.find(q => q.id === qId))
        .filter(Boolean);
    }
    // Fallback: get random 20 from bank
    const bank = questionBanks.find(b => b.programId === material.programId);
    if (!bank) return [];
    return [...bank.questions].sort(() => Math.random() - 0.5).slice(0, 20);
  })();

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const pageQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswer = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    setCurrentPage(0);
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;
  const answeredCount = Object.keys(answers).length;
  const optionLabels = ['A', 'B', 'C', 'D'];

  if (!material) {
    return (
      <div className="animate-fadeIn" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <h2>Kuis Tidak Ditemukan</h2>
        <p style={{ color: 'var(--neutral-500)' }}>Materi kuis yang Anda cari tidak tersedia.</p>
        <button className="btn btn-primary" onClick={() => router.back()} style={{ marginTop: 'var(--space-4)' }}>
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <button
            onClick={() => router.push('/student/materials')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 600,
              padding: 0, marginBottom: 'var(--space-2)',
            }}
          >
            <ArrowLeft size={14} /> Kembali ke Materi
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Brain size={24} style={{ color: 'var(--primary)' }} />
            {material.title}
          </h1>
          <p>{questions.length} soal pilihan ganda</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            {submitted ? 'Kuis Selesai' : 'Progress Pengerjaan'}
          </span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
            {answeredCount}/{questions.length} terjawab
          </span>
        </div>
        <div style={{
          width: '100%', height: 8, background: 'var(--cream-200)', borderRadius: 4, overflow: 'hidden',
        }}>
          <div style={{
            width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%`,
            height: '100%',
            background: submitted ? '#22c55e' : 'var(--primary)',
            borderRadius: 4, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Score display (after submit) */}
      {submitted && score !== null && (
        <div className="card" style={{
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          textAlign: 'center',
          background: score >= 70 ? 'rgba(34,197,94,0.04)' : score >= 40 ? 'rgba(234,179,8,0.04)' : 'rgba(239,68,68,0.04)',
          border: `2px solid ${score >= 70 ? 'rgba(34,197,94,0.2)' : score >= 40 ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          <Award size={48} style={{
            color: score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444',
            marginBottom: 'var(--space-3)',
          }} />
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--neutral-800)' }}>
            {score}<span style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--neutral-500)' }}>/100</span>
          </div>
          <div style={{ fontSize: 'var(--text-md)', color: 'var(--neutral-600)', marginTop: 'var(--space-2)' }}>
            Benar: <strong>{questions.filter(q => answers[q.id] === q.correctIndex).length}</strong> dari {questions.length} soal
          </div>
          <div style={{
            marginTop: 'var(--space-3)', padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            background: score >= 70 ? 'rgba(34,197,94,0.08)' : score >= 40 ? 'rgba(234,179,8,0.08)' : 'rgba(239,68,68,0.08)',
            fontSize: 'var(--text-sm)', fontWeight: 600,
            color: score >= 70 ? '#16a34a' : score >= 40 ? '#ca8a04' : '#dc2626',
            display: 'inline-block',
          }}>
            {score >= 70 ? '🎉 Excellent!' : score >= 40 ? '💪 Bagus, terus tingkatkan!' : '📚 Semangat belajar lagi!'}
          </div>
        </div>
      )}

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {pageQuestions.map((q, pageIdx) => {
          const globalIdx = currentPage * questionsPerPage + pageIdx;
          const userAnswer = answers[q.id];
          const isAnswered = userAnswer !== undefined;

          return (
            <div key={q.id} className="card" style={{
              padding: 'var(--space-5)',
              border: submitted
                ? `2px solid ${userAnswer === q.correctIndex ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                : isAnswered
                  ? '2px solid var(--primary)'
                  : '1px solid var(--cream-200)',
              background: submitted
                ? (userAnswer === q.correctIndex ? 'rgba(34,197,94,0.02)' : 'rgba(239,68,68,0.02)')
                : 'white',
            }}>
              {/* Question text */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                marginBottom: 'var(--space-4)',
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: isAnswered ? 'var(--primary)' : 'var(--cream-100)',
                  color: isAnswered ? 'white' : 'var(--neutral-500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 'var(--text-sm)',
                }}>
                  {globalIdx + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--neutral-800)', lineHeight: 1.6 }}>
                    {q.text}
                  </span>
                  {submitted && (
                    <div style={{
                      marginTop: 'var(--space-2)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: userAnswer === q.correctIndex ? '#16a34a' : '#dc2626',
                    }}>
                      {userAnswer === q.correctIndex ? '✓ Jawaban benar' : `✗ Jawaban salah — yang benar: ${optionLabels[q.correctIndex]}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {q.options.map((opt, i) => {
                  const isSelected = userAnswer === i;
                  const isCorrect = q.correctIndex === i;
                  let borderColor = 'var(--cream-200)';
                  let bg = 'white';
                  let textColor = 'var(--neutral-700)';

                  if (submitted) {
                    if (isCorrect) {
                      borderColor = '#22c55e';
                      bg = 'rgba(34,197,94,0.08)';
                      textColor = '#16a34a';
                    } else if (isSelected && !isCorrect) {
                      borderColor = '#ef4444';
                      bg = 'rgba(239,68,68,0.08)';
                      textColor = '#dc2626';
                    }
                  } else if (isSelected) {
                    borderColor = 'var(--primary)';
                    bg = 'rgba(139,115,85,0.06)';
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAnswer(q.id, i)}
                      disabled={submitted}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        border: `2px solid ${borderColor}`,
                        borderRadius: 'var(--radius-md)',
                        background: bg,
                        cursor: submitted ? 'default' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        fontSize: 'var(--text-sm)',
                        color: textColor,
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${isSelected && !submitted ? 'var(--primary)' : submitted && isCorrect ? '#22c55e' : submitted && isSelected ? '#ef4444' : 'var(--neutral-300)'}`,
                        background: isSelected && !submitted ? 'var(--primary)' : submitted && isCorrect ? '#22c55e' : submitted && isSelected && !isCorrect ? '#ef4444' : 'white',
                        color: (isSelected || (submitted && (isCorrect || isSelected))) ? 'white' : 'var(--neutral-500)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 'var(--text-xs)',
                        transition: 'all 0.15s ease',
                      }}>
                        {submitted && isCorrect ? '✓' : optionLabels[i]}
                      </span>
                      <span style={{ fontWeight: isSelected || (submitted && isCorrect) ? 600 : 400 }}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 'var(--space-3)', marginBottom: 'var(--space-6)',
        }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--cream-200)', background: 'white',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 0 ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--neutral-700)',
            }}
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', fontWeight: 600 }}>
            Halaman {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--cream-200)', background: 'white',
              cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--neutral-700)',
            }}
          >
            Selanjutnya <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Question navigation dots */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--neutral-700)' }}>
          Navigasi Soal
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrentPage = Math.floor(idx / questionsPerPage) === currentPage;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentPage(Math.floor(idx / questionsPerPage))}
                style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${isCurrentPage ? 'var(--primary)' : 'transparent'}`,
                  background: submitted
                    ? (answers[q.id] === q.correctIndex ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)')
                    : isAnswered ? 'var(--primary)' : 'var(--cream-100)',
                  color: isAnswered && !submitted ? 'white' : 'var(--neutral-600)',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit button */}
      {!submitted && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{
              opacity: allAnswered ? 1 : 0.5,
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              padding: 'var(--space-3) var(--space-8)',
            }}
          >
            <CheckCircle size={18} /> Submit Jawaban
          </button>
          {!allAnswered && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <AlertCircle size={12} /> Jawab semua soal terlebih dahulu ({answeredCount}/{questions.length})
            </p>
          )}
        </div>
      )}

      {/* Back button after submit */}
      {submitted && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/student/materials')}
          >
            <ArrowLeft size={16} /> Kembali ke Materi
          </button>
        </div>
      )}
    </div>
  );
}
