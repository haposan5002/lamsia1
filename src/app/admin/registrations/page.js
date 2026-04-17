'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registrations as initialRegistrations, programs, formatDate } from '@/lib/data';
import { Eye, Search, Filter } from 'lucide-react';

export default function RegistrationsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = initialRegistrations.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSearch = r.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        r.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

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
            type="text"
            className="form-input"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              <th>Email</th>
              <th>Program</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((reg) => (
              <tr key={reg.id}>
                <td style={{ fontWeight: 600 }}>{reg.fullName}</td>
                <td>{reg.email}</td>
                <td>{programs.find(p => p.id === reg.programId)?.name || '-'}</td>
                <td style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
                  {formatDate(reg.createdAt)}
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
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--neutral-400)' }}>
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
