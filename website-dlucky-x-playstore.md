# Website Showcase D Lucky X — Next.js + Three.js + Lucide

Dokumen ini adalah spesifikasi lengkap untuk membangun website portofolio aplikasi & game Android dari halaman developer Google Play:
https://play.google.com/store/apps/dev?id=5090788794635737630

Developer: **D Lucky X** — *Independent game developer building fun games and useful Android apps for productivity, learning, and entertainment.*

---

## 1. Tujuan

- Landing page yang menarik dan modern untuk memperkenalkan developer dan semua aplikasinya.
- Mengarahkan pengunjung ke halaman Google Play tiap aplikasi (tombol Install).
- Menjadi "rumah resmi" brand: menyediakan halaman Privacy Policy, kontak, dan press kit (berguna untuk kebutuhan Play Console).
- Di-host gratis di GitHub Pages dengan domain sendiri.

## 2. Daftar Aplikasi Saat Ini

| # | Nama | Package ID | Kategori | Link |
|---|------|-----------|----------|------|
| 1 | Stickman Penalty Rush | `com.stickmanpenaltyrush.game` | Game / Olahraga (adu penalti stickman) | https://play.google.com/store/apps/details?id=com.stickmanpenaltyrush.game |
| 2 | Milo Cat Adventure | `com.miloadventure.game` | Game / Petualangan (platformer 2D kucing luar angkasa) | https://play.google.com/store/apps/details?id=com.miloadventure.game |
| 3 | Monster Math Train Brain | `com.monsteradventuremath` | Game / Edukasi (matematika & latih otak) | https://play.google.com/store/apps/details?id=com.monsteradventuremath |
| 4 | Baby Shark ABC: Kids Learning | `com.sharksmartalphabet` | Edukasi Anak (belajar alfabet) | https://play.google.com/store/apps/details?id=com.sharksmartalphabet |
| 5 | Fruity Merge 3D: Match Puzzle | `com.fruitmatchfun` | Game / Puzzle (memori mencocokkan kartu buah) | https://play.google.com/store/apps/details?id=com.fruitmatchfun |

**Kelima aplikasi di atas wajib tampil** di grid landing page, di `/apps/[slug]`, di sitemap, dan di JSON-LD. Lihat checklist di bagian 6.1.

Catatan: rating, jumlah unduhan, dan deskripsi singkat diisi manual di file data (lihat bagian 6). Daftar ini bisa bertambah, jadi seluruh konten aplikasi dibuat **data-driven**.

## 3. Tech Stack

| Kebutuhan | Pilihan |
|-----------|---------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Ikon | `lucide-react` |
| 3D | `three` + `@react-three/fiber` + `@react-three/drei` |
| Animasi UI | `framer-motion` (opsional, untuk reveal on scroll) |
| Font | Poppins (via `next/font/google`) atau Space Grotesk untuk heading |
| Hosting | GitHub Pages (static export) |
| CI/CD | GitHub Actions |

Instalasi:

```bash
npx create-next-app@latest dluckyx-site --typescript --tailwind --app --eslint
cd dluckyx-site
npm i three @react-three/fiber @react-three/drei lucide-react framer-motion
npm i -D @types/three
```

## 4. Konsep Desain

**Tema:** dark, playful-futuristik, seperti "game studio". Latar gelap dengan gradient neon (ungu → cyan → pink), glassmorphism pada kartu, dan elemen 3D melayang.

**Palet warna (token CSS):**

```css
:root {
  --bg: #07070f;
  --surface: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.12);
  --text: #f4f4ff;
  --muted: #9a9ab8;
  --primary: #8b5cf6;   /* ungu */
  --secondary: #22d3ee; /* cyan */
  --accent: #f472b6;    /* pink */
}
```

**Prinsip:**
- Mobile-first (mayoritas pengunjung datang dari HP).
- Efek 3D hanya sebagai hiasan, bukan penghalang konten.
- Kontras teks baik, animasi menghormati `prefers-reduced-motion`.

