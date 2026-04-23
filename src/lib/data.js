// ===== BIMBINGAN BELAJAR — Mock Data =====

export const programs = [
  {
    id: 1,
    name: "Bimbingan Belajar SD",
    jenjang: "SD",
    kelasTersedia: [4, 5, 6],
    description: "Program bimbingan belajar untuk siswa Sekolah Dasar kelas 1–6. Fokus pada penguatan dasar Matematika, Bahasa Indonesia, IPA, dan IPS dengan metode yang menyenangkan dan mudah dipahami.",
    price: 800000,
    singlePackPrice: 75000,
    duration: "Paket 20 Sesi",
    singlePackDuration: "1 Sesi (1 Jam 30 Menit)",
    totalSessions: 20,
    schedule: "Senin, Rabu, Jumat, 14:00 - 15:30 WIB",
    features: [
      "Matematika, Bahasa Indonesia, IPA, IPS",
      "Metode belajar interaktif & menyenangkan",
      "Latihan soal per bab",
      "Persiapan UTS & UAS",
      "Laporan progress bulanan"
    ],
    singlePackFeatures: [
      "1 Sesi bimbingan (1 jam 30 menit)",
      "Pilih mata pelajaran",
      "Materi per sesi"
    ],
    icon: "book-open"
  },
  {
    id: 2,
    name: "Bimbingan Belajar SMP",
    jenjang: "SMP",
    kelasTersedia: [1, 2, 3],
    description: "Program bimbingan belajar untuk siswa SMP kelas 7–9. Mencakup semua mata pelajaran inti dengan penekanan pada pemahaman konsep dan persiapan ujian sekolah serta ujian nasional.",
    price: 1200000,
    singlePackPrice: 100000,
    duration: "Paket 24 Sesi",
    singlePackDuration: "1 Sesi (1 Jam 30 Menit)",
    totalSessions: 24,
    schedule: "Senin - Kamis, 15:00 - 17:00 WIB",
    features: [
      "Matematika, IPA, IPS, Bahasa Indonesia & Inggris",
      "Latihan soal per bab & tryout",
      "Persiapan UTS, UAS & Ujian Sekolah",
      "Bimbingan personal 1-on-1",
      "Laporan progress bulanan"
    ],
    singlePackFeatures: [
      "1 Sesi bimbingan (1 jam 30 menit)",
      "Pilih mata pelajaran",
      "Materi per sesi"
    ],
    icon: "graduation-cap"
  },
  {
    id: 3,
    name: "Bimbingan Belajar SMA",
    jenjang: "SMA",
    kelasTersedia: [1, 2, 3],
    description: "Program bimbingan belajar komprehensif untuk siswa SMA kelas 10–12. Mempersiapkan siswa menghadapi ujian sekolah, UTBK, dan seleksi masuk perguruan tinggi favorit.",
    price: 1800000,
    singlePackPrice: 150000,
    duration: "Paket 30 Sesi",
    singlePackDuration: "1 Sesi (1 Jam 30 Menit)",
    totalSessions: 30,
    schedule: "Senin - Jumat, 16:00 - 18:00 WIB",
    features: [
      "Semua mata pelajaran utama SMA",
      "Tryout UTBK & persiapan SNBT",
      "Bimbingan personal 1-on-1",
      "Latihan soal UN & persiapan UAS",
      "Akses materi digital 24/7"
    ],
    singlePackFeatures: [
      "1 Sesi bimbingan (1 jam 30 menit)",
      "Pilih mata pelajaran",
      "Materi per sesi"
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
    jenjang: "SD",
    kelas: 5,
    programId: 1,
    paymentProofUrl: "/uploads/bukti-1.jpg",
    status: "pending",
    pretestScore: 75,
    pretestStatus: "selesai",
    pretestDetail: { jumlahBenar: 15, jumlahSoal: 20, waktuSelesai: "2026-04-14T11:00:00Z" },
    createdAt: "2026-04-14T10:30:00Z"
  },
  {
    id: 2,
    fullName: "Siti Nurhaliza",
    email: "siti.nur@email.com",
    phone: "08234567890",
    jenjang: "SMP",
    kelas: 2,
    programId: 2,
    paymentProofUrl: "/uploads/bukti-2.jpg",
    status: "pending",
    pretestScore: null,
    pretestStatus: "belum",
    pretestDetail: null,
    createdAt: "2026-04-13T14:15:00Z"
  },
  {
    id: 3,
    fullName: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "08345678901",
    jenjang: "SD",
    kelas: 5,
    programId: 1,
    paymentProofUrl: "/uploads/bukti-3.jpg",
    status: "approved",
    pretestScore: 90,
    pretestStatus: "selesai",
    pretestDetail: { jumlahBenar: 18, jumlahSoal: 20, waktuSelesai: "2026-04-10T10:00:00Z" },
    createdAt: "2026-04-10T09:00:00Z"
  },
  {
    id: 4,
    fullName: "Dewi Putri Andini",
    email: "dewi.putri@email.com",
    phone: "08456789012",
    jenjang: "SMA",
    kelas: 2,
    programId: 3,
    paymentProofUrl: "/uploads/bukti-4.jpg",
    status: "approved",
    pretestScore: 55,
    pretestStatus: "selesai",
    pretestDetail: { jumlahBenar: 11, jumlahSoal: 20, waktuSelesai: "2026-04-08T12:30:00Z" },
    createdAt: "2026-04-08T11:45:00Z"
  },
  {
    id: 5,
    fullName: "Rizky Pratama",
    email: "rizky.p@email.com",
    phone: "08567890123",
    jenjang: "SMP",
    kelas: 3,
    programId: 2,
    paymentProofUrl: "/uploads/bukti-5.jpg",
    status: "rejected",
    pretestScore: 65,
    pretestStatus: "selesai",
    pretestDetail: { jumlahBenar: 13, jumlahSoal: 20, waktuSelesai: "2026-04-07T17:00:00Z" },
    createdAt: "2026-04-07T16:20:00Z"
  }
];

export const students = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@student.lamasia.id",
    phone: "08123456789",
    jenjang: "SD",
    kelas: 5,
    programIds: [1],
    hasCompletedLevelTest: false,
    joinedAt: "2026-04-10",
    remainingSessions: 3,
    totalSessions: 20,
    paketAktifId: 1,
    paketExpiry: "2026-07-10T00:00:00Z"
  },
  {
    id: 2,
    name: "Dewi Putri Andini",
    email: "dewi@student.lamasia.id",
    phone: "08234567890",
    jenjang: "SMA",
    kelas: 2,
    programIds: [3],
    hasCompletedLevelTest: true,
    joinedAt: "2026-04-08",
    remainingSessions: 10,
    totalSessions: 16,
    paketAktifId: 3,
    paketExpiry: "2026-04-28T00:00:00Z"
  },
  {
    id: 3,
    name: "Rina Kartika",
    email: "rina@student.lamasia.id",
    phone: "08345678901",
    jenjang: "SMP",
    kelas: 2,
    programIds: [2],
    hasCompletedLevelTest: true,
    joinedAt: "2026-03-15",
    remainingSessions: 0,
    totalSessions: 30,
    paketAktifId: 2,
    paketExpiry: "2026-06-15T00:00:00Z"
  }
];

