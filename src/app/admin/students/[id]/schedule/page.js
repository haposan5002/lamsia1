'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { students, studentSchedules } from '@/lib/data';
import { ArrowLeft, Clock, Plus, Edit2, Trash2, Video, X, Save, Calendar, MessageCircle, Bell, BellOff, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function StudentScheduleManager({ params }) {
  const { id } = use(params);
  const student = students.find(s => s.id === parseInt(id));
  
  const [schedules, setSchedules] = useState(
    studentSchedules.filter(s => s.studentId === parseInt(id))
  );
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sendingTestWA, setSendingTestWA] = useState(null);
  const [testWAResult, setTestWAResult] = useState(null);
  
  const [formData, setFormData] = useState({
    dayOfWeek: 'Senin',
    startTime: '16:00',
    endTime: '18:00',
    subject: '',
    duration: '2 jam',
    liveClassUrl: '',
    whatsappReminder: true,
  });

  if (!student) {
    return (
      <div className="empty-state">
        <h3>Siswa tidak ditemukan</h3>
        <p>Data siswa dengan ID {id} tidak ada.</p>
        <Link href="/admin/students" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Kembali</Link>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      dayOfWeek: 'Senin',
      startTime: '16:00',
      endTime: '18:00',
      subject: '',
      duration: '2 jam',
      liveClassUrl: '',
      whatsappReminder: true,
    });
    setShowModal(true);
  };

  const openEditModal = (sch) => {
    setEditingId(sch.id);
    setFormData({
      dayOfWeek: sch.dayOfWeek,
      startTime: sch.startTime,
      endTime: sch.endTime,
      subject: sch.subject,
      duration: sch.duration || '2 jam',
      liveClassUrl: sch.liveClassUrl || '',
      whatsappReminder: sch.whatsappReminder ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = (schId) => {
    if (window.confirm('Yakin ingin menghapus jadwal ini?')) {
      const idx = studentSchedules.findIndex(s => s.id === schId);
      if (idx !== -1) {
        studentSchedules.splice(idx, 1);
        setSchedules(studentSchedules.filter(s => s.studentId === parseInt(id)));
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      const idx = studentSchedules.findIndex(s => s.id === editingId);
      if (idx !== -1) {
        studentSchedules[idx] = { ...studentSchedules[idx], ...formData };
      }
    } else {
      // Create
      const newId = studentSchedules.length > 0 ? Math.max(...studentSchedules.map(s => s.id)) + 1 : 1;
      const newSch = { id: newId, studentId: parseInt(id), ...formData };
      studentSchedules.push(newSch);
    }
    setSchedules(studentSchedules.filter(s => s.studentId === parseInt(id)));
    setShowModal(false);
  };

  const toggleWAReminder = (schId) => {
    const idx = studentSchedules.findIndex(s => s.id === schId);
    if (idx !== -1) {
      studentSchedules[idx].whatsappReminder = !studentSchedules[idx].whatsappReminder;
      setSchedules([...studentSchedules.filter(s => s.studentId === parseInt(id))]);
    }
  };

  const sendTestWhatsApp = async (sch) => {
    setSendingTestWA(sch.id);
    setTestWAResult(null);
    try {
      // Simulasi pengiriman test (di production: panggil API /api/cron/whatsapp-reminder secara manual)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTestWAResult({ id: sch.id, success: true });
    } catch {
      setTestWAResult({ id: sch.id, success: false });
    } finally {
      setSendingTestWA(null);
      setTimeout(() => setTestWAResult(null), 4000);
    }
  };

  const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const sorted = [...schedules].sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));

  const activeReminderCount = schedules.filter(s => s.whatsappReminder && s.liveClassUrl).length;

  return (
    <div className="animate-fadeIn">
      <Link href="/admin/students" className="btn btn-ghost" style={{ marginBottom: 'var(--space-4)', padding: '0 var(--space-2)' }}>
        <ArrowLeft size={16} /> Kembali ke Data Siswa
      </Link>
      
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Kelola Jadwal Siswa</h1>
          <p>
            Mengatur jadwal dan link live class untuk <strong style={{ color: 'var(--primary-dark)' }}>{student.name}</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Tambah Jadwal
        </button>
      </div>

      {/* WhatsApp Reminder Info Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(37,211,102,0.02) 100%)',
        border: '1px solid rgba(37,211,102,0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-5)',
        marginBottom: 'var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-md)',
          background: 'rgba(37,211,102,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <MessageCircle size={22} style={{ color: '#25D366' }} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)', marginBottom: 2 }}>
            WhatsApp Reminder Otomatis
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', lineHeight: 1.5 }}>
            Notifikasi akan dikirim ke <strong>{student.phone || 'nomor belum diisi'}</strong> pada <strong>1 jam sebelum</strong> jadwal kelas yang memiliki link live class dan reminder aktif.
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          background: 'rgba(37,211,102,0.12)',
          padding: '6px 14px', borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-xs)', fontWeight: 700, color: '#128C7E',
          flexShrink: 0,
        }}>
          <Bell size={13} />
          {activeReminderCount} jadwal aktif
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div className="badge badge-pending">
            <Calendar size={14} /> Total {schedules.length} Sesi Jadwal Aktif
          </div>
          {student.phone && (
            <div className="badge" style={{ background: 'rgba(37,211,102,0.12)', color: '#128C7E', gap: 4 }}>
              <Phone size={12} /> {student.phone}
            </div>
          )}
        </div>

        {schedules.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--cream-50)', padding: 'var(--space-12)' }}>
             <Calendar size={48} style={{ color: 'var(--neutral-300)', marginBottom: 'var(--space-4)' }} />
             <h3>Belum Ada Jadwal</h3>
             <p>Siswa ini belum memiliki jadwal kelas.</p>
             <button className="btn btn-primary" onClick={openAddModal} style={{ marginTop: 'var(--space-4)' }}>
               <Plus size={16} /> Buat Jadwal Pertama
             </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Mata Pelajaran</th>
                  <th>Metode</th>
                  <th style={{ textAlign: 'center' }}>WA Reminder</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(sch => (
                  <tr key={sch.id}>
                    <td style={{ fontWeight: 600 }}>{sch.dayOfWeek}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--neutral-600)' }}>
                        <Clock size={14} /> {sch.startTime} - {sch.endTime}
                      </div>
                    </td>
                    <td>{sch.subject}</td>
                    <td>
                      {sch.liveClassUrl ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="badge badge-approved" style={{ gap: 4 }}>
                            <Video size={12} /> Online
                          </span>
                          <a href={sch.liveClassUrl} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', textDecoration: 'underline' }}>
                            Buka Link
                          </a>
                        </div>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(139,115,85,0.1)', color: 'var(--primary-dark)' }}>
                          Tatap Muka (Offline)
                        </span>
                      )}
                    </td>
                    {/* WhatsApp Reminder Toggle */}
                    <td style={{ textAlign: 'center' }}>
                      {sch.liveClassUrl ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <button
                            onClick={() => toggleWAReminder(sch.id)}
                            title={sch.whatsappReminder ? 'Nonaktifkan WA Reminder' : 'Aktifkan WA Reminder'}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              padding: '5px 12px', borderRadius: 'var(--radius-full)',
                              border: `1.5px solid ${sch.whatsappReminder ? '#25D366' : 'var(--neutral-300)'}`,
                              background: sch.whatsappReminder ? 'rgba(37,211,102,0.1)' : 'var(--cream-50)',
                              cursor: 'pointer',
                              fontSize: 'var(--text-xs)', fontWeight: 600,
                              color: sch.whatsappReminder ? '#128C7E' : 'var(--neutral-400)',
                              transition: 'all 0.25s ease',
                            }}
                          >
                            {sch.whatsappReminder ? <Bell size={13} /> : <BellOff size={13} />}
                            {sch.whatsappReminder ? 'Aktif' : 'Nonaktif'}
                          </button>
                          {/* Test send button */}
                          {sch.whatsappReminder && (
                            <button
                              onClick={() => sendTestWhatsApp(sch)}
                              disabled={sendingTestWA === sch.id}
                              title="Kirim test WA sekarang"
                              style={{
                                display: 'flex', alignItems: 'center', gap: 3,
                                padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                background: 'transparent',
                                cursor: sendingTestWA === sch.id ? 'wait' : 'pointer',
                                fontSize: '10px', fontWeight: 500,
                                color: 'var(--primary)',
                                opacity: sendingTestWA === sch.id ? 0.5 : 0.7,
                                textDecoration: 'underline',
                                textDecorationStyle: 'dotted',
                                transition: 'all 0.2s',
                              }}
                            >
                              {sendingTestWA === sch.id ? (
                                <>⏳ Mengirim...</>
                              ) : testWAResult?.id === sch.id ? (
                                testWAResult.success ? (
                                  <><CheckCircle2 size={10} /> Terkirim!</>
                                ) : (
                                  <>❌ Gagal</>
                                )
                              ) : (
                                <><Send size={10} /> Test Kirim</>
                              )}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-300)', fontStyle: 'italic' }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEditModal(sch)} title="Edit Jadwal">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => handleDelete(sch.id)} style={{ color: 'var(--error)' }} title="Hapus Jadwal">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-slideUp" style={{ maxWidth: 500 }}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            
            <h2 style={{ marginBottom: 'var(--space-5)' }}>
              {editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Hari</label>
                <select 
                  className="form-input" 
                  value={formData.dayOfWeek} 
                  onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}
                  required
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                  <option value="Minggu">Minggu</option>
                </select>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Waktu Mulai</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Waktu Selesai</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mata Pelajaran</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  placeholder="Contoh: Matematika Persiapan UTBK"
                  required
                />
              </div>

              <div className="form-group" style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--cream-200)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Video size={16} /> Link Live Class (Opsional)
                </label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={formData.liveClassUrl}
                  onChange={e => setFormData({...formData, liveClassUrl: e.target.value})}
                  placeholder="https://zoom.us/..."
                />
                <span className="form-helper">Biarkan kosong jika kelas dilakukan secara tatap muka (offline)</span>
              </div>

              {/* WhatsApp Reminder Toggle di Form */}
              <div style={{
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--cream-200)',
              }}>
                <label
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: formData.whatsappReminder ? 'rgba(37,211,102,0.06)' : 'var(--cream-50)',
                    border: `1.5px solid ${formData.whatsappReminder ? 'rgba(37,211,102,0.3)' : 'var(--cream-200)'}`,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.whatsappReminder}
                    onChange={e => setFormData({...formData, whatsappReminder: e.target.checked})}
                    style={{ display: 'none' }}
                  />
                  {/* Custom toggle */}
                  <div style={{
                    width: 40, height: 22, borderRadius: 11,
                    background: formData.whatsappReminder ? '#25D366' : 'var(--neutral-300)',
                    position: 'relative', transition: 'background 0.25s ease',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'white', position: 'absolute',
                      top: 2, left: formData.whatsappReminder ? 20 : 2,
                      transition: 'left 0.25s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 'var(--text-sm)',
                      color: formData.whatsappReminder ? '#128C7E' : 'var(--neutral-500)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <MessageCircle size={15} />
                      WhatsApp Reminder
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', marginTop: 2 }}>
                      {formData.liveClassUrl
                        ? 'Kirim notifikasi ke siswa 1 jam sebelum kelas dimulai'
                        : 'Membutuhkan link live class untuk mengaktifkan reminder'}
                    </div>
                  </div>
                </label>
                {formData.whatsappReminder && formData.liveClassUrl && (
                  <div style={{
                    marginTop: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'rgba(37,211,102,0.05)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)', color: '#128C7E',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <CheckCircle2 size={12} />
                    Notifikasi akan otomatis dikirim ke <strong style={{ margin: '0 3px' }}>{student.phone}</strong> setiap {formData.dayOfWeek} pukul {(() => {
                      const [h, m] = formData.startTime.split(':').map(Number);
                      const reminderH = h - 1;
                      return `${String(reminderH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                    })()} WIB
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, gap: 8 }}>
                  <Save size={16} /> Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
