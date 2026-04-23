'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registrations as initialRegistrations, programs, formatDate } from '@/lib/data';
import { Eye, Search, Filter, ArrowUpDown } from 'lucide-react';

export default function RegistrationsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortByPretest, setSortByPretest] = useState(''); // '' | 'asc' | 'desc'

  let filtered = initialRegistrations.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSearch = r.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        r.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Sort by pretest score
  if (sortByPretest) {
    filtered = [...filtered].sort((a, b) => {
      const scoreA = a.pretestScore ?? -1;
      const scoreB = b.pretestScore ?? -1;
      return sortByPretest === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    });
  }

  const getPretestColor = (score) => {
    if (score === null || score === undefined) return null;
    if (score >= 80) return { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)', text: '#16a34a', icon: '🟢' };
    if (score >= 60) return { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.3)', text: '#ca8a04', icon: '🟡' };
    return { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', text: '#dc2626', icon: '🔴' };
  };

  const togglePretestSort = () => {
    if (sortByPretest === '') setSortByPretest('desc');
    else if (sortByPretest === 'desc') setSortByPretest('asc');
    else setSortByPretest('');
  };

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-header">
        <div>
          <h1>Manajemen Pendaftaran</h1>
          <p>Kelola semua data pendaftaran calon peserta</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
          <input
            type="text" className="form-input" placeholder="Cari nama atau email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'Semua' : status === 'pending' ? 'Pending' : status === 'approved' ? 'Disetujui' : 'Ditolak'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenjang</th>
              <th>Program</th>
              <th>Tanggal</th>
              <th>
                <button onClick={togglePretestSort} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontWeight: 700, fontSize: 'inherit', color: 'inherit',
                  padding: 0, fontFamily: 'inherit',
                }}>
                  Pretest <ArrowUpDown size={12} style={{ opacity: sortByPretest ? 1 : 0.4 }} />
                </button>
              </th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((reg) => {
              const pretestStyle = getPretestColor(reg.pretestScore);
              return (
                <tr key={reg.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{reg.fullName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)' }}>{reg.email}</div>
                  </td>
                  <td>
                    {reg.jenjang && (
                      <span style={{
                        background: 'var(--cream-100)', color: 'var(--primary)',
                        padding: '2px 8px', borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)', fontWeight: 700,
                      }}>
                        {reg.jenjang} · Kelas {reg.kelas}
                      </span>
                    )}
                  </td>
                  <td>{programs.find(p => p.id === reg.programId)?.name || '-'}</td>
                  <td style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
                    {formatDate(reg.createdAt)}
                  </td>
                  <td>
                    {reg.pretestStatus === 'selesai' && pretestStyle ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 'var(--radius-full)',
                        background: pretestStyle.bg, border: `1px solid ${pretestStyle.border}`,
                        color: pretestStyle.text, fontWeight: 700, fontSize: 'var(--text-sm)',
                      }}>
                        {pretestStyle.icon} {reg.pretestScore}
                      </span>
                    ) : (
                      <span style={{
                        padding: '4px 10px', borderRadius: 'var(--radius-full)',
                        background: 'var(--cream-50)', color: 'var(--neutral-400)',
                        fontSize: 'var(--text-xs)', fontWeight: 600,
                      }}>
                        Belum Pretest
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${reg.status}`}>
                      {reg.status === 'pending' ? 'Pending' : reg.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/registrations/${reg.id}`} className="btn btn-ghost btn-sm">
                      <Eye size={16} /> Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--neutral-400)' }}>
                  Tidak ada data pendaftaran ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
