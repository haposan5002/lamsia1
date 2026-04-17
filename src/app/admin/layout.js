'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { 
  LayoutDashboard, Users, FileText, BookOpen, MessageSquare, 
  LogOut, GraduationCap, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/registrations', label: 'Pendaftaran', icon: FileText },
  { href: '/admin/students', label: 'Siswa', icon: Users },
  { href: '/admin/materials', label: 'Materi', icon: BookOpen },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
];

export default function AdminLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--neutral-400)' }}>Memuat...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Toggle */}
      <button 
        className="sidebar-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <GraduationCap size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          La Masia
          <small>Admin Dashboard</small>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-3)', marginBottom: 'var(--space-2)'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(139,115,85,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)'
            }}>
              {user.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--neutral-800)' }}>{user.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)' }}>{user.email}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm w-full" onClick={handleLogout} style={{ justifyContent: 'flex-start' }}>
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
