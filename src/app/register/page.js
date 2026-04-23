'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { programs, formatCurrency, getRandomQuestions, pretestResults, getKelasForJenjang } from '@/lib/data';
import { 
  Upload, CheckCircle, ArrowLeft, ArrowRight, User, Mail, Phone, 
  CreditCard, QrCode, Building, Package, Layers, Brain, Clock,
  AlertCircle, Award
} from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', jenjang: '', kelas: '',
    programId: '',
    packageType: '', // 'single' or 'bundle'
    paymentFile: null, paymentFileName: '',
  });

  const kelasOptions = formData.jenjang ? getKelasForJenjang(formData.jenjang) : [];
  const filteredPrograms = programs.filter(p => {
    if (formData.jenjang && p.jenjang !== formData.jenjang) return false;
    if (formData.kelas && !p.kelasTersedia.includes(Number(formData.kelas))) return false;
    return true;
  });
  const [submitted, setSubmitted] = useState(false);

  const [pretestQuestions, setPretestQuestions] = useState([]);
  const [pretestAnswers, setPretestAnswers] = useState({});
  const [pretestSubmitted, setPretestSubmitted] = useState(false);
  const [pretestScore, setPretestScore] = useState(null);
  const [pretestDetail, setPretestDetail] = useState(null);

  const selectedProgram = programs.find(p => String(p.id) === formData.programId);

  // Generate pretest questions when moving to step 3
  useEffect(() => {
    if (step === 3 && formData.programId && pretestQuestions.length === 0) {
      const questions = getRandomQuestions(Number(formData.programId), 20);
      setPretestQuestions(questions);
      setPretestAnswers({});
      setPretestSubmitted(false);
      setPretestScore(null);
    }
  }, [step, formData.programId, pretestQuestions.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, paymentFile: file, paymentFileName: file.name });
    }
  };

  const handleSelectPackage = (programId, packageType) => {
    setFormData({ ...formData, programId: String(programId), packageType });
    // Reset pretest if program changed
    setPretestQuestions([]);
    setPretestAnswers({});
    setPretestSubmitted(false);
    setPretestScore(null);
  };

  const handlePretestAnswer = (questionId, optionIndex) => {
    if (pretestSubmitted) return;
    setPretestAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitPretest = () => {
    let correct = 0;
    pretestQuestions.forEach(q => {
      if (pretestAnswers[q.id] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / pretestQuestions.length) * 100);
    const detail = {
      jumlahBenar: correct,
      jumlahSoal: pretestQuestions.length,
      waktuSelesai: new Date().toISOString(),
    };
    setPretestScore(score);
    setPretestSubmitted(true);

    // Store the result (simulates backend persistence)
    pretestResults.push({
      id: Date.now(),
      studentName: formData.fullName,
      email: formData.email,
      jenjang: formData.jenjang,
      kelas: formData.kelas,
      programId: Number(formData.programId),
      packageType: formData.packageType,
      score,
      totalQuestions: pretestQuestions.length,
      correctAnswers: correct,
      createdAt: detail.waktuSelesai,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const allPretestAnswered = pretestQuestions.length > 0 &&
    Object.keys(pretestAnswers).length === pretestQuestions.length;

  const steps = [
    { num: 1, label: 'Data Diri' },
    { num: 2, label: 'Program' },
    { num: 3, label: 'Pre-Test' },
    { num: 4, label: 'Pembayaran' },
    { num: 5, label: 'Konfirmasi' },
  ];

  const canProceedStep1 = formData.fullName && formData.email && formData.phone && formData.jenjang && formData.kelas;
  const canProceedStep2 = formData.programId && formData.packageType;
  const canProceedStep3 = pretestSubmitted;

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
              {pretestScore !== null && (
                <div style={{
                  background: 'rgba(139,115,85,0.06)',
                  border: '1px solid var(--cream-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  maxWidth: 300,
                  margin: '0 auto var(--space-4)',
                }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>Skor Pre-Test Anda</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{pretestScore}/100</div>
                </div>
              )}
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
              <div className="register-steps" style={{ overflowX: 'auto' }}>
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
                            id="fullName" name="fullName" type="text" className="form-input"
                            placeholder="Masukkan nama lengkap" value={formData.fullName}
                            onChange={handleChange} required
                          />
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label" htmlFor="email">
                              <Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Email
                            </label>
                            <input id="email" name="email" type="email" className="form-input"
                              placeholder="email@contoh.com" value={formData.email}
                              onChange={handleChange} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="phone">
                              <Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Nomor WhatsApp
                            </label>
                            <input id="phone" name="phone" type="tel" className="form-input"
                              placeholder="08xxxxxxxxxx" value={formData.phone}
                              onChange={handleChange} required />
                          </div>
                        </div>

                        {/* Jenjang & Kelas Selection */}
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label">Jenjang Pendidikan</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                              {['SD', 'SMP', 'SMA'].map(j => (
                                <button key={j} type="button"
                                  onClick={() => setFormData({ ...formData, jenjang: j, kelas: '', programId: '', packageType: '' })}
                                  style={{
                                    flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                    border: `2px solid ${formData.jenjang === j ? 'var(--primary)' : 'var(--cream-200)'}`,
                                    background: formData.jenjang === j ? 'var(--primary)' : 'white',
                                    color: formData.jenjang === j ? 'white' : 'var(--neutral-700)',
                                    fontWeight: 700, fontSize: 'var(--text-sm)', cursor: 'pointer',
                                    transition: 'all 0.2s',
                                  }}>{j}</button>
                              ))}
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Kelas</label>
                            {formData.jenjang ? (
                              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                {kelasOptions.map(k => (
                                  <button key={k} type="button"
                                    onClick={() => setFormData({ ...formData, kelas: String(k), programId: '', packageType: '' })}
                                    style={{
                                      flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                      border: `2px solid ${formData.kelas === String(k) ? 'var(--primary)' : 'var(--cream-200)'}`,
                                      background: formData.kelas === String(k) ? 'var(--primary)' : 'white',
                                      color: formData.kelas === String(k) ? 'white' : 'var(--neutral-700)',
                                      fontWeight: 700, fontSize: 'var(--text-sm)', cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}>Kelas {k}</button>
                                ))}
                              </div>
                            ) : (
                              <div style={{ padding: 'var(--space-3)', background: 'var(--cream-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', textAlign: 'center' }}>
                                Pilih jenjang terlebih dahulu
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Program Selection — Single Pack vs Bundle */}
                  {step === 2 && (
                    <div className="animate-fadeIn">
                      <h2 style={{ marginBottom: 'var(--space-2)' }}>Pilih Program</h2>
                      <p style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                        Pilih jenjang dan paket yang sesuai dengan kebutuhan Anda
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {filteredPrograms.map((program) => {
                          const isSelectedSingle = formData.programId === String(program.id) && formData.packageType === 'single';
                          const isSelectedBundle = formData.programId === String(program.id) && formData.packageType === 'bundle';

                          return (
                            <div key={program.id}>
                              {/* Program header */}
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                                marginBottom: 'var(--space-3)',
                                paddingBottom: 'var(--space-2)',
                                borderBottom: '2px solid var(--cream-200)',
                              }}>
                                <Brain size={18} style={{ color: 'var(--primary)' }} />
                                <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontFamily: 'var(--font-sans)' }}>
                                  {program.name}
                                </h3>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                {/* Single Pack (Left) */}
                                <div
                                  onClick={() => handleSelectPackage(program.id, 'single')}
                                  style={{
                                    padding: 'var(--space-5)',
                                    border: `2px solid ${isSelectedSingle ? 'var(--primary)' : 'var(--cream-200)'}`,
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: isSelectedSingle ? 'rgba(139,115,85,0.04)' : 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {isSelectedSingle && (
                                    <div style={{
                                      position: 'absolute', top: 12, right: 12,
                                      width: 24, height: 24, borderRadius: '50%',
                                      background: 'var(--primary)',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                      <CheckCircle size={14} style={{ color: 'white' }} />
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                    <Package size={20} style={{ color: 'var(--primary)' }} />
                                    <span style={{
                                      fontSize: 'var(--text-xs)', fontWeight: 700,
                                      background: 'var(--cream-100)', color: 'var(--primary)',
                                      padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                    }}>SINGLE PACK</span>
                                  </div>
                                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--neutral-800)', marginBottom: 4 }}>
                                    {formatCurrency(program.singlePackPrice)}
                                  </div>
                                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={13} /> {program.singlePackDuration}
                                  </div>
                                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {program.singlePackFeatures.map((f, i) => (
                                      <li key={i} style={{
                                        fontSize: 'var(--text-sm)', color: 'var(--neutral-600)',
                                        padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6,
                                      }}>
                                        <span style={{ color: 'var(--primary)', fontSize: '10px' }}>●</span> {f}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Bundle Pack (Right) */}
                                <div
                                  onClick={() => handleSelectPackage(program.id, 'bundle')}
                                  style={{
                                    padding: 'var(--space-5)',
                                    border: `2px solid ${isSelectedBundle ? 'var(--primary)' : 'var(--cream-200)'}`,
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: isSelectedBundle ? 'rgba(139,115,85,0.04)' : 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {/* Popular badge */}
                                  <div style={{
                                    position: 'absolute', top: 0, right: 0,
                                    background: 'var(--primary)', color: 'white',
                                    padding: '4px 12px', borderRadius: '0 0 0 var(--radius-md)',
                                    fontSize: 'var(--text-xs)', fontWeight: 700,
                                  }}>
                                    ⭐ POPULER
                                  </div>
                                  {isSelectedBundle && (
                                    <div style={{
                                      position: 'absolute', top: 32, right: 12,
                                      width: 24, height: 24, borderRadius: '50%',
                                      background: 'var(--primary)',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                      <CheckCircle size={14} style={{ color: 'white' }} />
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                    <Layers size={20} style={{ color: 'var(--primary)' }} />
                                    <span style={{
                                      fontSize: 'var(--text-xs)', fontWeight: 700,
                                      background: 'var(--primary)', color: 'white',
                                      padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                    }}>BUNDLING</span>
                                  </div>
                                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--neutral-800)', marginBottom: 4 }}>
                                    {formatCurrency(program.price)}
                                  </div>
                                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={13} /> {program.duration}
                                  </div>
                                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {program.features.map((f, i) => (
                                      <li key={i} style={{
                                        fontSize: 'var(--text-sm)', color: 'var(--neutral-600)',
                                        padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6,
                                      }}>
                                        <span style={{ color: 'var(--primary)', fontSize: '10px' }}>●</span> {f}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Pre-Test */}
                  {step === 3 && (
                    <div className="animate-fadeIn">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <Brain size={24} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ margin: 0 }}>Pre-Test</h2>
                      </div>
                      <p style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                        Kerjakan soal berikut untuk mengukur kemampuan awal Anda.
                        Program: <strong>{selectedProgram?.name}</strong> •
                        Total: <strong>{pretestQuestions.length} soal</strong>
                      </p>

                      {/* Score display */}
                      {pretestSubmitted && pretestScore !== null && (
                        <div style={{
                          background: pretestScore >= 70 ? 'rgba(34,197,94,0.06)' : pretestScore >= 40 ? 'rgba(234,179,8,0.06)' : 'rgba(239,68,68,0.06)',
                          border: `2px solid ${pretestScore >= 70 ? 'rgba(34,197,94,0.3)' : pretestScore >= 40 ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'}`,
                          borderRadius: 'var(--radius-lg)',
                          padding: 'var(--space-6)',
                          textAlign: 'center',
                          marginBottom: 'var(--space-6)',
                        }}>
                          <Award size={40} style={{
                            color: pretestScore >= 70 ? '#22c55e' : pretestScore >= 40 ? '#eab308' : '#ef4444',
                            marginBottom: 'var(--space-2)',
                          }} />
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--neutral-800)' }}>
                            {pretestScore}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--neutral-500)' }}>/100</span>
                          </div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginTop: 4 }}>
                            Benar: {pretestQuestions.filter(q => pretestAnswers[q.id] === q.correctIndex).length} dari {pretestQuestions.length} soal
                          </div>
                          <div style={{
                            marginTop: 'var(--space-3)',
                            fontSize: 'var(--text-sm)', fontWeight: 600,
                            color: pretestScore >= 70 ? '#16a34a' : pretestScore >= 40 ? '#ca8a04' : '#dc2626',
                          }}>
                            {pretestScore >= 70 ? '🎉 Excellent! Kemampuan dasar Anda sangat baik' :
                             pretestScore >= 40 ? '💪 Bagus! Masih ada ruang untuk peningkatan' :
                             '📚 Tenang, kami akan bantu tingkatkan kemampuan Anda'}
                          </div>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', marginTop: 'var(--space-2)' }}>
                            Hasil ini telah dikirimkan ke admin untuk penentuan golongan kelas Anda
                          </p>
                        </div>
                      )}

                      {/* Questions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {pretestQuestions.map((q, idx) => {
                          const userAnswer = pretestAnswers[q.id];
                          const isAnswered = userAnswer !== undefined;
                          const optionLabels = ['A', 'B', 'C', 'D'];

                          return (
                            <div key={q.id} style={{
                              padding: 'var(--space-4)',
                              border: '1px solid var(--cream-200)',
                              borderRadius: 'var(--radius-lg)',
                              background: pretestSubmitted
                                ? (userAnswer === q.correctIndex ? 'rgba(34,197,94,0.03)' : 'rgba(239,68,68,0.03)')
                                : 'white',
                            }}>
                              <div style={{
                                display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                                marginBottom: 'var(--space-3)',
                              }}>
                                <span style={{
                                  width: 28, height: 28, borderRadius: 'var(--radius-md)', flexShrink: 0,
                                  background: isAnswered ? 'var(--primary)' : 'var(--cream-100)',
                                  color: isAnswered ? 'white' : 'var(--neutral-500)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: 700, fontSize: 'var(--text-xs)',
                                }}>
                                  {idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)', lineHeight: 1.6 }}>
                                  {q.text}
                                </span>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', paddingLeft: 'calc(28px + var(--space-3))' }}>
                                {q.options.map((opt, i) => {
                                  const isSelected = userAnswer === i;
                                  const isCorrect = q.correctIndex === i;
                                  let borderColor = 'var(--cream-200)';
                                  let bg = 'white';

                                  if (pretestSubmitted) {
                                    if (isCorrect) {
                                      borderColor = '#22c55e';
                                      bg = 'rgba(34,197,94,0.06)';
                                    } else if (isSelected && !isCorrect) {
                                      borderColor = '#ef4444';
                                      bg = 'rgba(239,68,68,0.06)';
                                    }
                                  } else if (isSelected) {
                                    borderColor = 'var(--primary)';
                                    bg = 'rgba(139,115,85,0.06)';
                                  }

                                  return (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => handlePretestAnswer(q.id, i)}
                                      disabled={pretestSubmitted}
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                                        padding: 'var(--space-2) var(--space-3)',
                                        border: `2px solid ${borderColor}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: bg,
                                        cursor: pretestSubmitted ? 'default' : 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.15s ease',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--neutral-700)',
                                      }}
                                    >
                                      <span style={{
                                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                        border: `2px solid ${isSelected && !pretestSubmitted ? 'var(--primary)' : pretestSubmitted && isCorrect ? '#22c55e' : 'var(--neutral-300)'}`,
                                        background: isSelected && !pretestSubmitted ? 'var(--primary)' : pretestSubmitted && isCorrect ? '#22c55e' : pretestSubmitted && isSelected ? '#ef4444' : 'white',
                                        color: (isSelected || (pretestSubmitted && isCorrect)) ? 'white' : 'var(--neutral-500)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '10px',
                                      }}>
                                        {optionLabels[i]}
                                      </span>
                                      <span>{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Submit Pretest Button */}
                      {!pretestSubmitted && pretestQuestions.length > 0 && (
                        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 'var(--space-3)' }}>
                            Terjawab: <strong>{Object.keys(pretestAnswers).length}</strong> / {pretestQuestions.length}
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmitPretest}
                            disabled={!allPretestAnswered}
                            style={{
                              opacity: allPretestAnswered ? 1 : 0.5,
                              cursor: allPretestAnswered ? 'pointer' : 'not-allowed',
                            }}
                          >
                            <Brain size={18} /> Submit Pre-Test
                          </button>
                          {!allPretestAnswered && (
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                              <AlertCircle size={12} /> Jawab semua soal terlebih dahulu
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Payment */}
                  {step === 4 && (
                    <div className="animate-fadeIn">
                      <h2 style={{ marginBottom: 'var(--space-6)' }}>Informasi Pembayaran</h2>
                      
                      {/* Show selected package summary */}
                      {selectedProgram && (
                        <div style={{
                          background: 'rgba(139,115,85,0.04)',
                          border: '1px solid var(--cream-200)',
                          borderRadius: 'var(--radius-lg)',
                          padding: 'var(--space-4)',
                          marginBottom: 'var(--space-4)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                          <div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>Paket Dipilih</div>
                            <div style={{ fontWeight: 600, color: 'var(--neutral-800)' }}>
                              {selectedProgram.name} — {formData.packageType === 'single' ? 'Single Pack' : 'Bundling'}
                            </div>
                          </div>
                          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)' }}>
                            {formatCurrency(formData.packageType === 'single' ? selectedProgram.singlePackPrice : selectedProgram.price)}
                          </div>
                        </div>
                      )}

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

                  {/* Step 5: Confirmation */}
                  {step === 5 && (
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
                        <div className="form-grid">
                          <div className="card card-cream card-flat" style={{ padding: 'var(--space-4)' }}>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Program</div>
                            <div style={{ fontWeight: 600 }}>
                              {selectedProgram?.name || '-'}
                            </div>
                          </div>
                          <div className="card card-cream card-flat" style={{ padding: 'var(--space-4)' }}>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Paket</div>
                            <div style={{ fontWeight: 600 }}>
                              {formData.packageType === 'single' ? `Single Pack — ${formatCurrency(selectedProgram?.singlePackPrice)}` : `Bundling — ${formatCurrency(selectedProgram?.price)}`}
                            </div>
                          </div>
                        </div>
                        {pretestScore !== null && (
                          <div className="card card-cream card-flat" style={{ padding: 'var(--space-4)' }}>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>Skor Pre-Test</div>
                            <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 'var(--text-lg)' }}>
                              {pretestScore}/100
                            </div>
                          </div>
                        )}
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
                    {step < 5 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setStep(step + 1)}
                        disabled={
                          (step === 1 && !canProceedStep1) ||
                          (step === 2 && !canProceedStep2) ||
                          (step === 3 && !canProceedStep3)
                        }
                        style={{
                          opacity: (step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2) || (step === 3 && !canProceedStep3) ? 0.5 : 1,
                          cursor: (step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2) || (step === 3 && !canProceedStep3) ? 'not-allowed' : 'pointer',
                        }}
                      >
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
