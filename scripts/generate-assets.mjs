import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const apps = [
  {
    slug: "stickman-penalty-rush",
    name: "Stickman Penalty Rush",
    tagline: "Penalty Shootout Action",
    color1: "#15803d",
    color2: "#22c55e",
    accent: "#4ade80",
    symbol: "⚽",
    badge: "ACTION GAME",
  },
  {
    slug: "milo-cat-adventure",
    name: "Milo Cat Adventure",
    tagline: "Space Cat Platformer",
    color1: "#be185d",
    color2: "#f472b6",
    accent: "#fb7185",
    symbol: "🐱🚀",
    badge: "2D PLATFORMER",
  },
  {
    slug: "monster-math-train-brain",
    name: "Monster Math Train",
    tagline: "Brain Training & Math",
    color1: "#6d28d9",
    color2: "#8b5cf6",
    accent: "#c084fc",
    symbol: "👾➗",
    badge: "EDUCATION",
  },
  {
    slug: "baby-shark-abc-kids-learning",
    name: "Baby Shark ABC",
    tagline: "Kids Alphabet Learning",
    color1: "#0e7490",
    color2: "#22d3ee",
    accent: "#67e8f9",
    symbol: "🦈🔤",
    badge: "KIDS LEARNING",
  },
  {
    slug: "fruity-merge-3d-match-puzzle",
    name: "Fruity Merge 3D",
    tagline: "Match Puzzle & Memory",
    color1: "#b45309",
    color2: "#f59e0b",
    accent: "#fde047",
    symbol: "🍉🍇",
    badge: "PUZZLE 3D",
  },
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function generateAssets() {
  console.log("Generating themed WebP icons & screenshots for 5 apps...");

  for (const rawApp of apps) {
    const app = {
      ...rawApp,
      name: escapeXml(rawApp.name),
      tagline: escapeXml(rawApp.tagline),
      badge: escapeXml(rawApp.badge),
    };
    const dir = path.join(process.cwd(), "public", "images", "apps", app.slug);
    fs.mkdirSync(dir, { recursive: true });

    // 1. Icon (512x512)
    const iconSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${app.color1}" />
          <stop offset="100%" stop-color="${app.color2}" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity="0.5"/>
        </filter>
      </defs>
      <rect width="512" height="512" rx="110" fill="#0b0b18" />
      <rect x="24" y="24" width="464" height="464" rx="90" fill="url(#grad)" filter="url(#shadow)" />
      <circle cx="256" cy="220" r="140" fill="rgba(255,255,255,0.12)" />
      <text x="256" y="250" font-size="100" text-anchor="middle" font-family="sans-serif">${app.symbol}</text>
      <rect x="80" y="370" width="352" height="52" rx="26" fill="rgba(0,0,0,0.4)" />
      <text x="256" y="405" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif" letter-spacing="2">${app.badge}</text>
    </svg>
    `;

    await sharp(Buffer.from(iconSvg))
      .webp({ quality: 90 })
      .toFile(path.join(dir, "icon.webp"));

    // 2. Screenshot 1 (Gameplay Action)
    const ss1Svg = `
    <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ssGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a0a16" />
          <stop offset="50%" stop-color="${app.color1}" />
          <stop offset="100%" stop-color="#07070f" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#ssGrad1)" />
      <circle cx="950" cy="360" r="240" fill="${app.color2}" opacity="0.25" />
      <circle cx="300" cy="150" r="180" fill="${app.accent}" opacity="0.15" />
      
      <!-- Top HUD -->
      <rect x="60" y="40" width="1160" height="60" rx="15" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" />
      <text x="100" y="78" font-size="24" font-weight="bold" fill="#f4f4ff" font-family="sans-serif">SCORE: 12,450</text>
      <text x="640" y="78" font-size="22" font-weight="bold" fill="${app.accent}" font-family="sans-serif" text-anchor="middle">LEVEL 05 - ACTIVE</text>
      <text x="1180" y="78" font-size="24" font-weight="bold" fill="#facc15" font-family="sans-serif" text-anchor="end">⭐⭐⭐</text>
      
      <!-- Center Action Area -->
      <text x="640" y="320" font-size="120" text-anchor="middle" font-family="sans-serif">${app.symbol}</text>
      <text x="640" y="440" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">${app.name}</text>
      <text x="640" y="490" font-size="24" fill="${app.accent}" text-anchor="middle" font-family="sans-serif">${app.tagline}</text>
      
      <!-- Bottom Control Bar -->
      <rect x="240" y="580" width="800" height="70" rx="35" fill="rgba(0,0,0,0.5)" stroke="${app.color2}" stroke-width="2" />
      <text x="640" y="625" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif" letter-spacing="4">TAP TO PLAY NOW</text>
    </svg>
    `;

    await sharp(Buffer.from(ss1Svg))
      .webp({ quality: 90 })
      .toFile(path.join(dir, "screenshot-1.webp"));

    // 3. Screenshot 2 (Feature Highlights)
    const ss2Svg = `
    <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ssGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#07070f" />
          <stop offset="50%" stop-color="${app.color1}" />
          <stop offset="100%" stop-color="#14142b" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#ssGrad2)" />
      <text x="640" y="120" font-size="42" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">FITUR &amp; TANTANGAN UNIK</text>
      <text x="640" y="165" font-size="22" fill="${app.accent}" text-anchor="middle" font-family="sans-serif">${app.name} — Siap Dimainkan Kapan Saja</text>
      
      <g transform="translate(140, 240)">
        <rect width="300" height="340" rx="20" fill="rgba(255,255,255,0.06)" stroke="${app.color2}" stroke-width="1.5" />
        <text x="150" y="100" font-size="64" text-anchor="middle">⚡</text>
        <text x="150" y="170" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">Ringan &amp; Cepat</text>
        <text x="150" y="220" font-size="16" fill="#9a9ab8" text-anchor="middle" font-family="sans-serif">Ukuran kecil &amp; responsif</text>
      </g>
      <g transform="translate(490, 240)">
        <rect width="300" height="340" rx="20" fill="rgba(255,255,255,0.08)" stroke="${app.accent}" stroke-width="2" />
        <text x="150" y="100" font-size="64" text-anchor="middle">🎯</text>
        <text x="150" y="170" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">Mode Offline</text>
        <text x="150" y="220" font-size="16" fill="#9a9ab8" text-anchor="middle" font-family="sans-serif">Main tanpa internet</text>
      </g>
      <g transform="translate(840, 240)">
        <rect width="300" height="340" rx="20" fill="rgba(255,255,255,0.06)" stroke="${app.color2}" stroke-width="1.5" />
        <text x="150" y="100" font-size="64" text-anchor="middle">🏆</text>
        <text x="150" y="170" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">Prestasi &amp; Level</text>
        <text x="150" y="220" font-size="16" fill="#9a9ab8" text-anchor="middle" font-family="sans-serif">Ratusan tingkatan seru</text>
      </g>
    </svg>
    `;

    await sharp(Buffer.from(ss2Svg))
      .webp({ quality: 90 })
      .toFile(path.join(dir, "screenshot-2.webp"));

    // 4. Screenshot 3 (Victory & Rewards)
    const ss3Svg = `
    <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ssGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#07070f" />
          <stop offset="100%" stop-color="${app.color1}" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#ssGrad3)" />
      
      <!-- Victory Banner -->
      <rect x="290" y="120" width="700" height="480" rx="30" fill="rgba(11,11,24,0.85)" stroke="${app.accent}" stroke-width="2" />
      <text x="640" y="210" font-size="70" text-anchor="middle">👑</text>
      <text x="640" y="280" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">VICTORY!</text>
      <text x="640" y="330" font-size="24" fill="${app.accent}" text-anchor="middle" font-family="sans-serif">Tingkat Berhasil Diselesaikan</text>
      
      <text x="640" y="400" font-size="36" font-weight="bold" fill="#facc15" text-anchor="middle" font-family="sans-serif">⭐⭐⭐ 3 BINTANG</text>
      <text x="640" y="460" font-size="20" fill="#9a9ab8" text-anchor="middle" font-family="sans-serif">+500 Koin Emas Diraih</text>
      
      <rect x="440" y="500" width="400" height="60" rx="30" fill="${app.color2}" />
      <text x="640" y="540" font-size="22" font-weight="bold" fill="#000000" text-anchor="middle" font-family="sans-serif">LANJUTKAN LEVEL</text>
    </svg>
    `;

    await sharp(Buffer.from(ss3Svg))
      .webp({ quality: 90 })
      .toFile(path.join(dir, "screenshot-3.webp"));

    console.log(`✓ ${app.slug}: icon + 3 screenshots generated`);
  }

  console.log("All assets generated successfully!");
}

generateAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
