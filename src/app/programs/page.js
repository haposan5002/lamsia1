'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { programs, formatCurrency, getKelasForJenjang } from '@/lib/data';
import { Clock, GraduationCap, BookOpen, Trophy, ArrowRight, Filter, X } from 'lucide-react';

const iconMap = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'trophy': Trophy,
};

export default function ProgramsPage() {
  const [selectedJenjang, setSelectedJenjang] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');

  const kelasOptions = selectedJenjang ? getKelasForJenjang(selectedJenjang) : [];

  const filteredPrograms = programs.filter(p => {
    if (selectedJenjang && p.jenjang !== selectedJenjang) return false;
    if (selectedKelas && !p.kelasTersedia.includes(Number(selectedKelas))) return false;
    return true;
  });

  const handleJenjangChange = (j) => {
    setSelectedJenjang(j);
    setSelectedKelas('');
  };

  const clearFilters = () => {
    setSelectedJenjang('');
    setSelectedKelas('');
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="section" style={{ paddingTop: 'var(--space-12)' }}>
          <div className="container">
            <div className="section-header">
              <h1>Program Bimbingan Belajar</h1>
              <p>Temukan program yang tepat untuk mendukung perjalanan akademikmu menuju kesuksesan</p>
            </div>

            {/* Filter Bar */}
            <div className="card" style={{
              padding: 'var(--space-4) var(--space-6)',
              marginBottom: 'var(--space-8)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                <Filter size={16} /> Filter:
              </div>

              {/* Jenjang */}
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {['SD', 'SMP', 'SMA'].map(j => (
                  <button
                    key={j}
                    onClick={() => handleJenjangChange(selectedJenjang === j ? '' : j)}
                    style={{
                      padding: '6px 16px', borderRadius: 'var(--radius-full)',
                      border: `2px solid ${selectedJenjang === j ? 'var(--primary)' : 'var(--cream-200)'}`,
                      background: selectedJenjang === j ? 'var(--primary)' : 'white',
                      color: selectedJenjang === j ? 'white' : 'var(--neutral-700)',
                      fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {j}
                  </button>
                ))}
              </div>

              {/* Kelas (dynamic) */}
              {selectedJenjang && kelasOptions.length > 0 && (
                <>
                  <span style={{ color: 'var(--neutral-300)' }}>|</span>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>Kelas:</span>
                    {kelasOptions.map(k => (
                      <button
                        key={k}
                        onClick={() => setSelectedKelas(selectedKelas === String(k) ? '' : String(k))}
                        style={{
                          padding: '4px 12px', borderRadius: 'var(--radius-full)',
                          border: `2px solid ${selectedKelas === String(k) ? 'var(--primary)' : 'var(--cream-200)'}`,
                          background: selectedKelas === String(k) ? 'var(--primary)' : 'white',
                          color: selectedKelas === String(k) ? 'white' : 'var(--neutral-600)',
                          fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {(selectedJenjang || selectedKelas) && (
                <button onClick={clearFilters} style={{
                  marginLeft: 'auto', padding: '4px 12px', borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--cream-200)', background: 'white',
                  color: 'var(--neutral-500)', fontSize: 'var(--text-xs)', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <X size={12} /> Reset
                </button>
              )}
            </div>

            <div className="programs-grid">
              {filteredPrograms.map((program) => {
                const Icon = iconMap[program.icon] || BookOpen;
                return (
                  <div className="program-card" key={program.id} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="program-card-image">
                      <div className="icon-placeholder">
                        <Icon size={32} />
                      </div>
                      {/* Jenjang badge */}
                      <div style={{
                        position: 'absolute', top: 12, left: 12,
                        display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap',
                      }}>
                        <span style={{
                          background: 'var(--primary)', color: 'white',
                          padding: '3px 10px', borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)', fontWeight: 700,
                        }}>
                          {program.jenjang}
                        </span>
                        {program.kelasTersedia.map(k => (
                          <span key={k} style={{
                            background: 'rgba(255,255,255,0.9)', color: 'var(--primary)',
                            padding: '3px 8px', borderRadius: 'var(--radius-full)',
                            fontSize: '10px', fontWeight: 700, border: '1px solid var(--cream-200)',
                          }}>
                            Kelas {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="program-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3>{program.name}</h3>
                      <p>{program.description}</p>
                      
                      <ul style={{ 
                        listStyle: 'none', display: 'flex', flexDirection: 'column', 
                        gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flex: 1 
                      }}>
                        {program.features.map((feature, i) => (
                          <li key={i} style={{ 
                            fontSize: 'var(--text-sm)', color: 'var(--neutral-600)',
                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)' 
                          }}>
                            <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="program-card-meta">
                        <span><Clock size={14} /> {program.duration}</span>
                        <span className="program-card-price">{formatCurrency(program.price)}</span>
                      </div>

                      <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
                        <Link href={`/programs/${program.id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                          Detail
                        </Link>
                        <Link href="/register" className="btn btn-primary" style={{ flex: 1 }}>
                          Daftar <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPrograms.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--neutral-400)' }}>
                <BookOpen size={48} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
                <h3>Tidak ada program ditemukan</h3>
                <p>Coba ubah filter jenjang atau kelas</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
