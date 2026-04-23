// ===== WhatsApp Notification Service (Fonnte API) =====
// Dokumentasi Fonnte: https://fonnte.com/api

const FONNTE_API_URL = 'https://api.fonnte.com/send';

/**
 * Kirim pesan WhatsApp via Fonnte API
 * @param {string} phone - Nomor tujuan (format: 08xxx atau 628xxx)
 * @param {string} message - Isi pesan
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function sendWhatsAppMessage(phone, message) {
  const token = process.env.FONNTE_API_TOKEN;

  if (!token) {
    console.error('[WhatsApp] FONNTE_API_TOKEN belum di-set pada environment variables.');
    return { success: false, error: 'API token tidak tersedia' };
  }

  // Konversi format nomor 08xxx → 628xxx
  const formattedPhone = phone.startsWith('0')
    ? '62' + phone.slice(1)
    : phone;

  try {
    const response = await fetch(FONNTE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: new URLSearchParams({
        target: formattedPhone,
        message: message,
        countryCode: '62',
      }),
    });

    const data = await response.json();
    console.log(`[WhatsApp] Pesan terkirim ke ${formattedPhone}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`[WhatsApp] Gagal mengirim ke ${formattedPhone}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Buat template pesan pengingat kelas
 * @param {Object} params
 * @param {string} params.studentName - Nama siswa
 * @param {string} params.subject - Mata pelajaran
 * @param {string} params.startTime - Jam mulai (format: "16:00")
 * @param {string} params.endTime - Jam selesai (format: "18:00")
 * @param {string} params.dayOfWeek - Hari (format: "Senin")
 * @param {string} params.liveClassUrl - Link meet/zoom
 * @returns {string} Pesan terformat
 */
export function buildReminderMessage({ studentName, subject, startTime, endTime, dayOfWeek, liveClassUrl }) {
  return `📚 *Pengingat Kelas La Masia Academy*

Halo *${studentName}* 👋

Kelas kamu akan dimulai *1 jam lagi*! Berikut detailnya:

📖  *Mata Pelajaran:* ${subject}
📅  *Hari:* ${dayOfWeek}
⏰  *Waktu:* ${startTime} - ${endTime} WIB

🔗  *Link Kelas Online:*
${liveClassUrl}

Pastikan koneksi internet stabil dan bergabung tepat waktu ya! 💪

Semangat belajar! 🎓
_La Masia Academy_`;
}

/**
 * Mendapatkan nama hari dalam Bahasa Indonesia dari objek Date
 * @param {Date} date
 * @returns {string}
 */
export function getIndonesianDayName(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
}

/**
 * Bandingkan waktu dalam format "HH:MM" dengan kondisi H-1 jam
 * @param {string} scheduleTime - Waktu jadwal mulai, format "HH:MM"
 * @param {Date} now - Waktu sekarang
 * @returns {boolean} True jika sekarang + 1 jam == waktu jadwal
 */
export function isOneHourBefore(scheduleTime, now) {
  const [schedHour, schedMin] = scheduleTime.split(':').map(Number);
  
  // Waktu 1 jam dari sekarang
  const targetTime = new Date(now);
  targetTime.setHours(targetTime.getHours() + 1);
  
  const targetHour = targetTime.getHours();
  const targetMin = targetTime.getMinutes();

  // Cocokkan jam, toleransi menit ±5 menit (window)
  return schedHour === targetHour && Math.abs(schedMin - targetMin) <= 5;
}

/**
 * Buat unique key untuk log notifikasi (mencegah duplikat pada hari yang sama)
 * @param {number} scheduleId
 * @param {Date} date
 * @returns {string}
 */
export function makeNotificationKey(scheduleId, date) {
  const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
  return `${scheduleId}_${dateStr}`;
}
