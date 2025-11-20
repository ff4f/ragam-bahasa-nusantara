import { Mic, FileText, Flag, BadgeCheck } from "lucide-react";

export const STORAGE_USER_KEY = 'rana_user';

export const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/about", label: "Tentang" },
  // { to: "/learn", label: "Belajar" },
  { to: "/explore", label: "Eksplor" },
  { to: "/dictionary", label: "Kamus" },
  { to: "/missions", label: "Misi" },
  { to: "/contribute", label: "Kontribusi" },
  { to: "/contact", label: "Kontak" },
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