## 5. Struktur Halaman

```
/                      Landing page (semua section)
/apps/[slug]           Halaman detail tiap aplikasi (static, dari data)
/privacy               Privacy Policy umum
/privacy/[slug]        (opsional) Privacy policy per aplikasi
/contact               Kontak
/404                   Halaman not found bertema
```

### Section Landing Page

1. **Navbar** — logo D Lucky X, menu (Apps, About, Contact), tombol "Google Play" (ikon `Play`). Sticky + blur.
2. **Hero** — headline besar, subjudul dari deskripsi developer, 2 CTA: "Lihat Game" (`Gamepad2`) dan "Buka di Google Play" (`ExternalLink`). Di sisi kanan/belakang: **scene Three.js** (lihat bagian 7).
3. **Stats strip** — jumlah aplikasi, total unduhan, rating rata-rata (ikon `Download`, `Star`, `Smartphone`).
4. **Showcase aplikasi** — grid kartu aplikasi dengan efek tilt 3D saat hover. Filter kategori (Semua / Game / Edukasi).
5. **Featured app** — satu aplikasi unggulan dengan galeri screenshot (carousel) dan tombol Install.
6. **Tentang developer** — cerita singkat + nilai (`Sparkles`, `Brain`, `Heart`, `Shield`).
7. **Kenapa aplikasi kami** — 3–4 poin (ringan, aman untuk anak, offline-friendly, dll.) sesuai kondisi sebenarnya.
8. **CTA akhir** — ajakan unduh + link ke halaman developer Play Store.
9. **Footer** — link Privacy, Contact, ikon sosial (`Mail`, `Youtube`, `Github`), hak cipta.

## 6. Model Data (Data-Driven)

Buat `src/data/apps.ts`:

```ts
export type AppItem = {
  slug: string;
  name: string;
  packageId: string;
  tagline: string;
  description: string;
  category: "game" | "education" | "tool";
  tags: string[];
  icon: string;          // /images/apps/<slug>/icon.webp
  screenshots: string[]; // /images/apps/<slug>/ss-1.webp ...
  rating?: number;
  downloads?: string;    // "500+"
  contentRating?: string; // "3+"
  hasAds?: boolean;
  playUrl: string;
  color: string;         // warna aksen kartu, mis. "#22d3ee"
};

export const developer = {
  name: "D Lucky X",
  tagline:
    "Independent game developer building fun games and useful Android apps for productivity, learning, and entertainment.",
  playStoreUrl:
    "https://play.google.com/store/apps/dev?id=5090788794635737630",
  email: "isi-email-anda@domain.com",
};

export const apps: AppItem[] = [
  {
    slug: "stickman-penalty-rush",
    name: "Stickman Penalty Rush",
    packageId: "com.stickmanpenaltyrush.game",
    tagline: "Adu penalti sepak bola seru ala stickman!",
    description:
      "Game adu penalti dengan karakter stickman. Bidik, tendang, dan kalahkan kiper lawan. (Sesuaikan dengan deskripsi resmi di Play Store.)",
    category: "game",
    tags: ["Sepak Bola", "Penalti", "Stickman", "Arcade"],
    icon: "/images/apps/stickman-penalty-rush/icon.webp",
    screenshots: [], // isi dengan screenshot GAMEPLAY asli
    playUrl:
      "https://play.google.com/store/apps/details?id=com.stickmanpenaltyrush.game",
    color: "#22c55e",
  },
  {
    slug: "milo-cat-adventure",
    name: "Milo Cat Adventure",
    packageId: "com.miloadventure.game",
    tagline: "Petualangan Milo, kucing luar angkasa, melawan alien!",
    description:
      "Game platformer 2D aksi bertema kucing luar angkasa. Lompat, hindari rintangan, dan lawan alien. (Sesuaikan dengan deskripsi resmi di Play Store.)",
    category: "game",
    tags: ["Platformer", "Petualangan", "Kucing", "Alien"],
    icon: "/images/apps/milo-cat-adventure/icon.webp",
    screenshots: [],
    playUrl:
      "https://play.google.com/store/apps/details?id=com.miloadventure.game",
    color: "#f472b6",
  },
  {
    slug: "monster-math-train-brain",
    name: "Monster Math Train Brain",
    packageId: "com.monsteradventuremath",
    tagline: "Fun monster math game to learn & train brain!",
    description:
      "Game matematika seru bersama para monster untuk belajar dan melatih otak.",
    category: "education",
    tags: ["Matematika", "Latih Otak", "Anak"],
    icon: "/images/apps/monster-math-train-brain/icon.webp",
    screenshots: [],
    rating: 5.0,
    downloads: "500+",
    contentRating: "3+",
    hasAds: true,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.monsteradventuremath",
    color: "#8b5cf6",
  },
  {
    slug: "baby-shark-abc-kids-learning",
    name: "Baby Shark ABC: Kids Learning",
    packageId: "com.sharksmartalphabet",
    tagline: "Belajar alfabet ABC untuk anak dengan cara menyenangkan.",
    description:
      "Aplikasi edukasi anak untuk mengenal huruf alfabet. (Isi sesuai deskripsi resmi di Play Store.)",
    category: "education",
    tags: ["Alfabet", "ABC", "Anak", "Belajar"],
    icon: "/images/apps/baby-shark-abc-kids-learning/icon.webp",
    screenshots: [],
    rating: 5.0,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.sharksmartalphabet",
    color: "#22d3ee",
  },
  {
    slug: "fruity-merge-3d-match-puzzle",
    name: "Fruity Merge 3D: Match Puzzle",
    packageId: "com.fruitmatchfun",
    tagline: "Puzzle memori mencocokkan kartu buah.",
    description:
      "Game puzzle memori: temukan dan cocokkan pasangan kartu buah. (Sesuaikan dengan deskripsi resmi di Play Store.)",
    category: "game",
    tags: ["Puzzle", "Memori", "Buah", "Casual"],
    icon: "/images/apps/fruity-merge-3d-match-puzzle/icon.webp",
    screenshots: [],
    rating: 4.6,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.fruitmatchfun",
    color: "#f59e0b",
  },
];
```

