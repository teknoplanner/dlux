# Technical Design Specification: D Lucky X Developer Showcase Website

## 1. Overview & Goals
The goal of this project is to build a responsive, modern, dark-neon themed game developer portfolio and showcase website for **D Lucky X**, an independent Android game & app studio.

The website serves as:
1. **App Showcase & Acquisition Funnel:** Directing visitors to install games on Google Play Store via clear CTAs.
2. **Official Studio Hub & Play Console Compliance:** Providing official Privacy Policy (including Play Families & COPPA child privacy compliance), Contact information, and developer credentials.
3. **Static & Fast Deployment:** 100% static export (`output: "export"`) ready for GitHub Pages hosting with custom root domain (`dluckyx.com`).
4. **Data-Driven Architecture:** Entire portfolio powered by `src/data/apps.ts` as the single source of truth, enabling easy future updates when new games are published.

---

## 2. Core Applications (Required 5 Apps)
The showcase must present all 5 current Google Play releases:
1. **Stickman Penalty Rush** (`com.stickmanpenaltyrush.game`): Sports/Action penalty shootout game (`#22c55e`).
2. **Milo Cat Adventure** (`com.miloadventure.game`): 2D retro space-cat platformer adventure (`#f472b6`).
3. **Monster Math Train Brain** (`com.monsteradventuremath`): Educational monster math and brain-training game (`#8b5cf6`).
4. **Baby Shark ABC: Kids Learning** (`com.sharksmartalphabet`): Early childhood alphabet educational game (`#22d3ee`).
5. **Fruity Merge 3D: Match Puzzle** (`com.fruitmatchfun`): Fruit memory & matching card puzzle (`#f59e0b`).

---

## 3. Tech Stack & Dependencies
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + custom neon dark tokens
- **Icons:** `lucide-react`
- **3D Graphics:** `three`, `@react-three/fiber`, `@react-three/drei` (client-only dynamic loading)
- **UI Animation:** `framer-motion` + CSS 3D transforms for tilt cards
- **Typography:** `next/font/google` (Poppins & Space Grotesk)
- **Deployment:** GitHub Pages static export (`output: 'export'`) + GitHub Actions workflow (`.github/workflows/deploy.yml`)

---

## 4. Design System & Theme Tokens
- **Background (`--bg`):** `#07070f`
- **Surface (`--surface`):** `rgba(255, 255, 255, 0.06)` with backdrop blur
- **Border (`--border`):** `rgba(255, 255, 255, 0.12)`
- **Text (`--text`):** `#f4f4ff`
- **Muted Text (`--muted`):** `#9a9ab8`
- **Primary Accent (`--primary`):** `#8b5cf6` (Neon Purple)
- **Secondary Accent (`--secondary`):** `#22d3ee` (Neon Cyan)
- **Highlight Accent (`--accent`):** `#f472b6` (Neon Pink)

---

