import fs from "fs";
import path from "path";
import sharp from "sharp";
import ts from "typescript";

const assetsDir = fs.existsSync("assets/blog-masters")
  ? "assets/blog-masters"
  : "/Users/dederpl/.gemini/antigravity/brain/d97026f0-0c1b-40a4-951f-66c97e0dfd19";
const blogDir = "public/images/blog";
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

// Master AI Images (Source)
const masters = {
  mlbb: path.join(assetsDir, "mlbb_moba_battle_1791591723300.jpg"),
  freefire: path.join(assetsDir, "freefire_action_booyah_1791560949609.jpg"),
  roblox: path.join(assetsDir, "roblox_blox_fruits_1791560970566.jpg"),
  minecraft: path.join(assetsDir, "minecraft_castle_adventure_1791560992332.jpg"),
  genshin: path.join(assetsDir, "genshin_anime_fantasy_1791591746993.jpg"),
  eafc: path.join(assetsDir, "penalty_shootout_action_1791560644639.jpg"),
  battleroyale: path.join(assetsDir, "battleroyale_combat_1791591765815.jpg"),
  gear: path.join(assetsDir, "mobile_gaming_gear_1791560524124.jpg"),
  kidstech: path.join(assetsDir, "kids_learning_tablet_1791560571262.jpg"),
  productivity: path.join(assetsDir, "offline_pdf_security_1791560620494.jpg"),
  stylus_paper: path.join(assetsDir, "stylus_paper_screen_1791560596151.jpg"),
  cat_money: path.join(assetsDir, "cat_money_tracker_1791560665020.jpg"),
  milo_cat: path.join(assetsDir, "milo_cat_platformer_1791560691663.jpg"),
  monster_math: path.join(assetsDir, "monster_math_adventure_1791560716644.jpg"),
  baby_shark: path.join(assetsDir, "baby_shark_alphabet_1791560739677.jpg"),
  fruity_merge: path.join(assetsDir, "fruity_merge_watermelon_1791560761459.jpg"),
  ling: "public/images/blog/mobile-legends-build-ling-tersakit-2026-item-full-burst-rotasi-cepat-solo-r.webp",
};

// Fallback to existing masters if newly generated is not present
if (!fs.existsSync(masters.mlbb)) masters.mlbb = masters.ling;
if (!fs.existsSync(masters.genshin)) masters.genshin = masters.roblox;
if (!fs.existsSync(masters.battleroyale)) masters.battleroyale = masters.freefire;

// Cache metadata
const metaCache = {};
async function getMasterMeta(srcPath) {
  if (!metaCache[srcPath]) {
    metaCache[srcPath] = await sharp(srcPath).metadata();
  }
  return metaCache[srcPath];
}