export const materials = [
  {
    id: 99,
    programId: 1,
    title: "Test Level: Penilaian Awal SD",
    fileUrl: "/materials/test-level-sd.pdf",
    type: "quiz",
    isLocked: false,
    unlockAt: null,
    isLevelTest: true,
    assignedStudentIds: [1, 2, 3]
  },
  {
    id: 1,
    programId: 1,
    title: "Modul Matematika Dasar SD",
    fileUrl: "/materials/math-dasar-sd.pdf",
    type: "document",
    isLocked: false,
    unlockAt: null,
    assignedStudentIds: [1]
  },
  {
    id: 2,
    programId: 1,
    title: "Video: Belajar Perkalian & Pembagian",
    fileUrl: "/materials/perkalian-sd.mp4",
    type: "video",
    isLocked: false,
    unlockAt: null,
    assignedStudentIds: [1]
  },
  {
    id: 3,
    programId: 1,
    title: "Latihan Soal IPA: Makhluk Hidup",
    fileUrl: "/materials/ipa-sd-1.pdf",
    type: "quiz",
    isLocked: true,
    unlockAt: "2026-04-28T00:00:00Z",
    assignedStudentIds: [1]
  },
  {
    id: 4,
    programId: 2,
    title: "Modul Matematika SMP: Aljabar",
    fileUrl: "/materials/aljabar-smp.pdf",
    type: "document",
    isLocked: false,
    unlockAt: null,
    assignedStudentIds: [1]
  },
  {
    id: 5,
    programId: 2,
    title: "Rangkuman IPA SMP: Sistem Pencernaan",
    fileUrl: "/materials/ipa-smp-1.pdf",
    type: "document",
    isLocked: false,
    unlockAt: null,
    assignedStudentIds: [3]
  },
  {
    id: 6,
    programId: 2,
    title: "Video: Bahasa Inggris - Tenses Dasar",
    fileUrl: "/materials/english-tenses.mp4",
    type: "video",
    isLocked: true,
    unlockAt: "2026-05-02T00:00:00Z",
    assignedStudentIds: [3]
  },
  {
    id: 7,
    programId: 3,
    title: "Modul Matematika SMA: Trigonometri",
    fileUrl: "/materials/trigonometri-sma.pdf",
    type: "document",
    isLocked: false,
    unlockAt: null,
    assignedStudentIds: [2]
  },
  {
    id: 8,
    programId: 3,
    title: "Video: Fisika SMA - Hukum Newton",
    fileUrl: "/materials/fisika-newton-sma.mp4",
    type: "video",
    isLocked: false,
    unlockAt: null,
    assignedStudentIds: [2]
  },
  {
    id: 9,
    programId: 3,
    title: "Tryout Persiapan UTBK Sesi 1",
    fileUrl: "/materials/tryout-sma-1.pdf",
    type: "quiz",
    isLocked: true,
    unlockAt: "2026-05-05T00:00:00Z",
    assignedStudentIds: [2]
  }
];

