import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'La Masia Academy — Bimbingan Belajar Terpercaya',
  description: 'La Masia Academy adalah lembaga bimbingan belajar terpercaya dengan program Intensif UTBK, Reguler SMA, dan Privat Olimpiade. Daftar sekarang untuk masa depan yang lebih cerah!',
  keywords: 'bimbingan belajar, bimbel, UTBK, SNBT, olimpiade, les privat, kursus',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${outfit.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
