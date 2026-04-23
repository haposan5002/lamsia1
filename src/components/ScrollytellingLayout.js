'use client';

import { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import ScrollyVideo from './ScrollyVideo';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ScrollytellingLayout() {
  const containerRef = useRef(null);
  // Track scroll progress within the 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="scrolly-container" style={{ height: '700vh', background: 'var(--cream-50)', position: 'relative' }}>
      {/* Sticky Canvas and Overlays */}
      <div className="scrolly-sticky" style={{ position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', width: '100%', overflow: 'hidden' }}>
        <ScrollyVideo scrollYProgress={scrollYProgress} />

        {/* Floating Text Overlays Container */}
        <div className="scrolly-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>

          {/* Section 1: Hero (Center) */}
          <OverlaySection
            scrollYProgress={scrollYProgress}
            inputRange={[0, 0.1, 0.15]}
            align="center"
          >
            <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: '1rem', background: 'rgba(250, 246, 240, 0.9)', padding: '6px 16px', borderRadius: '9999px', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', fontSize: '0.875rem', fontWeight: 600, border: '1px solid var(--cream-200)' }}>
              <Sparkles size={14} color="var(--gold)" />
              Pendaftaran Dibuka — Kuota Terbatas
            </div>
            <h1 className="scrolly-title" style={{ textAlign: 'center' }}>
              Raih Prestasi<br />Terbaikmu Bersama<br />
              <span style={{ color: 'var(--gold)' }}>La Masia</span> Academy
            </h1>
            <p className="scrolly-subtitle" style={{ fontSize: '1.25rem', color: 'var(--neutral-700)', textAlign: 'center' }}>
              Bimbingan belajar premium dengan pendekatan personal, tutor berpengalaman,
              dan metode pembelajaran yang teruji.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <Link href="/register" className="btn btn-primary btn-lg" style={{ background: 'var(--forest-green)', borderColor: 'var(--forest-green)', fontSize: '1.1rem' }}>
                Daftar Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          </OverlaySection>

          {/* Card 1: Tutor (Kiri) */}
          <OverlaySection
            scrollYProgress={scrollYProgress}
            inputRange={[0.15, 0.25, 0.3]}
            align="left"
          >
            <h2 className="scrolly-title" style={{ fontSize: '3rem' }}>Tutor Berpengalaman</h2>
            <p className="scrolly-subtitle" style={{ fontSize: '1.25rem', color: 'var(--neutral-700)' }}>
              Belajar langsung dari tutor pilihan dengan pengalaman lebih dari 5 tahun.
              Track record terbukti meluluskan siswa ke PTN favorit.
            </p>
          </OverlaySection>

          {/* Card 2: Metode Teruji (Kanan) */}
          <OverlaySection
            scrollYProgress={scrollYProgress}
            inputRange={[0.3, 0.4, 0.45]}
            align="right"
          >
            <h2 className="scrolly-title" style={{ fontSize: '3rem' }}>Metode Teruji</h2>
            <p className="scrolly-subtitle" style={{ fontSize: '1.25rem', color: 'var(--neutral-700)' }}>
              Kurikulum terstruktur dengan tryout berkala, analisis skor mendalam,
              dan strategi pengerjaan soal yang paling efektif.
            </p>
          </OverlaySection>

          {/* Card 3: Pendekatan Personal (Kiri) */}
          <OverlaySection
            scrollYProgress={scrollYProgress}
            inputRange={[0.45, 0.55, 0.6]}
            align="left"
          >
            <h2 className="scrolly-title" style={{ fontSize: '3rem' }}>Pendekatan Personal</h2>
            <p className="scrolly-subtitle" style={{ fontSize: '1.25rem', color: 'var(--neutral-700)' }}>
              Setiap siswa mendapat jadwal, materi, dan pendampingan yang disesuaikan
              dengan kebutuhan serta target belajar spesifik mereka.
            </p>
          </OverlaySection>

          {/* Card 4: Platform Digital (Kanan) */}
          <OverlaySection
            scrollYProgress={scrollYProgress}
            inputRange={[0.6, 0.7, 0.75]}
            align="right"
          >
            <h2 className="scrolly-title" style={{ fontSize: '3rem' }}>Platform Digital Modern</h2>
            <p className="scrolly-subtitle" style={{ fontSize: '1.25rem', color: 'var(--neutral-700)' }}>
              Akses materi belajar, pantau jadwal, dan dapatkan feedback kapan saja
              melalui portal siswa yang interaktif.
            </p>
          </OverlaySection>

          {/* Section 6: Final Brand Ambassador (Center) */}
          <OverlaySection
            scrollYProgress={scrollYProgress}
            inputRange={[0.85, 0.95, 1]}
            align="center"
            noCard={true}
            fadeOut={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image
                src="/images/profile.png"
                alt="Profile"
                width={300}
                height={300}
                style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '50%', marginBottom: '2rem', border: '12px solid var(--cream-100)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              />
              <h2 className="scrolly-title" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>Siap Memulai?</h2>
              <p className="scrolly-subtitle" style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '2rem', maxWidth: '600px' }}>
                Lanjutkan perjalananmu dan eksplorasi program-program unggulan di bawah ini.
              </p>
              <ArrowRight size={40} color="var(--primary)" style={{ transform: 'rotate(90deg)' }} />
            </div>
          </OverlaySection>
        </div>
      </div>

      {/* Debug Info */}
      <div style={{ position: 'fixed', bottom: 10, left: 10, background: 'red', color: 'white', padding: '10px', zIndex: 9999 }}>
        Scroll Progress: <motion.span>{scrollYProgress}</motion.span>
      </div>
    </div>
  );
}

function OverlaySection({ scrollYProgress, inputRange, align, noCard, fadeOut = true, children }) {
  // Use a pure function for useTransform to completely bypass Web Animations API (WAAPI) interpolation bugs.
  const opacity = useTransform(scrollYProgress, (pos) => {
    if (pos < inputRange[0]) return 0;
    if (pos < inputRange[0] + 0.04) {
      return (pos - inputRange[0]) / 0.04; // Fade in
    }
    if (pos < inputRange[1] || !fadeOut) return 1; // Solid
    if (pos < inputRange[2]) {
      return 1 - (pos - inputRange[1]) / (inputRange[2] - inputRange[1]); // Fade out
    }
    return 0;
  });

  const y = useTransform(scrollYProgress, (pos) => {
    if (pos < inputRange[0]) return 40;
    if (pos < inputRange[0] + 0.04) {
      return 40 - 40 * ((pos - inputRange[0]) / 0.04); // Move up from 40 to 0
    }
    if (pos < inputRange[1] || !fadeOut) return 0;
    if (pos < inputRange[2]) {
      return -40 * ((pos - inputRange[1]) / (inputRange[2] - inputRange[1])); // Move up from 0 to -40
    }
    return -40;
  });

  const alignClass = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
  const innerPointerEvents = useTransform(opacity, o => o > 0 ? 'auto' : 'none');

  return (
    <motion.div
      style={{
        opacity,
        y,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: alignClass,
        padding: '0 8%', // Ensure cards never touch the edges
        pointerEvents: 'none'
      }}
    >
      <motion.div
        style={noCard ? {
          pointerEvents: innerPointerEvents,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        } : {
          background: 'rgba(250, 246, 240, 0.85)',
          backdropFilter: 'blur(16px)',
          padding: '3rem',
          borderRadius: '1.5rem',
          maxWidth: '600px',
          pointerEvents: innerPointerEvents,
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.6)'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
