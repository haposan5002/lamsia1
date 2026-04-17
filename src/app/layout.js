import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'La Masia Academy — Bimbingan Belajar Terpercaya',
  description: 'La Masia Academy adalah lembaga bimbingan belajar terpercaya dengan program Intensif UTBK, Reguler SMA, dan Privat Olimpiade. Daftar sekarang untuk masa depan yang lebih cerah!',
  keywords: 'bimbingan belajar, bimbel, UTBK, SNBT, olimpiade, les privat, kursus',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
