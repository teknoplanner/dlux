# Subsistem Blog & Artikel SEO D Lucky X Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun subsistem blog & artikel SEO lengkap dengan 7 artikel spesifik untuk masing-masing aplikasi D Lucky X, meningkatkan traffic organik Google dan mengonversi pembaca menjadi pengguna aplikasi di Google Play Store.

**Architecture:** Data model terstruktur type-safe di `src/data/articles.ts`, komponen UI tipografi pembaca dengan kartu CTA konversi aplikasi dan bilingual summary, halaman `/blog` (hub) dan `/blog/[slug]` (reader), serta integrasi Google JSON-LD schema (Article, FAQPage, BreadcrumbList) dan auto-sitemap.

**Tech Stack:** Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, Lucide React, Google Schema.org JSON-LD.

**Spec:** `docs/superpowers/specs/2026-10-08-seo-blog-and-articles-design.md`

## Global Constraints

- 100% kompatibel dengan `output: "export"` Next.js (tidak menggunakan runtime server API atau database dinamis).
- Tidak menambahkan dependensi eksternal yang tidak diperlukan (menggunakan standar Tailwind, Lucide, dan TypeScript yang sudah ada).
- 7 artikel dibuat spesifik untuk 7 aplikasi di `apps.ts`, dengan judul berniat pencarian tinggi, metadata SEO lengkap, dan bilingual English summary.

## Review Focus

1. **Static Export Route Coverage:** Pastikan setiap slug artikel di-export sebagai file HTML mandiri (`out/blog/[slug]/index.html`).
2. **Broken Internal Links:** Pastikan setiap tombol Play Store, tautan detail aplikasi, dan tautan silang antar artikel mengarah ke URL yang valid.
3. **JSON-LD Schema Valid:** Pastikan skema `Article`, `FAQPage`, dan `BreadcrumbList` diformat valid tanpa nilai `undefined`.
4. **Mobile Responsive Reading:** Pastikan pengalaman membaca, Table of Contents, dan App CTA Banner responsif pada layar kecil/smartphone.
5. **Sitemap Synchronization:** Pastikan seluruh 7 artikel otomatis tercantum di `sitemap.xml`.

---

### Task 1: Data Model & Koleksi 7 Artikel SEO (`src/data/articles.ts`)

**Files:**
- Create: `src/data/articles.ts`

**Interfaces:**
- Produces: `ArticleItem`, `ArticleSection`, `articles: ArticleItem[]`, helper `getArticleBySlug(slug: string)`, `getArticlesByApp(appSlug: string)`

- [ ] **Step 1: Definisikan tipe dan struktur data `ArticleItem` dan `ArticleSection`**
- [ ] **Step 2: Tulis konten lengkap untuk 7 artikel SEO** (Offline PDF, Stickman Penalty, Milo Cat, Monster Math, Baby Shark, Fruit Match, Kucing Atur Duit), mencakup:
  - Judul SEO & meta deskripsi
  - Keywords & search intent
  - English Quick Summary
  - Multiple content sections dengan bullet points dan tipBox
  - Daftar FAQ relevan untuk setiap artikel
- [ ] **Step 3: Tambahkan fungsi helper pencarian artikel** (`getArticleBySlug`, `getArticlesByApp`)
- [ ] **Step 4: Commit**
```bash
git add src/data/articles.ts
git commit -m "feat(blog): add articles data model and 7 SEO articles"
```

---

### Task 2: Schema JSON-LD & SEO Helpers (`src/lib/seo.ts`)

**Files:**
- Modify: `src/lib/seo.ts`

**Interfaces:**
- Consumes: `ArticleItem` from `src/data/articles.ts`, `AppItem` from `src/data/apps.ts`
- Produces: `generateArticleSchema(article: ArticleItem, app?: AppItem)`, `generateFaqSchema(faq: { q: string; a: string }[])`, `generateBreadcrumbSchema(items: { name: string; url: string }[])`

- [ ] **Step 1: Tambahkan fungsi generator schema Article/BlogPosting**
- [ ] **Step 2: Tambahkan fungsi generator schema FAQPage**
- [ ] **Step 3: Tambahkan fungsi generator schema BreadcrumbList**
- [ ] **Step 4: Commit**
```bash
git add src/lib/seo.ts
git commit -m "feat(seo): add article, FAQ, and breadcrumb JSON-LD schema generators"
```

---

### Task 3: Komponen UI Blog & Pembaca (`src/components/blog/*`)

