'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { registrations, programs, formatDate, formatDateTime } from '@/lib/data';
import { ArrowLeft, CheckCircle, XCircle, Download, User, Mail, Phone, Calendar, CreditCard } from 'lucide-react';

export default function RegistrationDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const registration = registrations.find((r) => String(r.id) === id);
  const [status, setStatus] = useState(registration?.status || 'pending');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  if (!registration) {
    return (
      <div className="empty-state">
        <h3>Data tidak ditemukan</h3>
        <p>Pendaftaran dengan ID tersebut tidak ada.</p>
      </div>
    );
  }

  const program = programs.find(p => p.id === registration.programId);

  const handleAction = (action) => {
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    setStatus(modalAction === 'approve' ? 'approved' : 'rejected');
    setShowModal(false);
  };

  return (
    <div className="animate-fadeIn">
      <button
        onClick={() => router.back()}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
          fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 'var(--space-6)',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0
        }}
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Pendaftaran
      </button>

      <div className="dashboard-header">
        <div>
          <h1>Detail Pendaftaran</h1>
          <p>Data pendaftaran #{registration.id}</p>
        </div>
        <span className={`badge badge-${status}`} style={{ fontSize: 'var(--text-base)', padding: '4px 16px' }}>
          {status === 'pending' ? '⏳ Pending' : status === 'approved' ? '✓ Disetujui' : '✕ Ditolak'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Main Info */}
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-6)' }}>Informasi Pendaftar</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginBottom: 4 }}>
                <User size={14} /> Nama Lengkap
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{registration.fullName}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginBottom: 4 }}>
                <Mail size={14} /> Email
              </div>
              <div style={{ fontWeight: 600 }}>{registration.email}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginBottom: 4 }}>
                <Phone size={14} /> Nomor Telepon
              </div>
              <div style={{ fontWeight: 600 }}>{registration.phone}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginBottom: 4 }}>
                <Calendar size={14} /> Tanggal Daftar
              </div>
              <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                {formatDateTime(registration.createdAt)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--cream-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginBottom: 4 }}>
              <CreditCard size={14} /> Program Dipilih
            </div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{program?.name || '-'}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginTop: 2 }}>
              {program?.duration} — {program ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(program.price) : '-'}
            </div>
          </div>
        </div>

        {/* Payment Proof & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>
              Bukti Pembayaran
            </h3>
            <div style={{
              background: 'var(--cream-100)', borderRadius: 'var(--radius-lg)',
              height: 200, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
              color: 'var(--neutral-400)'
            }}>
              <Download size={32} />
              <span style={{ fontSize: 'var(--text-sm)' }}>bukti-pembayaran-{registration.id}.jpg</span>
            </div>
            <button className="btn btn-secondary btn-sm w-full" style={{ marginTop: 'var(--space-3)' }}>
              <Download size={14} /> Unduh Bukti
            </button>
          </div>

          {status === 'pending' && (
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>
                Tindakan
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <button className="btn btn-success w-full" onClick={() => handleAction('approve')}>
                  <CheckCircle size={16} /> Setujui Pendaftaran
                </button>
                <button className="btn btn-danger w-full" onClick={() => handleAction('reject')}>
                  <XCircle size={16} /> Tolak Pendaftaran
                </button>
              </div>
            </div>
          )}

          {status !== 'pending' && (
            <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
                Pendaftaran ini telah {status === 'approved' ? 'disetujui' : 'ditolak'}. 
                {status === 'approved' && ' Notifikasi dengan kredensial login telah dikirim ke pendaftar.'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              {modalAction === 'approve' ? 'Setujui Pendaftaran?' : 'Tolak Pendaftaran?'}
            </h2>
            <p style={{ marginBottom: 'var(--space-6)' }}>
              {modalAction === 'approve'
                ? `Pendaftaran atas nama ${registration.fullName} akan disetujui. Akun siswa akan dibuat dan notifikasi akan dikirim ke email pendaftar.`
                : `Pendaftaran atas nama ${registration.fullName} akan ditolak. Notifikasi penolakan akan dikirim ke email pendaftar.`
              }
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button
                className={`btn ${modalAction === 'approve' ? 'btn-success' : 'btn-danger'}`}
                onClick={confirmAction}
              >
                {modalAction === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
