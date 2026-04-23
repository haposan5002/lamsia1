/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { questionBanks as initialBanks, programs, getKelasForJenjang, getMataPelajaranList } from '@/lib/data';
import {
  Brain, Plus, Search, X, Pencil, Trash2, CheckSquare,
  AlertTriangle, BookOpen, ChevronDown, ChevronUp, Image as ImageIcon, Volume2
} from 'lucide-react';

let nextId = 10000;

export default function QuestionBanksPage() {
  const [banks, setBanks] = useState(initialBanks);
  const [selectedProgramId, setSelectedProgramId] = useState(1);
  const [search, setSearch] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const [kelasFilter, setKelasFilter] = useState('all');

  // New question form
  const [newQuestion, setNewQuestion] = useState({
    text: '', options: ['', '', '', ''], correctIndex: 0, imageUrl: '', audioUrl: '', kelas: '', mataPelajaran: ''
  });

  const currentBank = banks.find(b => b.programId === selectedProgramId);
  const questions = currentBank?.questions || [];
  const filteredQuestions = questions.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchKelas = kelasFilter === 'all' || q.kelas === Number(kelasFilter);
    return matchSearch && matchKelas;
  });

  const maxQuestions = 100;
  const canAddMore = questions.length < maxQuestions;

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!canAddMore) return;
    if (newQuestion.options.some(o => o.trim() === '')) return;

    const newId = nextId++;
    setBanks(prev => prev.map(b => {
      if (b.programId !== selectedProgramId) return b;
      return {
        ...b,
        questions: [...b.questions, { id: newId, text: newQuestion.text, options: [...newQuestion.options], correctIndex: newQuestion.correctIndex, imageUrl: newQuestion.imageUrl, audioUrl: newQuestion.audioUrl, jenjang: currentBank.jenjang, kelas: Number(newQuestion.kelas), mataPelajaran: newQuestion.mataPelajaran }]
      };
    }));
    setNewQuestion({ text: '', options: ['', '', '', ''], correctIndex: 0, imageUrl: '', audioUrl: '', kelas: '', mataPelajaran: '' });
    setShowAddQuestion(false);
  };

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (isEdit) {
        setEditingQuestion(prev => ({ ...prev, imageUrl: url }));
      } else {
        setNewQuestion(prev => ({ ...prev, imageUrl: url }));
      }
    }
  };

  const handleAudioUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (isEdit) {
        setEditingQuestion(prev => ({ ...prev, audioUrl: url }));
      } else {
        setNewQuestion(prev => ({ ...prev, audioUrl: url }));
      }
    }
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
            ? { ...q, text: editingQuestion.text, options: [...editingQuestion.options], correctIndex: editingQuestion.correctIndex, imageUrl: editingQuestion.imageUrl, audioUrl: editingQuestion.audioUrl, kelas: Number(editingQuestion.kelas), mataPelajaran: editingQuestion.mataPelajaran }
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
              onClick={() => { setSelectedProgramId(p.id); setSearch(''); setKelasFilter('all'); setShowAddQuestion(false); setEditingQuestion(null); }}
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

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
          <input
            type="text" className="form-input" placeholder="Cari soal..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select
          className="form-select"
          value={kelasFilter}
          onChange={e => setKelasFilter(e.target.value)}
          style={{ width: 150 }}
        >
          <option value="all">Semua Kelas</option>
          {getKelasForJenjang(currentBank?.jenjang).map(k => (
            <option key={k} value={k}>Kelas {k}</option>
          ))}
        </select>
      </div>

      {/* Add Question Form */}
      {showAddQuestion && canAddMore && (
        <div className="card animate-fadeIn" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', border: '2px solid var(--primary)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Plus size={18} style={{ color: 'var(--primary)' }} /> Tambah Soal Baru
          </h3>
          <form onSubmit={handleAddQuestion}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Kelas</label>
                <select
                  className="form-select"
                  value={newQuestion.kelas}
                  onChange={e => setNewQuestion({ ...newQuestion, kelas: e.target.value })}
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {getKelasForJenjang(currentBank?.jenjang).map(k => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Mata Pelajaran</label>
                <select
                  className="form-select"
                  value={newQuestion.mataPelajaran}
                  onChange={e => setNewQuestion({ ...newQuestion, mataPelajaran: e.target.value })}
                  required
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {getMataPelajaranList(currentBank?.jenjang).map(mp => (
                    <option key={mp} value={mp}>{mp}</option>
                  ))}
                </select>
              </div>
            </div>
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

            {/* Media Uploads */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ImageIcon size={14} /> Tambah Gambar (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-600)' }}
                />
                {newQuestion.imageUrl && (
                  <div style={{ marginTop: 'var(--space-2)', position: 'relative', display: 'inline-block' }}>
                    <img src={newQuestion.imageUrl} alt="Preview" style={{ height: 100, borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-200)' }} />
                    <button type="button" onClick={() => setNewQuestion({...newQuestion, imageUrl: ''})} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12}/></button>
                  </div>
                )}
              </div>

              {/* Audio Upload */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Volume2 size={14} /> Tambah Audio (Opsional)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleAudioUpload(e, false)}
                  style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-600)' }}
                />
                {newQuestion.audioUrl && (
                  <div style={{ marginTop: 'var(--space-2)', position: 'relative' }}>
                    <audio src={newQuestion.audioUrl} controls style={{ width: '100%', height: 40 }} />
                    <button type="button" onClick={() => setNewQuestion({...newQuestion, audioUrl: ''})} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12}/></button>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Kelas</label>
                  <select
                    className="form-select"
                    value={editingQuestion.kelas || ''}
                    onChange={e => setEditingQuestion({ ...editingQuestion, kelas: e.target.value })}
                    required
                  >
                    <option value="">Pilih Kelas</option>
                    {getKelasForJenjang(currentBank?.jenjang).map(k => (
                      <option key={k} value={k}>Kelas {k}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mata Pelajaran</label>
                  <select
                    className="form-select"
                    value={editingQuestion.mataPelajaran || ''}
                    onChange={e => setEditingQuestion({ ...editingQuestion, mataPelajaran: e.target.value })}
                    required
                  >
                    <option value="">Pilih Mata Pelajaran</option>
                    {getMataPelajaranList(currentBank?.jenjang).map(mp => (
                      <option key={mp} value={mp}>{mp}</option>
                    ))}
                  </select>
                </div>
              </div>
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
              {/* Media Uploads */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                {/* Image Upload */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ImageIcon size={14} /> Ganti Gambar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-600)' }}
                  />
                  {editingQuestion.imageUrl && (
                    <div style={{ marginTop: 'var(--space-2)', position: 'relative', display: 'inline-block' }}>
                      <img src={editingQuestion.imageUrl} alt="Preview" style={{ height: 100, borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-200)' }} />
                      <button type="button" onClick={() => setEditingQuestion({...editingQuestion, imageUrl: ''})} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12}/></button>
                    </div>
                  )}
                </div>

                {/* Audio Upload */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Volume2 size={14} /> Ganti Audio
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleAudioUpload(e, true)}
                    style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-600)' }}
                  />
                  {editingQuestion.audioUrl && (
                    <div style={{ marginTop: 'var(--space-2)', position: 'relative' }}>
                      <audio src={editingQuestion.audioUrl} controls style={{ width: '100%', height: 40 }} />
                      <button type="button" onClick={() => setEditingQuestion({...editingQuestion, audioUrl: ''})} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12}/></button>
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
              border: '1px solid var(--cream-200)',
              transition: 'all 0.2s',
            }}>
              <div
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                  cursor: 'pointer',
                }}
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
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', background: 'var(--cream-100)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}>
                      Kelas {q.kelas}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', background: 'var(--cream-100)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}>
                      {q.mataPelajaran}
                    </span>
                  </div>
                  <div style={{
                    fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)',
                    lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap'
                  }}>
                    {q.text}
                    {q.imageUrl && <ImageIcon size={14} style={{ color: 'var(--primary)' }} title="Ada Gambar" />}
                    {q.audioUrl && <Volume2 size={14} style={{ color: '#8b5cf6' }} title="Ada Audio" />}
                  </div>
                  {!isExpanded && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', marginTop: 4 }}>
                      Jawaban: {optionLabels[q.correctIndex]} — Klik untuk lihat detail
                    </div>
                  )}
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
                <div style={{
                  marginTop: 'var(--space-3)',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--cream-200)',
                }}>
                  {(q.imageUrl || q.audioUrl) && (
                    <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                      {q.imageUrl && (
                        <div style={{ border: '1px solid var(--cream-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                          <img src={q.imageUrl} alt="Soal Media" style={{ maxHeight: 200, display: 'block' }} />
                        </div>
                      )}
                      {q.audioUrl && (
                        <div style={{ flex: 1, minWidth: 250, display: 'flex', alignItems: 'center' }}>
                          <audio src={q.audioUrl} controls style={{ width: '100%' }} />
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
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
                </div>
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
