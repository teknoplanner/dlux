# Desain Teknis: Redesain Studio D Lucky X (Clean 3D Interactive Studio)

Tanggal: 8 Oktober 2026  
Status: Disetujui (Approved)  
Kategori: Architectural Design  
Mode Anti-Slop: DURING (Aktif Selama Pengerjaan)  

---

## 1. Ringkasan Eksekutif & Tujuan

Tujuan proyek ini adalah merombak tampilan website portofolio D Lucky X (https://dluckyx.cloud) dari tema gelap bertema tiruan Play Store menjadi landing page studio pengembang game dan aplikasi Android yang bersih, terang (clean light aesthetic), segar, elegan, dan dilengkapi panggung 3D Three.js interaktif.

Situs ini mempertahankan seluruh 7 aplikasi Android resmi D Lucky X beserta aset ikon dan tangkapan layar (screenshot) asli dari Play Store, namun menyajikannya dalam format portofolio studio independen modern yang fungsional, terpercaya, dan bebas dari pola generik AI slop.

---

## 2. Parameter Desain & Aturan Anti-Slop (Mode DURING)

### 2.1 Nilai Dials (Liveliness Toolkit)
* **ENERGY: 2 (Balanced)**. Percaya diri, hangat, cerah, dan ramah pengguna keluarga maupun gamer santai.
* **RHYTHM: 2 (Consistent with Varied Beats)**. Tata letak teratur namun memiliki aksen panggung 3D interaktif dan sorotan karya pilihan (spotlight) yang dinamis.
* **MOTION: 2 (Responsive & Purposeful Transitions)**. Animasi 3D real-time yang merespons kursor/sentuhan layar, transisi hover kartu yang halus, dan mendukung penuh preferensi reduksi gerak (prefers-reduced-motion).

### 2.2 Penegakan Aturan Anti-Slop
* **R-02 (Copywriting)**: Tidak menggunakan karakter em dash pada seluruh teks UI dan konten. Menggunakan titik, koma, titik dua, atau tanda kurung.
* **R-03 & R-25 (Responsif & Kontras)**: Tata letak mobile tanpa limpahan horizontal (no horizontal overflow), ukuran target sentuh minimal 44px, dan rasio kontras teks ke latar belakang memenuhi standar WCAG AA (rasio > 7:1 untuk teks normal pada latar terang).
* **R-17 & R-36 (Kejujuran Data)**: Tidak menyajikan statistik atau ulasan palsu. Menyajikan fakta produk nyata, kategori resmi, serta tautan terverifikasi ke Google Play Store.
* **R-21 & R-29 (Palet Terang Terarah)**: Menghilangkan latar belakang hitam pekat (#070913). Menggunakan kanvas terang bersih dengan pembagian 2 warna utama (putih dan slate) serta warna aksen yang mewakili masing-masing aplikasi.
* **R-26 & R-32 (Aksesibilitas & Interaktivitas)**: Seluruh tombol memiliki tujuan nyata (tautan eksternal ke Play Store atau navigasi internal) serta dapat dioperasikan menggunakan keyboard (Tab, Enter, Escape).

---

## 3. Palet Warna & Tipografi

* **Latar Belakang Halaman**: `#fafaf9` (Warm Studio Canvas) dan `#ffffff` (Pure White Surface)
* **Warna Kartu & Kontainer**: `#ffffff` dengan border halus `#e2e8f0` dan bayangan lembut alami `rgba(15, 23, 42, 0.05)`
* **Teks Utama**: `#0f172a` (Slate 900, tajam dan sangat terbaca)
* **Teks Sekunder**: `#475569` (Slate 600, kontras tinggi dan ramah di mata)
* **Aksen Warna Aplikasi**:
  * Stickman Penalty Rush: `#10b981` (Emerald Green)
  * Offline PDF Editor: `#0284c7` (Sky Blue)
  * Milo Cat Adventure: `#ec4899` (Rose Pink)
  * Monster Math Train: `#8b5cf6` (Purple Violet)
  * Fruit Match: `#f59e0b` (Warm Amber)
  * Kucing Atur Duit: `#f97316` (Vibrant Orange)
  * Baby Shark ABC: `#06b6d4` (Cyan Blue)

---

## 4. Arsitektur Komponen

### 4.1 Panggung 3D Interaktif (HeroScene.client.tsx & ThematicMeshes)
Panggung 3D terletak pada sisi kanan area Hero dan menampilkan 7 obyek 3D tematik melayang di atas alas studio bundar:
1. **Bola Sepak 3D**: Geometri ikosahedron dengan pola heksagonal bola sepak untuk Stickman Penalty Rush.
2. **Berkas Dokumen 3D**: Kotak tipis berlapis dengan pita segel stempel biru untuk Offline PDF Editor.
3. **Roket Luar Angkasa Kucing 3D**: Kapsul roket dengan sepasang telinga kucing untuk Milo Cat Adventure.
4. **Gerbong Kereta Angka 3D**: Kereta kayu mini dengan balok angka timbul untuk Monster Math Train Brain.
5. **Kubus Puzzle Buah 3D**: Kubus bersudut halus dengan tekstur sisi buah-buahan segar untuk Fruit Match.
6. **Koin Emas Kucing 3D**: Silinder koin emas timbul dengan cetakan jejak cakar untuk Kucing Atur Duit.
7. **Balok Huruf Kayu 3D**: Kubus balok edukasi anak dengan huruf timbul untuk Baby Shark ABC.

**Mekanisme Interaksi**:
* OrbitControls yang dibatasi sudut pandangnya agar panggung selalu tampak anggun dan stabil.
* Saat kursor melayang (hover) di atas salah satu obyek, obyek tersebut bergerak memantul (bounce), berputar lebih cepat, dan memunculkan badge nama aplikasi.
* Saat obyek diklik, fokus kamera Three.js berpindah halus dan antarmuka web menampilkan cuplikan aplikasi yang dipilih dengan tombol gulir mulus menuju kartu aplikasi tersebut di bawah.
* Menggunakan IntersectionObserver untuk menonaktifkan kalkulasi frame saat panggung tidak terlihat di layar pengguna.

### 4.2 Navigasi & Struktur Header (Navbar.tsx)
* Latar putih transparan dengan efek blur halus (`bg-white/85 backdrop-blur-md`).
* Monogram logo studio "D LUCKY X".
* Navigasi tautan: "Koleksi Aplikasi" (`#apps`), "Tentang Studio" (`#about`), dan "Kontak" (`/contact`).
* Tombol aksi cepat: "Google Play" dengan ikon panah keluar menuju halaman pengembang resmi.
* Menu laci mobile yang dapat dibuka/tutup dengan sentuhan dan ditutup via tombol Escape.

### 4.3 Hero Section (Hero.tsx)
* Judul studio: "Studio Kreatif Game Seru & Aplikasi Android Bermanfaat".
* Deskripsi: Merangkum karya D Lucky X yang menghadirkan hiburan game santai serta aplikasi utilitas berfaedah yang aman dan privat.
* Tag kategori: Game Android, Alat Produktivitas, dan Edukasi Anak.
* Tombol CTA: "Jelajahi Semua Karya" (menggulir ke `#apps`) dan "Halaman Google Play".

### 4.4 Showcase Grid Aplikasi (AppGrid.tsx & AppCard.tsx)
* Tab Filter: "Semua Karya (7)", "Game Android (3)", "Alat Produktivitas (2)", dan "Edukasi Anak (2)".
* Format Kartu Aplikasi (Studio Craft, Bukan Play Store):
  * Banner pratinjau tangkapan layar asli (`screenshot-1.webp`) dengan rasio aspek bersih.
  * Ikon resmi dari Play Store (`icon.webp`) dalam bingkai berlekuk halus.
  * Nama aplikasi berbobot tegas, badge kategori dengan warna aksen lembut, dan deskripsi singkat 2 baris.
  * Dua fitur unggulan dengan ikon centang rapi.
  * Tombol ganda: "Unduh di Google Play" (tombol utama) dan "Rincian Fitur" (menuju `/apps/[slug]`).

### 4.5 Sorotan Karya Pilihan (Featured.tsx)
* Menyajikan tab sorotan antara game andalan (Stickman Penalty Rush) dan aplikasi utilitas (Offline PDF Editor).
* Galeri carousel tangkapan layar nyata (`ScreenshotCarousel.tsx`) yang dapat digeser untuk melihat pratinjau antarmuka asli aplikasi.

### 4.6 Bagian Informasi Studio & Nilai Pengembang (About.tsx & WhyUs.tsx)
* Narasi studio independen: komitmen membuat aplikasi tanpa iklan menjengkelkan, melindungi privasi tanpa kirim data ke server pihak ketiga, dan ramah untuk seluruh anggota keluarga.
* Palet putih terang dan abu-abu cerah yang bersih dan elegan.

### 4.7 Footer (Footer.tsx)
* Tautan cepat ke Kebijakan Privasi (`/privacy`), kontak surel (`support@dluckyx.cloud`), dan hak cipta resmi D Lucky X.

---

## 5. Rencana Pengujian & Verifikasi

1. **Uji Validasi Aset & Halaman**:
   * Menjalankan `npm run build` yang otomatis mengeksekusi skrip `scripts/check-apps.mjs` untuk memverifikasi bahwa semua 7 halaman `/apps/[slug]` ter-generate secara statis tanpa galat.
2. **Uji Responsif & Lintas Perangkat**:
   * Memastikan tidak ada pergeseran tata letak atau limpahan horizontal di viewport mobile (360px hingga 420px) serta desktop (768px hingga 1440px).
3. **Uji Aksesibilitas & Keyboard**:
   * Memastikan navigasi Tab, Enter, dan Escape bekerja dengan baik pada seluruh menu interaktif dan tombol aksi.
4. **Verifikasi Anti-Slop Delivery Gate**:
   * Memeriksa seluruh teks untuk memastikan tidak ada em dash, tidak ada jargon berlebihan, serta kontras warna teks ke latar belakang memenuhi kriteria WCAG AA.
