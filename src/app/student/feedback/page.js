'use client';

import { useAuth } from '@/lib/auth';
import { feedbacks, formatDateTime } from '@/lib/data';
import { MessageSquare } from 'lucide-react';

export default function StudentFeedbackPage() {
  const { user } = useAuth();
  const studentFeedback = feedbacks
    .filter(f => f.studentId === user?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1>Personal Feedback</h1>
          <p>Catatan dan arahan personal dari pengajar untuk perkembangan belajar Anda</p>
        </div>
      </div>

      {studentFeedback.length > 0 ? (
        <div className="feedback-timeline">
          {studentFeedback.map((fb) => (
            <div className="feedback-item" key={fb.id}>
              <div className="feedback-meta">
                <span className="author">{fb.adminName}</span>
                <span className="date">{formatDateTime(fb.createdAt)}</span>
              </div>
              <div className="feedback-content">{fb.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <MessageSquare size={48} style={{ color: 'var(--neutral-300)' }} />
          <h3>Belum Ada Feedback</h3>
          <p>Pengajar Anda belum memberikan feedback. Feedback akan muncul di sini setelah sesi bimbingan.</p>
        </div>
      )}
    </div>
  );
}
