'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { students, materials } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Lock, FileText, Video, Brain, Download, ExternalLink, BookOpen, Play } from 'lucide-react';

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
  const router = useRouter();
  const student = students.find(s => s.id === user?.id);

  const [hasCompletedLevelTest, setHasCompletedLevelTest] = useState(false);

  useEffect(() => {
    if (student) {
      const timer = setTimeout(() => {
        const completedLocal = localStorage.getItem(`levelTestCompleted_${student.id}`) === 'true';
        setHasCompletedLevelTest(student.hasCompletedLevelTest || completedLocal);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [student]);

  const studentMaterials = materials.filter(m => 
    m.assignedStudentIds && m.assignedStudentIds.includes(student?.id) && !m.isLevelTest
  ).map(m => {
    if (!hasCompletedLevelTest) {
      return { ...m, isLocked: true, lockedReason: 'Selesaikan Test Level terlebih dahulu' };
    }
    return m;
  });

  const unlockedCount = studentMaterials.filter(m => !m.isLocked).length;

  const handleOpenMaterial = (mat) => {
    if (mat.isLocked) return;

    // Interactive quiz → go to quiz page
    if (mat.type === 'quiz' && (mat.isInteractiveQuiz || mat.quizQuestionIds?.length > 0)) {
      router.push(`/student/quiz/${mat.id}`);
      return;
    }

    // Video with URL → open link
    if (mat.type === 'video' && mat.videoUrl) {
      window.open(mat.videoUrl, '_blank');
      return;
    }

    // Default: download/open file
    if (mat.fileUrl) {
      window.open(mat.fileUrl, '_blank');
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Materi Belajar</h1>
          <p>{unlockedCount} dari {studentMaterials.length} materi tersedia untuk diakses</p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem(`levelTestCompleted_${student?.id}`);
            window.location.reload();
          }}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '12px' }}
        >
          🔄 Reset Pre-Test (Debug)
        </button>
      </div>

      {/* Mandatory Level Test Banner */}
      {!hasCompletedLevelTest && (
        <div className="card" style={{
          padding: 'var(--space-6)', marginBottom: 'var(--space-6)',
          background: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(234,179,8,0.02))',
          border: '2px solid rgba(234,179,8,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)'
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: '#ca8a04', marginBottom: 'var(--space-2)' }}>
              <Brain size={20} /> Wajib: Test Level
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-700)', lineHeight: 1.5 }}>
              Kamu harus mengerjakan Test Level (Pre-Test) terlebih dahulu untuk mengukur kemampuan awalmu. Semua materi video dan dokumen akan terbuka otomatis setelah kamu menyelesaikan tes ini.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => router.push('/student/level-test')} style={{ background: '#ca8a04', borderColor: '#ca8a04' }}>
            Mulai Test Level
          </button>
        </div>
      )}

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
          const isInteractiveQuiz = mat.type === 'quiz' && (mat.isInteractiveQuiz || mat.quizQuestionIds?.length > 0);
          const isVideoLink = mat.type === 'video' && mat.videoUrl;

          return (
            <div key={mat.id} className={`material-card ${mat.isLocked ? 'locked' : ''}`}>
              <div className={`material-icon ${mat.type}`}>
                {mat.isLocked ? <Lock size={20} /> : <Icon size={20} />}
              </div>
              <div className="material-info" style={{ flex: 1 }}>
                <h4>{mat.title}</h4>
                <p>
                  {typeLabels[mat.type]}
                  {isInteractiveQuiz && ' • 🧩 Kuis Interaktif'}
                  {isVideoLink && ' • 🔗 Link Video'}
                </p>
              </div>
              {mat.isLocked ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <span className="badge badge-locked" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={12} /> {mat.isLevelTest ? 'Belum Waktunya' : 'Terkunci'}
                  </span>
                  {mat.lockedReason && (
                    <span style={{ fontSize: '11px', color: 'var(--error)' }}>
                      {mat.lockedReason}
                    </span>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="badge badge-approved">✓ Tersedia</span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenMaterial(mat)}
                  >
                    {isInteractiveQuiz ? (
                      <><Brain size={14} /> Kerjakan</>
                    ) : isVideoLink ? (
                      <><Play size={14} /> Tonton</>
                    ) : mat.type === 'video' ? (
                      <><ExternalLink size={14} /> Tonton</>
                    ) : mat.type === 'quiz' ? (
                      <><ExternalLink size={14} /> Kerjakan</>
                    ) : (
                      <><Download size={14} /> Unduh</>
                    )}
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
