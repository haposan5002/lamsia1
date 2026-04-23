'use client';

import { useState } from 'react';
import { materials as initialMaterials, programs, students, formatDateTime } from '@/lib/data';
import {
  Lock, Unlock, FileText, Video, Brain, Plus, Search, Upload,
  Users, X, CheckSquare, Square, UserCheck, Pencil, Trash2,
  CalendarClock, Clock, Calendar
} from 'lucide-react';

const typeIcons = {
  document: FileText,
  video: Video,
  quiz: Brain,
};

const typeLabels = {
  document: 'Dokumen',
  video: 'Video',
  quiz: 'Tryout/Kuis',
};

// ─── Reusable: Student Selector ────────────────────────────────────────────
function StudentSelector({ programId, selectedStudents, onChange }) {
  const available = programId
    ? students.filter(s => s.programIds?.includes(Number(programId)) || s.programId === Number(programId))
    : [];

  // fallback: jika students tidak punya programIds, coba langsung tampilkan semua
  const allStudents = available.length > 0 ? available : (programId ? students : []);

  const allSelected =
    allStudents.length > 0 && allStudents.every(s => selectedStudents.includes(s.id));

  const toggle = (id) => {
    onChange(
      selectedStudents.includes(id)
        ? selectedStudents.filter(x => x !== id)
        : [...selectedStudents, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      onChange(selectedStudents.filter(id => !allStudents.find(s => s.id === id)));
    } else {
      onChange([...new Set([...selectedStudents, ...allStudents.map(s => s.id)])]);
    }
  };

  return (
    <div style={{
      border: '1px solid var(--cream-200)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: 'var(--space-4)',
    }}>
      <div style={{
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--cream-50)',
        borderBottom: '1px solid var(--cream-200)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Users size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-700)' }}>
            Pilih Siswa Penerima
          </span>
          {selectedStudents.length > 0 && (
            <span style={{
              background: 'var(--primary)', color: 'white',
              borderRadius: 'var(--radius-full)', padding: '1px 8px',
              fontSize: 'var(--text-xs)', fontWeight: 600,
            }}>
              {selectedStudents.length} dipilih
            </span>
          )}
        </div>
        {allStudents.length > 0 && (
          <button type="button" onClick={toggleAll} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 600,
            padding: '4px 8px', borderRadius: 'var(--radius-sm)',
          }}>
            {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
            {allSelected ? 'Batal Semua' : 'Pilih Semua'}
          </button>
        )}
      </div>

      <div style={{ padding: 'var(--space-3) var(--space-4)', maxHeight: 200, overflowY: 'auto' }}>
        {!programId ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-5)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
            Pilih program terlebih dahulu
          </div>
        ) : allStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-5)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
            Tidak ada siswa di program ini
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {allStudents.map(s => {
              const sel = selectedStudents.includes(s.id);
              return (
                <label key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: sel ? 'rgba(139,115,85,0.06)' : 'transparent',
                  border: `1px solid ${sel ? 'var(--primary)' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}>
                  <input type="checkbox" checked={sel} onChange={() => toggle(s.id)} style={{ display: 'none' }} />
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${sel ? 'var(--primary)' : 'var(--neutral-300)'}`,
                    background: sel ? 'var(--primary)' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    {sel && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: sel ? 'rgba(139,115,85,0.15)' : 'var(--cream-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--text-sm)',
                  }}>
                    {s.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: sel ? 600 : 500, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)' }}>{s.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)' }}>{s.email}</div>
                  </div>
                  {sel && <UserCheck size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Modal: Atur Jadwal ─────────────────────────────────────────────────────
function ScheduleModal({ material, onClose, onSave }) {
  const [isLocked, setIsLocked] = useState(material.isLocked);
  const [unlockAt, setUnlockAt] = useState(
    material.unlockAt ? material.unlockAt.slice(0, 16) : ''
  );

  const handleSave = () => {
    onSave({
      isLocked,
      unlockAt: isLocked && unlockAt ? new Date(unlockAt).toISOString() : null,
    });
  };

  return (
    <div className="modal-overlay" id="schedule-modal">
      <div className="modal-content animate-slideUp" style={{ maxWidth: 440 }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <CalendarClock size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-sans)', margin: 0, fontSize: 'var(--text-md)' }}>
              Atur Jadwal Materi
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', margin: 0 }}>
            {material.title}
          </p>
        </div>

        {/* Status */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label className="form-label">Status Akses Materi</label>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            {[
              { value: false, label: '🔓 Terbuka', desc: 'Siswa bisa akses sekarang' },
              { value: true, label: '🔒 Terkunci', desc: 'Siswa belum bisa akses' },
            ].map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setIsLocked(opt.value)}
                style={{
                  flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                  border: `2px solid ${isLocked === opt.value ? 'var(--primary)' : 'var(--cream-200)'}`,
                  background: isLocked === opt.value ? 'rgba(139,115,85,0.06)' : 'white',
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)', marginBottom: 2 }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)' }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tanggal Buka Otomatis — hanya tampil jika Terkunci */}
        {isLocked && (
          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label">
              <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Buka Otomatis Pada (opsional)
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={unlockAt}
              onChange={e => setUnlockAt(e.target.value)}
            />
            {unlockAt && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', marginTop: 4 }}>
                <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                Materi akan otomatis terbuka: <strong>{new Date(unlockAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</strong>
              </p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Batal</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <CalendarClock size={15} /> Simpan Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Edit Materi ─────────────────────────────────────────────────────
function EditModal({ material, onClose, onSave }) {
  const [form, setForm] = useState({
    title: material.title,
    programId: String(material.programId),
    type: material.type,
    selectedStudents: [...(material.assignedStudentIds || [])],
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (form.selectedStudents.length === 0) return;
    onSave({
      title: form.title,
      programId: Number(form.programId),
      type: form.type,
      assignedStudentIds: form.selectedStudents,
    });
  };

  return (
    <div className="modal-overlay" id="edit-material-modal">
      <div className="modal-content animate-slideUp" style={{ maxWidth: 560 }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <Pencil size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-sans)', margin: 0, fontSize: 'var(--text-md)' }}>
              Edit Materi
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', margin: 0 }}>
            Ubah informasi materi dan siswa penerima
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Judul Materi</label>
              <input
                className="form-input"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Program</label>
              <select
                className="form-select"
                value={form.programId}
                onChange={e => setForm({ ...form, programId: e.target.value, selectedStudents: [] })}
                required
              >
                <option value="">Pilih Program</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tipe</label>
              <select
                className="form-select"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="document">Dokumen</option>
                <option value="video">Video</option>
                <option value="quiz">Tryout / Kuis</option>
              </select>
            </div>
          </div>

          <StudentSelector
            programId={form.programId}
            selectedStudents={form.selectedStudents}
            onChange={sel => setForm({ ...form, selectedStudents: sel })}
          />

          {form.programId && form.selectedStudents.length === 0 && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginBottom: 'var(--space-3)' }}>
              ⚠ Pilih minimal 1 siswa penerima
            </p>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Batal</button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={form.selectedStudents.length === 0}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                opacity: form.selectedStudents.length === 0 ? 0.5 : 1,
                cursor: form.selectedStudents.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <Pencil size={14} /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Konfirmasi Hapus ────────────────────────────────────────────────
function DeleteModal({ material, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" id="delete-confirm-modal">
      <div className="modal-content animate-slideUp" style={{ maxWidth: 400 }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div style={{ textAlign: 'center', padding: 'var(--space-2) 0 var(--space-4)' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
          }}>
            <Trash2 size={24} style={{ color: 'var(--error, #ef4444)' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-2)' }}>
            Hapus Materi?
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', lineHeight: 1.6 }}>
            Materi <strong>"{material.title}"</strong> akan dihapus secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Batal</button>
          <button
            className="btn"
            onClick={onConfirm}
            style={{
              flex: 1, background: 'var(--error, #ef4444)', color: 'white',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', padding: 'var(--space-2) var(--space-4)',
            }}
          >
            <Trash2 size={14} /> Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Lihat Penerima ──────────────────────────────────────────────────
function RecipientsModal({ material, onClose }) {
  const recipients = students.filter(s => (material.assignedStudentIds || []).includes(s.id));
  return (
    <div className="modal-overlay" id="view-recipients-modal">
      <div className="modal-content animate-slideUp" style={{ maxWidth: 480 }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <Users size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', margin: 0 }}>
              Siswa Penerima
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', margin: 0 }}>{material.title}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {recipients.length > 0 ? recipients.map(s => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3)', background: 'var(--cream-50)', borderRadius: 'var(--radius-md)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(139,115,85,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--text-sm)', flexShrink: 0,
              }}>{s.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)' }}>{s.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)' }}>{s.email}</div>
              </div>
              <span className="badge badge-approved" style={{ fontSize: 'var(--text-xs)' }}>✓ Dikirim</span>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)' }}>
              Belum ada siswa penerima
            </div>
          )}
        </div>
        <div style={{
          marginTop: 'var(--space-4)', padding: 'var(--space-3)',
          background: 'var(--cream-50)', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--neutral-500)',
        }}>
          Total: {recipients.length} siswa menerima materi ini
        </div>
        <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
          Tutup
        </button>
      </div>
    </div>
  );
}

// ─── Halaman Utama ──────────────────────────────────────────────────────────
export default function MaterialsPage() {
  const [materialsData, setMaterialsData] = useState(initialMaterials);
  const [programFilter, setProgramFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Add form state
  const [showAdd, setShowAdd] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '', programId: '', type: 'document', isLocked: false, selectedStudents: [],
  });

  // Modal states
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewRecipients, setViewRecipients] = useState(null);

  const filtered = materialsData.filter(m => {
    const matchProg = programFilter === 'all' || m.programId === Number(programFilter);
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchProg && matchSearch;
  });

  // ── Handlers ──
  const handleDelete = (id) => {
    setMaterialsData(prev => prev.filter(m => m.id !== id));
    setDeleteTarget(null);
  };

  const handleScheduleSave = (id, { isLocked, unlockAt }) => {
    setMaterialsData(prev => prev.map(m => m.id === id ? { ...m, isLocked, unlockAt } : m));
    setScheduleTarget(null);
  };

  const handleEditSave = (id, updates) => {
    setMaterialsData(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    setEditTarget(null);
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (newMaterial.selectedStudents.length === 0) return;
    const newItem = {
      id: Date.now(),
      programId: Number(newMaterial.programId),
      title: newMaterial.title,
      fileUrl: `/materials/new-${Date.now()}.pdf`,
      type: newMaterial.type,
      isLocked: newMaterial.isLocked,
      unlockAt: null,
      assignedStudentIds: [...newMaterial.selectedStudents],
    };
    setMaterialsData(prev => [...prev, newItem]);
    setNewMaterial({ title: '', programId: '', type: 'document', isLocked: false, selectedStudents: [] });
    setShowAdd(false);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Manajemen Materi</h1>
          <p>Upload dan kelola materi belajar — atur jadwal & hak akses siswa</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} /> Tambah Materi
        </button>
      </div>

      {/* Add Material Form */}
      {showAdd && (
        <div className="card animate-fadeIn" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-4)' }}>Tambah Materi Baru</h3>
          <form onSubmit={handleAddMaterial}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Judul Materi</label>
                <input
                  type="text" className="form-input" placeholder="Masukkan judul materi"
                  value={newMaterial.title}
                  onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Program</label>
                <select
                  className="form-select"
                  value={newMaterial.programId}
                  onChange={e => setNewMaterial({ ...newMaterial, programId: e.target.value, selectedStudents: [] })}
                  required
                >
                  <option value="">Pilih Program</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tipe</label>
                <select
                  className="form-select"
                  value={newMaterial.type}
                  onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value })}
                >
                  #Video pengunpulan : ke youtube dulu, baru ambil linknya
                  <option value="document">Dokumen</option>
                  <option value="video">Video</option>
                  <option value="quiz">Tryout / Kuis</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">File</label>
                <label className="file-upload-area" style={{ padding: 'var(--space-4)' }}>
                  <input type="file" style={{ display: 'none' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
                    <Upload size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    Klik untuk upload file
                  </span>
                </label>
              </div>
            </div>

            <StudentSelector
              programId={newMaterial.programId}
              selectedStudents={newMaterial.selectedStudents}
              onChange={sel => setNewMaterial({ ...newMaterial, selectedStudents: sel })}
            />

            {newMaterial.programId && newMaterial.selectedStudents.length === 0 && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginBottom: 'var(--space-3)' }}>
                ⚠ Pilih minimal 1 siswa penerima
              </p>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Batal</button>
              <button
                type="submit" className="btn btn-primary"
                disabled={newMaterial.selectedStudents.length === 0}
                style={{ opacity: newMaterial.selectedStudents.length === 0 ? 0.5 : 1 }}
              >
                <Plus size={16} /> Simpan & Kirim Materi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
          <input
            type="text" className="form-input" placeholder="Cari materi..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select
          className="form-select" value={programFilter}
          onChange={e => setProgramFilter(e.target.value)}
          style={{ width: 220 }}
        >
          <option value="all">Semua Program</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Materials List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filtered.map(material => {
          const Icon = typeIcons[material.type] || FileText;
          const program = programs.find(p => p.id === material.programId);
          const recipientCount = (material.assignedStudentIds || []).length;

          return (
            <div className="material-card" key={material.id}>
              {/* Icon */}
              <div className={`material-icon ${material.type}`}>
                <Icon size={20} />
              </div>

              {/* Info */}
              <div className="material-info" style={{ flex: 1 }}>
                <h4>{material.title}</h4>
                <p>{program?.name || '—'} • {typeLabels[material.type]}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-1)', flexWrap: 'wrap' }}>
                  {/* Status badge */}
                  <span className={`badge ${material.isLocked ? 'badge-locked' : 'badge-approved'}`}>
                    {material.isLocked ? '🔒 Terkunci' : '🔓 Terbuka'}
                  </span>
                  {/* Unlock schedule hint */}
                  {material.isLocked && material.unlockAt && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} />
                      Buka: {new Date(material.unlockAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  {/* Recipient count */}
                  <span
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                    onClick={() => setViewRecipients(material)}
                  >
                    <Users size={11} /> {recipientCount} siswa
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                {/* Atur Jadwal */}
                <button
                  id={`schedule-btn-${material.id}`}
                  onClick={() => setScheduleTarget(material)}
                  title="Atur Jadwal"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 12px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--cream-200)',
                    background: 'white', cursor: 'pointer',
                    fontSize: 'var(--text-xs)', fontWeight: 600,
                    color: 'var(--neutral-700)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'rgba(139,115,85,0.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--cream-200)'; e.currentTarget.style.color = 'var(--neutral-700)'; e.currentTarget.style.background = 'white'; }}
                >
                  <CalendarClock size={14} /> Jadwal
                </button>

                {/* Edit */}
                <button
                  id={`edit-btn-${material.id}`}
                  onClick={() => setEditTarget(material)}
                  title="Edit Materi"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 12px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--cream-200)',
                    background: 'white', cursor: 'pointer',
                    fontSize: 'var(--text-xs)', fontWeight: 600,
                    color: 'var(--neutral-700)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.background = 'rgba(59,130,246,0.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--cream-200)'; e.currentTarget.style.color = 'var(--neutral-700)'; e.currentTarget.style.background = 'white'; }}
                >
                  <Pencil size={14} /> Edit
                </button>

                {/* Hapus */}
                <button
                  id={`delete-btn-${material.id}`}
                  onClick={() => setDeleteTarget(material)}
                  title="Hapus Materi"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 12px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--cream-200)',
                    background: 'white', cursor: 'pointer',
                    fontSize: 'var(--text-xs)', fontWeight: 600,
                    color: 'var(--neutral-700)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--cream-200)'; e.currentTarget.style.color = 'var(--neutral-700)'; e.currentTarget.style.background = 'white'; }}
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <h3>Tidak ada materi ditemukan</h3>
          <p>Tambahkan materi baru atau ubah filter pencarian.</p>
        </div>
      )}

      {/* ── Modals ── */}
      {scheduleTarget && (
        <ScheduleModal
          material={scheduleTarget}
          onClose={() => setScheduleTarget(null)}
          onSave={(updates) => handleScheduleSave(scheduleTarget.id, updates)}
        />
      )}

      {editTarget && (
        <EditModal
          material={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={(updates) => handleEditSave(editTarget.id, updates)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          material={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.id)}
        />
      )}

      {viewRecipients && (
        <RecipientsModal
          material={viewRecipients}
          onClose={() => setViewRecipients(null)}
        />
      )}
    </div>
  );
}
