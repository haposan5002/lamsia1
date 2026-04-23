import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import ScrollytellingLayout from '@/components/ScrollytellingLayout';
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
        {/* Scrollytelling Hero & Features */}
        <ScrollytellingLayout />

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
                  <Link href={`/programs/${program.id}`} key={program.id} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                    <div className="program-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div className="program-card-image">
                        <div className="icon-placeholder">
                          <Icon size={32} />
                        </div>
                      </div>
                      <div className="program-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3>{program.name}</h3>
                        <p style={{ flex: 1 }}>{program.description}</p>
                        <div className="program-card-meta" style={{ marginTop: 'auto' }}>
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
