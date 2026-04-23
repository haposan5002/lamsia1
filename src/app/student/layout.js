'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { students } from '@/lib/data';
import StudentRenewalPopup from '@/components/StudentRenewalPopup';
import { 
  LayoutDashboard, Calendar, BookOpen, MessageSquare, 
  LogOut, GraduationCap, Menu, X, RefreshCw, ClipboardList
} from 'lucide-react';

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/schedule', label: 'Jadwal', icon: Calendar },
  { href: '/student/materials', label: 'Materi', icon: BookOpen },
  { href: '/student/tryout', label: 'Tryout', icon: ClipboardList },
  { href: '/student/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/student/renew', label: 'Perpanjang Paket', icon: RefreshCw },
];

export default function StudentLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'student')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'student') {
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
          <small>Portal Siswa</small>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
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
        {/* Session Renewal Popup - blocks when remainingSessions === 0 */}
        {(() => {
          const studentData = students.find(s => s.id === user?.id);
          if (studentData && studentData.remainingSessions === 0 && pathname !== '/student/renew') {
            return <StudentRenewalPopup student={studentData} />;
          }
          return null;
        })()}
        {children}
      </main>
    </div>
  );
}
