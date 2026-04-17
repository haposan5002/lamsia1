import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { programs, formatCurrency } from '@/lib/data';
import { Clock, GraduationCap, BookOpen, Trophy, ArrowRight } from 'lucide-react';

const iconMap = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'trophy': Trophy,
};

export const metadata = {
  title: 'Program Kursus — La Masia Academy',
  description: 'Jelajahi program bimbingan belajar La Masia Academy: Intensif UTBK, Reguler SMA, dan Privat Olimpiade.',
};

export default function ProgramsPage() {
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

            <div className="programs-grid">
              {programs.map((program) => {
                const Icon = iconMap[program.icon] || BookOpen;
                return (
                  <div className="program-card" key={program.id}>
                    <div className="program-card-image">
                      <div className="icon-placeholder">
                        <Icon size={32} />
                      </div>
                    </div>
                    <div className="program-card-body">
                      <h3>{program.name}</h3>
                      <p>{program.description}</p>
                      
                      <ul style={{ 
                        listStyle: 'none', display: 'flex', flexDirection: 'column', 
                        gap: 'var(--space-2)', marginBottom: 'var(--space-4)' 
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
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
