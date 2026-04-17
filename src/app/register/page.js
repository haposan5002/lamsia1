'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { programs, formatCurrency } from '@/lib/data';
import { 
  Upload, CheckCircle, ArrowLeft, ArrowRight, User, Mail, Phone, 
  CreditCard, QrCode, Building
} from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', programId: '',
    paymentFile: null, paymentFileName: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, paymentFile: file, paymentFileName: file.name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const steps = [
    { num: 1, label: 'Data Diri' },
    { num: 2, label: 'Program' },
    { num: 3, label: 'Pembayaran' },
    { num: 4, label: 'Konfirmasi' },
  ];

  if (submitted) {
    return (
      <>
        <Navbar />
        <main>
          <div className="success-page">
            <div>
              <div className="success-icon">
                <CheckCircle size={40} />
              </div>
              <h1 style={{ marginBottom: 'var(--space-3)' }}>Pendaftaran Berhasil Dikirim!</h1>
              <p style={{ fontSize: 'var(--text-md)', maxWidth: 480, margin: '0 auto var(--space-6)' }}>
                Terima kasih, <strong>{formData.fullName}</strong>! Pendaftaran Anda sedang menunggu 
                verifikasi dari tim kami. Kami akan mengirimkan notifikasi melalui email setelah proses verifikasi selesai.
              </p>
              <div className="badge badge-pending" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-base)' }}>
                ⏳ Status: Menunggu Verifikasi
              </div>
              <br /><br />
              <Link href="/" className="btn btn-primary">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="register-page">
          <div className="container">
            <div className="register-container">
              <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
                <h1>Formulir Pendaftaran</h1>
                <p>Isi formulir berikut untuk mendaftar di La Masia Academy</p>
              </div>

              {/* Step Indicator */}
              <div className="register-steps">
                {steps.map((s, i) => (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div className={`register-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
                      <div className="register-step-number">
                        {step > s.num ? '✓' : s.num}
                      </div>
                      <span className="register-step-label">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`register-step-line ${step > s.num ? 'completed' : ''}`} />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="card" style={{ padding: 'var(--space-8)' }}>
                  {/* Step 1: Personal Data */}
                  {step === 1 && (
                    <div className="animate-fadeIn">
                      <h2 style={{ marginBottom: 'var(--space-6)' }}>Data Diri</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="fullName">
                            <User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            Nama Lengkap
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            className="form-input"
                            placeholder="Masukkan nama lengkap"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label" htmlFor="email">
                              <Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                              Email
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              className="form-input"
                              placeholder="email@contoh.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="phone">
                              <Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                              Nomor WhatsApp
                            </label>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              className="form-input"
                              placeholder="08xxxxxxxxxx"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Program Selection */}
                  {step === 2 && (
                    <div className="animate-fadeIn">
                      <h2 style={{ marginBottom: 'var(--space-6)' }}>Pilih Program</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {programs.map((program) => (
                          <label
                            key={program.id}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                              padding: 'var(--space-4)', border: '2px solid',
                              borderColor: formData.programId === String(program.id) ? 'var(--primary)' : 'var(--cream-200)',
                              borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                              transition: 'all 150ms ease',
                              background: formData.programId === String(program.id) ? 'rgba(139,115,85,0.04)' : '#fff'
                            }}
                          >
                            <input
                              type="radio"
                              name="programId"
                              value={program.id}
                              checked={formData.programId === String(program.id)}
                              onChange={handleChange}
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, color: 'var(--neutral-800)', marginBottom: 2 }}>{program.name}</div>
                              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
                                {program.duration} • {formatCurrency(program.price)}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <div className="animate-fadeIn">
                      <h2 style={{ marginBottom: 'var(--space-6)' }}>Informasi Pembayaran</h2>
                      
                      <p style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)' }}>
                        Silakan transfer biaya pendaftaran ke salah satu rekening berikut, kemudian upload bukti pembayaran.
                      </p>

                      <div className="payment-methods" style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="payment-method-card">
                          <div style={{ marginBottom: 'var(--space-2)' }}>
                            <Building size={20} style={{ color: 'var(--primary)' }} />
                          </div>
                          <h4>Bank BCA</h4>
                          <div className="account-number">8730-1234-5678</div>
                          <div className="account-name">La Masia Academy</div>
                        </div>
                        <div className="payment-method-card">
                          <div style={{ marginBottom: 'var(--space-2)' }}>
                            <CreditCard size={20} style={{ color: 'var(--primary)' }} />
                          </div>
                          <h4>GoPay / OVO</h4>
                          <div className="account-number">0812-3456-7890</div>
                          <div className="account-name">La Masia Academy</div>
                        </div>
                        <div className="payment-method-card">
                          <div style={{ marginBottom: 'var(--space-2)' }}>
                            <QrCode size={20} style={{ color: 'var(--primary)' }} />
                          </div>
                          <h4>QRIS</h4>
                          <div className="qris-placeholder" style={{ width: 120, height: 120 }}>
                            <QrCode size={40} />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Upload Bukti Pembayaran</label>
                        <label className={`file-upload-area ${formData.paymentFileName ? 'has-file' : ''}`}>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                          <div className="file-upload-icon">
                            <Upload size={32} />
                          </div>
                          {formData.paymentFileName ? (
                            <div className="file-upload-text">
                              <strong>✓ {formData.paymentFileName}</strong>
                              <br />
                              <span style={{ fontSize: 'var(--text-sm)' }}>Klik untuk mengganti file</span>
                            </div>
                          ) : (
                            <div className="file-upload-text">
                              <strong>Klik untuk upload</strong> atau drag & drop
                              <br />
                              <span style={{ fontSize: 'var(--text-sm)' }}>Format: JPG, PNG, PDF (Maks. 5MB)</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Confirmation */}
                  {step === 4 && (
                    <div className="animate-fadeIn">
                      <h2 style={{ marginBottom: 'var(--space-6)' }}>Konfirmasi Pendaftaran</h2>
                      <p style={{ marginBottom: 'var(--space-6)' }}>Pastikan data berikut sudah benar sebelum mengirim:</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div className="card card-cream card-flat" style={{ padding: 'var(--space-4)' }}>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Nama Lengkap</div>
                          <div style={{ fontWeight: 600 }}>{formData.fullName}</div>
                        </div>
                        <div className="form-grid">
                          <div className="card card-cream card-flat" style={{ padding: 'var(--space-4)' }}>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Email</div>
                            <div style={{ fontWeight: 600 }}>{formData.email}</div>
                          </div>
                          <div className="card card-cream card-flat" style={{ padding: 'var(--space-4)' }}>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>WhatsApp</div>
                            <div style={{ fontWeight: 600 }}>{formData.phone}</div>
                          </div>
                        </div>
                        <div className="card card-cream card-flat" style={{ padding: 'var(--space-4)' }}>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Program</div>
                          <div style={{ fontWeight: 600 }}>
                            {programs.find(p => String(p.id) === formData.programId)?.name || '-'}
                          </div>
                        </div>
                        <div className="card card-cream card-flat" style={{ padding: 'var(--space-4)' }}>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Bukti Pembayaran</div>
                          <div style={{ fontWeight: 600 }}>{formData.paymentFileName || 'Belum diupload'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="form-actions">
                    {step > 1 ? (
                      <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                        <ArrowLeft size={16} /> Kembali
                      </button>
                    ) : (
                      <div />
                    )}
                    {step < 4 ? (
                      <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
                        Lanjut <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-success btn-lg">
                        <CheckCircle size={18} /> Kirim Pendaftaran
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
