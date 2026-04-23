'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { tryouts, tryoutResults, questionBanks } from '@/lib/data';
import { Award, ArrowLeft, CheckCircle, XCircle, Minus, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TryoutResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const tryout = tryouts.find(t => t.id === Number(id));
  const result = tryoutResults.findLast
    ? tryoutResults.findLast(r => r.tryoutId === Number(id) && r.studentId === user?.id)
    : [...tryoutResults].reverse().find(r => r.tryoutId === Number(id) && r.studentId === user?.id);

  const allQuestions = questionBanks.flatMap(b => b.questions);
  const questions = tryout?.questionIds.map(qId => allQuestions.find(q => q.id === qId)).filter(Boolean) || [];

  const optionLabels = ['A', 'B', 'C', 'D'];

  const scoreColor = result?.score >= 80 ? '#22c55e' : result?.score >= 60 ? '#eab308' : '#ef4444';
  const scoreBg = result?.score >= 80 ? 'rgba(34,197,94,0.06)' : result?.score >= 60 ? 'rgba(234,179,8,0.06)' : 'rgba(239,68,68,0.06)';
  const scoreLabel = result?.score >= 80 ? '🎉 Excellent!' : result?.score >= 60 ? '💪 Bagus!' : '📚 Semangat belajar lagi!';

  if (!tryout || !result) {
    return (
      <div className="animate-fadeIn" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <h2>Hasil tidak ditemukan</h2>
        <p style={{ color: 'var(--neutral-500)', marginBottom: 'var(--space-4)' }}>Kamu belum mengerjakan tryout ini.</p>
        <Link href="/student/tryout" className="btn btn-primary"><ArrowLeft size={16} /> Ke Daftar Tryout</Link>
      </div>
    );
  }

  const timeTaken = result.waktuMulai && result.waktuSelesai
    ? Math.round((new Date(result.waktuSelesai) - new Date(result.waktuMulai)) / 60000)
    : null;

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        <Link href="/student/tryout" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', fontWeight: 600 }}>
          <ArrowLeft size={14} /> Kembali ke Tryout
        </Link>
      </div>

      <h1 style={{ marginBottom: 'var(--space-6)' }}>Hasil Tryout</h1>

      {/* Score Card */}
      <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', background: scoreBg, border: `2px solid ${scoreColor}30`, marginBottom: 'var(--space-6)' }}>
        <Award size={56} style={{ color: scoreColor, marginBottom: 'var(--space-4)' }} />
        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--neutral-900)', lineHeight: 1 }}>
          {result.score}<span style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--neutral-400)' }}>/100</span>
        </div>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: scoreColor, marginTop: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          {scoreLabel}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>{result.jumlahBenar}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>Benar</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{result.jumlahSoal - result.jumlahBenar}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>Salah</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--neutral-600)' }}>{result.jumlahSoal}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>Total Soal</div>
          </div>
          {timeTaken && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                <Clock size={20} /> {timeTaken}m
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>Waktu</div>
            </div>
          )}
        </div>
      </div>

      {/* Review per question */}
      <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-4)', color: 'var(--neutral-700)' }}>Pembahasan Jawaban</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {questions.map((q, idx) => {
          const userAnswer = result.answers?.[q.id];
          const isCorrect = userAnswer === q.correctIndex;
          const isUnanswered = userAnswer === undefined;
          return (
            <div key={q.id} className="card" style={{
              padding: 'var(--space-4)',
              border: `2px solid ${isUnanswered ? 'var(--cream-200)' : isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              background: isUnanswered ? 'white' : isCorrect ? 'rgba(34,197,94,0.02)' : 'rgba(239,68,68,0.02)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isUnanswered ? 'var(--cream-100)' : isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }}>
                  {isUnanswered ? <Minus size={14} style={{ color: 'var(--neutral-400)' }} /> : isCorrect ? <CheckCircle size={14} style={{ color: '#22c55e' }} /> : <XCircle size={14} style={{ color: '#ef4444' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)', marginBottom: 'var(--space-2)', lineHeight: 1.6 }}>
                    {idx + 1}. {q.text}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', flexWrap: 'wrap' }}>
                    {!isUnanswered && (
                      <span style={{ color: isCorrect ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                        Jawaban kamu: {optionLabels[userAnswer]} — {q.options[userAnswer]}
                      </span>
                    )}
                    {!isCorrect && (
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>
                        ✓ Jawaban benar: {optionLabels[q.correctIndex]} — {q.options[q.correctIndex]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
        <Link href="/student/tryout" className="btn btn-primary">
          <ArrowLeft size={16} /> Kembali ke Daftar Tryout
        </Link>
      </div>
    </div>
  );
}
