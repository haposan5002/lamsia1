'use client';

import { useState } from 'react';
import { packages as initialPackages, programs, formatCurrency } from '@/lib/data';
import { Package, Plus, X, Pencil, Trash2, Star, Sparkles, Check } from 'lucide-react';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState(initialPackages);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    programId: '', nama: '', durasi: '', durasiHari: 90, durasiJam: '',
    harga: '', fitur: ['', '', '', ''], isPopular: false, isNew: false,
  });

  const resetForm = () => {
    setForm({ programId: '', nama: '', durasi: '', durasiHari: 90, durasiJam: '', harga: '', fitur: ['', '', '', ''], isPopular: false, isNew: false });
    setEditTarget(null);
    setShowForm(false);
  };

  const startEdit = (pkg) => {
    setEditTarget(pkg);
    const fiturPadded = [...pkg.fitur];
    while (fiturPadded.length < 4) fiturPadded.push('');
    setForm({
      programId: String(pkg.programId), nama: pkg.nama, durasi: pkg.durasi,
      durasiHari: pkg.durasiHari, durasiJam: pkg.durasiJam || '', harga: pkg.harga, fitur: fiturPadded,
      isPopular: pkg.isPopular, isNew: pkg.isNew,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.programId || !form.nama || !form.harga) return;
    const cleanFitur = form.fitur.filter(f => f.trim());
    if (editTarget) {
      setPackages(prev => prev.map(p => p.id === editTarget.id ? {
        ...p, programId: Number(form.programId), nama: form.nama, durasi: form.durasi,
        durasiHari: Number(form.durasiHari), durasiJam: Number(form.durasiJam) || 0, harga: Number(form.harga), fitur: cleanFitur,
        isPopular: form.isPopular, isNew: form.isNew, updatedAt: new Date().toISOString(),
      } : p));
    } else {
      setPackages(prev => [...prev, {
        id: Date.now(), programId: Number(form.programId), nama: form.nama, durasi: form.durasi,
        durasiHari: Number(form.durasiHari), durasiJam: Number(form.durasiJam) || 0, harga: Number(form.harga), fitur: cleanFitur,
        isPopular: form.isPopular, isNew: form.isNew, updatedAt: new Date().toISOString(),
      }]);
    }
    resetForm();
  };

  const groupedByProgram = programs.map(p => ({
    ...p, packages: packages.filter(pkg => pkg.programId === p.id),
  }));

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Package size={24} style={{ color: 'var(--primary)' }} /> Paket Program
          </h1>
          <p>Kelola paket bimbingan yang tersedia untuk setiap program jenjang</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={16} /> Tambah Paket
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', overflowY: 'auto' }}>
          <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 520, width: '100%', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Package size={18} style={{ color: 'var(--primary)' }} />
                {editTarget ? 'Edit Paket' : 'Tambah Paket Baru'}
              </h3>
              <button onClick={resetForm} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--neutral-400)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label">Program *</label>
                <select className="form-input" value={form.programId} onChange={e => setForm({...form, programId: e.target.value})}>
                  <option value="">Pilih Program</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nama Paket *</label>
                <input className="form-input" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} placeholder="e.g. Paket SMA 6 Bulan" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label className="form-label">Label Durasi</label>
                  <input className="form-input" value={form.durasi} onChange={e => setForm({...form, durasi: e.target.value})} placeholder="e.g. 3 bulan" />
                </div>
                <div className="form-group">
                  <label className="form-label">Durasi (hari)</label>
                  <input className="form-input" type="number" value={form.durasiHari} onChange={e => setForm({...form, durasiHari: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Durasi (jam)</label>
                  <input className="form-input" type="number" step="0.1" value={form.durasiJam} onChange={e => setForm({...form, durasiJam: e.target.value})} placeholder="e.g. 1.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Harga (Rp) *</label>
                  <input className="form-input" type="number" value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} placeholder="1500000" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Fitur Paket (maks 6)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {form.fitur.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <input className="form-input" value={f} onChange={e => {
                        const arr = [...form.fitur]; arr[i] = e.target.value; setForm({...form, fitur: arr});
                      }} placeholder={`Fitur ${i + 1}`} />
                      {i >= 4 && <button type="button" onClick={() => setForm({...form, fitur: form.fitur.filter((_,j)=>j!==i)})}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--error)' }}><X size={16} /></button>}
                    </div>
                  ))}
                  {form.fitur.length < 6 && (
                    <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}
                      onClick={() => setForm({...form, fitur: [...form.fitur, '']})}>
                      <Plus size={14} /> Tambah Fitur
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  <input type="checkbox" checked={form.isPopular} onChange={e => setForm({...form, isPopular: e.target.checked})} />
                  <Star size={14} style={{ color: '#eab308' }} /> Populer
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  <input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} />
                  <Sparkles size={14} style={{ color: 'var(--primary)' }} /> Baru
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={!form.programId || !form.nama || !form.harga}>
                {editTarget ? 'Simpan Perubahan' : 'Tambah Paket'}
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Packages grouped by program */}
      {groupedByProgram.map(prog => (
        <div key={prog.id} style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 14px', borderRadius: '999px', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              {prog.jenjang}
            </span>
            <h3 style={{ fontFamily: 'var(--font-sans)', color: 'var(--neutral-700)' }}>{prog.name}</h3>
            <span style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-sm)' }}>({prog.packages.length} paket)</span>
          </div>
          {prog.packages.length === 0 ? (
            <div style={{ padding: 'var(--space-6)', textAlign: 'center', border: '2px dashed var(--cream-200)', borderRadius: 'var(--radius-lg)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)' }}>
              Belum ada paket untuk program ini
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {prog.packages.map(pkg => (
                <div key={pkg.id} className="card" style={{ padding: 'var(--space-5)', position: 'relative', border: pkg.isPopular ? '2px solid var(--primary)' : '1px solid var(--cream-200)' }}>
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
                  <div style={{ marginBottom: 'var(--space-3)', paddingTop: (pkg.isPopular || pkg.isNew) ? 'var(--space-2)' : 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 4 }}>{pkg.nama}</div>
                    <div style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>
                      {pkg.durasi} · {pkg.durasiHari} hari
                      {pkg.durasiJam ? ` · ${pkg.durasiJam} jam` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 'var(--space-3)' }}>
                    {formatCurrency(pkg.harga)}
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--neutral-600)' }}>
                    {pkg.fitur.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Check size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => startEdit(pkg)}><Pencil size={14} /> Edit</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => setDeleteTarget(pkg)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <Trash2 size={40} style={{ color: 'var(--error)', marginBottom: 'var(--space-3)' }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Hapus Paket?</h3>
            <p style={{ color: 'var(--neutral-500)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
              &quot;{deleteTarget.nama}&quot; akan dihapus permanen.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1, background: 'var(--error)', borderColor: 'var(--error)' }}
                onClick={() => { setPackages(p => p.filter(pkg => pkg.id !== deleteTarget.id)); setDeleteTarget(null); }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
