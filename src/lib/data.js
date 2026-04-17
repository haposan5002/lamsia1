// ===== LA MASIA ACADEMY — Mock Data =====

export const programs = [
  {
    id: 1,
    name: "Intensif UTBK SNBT 2026",
    description: "Program persiapan intensif UTBK-SNBT dengan pembahasan soal lengkap, tryout berkala, dan bimbingan personal dari tutor berpengalaman. Cocok untuk siswa kelas 12 dan alumni.",
    price: 2500000,
    duration: "Paket 20 Sesi",
    schedule: "Senin - Jumat, 16:00 - 18:00 WIB",
    features: [
      "Modul lengkap TPS & TKA",
      "Tryout mingguan dengan analisis skor",
      "Bimbingan personal 1-on-1",
      "Grup diskusi eksklusif",
      "Akses materi digital 24/7"
    ],
    icon: "graduation-cap"
  },
  {
    id: 2,
    name: "Reguler SMA Kelas 10-12",
    description: "Program bimbingan belajar reguler untuk siswa SMA yang ingin meningkatkan pemahaman materi sekolah dan mempersiapkan ujian semester dengan lebih percaya diri.",
    price: 1500000,
    duration: "Paket 30 Sesi",
    schedule: "Senin - Kamis, 15:00 - 17:00 WIB",
    features: [
      "Semua mata pelajaran utama",
      "Latihan soal per bab",
      "Persiapan UTS & UAS",
      "Laporan progress bulanan",
      "Konsultasi tugas sekolah"
    ],
    icon: "book-open"
  },
  {
    id: 3,
    name: "Privat Olimpiade Sains",
    description: "Program privat intensif bagi siswa yang ingin mempersiapkan diri untuk kompetisi olimpiade sains tingkat nasional maupun internasional. Bimbingan langsung dari peraih medali.",
    price: 4000000,
    duration: "Paket 16 Sesi",
    schedule: "Jadwal fleksibel (2x seminggu)",
    features: [
      "Tutor peraih medali olimpiade",
      "Kurikulum khusus kompetisi",
      "Latihan soal tingkat lanjut",
      "Simulasi olimpiade",
      "Konsultasi strategi kompetisi"
    ],
    icon: "trophy"
  }
];

export const registrations = [
  {
    id: 1,
    fullName: "Ahmad Fauzi Ramadhan",
    email: "ahmad.fauzi@email.com",
    phone: "08123456789",
    programId: 1,
    paymentProofUrl: "/uploads/bukti-1.jpg",
    status: "pending",
    createdAt: "2026-04-14T10:30:00Z"
  },
  {
    id: 2,
    fullName: "Siti Nurhaliza",
    email: "siti.nur@email.com",
    phone: "08234567890",
    programId: 2,
    paymentProofUrl: "/uploads/bukti-2.jpg",
    status: "pending",
    createdAt: "2026-04-13T14:15:00Z"
  },
  {
    id: 3,
    fullName: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "08345678901",
    programId: 1,
    paymentProofUrl: "/uploads/bukti-3.jpg",
    status: "approved",
    createdAt: "2026-04-10T09:00:00Z"
  },
  {
    id: 4,
    fullName: "Dewi Putri Andini",
    email: "dewi.putri@email.com",
    phone: "08456789012",
    programId: 3,
    paymentProofUrl: "/uploads/bukti-4.jpg",
    status: "approved",
    createdAt: "2026-04-08T11:45:00Z"
  },
  {
    id: 5,
    fullName: "Rizky Pratama",
    email: "rizky.p@email.com",
    phone: "08567890123",
    programId: 2,
    paymentProofUrl: "/uploads/bukti-5.jpg",
    status: "rejected",
    createdAt: "2026-04-07T16:20:00Z"
  }
];

export const students = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@student.lamasia.id",
    programId: 1,
    programName: "Intensif UTBK SNBT 2026",
    joinedAt: "2026-04-10",
    remainingSessions: 3,
    totalSessions: 20
  },
  {
    id: 2,
    name: "Dewi Putri Andini",
    email: "dewi@student.lamasia.id",
    programId: 3,
    programName: "Privat Olimpiade Sains",
    joinedAt: "2026-04-08",
    remainingSessions: 10,
    totalSessions: 16
  },
  {
    id: 3,
    name: "Rina Kartika",
    email: "rina@student.lamasia.id",
    programId: 2,
    programName: "Reguler SMA Kelas 10-12",
    joinedAt: "2026-03-15",
    remainingSessions: 0,
    totalSessions: 30
  }
];

