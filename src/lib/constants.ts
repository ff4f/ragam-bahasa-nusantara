import {
  Mic,
  FileText,
  Flag,
  BadgeCheck,
  BookOpen,
  Users,
  Globe,
  Heart,
  TrendingUp,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";

export const STORAGE_USER_KEY = 'rana_user';
export const MOBILE_BREAKPOINT = 768;
export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 1000000;
export const HOME_ANIMATION_DELAY = 2;

export const navLinks = [
  { to: "/", label: "Beranda", show: true },
  { to: "/about", label: "Tentang", show: true },
  { to: "/game", label: "Bermain", show: true },
  { to: "/explore", label: "Eksplor", show: true },
  { to: "/dictionary", label: "Kamus", show: true },
  { to: "/missions", label: "Misi", show: false },
  { to: "/contribute", label: "Kontribusi", show: true },
  { to: "/validate", label: "Validasi", show: false },
  { to: "/contact", label: "Kontak", show: true },
];

export const featuresHome = [
  {
    icon: BookOpen,
    title: "Arsip Bahasa Interaktif",
    description: "Rekaman kata, frasa, cerita rakyat, dialek, dan ekspresi lokal dalam format digital yang mudah diakses",
  },
  {
    icon: Globe,
    title: "Peta Hidup Bahasa Nusantara",
    description: "Visualisasi interaktif persebaran dan status bahasa daerah di seluruh Indonesia",
  },
  {
    icon: TrendingUp,
    title: "AI Linguistik",
    description: "Transkripsi suara otomatis, klasifikasi kata, dan kurasi dataset dengan teknologi AI terkini",
  },
  {
    icon: Heart,
    title: "Micro-Learning & Gamifikasi",
    description: "Kartu kosakata visual, tantangan harian, kuis interaktif, dan audio dari penutur asli",
  },
  {
    icon: Mic,
    title: "Kontribusi Komunitas",
    description: "Fitur unggah rekaman suara oleh penutur asli untuk memperkaya database bahasa",
  },
  {
    icon: Users,
    title: "Kamus Multimedia",
    description: "Kamus lengkap dengan audio pelafalan, makna, konteks penggunaan, dan contoh kalimat",
  },
];

export const statsHome = [
  { value: "700+", label: "Bahasa Daerah" },
  { value: "10K+", label: "Kontributor Aktif" },
  { value: "100K+", label: "Kosakata" },
  { value: "50K+", label: "Rekaman Suara" },
];

export const statusList = [
  { id: "all", name: "Semua Status" },
  { id: "recorded", name: "Sudah Tercatat" },
  { id: "not_recorded", name: "Belum Tercatat" },
];

export const verifiedStatusList = [
  { id: "all", name: "Semua Status" },
  { id: "verified", name: "Sudah Terverifikasi" },
  { id: "not_verified", name: "Belum Terverifikasi" },
];

export const contributionTypes = [
  {
    icon: FileText,
    title: "Menambahkan Data Baru",
    description: "Pengguna dapat menambahkan entri baru berupa kosakata, frasa, peribahasa, atau kalimat dalam bahasa daerah tertentu.",
    benefits: ["Kosakata baru", "Frasa, kalimat", "Terjemahan", "Contoh penggunaan", "Audio pengucapan (opsional)"],
  },
  {
    icon: Mic,
    title: "Upload Sample Audio Dialek",
    description: "Kontributor mengunggah rekaman suara untuk mengilustrasikan pengucapan dialek tertentu.",
    benefits: ["Pelatihan model TTS", "Memperkaya dialek tertentu"],
  },
  {
    icon: BadgeCheck,
    title: "Memvalidasi Kontribusi Orang Lain",
    description: "Validator komunitas (pengguna berlevel lebih tinggi) mengecek akurasi teks, arti, dan kualitas audio.",
    benefits: ["Cek kebenaran arti", "Cek ejaan", "Cek kualitas audio", "Cek relevansi konteks"],
  },
  {
    icon: Flag,
    title: "Melaporkan Data yang Salah",
    description: "Pengguna umum dapat melaporkan data yang dianggap tidak relevan, keliru, atau menyesatkan.",
    benefits: ["Flagging konten bermasalah", "Koreksi makna atau penulisan"],
  },
];

export const CONTACT_INFO = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@rana.id",
      description: "Kirim email untuk pertanyaan umum",
    },
    {
      icon: Phone,
      title: "Telepon",
      value: "+62 812-3456-7890",
      description: "Senin - Jumat, 09:00 - 17:00 WIB",
    },
    {
      icon: MapPin,
      title: "Alamat",
      value: "Jakarta, Indonesia",
      description: "Kantor pusat RANA",
    },
    {
      icon: MessageCircle,
      title: "Forum Komunitas",
      value: "forum.rana.id",
      description: "Diskusi dengan sesama anggota",
    },
  ];

export const INITIAL_FORM_CONTRIBUTION = {
  province: [],
  region: [],
  language: "",
  ethnic: "",
  dialect: "",
  text: "",
  textTranslation: "",
  sentence: "",
  sentenceTranslation: "",
  textAudio: "",
  notes: "",
};