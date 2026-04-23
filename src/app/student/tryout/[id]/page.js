'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { tryouts, questionBanks, tryoutResults, students } from '@/lib/data';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = (id) => `tryout_answers_${id}`;

export default function TryoutEnginePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const tryout = tryouts.find(t => t.id === Number(id));
  const student = students.find(s => s.id === user?.id);

  const questions = (() => {
    if (!tryout) return [];
    const allQuestions = questionBanks.flatMap(b => b.questions);
    return tryout.questionIds.map(qId => allQuestions.find(q => q.id === qId)).filter(Boolean);
  })();

  const [answers, setAnswers] = useState(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY(id)) || '{}'); } catch { return {}; }
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(tryout ? tryout.durasiMenit * 60 : 0);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Auto-save answers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY(id), JSON.stringify(answers));
    }
  }, [answers, id]);

  // Timer countdown
  useEffect(() => {
    if (submitted || !tryout) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  // Warn before leaving
  useEffect(() => {
    const handler = (e) => { if (!submitted) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correctIndex) correct++; });
    const score = Math.round((correct / questions.length) * 100);
    tryoutResults.push({
      id: Date.now(), tryoutId: tryout.id, studentId: user?.id,
      score, jumlahBenar: correct, jumlahSoal: questions.length,
      waktuMulai: new Date(Date.now() - (tryout.durasiMenit * 60 - timeLeft) * 1000).toISOString(),
      waktuSelesai: new Date().toISOString(), answers: { ...answers },
    });
    localStorage.removeItem(STORAGE_KEY(id));
    setSubmitted(true);
    router.push(`/student/tryout/${id}/result`);
  }, [submitted, answers, questions, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const answeredCount = Object.keys(answers).length;
  const optionLabels = ['A', 'B', 'C', 'D'];
  const currentQ = questions[currentIdx];
  const isUrgent = timeLeft < 300;

  if (!tryout) return (
    <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
      <h2>Tryout tidak ditemukan</h2>
      <button className="btn btn-primary" onClick={() => router.push('/student/tryout')} style={{ marginTop: 'var(--space-4)' }}>
        <ArrowLeft size={16} /> Kembali
      </button>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)' }}>{tryout.nama}</h1>
          <p>{tryout.jenjang} · Kelas {tryout.kelas} · {tryout.mataPelajaran}</p>
        </div>
        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-lg)',
          background: isUrgent ? 'rgba(239,68,68,0.08)' : 'var(--cream-50)',
          border: `2px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : 'var(--cream-200)'}`,
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xl)',
          color: isUrgent ? '#dc2626' : 'var(--neutral-800)',
        }}>
          <Clock size={20} style={{ color: isUrgent ? '#dc2626' : 'var(--primary)' }} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Soal {currentIdx + 1} dari {questions.length}</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>{answeredCount}/{questions.length} dijawab</span>
        </div>
        <div style={{ width: '100%', height: 6, background: 'var(--cream-200)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${(answeredCount / questions.length) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: 3, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-4)', alignItems: 'start' }}>
        {/* Question */}
        <div>
          {currentQ && (
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--primary)', marginBottom: 'var(--space-3)' }}>
                Soal {currentIdx + 1}
              </div>
              {currentQ.imageUrl && <img src={currentQ.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', border: '1px solid var(--cream-200)' }} />}
              {currentQ.audioUrl && <audio controls src={currentQ.audioUrl} style={{ width: '100%', marginBottom: 'var(--space-4)' }} />}
              <p style={{ fontWeight: 600, fontSize: 'var(--text-base)', lineHeight: 1.7, marginBottom: 'var(--space-5)', color: 'var(--neutral-800)' }}>
                {currentQ.text}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ.id] === i;
                  return (
                    <button key={i} type="button" onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: i }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--cream-200)'}`,
                        background: isSelected ? 'rgba(139,115,85,0.06)' : 'white',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        fontWeight: isSelected ? 600 : 400, color: 'var(--neutral-700)',
                      }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 'var(--text-xs)',
                        background: isSelected ? 'var(--primary)' : 'var(--cream-100)',
                        color: isSelected ? 'white' : 'var(--neutral-600)',
                        transition: 'all 0.15s',
                      }}>{optionLabels[i]}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-5)' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}>
                  <ChevronLeft size={16} /> Sebelumnya
                </button>
                {currentIdx < questions.length - 1 ? (
                  <button className="btn btn-primary btn-sm" onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}>
                    Selanjutnya <ChevronRight size={16} />
                  </button>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => setShowConfirm(true)}>
                    <CheckCircle size={16} /> Selesai
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigator */}
        <div className="card" style={{ padding: 'var(--space-4)', position: 'sticky', top: 'var(--space-4)' }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', color: 'var(--neutral-700)' }}>Navigasi Soal</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
            {questions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = i === currentIdx;
              return (
                <button key={q.id} onClick={() => setCurrentIdx(i)} style={{
                  width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${isCurrent ? 'var(--primary)' : 'transparent'}`,
                  background: isAnswered ? 'var(--primary)' : 'var(--cream-100)',
                  color: isAnswered ? 'white' : 'var(--neutral-600)',
                  fontWeight: 700, fontSize: 'var(--text-xs)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>{i + 1}</button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: 'var(--space-4)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, background: 'var(--primary)', borderRadius: 2, display: 'inline-block' }} /> Sudah dijawab</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, background: 'var(--cream-100)', borderRadius: 2, display: 'inline-block', border: '1px solid var(--cream-200)' }} /> Belum dijawab</span>
          </div>
          <button className="btn btn-primary w-full" onClick={() => setShowConfirm(true)}>
            <CheckCircle size={16} /> Submit Jawaban
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <AlertCircle size={48} style={{ color: answeredCount < questions.length ? '#eab308' : '#22c55e', marginBottom: 'var(--space-4)', display: 'block', margin: '0 auto var(--space-4)' }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Submit Jawaban?</h3>
            {answeredCount < questions.length ? (
              <p style={{ color: 'var(--neutral-600)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
                Masih ada <strong>{questions.length - answeredCount} soal</strong> yang belum dijawab. Yakin ingin submit?
              </p>
            ) : (
              <p style={{ color: 'var(--neutral-600)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
                Semua soal sudah dijawab. Yakin ingin submit dan melihat hasil?
              </p>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>Kembali</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>Ya, Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
