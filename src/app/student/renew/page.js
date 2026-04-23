'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { students, programs, packages, formatCurrency, formatDate } from '@/lib/data';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Package, Calendar, ArrowRight, Star, Sparkles, Check, Upload, QrCode, Building, CreditCard } from 'lucide-react';

export default function StudentRenewPage() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.id);

  const studentPrograms = programs.filter(p =>
    student?.programIds?.includes(p.id) || student?.programId === p.id
  );

  // Expiry status
  const expiryDate = student?.paketExpiry ? new Date(student.paketExpiry) : null;
  const today = new Date();
  const daysLeft = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 30;

  // Available packages for student's program(s)
  const availablePackages = packages.filter(p =>
    studentPrograms.some(sp => sp.id === p.programId)
  );

  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [step, setStep] = useState(1); // 1: choose, 2: payment, 3: confirm
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentFileName, setPaymentFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedPkg = packages.find(p => p.id === selectedPackageId);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setPaymentFile(file); setPaymentFileName(file.name); }
  };

  if (submitted) {
    return (
      <div className="animate-fadeIn" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <CheckCircle size={72} style={{ color: 'var(--success)', marginBottom: 'var(--space-4)', display: 'block', margin: '0 auto var(--space-4)' }} />
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Perpanjangan Terkirim!</h2>
        <p style={{ color: 'var(--neutral-600)', maxWidth: 400, margin: '0 auto var(--space-6)' }}>
          Permintaan perpanjangan paket <strong>{selectedPkg?.nama}</strong> telah kami terima.
          Admin akan memverifikasi pembayaran dalam 1×24 jam.
        </p>
        <button className="btn btn-primary" onClick={() => { setSubmitted(false); setStep(1); setSelectedPackageId(null); }}>
          Selesai
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <RefreshCw size={22} style={{ color: 'var(--primary)' }} /> Perpanjang Paket
          </h1>
          <p>Pilih paket yang sesuai untuk melanjutkan belajar di La Masia Academy</p>
        </div>
      </div>

      {/* Expiry Banner */}
      {expiryDate && (
        <div style={{
          padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          background: isExpired ? 'rgba(239,68,68,0.06)' : isExpiringSoon ? 'rgba(234,179,8,0.06)' : 'rgba(34,197,94,0.06)',
          border: `2px solid ${isExpired ? 'rgba(239,68,68,0.2)' : isExpiringSoon ? 'rgba(234,179,8,0.2)' : 'rgba(34,197,94,0.2)'}`,
        }}>
          {isExpired ? <AlertCircle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
            : isExpiringSoon ? <Clock size={24} style={{ color: '#eab308', flexShrink: 0 }} />
            : <CheckCircle size={24} style={{ color: '#22c55e', flexShrink: 0 }} />}
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: isExpired ? '#dc2626' : isExpiringSoon ? '#ca8a04' : '#16a34a' }}>
              {isExpired ? 'Paket Sudah Habis' : isExpiringSoon ? `Paket berakhir dalam ${daysLeft} hari` : `Paket aktif hingga ${formatDate(student.paketExpiry)}`}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>
              {isExpired ? 'Segera perpanjang agar akses materi tetap aktif' : isExpiringSoon ? 'Segera perpanjang sebelum habis untuk akses tidak terputus' : 'Perpanjang sekarang untuk mendapatkan akses lebih lama'}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Choose Package */}
      {step === 1 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-4)', color: 'var(--neutral-700)' }}>Pilih Paket</h3>
          {availablePackages.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--neutral-400)' }}>
              <Package size={48} style={{ opacity: 0.4, marginBottom: 'var(--space-3)' }} />
              <p>Tidak ada paket tersedia saat ini.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {availablePackages.map(pkg => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div key={pkg.id} onClick={() => setSelectedPackageId(pkg.id)} style={{
                    borderRadius: 'var(--radius-lg)', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    border: `2px solid ${isSelected ? 'var(--primary)' : pkg.isPopular ? 'rgba(139,115,85,0.3)' : 'var(--cream-200)'}`,
                    background: isSelected ? 'rgba(139,115,85,0.04)' : 'white',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 0 0 3px rgba(139,115,85,0.15)' : 'none',
                    padding: 'var(--space-5)',
                  }}>
                    {pkg.isPopular && (
                      <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '0 var(--radius-lg) 0 var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                        ⭐ Populer
                      </div>
                    )}
                    {pkg.isNew && !pkg.isPopular && (
                      <div style={{ position: 'absolute', top: 0, right: 0, background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '0 var(--radius-lg) 0 var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                        ✨ Baru
                      </div>
                    )}
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 12, left: 12, width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={13} style={{ color: 'white' }} />
                      </div>
                    )}
                    <div style={{ paddingTop: (pkg.isPopular || pkg.isNew) ? 'var(--space-4)' : 0, marginBottom: 'var(--space-3)' }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 4 }}>{pkg.nama}</div>
                      <div style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-xs)' }}>{pkg.durasi} · {pkg.durasiHari} hari akses</div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 'var(--space-3)' }}>
                      {formatCurrency(pkg.harga)}
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--neutral-600)' }}>
                      {pkg.fitur.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Check size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" disabled={!selectedPackageId} onClick={() => setStep(2)}
              style={{ opacity: selectedPackageId ? 1 : 0.5, cursor: selectedPackageId ? 'pointer' : 'not-allowed' }}>
              Lanjut ke Pembayaran <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && selectedPkg && (
        <div className="animate-fadeIn">
          <div className="card card-cream" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: 2 }}>Paket dipilih</div>
              <div style={{ fontWeight: 700 }}>{selectedPkg.nama}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(selectedPkg.harga)}</div>
          </div>

          {/* Payment method tabs */}
          <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-3)' }}>Metode Pembayaran</h3>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
            {[
              { key: 'transfer', icon: <Building size={16} />, label: 'Transfer Bank' },
              { key: 'qris', icon: <QrCode size={16} />, label: 'QRIS' },
            ].map(m => (
              <button key={m.key} onClick={() => setPaymentMethod(m.key)} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-sm)',
                border: `2px solid ${paymentMethod === m.key ? 'var(--primary)' : 'var(--cream-200)'}`,
                background: paymentMethod === m.key ? 'rgba(139,115,85,0.06)' : 'white',
                color: paymentMethod === m.key ? 'var(--primary)' : 'var(--neutral-600)',
                transition: 'all 0.2s',
              }}>{m.icon} {m.label}</button>
            ))}
          </div>

          {/* Payment info */}
          <div className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
            {paymentMethod === 'transfer' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  { bank: 'BCA', norek: '1234567890', an: 'La Masia Academy' },
                  { bank: 'Mandiri', norek: '0987654321', an: 'La Masia Academy' },
                ].map((b, i) => (
                  <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--cream-50)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{b.bank}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)' }}>{b.norek}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>a/n {b.an}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--primary)' }}>{formatCurrency(selectedPkg.harga)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <QrCode size={80} style={{ color: 'var(--primary)', margin: '0 auto var(--space-3)' }} />
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Scan QRIS untuk membayar</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(selectedPkg.harga)}</div>
              </div>
            )}
          </div>

          {/* Upload bukti */}
          <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="form-label"><Upload size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Upload Bukti Pembayaran</label>
            <label className={`file-upload-area ${paymentFileName ? 'has-file' : ''}`}>
              <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
              <div className="file-upload-icon"><Upload size={28} /></div>
              {paymentFileName ? (
                <div className="file-upload-text"><strong>✓ {paymentFileName}</strong><br /><span style={{ fontSize: 'var(--text-sm)' }}>Klik untuk ganti</span></div>
              ) : (
                <div className="file-upload-text"><strong>Klik untuk upload</strong> atau drag & drop<br /><span style={{ fontSize: 'var(--text-sm)' }}>JPG, PNG, PDF (Maks. 5MB)</span></div>
              )}
            </label>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Kembali</button>
            <button className="btn btn-primary" disabled={!paymentFile} onClick={() => setStep(3)}
              style={{ opacity: paymentFile ? 1 : 0.5, cursor: paymentFile ? 'pointer' : 'not-allowed' }}>
              Konfirmasi <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && selectedPkg && (
        <div className="animate-fadeIn">
          <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-4)' }}>Konfirmasi Perpanjangan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            {[
              { label: 'Paket', value: selectedPkg.nama },
              { label: 'Total Bayar', value: formatCurrency(selectedPkg.harga) },
              { label: 'Durasi', value: `${selectedPkg.durasi} (${selectedPkg.durasiHari} hari)` },
              { label: 'Metode', value: paymentMethod === 'transfer' ? 'Transfer Bank' : 'QRIS' },
              { label: 'Bukti', value: paymentFileName },
            ].map((r, i) => (
              <div key={i} className="card card-cream card-flat" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>{r.label}</span>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{r.value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 'var(--space-5)' }}>
            Dengan mengklik &quot;Kirim&quot;, admin akan memverifikasi pembayaran kamu dalam 1×24 jam. Akses akan diperpanjang setelah konfirmasi.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>← Kembali</button>
            <button className="btn btn-primary" onClick={() => setSubmitted(true)}>
              <CheckCircle size={16} /> Kirim Perpanjangan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
