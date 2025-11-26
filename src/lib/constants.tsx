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
  Target,
  Eye,
  Sparkles,
} from "lucide-react";
import contributionAddData from "@/assets/contribution-add-data.svg";
import contributionUploadAudio from "@/assets/contribution-audio-sample.svg";
import contributionValidate from "@/assets/contribution-validate.svg";
import contributionReportWrongData from "@/assets/contribution-wrong-data.svg";

export const STORAGE_KEY = {
  USER: "rana_user",
  QUIZ: "rana_quiz",
};
export const MOBILE_BREAKPOINT = 768;
export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 1000000;
export const HOME_ANIMATION_DELAY = 2;

export const NAV_LINKS = [
  { to: "/", label: "Beranda", show: true },
  { to: "/contribute", label: "Kontribusi", show: true },
  { to: "/validate", label: "Validasi", show: false },
  { to: "/missions", label: "Misi", show: false },
  { to: "/explore", label: "Eksplor", show: true },
  { to: "/dictionary", label: "Kamus", show: true },
  { to: "/game", label: "Permainan", show: true },
  { to: "/about", label: "Tentang", show: true },
  { to: "/contact", label: "Kontak", show: true },
];

export const HOME_FEATURES = [
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
    title: <span><i>Micro-Learning</i> & Gamifikasi</span>,
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

export const HOME_STATS = [
  { value: "700+", label: "Bahasa Daerah" },
  { value: "10K+", label: "Kontributor Aktif" },
  { value: "100K+", label: "Kosakata" },
  { value: "50K+", label: "Rekaman Suara" },
];

export const RECORDED_STATUS_LIST = [
  { id: "all", name: "Semua Status" },
  { id: "recorded", name: "Sudah Tercatat" },
  { id: "not_recorded", name: "Belum Tercatat" },
];

export const VERIFIED_STATUS_LIST = [
  { id: "all", name: "Semua Status" },
  { id: "verified", name: "Sudah Terverifikasi" },
  { id: "not_verified", name: "Belum Terverifikasi" },
];

export const CONTRIBUTION_TYPES = [
  {
    icon: contributionAddData,
    title: "Menambahkan Data Baru",
    description: "Pengguna dapat menambahkan entri baru berupa kosakata, frasa, peribahasa, atau kalimat dalam bahasa daerah tertentu.",
    benefits: ["Kosakata baru", "Frasa, kalimat", "Terjemahan", "Contoh penggunaan", "Audio pengucapan (opsional)"],
    className: "-top-11",
  },
  {
    icon: contributionUploadAudio,
    title: "Unggah Sampel Audio Dialek",
    description: "Kontributor mengunggah rekaman suara untuk mengilustrasikan pengucapan dialek tertentu.",
    benefits: ["Pelatihan model TTS", "Memperkaya dialek tertentu"],
    className: "min-h-36 min-w-36",
  },
  {
    icon: contributionValidate,
    title: "Memvalidasi Kontribusi Orang Lain",
    description: "Validator komunitas (pengguna berlevel lebih tinggi) mengecek akurasi teks, arti, dan kualitas audio.",
    benefits: ["Cek kebenaran arti", "Cek ejaan", "Cek kualitas audio", "Cek relevansi konteks"],
    className: "min-w-72 min-h-72 -top-20",
  },
  {
    icon: contributionReportWrongData,
    title: "Melaporkan Data yang Salah",
    description: "Pengguna umum dapat melaporkan data yang dianggap tidak relevan, keliru, atau menyesatkan.",
    benefits: [<span><i>Flagging</i> konten bermasalah</span>, "Koreksi makna atau penulisan"],
    className: "min-w-52 min-h-52 -top-10"
  },
];

export const ABOUT_FEATURES = [
  {
    icon: Target,
    title: "Misi Kami",
    description: "Melestarikan dan menghidupkan kembali bahasa daerah Indonesia melalui teknologi AI dan kolaborasi komunitas, menciptakan ekosistem digital yang berkelanjutan untuk warisan budaya Nusantara.",
  },
  {
    icon: Eye,
    title: "Visi Kami",
    description: "Menjadi platform pelestarian bahasa terdepan di Indonesia, di mana setiap bahasa daerah memiliki tempat di era digital dan generasi muda bangga untuk belajar dan menggunakan bahasa leluhur mereka.",
  },
  {
    icon: Users,
    title: "Pendekatan Kolaboratif",
    description: "Menggabungkan kearifan penutur asli, kreativitas kreator konten, dan kekuatan teknologi AI untuk menciptakan pengalaman belajar yang autentik dan menarik.",
  },
  {
    icon: Sparkles,
    title: "Inovasi Digital",
    description: <span>Memanfaatkan <i>AI voice dataset</i>, pembelajaran interaktif, dan ekonomi kreatif untuk memberikan nilai nyata bagi pelestari bahasa dan komunitas lokal.</span>,
  },
];

export const CONTACT_INFO = [
  {
    icon: Mail,
    title: <span>Pos-el (<i>e-mail</i>)</span>,
    value: "hello@rana.id",
    description: <span>Kirim pos-el (<i>e-mail</i>) untuk pertanyaan umum</span>,
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