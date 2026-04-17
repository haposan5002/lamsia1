'use client';

import { useState } from 'react';
import { students, feedbacks as initialFeedbacks, formatDateTime } from '@/lib/data';
import { Send, MessageSquare, User } from 'lucide-react';

export default function FeedbackPage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [feedbackList, setFeedbackList] = useState(initialFeedbacks);
  const [newFeedback, setNewFeedback] = useState('');

  const studentFeedback = selectedStudent
    ? feedbackList.filter(f => f.studentId === Number(selectedStudent))
    : [];

  const selectedStudentData = students.find(s => s.id === Number(selectedStudent));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newFeedback.trim() || !selectedStudent) return;

    const feedback = {
      id: feedbackList.length + 1,
      studentId: Number(selectedStudent),
      adminId: 1,
      adminName: 'Admin La Masia',
      content: newFeedback.trim(),
      createdAt: new Date().toISOString(),
    };

    setFeedbackList(prev => [feedback, ...prev]);
    setNewFeedback('');
  };

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1>Personal Feedback</h1>
          <p>Berikan catatan dan feedback personal kepada setiap siswa</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-6)' }}>
        {/* Student List */}
        <div className="card" style={{ padding: 'var(--space-4)', alignSelf: 'start' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', padding: 'var(--space-2) var(--space-2)', marginBottom: 'var(--space-2)' }}>
            Pilih Siswa
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(String(student.id))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                  border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                  background: selectedStudent === String(student.id) ? 'var(--cream-100)' : 'transparent',
                  transition: 'background 150ms ease'
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: selectedStudent === String(student.id) ? 'var(--primary)' : 'rgba(139,115,85,0.1)',
                  color: selectedStudent === String(student.id) ? '#fff' : 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: 'var(--text-sm)', flexShrink: 0
                }}>
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--neutral-800)' }}>{student.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)' }}>{student.programName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Area */}
        <div>
          {!selectedStudent ? (
            <div className="card empty-state" style={{ padding: 'var(--space-16)' }}>
              <MessageSquare size={48} style={{ color: 'var(--neutral-300)' }} />
              <h3>Pilih Siswa</h3>
              <p>Pilih siswa di panel kiri untuk melihat dan menulis feedback.</p>
            </div>
          ) : (
            <>
              {/* New Feedback Form */}
              <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>
                  Feedback untuk {selectedStudentData?.name}
                </h3>
                <form onSubmit={handleSubmit}>
                  <textarea
                    className="form-textarea"
                    placeholder="Tulis feedback, catatan progress, atau arahan untuk siswa..."
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    rows={4}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
                    <button type="submit" className="btn btn-primary">
                      <Send size={16} /> Kirim Feedback
                    </button>
                  </div>
                </form>
              </div>

              {/* Feedback History */}
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)', color: 'var(--neutral-600)' }}>
                Riwayat Feedback ({studentFeedback.length})
              </h3>
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
                <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--neutral-400)' }}>
                  Belum ada feedback untuk siswa ini.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
