'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    const result = login(email, password);
    if (result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fadeIn">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            width: 56, height: 56, borderRadius: 'var(--radius-xl)',
            background: 'rgba(139,115,85,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)', color: 'var(--primary)'
          }}>
            <GraduationCap size={28} />
          </div>
          <h1>Masuk ke Akun</h1>
          <p className="subtitle">Masuk sebagai Admin atau Siswa</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'var(--error-light)', color: 'var(--error)',
              padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              marginBottom: 'var(--space-4)'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="email@lamasia.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
              style={{ marginTop: 'var(--space-2)' }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </form>

        <div style={{ 
          marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--cream-200)'
        }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', textAlign: 'center', marginBottom: 'var(--space-3)' }}>
            Demo Credentials
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ 
              background: 'var(--cream-50)', borderRadius: 'var(--radius-md)', 
              padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)' 
            }}>
              <span style={{ color: 'var(--neutral-500)' }}>Admin:</span>{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--neutral-700)' }}>admin@lamasia.id</code> / <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--neutral-700)' }}>admin123</code>
            </div>
            <div style={{ 
              background: 'var(--cream-50)', borderRadius: 'var(--radius-md)', 
              padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)' 
            }}>
              <span style={{ color: 'var(--neutral-500)' }}>Siswa:</span>{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--neutral-700)' }}>budi@student.lamasia.id</code> / <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--neutral-700)' }}>student123</code>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <Link href="/" style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