export const materials = [
  {
    id: 1,
    programId: 1,
    title: "Modul TPS - Penalaran Umum",
    fileUrl: "/materials/tps-penalaran.pdf",
    type: "document",
    isLocked: false,
    unlockAt: null
  },
  {
    id: 2,
    programId: 1,
    title: "Video: Strategi Mengerjakan TPS",
    fileUrl: "/materials/strategi-tps.mp4",
    type: "video",
    isLocked: false,
    unlockAt: null
  },
  {
    id: 3,
    programId: 1,
    title: "Tryout UTBK Sesi 1",
    fileUrl: "/materials/tryout-1.pdf",
    type: "quiz",
    isLocked: true,
    unlockAt: "2026-04-20T00:00:00Z"
  },
  {
    id: 4,
    programId: 1,
    title: "Modul TKA - Matematika Dasar",
    fileUrl: "/materials/tka-math.pdf",
    type: "document",
    isLocked: true,
    unlockAt: "2026-04-25T00:00:00Z"
  },
  {
    id: 5,
    programId: 2,
    title: "Rangkuman Matematika Kelas 11",
    fileUrl: "/materials/math-11.pdf",
    type: "document",
    isLocked: false,
    unlockAt: null
  },
  {
    id: 6,
    programId: 2,
    title: "Video: Fisika - Hukum Newton",
    fileUrl: "/materials/fisika-newton.mp4",
    type: "video",
    isLocked: false,
    unlockAt: null
  },
  {
    id: 7,
    programId: 3,
    title: "Soal Latihan Olimpiade Fisika",
    fileUrl: "/materials/olimpiade-fisika.pdf",
    type: "quiz",
    isLocked: false,
    unlockAt: null
  },
  {
    id: 8,
    programId: 3,
    title: "Materi Lanjut: Mekanika Kuantum",
    fileUrl: "/materials/quantum.pdf",
    type: "document",
    isLocked: true,
    unlockAt: "2026-05-01T00:00:00Z"
  }
];

export const studentSchedules = [
  { id: 1, studentId: 1, dayOfWeek: "Senin", startTime: "16:00", endTime: "18:00", subject: "TPS - Penalaran Umum", duration: "2 jam", liveClassUrl: "https://zoom.us/j/1234567890" },
  { id: 2, studentId: 1, dayOfWeek: "Selasa", startTime: "16:00", endTime: "18:00", subject: "TPS - Penalaran Matematika", duration: "2 jam", liveClassUrl: "https://zoom.us/j/1234567891" },
  { id: 3, studentId: 1, dayOfWeek: "Rabu", startTime: "16:00", endTime: "18:00", subject: "TKA - Matematika", duration: "2 jam", liveClassUrl: null },
  { id: 4, studentId: 1, dayOfWeek: "Kamis", startTime: "16:00", endTime: "18:00", subject: "TKA - Fisika", duration: "2 jam", liveClassUrl: "https://meet.google.com/abc-defg-hij" },
  { id: 5, studentId: 1, dayOfWeek: "Jumat", startTime: "16:00", endTime: "18:00", subject: "Tryout & Pembahasan", duration: "2 jam", liveClassUrl: null },
  { id: 6, studentId: 2, dayOfWeek: "Selasa", startTime: "14:00", endTime: "16:00", subject: "Fisika Olimpiade", duration: "2 jam", liveClassUrl: "https://zoom.us/j/9876543210" },
  { id: 7, studentId: 2, dayOfWeek: "Kamis", startTime: "14:00", endTime: "16:00", subject: "Matematika Olimpiade", duration: "2 jam", liveClassUrl: null },
  { id: 8, studentId: 3, dayOfWeek: "Senin", startTime: "15:00", endTime: "17:00", subject: "Matematika", duration: "2 jam", liveClassUrl: "https://zoom.us/j/1112223334" },
  { id: 9, studentId: 3, dayOfWeek: "Rabu", startTime: "15:00", endTime: "17:00", subject: "Fisika", duration: "2 jam", liveClassUrl: null },
  { id: 10, studentId: 3, dayOfWeek: "Kamis", startTime: "15:00", endTime: "17:00", subject: "Kimia", duration: "2 jam", liveClassUrl: "https://meet.google.com/xyz-uvwx-yza" }
];

export const feedbacks = [
  {
    id: 1,
    studentId: 1,
    adminId: 1,
    adminName: "Pak Hendra",
    content: "Budi, progress minggu ini sangat bagus! Nilai tryout TPS kamu naik 15 poin. Pertahankan intensitas belajarmu, terutama di bagian penalaran umum ya. Untuk minggu depan, fokus di latihan soal reading comprehension.",
    createdAt: "2026-04-15T08:00:00Z"
  },
  {
    id: 2,
    studentId: 1,
    adminId: 1,
    adminName: "Pak Hendra",
    content: "Modul TKA Matematika sudah aku buka aksesnya. Coba kerjakan latihan soal di halaman 20-30 sebelum kelas hari Rabu. Kalau ada yang bingung, bisa langsung tanya saat sesi bimbingan.",
    createdAt: "2026-04-12T10:30:00Z"
  },
  {
    id: 3,
    studentId: 2,
    adminId: 1,
    adminName: "Pak Hendra",
    content: "Dewi, persiapan olimpiade kamu sudah on track. Untuk soal mekanika, coba review lagi konsep momen inersia. Saya sudah siapkan soal latihan tambahan di materi minggu ini.",
    createdAt: "2026-04-14T09:00:00Z"
  },
  {
    id: 4,
    studentId: 3,
    adminId: 1,
    adminName: "Bu Sarah",
    content: "Rina, nilai UTS Matematika kamu sudah meningkat dibanding semester lalu. Bagus sekali! Untuk kimia, perlu lebih banyak latihan soal stoikiometri. Jangan ragu untuk bertanya jika ada yang kurang dipahami.",
    createdAt: "2026-04-13T14:00:00Z"
  }
];

export const users = [
  {
    id: 0,
    name: "Admin La Masia",
    email: "admin@lamasia.id",
    password: "admin123",
    role: "admin"
  },
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@student.lamasia.id",
    password: "student123",
    role: "student"
  },
  {
    id: 2,
    name: "Dewi Putri Andini",
    email: "dewi@student.lamasia.id",
    password: "student123",
    role: "student"
  },
  {
    id: 3,
    name: "Rina Kartika",
    email: "rina@student.lamasia.id",
    password: "student123",
    role: "student"
  }
];

export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
