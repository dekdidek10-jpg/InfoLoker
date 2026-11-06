# Project memory

## Product intent & audience

- Platform lokal membantu lulusan SMA mencari pekerjaan, memahami syarat/skill, dan belajar skill di wilayah mereka
- Lima halaman inti: Home, Peluang Kerja, Map, Belajar Skill, Profil (+ Tentang)
- Pilot region: Gianyar, Bali (fokus satu wilayah dengan UMKM mitra)
- Tiga role: pencari kerja, pemilik usaha, mentor
- Produk inti: Peluang Kerja (pusat), Belajar Skill (jembatan), Map (alat lokal)

## Brand personality & voice

- Bahasa Indonesia
- Jujur, tidak menjanjikan pekerjaan/jaminan penghasilan
- Transparan tentang syarat kerja, harga pelatihan, dan status data

## Visual design & UX direction

- Responsif 360px–1366px, tidak ada overflow horizontal
- Label "Data demo" jelas terlihat di setiap halaman
- Kartu lowongan: posisi, lokasi, gaji, syarat, kontak
- Formulir wajib memvalidasi input dan tampilkan pesan error jelas
- Navigasi: Home, Profil, Peluang Kerja, Map, Belajar Skill

## Decisions, constraints & rationale

- Prototipe frontend pakai data demo untuk alur interaksi; auth, publikasi lintas pengguna, lamaran, dan penyimpanan permanen butuh backend
- Browser localStorage bukan sistem produksi
- Backend: Supabase untuk lowongan, layanan mentor, login dua role
- Peta saat ini ilustrasi; integrasi penyedia peta belum dipilih
- Prioritas: lowongan lengkap > peta luas kosong
- AC yang butuh backend: AC-01, AC-05, AC-07, AC-12, AC-13, AC-16; boleh disimulasikan di prototipe tapi harus diberi label simulasi

## Open questions & assumptions

- Pilihan (a) penyimpanan lowongan + login dua role atau (b) peta sungguhan — user belum menjawab
- Nama merek, wilayah peluncuran final, dan arsitektur backend belum final
- Target angka keberhasilan menunggu uji coba dengan pengguna/UMKM pertama
- Penyedia layanan peta belum ditentukan