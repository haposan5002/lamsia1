'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { students, studentSchedules } from '@/lib/data';
import { ArrowLeft, Clock, Plus, Edit2, Trash2, Video, X, Save, Calendar } from 'lucide-react';

export default function StudentScheduleManager({ params }) {
  const { id } = use(params);
  const student = students.find(s => s.id === parseInt(id));
  
  const [schedules, setSchedules] = useState(
    studentSchedules.filter(s => s.studentId === parseInt(id))
  );
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    dayOfWeek: 'Senin',
    startTime: '16:00',
    endTime: '18:00',
    subject: '',
    duration: '2 jam',
    liveClassUrl: ''
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
      liveClassUrl: ''
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
      liveClassUrl: sch.liveClassUrl || ''
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

  const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const sorted = [...schedules].sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));

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

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <div className="badge badge-pending">
            <Calendar size={14} /> Total {schedules.length} Sesi Jadwal Aktif
          </div>
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
