'use client';

import { useState } from 'react';
import { materials as initialMaterials, programs } from '@/lib/data';
import { Lock, Unlock, FileText, Video, Brain, Plus, Search, Upload } from 'lucide-react';

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

export default function MaterialsPage() {
  const [materialsData, setMaterialsData] = useState(initialMaterials);
  const [programFilter, setProgramFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '', programId: '', type: 'document', isLocked: true
  });

  const filtered = materialsData.filter((m) => {
    const matchProgram = programFilter === 'all' || m.programId === Number(programFilter);
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchProgram && matchSearch;
  });

  const toggleLock = (id) => {
    setMaterialsData(prev => prev.map(m => 
      m.id === id ? { ...m, isLocked: !m.isLocked } : m
    ));
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    const newItem = {
      id: materialsData.length + 1,
      programId: Number(newMaterial.programId),
      title: newMaterial.title,
      fileUrl: `/materials/new-${Date.now()}.pdf`,
      type: newMaterial.type,
      isLocked: newMaterial.isLocked,
      unlockAt: null,
    };
    setMaterialsData(prev => [...prev, newItem]);
    setNewMaterial({ title: '', programId: '', type: 'document', isLocked: true });
    setShowAdd(false);
  };

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1>Manajemen Materi</h1>
          <p>Upload dan kelola materi belajar dengan sistem gembok</p>
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
              <div className="form-group">
                <label className="form-label">Judul Materi</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Masukkan judul materi"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Program</label>
                <select
                  className="form-select"
                  value={newMaterial.programId}
                  onChange={(e) => setNewMaterial({ ...newMaterial, programId: e.target.value })}
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
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                >
                  <option value="document">Dokumen</option>
                  <option value="video">Video</option>
                  <option value="quiz">Tryout / Kuis</option>
                </select>
              </div>
              <div className="form-group">
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
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Batal</button>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Simpan Materi
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
            type="text"
            className="form-input"
            placeholder="Cari materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select
          className="form-select"
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          style={{ width: 220 }}
        >
          <option value="all">Semua Program</option>
          {programs.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Materials list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filtered.map((material) => {
          const Icon = typeIcons[material.type] || FileText;
          const program = programs.find(p => p.id === material.programId);
          return (
            <div className="material-card" key={material.id} style={{ opacity: material.isLocked ? 0.85 : 1 }}>
              <div className={`material-icon ${material.type}`}>
                <Icon size={20} />
              </div>
              <div className="material-info" style={{ flex: 1 }}>
                <h4>{material.title}</h4>
                <p>
                  {program?.name || '-'} • {typeLabels[material.type]}
                </p>
              </div>
              <span className={`badge ${material.isLocked ? 'badge-locked' : 'badge-approved'}`}>
                {material.isLocked ? '🔒 Terkunci' : '🔓 Terbuka'}
              </span>
              <button
                className={`btn btn-sm ${material.isLocked ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => toggleLock(material.id)}
              >
                {material.isLocked ? <><Unlock size={14} /> Buka</> : <><Lock size={14} /> Kunci</>}
              </button>
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
    </div>
  );
}
