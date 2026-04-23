'use client';

import { useState } from 'react';
import { tryouts as initialTryouts, questionBanks, getKelasForJenjang, getMataPelajaranList, getFilteredQuestions, formatDate } from '@/lib/data';
import { ClipboardList, Plus, X, Pencil, Trash2, Calendar, Clock, BookOpen, Search } from 'lucide-react';

export default function AdminTryoutsPage() {
  const [tryouts, setTryouts] = useState(initialTryouts);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    nama: '', jenjang: '', kelas: '', mataPelajaran: '',
    jumlahSoal: 20, durasiMenit: 45,
    tanggalBuka: '', tanggalTutup: '', isActive: true, autoSelect: true,
  });

  const kelasOptions = form.jenjang ? getKelasForJenjang(form.jenjang) : [];
  const mapelOptions = form.jenjang ? getMataPelajaranList(form.jenjang) : [];
  const availableQ = form.jenjang ? getFilteredQuestions(form.jenjang, form.kelas ? Number(form.kelas) : null, form.mataPelajaran || null) : [];

  const resetForm = () => {
    setForm({ nama: '', jenjang: '', kelas: '', mataPelajaran: '', jumlahSoal: 20, durasiMenit: 45, tanggalBuka: '', tanggalTutup: '', isActive: true, autoSelect: true });
    setEditTarget(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.nama || !form.jenjang || !form.kelas || !form.tanggalBuka || !form.tanggalTutup) return;
    const selectedQ = form.autoSelect
      ? availableQ.sort(() => Math.random() - 0.5).slice(0, Math.min(Number(form.jumlahSoal), availableQ.length)).map(q => q.id)
      : availableQ.slice(0, Math.min(Number(form.jumlahSoal), availableQ.length)).map(q => q.id);

    if (editTarget) {
      setTryouts(prev => prev.map(t => t.id === editTarget.id ? {
        ...t, nama: form.nama, jenjang: form.jenjang, kelas: Number(form.kelas),
        mataPelajaran: form.mataPelajaran, jumlahSoal: Number(form.jumlahSoal),
        durasiMenit: Number(form.durasiMenit), tanggalBuka: new Date(form.tanggalBuka).toISOString(),
        tanggalTutup: new Date(form.tanggalTutup).toISOString(), isActive: form.isActive,
        questionIds: selectedQ,
      } : t));
    } else {
      setTryouts(prev => [...prev, {
        id: Date.now(), nama: form.nama, jenjang: form.jenjang, kelas: Number(form.kelas),
        mataPelajaran: form.mataPelajaran, jumlahSoal: Number(form.jumlahSoal),
        durasiMenit: Number(form.durasiMenit), tanggalBuka: new Date(form.tanggalBuka).toISOString(),
        tanggalTutup: new Date(form.tanggalTutup).toISOString(), isActive: form.isActive,
        questionIds: selectedQ,
      }]);
    }
    resetForm();
  };

  const startEdit = (t) => {
    setEditTarget(t);
    setForm({
      nama: t.nama, jenjang: t.jenjang, kelas: String(t.kelas), mataPelajaran: t.mataPelajaran,
      jumlahSoal: t.jumlahSoal, durasiMenit: t.durasiMenit,
      tanggalBuka: t.tanggalBuka.slice(0, 16), tanggalTutup: t.tanggalTutup.slice(0, 16),
      isActive: t.isActive, autoSelect: true,
    });
    setShowForm(true);
  };

  const isNowOpen = (t) => {
    const now = new Date();
    return new Date(t.tanggalBuka) <= now && now <= new Date(t.tanggalTutup);
  };

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ClipboardList size={24} style={{ color: 'var(--primary)' }} /> Manajemen Tryout
          </h1>
          <p>Buat dan kelola tryout berdasarkan jenjang, kelas, dan mata pelajaran</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={16} /> Buat Tryout
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', overflowY: 'auto' }}>
          <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 560, width: '100%', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                {editTarget ? 'Edit Tryout' : 'Buat Tryout Baru'}
              </h3>
              <button onClick={resetForm} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--neutral-400)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label">Nama Tryout *</label>
                <input className="form-input" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} placeholder="e.g. Tryout Matematika SD Kelas 5" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label className="form-label">Jenjang *</label>
                  <select className="form-input" value={form.jenjang} onChange={e => setForm({...form, jenjang: e.target.value, kelas: '', mataPelajaran: ''})}>
                    <option value="">Pilih</option>
                    <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Kelas *</label>
                  <select className="form-input" value={form.kelas} onChange={e => setForm({...form, kelas: e.target.value})} disabled={!form.jenjang}>
                    <option value="">Pilih</option>
                    {kelasOptions.map(k => <option key={k} value={k}>Kelas {k}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mata Pelajaran</label>
                  <select className="form-input" value={form.mataPelajaran} onChange={e => setForm({...form, mataPelajaran: e.target.value})} disabled={!form.jenjang}>
                    <option value="">Semua</option>
                    {mapelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label className="form-label">Jumlah Soal</label>
                  <input className="form-input" type="number" min={5} max={50} value={form.jumlahSoal} onChange={e => setForm({...form, jumlahSoal: e.target.value})} />
                  {form.jenjang && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', marginTop: 4 }}>Tersedia: {availableQ.length} soal</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Durasi (menit)</label>
                  <input className="form-input" type="number" min={5} max={180} value={form.durasiMenit} onChange={e => setForm({...form, durasiMenit: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label className="form-label">Tanggal Buka *</label>
                  <input className="form-input" type="datetime-local" value={form.tanggalBuka} onChange={e => setForm({...form, tanggalBuka: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Tutup *</label>
                  <input className="form-input" type="datetime-local" value={form.tanggalTutup} onChange={e => setForm({...form, tanggalTutup: e.target.value})} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                <input type="checkbox" checked={form.autoSelect} onChange={e => setForm({...form, autoSelect: e.target.checked})} />
                Pilih soal secara acak dari bank soal
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
                Aktifkan tryout
              </label>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}
                disabled={!form.nama || !form.jenjang || !form.kelas || !form.tanggalBuka || !form.tanggalTutup}>
                {editTarget ? 'Simpan Perubahan' : 'Buat Tryout'}
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Tryout List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {tryouts.map(t => (
          <div key={t.id} className="card" style={{ padding: 'var(--space-4)', border: `1px solid ${isNowOpen(t) ? 'rgba(34,197,94,0.3)' : 'var(--cream-200)'}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 10px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700 }}>{t.jenjang} · Kelas {t.kelas}</span>
                  {t.mataPelajaran && <span style={{ background: 'var(--cream-100)', color: 'var(--neutral-600)', padding: '2px 10px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{t.mataPelajaran}</span>}
                  <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700, background: isNowOpen(t) ? 'rgba(34,197,94,0.1)' : t.isActive ? 'rgba(234,179,8,0.1)' : 'var(--cream-50)', color: isNowOpen(t) ? '#16a34a' : t.isActive ? '#ca8a04' : 'var(--neutral-400)' }}>
                    {isNowOpen(t) ? '● Sedang Buka' : t.isActive ? 'Terjadwal' : 'Nonaktif'}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-2)' }}>{t.nama}</h3>
                <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', flexWrap: 'wrap' }}>
                  <span><BookOpen size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {t.jumlahSoal} soal</span>
                  <span><Clock size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {t.durasiMenit} menit</span>
                  <span><Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {formatDate(t.tanggalBuka)} – {formatDate(t.tanggalTutup)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(t)}><Pencil size={14} /> Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => setDeleteTarget(t)}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {tryouts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--neutral-400)' }}>
            <ClipboardList size={48} style={{ opacity: 0.4, marginBottom: 'var(--space-3)' }} />
            <p>Belum ada tryout. Buat tryout pertama sekarang!</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <Trash2 size={40} style={{ color: 'var(--error)', marginBottom: 'var(--space-3)' }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Hapus Tryout?</h3>
            <p style={{ color: 'var(--neutral-500)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
              "{deleteTarget.nama}" akan dihapus permanen.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1, background: 'var(--error)', borderColor: 'var(--error)' }}
                onClick={() => { setTryouts(p => p.filter(t => t.id !== deleteTarget.id)); setDeleteTarget(null); }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
