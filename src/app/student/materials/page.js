'use client';

import { useAuth } from '@/lib/auth';
import { students, materials } from '@/lib/data';
import { Lock, FileText, Video, Brain, Download, ExternalLink, BookOpen } from 'lucide-react';

const typeIcons = {
  document: FileText,
  video: Video,
  quiz: Brain,
};

const typeLabels = {
  document: 'Dokumen',
  video: 'Video',
  quiz: 'Tryout / Kuis',
};

export default function StudentMaterialsPage() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.id);
  const studentMaterials = materials.filter(m => m.programId === student?.programId);
  const unlockedCount = studentMaterials.filter(m => !m.isLocked).length;

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1>Materi Belajar</h1>
          <p>{unlockedCount} dari {studentMaterials.length} materi tersedia untuk diakses</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Progress Materi</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>{unlockedCount}/{studentMaterials.length}</span>
        </div>
        <div style={{ 
          width: '100%', height: 8, background: 'var(--cream-200)', borderRadius: 4,
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${studentMaterials.length > 0 ? (unlockedCount / studentMaterials.length) * 100 : 0}%`,
            height: '100%', background: 'var(--primary)', borderRadius: 4,
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Materials List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {studentMaterials.map((mat) => {
          const Icon = typeIcons[mat.type] || FileText;
          return (
            <div key={mat.id} className={`material-card ${mat.isLocked ? 'locked' : ''}`}>
              <div className={`material-icon ${mat.type}`}>
                {mat.isLocked ? <Lock size={20} /> : <Icon size={20} />}
              </div>
              <div className="material-info" style={{ flex: 1 }}>
                <h4>{mat.title}</h4>
                <p>{typeLabels[mat.type]}</p>
              </div>
              {mat.isLocked ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="badge badge-locked">
                    🔒 Terkunci
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="badge badge-approved">✓ Tersedia</span>
                  <button className="btn btn-primary btn-sm">
                    {mat.type === 'video' ? <><ExternalLink size={14} /> Tonton</> : <><Download size={14} /> Unduh</>}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {studentMaterials.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} style={{ color: 'var(--neutral-300)' }} />
          <h3>Belum Ada Materi</h3>
          <p>Materi belajar untuk program Anda belum tersedia.</p>
        </div>
      )}
    </div>
  );
}
