'use client';

import Link from 'next/link';
import { registrations, students, programs, materials, formatDate } from '@/lib/data';
import { Users, FileText, BookOpen, UserCheck, Clock, ArrowRight, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const totalStudents = students.length;
  const totalMaterials = materials.length;

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Selamat datang kembali! Berikut ringkasan data terkini.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon warning">
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-card-value">{pendingCount}</div>
            <div className="stat-card-label">Pendaftaran Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon success">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-card-value">{approvedCount}</div>
            <div className="stat-card-label">Disetujui</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon primary">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-card-value">{totalStudents}</div>
            <div className="stat-card-label">Siswa Aktif</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon info">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-card-value">{totalMaterials}</div>
            <div className="stat-card-label">Total Materi</div>
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)' }}>Pendaftaran Terbaru</h3>
            <Link href="/admin/registrations" style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {registrations.slice(0, 4).map((reg) => (
              <div key={reg.id} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                background: 'var(--cream-50)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--neutral-800)' }}>
                    {reg.fullName}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
                    {programs.find(p => p.id === reg.programId)?.name}
                  </div>
                </div>
                <span className={`badge badge-${reg.status}`}>
                  {reg.status === 'pending' ? 'Pending' : reg.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)' }}>Siswa Aktif</h3>
            <Link href="/admin/students" style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {students.map((student) => (
              <div key={student.id} style={{ 
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                background: 'var(--cream-50)'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(139,115,85,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', flexShrink: 0
                }}>
                  {student.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--neutral-800)' }}>
                    {student.name}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
                    {student.programName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