## 5. Project Directory Structure
All code lives directly in the root workspace `./`:

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata, JSON-LD, navbar, footer)
│   │   ├── page.tsx                # Landing page aggregating all showcase sections
│   │   ├── apps/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # App detail page with generateStaticParams()
│   │   ├── privacy/
│   │   │   ├── page.tsx            # Comprehensive Privacy Policy
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Per-app privacy policy
│   │   ├── contact/
│   │   │   └── page.tsx            # Developer contact page
│   │   ├── not-found.tsx           # Futuristic 404 page
│   │   ├── sitemap.ts              # Static XML sitemap
│   │   └── robots.ts               # Robots.txt
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Sticky glass navbar with mobile drawer
│   │   │   └── Footer.tsx          # Studio footer with legal & social links
│   │   ├── sections/
│   │   │   ├── Hero.tsx            # Headline, CTAs, dynamic 3D hero scene
│   │   │   ├── Stats.tsx           # Dynamic metrics computed from apps data
│   │   │   ├── AppGrid.tsx         # Filterable showcase grid with tilt cards
│   │   │   ├── Featured.tsx        # Spotlight section for top game with gameplay carousel
│   │   │   ├── About.tsx           # Studio journey & core value pillars
│   │   │   ├── WhyUs.tsx           # Key developer differentiators (kid-safe, lightweight, offline)
│   │   │   └── Cta.tsx             # Final call-to-action banner to Google Play
│   │   ├── ui/
│   │   │   ├── TiltCard.tsx        # High-performance CSS 3D mouse tilt
│   │   │   ├── GlassCard.tsx       # Reusable glassmorphic container
│   │   │   ├── Badge.tsx           # App category, content rating, and ads indicator
│   │   │   └── Reveal.tsx          # Scroll reveal animator
│   │   ├── app/
│   │   │   ├── AppCard.tsx         # Standard showcase app card with Play Store link
│   │   │   └── ScreenshotCarousel.tsx # Gameplay screenshot carousel with mobile swipe
│   │   └── three/
│   │       ├── HeroScene.client.tsx # Three.js canvas (stars, neon geometries, orbiting icons)
│   │       └── SceneFallback.tsx   # Adaptive CSS fallback for low-end devices
│   ├── data/
│   │   └── apps.ts                 # Typed dataset for 5 games & developer profile
│   └── lib/
│       ├── utils.ts                # Tailwind merge and formatting helpers
│       └── seo.ts                  # Schema.org JSON-LD generators
├── public/
│   ├── .nojekyll                   # Ensures GitHub Pages serves _next assets
│   ├── CNAME                       # Domain file (dluckyx.com)
│   └── images/
│       └── apps/                   # Icon and screenshot WebP/SVG assets for 5 games
├── scripts/
│   ├── check-apps.mjs              # Post-build CI verification script
│   └── generate-assets.mjs         # Generates initial high-res themed WebP/SVG assets
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deploy to GitHub Pages
├── next.config.ts                  # Static export configuration
├── tailwind.config.ts              # Theme tokens & neon animations
└── tsconfig.json
```

---

## 6. Data Model (`src/data/apps.ts`)
```ts
export type AppItem = {
  slug: string;
  name: string;
  packageId: string;
  tagline: string;
  description: string;
  category: "game" | "education" | "tool";
  tags: string[];
  icon: string;
  screenshots: string[];
  rating?: number;
  downloads?: string;
  contentRating?: string;
  hasAds?: boolean;
  playUrl: string;
  color: string;
};

export type DeveloperProfile = {
  name: string;
  tagline: string;
  playStoreUrl: string;
  email: string;
};
```

---

## 7. Three.js Architecture & Performance Rules
1. **Client Dynamic Import:** `HeroScene.client.tsx` is loaded with `next/dynamic(() => ..., { ssr: false })`.
2. **Device Capability & Accessibility Detection:**
   - Detects `navigator.hardwareConcurrency <= 4` or `window.matchMedia('(prefers-reduced-motion: reduce)')`.
   - On match, replaces the Canvas with `SceneFallback.tsx` (CSS neon radial glow & floating particle animation).
3. **Viewport Pausing:** Utilizes `IntersectionObserver` on the hero container to halt rendering loops when scrolled out of view.
4. **Mobile DPR Capping:** Canvas DPR clamped to `[1, 1.5]`.
5. **No Per-Card Canvas:** Showcase cards use CSS 3D transforms (`rotateX`, `rotateY`, `perspective`) to preserve 60fps on mobile devices.

---

## 8. SEO, Static Export & Deployment
- `next.config.ts` configured with `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`.
- `generateStaticParams()` implemented for `/apps/[slug]` and `/privacy/[slug]`.
- Static sitemap (`sitemap.ts`) and `robots.ts` generated during build.
- Schema.org JSON-LD injected on `/` and `/apps/[slug]` (`SoftwareApplication` / `VideoGame`).
- Post-build check script `scripts/check-apps.mjs` verifies that all 5 app pages exist under `out/apps/` before deployment.
- GitHub Actions workflow (`.github/workflows/deploy.yml`) builds using Node 22 and deploys to GitHub Pages.

---

## 9. Verification & Quality Gates
1. `npm run build` generates clean output into `out/`.
2. `node scripts/check-apps.mjs` exits with code 0 confirming all 5 apps were statically built.
3. Responsive design tested across desktop, tablet, and mobile breakpoints.
4. Zero TypeScript errors and clean ESLint pass.