### 6.1 Checklist "Semua Aplikasi Harus Ada"

- [ ] `apps.ts` berisi **5 entri**: stickman-penalty-rush, milo-cat-adventure, monster-math-train-brain, baby-shark-abc-kids-learning, fruity-merge-3d-match-puzzle
- [ ] Setiap entri punya `icon` di `public/images/apps/<slug>/icon.webp`
- [ ] `generateStaticParams` di `/apps/[slug]` membaca seluruh `apps` (jangan hardcode slug)
- [ ] Grid landing page me-render `apps.map(...)` tanpa `slice()` / limit
- [ ] Stats strip menghitung jumlah dari `apps.length`, bukan angka tetap
- [ ] `sitemap.ts` menghasilkan URL untuk semua slug
- [ ] Tambahkan **test build sederhana**: script yang gagal jika jumlah halaman `out/apps/*` tidak sama dengan `apps.length`
- [ ] Setiap kali merilis aplikasi baru di Play Store, cukup tambah satu objek di `apps.ts`, lalu push ke `main`

```ts
// scripts/check-apps.mjs — jalankan setelah build
import fs from "node:fs";
import { apps } from "../src/data/apps.ts"; // sesuaikan dengan setup TS Anda
const missing = apps.filter(
  (a) => !fs.existsSync(`out/apps/${a.slug}/index.html`)
);
if (missing.length) {
  console.error("Halaman aplikasi hilang:", missing.map((a) => a.slug));
  process.exit(1);
}
console.log(`OK: ${apps.length} aplikasi ter-generate.`);
```