// ===== BANK SOAL =====
export const questionBanks = [
  {
    id: 1,
    programId: 1,
    name: "Bank Soal SD",
    jenjang: "SD",
    questions: [
      { id: 101, jenjang: "SD", kelas: 5, mataPelajaran: "Matematika", text: "Hasil dari 25 × 4 adalah ...", options: ["80", "90", "100", "110"], correctIndex: 2 },
      { id: 102, jenjang: "SD", kelas: 5, mataPelajaran: "IPA", text: "Planet terbesar dalam Tata Surya adalah ...", options: ["Mars", "Jupiter", "Saturnus", "Bumi"], correctIndex: 1 },
      { id: 103, jenjang: "SD", kelas: 4, mataPelajaran: "IPS", text: "Ibu kota Provinsi Jawa Barat adalah ...", options: ["Semarang", "Bandung", "Surabaya", "Jakarta"], correctIndex: 1 },
      { id: 104, jenjang: "SD", kelas: 5, mataPelajaran: "IPA", text: "Satuan SI untuk panjang adalah ...", options: ["Kilogram", "Liter", "Meter", "Detik"], correctIndex: 2 },
      { id: 105, jenjang: "SD", kelas: 4, mataPelajaran: "IPA", text: "Hewan berikut yang termasuk mamalia adalah ...", options: ["Buaya", "Lumba-lumba", "Ular", "Katak"], correctIndex: 1 },
      { id: 106, jenjang: "SD", kelas: 4, mataPelajaran: "Matematika", text: "Hasil dari 144 ÷ 12 adalah ...", options: ["10", "11", "12", "13"], correctIndex: 2 },
      { id: 107, jenjang: "SD", kelas: 5, mataPelajaran: "IPA", text: "Organ tubuh yang berfungsi memompa darah adalah ...", options: ["Paru-paru", "Hati", "Jantung", "Ginjal"], correctIndex: 2 },
      { id: 108, jenjang: "SD", kelas: 6, mataPelajaran: "Bahasa Indonesia", text: "Sinonim dari kata 'pandai' adalah ...", options: ["Bodoh", "Cerdas", "Malas", "Lambat"], correctIndex: 1 },
      { id: 109, jenjang: "SD", kelas: 5, mataPelajaran: "IPA", text: "Air mendidih pada suhu ...", options: ["50°C", "75°C", "100°C", "120°C"], correctIndex: 2 },
      { id: 110, jenjang: "SD", kelas: 4, mataPelajaran: "IPS", text: "Hari kemerdekaan Indonesia jatuh pada tanggal ...", options: ["17 Agustus", "1 Juni", "20 Mei", "28 Oktober"], correctIndex: 0 },
      { id: 111, jenjang: "SD", kelas: 6, mataPelajaran: "Matematika", text: "Bentuk pecahan dari 0,75 adalah ...", options: ["1/2", "3/4", "2/3", "1/4"], correctIndex: 1 },
      { id: 112, jenjang: "SD", kelas: 5, mataPelajaran: "IPA", text: "Tumbuhan membuat makanan melalui proses ...", options: ["Respirasi", "Fotosintesis", "Fermentasi", "Osmosis"], correctIndex: 1 },
      { id: 113, jenjang: "SD", kelas: 6, mataPelajaran: "IPA", text: "Lambang unsur Oksigen adalah ...", options: ["Ox", "Os", "O", "Ok"], correctIndex: 2 },
      { id: 114, jenjang: "SD", kelas: 4, mataPelajaran: "IPS", text: "Sungai terpanjang di Pulau Kalimantan adalah ...", options: ["Sungai Musi", "Sungai Kapuas", "Sungai Brantas", "Sungai Citarum"], correctIndex: 1 },
      { id: 115, jenjang: "SD", kelas: 6, mataPelajaran: "Matematika", text: "Hasil dari 3² + 4² adalah ...", options: ["7", "12", "25", "49"], correctIndex: 2 },
      { id: 116, jenjang: "SD", kelas: 5, mataPelajaran: "IPA", text: "Energi yang dihasilkan matahari termasuk energi ...", options: ["Kimia", "Nuklir", "Cahaya & Panas", "Bunyi"], correctIndex: 2 },
      { id: 117, jenjang: "SD", kelas: 6, mataPelajaran: "Bahasa Indonesia", text: "Kata baku dari 'nasehat' adalah ...", options: ["Nasehat", "Nasihat", "Nasiahat", "Naseehat"], correctIndex: 1 },
      { id: 118, jenjang: "SD", kelas: 5, mataPelajaran: "Matematika", text: "Keliling persegi dengan sisi 8 cm adalah ...", options: ["16 cm", "24 cm", "32 cm", "64 cm"], correctIndex: 2 },
      { id: 119, jenjang: "SD", kelas: 4, mataPelajaran: "IPS", text: "Indonesia terletak di benua ...", options: ["Eropa", "Asia", "Afrika", "Australia"], correctIndex: 1 },
      { id: 120, jenjang: "SD", kelas: 6, mataPelajaran: "Matematika", text: "KPK dari 4 dan 6 adalah ...", options: ["6", "8", "12", "24"], correctIndex: 2 },
      { id: 121, jenjang: "SD", kelas: 5, mataPelajaran: "IPA", text: "Benda berikut yang merupakan konduktor adalah ...", options: ["Kayu", "Plastik", "Besi", "Karet"], correctIndex: 2 },
      { id: 122, jenjang: "SD", kelas: 6, mataPelajaran: "Matematika", text: "Luas segitiga dengan alas 10 cm dan tinggi 6 cm adalah ...", options: ["30 cm²", "60 cm²", "16 cm²", "20 cm²"], correctIndex: 0 },
    ]
  },
  {
    id: 2,
    programId: 2,
    name: "Bank Soal SMP",
    jenjang: "SMP",
    questions: [
      { id: 201, jenjang: "SMP", kelas: 2, mataPelajaran: "Matematika", text: "Nilai dari √169 adalah ...", options: ["11", "12", "13", "14"], correctIndex: 2 },
      { id: 202, jenjang: "SMP", kelas: 2, mataPelajaran: "Matematika", text: "Rumus luas lingkaran adalah ...", options: ["2πr", "πr²", "πd", "2πr²"], correctIndex: 1 },
      { id: 203, jenjang: "SMP", kelas: 1, mataPelajaran: "IPA", text: "Sel darah putih berfungsi untuk ...", options: ["Mengedarkan oksigen", "Melawan kuman", "Membekukan darah", "Mengangkut sari makanan"], correctIndex: 1 },
      { id: 204, jenjang: "SMP", kelas: 1, mataPelajaran: "Matematika", text: "Hasil dari 2x + 3 = 11, maka x = ...", options: ["3", "4", "5", "6"], correctIndex: 1 },
      { id: 205, jenjang: "SMP", kelas: 2, mataPelajaran: "IPA", text: "Hukum Newton I disebut juga hukum ...", options: ["Aksi-reaksi", "Kelembaman", "Gravitasi", "Percepatan"], correctIndex: 1 },
      { id: 206, jenjang: "SMP", kelas: 3, mataPelajaran: "IPA", text: "Unsur kimia dengan lambang 'Fe' adalah ...", options: ["Fluor", "Besi", "Fosfor", "Fermium"], correctIndex: 1 },
      { id: 207, jenjang: "SMP", kelas: 1, mataPelajaran: "Bahasa Indonesia", text: "Antonim dari kata 'sementara' adalah ...", options: ["Permanen", "Sesaat", "Singkat", "Cepat"], correctIndex: 0 },
      { id: 208, jenjang: "SMP", kelas: 1, mataPelajaran: "IPA", text: "Organ pernapasan utama manusia adalah ...", options: ["Jantung", "Paru-paru", "Lambung", "Usus"], correctIndex: 1 },
      { id: 209, jenjang: "SMP", kelas: 3, mataPelajaran: "Matematika", text: "Gradien garis yang melalui titik (1,2) dan (3,6) adalah ...", options: ["1", "2", "3", "4"], correctIndex: 1 },
      { id: 210, jenjang: "SMP", kelas: 3, mataPelajaran: "IPA", text: "Persamaan reaksi: 2H₂ + O₂ → ...", options: ["H₂O", "2H₂O", "H₂O₂", "2HO"], correctIndex: 1 },
      { id: 211, jenjang: "SMP", kelas: 2, mataPelajaran: "Bahasa Indonesia", text: "Jenis kata 'sangat' dalam kalimat 'Dia sangat pintar' adalah ...", options: ["Kata sifat", "Kata keterangan", "Kata kerja", "Kata benda"], correctIndex: 1 },
      { id: 212, jenjang: "SMP", kelas: 2, mataPelajaran: "IPA", text: "Massa jenis air murni pada 4°C adalah ...", options: ["0,5 g/cm³", "1 g/cm³", "1,5 g/cm³", "2 g/cm³"], correctIndex: 1 },
      { id: 213, jenjang: "SMP", kelas: 1, mataPelajaran: "IPS", text: "Media penyimpanan data terbesar adalah ...", options: ["KB", "GB", "MB", "TB"], correctIndex: 3 },
      { id: 214, jenjang: "SMP", kelas: 3, mataPelajaran: "Matematika", text: "Faktorisasi dari x² - 9 adalah ...", options: ["(x+3)(x-3)", "(x+9)(x-1)", "(x-3)²", "(x+3)²"], correctIndex: 0 },
      { id: 215, jenjang: "SMP", kelas: 2, mataPelajaran: "IPA", text: "Jaringan yang menghubungkan otot dengan tulang disebut ...", options: ["Ligamen", "Tendon", "Kartilago", "Serabut"], correctIndex: 1 },
      { id: 216, jenjang: "SMP", kelas: 1, mataPelajaran: "IPS", text: "Negara ASEAN yang tidak pernah dijajah bangsa Eropa adalah ...", options: ["Myanmar", "Thailand", "Vietnam", "Filipina"], correctIndex: 1 },
      { id: 217, jenjang: "SMP", kelas: 2, mataPelajaran: "Matematika", text: "Volume kubus dengan rusuk 5 cm adalah ...", options: ["25 cm³", "75 cm³", "100 cm³", "125 cm³"], correctIndex: 3 },
      { id: 218, jenjang: "SMP", kelas: 1, mataPelajaran: "IPA", text: "Proses perubahan wujud dari gas ke cair disebut ...", options: ["Menguap", "Mencair", "Mengembun", "Menyublim"], correctIndex: 2 },
      { id: 219, jenjang: "SMP", kelas: 3, mataPelajaran: "Matematika", text: "Nilai sin 30° adalah ...", options: ["0", "1/2", "√2/2", "√3/2"], correctIndex: 1 },
      { id: 220, jenjang: "SMP", kelas: 2, mataPelajaran: "IPA", text: "Sumber energi terbarukan adalah ...", options: ["Batu bara", "Minyak bumi", "Gas alam", "Angin"], correctIndex: 3 },
      { id: 221, jenjang: "SMP", kelas: 1, mataPelajaran: "Matematika", text: "Hasil dari (-3) × (-5) adalah ...", options: ["-15", "-8", "8", "15"], correctIndex: 3 },
      { id: 222, jenjang: "SMP", kelas: 3, mataPelajaran: "IPA", text: "Sistem ekskresi pada ginjal menghasilkan ...", options: ["Keringat", "CO₂", "Urine", "Empedu"], correctIndex: 2 },
    ]
  },
  {
    id: 3,
    programId: 3,
    name: "Bank Soal SMA",
    jenjang: "SMA",
    questions: [
      { id: 301, jenjang: "SMA", kelas: 2, mataPelajaran: "Matematika", text: "Turunan dari f(x) = 3x² + 2x - 1 adalah ...", options: ["6x + 2", "3x + 2", "6x² + 2", "6x - 1"], correctIndex: 0 },
      { id: 302, jenjang: "SMA", kelas: 2, mataPelajaran: "Fisika", text: "Hukum Termodinamika I menyatakan tentang ...", options: ["Entropi", "Kekekalan energi", "Suhu nol mutlak", "Entalpi"], correctIndex: 1 },
      { id: 303, jenjang: "SMA", kelas: 1, mataPelajaran: "Kimia", text: "Ikatan antara atom Na dan Cl dalam NaCl adalah ikatan ...", options: ["Kovalen", "Ion", "Hidrogen", "Logam"], correctIndex: 1 },
      { id: 304, jenjang: "SMA", kelas: 3, mataPelajaran: "Matematika", text: "Limit dari (x²-4)/(x-2) saat x→2 adalah ...", options: ["0", "2", "4", "∞"], correctIndex: 2 },
      { id: 305, jenjang: "SMA", kelas: 1, mataPelajaran: "Biologi", text: "Organel sel yang berperan dalam respirasi sel adalah ...", options: ["Ribosom", "Mitokondria", "Lisosom", "Kloroplas"], correctIndex: 1 },
      { id: 306, jenjang: "SMA", kelas: 3, mataPelajaran: "Matematika", text: "Integral dari ∫2x dx adalah ...", options: ["x²", "x² + C", "2x² + C", "x + C"], correctIndex: 1 },
      { id: 307, jenjang: "SMA", kelas: 2, mataPelajaran: "Fisika", text: "Gaya Lorentz bekerja pada ...", options: ["Muatan diam", "Muatan bergerak dalam medan magnet", "Benda jatuh bebas", "Fluida"], correctIndex: 1 },
      { id: 308, jenjang: "SMA", kelas: 3, mataPelajaran: "Kimia", text: "Bilangan oksidasi Mn dalam KMnO₄ adalah ...", options: ["+4", "+5", "+6", "+7"], correctIndex: 3 },
      { id: 309, jenjang: "SMA", kelas: 1, mataPelajaran: "Matematika", text: "Matriks identitas 2×2 adalah ...", options: ["[[1,0],[0,1]]", "[[1,1],[1,1]]", "[[0,0],[0,0]]", "[[1,0],[1,0]]"], correctIndex: 0 },
      { id: 310, jenjang: "SMA", kelas: 2, mataPelajaran: "Biologi", text: "Proses pembelahan sel yang menghasilkan 4 sel anak disebut ...", options: ["Mitosis", "Meiosis", "Amitosis", "Binary fission"], correctIndex: 1 },
      { id: 311, jenjang: "SMA", kelas: 1, mataPelajaran: "Matematika", text: "Nilai cos 60° adalah ...", options: ["0", "1/2", "√2/2", "√3/2"], correctIndex: 1 },
      { id: 312, jenjang: "SMA", kelas: 1, mataPelajaran: "Fisika", text: "Hukum Ohm menyatakan V = ...", options: ["I/R", "I×R", "R/I", "I²×R"], correctIndex: 1 },
      { id: 313, jenjang: "SMA", kelas: 2, mataPelajaran: "Kimia", text: "Larutan dengan pH = 3 bersifat ...", options: ["Basa kuat", "Netral", "Asam lemah", "Asam kuat"], correctIndex: 3 },
      { id: 314, jenjang: "SMA", kelas: 1, mataPelajaran: "Matematika", text: "Persamaan kuadrat x² - 5x + 6 = 0 memiliki akar ...", options: ["1 dan 6", "2 dan 3", "-2 dan -3", "1 dan 5"], correctIndex: 1 },
      { id: 315, jenjang: "SMA", kelas: 2, mataPelajaran: "Biologi", text: "Hormon insulin diproduksi oleh ...", options: ["Hati", "Pankreas", "Tiroid", "Adrenal"], correctIndex: 1 },
      { id: 316, jenjang: "SMA", kelas: 1, mataPelajaran: "Fisika", text: "Momentum didefinisikan sebagai ...", options: ["m × a", "m × v", "F × t", "m × g"], correctIndex: 1 },
      { id: 317, jenjang: "SMA", kelas: 3, mataPelajaran: "Kimia", text: "Senyawa berikut yang termasuk alkena adalah ...", options: ["CH₄", "C₂H₆", "C₂H₄", "C₂H₂"], correctIndex: 2 },
      { id: 318, jenjang: "SMA", kelas: 2, mataPelajaran: "Matematika", text: "Log₂ 32 = ...", options: ["3", "4", "5", "6"], correctIndex: 2 },
      { id: 319, jenjang: "SMA", kelas: 3, mataPelajaran: "Biologi", text: "Teori evolusi dikemukakan oleh ...", options: ["Mendel", "Darwin", "Lamarck", "Newton"], correctIndex: 1 },
      { id: 320, jenjang: "SMA", kelas: 1, mataPelajaran: "Fisika", text: "Energi kinetik dinyatakan dengan rumus ...", options: ["mgh", "½mv²", "mv", "Fd"], correctIndex: 1 },
      { id: 321, jenjang: "SMA", kelas: 3, mataPelajaran: "Kimia", text: "Tata nama IUPAC untuk CH₃-CH₂-OH adalah ...", options: ["Metanol", "Etanol", "Propanol", "Butanol"], correctIndex: 1 },
      { id: 322, jenjang: "SMA", kelas: 2, mataPelajaran: "Matematika", text: "Determinan matriks [[2,3],[1,4]] = ...", options: ["5", "6", "7", "11"], correctIndex: 0 },
    ]
  }
];

