/*
# Create profiles and jobs tables

1. New Tables
- `profiles`: one row per signed-in account, with its single role (pencari, usaha, or mentor), name, and domisili. The role cannot be changed after it is set.
- `jobs`: job listings with position, employer, location, field, work type, salary range, requirements, duties, hours, status (aktif or ditutup), contact, linked skill ids, and optional map coordinates. Demo listings are seeded with is_demo = true and no owner.

2. Security
- Row level security is enabled on both tables.
- Anyone (signed in or not) can read active job listings. Owners can also read their own closed listings.
- Only accounts with the usaha role can create listings, and only for themselves.
- Owners can update or delete only their own listings. Demo listings cannot be changed.
- Profiles can be read, created, and updated only by their own account. Only nama and domisili can be updated, so the role stays fixed.

3. Notes
- Seeded demo rows are labelled as demo data in the app.
- Map coordinates are optional; listings without them are not shown as map markers.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('pencari', 'usaha', 'mentor')),
  nama text NOT NULL CHECK (char_length(trim(nama)) >= 3),
  domisili text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON profiles TO authenticated;
GRANT UPDATE (nama, domisili) ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  is_demo boolean NOT NULL DEFAULT false,
  posisi text NOT NULL CHECK (char_length(trim(posisi)) > 0),
  usaha text NOT NULL CHECK (char_length(trim(usaha)) > 0),
  wilayah text NOT NULL CHECK (wilayah IN ('Gianyar', 'Sukawati', 'Ubud', 'Blahbatuh', 'Tampaksiring')),
  bidang text NOT NULL,
  tipe text NOT NULL CHECK (tipe IN ('Penuh waktu', 'Paruh waktu', 'Harian')),
  gaji_min integer NOT NULL CHECK (gaji_min >= 0),
  gaji_max integer NOT NULL,
  gaji_estimasi boolean NOT NULL DEFAULT false,
  satuan_gaji text NOT NULL,
  deskripsi text NOT NULL,
  syarat text[] NOT NULL DEFAULT '{}',
  tugas text[] NOT NULL DEFAULT '{}',
  jam_kerja text NOT NULL,
  status text NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'ditutup')),
  kontak text NOT NULL,
  skill_ids text[] NOT NULL DEFAULT '{}',
  peta_x integer CHECK (peta_x BETWEEN 0 AND 100),
  peta_y integer CHECK (peta_y BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (gaji_max >= gaji_min),
  CHECK ((is_demo AND owner_id IS NULL) OR (NOT is_demo AND owner_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs (status);
CREATE INDEX IF NOT EXISTS jobs_owner_idx ON jobs (owner_id);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON jobs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON jobs TO authenticated;

DROP POLICY IF EXISTS "select_active_or_own_jobs" ON jobs;
CREATE POLICY "select_active_or_own_jobs" ON jobs FOR SELECT
  TO anon, authenticated USING (status = 'aktif' OR owner_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_job_as_usaha" ON jobs;
CREATE POLICY "insert_own_job_as_usaha" ON jobs FOR INSERT
  TO authenticated WITH CHECK (
    owner_id = auth.uid()
    AND NOT is_demo
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'usaha')
  );

DROP POLICY IF EXISTS "update_own_job" ON jobs;
CREATE POLICY "update_own_job" ON jobs FOR UPDATE
  TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid() AND NOT is_demo);

DROP POLICY IF EXISTS "delete_own_job" ON jobs;
CREATE POLICY "delete_own_job" ON jobs FOR DELETE
  TO authenticated USING (owner_id = auth.uid());

INSERT INTO jobs (id, owner_id, is_demo, posisi, usaha, wilayah, bidang, tipe, gaji_min, gaji_max, gaji_estimasi, satuan_gaji, deskripsi, syarat, tugas, jam_kerja, status, kontak, skill_ids, peta_x, peta_y) VALUES
('11111111-1111-4111-8111-111111111101', NULL, true, 'Staf Administrasi Toko', 'UMKM Kopi Sawah', 'Ubud', 'Administrasi', 'Penuh waktu', 2100000, 2500000, true, 'per bulan', 'Membantu mencatat penjualan dan stok, serta membalas pesan pelanggan melalui media sosial.', ARRAY['Lulusan SMA atau SMK', 'Bisa memakai komputer untuk mengetik dan spreadsheet dasar', 'Teliti dan ramah'], ARRAY['Mencatat stok harian', 'Membuat laporan penjualan mingguan', 'Membalas pesan pelanggan'], 'Senin sampai Sabtu, 08.00 sampai 16.00', 'aktif', 'Ibu Wayan, 0812-0000-0001', ARRAY['s-administrasi', 's-komunikasi'], 62, 40),
('11111111-1111-4111-8111-111111111102', NULL, true, 'Barista Pemula', 'Kedai Lentera', 'Sukawati', 'Kuliner', 'Paruh waktu', 1500000, 1800000, false, 'per bulan', 'Menyiapkan minuman kopi dan teh untuk pelanggan pada jam sibuk akhir pekan.', ARRAY['Minimal lulusan SMA', 'Bersedia bekerja akhir pekan', 'Tidak takut bekerja cepat'], ARRAY['Menyeduh kopi dan minuman lain', 'Menjaga kebersihan area kerja'], 'Sabtu dan Minggu, 10.00 sampai 18.00', 'aktif', 'Bapak Nyoman, 0812-0000-0002', ARRAY['s-barista', 's-bahasa'], 35, 55),
('11111111-1111-4111-8111-111111111103', NULL, true, 'Penjahit Pemula', 'Rumah Jahit Bambu', 'Blahbatuh', 'Produksi', 'Penuh waktu', 2000000, 3000000, true, 'per bulan', 'Membantu produksi tas dan pakaian sederhana. Pelatihan awal tersedia untuk yang belum berpengalaman.', ARRAY['Lulusan SMA atau SMK', 'Mau belajar menjahit dari dasar', 'Teliti dengan ukuran'], ARRAY['Memotong dan menjahit bagian kain', 'Memasang kancing dan resleting'], 'Senin sampai Jumat, 08.00 sampai 16.00', 'aktif', 'Ibu Kadek, 0812-0000-0003', ARRAY['s-menjahit'], 50, 70),
('11111111-1111-4111-8111-111111111104', NULL, true, 'Admin Media Sosial', 'Studio Bambu', 'Gianyar', 'Pemasaran Digital', 'Harian', 100000, 150000, false, 'per hari', 'Mengunggah konten promosi dan menjawab komentar untuk akun usaha kecil.', ARRAY['Mengerti penggunaan media sosial', 'Bisa membuat foto sederhana dengan ponsel'], ARRAY['Mengunggah konten sesuai jadwal', 'Membalas komentar dan pesan'], 'Fleksibel, sekitar 4 jam per hari', 'aktif', 'Gede, 0812-0000-0004', ARRAY['s-medsos', 's-desain'], 30, 25),
('11111111-1111-4111-8111-111111111105', NULL, true, 'Asisten Gudang', 'CV Tani Makmur', 'Tampaksiring', 'Administrasi', 'Penuh waktu', 2200000, 2600000, false, 'per bulan', 'Membantu pengecekan barang masuk dan keluar di gudang hasil tani.', ARRAY['Lulusan SMA atau SMK', 'Kuat mengangkat barang ringan'], ARRAY['Mengecek barang masuk', 'Menyusun stok di gudang'], 'Senin sampai Sabtu, 07.00 sampai 15.00', 'ditutup', 'Pak Ketut, 0812-0000-0005', ARRAY['s-administrasi'], 75, 20),
('11111111-1111-4111-8111-111111111106', NULL, true, 'Staf Layanan Tamu Homestay', 'Homestay Bukit Hijau', 'Ubud', 'Layanan', 'Penuh waktu', 2300000, 2800000, false, 'per bulan', 'Menyambut tamu, membantu check-in, dan menjawab pertanyaan tamu dalam bahasa Indonesia dan Inggris.', ARRAY['Lulusan SMA atau SMK', 'Bisa berbahasa Inggris dasar', 'Ramah dan sabar'], ARRAY['Menyambut tamu saat check-in', 'Menjawab pertanyaan tamu'], 'Shift pagi atau sore, 6 hari seminggu', 'aktif', 'Ibu Luh, 0812-0000-0006', ARRAY['s-komunikasi', 's-bahasa'], 58, 32);
