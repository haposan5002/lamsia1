'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, Package } from 'lucide-react';

export default function StudentRenewalPopup({ student }) {
  const router = useRouter();

  // Only show if remainingSessions is exactly 0
  if (!student || student.remainingSessions > 0) return null;

  return (
    <div className="renewal-overlay" id="renewal-popup">
      <div className="renewal-popup animate-slideUp">
        {/* Decorative top bar */}
        <div className="renewal-popup-accent" />

        <div className="renewal-popup-body">
          {/* Warning Icon */}
          <div className="renewal-icon-wrapper">
            <AlertTriangle size={32} />
          </div>

          {/* Heading */}
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>
            Sesi Kamu Habis!
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--neutral-500)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-6)', maxWidth: 380, margin: '0 auto var(--space-6)' }}>
            Kuota sesi belajar untuk akun <strong style={{ color: 'var(--neutral-800)' }}>{student.name}</strong> sudah habis. 
            Perpanjang paket untuk melanjutkan akses ke materi dan kelas.
          </p>

          {/* Session Info */}
          <div className="renewal-session-info">
            <Package size={16} style={{ color: 'var(--warning)' }} />
            <span>Sisa Sesi: </span>
            <strong style={{ color: 'var(--error)' }}>0</strong>
            <span> / {student.totalSessions}</span>
          </div>

          {/* CTA Button */}
          <button
            className="btn btn-primary btn-lg w-full"
            onClick={() => router.push('/student/renew')}
            id="btn-renew-package"
            style={{ gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}
          >
            Perpanjang Paket Sekarang
            <ArrowRight size={18} />
          </button>

          <button
            className="btn btn-ghost w-full"
            onClick={() => router.push('/')}
            style={{ marginTop: 'var(--space-2)', color: 'var(--neutral-500)' }}
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    </div>
  );
}
