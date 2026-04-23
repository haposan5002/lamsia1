'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { students, getFilteredQuestions } from '@/lib/data';
import { Brain, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Clock, ArrowLeft } from 'lucide-react';

export default function LevelTestPage() {
  const router = useRouter();
  const { user } = useAuth();

  const student = students.find(s => s.id === user?.id);

  // Jika tidak ada student atau sudah selesai test
  useEffect(() => {
    if (!student) return;
    const completedLocal = localStorage.getItem(`levelTestCompleted_${student.id}`) === 'true';
    if (student.hasCompletedLevelTest || completedLocal) {
      router.push('/student/materials');
    }
  }, [student, router]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!student) return;
    // Ambil maksimal 10 soal acak dari bank soal sesuai jenjang & kelas siswa
    const pool = getFilteredQuestions(student.jenjang, student.kelas, null);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    const timer = setTimeout(() => {
      setQuestions(selected);
    }, 0);
    return () => clearTimeout(timer);
  }, [student]);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Simpan status pengerjaan ke localStorage untuk mensimulasikan persistensi
    if (student) {
      localStorage.setItem(`levelTestCompleted_${student.id}`, 'true');
    }
    
    // Redirect ke materials
    setTimeout(() => {
      router.push('/student/materials');
    }, 1500);
  }, [isSubmitting, student, router]);

  // Timer countdown
  useEffect(() => {
    if (questions.length === 0 || isSubmitting) return;
    if (timeLeft <= 0) { 
      const timer = setTimeout(() => handleSubmit(), 0); 
      return () => clearTimeout(timer); 
    }
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, questions.length, isSubmitting, handleSubmit]);



  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const answeredCount = Object.keys(answers).length;
  const optionLabels = ['A', 'B', 'C', 'D'];
  const currentQ = questions[currentIdx];
  const isUrgent = timeLeft < 180; // < 3 menit

  if (!student || questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <p>Memuat Test Level...</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="animate-fadeIn" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto var(--space-4)' }} />
        <h2>Test Level Selesai!</h2>
        <p style={{ color: 'var(--neutral-500)' }}>Terima kasih telah mengerjakan test level. Mengalihkan ke halaman materi...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <button
            onClick={() => router.push('/student/materials')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--neutral-500)', fontSize: 'var(--text-sm)', fontWeight: 600,
              padding: 0, marginBottom: 'var(--space-2)',
            }}
          >
            <ArrowLeft size={14} /> Kembali
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Brain size={24} style={{ color: '#ca8a04' }} /> Test Level (Pre-Test)
          </h1>
          <p>Uji kemampuan awalmu sebelum mengakses materi pembelajaran</p>
        </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-4)', alignItems: 'start' }}>
        {/* Question Area */}
        <div>
          {currentQ && (
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: '#ca8a04' }}>
                  Soal {currentIdx + 1}
                </div>
                {currentQ.mataPelajaran && (
                  <span style={{ fontSize: 'var(--text-xs)', background: 'var(--cream-100)', color: 'var(--neutral-600)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    {currentQ.mataPelajaran}
                  </span>
                )}
              </div>
              
              {currentQ.imageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={currentQ.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', border: '1px solid var(--cream-200)' }} />
              )}
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
                        border: `2px solid ${isSelected ? '#ca8a04' : 'var(--cream-200)'}`,
                        background: isSelected ? 'rgba(234,179,8,0.08)' : 'white',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        fontWeight: isSelected ? 600 : 400, color: 'var(--neutral-700)',
                      }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 'var(--text-xs)',
                        background: isSelected ? '#ca8a04' : 'var(--cream-100)',
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
                  <button className="btn btn-primary btn-sm" onClick={() => setShowConfirm(true)} style={{ background: '#ca8a04', borderColor: '#ca8a04' }}>
                    <CheckCircle size={16} /> Selesai
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigator Panel */}
        <div className="card" style={{ padding: 'var(--space-4)', position: 'sticky', top: 'var(--space-4)' }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', color: 'var(--neutral-700)' }}>Navigasi Soal</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
            {questions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = i === currentIdx;
              return (
                <button key={q.id} onClick={() => setCurrentIdx(i)} style={{
                  width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${isCurrent ? '#ca8a04' : 'transparent'}`,
                  background: isAnswered ? '#ca8a04' : 'var(--cream-100)',
                  color: isAnswered ? 'white' : 'var(--neutral-600)',
                  fontWeight: 700, fontSize: 'var(--text-xs)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>{i + 1}</button>
              );
            })}
          </div>
          
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>Progress</span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{answeredCount}/{questions.length}</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'var(--cream-200)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${(answeredCount / questions.length) * 100}%`, height: '100%', background: '#ca8a04', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
          </div>
          
          <button className="btn btn-primary w-full" onClick={() => setShowConfirm(true)} style={{ background: '#ca8a04', borderColor: '#ca8a04' }}>
            <CheckCircle size={16} /> Submit Test Level
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <AlertCircle size={48} style={{ color: answeredCount < questions.length ? '#eab308' : '#22c55e', marginBottom: 'var(--space-4)', display: 'block', margin: '0 auto var(--space-4)' }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Submit Test Level?</h3>
            {answeredCount < questions.length ? (
              <p style={{ color: 'var(--neutral-600)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
                Masih ada <strong>{questions.length - answeredCount} soal</strong> yang belum dijawab. Yakin ingin mengakhiri test?
              </p>
            ) : (
              <p style={{ color: 'var(--neutral-600)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
                Semua soal sudah dijawab. Yakin ingin submit untuk membuka akses materi?
              </p>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>Kembali</button>
              <button className="btn btn-primary" style={{ flex: 1, background: '#ca8a04', borderColor: '#ca8a04' }} onClick={handleSubmit}>Ya, Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
