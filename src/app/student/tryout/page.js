'use client';

import { useAuth } from '@/lib/auth';
import { students, tryouts, tryoutResults, formatDate } from '@/lib/data';
import { ClipboardList, Clock, BookOpen, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentTryoutPage() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.id);

  const availableTryouts = student?.jenjang
    ? tryouts.filter(t => t.jenjang === student.jenjang && t.kelas === student.kelas && t.isActive)
    : tryouts.filter(t => t.isActive);

  const getResult = (tryoutId) =>
    tryoutResults.find(r => r.tryoutId === tryoutId && r.studentId === user?.id);

  const isOpen = (t) => {
    const now = new Date();
    return new Date(t.tanggalBuka) <= now && now <= new Date(t.tanggalTutup);
  };

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ClipboardList size={24} style={{ color: 'var(--primary)' }} /> Tryout Online
          </h1>
          <p>Uji kemampuan kamu dengan tryout yang sudah disiapkan sesuai jenjang dan kelasmu</p>
        </div>
      </div>

      {/* Badge jenjang */}
      {student?.jenjang && (
        <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>Menampilkan tryout untuk:</span>
          <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 14px', borderRadius: '999px', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
            {student.jenjang} · Kelas {student.kelas}
          </span>
        </div>
      )}

      {availableTryouts.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--neutral-400)' }}>
          <ClipboardList size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.4 }} />
          <h3>Belum Ada Tryout</h3>
          <p style={{ fontSize: 'var(--text-sm)' }}>Tryout untuk jenjang dan kelasmu belum tersedia. Pantau terus ya!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {availableTryouts.map(t => {
            const result = getResult(t.id);
            const open = isOpen(t);
            return (
              <div key={t.id} className="card" style={{
                padding: 'var(--space-5)',
                border: result ? '2px solid rgba(34,197,94,0.3)' : open ? '1px solid var(--cream-200)' : '1px solid var(--cream-100)',
                opacity: open ? 1 : 0.6,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <span style={{ background: 'var(--primary)', color: 'white', padding: '3px 10px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700 }}>{t.jenjang} · Kelas {t.kelas}</span>
                      <span style={{ background: 'var(--cream-100)', color: 'var(--neutral-600)', padding: '3px 10px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{t.mataPelajaran}</span>
                      {result && <span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', padding: '3px 10px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700 }}>✓ Selesai</span>}
                      {!open && <span style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', padding: '3px 10px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700 }}>Tutup</span>}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{t.nama}</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} /> {t.jumlahSoal} soal</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {t.durasiMenit} menit</span>
                      <span>Tutup: {formatDate(t.tanggalTutup)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                    {result ? (
                      <>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: result.score >= 80 ? '#22c55e' : result.score >= 60 ? '#eab308' : '#ef4444', lineHeight: 1 }}>
                          {result.score}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--neutral-400)' }}>/100</span>
                        </div>
                        <Link href={`/student/tryout/${t.id}/result`} className="btn btn-secondary btn-sm">
                          Lihat Hasil <ChevronRight size={14} />
                        </Link>
                      </>
                    ) : open ? (
                      <Link href={`/student/tryout/${t.id}`} className="btn btn-primary">
                        Mulai Tryout <ChevronRight size={16} />
                      </Link>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--neutral-400)', fontSize: 'var(--text-sm)' }}>
                        <Lock size={16} /> Tidak tersedia
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