**Penting — soal data Play Store:**
- Google Play **tidak punya API publik resmi** untuk data listing. Jangan scraping saat runtime di browser (kena CORS dan rawan rusak).
- Pendekatan terbaik: data diisi manual di `apps.ts`, atau dibuat script Node terpisah (jalankan lokal) yang menghasilkan file JSON, lalu di-commit.
- **Unduh ikon & screenshot sendiri** ke folder `public/images/apps/...` (konversi ke WebP). Jangan hotlink ke `play-lh.googleusercontent.com` karena URL bisa berubah dan memperlambat halaman.
- Perbarui angka rating/unduhan secara berkala (misal tiap rilis).

## 7. Spesifikasi Three.js

Semua komponen 3D wajib **client-only** dan dimuat dinamis agar tidak merusak static export dan Lighthouse score.

```tsx
// src/components/three/HeroScene.client.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { Float, Environment, Stars, OrbitControls } from "@react-three/drei";
// ...

// pemakaian di page:
import dynamic from "next/dynamic";
const HeroScene = dynamic(() => import("@/components/three/HeroScene.client"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});
```

### 7.1 Hero Scene
- Bintang/partikel latar (`Stars` dari drei) bergerak pelan.
- Beberapa objek geometri melayang (`Float`): bola, torus, icosahedron, kubus bersudut membulat, dengan material gradient/`MeshDistortMaterial` berwarna palet.
- Ikon aplikasi sebagai **plane bertekstur** yang mengorbit pelan di sekitar objek utama (tekstur dari `icon.webp`).
- Kamera bereaksi halus terhadap gerakan mouse/gyroscope (parallax). Di mobile cukup auto-rotate.
- Pencahayaan: `ambientLight` + 2 `pointLight` berwarna ungu & cyan, `Environment preset="city"` (atau tanpa HDR untuk menghemat ukuran).

### 7.2 Kartu Aplikasi (opsional 3D ringan)
- Efek **tilt** berbasis CSS/JS (mouse move → `rotateX/rotateY`), bukan canvas per kartu. Satu canvas per kartu terlalu berat.

### 7.3 Aturan Performa 3D
- Maksimal **satu `<Canvas>` aktif** di viewport pada satu waktu.
- `dpr={[1, 1.5]}` untuk membatasi pixel ratio.
- `frameloop="demand"` bila scene statis; `always` hanya untuk hero.
- Pause render saat tab tidak aktif / hero keluar dari viewport (`IntersectionObserver`).
- Deteksi perangkat lemah (`navigator.hardwareConcurrency <= 4` atau `prefers-reduced-motion`) → tampilkan **fallback gambar statis/gradient** tanpa Canvas.
- Hindari model GLTF besar; utamakan geometri prosedural. Bila pakai model, kompres (Draco/meshopt) < 500 KB.
- Dispose geometry/material saat unmount (drei umumnya sudah menangani).

## 8. Ikon Lucide

Gunakan `lucide-react` dengan ukuran konsisten (`size={20}` / `24`) dan `strokeWidth={1.75}`.

| Konteks | Ikon |
|---------|------|
| CTA Google Play | `Play`, `ExternalLink` |
| Kategori Game | `Gamepad2` |
| Edukasi | `GraduationCap`, `Brain`, `BookOpen` |
| Puzzle | `Puzzle` |
| Olahraga | `Trophy` |
| Unduhan | `Download` |
| Rating | `Star` |
| Aman anak | `ShieldCheck`, `Baby` |
| Iklan | `Megaphone` |
| Kontak | `Mail` |
| Navigasi mobile | `Menu`, `X` |
| Highlight | `Sparkles`, `Zap`, `Heart` |
| Sosial | `Youtube`, `Github` |

Bungkus dalam komponen `<Icon />` kecil bila perlu agar gaya seragam.

## 9. Komponen yang Dibuat

