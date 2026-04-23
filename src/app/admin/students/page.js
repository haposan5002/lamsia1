'use client';

import { useState } from 'react';
import Link from 'next/link';
import { students, programs, studentSchedules, feedbacks, materials } from '@/lib/data';
import { Search, Calendar, MessageSquare, BookOpen, Package, Edit3, X, Save, Video, Link as LinkIcon, Phone, MessageCircle, Bell, Award } from 'lucide-react';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editRemaining, setEditRemaining] = useState(0);
  const [editTotal, setEditTotal] = useState(0);

  // Package Management State (Template)
  const [managingPackageStudent, setManagingPackageStudent] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedPackageType, setSelectedPackageType] = useState('single'); // 'single' | 'bundle'
  const [selectedPackageId, setSelectedPackageId] = useState('');

  // Scores & Feedback State
  const [managingScoresStudent, setManagingScoresStudent] = useState(null);
  const [feedbackScoreId, setFeedbackScoreId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEditSession = (student) => {
    setEditingStudent(student);
    setEditRemaining(student.remainingSessions);
    setEditTotal(student.totalSessions);
  };

  const saveSession = () => {
    if (editingStudent) {
      // Update mock data directly (in a real app this would be an API call)
      const idx = students.findIndex(s => s.id === editingStudent.id);
      if (idx !== -1) {
        students[idx].remainingSessions = editRemaining;
        students[idx].totalSessions = editTotal;
      }
      setEditingStudent(null);
    }
  };

  const openManagePackage = (student) => {
    setManagingPackageStudent(student);
    setSelectedProgram('');
    setSelectedPackageType('single');
    setSelectedPackageId('');
  };

  const savePackageSync = () => {
    // In a real app, this would synchronize the purchased package (single/bundle)
    // and update the student's programIds, remainingSessions, and totalSessions.
    if (managingPackageStudent) {
      alert(`Sinkronisasi berhasil untuk ${managingPackageStudent.name}:\nProgram/Paket baru telah ditambahkan dan sesi diperbarui.`);
      setManagingPackageStudent(null);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1>Manajemen Siswa</h1>
          <p>Kelola data siswa aktif, sesi belajar, jadwal, dan feedback</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: 'var(--space-6)' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Cari siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 36 }}
        />
      </div>

      {/* Student Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {filtered.map((student) => {
          const schedule = studentSchedules.filter(s => s.studentId === student.id);
          const studentFeedback = feedbacks.filter(f => f.studentId === student.id);
          const studentMaterials = materials.filter(m => 
            m.assignedStudentIds && m.assignedStudentIds.includes(student.id)
          );
          const sessionPercent = Math.round((student.remainingSessions / student.totalSessions) * 100);
          const sessionColor = sessionPercent <= 15 ? 'var(--error)' : sessionPercent <= 40 ? 'var(--warning)' : 'var(--success)';
          const waReminderCount = schedule.filter(s => s.whatsappReminder && s.liveClassUrl).length;

          return (
            <div className="card" key={student.id} style={{ padding: 'var(--space-4)' }}>
              {/* Student Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(139,115,85,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--text-md)', flexShrink: 0
                }}>
                  {student.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-900)' }}>{student.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>{student.email}</div>
                  {student.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', color: 'var(--neutral-400)', marginTop: 2 }}>
                      <Phone size={10} /> {student.phone}
                    </div>
                  )}
                </div>
                {waReminderCount > 0 && (
                  <div title={`${waReminderCount} jadwal dengan WA reminder aktif`} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '2px 8px', borderRadius: 'var(--radius-full)',
                    background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
                    fontSize: '10px', fontWeight: 600, color: '#128C7E',
                    flexShrink: 0,
                  }}>
                    <MessageCircle size={10} /> {waReminderCount}
                  </div>
                )}
              </div>

              {/* Program Info */}
              <div style={{ 
                background: 'var(--cream-50)', borderRadius: 'var(--radius-md)', 
                padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-3)' 
              }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: '4px' }}>Program</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {programs.filter(p => student?.programIds?.includes(p.id)).map(p => (
                    <span key={p.id} style={{ 
                      fontSize: 'var(--text-xs)', 
                      fontWeight: 600,
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '999px'
                    }}>
                      {p.name}
                    </span>
                  ))}
                  {(!student.programIds || student.programIds.length === 0) && '-'}
                </div>
              </div>

              {/* Session Quota */}
              <div style={{ 
                background: sessionPercent <= 15 ? 'var(--error-light)' : 'var(--cream-50)',
                borderRadius: 'var(--radius-md)', 
                padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-3)',
                border: `1px solid ${sessionPercent <= 15 ? 'var(--error)' : 'var(--cream-200)'}`,
                borderLeftWidth: 3, borderLeftColor: sessionColor
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>
                    <Package size={12} /> Sisa Sesi
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => openManagePackage(student)}
                      title="Kelola Paket / Program"
                      style={{ height: 24, padding: '0 6px', fontSize: '10px', gap: 4 }}
                    >
                      <Package size={10} /> Paket
                    </button>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEditSession(student)}
                      id={`btn-edit-session-${student.id}`}
                      title="Edit Sisa Sesi"
                      style={{ height: 24, padding: '0 6px', fontSize: '10px', gap: 4 }}
                    >
                      <Edit3 size={10} /> Sesi
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: sessionColor }}>
                    {student.remainingSessions}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>
                    / {student.totalSessions} sesi
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 'var(--space-2)', height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${sessionPercent}%`, height: '100%', background: sessionColor, borderRadius: 2, transition: 'width 0.4s ease' }} />
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: 2 }}>
                    <Calendar size={12} /> Jadwal
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--primary-dark)' }}>{schedule.length}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: 2 }}>
                    <MessageSquare size={12} /> Feedback
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--primary-dark)' }}>{studentFeedback.length}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: 2 }}>
                    <BookOpen size={12} /> Materi
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--primary-dark)' }}>{studentMaterials.length}</div>
                </div>
                <div 
                  style={{ textAlign: 'center', cursor: 'pointer', background: 'var(--cream-50)', borderRadius: 'var(--radius-sm)', padding: '4px 0' }}
                  onClick={() => setManagingScoresStudent(student)}
                  title="Kelola Nilai & Feedback"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: 2 }}>
                    <Award size={12} /> Nilai
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--primary-dark)' }}>
                    {student.hasCompletedLevelTest ? '1' : '0'}
                  </div>
                </div>
              </div>

              {/* Schedule Block */}
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--neutral-700)', marginBottom: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Jadwal & Live Class ({schedule.length})</span>
                  <Link href={`/admin/students/${student.id}/schedule`} className="btn btn-ghost btn-sm" style={{ height: 24, padding: '0 6px', fontSize: '10px', gap: 4 }}>
                    Kelola
                  </Link>
                </div>
                {schedule.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    {schedule.slice(0, 3).map(sch => (
                      <div key={sch.id} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                        padding: 'var(--space-1) var(--space-2)',
                        fontSize: 'var(--text-xs)', color: 'var(--neutral-600)',
                        borderRadius: 'var(--radius-sm)', background: 'var(--cream-50)'
                      }}>
                        <span style={{ fontWeight: 500, width: 40, flexShrink: 0 }}>{sch.dayOfWeek.slice(0, 3)}</span>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sch.subject}</span>
                        {sch.liveClassUrl && <Video size={12} style={{ color: 'var(--success)' }} />}
                        {sch.whatsappReminder && sch.liveClassUrl && <Bell size={11} style={{ color: '#25D366' }} title="WA Reminder Aktif" />}
                      </div>
                    ))}
                    {schedule.length > 3 && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', textAlign: 'center', marginTop: 4 }}>
                        +{schedule.length - 3} jadwal lainnya
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', fontStyle: 'italic', padding: 'var(--space-2)', background: 'var(--cream-50)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    Belum ada jadwal
                  </div>
                )}
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', fontFamily: 'var(--font-mono)' }}>
                Bergabung: {student.joinedAt}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <h3>Tidak ada siswa ditemukan</h3>
          <p>Coba ubah kata kunci pencarian Anda.</p>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingStudent && (
        <div className="modal-overlay" id="edit-session-modal">
          <div className="modal-content animate-slideUp">
            <button className="modal-close" onClick={() => setEditingStudent(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{ 
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(139,115,85,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--text-md)'
              }}>
                {editingStudent.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', marginBottom: 0 }}>Edit Sesi</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', margin: 0 }}>{editingStudent.name}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Sisa Sesi (Remaining Sessions)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editRemaining}
                  onChange={(e) => setEditRemaining(parseInt(e.target.value) || 0)}
                  min={0}
                  id="input-remaining-sessions"
                />
                <span className="form-helper">Jumlah sesi yang masih tersedia untuk siswa</span>
              </div>

              <div className="form-group">
                <label className="form-label">Total Sesi (Total Sessions)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editTotal}
                  onChange={(e) => setEditTotal(parseInt(e.target.value) || 0)}
                  min={1}
                  id="input-total-sessions"
                />
                <span className="form-helper">Total sesi dari paket yang dibeli siswa</span>
              </div>

              {/* Preview */}
              <div style={{ 
                background: 'var(--cream-50)', borderRadius: 'var(--radius-md)', 
                padding: 'var(--space-3)', textAlign: 'center' 
              }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 'var(--space-1)' }}>Preview</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ 
                    fontWeight: 700, fontSize: 'var(--text-2xl)',
                    color: editRemaining === 0 ? 'var(--error)' : editRemaining <= 3 ? 'var(--warning)' : 'var(--success)'
                  }}>
                    {editRemaining}
                  </span>
                  <span style={{ color: 'var(--neutral-500)' }}>/ {editTotal} sesi</span>
                </div>
                {editRemaining === 0 && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginTop: 'var(--space-1)' }}>
                    ⚠ Siswa akan melihat popup perpanjangan
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button className="btn btn-secondary" onClick={() => setEditingStudent(null)} style={{ flex: 1 }}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={saveSession} style={{ flex: 1, gap: 'var(--space-2)' }} id="btn-save-session">
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Manage Package Sync Modal (Template Frontend) */}
      {managingPackageStudent && (
        <div className="modal-overlay">
          <div className="modal-content animate-slideUp" style={{ maxWidth: 500 }}>
            <button className="modal-close" onClick={() => setManagingPackageStudent(null)}>
              <X size={20} />
            </button>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', marginBottom: 4 }}>Sinkronisasi Paket & Program</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', margin: 0 }}>
                Atur paket pembelajaran untuk <strong>{managingPackageStudent.name}</strong>
              </p>
            </div>

            {/* Template Information Alert */}
            <div style={{ 
              background: 'rgba(139,115,85,0.1)', border: '1px solid var(--primary-light)', 
              borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-4)',
              fontSize: 'var(--text-xs)', color: 'var(--primary-dark)'
            }}>
              <strong>Template Info:</strong> Form ini adalah model frontend untuk sinkronisasi. 
              Pilihan &quot;Single Program&quot; akan menambah 1 sesi dari program reguler (harga satuan),
              sedangkan &quot;Bundle Package&quot; akan menambah keseluruhan sesi paket (misal 24 sesi).
              Data akan diintegrasikan dengan sistem payment di backend.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Select Program Context */}
              <div className="form-group">
                <label className="form-label">Pilih Program Dasar</label>
                <select 
                  className="form-select" 
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                >
                  <option value="">-- Pilih Program --</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {selectedProgram && (
                <>
                  <div className="form-group">
                    <label className="form-label">Tipe Pembelian</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                      <div 
                        onClick={() => setSelectedPackageType('single')}
                        style={{ 
                          border: `1px solid ${selectedPackageType === 'single' ? 'var(--primary)' : 'var(--neutral-300)'}`,
                          background: selectedPackageType === 'single' ? 'var(--cream-50)' : 'white',
                          padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Single Program</span>
                        <span style={{ fontSize: '10px', color: 'var(--neutral-500)' }}>1 Sesi / Pertemuan</span>
                      </div>
                      <div 
                        onClick={() => setSelectedPackageType('bundle')}
                        style={{ 
                          border: `1px solid ${selectedPackageType === 'bundle' ? 'var(--primary)' : 'var(--neutral-300)'}`,
                          background: selectedPackageType === 'bundle' ? 'var(--cream-50)' : 'white',
                          padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Bundle Package</span>
                        <span style={{ fontSize: '10px', color: 'var(--neutral-500)' }}>Paket Bulanan (Sesi Banyak)</span>
                      </div>
                    </div>
                  </div>

                  {selectedPackageType === 'bundle' && (
                    <div className="form-group animate-fadeIn">
                      <label className="form-label">Pilih Paket Bundle</label>
                      <select 
                        className="form-select"
                        value={selectedPackageId}
                        onChange={(e) => setSelectedPackageId(e.target.value)}
                      >
                        <option value="">-- Pilih Paket Bundle --</option>
                        {/* Assuming a global import 'packages' or mock data exist. For now, mock it: */}
                        <option value="1">Paket 1 Bulan (8 Sesi)</option>
                        <option value="2">Paket 3 Bulan (24 Sesi)</option>
                        <option value="3">Paket 6 Bulan (48 Sesi)</option>
                      </select>
                    </div>
                  )}

                  {/* Summary Box */}
                  <div style={{ background: '#f8fafc', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#475569', marginBottom: 8 }}>Ringkasan Penambahan:</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 4 }}>
                      <span style={{ color: '#64748b' }}>Sesi Saat Ini:</span>
                      <span style={{ fontWeight: 500 }}>{managingPackageStudent.remainingSessions} Sesi</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 4 }}>
                      <span style={{ color: '#64748b' }}>Penambahan:</span>
                      <span style={{ fontWeight: 500, color: 'var(--success)' }}>
                        + {selectedPackageType === 'single' ? '1' : (selectedPackageId ? (selectedPackageId === '1' ? '8' : selectedPackageId === '2' ? '24' : '48') : '0')} Sesi
                      </span>
                    </div>
                    <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                      <span>Total Sesi Baru:</span>
                      <span style={{ color: 'var(--primary-dark)' }}>
                        {managingPackageStudent.remainingSessions + (selectedPackageType === 'single' ? 1 : (selectedPackageId ? (selectedPackageId === '1' ? 8 : selectedPackageId === '2' ? 24 : 48) : 0))} Sesi
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button className="btn btn-secondary" onClick={() => setManagingPackageStudent(null)} style={{ flex: 1 }}>
                Batal
              </button>
              <button 
                className="btn btn-primary" 
                onClick={savePackageSync} 
                style={{ flex: 1, gap: 'var(--space-2)' }}
                disabled={!selectedProgram || (selectedPackageType === 'bundle' && !selectedPackageId)}
              >
                <Save size={16} /> Sinkronisasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Scores Modal */}
      {managingScoresStudent && (
        <div className="modal-overlay">
          <div className="modal-content animate-slideUp" style={{ maxWidth: 650 }}>
            <button className="modal-close" onClick={() => { setManagingScoresStudent(null); setFeedbackScoreId(null); }}>
              <X size={20} />
            </button>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', marginBottom: 4 }}>Nilai & Hasil Evaluasi</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', margin: 0 }}>
                Siswa: <strong>{managingScoresStudent.name}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead style={{ background: 'var(--neutral-50)', textAlign: 'left', borderBottom: '1px solid var(--neutral-200)' }}>
                    <tr>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 600, color: 'var(--neutral-700)' }}>Jenis Evaluasi</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 600, color: 'var(--neutral-700)' }}>Tanggal</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 600, color: 'var(--neutral-700)', textAlign: 'center' }}>Nilai</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 600, color: 'var(--neutral-700)', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managingScoresStudent.hasCompletedLevelTest && (
                      <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                        <td style={{ padding: 'var(--space-3)' }}>Level Test (Pre-Test)</td>
                        <td style={{ padding: 'var(--space-3)', color: 'var(--neutral-500)' }}>14 Apr 2026</td>
                        <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                          <span style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                            85
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                          <button 
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              setFeedbackScoreId('level-test');
                              setFeedbackText('');
                            }}
                          >
                            Beri Feedback
                          </button>
                        </td>
                      </tr>
                    )}
                    
                    <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                      <td style={{ padding: 'var(--space-3)' }}>Tryout Persiapan UTBK</td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--neutral-500)' }}>20 Apr 2026</td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        <span style={{ background: 'var(--warning-light)', color: 'var(--warning)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                          65
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setFeedbackScoreId('tryout-1');
                            setFeedbackText('');
                          }}
                        >
                          Beri Feedback
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Feedback Form */}
              {feedbackScoreId && (
                <div className="animate-fadeIn" style={{ background: 'var(--cream-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-200)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                    Kirim Feedback untuk {feedbackScoreId === 'level-test' ? 'Level Test (Pre-Test)' : 'Tryout Persiapan UTBK'}
                  </h4>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Tuliskan analisis, evaluasi, atau saran perbaikan untuk siswa terkait hasil ujian ini..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    style={{ marginBottom: 'var(--space-3)', resize: 'vertical' }}
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setFeedbackScoreId(null)}>Batal</button>
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => {
                        alert('Feedback berhasil disimpan dan akan dikirim ke siswa!');
                        setFeedbackScoreId(null);
                        setFeedbackText('');
                      }}
                      disabled={!feedbackText.trim()}
                    >
                      Simpan Feedback
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 'var(--space-6)', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => { setManagingScoresStudent(null); setFeedbackScoreId(null); }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
