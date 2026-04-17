import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { programs, formatCurrency } from '@/lib/data';
import { 
  GraduationCap, BookOpen, Trophy, Clock, Users, Star, 
  Award, Target, ChevronRight, MapPin, ArrowRight,
  FileText, Video, Brain, Shield, Sparkles
} from 'lucide-react';

const iconMap = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'trophy': Trophy,
};

export const metadata = {
  title: 'La Masia Academy — Bimbingan Belajar Terpercaya',
  description: 'La Masia Academy adalah lembaga bimbingan belajar terpercaya. Program untuk Sekolah Dasar, Sekolah Menengah Pertama, dan Reguler SMA dengan tutor berpengalaman.',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-slider">
            <div className="hero-slide"></div>
            <div className="hero-slide"></div>
            <div className="hero-slide"></div>
            <div className="hero-slide"></div>
          </div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={14} />
                Pendaftaran Dibuka — Kuota Terbatas
              </div>
              <h1>
                Raih Prestasi Terbaikmu Bersama{' '}
                <span className="accent">La Masia</span> Academy
              </h1>
              <p>
                Bimbingan belajar premium dengan pendekatan personal, tutor berpengalaman, 
                dan metode pembelajaran yang teruji untuk membantu kamu mencapai target akademik.
              </p>
              <div className="hero-actions">
                <Link href="/register" className="btn btn-primary btn-lg">
                  Daftar Sekarang <ArrowRight size={18} />
                </Link>
                <Link href="/programs" className="btn btn-secondary btn-lg">
                  Lihat Program
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Mengapa La Masia Academy?</h2>
              <p>
                Kami berkomitmen memberikan pengalaman belajar terbaik dengan berbagai keunggulan
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card card">
                <div className="feature-icon">
                  <Users size={24} />
                </div>
                <h3>Tutor Berpengalaman</h3>
                <p>Tutor pilihan dengan pengalaman mengajar lebih dari 5 tahun dan track record meluluskan siswa ke PTN favorit.</p>
              </div>
              <div className="feature-card card">
                <div className="feature-icon">
                  <Target size={24} />
                </div>
                <h3>Pendekatan Personal</h3>
                <p>Setiap siswa mendapat jadwal, materi, dan feedback yang disesuaikan dengan kebutuhan dan progress belajarnya.</p>
              </div>
              <div className="feature-card card">
                <div className="feature-icon">
                  <Brain size={24} />
                </div>
                <h3>Metode Teruji</h3>
                <p>Kurikulum terstruktur dengan tryout berkala, analisis skor, dan strategi pengerjaan soal yang efektif.</p>
              </div>
              <div className="feature-card card">
                <div className="feature-icon">
                  <Shield size={24} />
                </div>
                <h3>Platform Digital</h3>
                <p>Akses materi belajar, jadwal, dan feedback kapan saja melalui portal siswa yang modern dan mudah digunakan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <h2>Program Unggulan Kami</h2>
              <p>Pilih program yang sesuai dengan kebutuhan dan target belajar kamu</p>
            </div>
            <div className="programs-grid">
              {programs.map((program) => {
                const Icon = iconMap[program.icon] || BookOpen;
                return (
                  <Link href={`/programs/${program.id}`} key={program.id} style={{ textDecoration: 'none' }}>
                    <div className="program-card">
                      <div className="program-card-image">
                        <div className="icon-placeholder">
                          <Icon size={32} />
                        </div>
                      </div>
                      <div className="program-card-body">
                        <h3>{program.name}</h3>
                        <p>{program.description}</p>
                        <div className="program-card-meta">
                          <span><Clock size={14} /> {program.duration}</span>
                          <span className="program-card-price">{formatCurrency(program.price)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Schedule Overview */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Jadwal Kelas</h2>
              <p>Pilih waktu belajar yang sesuai dengan jadwal aktivitasmu</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {programs.map((program) => {
                const Icon = iconMap[program.icon] || BookOpen;
                return (
                  <div className="card" key={program.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                      background: 'rgba(139,115,85,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary)', flexShrink: 0
                    }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 2 }}>{program.name}</h4>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', margin: 0 }}>
                        <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                        {program.schedule}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <h2>Apa Kata Mereka?</h2>
              <p>Testimoni dari siswa dan orang tua yang telah merasakan dampak belajar di La Masia Academy</p>
            </div>
            <div className="testimonials-marquee-container">
              <div className="testimonials-marquee-track">
                {/* SET 1 */}
                <div className="testimonial-card">
                  <p className="quote">
                    &ldquo;Berkat La Masia Academy, saya berhasil diterima di Teknik Informatika UI melalui SNBT. 
                    Tryout mingguannya sangat membantu mengukur kesiapan saya.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">RA</div>
                    <div>
                      <div className="testimonial-name">Lapet</div>
                      <div className="testimonial-role">Alumni Intensif UTBK 2025</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p className="quote">
                    &ldquo;Anak saya yang awalnya kesulitan di Matematika, sekarang masuk peringkat 5 besar di kelasnya. 
                    Pengajarnya sabar dan metodenya sangat efektif.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">NS</div>
                    <div>
                      <div className="testimonial-name">Muhammad Djoko Susilo</div>
                      <div className="testimonial-role">Orang Tua Siswa Reguler</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p className="quote">
                    &ldquo;Bimbingan olimpiadenya luar biasa! Saya mendapat medali perak di OSN Fisika tingkat provinsi.
                    Tutornya benar-benar expert di bidangnya.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">DP</div>
                    <div>
                      <div className="testimonial-name">Aby Hakim</div>
                      <div className="testimonial-role">Siswa Privat Olimpiade</div>
                    </div>
                  </div>
                </div>

                {/* SET 2 (DUPLICATE) */}
                <div className="testimonial-card">
                  <p className="quote">
                    &ldquo;Berkat La Masia Academy, saya berhasil diterima di Teknik Informatika UI melalui SNBT. 
                    Tryout mingguannya sangat membantu mengukur kesiapan saya.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">RA</div>
                    <div>
                      <div className="testimonial-name">Rafi Aqil</div>
                      <div className="testimonial-role">Alumni Intensif UTBK 2025</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p className="quote">
                    &ldquo;Anak saya yang awalnya kesulitan di Matematika, sekarang masuk peringkat 5 besar di kelasnya. 
                    Pengajarnya sabar dan metodenya sangat efektif.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">NS</div>
                    <div>
                      <div className="testimonial-name">Ibu Nita Sari</div>
                      <div className="testimonial-role">Orang Tua Siswa Reguler</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p className="quote">
                    &ldquo;Bimbingan olimpiadenya luar biasa! Saya mendapat medali perak di OSN Fisika tingkat provinsi.
                    Tutornya benar-benar expert di bidangnya.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">DP</div>
                    <div>
                      <div className="testimonial-name">Dian Permata</div>
                      <div className="testimonial-role">Siswa Privat Olimpiade</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Lokasi Kami</h2>
              <p>Kunjungi La Masia Academy dan lihat langsung fasilitas kami</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
              <div>
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.2!2d109.24!3d-7.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjUnMTIuMCJTIDEwOcKwMTQnMjQuMCJF!5e0!3m2!1sid!2sid!4v1"
                    allowFullScreen
                    loading="lazy"
                    title="Lokasi La Masia Academy"
                  />
                </div>
              </div>
              <div>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>La Masia Academy</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <p style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <MapPin size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--primary)' }} />
                    Jl. Pendidikan No. 10, Purwokerto, Jawa Tengah 53112
                  </p>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--neutral-500)' }}>
                    Buka setiap hari Senin — Sabtu, pukul 08:00 — 20:00 WIB.
                    Tersedia area parkir luas dan ruang tunggu nyaman untuk orang tua.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container">
            <div className="cta-banner">
              <h2>Siap Memulai Perjalanan Suksesmu?</h2>
              <p>
                Bergabung bersama ratusan siswa lainnya yang telah merasakan manfaat belajar di La Masia Academy. 
                Kuota terbatas — daftar sekarang!
              </p>
              <Link href="/register" className="btn btn-lg">
                Daftar Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
