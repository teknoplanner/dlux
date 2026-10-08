# Clean 3D Studio Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merombak tampilan website D Lucky X menjadi portofolio studio game dan aplikasi Android modern berlatar terang (clean canvas), bebas dari elemen tiruan Play Store, dilengkapi panggung 3D Three.js interaktif dengan 7 obyek tematik, serta mempertahankan seluruh aset resmi ikon dan screenshot.

**Architecture:** Memperbarui tema global ke palet putih dan abu-abu terang bernuansa studio kreatif. Mengembangkan 7 komponen geometri 3D prosedural di React Three Fiber untuk mewakili masing-masing aplikasi dengan interaktivitas hover dan klik. Menyesuaikan tata letak komponen Hero, AppGrid, AppCard, Featured, About, Navbar, dan Footer agar berkarakter kuat, elegan, dan memenuhi seluruh kriteria Anti-Slop (Mode DURING).

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Three.js, @react-three/fiber, @react-three/drei, Lucide React, Framer Motion.

**Spec:** `docs/superpowers/specs/2026-10-08-clean-3d-studio-showcase-design.md`

## Global Constraints

- Latar belakang utama harus bersih dan terang (#fafaf9 / #ffffff), dilarang menggunakan latar hitam pekat (#070913) atau dark theme default.
- Dilarang menggunakan karakter em dash (—) pada seluruh teks antarmuka dan konten; gunakan koma, titik dua, tanda kurung, atau titik (R-02).
- Seluruh 7 aplikasi dari src/data/apps.ts wajib ditampilkan dengan ikon dan screenshot asli dari direktori public/images/apps/<slug>/.
- Seluruh elemen interaktif (tombol, tautan, tab filter) harus memiliki aksi nyata dan dapat diakses dengan keyboard (R-26, R-32).
- Rasio kontras teks terhadap latar belakang wajib memenuhi standar WCAG AA (> 4.5:1 untuk teks normal, > 3:1 untuk teks tebal/besar) (R-25).
- Desain mobile harus sempurna tanpa limpahan horizontal (no horizontal overflow) (R-03).
- Dials Desain: ENERGY 2 (Balanced), RHYTHM 2 (Varied sections), MOTION 2 (Smooth purposeful transitions).

## Review Focus

1. Interaktivitas 3D di perangkat layar sentuh: rotasi kamera tidak boleh mengunci gulir halaman (pan touch) secara agresif.
2. Fallback WebGL: jika akselerasi grafis mati atau bermasalah, antarmuka tetap menampilkan fallback elegan tanpa error console.
3. Keterbacaan teks kartu pada latar terang: teks abu-abu sekunder harus menggunakan minimal Slate-600 (#475569) agar kontras selalu di atas 4.5:1.
4. Konsistensi tautan resmi Google Play: seluruh tombol unduh mengarah langsung ke tautan resmi aplikasi di Google Play Store.
5. Validasi build statis: proses npm run build dan check-apps.mjs harus sukses 100% mengekspor semua 7 halaman detail.

---

### Task 1: Fondasi Palet Warna Bersih & Gaya Global (Clean Studio Theme)

**Files:**
- Modify: `src/app/globals.css:1-60`
- Modify: `src/app/layout.tsx:1-50`

**Interfaces:**
- Consumes: Tailwind theme configuration dan CSS variables.
- Produces: CSS custom properties untuk background bersih (#fafaf9), surface putih murni (#ffffff), border lembut (#e2e8f0), teks Slate 900 (#0f172a) dan Slate 600 (#475569).

- [ ] **Step 1: Definisikan variabel warna CSS terang di `src/app/globals.css`**
  Ganti skema warna gelap dengan palet terang:
  ```css
  :root {
    --bg-main: #fafaf9;
    --bg-surface: #ffffff;
    --border-subtle: #e2e8f0;
    --text-primary: #0f172a;
    --text-secondary: #475569;
  }
  body {
    background-color: var(--bg-main);
    color: var(--text-primary);
  }
  ```
- [ ] **Step 2: Perbarui meta tema dan latar belakang di `src/app/layout.tsx`**
  Pastikan `themeColor` bernilai `#fafaf9` dan elemen `body` menggunakan kelas Tailwind `bg-[#fafaf9] text-slate-900 antialiased selection:bg-slate-900 selection:text-white`.
- [ ] **Step 3: Verifikasi sintaks dan kompilasi dasar**
  Jalankan `npm run lint` untuk memastikan tidak ada kesalahan konfigurasi styling.
- [ ] **Step 4: Commit perubahan Task 1**
  ```bash
  git add src/app/globals.css src/app/layout.tsx
  git commit -m "style: establish clean light theme foundation and layout tokens"
  ```

---

### Task 2: Navigasi Bersih & Footer Studio (Navbar & Footer)

**Files:**
- Modify: `src/components/layout/Navbar.tsx:1-120`
- Modify: `src/components/layout/Footer.tsx:1-100`

**Interfaces:**
- Consumes: Developer profile dari `src/data/apps.ts`.
- Produces: Header sticky bernuansa clean glassmorphism ringan dan Footer studio terstruktur.

- [ ] **Step 1: Perbarui Navbar di `src/components/layout/Navbar.tsx`**
  - Ganti warna latar menjadi `bg-white/85 backdrop-blur-md border-b border-slate-200/80`.
  - Teks navigasi berwarna `text-slate-600 hover:text-slate-900 font-medium`.
  - Tombol aksi utama "Google Play" dengan styling kontras elegan (`bg-slate-900 text-white hover:bg-slate-800`).
  - Menu mobile dengan latar putih, transisi halus, dan penutupan dengan tombol Escape.
- [ ] **Step 2: Perbarui Footer di `src/components/layout/Footer.tsx`**
  - Latar belakang `bg-slate-50 border-t border-slate-200`.
  - Teks deskripsi dan tautan legal (Kebijakan Privasi di `/privacy`, kontak di `/contact`, email `support@dluckyx.cloud`).
  - Menghapus karakter em dash dan memastikan teks natural.
- [ ] **Step 3: Uji visual & keyboard focus**
  Pastikan tautan dapat di-tab dan fokus ring terlihat jelas (`focus-visible:ring-2 focus-visible:ring-slate-900`).
- [ ] **Step 4: Commit perubahan Task 2**
  ```bash
  git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
  git commit -m "feat: modernize navbar and footer with clean studio aesthetic"
  ```

---

### Task 3: Panggung 3D Interaktif dengan 7 Obyek Tematik (Three.js Stage)

**Files:**
- Modify: `src/components/three/HeroScene.client.tsx:1-500`
- Modify: `src/components/three/SceneFallback.tsx:1-50`

**Interfaces:**
- Consumes: Daftar aplikasi dan warna aksen dari `src/data/apps.ts`.
- Produces: `HeroSceneClient` dengan panggung 3D studio, 7 obyek tematik interaktif (hover, click, orbit), dan mini status HUD.

- [ ] **Step 1: Rancang 7 Geometri 3D Tematik Prosedural**
  1. *Stickman Ball*: Geometri bola sepak dengan motif heksagonal & cincin emerald (`#10b981`).
  2. *PDF Document*: Lembaran dokumen putih tebal bersudut halus dengan segel stempel biru (`#0284c7`).
  3. *Milo Rocket*: Kapsul luar angkasa dengan telinga kucing dan jendela bulat merah muda (`#ec4899`).
  4. *Monster Math Train*: Gerbong kereta balok mini dengan kubus angka ungu (`#8b5cf6`).
  5. *Fruit Puzzle*: Kubus puzzle multi-sisi dengan warna buah segar amber (`#f59e0b`).
  6. *Cat Wealth Coin*: Koin emas timbul berkilau dengan motif jejak cakar kucing oranye (`#f97316`).
  7. *ABC Toy Block*: Balok kayu edukasi balita bertuliskan ABC cerah cyan (`#06b6d4`).
- [ ] **Step 2: Bangun Panggung Studio Marmer Putih & Pencahayaan Studio**
  - Alas panggung marmer putih dengan bayangan kontak lembut (*soft shadow plane*).
  - Ambient light sejuk, key light hangat dari atas, dan rim light halus.
  - OrbitControls dengan pembatasan polar angle (`minPolarAngle: Math.PI / 3`, `maxPolarAngle: Math.PI / 2.1`) agar kamera selalu berada di atas panggung.
- [ ] **Step 3: Tambahkan Logika Interaktivitas (Hover & Click)**
  - Hover: Obyek melakukan animasi melompat halus (bob/bounce), memicu rotasi akselerasi, dan menampilkan tooltip nama aplikasi di kanvas atau overlay HUD.
  - Klik: Kamera fokus halus ke obyek yang dipilih dan memancarkan event `onSelectApp(slug)` untuk sinkronisasi ke tampilan web.
- [ ] **Step 4: Perbarui `SceneFallback.tsx` ke tema terang**
  Latar putih dengan indikator pemuatan minimalis yang bersih.
- [ ] **Step 5: Commit perubahan Task 3**
  ```bash
  git add src/components/three/HeroScene.client.tsx src/components/three/SceneFallback.tsx
  git commit -m "feat: implement clean 3d interactive stage with 7 thematic objects"
  ```

---

### Task 4: Perombakan Area Hero (Hero Section)

**Files:**
- Modify: `src/components/sections/Hero.tsx:1-120`

**Interfaces:**
- Consumes: `HeroScene` dari `src/components/three/HeroScene.client.tsx`, data aplikasi dari `src/data/apps.ts`.
- Produces: Komponen Hero terang, ramah, bebas badge Play Store klise, dengan 2 kolom terintegrasi.

- [ ] **Step 1: Susun ulang tata letak Hero di `src/components/sections/Hero.tsx`**
  - Ganti background menjadi `bg-gradient-to-b from-[#fafaf9] via-white to-[#fafaf9] border-b border-slate-200/60`.
  - Ganti badge "PENGEMBANG RESMI" dengan badge studio elegan: "STUDIO INDIE ANDROID" berlatar putih dengan border abu-abu bersih.
  - Judul: "Studio Kreatif Game Seru & Aplikasi Android Bermanfaat" berwarna `text-slate-900 font-extrabold`.
  - Deskripsi: Penjelasan natural tentang ragam game santai dan alat produktivitas yang aman dan privat.
  - Tag kategori cepat: Game Android, Alat Produktivitas, Edukasi Anak.
  - Tombol CTA: "Jelajahi Semua Karya" (mengarah ke `#apps`) dan "Kunjungi Google Play".
  - Frame panggung 3D: Berlatar putih bersih (`bg-white rounded-3xl border border-slate-200 shadow-xl p-2`).
- [ ] **Step 2: Integrasikan state sinkronisasi pemilihan obyek 3D ke kartu aplikasi**
  Saat obyek 3D diklik di HeroScene, kartu pratinjau mini muncul di bawah panggung dengan tombol langsung gulir ke detail aplikasi.
- [ ] **Step 3: Verifikasi responsivitas mobile pada Hero**
  Pastikan di layar < 640px, panggung 3D memiliki tinggi proporsional (340px) dan tombol CTA bertumpuk rapi dengan lebar penuh.
- [ ] **Step 4: Commit perubahan Task 4**
  ```bash
  git add src/components/sections/Hero.tsx
  git commit -m "feat: redesign hero section with clean studio aesthetics and 3d integration"
  ```

---

### Task 5: Showcase Grid Aplikasi & Kartu Portofolio (AppGrid & AppCard)

**Files:**
- Modify: `src/components/app/AppCard.tsx:1-190`
- Modify: `src/components/sections/AppGrid.tsx:1-100`

**Interfaces:**
- Consumes: Data `apps` dari `src/data/apps.ts`.
- Produces: Kartu portofolio produk modern dengan gambar nyata dan filter kategori.

- [ ] **Step 1: Perbarui Kartu Aplikasi di `src/components/app/AppCard.tsx`**
  - Ganti container menjadi kartu putih: `bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300`.
  - Banner screenshot asli (`app.screenshots[0]`) dalam wadah proporsional dengan rasio gambar jernih.
  - Ikon resmi (`app.icon`) 64x64px dalam bingkai berlekuk sudut halus dengan garis tepi putih/slate.
  - Hapus badge Play Protect artifisial dan package ID teknis yang kaku.
  - Sajikan 2 poin fitur unggulan dengan tanda centang hijau segar.
  - Aksi ganda: Tombol "Buka di Google Play" (utama, warna solid beraksen) dan "Rincian Fitur" (tombol outline elegan menuju `/apps/[slug]`).
- [ ] **Step 2: Perbarui Filter Kategori di `src/components/sections/AppGrid.tsx`**
  - Latar section `bg-white py-20`.
  - Header section yang elegan: "Koleksi Karya Kami" dengan subjudul ramah.
  - Tab kategori berlatar abu-abu netral dengan state aktif kontras tegas (`bg-slate-900 text-white` saat aktif, `bg-slate-100 text-slate-700` saat tidak aktif).
- [ ] **Step 3: Commit perubahan Task 5**
  ```bash
  git add src/components/app/AppCard.tsx src/components/sections/AppGrid.tsx
  git commit -m "feat: redesign app cards and catalog grid with modern studio portfolio craft"
  ```

---

### Task 6: Sorotan Karya Pilihan & Bagian Pendukung (Featured, About, WhyUs, Cta, Stats)

**Files:**
- Modify: `src/components/sections/Featured.tsx:1-170`
- Modify: `src/components/sections/About.tsx:1-100`
- Modify: `src/components/sections/WhyUs.tsx:1-100`
- Modify: `src/components/sections/Cta.tsx:1-80`
- Modify: `src/components/sections/Stats.tsx:1-80`

**Interfaces:**
- Consumes: Data aplikasi dan profil studio.
- Produces: Bagian sorotan dan narasi developer dengan tampilan terang dan bahasa jujur.

- [ ] **Step 1: Perbarui `Featured.tsx`**
  - Latar `bg-slate-50 border-y border-slate-200`.
  - Kartu sorotan besar berlatar putih dengan bayangan lembut, menampilkan tangkapan layar bergerak (*ScreenshotCarousel*), rincian fitur, dan tombol unduh langsung.
- [ ] **Step 2: Perbarui `About.tsx` dan `WhyUs.tsx`**
  - Ganti warna kartu dan latar menjadi putih/terang.
  - Pastikan copywriting bebas dari em dash, bebas klaim palsu, dan fokus pada komitmen privasi serta hiburan game yang ramah keluarga.
- [ ] **Step 3: Perbarui `Stats.tsx` dan `Cta.tsx`**
  - Ubah Stats strip menjadi ringkasan jujur portofolio (jumlah game aksi, alat utilitas, edukasi anak).
  - Ubah Cta section menjadi ajakan hangat berlatar bersih dengan tombol menuju profil Google Play.
- [ ] **Step 4: Commit perubahan Task 6**
  ```bash
  git add src/components/sections/Featured.tsx src/components/sections/About.tsx src/components/sections/WhyUs.tsx src/components/sections/Cta.tsx src/components/sections/Stats.tsx
  git commit -m "feat: align spotlight, about, and supportive sections with clean bright aesthetic"
  ```

---

### Task 7: Penyesuaian Halaman Detail Aplikasi, Kebijakan Privasi, dan Kontak

**Files:**
- Modify: `src/app/apps/[slug]/page.tsx:1-200`
- Modify: `src/app/privacy/page.tsx:1-100`
- Modify: `src/app/contact/page.tsx:1-100`

**Interfaces:**
- Consumes: Data rincian tiap aplikasi dari `src/data/apps.ts`.
- Produces: Halaman sub-rute berlatar terang yang konsisten dengan tema utama situs.

- [ ] **Step 1: Perbarui Halaman Detail `/apps/[slug]`**
  - Ganti latar belakang gelap menjadi terang (`bg-[#fafaf9]`).
  - Kartu galeri tangkapan layar, spesifikasi aplikasi, dan tombol unduh di Google Play berlatar putih dengan garis tepi halus.
- [ ] **Step 2: Perbarui Halaman Kebijakan Privasi `/privacy` dan Kontak `/contact`**
  - Pastikan keterbacaan dokumen legal optimal di latar terang dengan teks gelap tajam.
  - Formulir kontak dan informasi email `support@dluckyx.cloud` disajikan dalam kontainer putih bersih.
- [ ] **Step 3: Commit perubahan Task 7**
  ```bash
  git add src/app/apps/[slug]/page.tsx src/app/privacy/page.tsx src/app/contact/page.tsx
  git commit -m "style: ensure light theme consistency on app detail, privacy, and contact pages"
  ```

---

### Task 8: Pengujian Menyeluruh, Verifikasi Build & Delivery Gate Anti-Slop

**Files:**
- Inspect: Seluruh file proyek terkait.

- [ ] **Step 1: Jalankan Build Statis dan Pemeriksaan Aplikasi**
  Jalankan `npm run build` yang memicu `next build` dan `node scripts/check-apps.mjs`.
  Pastikan 7 aplikasi ter-generate sempurna di folder `out/apps/`.
- [ ] **Step 2: Pindai Kepatuhan Anti-Slop (No Em Dash & Text Scan)**
  Jalankan pemindaian teks pada seluruh file `src/` untuk memastikan tidak ada em dash (`—`) yang lolos.
- [ ] **Step 3: Jalankan Delivery Gate Report**
  Verifikasi semua butir Delivery Gate (R-02, R-03, R-17, R-25, R-26, R-32, R-35) dengan bukti konkret.
- [ ] **Step 4: Commit final hasil verifikasi**
  ```bash
  git commit -m "chore: complete clean 3d studio showcase verification and delivery checks"
  ```
