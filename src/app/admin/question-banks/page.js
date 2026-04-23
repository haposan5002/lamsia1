'use client';

import { useState } from 'react';
import { questionBanks as initialBanks, programs, getKelasForJenjang, getMataPelajaranList } from '@/lib/data';
import {
  Brain, Plus, Search, X, Pencil, Trash2, CheckSquare, Square,
  AlertTriangle, BookOpen, ChevronDown, ChevronUp, Image as ImageIcon, Music, Upload, Filter, Tag
} from 'lucide-react';

export default function QuestionBanksPage() {
  const [banks, setBanks] = useState(initialBanks);
  const [selectedProgramId, setSelectedProgramId] = useState(1);
  const [search, setSearch] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Filter state
  const [filterJenjang, setFilterJenjang] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterMapel, setFilterMapel] = useState('');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkJenjang, setBulkJenjang] = useState('');
  const [bulkKelas, setBulkKelas] = useState('');
  const [bulkMapel, setBulkMapel] = useState('');

  // New question form
  const [newQuestion, setNewQuestion] = useState({
    text: '', options: ['', '', '', ''], correctIndex: 0,
    jenjang: '', kelas: '', mataPelajaran: '',
    imageUrl: '', audioUrl: ''
  });

  const handleFileUpload = (e, targetState, setTargetState, field) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTargetState({ ...targetState, [field]: url });
    }
  };

  const currentBank = banks.find(b => b.programId === selectedProgramId);
  const questions = currentBank?.questions || [];
  const filteredQuestions = questions.filter(q => {
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterJenjang && q.jenjang !== filterJenjang) return false;
    if (filterKelas && q.kelas !== Number(filterKelas)) return false;
    if (filterMapel && q.mataPelajaran !== filterMapel) return false;
    return true;
  });

  const filterKelasOptions = filterJenjang ? getKelasForJenjang(filterJenjang) : [];
  const filterMapelOptions = filterJenjang ? getMataPelajaranList(filterJenjang) : [];
  const bulkKelasOptions = bulkJenjang ? getKelasForJenjang(bulkJenjang) : [];
  const bulkMapelOptions = bulkJenjang ? getMataPelajaranList(bulkJenjang) : [];

  const maxQuestions = 100;
  const canAddMore = questions.length < maxQuestions;

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!canAddMore) return;
    if (newQuestion.options.some(o => o.trim() === '')) return;

    const newId = Date.now();
    const bankJenjang = banks.find(b => b.programId === selectedProgramId)?.jenjang || '';
    setBanks(prev => prev.map(b => {
      if (b.programId !== selectedProgramId) return b;
      return {
        ...b,
        questions: [...b.questions, {
          id: newId,
          text: newQuestion.text,
          options: [...newQuestion.options],
          correctIndex: newQuestion.correctIndex,
          jenjang: newQuestion.jenjang || bankJenjang,
          kelas: newQuestion.kelas ? Number(newQuestion.kelas) : null,
          mataPelajaran: newQuestion.mataPelajaran || '',
          imageUrl: newQuestion.imageUrl,
          audioUrl: newQuestion.audioUrl,
        }]
      };
    }));
    setNewQuestion({ text: '', options: ['', '', '', ''], correctIndex: 0, jenjang: '', kelas: '', mataPelajaran: '', imageUrl: '', audioUrl: '' });
    setShowAddQuestion(false);
  };

  const handleBulkTag = () => {
    if (!bulkJenjang || selectedIds.length === 0) return;
    setBanks(prev => prev.map(b => ({
      ...b,
      questions: b.questions.map(q =>
        selectedIds.includes(q.id)
          ? { ...q, jenjang: bulkJenjang, kelas: bulkKelas ? Number(bulkKelas) : q.kelas, mataPelajaran: bulkMapel || q.mataPelajaran }
          : q
      )
    })));
    setSelectedIds([]);
    setShowBulkModal(false);
    setBulkJenjang('');
    setBulkKelas('');
    setBulkMapel('');
  };

  const handleEditQuestion = (e) => {
    e.preventDefault();
    if (!editingQuestion) return;
    setBanks(prev => prev.map(b => {
      if (b.programId !== selectedProgramId) return b;
      return {
        ...b,
        questions: b.questions.map(q =>
          q.id === editingQuestion.id
            ? { ...q, text: editingQuestion.text, options: [...editingQuestion.options], correctIndex: editingQuestion.correctIndex, imageUrl: editingQuestion.imageUrl, audioUrl: editingQuestion.audioUrl, jenjang: editingQuestion.jenjang || '', kelas: editingQuestion.kelas ? Number(editingQuestion.kelas) : null, mataPelajaran: editingQuestion.mataPelajaran || '' }
            : q
        )
      };
    }));
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (qId) => {
    setBanks(prev => prev.map(b => {
      if (b.programId !== selectedProgramId) return b;
      return { ...b, questions: b.questions.filter(q => q.id !== qId) };
    }));
    setDeleteTarget(null);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Bank Soal</h1>
          <p>Kelola bank soal untuk Pre-Test dan Kuis Interaktif per jenjang</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setShowAddQuestion(true); setEditingQuestion(null); }}
          disabled={!canAddMore}
          style={{ opacity: canAddMore ? 1 : 0.5 }}
        >
          <Plus size={16} /> Tambah Soal
        </button>
      </div>

      {/* Program Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {programs.map(p => {
          const bank = banks.find(b => b.programId === p.id);
          const count = bank?.questions.length || 0;
          const isActive = selectedProgramId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => { setSelectedProgramId(p.id); setSearch(''); setShowAddQuestion(false); setEditingQuestion(null); }}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${isActive ? 'var(--primary)' : 'var(--cream-200)'}`,
                background: isActive ? 'var(--primary)' : 'white',
                color: isActive ? 'white' : 'var(--neutral-700)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              }}
            >
              <Brain size={16} />
              {p.name.replace('Bimbingan Belajar ', '')}
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--cream-100)',
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)', fontWeight: 700,
              }}>
                {count}/{maxQuestions}
              </span>
            </button>
          );
        })}
      </div>

      {/* Capacity indicator */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Kapasitas Bank Soal</span>
          <span style={{ fontSize: 'var(--text-sm)', color: questions.length >= maxQuestions ? 'var(--error)' : 'var(--neutral-500)' }}>
            {questions.length}/{maxQuestions} soal
          </span>
        </div>
        <div style={{
          width: '100%', height: 8, background: 'var(--cream-200)', borderRadius: 4, overflow: 'hidden',
        }}>
          <div style={{
            width: `${(questions.length / maxQuestions) * 100}%`,
            height: '100%',
            background: questions.length >= maxQuestions ? 'var(--error)' : 'var(--primary)',
            borderRadius: 4, transition: 'width 0.5s ease',
          }} />
        </div>
        {!canAddMore && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={12} /> Bank soal sudah penuh. Hapus soal yang tidak digunakan untuk menambah soal baru.
          </p>
        )}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
          <input
            type="text" className="form-input" placeholder="Cari soal..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        {/* Jenjang filter */}
        {['SD','SMP','SMA'].map(j => (
          <button key={j} onClick={() => { setFilterJenjang(filterJenjang===j?'':j); setFilterKelas(''); setFilterMapel(''); }}
            style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'all 0.2s',
              border: `2px solid ${filterJenjang===j?'var(--primary)':'var(--cream-200)'}`,
              background: filterJenjang===j?'var(--primary)':'white',
              color: filterJenjang===j?'white':'var(--neutral-700)' }}>
            {j}
          </button>
        ))}
        {filterJenjang && (
          <>
            <select className="form-input" style={{ width: 120 }} value={filterKelas} onChange={e => setFilterKelas(e.target.value)}>
              <option value="">Semua Kelas</option>
              {filterKelasOptions.map(k => <option key={k} value={k}>Kelas {k}</option>)}
            </select>
            <select className="form-input" style={{ width: 160 }} value={filterMapel} onChange={e => setFilterMapel(e.target.value)}>
              <option value="">Semua Mapel</option>
              {filterMapelOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </>
        )}
        {(filterJenjang||filterKelas||filterMapel) && (
          <button onClick={() => { setFilterJenjang(''); setFilterKelas(''); setFilterMapel(''); }}
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-200)', background: 'white', cursor: 'pointer', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)' }}>
            <X size={12} /> Reset
          </button>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(139,115,85,0.08)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', border: '1px solid rgba(139,115,85,0.2)' }}>
          <Tag size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>{selectedIds.length} soal dipilih</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowBulkModal(true)}>Set Jenjang/Kelas</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedIds([])}><X size={14} /> Batal</button>
        </div>
      )}

      {/* Bulk Tag Modal */}
      {showBulkModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 440, width: '100%' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Tag size={18} style={{ color: 'var(--primary)' }} /> Tag Massal ({selectedIds.length} soal)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <div className="form-group">
                <label className="form-label">Jenjang <span style={{ color: 'var(--error)' }}>*</span></label>
                <select className="form-input" value={bulkJenjang} onChange={e => { setBulkJenjang(e.target.value); setBulkKelas(''); setBulkMapel(''); }}>
                  <option value="">Pilih Jenjang</option>
                  <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option>
                </select>
              </div>
              {bulkJenjang && (
                <>
                  <div className="form-group">
                    <label className="form-label">Kelas</label>
                    <select className="form-input" value={bulkKelas} onChange={e => setBulkKelas(e.target.value)}>
                      <option value="">Tidak diubah</option>
                      {bulkKelasOptions.map(k => <option key={k} value={k}>Kelas {k}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mata Pelajaran</label>
                    <select className="form-input" value={bulkMapel} onChange={e => setBulkMapel(e.target.value)}>
                      <option value="">Tidak diubah</option>
                      {bulkMapelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleBulkTag} disabled={!bulkJenjang}>Terapkan</button>
              <button className="btn btn-secondary" onClick={() => setShowBulkModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Form */}
      {showAddQuestion && canAddMore && (
        <div className="card animate-fadeIn" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', border: '2px solid var(--primary)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Plus size={18} style={{ color: 'var(--primary)' }} /> Tambah Soal Baru
          </h3>
          <form onSubmit={handleAddQuestion}>
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label">Pertanyaan</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Ketik soal di sini..."
                value={newQuestion.text}
                onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Jenjang / Kelas / Mapel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Jenjang</label>
                <select className="form-input" value={newQuestion.jenjang} onChange={e => setNewQuestion({...newQuestion, jenjang: e.target.value, kelas: '', mataPelajaran: ''})}>
                  <option value="">Pilih Jenjang</option>
                  <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Kelas</label>
                <select className="form-input" value={newQuestion.kelas} onChange={e => setNewQuestion({...newQuestion, kelas: e.target.value})} disabled={!newQuestion.jenjang}>
                  <option value="">Pilih Kelas</option>
                  {newQuestion.jenjang && getKelasForJenjang(newQuestion.jenjang).map(k => <option key={k} value={k}>Kelas {k}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Mata Pelajaran</label>
                <select className="form-input" value={newQuestion.mataPelajaran} onChange={e => setNewQuestion({...newQuestion, mataPelajaran: e.target.value})} disabled={!newQuestion.jenjang}>
                  <option value="">Pilih Mapel</option>
                  {newQuestion.jenjang && getMataPelajaranList(newQuestion.jenjang).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              {/* Media Uploads */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ImageIcon size={14} /> Tambah Gambar (Opsional)
                </label>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={(e) => handleFileUpload(e, newQuestion, setNewQuestion, 'imageUrl')}
                     style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                   />
                   <div style={{
                     border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
                     textAlign: 'center', background: 'rgba(139,115,85,0.05)', color: 'var(--primary)',
                     display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                   }}>
                     <Upload size={16} />
                     <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Pilih Gambar</span>
                   </div>
                </div>
                {newQuestion.imageUrl && (
                  <div style={{ marginTop: 'var(--space-2)', position: 'relative', display: 'inline-block' }}>
                    <img src={newQuestion.imageUrl} alt="Preview" style={{ height: 100, borderRadius: 'var(--radius-md)', objectFit: 'contain', border: '1px solid var(--cream-200)' }} />
                    <button type="button" onClick={() => setNewQuestion({...newQuestion, imageUrl: ''})} style={{ position: 'absolute', top: -8, right: -8, background: 'var(--error)', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><X size={12} /></button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Music size={14} /> Tambah Audio (Opsional)
                </label>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                   <input 
                     type="file" 
                     accept="audio/*"
                     onChange={(e) => handleFileUpload(e, newQuestion, setNewQuestion, 'audioUrl')}
                     style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                   />
                   <div style={{
                     border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
                     textAlign: 'center', background: 'rgba(139,115,85,0.05)', color: 'var(--primary)',
                     display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                   }}>
                     <Upload size={16} />
                     <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Pilih Audio</span>
                   </div>
                </div>
                {newQuestion.audioUrl && (
                  <div style={{ marginTop: 'var(--space-2)', position: 'relative' }}>
                    <audio src={newQuestion.audioUrl} controls style={{ width: '100%', height: 40 }} />
                    <button type="button" onClick={() => setNewQuestion({...newQuestion, audioUrl: ''})} style={{ position: 'absolute', top: -8, right: -8, background: 'var(--error)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 20 }}><X size={12} /></button>
                  </div>
                )}
              </div>
            </div>

            <label className="form-label" style={{ marginBottom: 'var(--space-3)' }}>Pilihan Jawaban</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {newQuestion.options.map((opt, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  border: `2px solid ${newQuestion.correctIndex === i ? 'var(--primary)' : 'var(--cream-200)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: newQuestion.correctIndex === i ? 'rgba(139,115,85,0.04)' : 'white',
                  transition: 'all 0.2s',
                }}>
                  <button
                    type="button"
                    onClick={() => setNewQuestion({ ...newQuestion, correctIndex: i })}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${newQuestion.correctIndex === i ? 'var(--primary)' : 'var(--neutral-300)'}`,
                      background: newQuestion.correctIndex === i ? 'var(--primary)' : 'white',
                      color: newQuestion.correctIndex === i ? 'white' : 'var(--neutral-500)',
                      fontWeight: 700, fontSize: 'var(--text-xs)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {optionLabels[i]}
                  </button>
                  <input
                    className="form-input"
                    placeholder={`Pilihan ${optionLabels[i]}`}
                    value={opt}
                    onChange={e => {
                      const opts = [...newQuestion.options];
                      opts[i] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: opts });
                    }}
                    required
                    style={{ border: 'none', padding: '4px 8px', flex: 1 }}
                  />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', marginBottom: 'var(--space-4)' }}>
              Klik huruf (A/B/C/D) untuk memilih jawaban yang benar
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddQuestion(false)}>Batal</button>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Simpan Soal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="modal-overlay" id="edit-question-modal">
          <div className="modal-content animate-slideUp" style={{ maxWidth: 600 }}>
            <button className="modal-close" onClick={() => setEditingQuestion(null)}><X size={20} /></button>
            <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Pencil size={18} style={{ color: 'var(--primary)' }} /> Edit Soal
            </h3>
            <form onSubmit={handleEditQuestion}>
              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Pertanyaan</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={editingQuestion.text}
                  onChange={e => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

            {/* Jenjang / Kelas / Mapel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Jenjang</label>
                <select className="form-input" value={editingQuestion.jenjang || ''} onChange={e => setEditingQuestion({...editingQuestion, jenjang: e.target.value, kelas: '', mataPelajaran: ''})}>
                  <option value="">Pilih Jenjang</option>
                  <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Kelas</label>
                <select className="form-input" value={editingQuestion.kelas || ''} onChange={e => setEditingQuestion({...editingQuestion, kelas: e.target.value ? Number(e.target.value) : ''})} disabled={!editingQuestion.jenjang}>
                  <option value="">Pilih Kelas</option>
                  {editingQuestion.jenjang && getKelasForJenjang(editingQuestion.jenjang).map(k => <option key={k} value={k}>Kelas {k}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Mata Pelajaran</label>
                <select className="form-input" value={editingQuestion.mataPelajaran || ''} onChange={e => setEditingQuestion({...editingQuestion, mataPelajaran: e.target.value})} disabled={!editingQuestion.jenjang}>
                  <option value="">Pilih Mapel</option>
                  {editingQuestion.jenjang && getMataPelajaranList(editingQuestion.jenjang).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                {/* Media Uploads */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ImageIcon size={14} /> Ubah Gambar (Opsional)
                  </label>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                     <input 
                       type="file" 
                       accept="image/*"
                       onChange={(e) => handleFileUpload(e, editingQuestion, setEditingQuestion, 'imageUrl')}
                       style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                     />
                     <div style={{
                       border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
                       textAlign: 'center', background: 'rgba(139,115,85,0.05)', color: 'var(--primary)',
                       display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                     }}>
                       <Upload size={16} />
                       <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Pilih Gambar</span>
                     </div>
                  </div>
                  {editingQuestion.imageUrl && (
                    <div style={{ marginTop: 'var(--space-2)', position: 'relative', display: 'inline-block' }}>
                      <img src={editingQuestion.imageUrl} alt="Preview" style={{ height: 100, borderRadius: 'var(--radius-md)', objectFit: 'contain', border: '1px solid var(--cream-200)' }} />
                      <button type="button" onClick={() => setEditingQuestion({...editingQuestion, imageUrl: ''})} style={{ position: 'absolute', top: -8, right: -8, background: 'var(--error)', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><X size={12} /></button>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Music size={14} /> Ubah Audio (Opsional)
                  </label>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                     <input 
                       type="file" 
                       accept="audio/*"
                       onChange={(e) => handleFileUpload(e, editingQuestion, setEditingQuestion, 'audioUrl')}
                       style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                     />
                     <div style={{
                       border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
                       textAlign: 'center', background: 'rgba(139,115,85,0.05)', color: 'var(--primary)',
                       display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                     }}>
                       <Upload size={16} />
                       <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Pilih Audio</span>
                     </div>
                  </div>
                  {editingQuestion.audioUrl && (
                    <div style={{ marginTop: 'var(--space-2)', position: 'relative' }}>
                      <audio src={editingQuestion.audioUrl} controls style={{ width: '100%', height: 40 }} />
                      <button type="button" onClick={() => setEditingQuestion({...editingQuestion, audioUrl: ''})} style={{ position: 'absolute', top: -8, right: -8, background: 'var(--error)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 20 }}><X size={12} /></button>
                    </div>
                  )}
                </div>
              </div>

              <label className="form-label" style={{ marginBottom: 'var(--space-3)' }}>Pilihan Jawaban</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                {editingQuestion.options.map((opt, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    border: `2px solid ${editingQuestion.correctIndex === i ? 'var(--primary)' : 'var(--cream-200)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: editingQuestion.correctIndex === i ? 'rgba(139,115,85,0.04)' : 'white',
                  }}>
                    <button
                      type="button"
                      onClick={() => setEditingQuestion({ ...editingQuestion, correctIndex: i })}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${editingQuestion.correctIndex === i ? 'var(--primary)' : 'var(--neutral-300)'}`,
                        background: editingQuestion.correctIndex === i ? 'var(--primary)' : 'white',
                        color: editingQuestion.correctIndex === i ? 'white' : 'var(--neutral-500)',
                        fontWeight: 700, fontSize: 'var(--text-xs)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {optionLabels[i]}
                    </button>
                    <input
                      className="form-input"
                      value={opt}
                      onChange={e => {
                        const opts = [...editingQuestion.options];
                        opts[i] = e.target.value;
                        setEditingQuestion({ ...editingQuestion, options: opts });
                      }}
                      required
                      style={{ border: 'none', padding: '4px 8px', flex: 1 }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingQuestion(null)} style={{ flex: 1 }}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Pencil size={14} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal-overlay" id="delete-question-modal">
          <div className="modal-content animate-slideUp" style={{ maxWidth: 400 }}>
            <button className="modal-close" onClick={() => setDeleteTarget(null)}><X size={20} /></button>
            <div style={{ textAlign: 'center', padding: 'var(--space-2) 0 var(--space-4)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-4)',
              }}>
                <Trash2 size={24} style={{ color: '#ef4444' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-2)' }}>Hapus Soal?</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', lineHeight: 1.6 }}>
                Soal ini akan dihapus secara permanen. Tindakan tidak dapat dibatalkan.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)} style={{ flex: 1 }}>Batal</button>
              <button
                className="btn"
                onClick={() => handleDeleteQuestion(deleteTarget.id)}
                style={{
                  flex: 1, background: '#ef4444', color: 'white', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', padding: 'var(--space-2) var(--space-4)',
                }}
              >
                <Trash2 size={14} /> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedQuestion === q.id;
          return (
            <div key={q.id} className="card" style={{
              padding: 'var(--space-4)',
              border: selectedIds.includes(q.id) ? '2px solid var(--primary)' : '1px solid var(--cream-200)',
              background: selectedIds.includes(q.id) ? 'rgba(139,115,85,0.02)' : 'white',
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedIds(prev => prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]); }}
                  style={{ padding: 4, border: 'none', background: 'none', cursor: 'pointer', color: selectedIds.includes(q.id) ? 'var(--primary)' : 'var(--neutral-300)', flexShrink: 0, marginTop: 4 }}
                >
                  {selectedIds.includes(q.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>

                <div
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', flex: 1, cursor: 'pointer' }}
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)', flexShrink: 0,
                    background: 'rgba(139,115,85,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--text-sm)',
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)', lineHeight: 1.5 }}>
                      {q.text}
                    </div>
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', marginTop: 4 }}>
                      {q.jenjang && (
                        <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 700 }}>
                          {q.jenjang}
                        </span>
                      )}
                      {q.kelas && (
                        <span style={{ background: 'var(--cream-100)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 700, border: '1px solid rgba(139,115,85,0.2)' }}>
                          Kelas {q.kelas}
                        </span>
                      )}
                      {q.mataPelajaran && (
                        <span style={{ background: 'rgba(139,115,85,0.08)', color: 'var(--neutral-600)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600 }}>
                          {q.mataPelajaran}
                        </span>
                      )}
                      {!isExpanded && (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', marginLeft: 4 }}>
                          Jawaban: {optionLabels[q.correctIndex]} — Klik untuk lihat detail
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingQuestion({ ...q, options: [...q.options] }); }}
                    title="Edit"
                    style={{
                      padding: '6px', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--cream-200)', background: 'white',
                      cursor: 'pointer', color: 'var(--neutral-500)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(q); }}
                    title="Hapus"
                    style={{
                      padding: '6px', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--cream-200)', background: 'white',
                      cursor: 'pointer', color: 'var(--neutral-500)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                  {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--neutral-400)' }} /> : <ChevronDown size={16} style={{ color: 'var(--neutral-400)' }} />}
                </div>
              </div>

              {/* Expanded options */}
              {isExpanded && (
                <>
                  {(q.imageUrl || q.audioUrl) && (
                    <div style={{
                      marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px dashed var(--cream-200)',
                      display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap'
                    }}>
                      {q.imageUrl && (
                        <div style={{ flex: 1, minWidth: 200, background: 'var(--cream-50)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-200)' }}>
                          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--neutral-500)', marginBottom: 4 }}>Gambar Lampiran:</p>
                          <img src={q.imageUrl} alt="Lampiran" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 'var(--radius-sm)', background: 'white' }} />
                        </div>
                      )}
                      {q.audioUrl && (
                        <div style={{ flex: 1, minWidth: 200, background: 'var(--cream-50)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-200)' }}>
                          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--neutral-500)', marginBottom: 4 }}>Audio Lampiran:</p>
                          <audio src={q.audioUrl} controls style={{ width: '100%', outline: 'none' }} />
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{
                    marginTop: 'var(--space-3)',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--cream-200)',
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)',
                  }}>
                  {q.options.map((opt, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      background: q.correctIndex === i ? 'rgba(34,197,94,0.08)' : 'var(--cream-50)',
                      border: `1px solid ${q.correctIndex === i ? 'rgba(34,197,94,0.3)' : 'var(--cream-200)'}`,
                    }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                        background: q.correctIndex === i ? '#22c55e' : 'var(--cream-200)',
                        color: q.correctIndex === i ? 'white' : 'var(--neutral-500)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 'var(--text-xs)',
                      }}>
                        {optionLabels[i]}
                      </span>
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        color: q.correctIndex === i ? '#16a34a' : 'var(--neutral-600)',
                        fontWeight: q.correctIndex === i ? 600 : 400,
                      }}>
                        {opt}
                        {q.correctIndex === i && ' ✓'}
                      </span>
                    </div>
                  ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} style={{ color: 'var(--neutral-300)' }} />
          <h3>{questions.length === 0 ? 'Belum Ada Soal' : 'Soal Tidak Ditemukan'}</h3>
          <p>{questions.length === 0 ? 'Klik "Tambah Soal" untuk mulai membuat bank soal.' : 'Coba ubah kata kunci pencarian.'}</p>
        </div>
      )}
    </div>
  );
}
