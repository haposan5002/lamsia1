import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>
              <GraduationCap size={22} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              La Masia Academy
            </h3>
            <p>
              Lembaga bimbingan belajar terpercaya yang berkomitmen membentuk generasi unggul 
              melalui pendidikan berkualitas dan pendekatan personal.
            </p>
          </div>

          <div className="footer-col">
            <h4>Menu</h4>
            <ul>
              <li><Link href="/">Beranda</Link></li>
              <li><Link href="/programs">Program</Link></li>
              <li><Link href="/register">Pendaftaran</Link></li>
              <li><Link href="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Program</h4>
            <ul>
              <li><Link href="/programs/1">Intensif UTBK</Link></li>
              <li><Link href="/programs/2">Reguler SMA</Link></li>
              <li><Link href="/programs/3">Privat Olimpiade</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kontak</h4>
            <ul>
              <li>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--neutral-400)' }}>
                  <MapPin size={14} /> Jl. Pendidikan No. 10, Purwokerto
                </span>
              </li>
              <li>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--neutral-400)' }}>
                  <Phone size={14} /> (0281) 123-4567
                </span>
              </li>
              <li>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--neutral-400)' }}>
                  <Mail size={14} /> info@lamasia.id
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} La Masia Academy. All rights reserved.</span>
          <span>Crafted with dedication for education</span>
        </div>
      </div>
    </footer>
  );
}