```
src/
├─ app/
│  ├─ layout.tsx              # font, metadata, JSON-LD
│  ├─ page.tsx                # landing
│  ├─ apps/[slug]/page.tsx    # detail (generateStaticParams)
│  ├─ privacy/page.tsx
│  ├─ contact/page.tsx
│  ├─ not-found.tsx
│  ├─ sitemap.ts
│  └─ robots.ts
├─ components/
│  ├─ layout/ Navbar.tsx, Footer.tsx
│  ├─ sections/ Hero.tsx, Stats.tsx, AppGrid.tsx, Featured.tsx, About.tsx, Cta.tsx
│  ├─ ui/ Button.tsx, GlassCard.tsx, Badge.tsx, TiltCard.tsx, Reveal.tsx
│  ├─ app/ AppCard.tsx, ScreenshotCarousel.tsx, PlayBadge.tsx
│  └─ three/ HeroScene.client.tsx, FloatingIcons.tsx, SceneFallback.tsx
├─ data/ apps.ts
└─ lib/ utils.ts, seo.ts
```

### Perilaku UI Penting
- **AppCard:** ikon besar, nama, tagline, badge (Game/Edukasi, `3+`, "Contains ads"), rating bintang, tombol "Install" → `playUrl` (target `_blank`, `rel="noopener noreferrer"`).
- **Detail aplikasi:** hero dengan ikon + tombol Play, carousel screenshot (swipe di mobile), deskripsi, info (kategori, rating konten, unduhan), aplikasi terkait.
- **Reveal on scroll:** fade + translate-y ringan, hanya sekali.
- **Navbar mobile:** drawer dengan ikon `Menu`/`X`.

## 10. Konfigurasi Static Export (GitHub Pages)

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // hasilkan folder /out
  images: { unoptimized: true }, // next/image optimizer tidak jalan di static hosting
  trailingSlash: true,       // aman untuk GitHub Pages
  // Pakai domain sendiri di root domain → TIDAK perlu basePath / assetPrefix.
};