**Files:**
- Create: `src/components/blog/ArticleCard.tsx`
- Create: `src/components/blog/AppCtaBanner.tsx`
- Create: `src/components/blog/TableOfContents.tsx`

**Interfaces:**
- Consumes: `ArticleItem`, `AppItem`
- Produces: `ArticleCard`, `AppCtaBanner`, `TableOfContents`

- [ ] **Step 1: Buat `ArticleCard.tsx`** untuk menampilkan cuplikan artikel di hub blog dan halaman aplikasi (dengan cover visual, badge kategori, read time, dan judul)
- [ ] **Step 2: Buat `AppCtaBanner.tsx`** untuk widget konversi aplikasi (menampilkan icon, rating 5.0, tagline, tombol Play Store & detail app)
- [ ] **Step 3: Buat `TableOfContents.tsx`** untuk daftar navigasi subjudul yang interaktif
- [ ] **Step 4: Commit**
```bash
git add src/components/blog/
git commit -m "feat(blog): add ArticleCard, AppCtaBanner, and TableOfContents components"
```

---

### Task 4: Halaman Hub Blog (`src/app/blog/page.tsx`)

**Files:**
- Create: `src/app/blog/page.tsx`

**Interfaces:**
- Consumes: `articles` from `src/data/articles.ts`, `apps` from `src/data/apps.ts`, `ArticleCard`

- [ ] **Step 1: Implementasi layout Hub Blog dengan Hero Banner dan filter kategori**
- [ ] **Step 2: Render grid artikel menggunakan `ArticleCard`**
- [ ] **Step 3: Tambahkan metadata SEO lengkap untuk halaman `/blog`**
- [ ] **Step 4: Commit**
```bash
git add src/app/blog/page.tsx
git commit -m "feat(blog): implement blog hub page at /blog"
```

---

### Task 5: Halaman Baca Artikel (`src/app/blog/[slug]/page.tsx`)

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `articles`, `apps`, `generateStaticParams`, `generateMetadata`, schema helpers, `AppCtaBanner`, `TableOfContents`, `ArticleCard`

- [ ] **Step 1: Implementasi `generateStaticParams`** untuk menghasilkan rute statis 7 artikel
- [ ] **Step 2: Implementasi `generateMetadata`** dengan dynamic OpenGraph dan Twitter tags
- [ ] **Step 3: Render tampilan baca artikel lengkap**:
  - Breadcrumbs navigasi
  - English Quick Summary Banner
  - Layout artikel dengan Table of Contents di sidebar
  - Section heading, paragraf, bullet list, dan Tips Callout box
  - Mid-article & end-article `AppCtaBanner`
  - Seksi FAQ Accordion
  - JSON-LD script tag injection
  - Rekomendasi artikel terkait
- [ ] **Step 4: Commit**
```bash
git add "src/app/blog/[slug]/page.tsx"
git commit -m "feat(blog): implement article reader page at /blog/[slug]"
```

---

### Task 6: Integrasi Navigasi & Interlinking

**Files:**
- Modify: `src/components/layout/Navbar.tsx` (tambah link Blog)
- Modify: `src/components/layout/Footer.tsx` (tambah link Blog)
- Modify: `src/app/apps/[slug]/page.tsx` (tambah seksi Panduan & Artikel Terkait)
- Modify: `src/app/sitemap.ts` (tambah route `/blog/` dan `/blog/[slug]/`)

- [ ] **Step 1: Tambahkan menu 'Blog' di `Navbar.tsx`** (desktop nav & mobile menu drawer)
- [ ] **Step 2: Tambahkan tautan 'Blog & Panduan' di `Footer.tsx`**
- [ ] **Step 3: Tambahkan seksi '📖 Panduan Terkait' di `src/app/apps/[slug]/page.tsx`**
- [ ] **Step 4: Daftarkan seluruh rute blog di `src/app/sitemap.ts`**
- [ ] **Step 5: Commit**
```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx "src/app/apps/[slug]/page.tsx" src/app/sitemap.ts
git commit -m "feat(blog): interlink blog in Navbar, Footer, App Details, and Sitemap"
```

---

### Task 7: Verifikasi Build & End-to-End Test

**Files:**
- Verify: Full static build & export check

- [ ] **Step 1: Jalankan `npm run build`** dan pastikan exit code 0
- [ ] **Step 2: Periksa folder `out/blog/` dan `out/blog/*/index.html`** memastikan seluruh 7 artikel ter-generate sempurna
- [ ] **Step 3: Periksa `out/sitemap.xml`** memastikan seluruh 7 rute artikel tercantum
- [ ] **Step 4: Commit dan Push ke Git**
