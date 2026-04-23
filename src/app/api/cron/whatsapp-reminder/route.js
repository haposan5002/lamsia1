// ===== Cron Endpoint: WhatsApp Class Reminder =====
// Endpoint ini dipanggil secara periodik (setiap 5-10 menit) oleh Vercel Cron / external cron
// untuk mengecek jadwal kelas yang akan dimulai dalam 1 jam dan mengirim reminder via WhatsApp.
//
// Cara setup cron:
//   Vercel: tambahkan di vercel.json → { "crons": [{ "path": "/api/cron/whatsapp-reminder", "schedule": "*/10 * * * *" }] }
//   External: hit GET /api/cron/whatsapp-reminder setiap 10 menit

import { students, studentSchedules, whatsappNotificationLog } from '@/lib/data';
import {
  sendWhatsAppMessage,
  buildReminderMessage,
  getIndonesianDayName,
  isOneHourBefore,
  makeNotificationKey,
} from '@/lib/whatsapp';

export const dynamic = 'force-dynamic'; // Pastikan tidak di-cache

export async function GET(request) {
  // Optional: Validasi cron secret agar endpoint tidak bisa dipanggil sembarang orang
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const todayDayName = getIndonesianDayName(now);

  console.log(`[Cron WhatsApp] Menjalankan pengecekan pada ${now.toISOString()} — Hari: ${todayDayName}`);

  // Filter jadwal yang:
  // 1. Hari ini sesuai (dayOfWeek)
  // 2. Ada link live class (liveClassUrl)
  // 3. WhatsApp reminder aktif (whatsappReminder === true)
  // 4. Waktu mulai kelas = sekarang + 1 jam (toleransi ±5 menit)
  const matchingSchedules = studentSchedules.filter(sch => {
    if (sch.dayOfWeek !== todayDayName) return false;
    if (!sch.liveClassUrl) return false;
    if (!sch.whatsappReminder) return false;
    if (!isOneHourBefore(sch.startTime, now)) return false;

    // Cek apakah notifikasi untuk jadwal ini hari ini sudah pernah dikirim
    const key = makeNotificationKey(sch.id, now);
    if (whatsappNotificationLog.includes(key)) {
      console.log(`[Cron WhatsApp] Notifikasi sudah terkirim sebelumnya: ${key}`);
      return false;
    }

    return true;
  });

  if (matchingSchedules.length === 0) {
    console.log('[Cron WhatsApp] Tidak ada jadwal yang cocok saat ini.');
    return Response.json({
      success: true,
      message: 'Tidak ada reminder yang perlu dikirim saat ini.',
      checked_at: now.toISOString(),
      day: todayDayName,
      matched: 0,
    });
  }

  const results = [];

  for (const sch of matchingSchedules) {
    const student = students.find(s => s.id === sch.studentId);
    if (!student || !student.phone) {
      results.push({
        scheduleId: sch.id,
        status: 'skipped',
        reason: 'Siswa atau nomor telepon tidak ditemukan',
      });
      continue;
    }

    const message = buildReminderMessage({
      studentName: student.name,
      subject: sch.subject,
      startTime: sch.startTime,
      endTime: sch.endTime,
      dayOfWeek: sch.dayOfWeek,
      liveClassUrl: sch.liveClassUrl,
    });

    const sendResult = await sendWhatsAppMessage(student.phone, message);

    // Catat log agar tidak kirim ulang hari ini
    const key = makeNotificationKey(sch.id, now);
    whatsappNotificationLog.push(key);

    results.push({
      scheduleId: sch.id,
      studentName: student.name,
      phone: student.phone,
      subject: sch.subject,
      startTime: sch.startTime,
      status: sendResult.success ? 'sent' : 'failed',
      error: sendResult.error || null,
    });
  }

  const sentCount = results.filter(r => r.status === 'sent').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  console.log(`[Cron WhatsApp] Selesai — Terkirim: ${sentCount}, Gagal: ${failedCount}`);

  return Response.json({
    success: true,
    checked_at: now.toISOString(),
    day: todayDayName,
    matched: matchingSchedules.length,
    sent: sentCount,
    failed: failedCount,
    results,
  });
}
