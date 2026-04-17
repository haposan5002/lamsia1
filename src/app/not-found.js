import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--cream-50), var(--cream-100))',
      padding: 'var(--space-4)',
      textAlign: 'center'
    }}>
      <div>
        <div style={{
          fontSize: '120px',
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          color: 'var(--cream-300)',
          lineHeight: 1,
          marginBottom: 'var(--space-4)'
        }}>
          404
        </div>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
          Halaman Tidak Ditemukan
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--neutral-500)', marginBottom: 'var(--space-8)', maxWidth: 400, margin: '0 auto var(--space-8)' }}>
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} /> Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
