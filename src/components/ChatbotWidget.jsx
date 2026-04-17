'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const botResponses = [
  { keywords: ['program', 'kursus', 'bimbel'], response: 'Kami memiliki 3 program unggulan: Intensif UTBK SNBT 2026, Reguler SMA Kelas 10-12, dan Privat Olimpiade Sains. Masing-masing dirancang untuk kebutuhan belajar yang berbeda. Ingin tahu lebih detail tentang program tertentu?' },
  { keywords: ['harga', 'biaya', 'bayar', 'tarif'], response: 'Biaya program kami mulai dari Rp 1.500.000 untuk Reguler SMA, Rp 2.500.000 untuk Intensif UTBK, dan Rp 4.000.000 untuk Privat Olimpiade. Pembayaran bisa melalui transfer bank, e-wallet, atau QRIS.' },
  { keywords: ['jadwal', 'waktu', 'kapan'], response: 'Jadwal kelas bervariasi per program. Intensif UTBK: Senin-Jumat 16:00-18:00. Reguler SMA: Senin-Kamis 15:00-17:00. Privat Olimpiade: jadwal fleksibel 2x seminggu. Jadwal personal akan diatur setelah pendaftaran disetujui.' },
  { keywords: ['daftar', 'registrasi', 'pendaftaran'], response: 'Untuk mendaftar, silakan klik menu "Pendaftaran" di website kami. Isi formulir lengkap, pilih program, dan upload bukti pembayaran. Setelah itu, tim kami akan memverifikasi pendaftaran Anda dalam 1-2 hari kerja.' },
  { keywords: ['lokasi', 'alamat', 'dimana'], response: 'La Masia Academy berlokasi di Jl. Pendidikan No. 10, Purwokerto. Anda bisa melihat peta lokasi kami di halaman utama website. Kami juga mudah dijangkau dengan transportasi umum.' },
  { keywords: ['utbk', 'snbt', 'ujian'], response: 'Program Intensif UTBK SNBT kami dirancang khusus untuk persiapan ujian masuk perguruan tinggi. Mencakup TPS dan TKA lengkap, tryout mingguan, dan bimbingan personal. Sudah banyak alumni kami diterima di PTN favorit!' },
  { keywords: ['olimpiade', 'kompetisi'], response: 'Program Privat Olimpiade kami dibimbing langsung oleh tutor peraih medali. Kurikulum khusus kompetisi dengan latihan soal tingkat lanjut dan simulasi olimpiade. Cocok untuk persiapan OSN dan kompetisi internasional.' },
  { keywords: ['halo', 'hai', 'hello', 'hi'], response: 'Halo! 👋 Selamat datang di La Masia Academy. Saya asisten virtual yang siap membantu Anda. Ada yang ingin ditanyakan seputar program, jadwal, atau pendaftaran?' },
];

const defaultResponse = 'Terima kasih atas pertanyaannya! Untuk informasi lebih detail, Anda bisa menanyakan tentang program kami, jadwal, biaya, atau cara pendaftaran. Atau hubungi kami langsung di (0281) 123-4567. 😊';

function getBotResponse(message) {
  const lower = message.toLowerCase();
  for (const item of botResponses) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.response;
    }
  }
  return defaultResponse;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Halo! 👋 Saya asisten virtual La Masia Academy. Ada yang bisa saya bantu? Tanyakan tentang program, jadwal, biaya, atau pendaftaran.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(userMsg);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {isOpen && (
        <div className="chatbot-panel animate-slideUp">
          <div className="chatbot-header">
            <h4>💬 Asisten La Masia</h4>
            <button onClick={() => setIsOpen(false)} aria-label="Tutup chat">
              <X size={20} />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ketik pertanyaan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend} aria-label="Kirim">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        className="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
