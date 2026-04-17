'use client';

import { useAuth } from '@/lib/auth';
import { studentSchedules } from '@/lib/data';
import { Clock, MapPin, Video, ExternalLink } from 'lucide-react';

export default function StudentSchedulePage() {
  const { user } = useAuth();
  const schedule = studentSchedules.filter(s => s.studentId === user?.id);

  const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const sorted = [...schedule].sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1>Jadwal Kelas</h1>
          <p>Jadwal kelas personal yang telah diatur oleh admin</p>
        </div>
      </div>

      <div className="schedule-grid">
        {sorted.map((sch) => (
          <div className="schedule-item" key={sch.id}>
            <div className="schedule-day">
              <div className="day-name">{sch.dayOfWeek.slice(0, 3)}</div>
              <div className="day-sub">{sch.dayOfWeek}</div>
            </div>
            <div className="schedule-divider" />
            <div className="schedule-detail" style={{ flex: 1 }}>
              <h4>{sch.subject}</h4>
              <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Clock size={13} /> {sch.startTime} — {sch.endTime} WIB
                {sch.duration && (
                  <span style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-xs)' }}>({sch.duration})</span>
                )}
              </p>
            </div>

            {/* Live Class or Room Badge */}
            {sch.liveClassUrl ? (
              <a
                href={sch.liveClassUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm live-class-btn"
                id={`join-live-class-${sch.id}`}
              >
                <Video size={14} />
                Join Live Class
                <ExternalLink size={12} />
              </a>
            ) : (
              <div style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'rgba(139,115,85,0.08)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--primary-dark)',
                fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                <MapPin size={12} /> Ruang Kelas
              </div>
            )}
          </div>
        ))}
      </div>

      {schedule.length === 0 && (
        <div className="empty-state">
          <Clock size={48} style={{ color: 'var(--neutral-300)' }} />
          <h3>Belum Ada Jadwal</h3>
          <p>Jadwal kelas Anda belum diatur. Silakan hubungi admin.</p>
        </div>
      )}
    </div>
  );
}