function escapeXml(str) {
  if (!str) return "";
  // Strip emojis to prevent Pango font fallback crashes
  const noEmoji = str.replace(/[\u{1F300}-\u{1F9FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F1E6}-\u{1F1FF}]/gu, "").trim();
  return noEmoji
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitTitleLines(rawTitle, maxLen = 34) {
  let clean = rawTitle
    .replace(/\s*\(Hari ke-\d+\)/i, "")
    .replace(/\s*\(Update ke-\d+\)/i, "")
    .replace(/\s*\(Seri\s*#?\d+\)/i, "")
    .replace(/\s*\(Panduan 2026\s*#?\d+\)/i, "")
    .trim();

  const words = clean.split(/\s+/);
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length <= maxLen) {
      current = (current + " " + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
      if (lines.length === 2) break;
    }
  }
  if (current && lines.length < 2) lines.push(current);
  return lines;
}

/**
 * Generate a truly unique, magazine-grade cover image
 */
async function generateUniqueCoverImage({
  srcPath,
  destPath,
  index,
  title,
  subtitle,
  categoryBadge,
  dayBadge = "EDISI 2026",
  themeColor = "#10b981",
}) {
  const meta = await getMasterMeta(srcPath);
  const origW = meta.width;
  const origH = meta.height;

  // 1. Crop Variation (6 framing options)
  const cropMode = index % 6;
  let cropBox;

  switch (cropMode) {
    case 0: // Full panoramic centered (1.0x)
      cropBox = { left: 0, top: 0, width: origW, height: origH };
      break;
    case 1: // Focus Left / Main Hero (1.18x zoom)
      cropBox = {
        left: 0,
        top: Math.round(origH * 0.05),
        width: Math.round(origW * 0.85),
        height: Math.round(origH * 0.88),
      };
      break;
    case 2: // Focus Right / Action & Environment (1.18x zoom)
      cropBox = {
        left: Math.round(origW * 0.15),
        top: Math.round(origH * 0.05),
        width: Math.round(origW * 0.85),
        height: Math.round(origH * 0.88),
      };
      break;
    case 3: // Tight Center Punch-in (1.28x zoom)
      cropBox = {
        left: Math.round(origW * 0.1),
        top: Math.round(origH * 0.1),
        width: Math.round(origW * 0.8),
        height: Math.round(origH * 0.8),
      };
      break;
    case 4: // Elevated Perspective / Top Focus (1.12x zoom)
      cropBox = {
        left: Math.round(origW * 0.05),
        top: 0,
        width: Math.round(origW * 0.9),
        height: Math.round(origH * 0.88),
      };
      break;
    case 5: // Ground / Dramatic Low Angle (1.15x zoom)
      cropBox = {
        left: Math.round(origW * 0.08),
        top: Math.round(origH * 0.12),
        width: Math.round(origW * 0.84),
        height: Math.round(origH * 0.85),
      };
      break;
  }

  // 2. Color Mood / Grading Variation (6 mood options)
  const mood = (Math.floor(index / 2) + index) % 6;
  let modulateOpts = {};

  switch (mood) {
    case 0: // Natural Vibrant
      modulateOpts = { saturation: 1.12, brightness: 1.01 };
      break;
    case 1: // Golden Warm Hour
      modulateOpts = { saturation: 1.18, brightness: 1.02, hue: 10 };
      break;
    case 2: // Cool Twilight Cyber
      modulateOpts = { saturation: 1.15, brightness: 1.01, hue: -12 };
      break;
    case 3: // Neon High-Contrast Pop
      modulateOpts = { saturation: 1.22, brightness: 1.03 };
      break;
    case 4: // Deep Atmospheric Emerald
      modulateOpts = { saturation: 1.1, brightness: 0.99, hue: 16 };
      break;
    case 5: // Mystic Amethyst Twilight
      modulateOpts = { saturation: 1.14, brightness: 1.01, hue: -18 };
      break;
  }

  const width = 1200;
  const height = 675;

  // Render background buffer
  const inputBuffer = fs.readFileSync(srcPath);
  const bgBuffer = await sharp(inputBuffer)
    .extract(cropBox)
    .resize(width, height, { fit: "cover" })
    .modulate(modulateOpts)
    .toBuffer();

  // Prepare typography lines
  const lines = splitTitleLines(title);
  const line1 = escapeXml(lines[0] || title);
  const line2 = escapeXml(lines[1] || "");
  const safeSubtitle = escapeXml(subtitle || "Panduan Lengkap, Trik Taktis, & Strategi Juara 2026");
  const safeTag = escapeXml(categoryBadge);
  const safeDay = escapeXml(dayBadge);

  const badgeWidth = Math.max(260, Math.min(420, safeTag.length * 10 + 40));

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#050814" stop-opacity="0.82" />
        <stop offset="28%" stop-color="#050814" stop-opacity="0.22" />
        <stop offset="50%" stop-color="#050814" stop-opacity="0.22" />
        <stop offset="80%" stop-color="#050814" stop-opacity="0.86" />
        <stop offset="100%" stop-color="#050814" stop-opacity="0.96" />
      </linearGradient>
    </defs>
    
    <rect width="${width}" height="${height}" fill="url(#overlay)" />

    <!-- Top Left Category Badge -->
    <rect x="50" y="45" width="${badgeWidth}" height="42" rx="21" fill="#0f172a" fill-opacity="0.9" stroke="${themeColor}" stroke-width="2" />
    <text x="75" y="72" fill="${themeColor}" font-family="sans-serif" font-weight="bold" font-size="14" letter-spacing="2">${safeTag}</text>

    <!-- Top Right Day Badge -->
    <rect x="${width - 160}" y="45" width="110" height="42" rx="21" fill="#0f172a" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5" />
    <text x="${width - 105}" y="72" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle" letter-spacing="1.5">${safeDay}</text>

    <!-- Bottom Typography Block -->
    ${line1 ? `<text x="50" y="${height - (line2 ? 135 : 95)}" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="40" letter-spacing="0.5">${line1}</text>` : ""}
    ${line2 ? `<text x="50" y="${height - 88}" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="40" letter-spacing="0.5">${line2}</text>` : ""}
    <text x="50" y="${height - 45}" fill="#94a3b8" font-family="sans-serif" font-weight="bold" font-size="20">${safeSubtitle}</text>

    <!-- Bottom Accent Line -->
    <rect x="0" y="${height - 6}" width="${width}" height="6" fill="${themeColor}" />
  </svg>`;

  await sharp(bgBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .webp({ quality: 82, effort: 5 })
    .toFile(destPath);
}

function loadTs(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const m = { exports: {} };
  const fn = new Function("module", "exports", "require", result.outputText);
  fn(m, m.exports, () => ({}));
  return m.exports;
}

async function processActiveArticles() {
  console.log("=== PROCESSING 39 ACTIVE ARTICLES ===");
  const dir = "src/data/articles";

  const activeConfigs = {
    "published-gaming.ts": {
      masterKeys: ["mlbb"],
      themeColor: "#f59e0b",
      tag: "MOBILE LEGENDS • PRO META",
      subtitle: "Item Full Burst • Assassin Emblem • Solo Rank Mythic",
    },
    "amazon-buyer-guides.ts": {
      mapping: {
        "aksesoris-mobile-gaming-terbaik-2026-controller-cooler-finger-sleeves-earbuds": {
          master: "gear",
          themeColor: "#f59e0b",
          tag: "BUYER GUIDE • GAMING HARDWARE",
          subtitle: "Controller • Phone Cooler • Finger Sleeves • Low Latency TWS",
        },
        "tablet-edukasi-anak-stylus-pen-casing-tahan-banting-terbaik-2026": {
          master: "kidstech",
          themeColor: "#8b5cf6",
          tag: "BUYER GUIDE • KIDS HARDWARE",
          subtitle: "Tablet Edukasi • Casing Busa EVA • Stylus Ramah Anak",
        },
        "stylus-pen-presisi-pelindung-layar-tekstur-kertas-edit-pdf-android": {
          master: "stylus_paper",
          themeColor: "#14b8a6",
          tag: "BUYER GUIDE • DIGITAL PAPERLESS",
          subtitle: "Stylus Presisi • Screen Protector Paper Feel • Edit PDF",
        },
      },
    },
    "offline-pdf.ts": {
      masterKeys: ["productivity", "stylus_paper"],
      themeColor: "#14b8a6",
      tag: "OFFLINE PDF • SECURITY LAB",
      subtitle: "Privasi 100% • Tanda Tangan Digital • Kompresi Vektor",
    },
    "stickman-penalty.ts": {
      masterKeys: ["eafc"],
      themeColor: "#3b82f6",
      tag: "PENALTY SHOOTOUT • ARCADE",
      subtitle: "Akurasi Sudut Gawang • Trik Tepis Penalti • 60 FPS",
    },
    "kucing-atur-duit.ts": {
      masterKeys: ["cat_money"],
      themeColor: "#f59e0b",
      tag: "CAT EXPENSE TRACKER • BUDGET",
      subtitle: "Catat Keuangan Harian • Offline Privacy • Finansial Sehat",
    },
    "milo-cat.ts": {
      masterKeys: ["milo_cat"],
      themeColor: "#ec4899",
      tag: "MILO CAT • RETRO PLATFORMER",
      subtitle: "Petualangan Kucing Lucu • Rute Rahasia • Lompat Presisi",
    },
    "monster-math.ts": {
      masterKeys: ["monster_math"],
      themeColor: "#8b5cf6",
      tag: "MONSTER MATH • BRAIN TRAIN",
      subtitle: "Belajar Berhitung Seru • Stimulasi Kognitif • Bebas Iklan",
    },
    "baby-shark.ts": {
      masterKeys: ["baby_shark"],
      themeColor: "#06b6d4",
      tag: "BABY SHARK • EARLY LEARNING",
      subtitle: "Pengenalan Huruf & Angka • Motorik Balita • Interaktif",
    },
    "fruity-merge.ts": {
      masterKeys: ["fruity_merge"],
      themeColor: "#10b981",
      tag: "FRUITY MERGE 3D • WATERMELON",
      subtitle: "Fisika Buah 3D • Trik Semangka Raksasa • Puzzle Santai",
    },
  };

  for (const [file, conf] of Object.entries(activeConfigs)) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    const mod = loadTs(filePath);
    const articles = Object.values(mod).find((v) => Array.isArray(v)) || [];

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      let masterKey;
      let themeColor = conf.themeColor || "#10b981";
      let tag = conf.tag || "PRO EDITORIAL LAB";
      let subtitle = conf.subtitle || "Panduan Lengkap, Trik Taktis, & Strategi Juara 2026";

      if (conf.mapping && conf.mapping[art.slug]) {
        const itemConf = conf.mapping[art.slug];
        masterKey = itemConf.master;
        themeColor = itemConf.themeColor;
        tag = itemConf.tag;
        subtitle = itemConf.subtitle;
      } else {
        masterKey = conf.masterKeys[i % conf.masterKeys.length];
      }

      const srcPath = masters[masterKey];
      const destPath = path.join(blogDir, `${art.slug}.webp`);

      await generateUniqueCoverImage({
        srcPath,
        destPath,
        index: i,
        title: art.title,
        subtitle,
        categoryBadge: tag,
        dayBadge: `EDISI 2026`,
        themeColor,
      });

      console.log(`  - [Active] ${art.slug}.webp generated (from ${masterKey}, theme ${themeColor})`);
    }
  }
}

async function processQueueArticles() {
  console.log("\n=== PROCESSING 829 QUEUE ARTICLES (10 SLOTS) ===");
  const queueDir = "src/data/articles/queue";

  const slotConfigs = {
    "mlbb-queue.ts": {
      masterKeys: ["mlbb"],
      themeColor: "#f59e0b",
      tag: "MOBILE LEGENDS • META 2026",
      subtitle: "Item Build Tersakit • Assassin Emblem • Solo Rank Mythic",
    },
    "freefire-queue.ts": {
      masterKeys: ["freefire"],
      themeColor: "#f97316",
      tag: "FREE FIRE • AUTO HEADSHOT",
      subtitle: "Sensitivitas Layar Licin • Custom HUD • Drag Shot Booyah",
    },
    "roblox-queue.ts": {
      masterKeys: ["roblox"],
      themeColor: "#10b981",
      tag: "ROBLOX • PRO GUIDE 2026",
      subtitle: "Kode Redeem Rahasia • Quest Tercepat • Awakening Fruit",
    },
    "minecraft-queue.ts": {
      masterKeys: ["minecraft"],
      themeColor: "#22c55e",
      tag: "MINECRAFT • BEDROCK & JAVA",
      subtitle: "Redstone Blueprint • Farm Otomatis • Survival 60 FPS",
    },
    "genshin-queue.ts": {
      masterKeys: ["genshin"],
      themeColor: "#06b6d4",
      tag: "GENSHIN & HONKAI • TACTICS",
      subtitle: "Spiral Abyss Lantai 12 • Rasio Crit 1:2 • Rotasi Reaksi Elemen",
    },
    "eafc-queue.ts": {
      masterKeys: ["eafc"],
      themeColor: "#3b82f6",
      tag: "EA FC & eFOOTBALL • BLUEPRINT",
      subtitle: "Formasi Meta • Taktik Jockeying • Driven Ground Pass",
    },
    "battleroyale-queue.ts": {
      masterKeys: ["battleroyale"],
      themeColor: "#ec4899",
      tag: "BATTLE ROYALE • PRO SETTINGS",
      subtitle: "Gyroscope 400% • Jiggle Movement • Spray M416 Laser",
    },
    "gear-queue.ts": {
      masterKeys: ["gear"],
      themeColor: "#eab308",
      tag: "GAMING GEAR • TESTED LAB",
      subtitle: "Phone Cooler Aktif • Finger Sleeves • Layar 120 FPS",
    },
    "kidstech-queue.ts": {
      masterKeys: ["kidstech", "monster_math", "baby_shark"],
      themeColor: "#8b5cf6",
      tag: "KIDS TECH • PARENT GUIDE",
      subtitle: "Batas Layar Sehat • Casing Busa EVA • Pin Screen Aman",
    },
    "productivity-queue.ts": {
      masterKeys: ["productivity", "stylus_paper"],
      themeColor: "#14b8a6",
      tag: "PRODUCTIVITY • OFFLINE WORKFLOW",
      subtitle: "Privasi Dokumen 100% • Tanda Tangan Stylus • Kompresi PDF",
    },
  };

  let totalQueue = 0;
  for (const [file, conf] of Object.entries(slotConfigs)) {
    const filePath = path.join(queueDir, file);
    if (!fs.existsSync(filePath)) continue;

    const mod = loadTs(filePath);
    const articles = Object.values(mod).find((v) => Array.isArray(v)) || [];
    console.log(`Processing ${file} (${articles.length} articles)...`);

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      const masterKey = conf.masterKeys[i % conf.masterKeys.length];
      const srcPath = masters[masterKey];
      const destPath = path.join(blogDir, `${art.slug}.webp`);

      await generateUniqueCoverImage({
        srcPath,
        destPath,
        index: i,
        title: art.title,
        subtitle: conf.subtitle,
        categoryBadge: conf.tag,
        dayBadge: `DAY #${i + 2}`,
        themeColor: conf.themeColor,
      });

      totalQueue++;
    }
  }

  console.log(`\n🎉 Processed ${totalQueue} queue images! Every article has a unique visual magazine image!`);
}

async function main() {
  await processActiveArticles();
  await processQueueArticles();
  console.log("\n✨ ALL BLOG IMAGES GENERATED: 100% DISTINCT, UNIQUE HEADLINES, VIBRANT VISUALS!");
}

main().catch(console.error);
