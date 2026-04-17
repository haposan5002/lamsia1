'use client';

import { useState } from 'react';
import Link from 'next/link';
import { students, programs, studentSchedules, feedbacks, materials } from '@/lib/data';
import { Search, Calendar, MessageSquare, BookOpen, Package, Edit3, X, Save, Video, Link as LinkIcon } from 'lucide-react';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editRemaining, setEditRemaining] = useState(0);
  const [editTotal, setEditTotal] = useState(0);


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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--space-4)' }}>
        {filtered.map((student) => {
          const schedule = studentSchedules.filter(s => s.studentId === student.id);
          const studentFeedback = feedbacks.filter(f => f.studentId === student.id);
          const studentMaterials = materials.filter(m => m.programId === student.programId);
          const sessionPercent = Math.round((student.remainingSessions / student.totalSessions) * 100);
          const sessionColor = sessionPercent <= 15 ? 'var(--error)' : sessionPercent <= 40 ? 'var(--warning)' : 'var(--success)';

          return (
            <div className="card" key={student.id} style={{ padding: 'var(--space-6)' }}>
              {/* Student Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(139,115,85,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--text-lg)', flexShrink: 0
                }}>
                  {student.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--neutral-900)' }}>{student.name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>{student.email}</div>
                </div>
              </div>

              {/* Program Info */}
              <div style={{ 
                background: 'var(--cream-50)', borderRadius: 'var(--radius-md)', 
                padding: 'var(--space-3)', marginBottom: 'var(--space-4)' 
              }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>Program</div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{student.programName}</div>
              </div>

              {/* Session Quota */}
              <div style={{ 
                background: sessionPercent <= 15 ? 'var(--error-light)' : 'var(--cream-50)',
                borderRadius: 'var(--radius-md)', 
                padding: 'var(--space-3)', marginBottom: 'var(--space-4)',
                border: `1px solid ${sessionPercent <= 15 ? 'var(--error)' : 'var(--cream-200)'}`,
                borderLeftWidth: 3, borderLeftColor: sessionColor
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
                    <Package size={14} /> Sisa Sesi
                  </div>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => openEditSession(student)}
                    id={`btn-edit-session-${student.id}`}
                    style={{ height: 28, fontSize: 'var(--text-xs)', gap: 4 }}
                  >
                    <Edit3 size={12} /> Edit Sesi
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-xl)', color: sessionColor }}>
                    {student.remainingSessions}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
                    / {student.totalSessions} sesi
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 'var(--space-2)', height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${sessionPercent}%`, height: '100%', background: sessionColor, borderRadius: 2, transition: 'width 0.4s ease' }} />
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>
                    <Calendar size={12} /> Jadwal
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--primary-dark)' }}>{schedule.length}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>
                    <MessageSquare size={12} /> Feedback
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--primary-dark)' }}>{studentFeedback.length}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 2 }}>
                    <BookOpen size={12} /> Materi
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--primary-dark)' }}>{studentMaterials.length}</div>
                </div>
              </div>

              {/* Schedule Block */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--neutral-700)', marginBottom: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Jadwal & Live Class ({schedule.length})</span>
                  <Link href={`/admin/students/${student.id}/schedule`} className="btn btn-ghost btn-sm" style={{ height: 28, fontSize: 'var(--text-xs)', gap: 4 }}>
                    Kelola Jadwal
                  </Link>
                </div>
                {schedule.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    {schedule.slice(0, 3).map(sch => (
                      <div key={sch.id} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                        padding: 'var(--space-1) var(--space-2)',
                        fontSize: 'var(--text-sm)', color: 'var(--neutral-600)',
                        borderRadius: 'var(--radius-sm)', background: 'var(--cream-50)'
                      }}>
                        <span style={{ fontWeight: 500, width: 50, flexShrink: 0 }}>{sch.dayOfWeek.slice(0, 3)}</span>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sch.subject}</span>
                        {sch.liveClassUrl && <Video size={12} style={{ color: 'var(--success)' }} />}
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


    </div>
  );
}
