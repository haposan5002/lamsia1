'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { students, studentSchedules, materials, feedbacks, programs, packages, formatDateTime } from '@/lib/data';
import { Calendar, BookOpen, MessageSquare, ArrowRight, Clock, Lock, Unlock, Sparkles, Package, RefreshCw, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.id);
  const schedule = studentSchedules.filter(s => s.studentId === user?.id);
  const studentMaterials = materials.filter(m => 
    m.assignedStudentIds && m.assignedStudentIds.includes(user?.id)
  );
  const unlockedMaterials = studentMaterials.filter(m => !m.isLocked);
  const studentFeedback = feedbacks.filter(f => f.studentId === user?.id);
  const latestFeedback = studentFeedback[0];
  const studentPrograms = programs.filter(p => student?.programIds?.includes(p.id));

  const sessionPercent = student ? Math.round((student.remainingSessions / student.totalSessions) * 100) : 0;
  const sessionColor = sessionPercent <= 15 ? 'var(--error)' : sessionPercent <= 40 ? 'var(--warning)' : 'var(--success)';

  // Package expiry
  const expiryDate = student?.paketExpiry ? new Date(student.paketExpiry) : null;
  const today = new Date();
  const daysLeft = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 30;
  const expiryColor = isExpired ? 'var(--error)' : isExpiringSoon ? 'var(--warning)' : 'var(--success)';

  return (
    <div className="animate-fadeIn">
      {/* Welcome Banner */}
      <div className="card" style={{
        padding: 'var(--space-8)',
        background: 'linear-gradient(135deg, var(--cream-100), rgba(139,115,85,0.08))',
        marginBottom: 'var(--space-8)',
        border: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <Sparkles size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', fontWeight: 500 }}>Portal Siswa</span>
        </div>
        <h1 style={{ marginBottom: 'var(--space-3)' }}>Selamat Datang, {user?.name}! 👋</h1>
        
        {/* Render multiple programs dynamically */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {student?.jenjang && (
            <span style={{
              background: 'rgba(139,115,85,0.15)', color: 'var(--primary-dark)',
              padding: '4px 12px', borderRadius: '999px',
              fontSize: 'var(--text-sm)', fontWeight: 600,
              border: '1px solid rgba(139,115,85,0.3)',
            }}>
              {student.jenjang} · Kelas {student.kelas}
            </span>
          )}
          {studentPrograms.map(p => (
            <span key={p.id} style={{
              background: 'var(--primary)', color: 'white',
              padding: '4px 12px', borderRadius: '999px',
              fontSize: 'var(--text-sm)', fontWeight: 500
            }}>
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        {/* Session Quota Widget */}
        <div className="stat-card" style={{ borderLeft: `3px solid ${sessionColor}` }}>
          <div className="stat-card-icon" style={{ background: sessionPercent <= 15 ? 'var(--error-light)' : sessionPercent <= 40 ? 'var(--warning-light)' : 'var(--success-light)', color: sessionColor }}>
            <Package size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
              <div className="stat-card-value" style={{ color: sessionColor }}>
                {student?.remainingSessions ?? 0}
              </div>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>/ {student?.totalSessions ?? 0} sesi</span>
            </div>
            <div className="stat-card-label">Sisa Sesi</div>
            {/* Progress Bar */}
            <div style={{ 
              marginTop: 'var(--space-2)', height: 4, background: 'var(--cream-200)', 
              borderRadius: 2, overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${sessionPercent}%`, height: '100%', 
                background: sessionColor, borderRadius: 2,
                transition: 'width 0.5s ease' 
              }} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon primary">
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-card-value">{schedule.length}</div>
            <div className="stat-card-label">Jadwal Kelas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon success">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-card-value">{unlockedMaterials.length}/{studentMaterials.length}</div>
            <div className="stat-card-label">Materi Tersedia</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon info">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="stat-card-value">{studentFeedback.length}</div>
            <div className="stat-card-label">Feedback</div>
          </div>
        </div>
        
        {/* Package Expiry Widget */}
        {daysLeft !== null && (
          <div className="stat-card" style={{ borderLeft: `3px solid ${expiryColor}` }}>
            <div className="stat-card-icon" style={{ background: isExpired ? 'var(--error-light)' : isExpiringSoon ? 'var(--warning-light)' : 'var(--success-light)', color: expiryColor }}>
              {isExpired || isExpiringSoon ? <AlertCircle size={24} /> : <RefreshCw size={24} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                <div className="stat-card-value" style={{ color: expiryColor }}>
                  {isExpired ? '0' : daysLeft}
                </div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>{isExpired ? 'Expired' : 'hari lagi'}</span>
              </div>
              <div className="stat-card-label">{isExpired ? 'Paket Habis' : 'Paket Aktif'}</div>
              {(isExpired || isExpiringSoon) && (
                <Link href="/student/renew" style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 700, marginTop: 4, display: 'inline-block' }}>
                  Perpanjang →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Upcoming Schedule */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)' }}>Jadwal Kelas</h3>
            <Link href="/student/schedule" style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {schedule.slice(0, 3).map((sch) => (
              <div key={sch.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3)', background: 'var(--cream-50)', borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  width: 40, padding: '2px 0',
                  textAlign: 'center', flexShrink: 0
                }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    {sch.dayOfWeek.slice(0, 3)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{sch.subject}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> {sch.startTime} - {sch.endTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Feedback */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)' }}>Feedback Terbaru</h3>
            <Link href="/student/feedback" style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          {latestFeedback ? (
            <div className="feedback-item" style={{ margin: 0 }}>
              <div className="feedback-meta">
                <span className="author">{latestFeedback.adminName}</span>
                <span className="date">{formatDateTime(latestFeedback.createdAt)}</span>
              </div>
              <div className="feedback-content" style={{
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {latestFeedback.content}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--neutral-400)', textAlign: 'center', padding: 'var(--space-6)' }}>
              Belum ada feedback.
            </p>
          )}
        </div>
      </div>

      {/* Recent Materials */}
      <div className="card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)' }}>Materi Belajar</h3>
          <Link href="/student/materials" style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 4 }}>
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
          {studentMaterials.slice(0, 4).map((mat) => (
            <div key={mat.id} className={`material-card ${mat.isLocked ? 'locked' : ''}`}>
              <div className={`material-icon ${mat.type}`}>
                {mat.isLocked ? <Lock size={18} /> : <BookOpen size={18} />}
              </div>
              <div className="material-info">
                <h4>{mat.title}</h4>
                <p>{mat.isLocked ? 'Terkunci' : 'Tersedia'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