export default nextConfig;
```

Catatan:
- Karena memakai **custom domain di root** (mis. `dluckyx.com`), jangan set `basePath`. Kalau nanti dipakai tanpa domain (`user.github.io/repo`), baru butuh `basePath: "/nama-repo"`.
- Semua halaman dinamis (`/apps/[slug]`) harus memakai `generateStaticParams` karena tidak ada server.
- Tidak boleh memakai Route Handler dinamis, middleware, atau server action.
- Buat file `public/.nojekyll` (kosong) agar folder `_next` tidak diabaikan Jekyll.

## 11. Deploy: GitHub Actions → GitHub Pages

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Langkah di GitHub:
1. Push proyek ke repository GitHub.
2. **Settings → Pages → Source: GitHub Actions**.
3. Push ke `main` → workflow berjalan → situs live.

(Periksa versi action terbaru di dokumentasi GitHub saat setup, karena versi bisa berubah.)

## 12. Domain Sendiri

1. Buat file `public/CNAME` berisi satu baris, domain Anda:
   ```
   dluckyx.com
   ```
   (ganti dengan domain asli).
2. **Settings → Pages → Custom domain** → isi domain → centang **Enforce HTTPS** setelah sertifikat siap.
3. Atur DNS di registrar:

   **Apex domain (`dluckyx.com`)** — record `A`:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   (opsional `AAAA` untuk IPv6 sesuai dokumentasi GitHub Pages)

   **Subdomain `www`** — record `CNAME` ke `USERNAME.github.io`.
4. Tunggu propagasi DNS (beberapa menit hingga 24 jam). Verifikasi alamat IP terbaru di dokumentasi resmi GitHub Pages sebelum mengatur.
5. Untuk keamanan, verifikasi domain di akun GitHub (Settings → Pages → Add a domain) agar tidak bisa di-takeover.

## 13. SEO & Metadata

- `metadata` per halaman: title, description, Open Graph, Twitter card (gambar OG 1200×630 dibuat sendiri).
- `sitemap.ts` & `robots.ts` (kompatibel static export dengan `export const dynamic = "force-static"`).
- **JSON-LD** `SoftwareApplication` / `VideoGame` per halaman aplikasi (name, operatingSystem: Android, applicationCategory, aggregateRating bila akurat, offers).
- Link ke halaman Play Store memakai `rel="noopener noreferrer"`.
- Judul halaman memuat kata kunci aplikasi, mis. "Monster Math Train Brain — Game Matematika Anak | D Lucky X".
- Tambahkan domain situs ke kolom "Website" di Play Console agar saling terhubung.
- Tambahkan Google Search Console dan verifikasi domain.

## 14. Aksesibilitas & Performa

- Target Lighthouse: Performance ≥ 90 (mobile), Accessibility ≥ 95, SEO 100.
- Semua gambar punya `alt`; tombol ikon punya `aria-label`.
- Hormati `prefers-reduced-motion` (matikan animasi 3D & reveal).
- Gambar WebP/AVIF, ukuran sesuai tampilan, `loading="lazy"` kecuali hero.
- Font via `next/font` (self-hosted, tanpa layout shift).
- Code-split Three.js (sudah lewat `dynamic`) supaya bundle awal ringan.

## 15. Kepatuhan & Konten

- Halaman **Privacy Policy** wajib ada dan URL-nya bisa dipakai di Play Console. Untuk aplikasi anak (Baby Shark ABC, Monster Math), pastikan kebijakan sesuai ketentuan Play Families.
- Tampilkan pernyataan "Contains ads" pada aplikasi yang berisi iklan.
- Gunakan badge "Get it on Google Play" resmi sesuai pedoman branding Google Play (jangan mengubah desainnya).
- Pastikan penamaan seperti "Baby Shark" tidak melanggar hak merek pihak lain — ini tanggung jawab Anda sebagai developer; sebaiknya dicek ulang agar aman di web maupun di Play Store.
- Hindari mengklaim angka (rating/unduhan) yang tidak sesuai dengan data sebenarnya.

## 16. Roadmap Pengerjaan

**Fase 1 — Fondasi**
- [ ] Inisialisasi proyek, Tailwind, font, token warna
- [ ] `apps.ts` terisi 5 aplikasi + aset ikon/screenshot lokal
- [ ] Navbar, Footer, komponen UI dasar

**Fase 2 — Landing Page**
- [ ] Hero + HeroScene (Three.js) + fallback
- [ ] Stats, AppGrid dengan filter, Featured, About, CTA

**Fase 3 — Halaman Detail & Legal**
- [ ] `/apps/[slug]` dengan carousel screenshot
- [ ] `/privacy`, `/contact`, 404

**Fase 4 — Deploy**
- [ ] Static export berjalan lokal (`npm run build` → cek folder `out`)
- [ ] GitHub Actions + Pages aktif
- [ ] `CNAME`, DNS, HTTPS

**Fase 5 — Poles**
- [ ] SEO, sitemap, JSON-LD, gambar OG
- [ ] Audit Lighthouse & aksesibilitas
- [ ] Uji di HP kelas menengah-bawah

## 17. Prompt Siap Pakai untuk AI Coding Agent

> Bangun website Next.js (App Router, TypeScript, Tailwind) sesuai dokumen `website-dlucky-x-playstore.md`. Gunakan `output: "export"`, `images.unoptimized`, `trailingSlash`. Tema dark neon (ungu/cyan/pink) dengan glassmorphism. Gunakan `lucide-react` untuk semua ikon dan `@react-three/fiber` + `@react-three/drei` untuk hero scene 3D yang dimuat dengan `dynamic(..., { ssr: false })`, lengkap dengan fallback untuk perangkat lemah dan `prefers-reduced-motion`. Seluruh konten aplikasi bersumber dari `src/data/apps.ts`. Buat halaman `/`, `/apps/[slug]`, `/privacy`, `/contact`, 404, sitemap, robots, serta workflow GitHub Actions untuk deploy ke GitHub Pages dan file `public/CNAME` untuk domain kustom. Pastikan responsif mobile-first dan Lighthouse mobile ≥ 90.

---

*Dokumen ini disusun berdasarkan data halaman developer D Lucky X di Google Play. Detail seperti rating, jumlah unduhan, dan deskripsi aplikasi perlu diverifikasi dan diperbarui secara manual sebelum rilis.*
