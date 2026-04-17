'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { students, programs, formatCurrency } from '@/lib/data';
import { Package, Upload, CheckCircle, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudentRenewPage() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.id);
  const currentProgram = programs.find(p => p.id === student?.programId);

  const [selectedProgram, setSelectedProgram] = useState(currentProgram?.id || '');
  const [paymentFile, setPaymentFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="animate-fadeIn">
        <div className="success-page" style={{ minHeight: '60vh' }}>
          <div>
            <div className="success-icon">
              <CheckCircle size={40} />
            </div>
            <h2 style={{ marginBottom: 'var(--space-3)', textAlign: 'center' }}>Permintaan Perpanjangan Terkirim!</h2>
            <p style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto var(--space-6)', fontSize: 'var(--text-md)' }}>
              Admin akan memverifikasi bukti pembayaran Anda. Sesi belajar akan ditambahkan setelah pembayaran dikonfirmasi.
            </p>
            <div style={{ textAlign: 'center' }}>
              <Link href="/student" className="btn btn-primary">
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <Link href="/student" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 'var(--space-2)' }}>
            <ArrowLeft size={14} /> Kembali ke Dashboard
          </Link>
          <h1>Perpanjang Paket Belajar</h1>
          <p>Pilih paket dan unggah bukti pembayaran untuk menambah sesi belajar</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Pre-filled Student Info */}
          <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-4)' }}>
              Data Siswa
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input className="form-input" value={student?.name || ''} disabled style={{ background: 'var(--cream-50)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={student?.email || ''} disabled style={{ background: 'var(--cream-50)' }} />
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-4)' }}>
              Pilih Paket
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {programs.map((prog) => (
                <label
                  key={prog.id}
                  className={`renew-package-option ${selectedProgram === prog.id ? 'selected' : ''}`}
                  htmlFor={`prog-${prog.id}`}
                >
                  <input
                    type="radio"
                    id={`prog-${prog.id}`}
                    name="program"
                    value={prog.id}
                    checked={selectedProgram === prog.id}
                    onChange={() => setSelectedProgram(prog.id)}
                    style={{ display: 'none' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--neutral-900)', marginBottom: 2 }}>
                      {prog.name}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Package size={12} /> {prog.duration}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: 'var(--text-md)' }}>
                    {formatCurrency(prog.price)}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Upload */}
          <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-4)' }}>
              Bukti Pembayaran
            </h3>

            {/* Payment Methods */}
            <div className="payment-methods" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="payment-method-card">
                <h4>BCA</h4>
                <div className="account-number">1234567890</div>
                <div className="account-name">La Masia Academy</div>
              </div>
              <div className="payment-method-card">
                <h4>BNI</h4>
                <div className="account-number">0987654321</div>
                <div className="account-name">La Masia Academy</div>
              </div>
              <div className="payment-method-card">
                <h4>QRIS</h4>
                <div className="qris-placeholder">
                  <CreditCard size={32} />
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`file-upload-area ${paymentFile ? 'has-file' : ''}`}
              onClick={() => document.getElementById('payment-upload').click()}
            >
              <input
                type="file"
                id="payment-upload"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => setPaymentFile(e.target.files[0])}
              />
              <div className="file-upload-icon">
                {paymentFile ? <CheckCircle size={32} style={{ color: 'var(--success)' }} /> : <Upload size={32} />}
              </div>
              <div className="file-upload-text">
                {paymentFile ? (
                  <>File terpilih: <strong>{paymentFile.name}</strong></>
                ) : (
                  <>Klik untuk <strong>upload bukti pembayaran</strong> (JPG, PNG, PDF)</>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={!selectedProgram || !paymentFile}
            style={{ opacity: (!selectedProgram || !paymentFile) ? 0.5 : 1 }}
          >
            Kirim Permintaan Perpanjangan
          </button>
        </form>

        {/* Summary Sidebar */}
        <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 'var(--space-8)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-4)' }}>Ringkasan</h3>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Program Saat Ini</div>
            <div style={{ fontWeight: 600 }}>{currentProgram?.name || '-'}</div>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Sisa Sesi</div>
            <div style={{
              fontWeight: 700, fontSize: 'var(--text-xl)',
              color: student?.remainingSessions === 0 ? 'var(--error)' : 'var(--success)'
            }}>
              {student?.remainingSessions ?? 0} <span style={{ fontWeight: 400, fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>/ {student?.totalSessions ?? 0} sesi</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--cream-200)', paddingTop: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Paket Dipilih</div>
            <div style={{ fontWeight: 600 }}>
              {selectedProgram ? programs.find(p => p.id === selectedProgram)?.name : '-'}
            </div>
            {selectedProgram && (
              <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--primary-dark)', marginTop: 'var(--space-2)' }}>
                {formatCurrency(programs.find(p => p.id === selectedProgram)?.price || 0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
