# D Lucky X Developer Showcase Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, dark-neon themed Next.js static portfolio website showcasing D Lucky X's 5 Google Play Android games and apps, complete with dynamic 3D Three.js hero scene, legal pages, SEO/JSON-LD, and GitHub Pages deployment workflow.

**Architecture:** Static export (`output: "export"`) with App Router and client-only dynamic Three.js rendering. All showcase data is centrally driven by `src/data/apps.ts`. Low-spec and mobile devices automatically fall back to lightweight CSS neon visuals.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Three.js (`@react-three/fiber`, `@react-three/drei`), Lucide React, Framer Motion.

**Spec:** [`docs/superpowers/specs/2026-10-08-dluckyx-site-design.md`](file:///Users/dederpl/Documents/ProjectExternal/dluckyx/docs/superpowers/specs/2026-10-08-dluckyx-site-design.md)

## Global Constraints
- `next.config.ts` must specify `output: "export"`, `images: { unoptimized: true }`, and `trailingSlash: true`.
- Zero runtime server APIs or dynamic server routes (all routes must resolve statically via `generateStaticParams`).
- Exactly 5 games must be rendered in data, grid, detail routes, and sitemap: `stickman-penalty-rush`, `milo-cat-adventure`, `monster-math-train-brain`, `baby-shark-abc-kids-learning`, `fruity-merge-3d-match-puzzle`.
- Three.js Canvas must only load client-side with dynamic import (`ssr: false`) and clamp DPR to `[1, 1.5]`.
- Must include `public/.nojekyll` and `public/CNAME` with `dluckyx.com`.

## Review Focus
1. Static export generation must yield all 5 app detail pages in `out/apps/<slug>/index.html`.
2. Three.js canvas must not cause hydration mismatch or crash on devices without WebGL.
3. Mobile navbar must toggle cleanly without layout shift or viewport overflow.
4. Privacy policy must explicitly address children's privacy and Google Play Families policy.
5. All external links to Google Play must include `target="_blank"` and `rel="noopener noreferrer"`.

---

### Task 1: Scaffolding, Configuration & Dependencies Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `public/.nojekyll`
- Create: `public/CNAME`
- Create: `src/app/globals.css`

**Interfaces:**
- Produces: Base Next.js App Router environment with Tailwind CSS dark-neon theme tokens.

- [ ] **Step 1: Create package.json and configuration files**
  Setup `package.json` with scripts (`dev`, `build`, `start`, `lint`, `check-apps`), `next.config.ts` with static export configuration, `tailwind.config.ts` with dark-neon color palette (`#07070f`, purple `#8b5cf6`, cyan `#22d3ee`, pink `#f472b6`), and `public/.nojekyll` + `public/CNAME`.

- [ ] **Step 2: Install dependencies**
  Run `npm install` for `next`, `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge` and dev dependencies (`typescript`, `@types/three`, `@types/react`, `@types/react-dom`, `@types/node`, `tailwindcss`, `postcss`, `autoprefixer`).

- [ ] **Step 3: Create `src/app/globals.css`**
  Add Tailwind directives, CSS root variables for colors, smooth scroll, and glassmorphic utility classes.

- [ ] **Step 4: Verify build foundation**
  Run `npx next --version` and verify TypeScript compiles without configuration errors.

- [ ] **Step 5: Commit**
  ```bash
  git add package.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.mjs public/ src/app/globals.css
  git commit -m "chore: scaffold next.js project configuration and theme tokens"
  ```

---

### Task 2: Data Model, Asset Generation & Build Check Script

**Files:**
- Create: `src/data/apps.ts`
- Create: `scripts/generate-assets.mjs`
- Create: `scripts/check-apps.mjs`
- Create: `public/images/apps/<slug>/icon.webp` (for all 5 games)
- Create: `public/images/apps/<slug>/screenshot-*.webp` (for all 5 games)

**Interfaces:**
- Produces: `apps: AppItem[]` and `developer: DeveloperProfile` exported from `src/data/apps.ts`.
- Produces: CLI verification `node scripts/check-apps.mjs` exiting 0 when all 5 app pages exist in `out/apps/`.

- [ ] **Step 1: Create `src/data/apps.ts`**
  Define `AppItem` and `DeveloperProfile` types. Populate with exact data for the 5 games from the spec.

- [ ] **Step 2: Create `scripts/generate-assets.mjs`**
  Implement script generating clean, high-resolution themed SVG/WebP placeholder icons and mock screenshots for each game based on their unique accent colors and themes.

- [ ] **Step 3: Run asset generation script**
  Execute `node scripts/generate-assets.mjs` and verify all 5 folders in `public/images/apps/` contain required image files.

- [ ] **Step 4: Create `scripts/check-apps.mjs`**
  Implement the verification script that reads `apps.ts` and checks `out/apps/${slug}/index.html`.

- [ ] **Step 5: Commit**
  ```bash
  git add src/data/apps.ts scripts/ public/images/
  git commit -m "feat: add app data models, assets generator, and build check script"
  ```

---

### Task 3: Shared UI Utilities & Core Components

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/seo.ts`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/GlassCard.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/TiltCard.tsx`
- Create: `src/components/ui/Reveal.tsx`
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`

**Interfaces:**
- Produces: `cn()` helper, SEO schema generators (`generateSoftwareAppSchema`), reusable UI primitives (`GlassCard`, `TiltCard`, `Badge`, `Reveal`), and layout wrappers (`Navbar`, `Footer`).

- [ ] **Step 1: Create `src/lib/utils.ts` and `src/lib/seo.ts`**
  Add `cn()` using `clsx` and `tailwind-merge`. Add JSON-LD schema builder for `SoftwareApplication` / `VideoGame`.

- [ ] **Step 2: Create UI primitives**
  Implement `Button`, `GlassCard` (with glassmorphism blur and border glow), `Badge` (with color variants), `TiltCard` (using CSS 3D transform on mouse move), and `Reveal` (subtle Framer Motion entrance).

- [ ] **Step 3: Create `Navbar.tsx`**
  Implement sticky blur header with D Lucky X logo, navigation links (`Apps`, `About`, `Contact`), mobile hamburger drawer menu, and Google Play button with `Play` icon.

- [ ] **Step 4: Create `Footer.tsx`**
  Implement footer with brand tagline, quick links to `/privacy`, `/contact`, social icons (`Mail`, `Github`, `Youtube`), and Google Play developer link.

- [ ] **Step 5: Commit**
  ```bash
  git add src/lib/ src/components/ui/ src/components/layout/
  git commit -m "feat: add shared UI primitives, layout navbar, and footer"
  ```

---

### Task 4: Three.js 3D Hero Scene & Adaptive Fallback

**Files:**
- Create: `src/components/three/SceneFallback.tsx`
- Create: `src/components/three/HeroScene.client.tsx`
- Create: `src/components/sections/Hero.tsx`

**Interfaces:**
- Produces: `Hero` section combining headline typography, CTA action buttons, and dynamic client-side 3D scene with low-power fallback.

- [ ] **Step 1: Create `src/components/three/SceneFallback.tsx`**
  Implement pure CSS animated neon radial gradient orb with glowing floating rings as a lightweight fallback.

- [ ] **Step 2: Create `src/components/three/HeroScene.client.tsx`**
  Build R3F Canvas with:
  - `<Stars count={500} speed={0.5} fade />`
  - Floating procedurally styled neon Icosahedron and Torus geometries.
  - Orbiting app icon textured planes.
  - Hardware concurrency and reduced motion checks.
  - `IntersectionObserver` to pause rendering when hero scrolls out of view.
  - `dpr={[1, 1.5]}` clamp.

- [ ] **Step 3: Create `src/components/sections/Hero.tsx`**
  Compose the hero grid: left column features headline, subhead from developer tagline, "Lihat Game" (`Gamepad2`) button, and "Google Play" (`ExternalLink`) button; right column dynamically loads `HeroScene.client.tsx` with fallback.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/three/ src/components/sections/Hero.tsx
  git commit -m "feat: add 3D hero scene with three.js, r3f, and adaptive fallback"
  ```

---

### Task 5: Showcase Sections & Landing Page

**Files:**
- Create: `src/components/app/AppCard.tsx`
- Create: `src/components/app/ScreenshotCarousel.tsx`
- Create: `src/components/sections/Stats.tsx`
- Create: `src/components/sections/AppGrid.tsx`
- Create: `src/components/sections/Featured.tsx`
- Create: `src/components/sections/About.tsx`
- Create: `src/components/sections/WhyUs.tsx`
- Create: `src/components/sections/Cta.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/layout.tsx`

**Interfaces:**
- Produces: Complete landing page (`/`) integrating all sections and rendering all 5 games.

- [ ] **Step 1: Create `AppCard.tsx` and `ScreenshotCarousel.tsx`**
  - `AppCard`: displays app icon, name, tagline, badges (category, content rating, ads status), rating stars, "Detail" link to `/apps/[slug]`, and "Install" button to `playUrl`.
  - `ScreenshotCarousel`: touch-swipeable horizontal container with screenshot preview modal.

- [ ] **Step 2: Create showcase sections**
  - `Stats.tsx`: dynamic computation from `apps.length`, total downloads, and average rating.
  - `AppGrid.tsx`: category filter tabs (Semua, Game, Edukasi) mapping through `apps`.
  - `Featured.tsx`: spotlight on featured game with screenshot carousel and direct install button.
  - `About.tsx`: studio background and 4 value pillars (`Sparkles`, `Brain`, `Heart`, `Shield`).
  - `WhyUs.tsx`: 4 differentiator cards (ringan, ramah anak, offline-friendly, tanpa iklan mengganggu).
  - `Cta.tsx`: high-impact final banner linking to developer Google Play page.

- [ ] **Step 3: Create `src/app/layout.tsx` and `src/app/page.tsx`**
  Wire `Navbar`, `Hero`, `Stats`, `AppGrid`, `Featured`, `About`, `WhyUs`, `Cta`, and `Footer`. Set Google Fonts (Poppins / Space Grotesk) and global SEO metadata.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/app/ src/components/sections/ src/app/layout.tsx src/app/page.tsx
  git commit -m "feat: build full landing page with interactive showcase sections"
  ```

---

### Task 6: Static Subpages, Legal Compliance & SEO

**Files:**
- Create: `src/app/apps/[slug]/page.tsx`
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/privacy/[slug]/page.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Interfaces:**
- Produces: Static routes for `/apps/[slug]`, `/privacy`, `/privacy/[slug]`, `/contact`, `/404`, `sitemap.xml`, and `robots.txt`.

- [ ] **Step 1: Create `src/app/apps/[slug]/page.tsx`**
  Implement with `generateStaticParams()` returning all 5 slugs from `apps.ts`. Include hero banner, gameplay screenshots carousel, app metadata, full description, and related games grid. Embed JSON-LD `SoftwareApplication`.

- [ ] **Step 2: Create `src/app/privacy/page.tsx` and `src/app/privacy/[slug]/page.tsx`**
  Provide comprehensive Privacy Policy explicitly addressing COPPA, Google Play Families policy, data collection, ad services, and contact email. Per-app page adapts policy for individual titles.

- [ ] **Step 3: Create `src/app/contact/page.tsx` and `src/app/not-found.tsx`**
  - Contact page with developer details and interactive form.
  - Cyberpunk/game themed 404 page with return to home button.

- [ ] **Step 4: Create `sitemap.ts` and `robots.ts`**
  Export static sitemap containing all pages (`/`, `/privacy`, `/contact`, and all 5 `/apps/[slug]`). Export standard robots configuration.

- [ ] **Step 5: Commit**
  ```bash
  git add src/app/apps/ src/app/privacy/ src/app/contact/ src/app/not-found.tsx src/app/sitemap.ts src/app/robots.ts
  git commit -m "feat: add static detail pages, legal privacy policy, contact, and seo sitemap"
  ```

---

### Task 7: CI/CD Deployment Workflow & End-to-End Build Verification

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: GitHub Actions deployment workflow deploying `out/` to GitHub Pages.
- Verification: `npm run build` succeeds and `node scripts/check-apps.mjs` confirms all 5 apps were generated.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**
  Configure GitHub Actions workflow: on push to `main`, setup Node 22, run `npm ci`, run `npm run build`, and deploy `out/` via `actions/deploy-pages@v4`.

- [ ] **Step 2: Run production static build**
  Execute `npm run build`. Verify directory `out/` is generated with static HTML files.

- [ ] **Step 3: Run check-apps validation script**
  Execute `node scripts/check-apps.mjs`. Verify it reports `OK: 5 aplikasi ter-generate.` with exit code 0.

- [ ] **Step 4: Verify static assets & routes**
  Verify that `out/index.html`, `out/apps/*/index.html`, `out/privacy/index.html`, `out/contact/index.html`, `out/CNAME`, and `out/.nojekyll` exist.

- [ ] **Step 5: Commit**
  ```bash
  git add .github/workflows/deploy.yml
  git commit -m "ci: add github actions deployment workflow for github pages"
  ```
