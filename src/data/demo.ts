export interface Skill {
  id: string
  nama: string
  bidang: string
  deskripsi: string
  durasi: string
  format: string
  harga: number
  mentor: string
  pengalaman: string
}

export const skills: Skill[] = [
  {
    id: 's-administrasi',
    nama: 'Administrasi Dasar dengan Spreadsheet',
    bidang: 'Administrasi',
    deskripsi: 'Mencatat stok, membuat laporan sederhana, dan mengelola data pelanggan dengan spreadsheet.',
    durasi: '8 sesi, 2 jam per sesi',
    format: 'Daring dan luring',
    harga: 250000,
    mentor: 'Komang Ayu',
    pengalaman: '6 tahun sebagai admin toko',
  },
  {
    id: 's-komunikasi',
    nama: 'Komunikasi dan Layanan Pelanggan',
    bidang: 'Layanan',
    deskripsi: 'Cara menyapa, menjawab keluhan, dan membalas pesan pelanggan dengan sopan dan jelas.',
    durasi: '4 sesi, 2 jam per sesi',
    format: 'Daring',
    harga: 150000,
    mentor: 'Made Surya',
    pengalaman: '4 tahun di bidang layanan tamu',
  },
  {
    id: 's-barista',
    nama: 'Dasar Barista dan Seduh Kopi',
    bidang: 'Kuliner',
    deskripsi: 'Mengenal jenis kopi, teknik seduh manual, dan standar kebersihan dapur kopi.',
    durasi: '6 sesi, 3 jam per sesi',
    format: 'Luring',
    harga: 400000,
    mentor: 'Ni Ketut Dewi',
    pengalaman: '5 tahun sebagai barista',
  },
  {
    id: 's-menjahit',
    nama: 'Menjahit Dasar',
    bidang: 'Produksi',
    deskripsi: 'Teknik jahit lurus, pemasangan kancing dan resleting, serta membaca pola sederhana.',
    durasi: '10 sesi, 2 jam per sesi',
    format: 'Luring',
    harga: 350000,
    mentor: 'Kadek Warti',
    pengalaman: '8 tahun sebagai penjahit',
  },
  {
    id: 's-medsos',
    nama: 'Pengelolaan Media Sosial untuk UMKM',
    bidang: 'Pemasaran Digital',
    deskripsi: 'Menyusun jadwal unggahan, menulis caption, dan membaca statistik sederhana.',
    durasi: '4 sesi, 2 jam per sesi',
    format: 'Daring',
    harga: 200000,
    mentor: 'Putu Adi',
    pengalaman: '3 tahun mengelola akun usaha lokal',
  },
  {
    id: 's-desain',
    nama: 'Desain Grafis Sederhana',
    bidang: 'Pemasaran Digital',
    deskripsi: 'Membuat poster dan unggahan promosi memakai aplikasi desain gratis.',
    durasi: '5 sesi, 2 jam per sesi',
    format: 'Daring',
    harga: 300000,
    mentor: 'Gede Pratama',
    pengalaman: '4 tahun sebagai desainer lepas',
  },
  {
    id: 's-bahasa',
    nama: 'Bahasa Inggris untuk Layanan Tamu',
    bidang: 'Kuliner',
    deskripsi: 'Kosakata dan kalimat dasar untuk menyambut dan melayani tamu di kafe atau penginapan.',
    durasi: '6 sesi, 2 jam per sesi',
    format: 'Daring dan luring',
    harga: 275000,
    mentor: 'Luh Gita',
    pengalaman: '5 tahun mengajar bahasa Inggris untuk pariwisata',
  },
]

export const bidangList = [...new Set(skills.map((skill) => skill.bidang))]

export function findSkill(id: string): Skill | undefined {
  return skills.find((skill) => skill.id === id)
}
