import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { programs, formatCurrency } from '@/lib/data';
import { Clock, ArrowRight, ArrowLeft, GraduationCap, BookOpen, Trophy, Users, CheckCircle } from 'lucide-react';

const iconMap = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'trophy': Trophy,
};

export function generateStaticParams() {
  return programs.map((p) => ({ id: String(p.id) }));
}

export function generateMetadata({ params }) {
  const program = programs.find((p) => String(p.id) === params.id);
  if (!program) return { title: 'Program Tidak Ditemukan' };
  return {
    title: `${program.name} — La Masia Academy`,
    description: program.description,
  };
}

export default async function ProgramDetailPage({ params }) {
  const { id } = await params;
  const program = programs.find((p) => String(p.id) === id);
  if (!program) return notFound();

  const Icon = iconMap[program.icon] || BookOpen;

  return (
    <>
      <Navbar />
      <main>
        <section className="section" style={{ paddingTop: 'var(--space-8)' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <Link href="/programs" style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 'var(--space-6)',
              textDecoration: 'none'
            }}>
              <ArrowLeft size={16} /> Kembali ke Program
            </Link>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, var(--cream-100), var(--cream-200))',
                padding: 'var(--space-12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 'var(--radius-xl)',
                  background: 'rgba(139,115,85,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Icon size={40} />
                </div>
              </div>

              <div style={{ padding: 'var(--space-8)' }}>
                {program.jenjang && (
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                      {program.jenjang}
                    </span>
                    {program.kelasTersedia?.length > 0 && (
                      <span style={{ background: 'var(--cream-100)', color: 'var(--primary-dark)', padding: '4px 12px', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, border: '1px solid rgba(139,115,85,0.2)' }}>
                        Kelas {program.kelasTersedia.join(', ')}
                      </span>
                    )}
                  </div>
                )}
                <h1 style={{ marginBottom: 'var(--space-3)' }}>{program.name}</h1>
                <p style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-6)' }}>{program.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                  <div className="card card-cream" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 4 }}>Durasi</div>
                    <div style={{ fontWeight: 600, color: 'var(--neutral-800)' }}>{program.duration}</div>
                  </div>
                  <div className="card card-cream" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 4 }}>Biaya</div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{formatCurrency(program.price)}</div>
                  </div>
                  <div className="card card-cream" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: 4 }}>Jadwal</div>
                    <div style={{ fontWeight: 600, color: 'var(--neutral-800)', fontSize: 'var(--text-sm)' }}>{program.schedule}</div>
                  </div>
                </div>

                <h3 style={{ marginBottom: 'var(--space-4)' }}>Apa yang Kamu Dapatkan</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                  {program.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-md)' }}>
                      <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--neutral-700)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <Link href="/register" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                    Daftar Program Ini <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