// ===== HASIL PRE-TEST =====
export const pretestResults = [
  // { id: 1, studentName: "Ahmad", email: "ahmad@email.com", programId: 1, packageType: "bundle", score: 75, totalQuestions: 20, answers: [...], createdAt: "..." }
];

// Fungsi helper untuk mengambil soal acak dari bank soal
export function getRandomQuestions(programId, count = 20) {
  const bank = questionBanks.find(b => b.programId === programId);
  if (!bank || bank.questions.length === 0) return [];
  const shuffled = [...bank.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const studentSchedules = [
  { id: 1, studentId: 1, dayOfWeek: "Senin", startTime: "16:00", endTime: "18:00", subject: "TPS - Penalaran Umum", duration: "2 jam", liveClassUrl: "https://zoom.us/j/1234567890", whatsappReminder: true },
  { id: 2, studentId: 1, dayOfWeek: "Selasa", startTime: "16:00", endTime: "18:00", subject: "TPS - Penalaran Matematika", duration: "2 jam", liveClassUrl: "https://zoom.us/j/1234567891", whatsappReminder: true },
  { id: 3, studentId: 1, dayOfWeek: "Rabu", startTime: "16:00", endTime: "18:00", subject: "TKA - Matematika", duration: "2 jam", liveClassUrl: null, whatsappReminder: false },
  { id: 4, studentId: 1, dayOfWeek: "Kamis", startTime: "16:00", endTime: "18:00", subject: "TKA - Fisika", duration: "2 jam", liveClassUrl: "https://meet.google.com/abc-defg-hij", whatsappReminder: true },
  { id: 5, studentId: 1, dayOfWeek: "Jumat", startTime: "16:00", endTime: "18:00", subject: "Tryout & Pembahasan", duration: "2 jam", liveClassUrl: null, whatsappReminder: false },
  { id: 6, studentId: 2, dayOfWeek: "Selasa", startTime: "14:00", endTime: "16:00", subject: "Fisika Olimpiade", duration: "2 jam", liveClassUrl: "https://zoom.us/j/9876543210", whatsappReminder: true },
  { id: 7, studentId: 2, dayOfWeek: "Kamis", startTime: "14:00", endTime: "16:00", subject: "Matematika Olimpiade", duration: "2 jam", liveClassUrl: null, whatsappReminder: false },
  { id: 8, studentId: 3, dayOfWeek: "Senin", startTime: "15:00", endTime: "17:00", subject: "Matematika", duration: "2 jam", liveClassUrl: "https://zoom.us/j/1112223334", whatsappReminder: true },
  { id: 9, studentId: 3, dayOfWeek: "Rabu", startTime: "15:00", endTime: "17:00", subject: "Fisika", duration: "2 jam", liveClassUrl: null, whatsappReminder: false },
  { id: 10, studentId: 3, dayOfWeek: "Kamis", startTime: "15:00", endTime: "17:00", subject: "Kimia", duration: "2 jam", liveClassUrl: "https://meet.google.com/xyz-uvwx-yza", whatsappReminder: true }
];

// Log notifikasi WhatsApp yang sudah terkirim (mencegah pengiriman ganda)
export const whatsappNotificationLog = [];

export const feedbacks = [
  {
    id: 1,
    studentId: 1,
    adminId: 1,
    adminName: "Pak Haposan",
    content: "Budi, progress minggu ini sangat bagus! Nilai tryout TPS kamu naik 15 poin. Pertahankan intensitas belajarmu, terutama di bagian penalaran umum ya. Untuk minggu depan, fokus di latihan soal reading comprehension.",
    createdAt: "2026-04-15T08:00:00Z"
  },
  {
    id: 2,
    studentId: 1,
    adminId: 1,
    adminName: "Pak Haposan",
    content: "Modul TKA Matematika sudah aku buka aksesnya. Coba kerjakan latihan soal di halaman 20-30 sebelum kelas hari Rabu. Kalau ada yang bingung, bisa langsung tanya saat sesi bimbingan.",
    createdAt: "2026-04-12T10:30:00Z"
  },
  {
    id: 3,
    studentId: 2,
    adminId: 1,
    adminName: "Pak Haposan",
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

// ===== HELPER FUNCTIONS =====
export function getKelasForJenjang(jenjang) {
  const map = { SD: [4, 5, 6], SMP: [1, 2, 3], SMA: [1, 2, 3] };
  return map[jenjang] || [];
}

export function getFilteredQuestions(jenjang, kelas, mataPelajaran) {
  const allQuestions = questionBanks.flatMap(b => b.questions);
  return allQuestions.filter(q => {
    if (jenjang && q.jenjang !== jenjang) return false;
    if (kelas && q.kelas !== kelas) return false;
    if (mataPelajaran && q.mataPelajaran !== mataPelajaran) return false;
    return true;
  });
}

export function getMataPelajaranList(jenjang) {
  const map = {
    SD: ["Matematika", "IPA", "IPS", "Bahasa Indonesia"],
    SMP: ["Matematika", "IPA", "IPS", "Bahasa Indonesia", "Bahasa Inggris"],
    SMA: ["Matematika", "Fisika", "Kimia", "Biologi"],
  };
  return map[jenjang] || [];
}

// ===== TRYOUT =====
export const tryouts = [
  {
    id: 1, nama: "Tryout Matematika SD Kelas 5", jenjang: "SD", kelas: 5,
    mataPelajaran: "Matematika", jumlahSoal: 10, durasiMenit: 30,
    tanggalBuka: "2026-04-01T00:00:00Z", tanggalTutup: "2026-05-30T23:59:00Z",
    isActive: true, questionIds: [101, 106, 111, 115, 118, 120, 122, 102, 104, 109],
  },
  {
    id: 2, nama: "Tryout IPA SMP Kelas 2", jenjang: "SMP", kelas: 2,
    mataPelajaran: "IPA", jumlahSoal: 10, durasiMenit: 30,
    tanggalBuka: "2026-04-01T00:00:00Z", tanggalTutup: "2026-05-30T23:59:00Z",
    isActive: true, questionIds: [203, 205, 208, 212, 215, 218, 220, 222, 210, 206],
  },
  {
    id: 3, nama: "Tryout Fisika SMA Kelas 2", jenjang: "SMA", kelas: 2,
    mataPelajaran: "Fisika", jumlahSoal: 10, durasiMenit: 45,
    tanggalBuka: "2026-04-01T00:00:00Z", tanggalTutup: "2026-05-30T23:59:00Z",
    isActive: true, questionIds: [302, 307, 312, 316, 320, 301, 310, 313, 315, 318],
  },
];

export const tryoutResults = [];

export function getTryoutsForStudent(jenjang, kelas) {
  return tryouts.filter(t => t.jenjang === jenjang && t.kelas === kelas && t.isActive);
}

// ===== PACKAGES =====
export const packages = [
  { id: 1, programId: 1, nama: "Paket SD 3 Bulan", durasi: "3 bulan", durasiHari: 90, harga: 800000, fitur: ["20 Sesi Bimbingan", "Akses Materi Digital", "Tryout 2x", "Laporan Progress"], isPopular: false, isNew: false, updatedAt: "2026-04-01T00:00:00Z" },
  { id: 2, programId: 1, nama: "Paket SD 6 Bulan", durasi: "6 bulan", durasiHari: 180, harga: 1400000, fitur: ["40 Sesi Bimbingan", "Akses Materi Digital", "Tryout 4x", "Laporan Progress", "Konsultasi Orangtua"], isPopular: true, isNew: false, updatedAt: "2026-04-01T00:00:00Z" },
  { id: 3, programId: 2, nama: "Paket SMP 3 Bulan", durasi: "3 bulan", durasiHari: 90, harga: 1200000, fitur: ["24 Sesi Bimbingan", "Akses Materi Digital", "Tryout 2x", "Laporan Progress"], isPopular: false, isNew: true, updatedAt: "2026-04-20T00:00:00Z" },
  { id: 4, programId: 2, nama: "Paket SMP 6 Bulan", durasi: "6 bulan", durasiHari: 180, harga: 2000000, fitur: ["48 Sesi Bimbingan", "Akses Materi Digital", "Tryout 6x", "Laporan Progress", "Bimbingan 1-on-1"], isPopular: true, isNew: false, updatedAt: "2026-04-01T00:00:00Z" },
  { id: 5, programId: 3, nama: "Paket SMA 3 Bulan", durasi: "3 bulan", durasiHari: 90, harga: 1800000, fitur: ["30 Sesi Bimbingan", "Akses Materi Digital", "Tryout UTBK 2x", "Laporan Progress"], isPopular: false, isNew: false, updatedAt: "2026-04-01T00:00:00Z" },
  { id: 6, programId: 3, nama: "Paket SMA 1 Tahun", durasi: "1 tahun", durasiHari: 365, harga: 5500000, fitur: ["120 Sesi Bimbingan", "Akses Materi 24/7", "Tryout UTBK 12x", "Bimbingan 1-on-1", "Konsultasi Jurusan", "Garansi Skor Naik"], isPopular: true, isNew: true, updatedAt: "2026-04-22T00:00:00Z" },
];
