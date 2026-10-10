import fs from "fs";
import path from "path";
import sharp from "sharp";
import ts from "typescript";

const assetsDir = fs.existsSync("assets/blog-masters")
  ? "assets/blog-masters"
  : "/Users/dederpl/.gemini/antigravity/brain/d97026f0-0c1b-40a4-951f-66c97e0dfd19";
const blogDir = "public/images/blog";
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

// Master Visual Artworks
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

if (!fs.existsSync(masters.mlbb)) masters.mlbb = masters.ling;
if (!fs.existsSync(masters.genshin)) masters.genshin = masters.roblox;
if (!fs.existsSync(masters.battleroyale)) masters.battleroyale = masters.freefire;

const metaCache = {};
async function getMasterMeta(srcPath) {
  if (!metaCache[srcPath]) {
    metaCache[srcPath] = await sharp(srcPath).metadata();
  }
  return metaCache[srcPath];
}

function escapeXml(str) {
  if (!str) return "";
  const noEmoji = str.replace(/[\u{1F300}-\u{1F9FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F1E6}-\u{1F1FF}]/gu, "").trim();
  return noEmoji
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate clean cover with NO top badges, English headline and subtitle
 */
async function generateUniqueCoverImage({
  srcPath,
  destPath,
  index,
  title1,
  title2,
  subtitle,
  themeColor = "#10b981",
}) {
  const meta = await getMasterMeta(srcPath);
  const origW = meta.width;
  const origH = meta.height;

  // Framing variations (6 options)
  const cropMode = index % 6;
  let cropBox;

  switch (cropMode) {
    case 0: // Full panoramic centered (1.0x)
      cropBox = { left: 0, top: 0, width: origW, height: origH };
      break;
    case 1: // Focus Left / Hero (1.18x zoom)
      cropBox = {
        left: 0,
        top: Math.round(origH * 0.04),
        width: Math.round(origW * 0.85),
        height: Math.round(origH * 0.88),
      };
      break;
    case 2: // Focus Right / Environment (1.18x zoom)
      cropBox = {
        left: Math.round(origW * 0.15),
        top: Math.round(origH * 0.04),
        width: Math.round(origW * 0.85),
        height: Math.round(origH * 0.88),
      };
      break;
    case 3: // Tight Center Punch-in (1.28x zoom)
      cropBox = {
        left: Math.round(origW * 0.1),
        top: Math.round(origH * 0.08),
        width: Math.round(origW * 0.8),
        height: Math.round(origH * 0.82),
      };
      break;
    case 4: // Horizon Perspective (1.12x zoom)
      cropBox = {
        left: Math.round(origW * 0.05),
        top: 0,
        width: Math.round(origW * 0.9),
        height: Math.round(origH * 0.88),
      };
      break;
    case 5: // Low Angle Dramatic (1.15x zoom)
      cropBox = {
        left: Math.round(origW * 0.08),
        top: Math.round(origH * 0.1),
        width: Math.round(origW * 0.84),
        height: Math.round(origH * 0.85),
      };
      break;
  }

  // Color Mood variations (6 options)
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

  const inputBuffer = fs.readFileSync(srcPath);
  const bgBuffer = await sharp(inputBuffer)
    .extract(cropBox)
    .resize(width, height, { fit: "cover" })
    .modulate(modulateOpts)
    .toBuffer();

  const safeTitle1 = escapeXml(title1);
  const safeTitle2 = escapeXml(title2 || "");
  const safeSubtitle = escapeXml(subtitle);

  // Gradient: Top 50% is 100% transparent. Only bottom 30% has dark gradient for clean text readability.
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#050814" stop-opacity="0.0" />
        <stop offset="50%" stop-color="#050814" stop-opacity="0.0" />
        <stop offset="72%" stop-color="#050814" stop-opacity="0.65" />
        <stop offset="88%" stop-color="#050814" stop-opacity="0.88" />
        <stop offset="100%" stop-color="#050814" stop-opacity="0.96" />
      </linearGradient>
    </defs>
    
    <rect width="${width}" height="${height}" fill="url(#overlay)" />

    <!-- Bottom Typography Block in English (Clean top: NO top badges) -->
    <text x="50" y="${height - (safeTitle2 ? 130 : 90)}" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="42" letter-spacing="0.5">${safeTitle1}</text>
    ${safeTitle2 ? `<text x="50" y="${height - 82}" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="42" letter-spacing="0.5">${safeTitle2}</text>` : ""}
    <text x="50" y="${height - 40}" fill="#94a3b8" font-family="sans-serif" font-weight="bold" font-size="20">${safeSubtitle}</text>

    <!-- Bottom Accent Line -->
    <rect x="0" y="${height - 6}" width="${width}" height="6" fill="${themeColor}" />
  </svg>`;

  await sharp(bgBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .webp({ quality: 82, effort: 5 })
    .toFile(destPath);
}

// English topic dictionary & translation helper
function getEnglishCoverInfo(art, fileKey, index) {
  const activeMap = {
    "cara-edit-tanda-tangan-kompres-pdf-offline-android": {
      title1: "OFFLINE PDF EDITOR",
      title2: "EDIT, SIGN & COMPRESS",
      subtitle: "100% Private • No Internet Required • Android Guide",
      themeColor: "#14b8a6",
      master: "productivity",
    },
    "cara-menggabungkan-file-pdf-di-hp-tanpa-kuota-aman": {
      title1: "MERGE PDF OFFLINE",
      title2: "FAST & SECURE LOCAL COMBINE",
      subtitle: "Zero Cloud Upload • 100% Privacy • Fast Document Merge",
      themeColor: "#14b8a6",
      master: "stylus_paper",
    },
    "cara-kompres-pdf-menjadi-200kb-di-hp-tanpa-rusak-teks": {
      title1: "COMPRESS PDF TO 200KB",
      title2: "SHARP VECTOR OPTIMIZATION",
      subtitle: "Clear Text Quality • Reduce File Size 70% • Offline Privacy",
      themeColor: "#14b8a6",
      master: "productivity",
    },
    "cara-memberi-tanda-tangan-digital-pada-dokumen-kontrak-pdf-hp": {
      title1: "DIGITAL SIGNATURE GUIDE",
      title2: "SIGN PDF CONTRACTS ON MOBILE",
      subtitle: "Authentic Pen Feel • Legal Validity • 100% Private",
      themeColor: "#14b8a6",
      master: "stylus_paper",
    },
    "cara-mengisi-formulir-pdf-dan-menghitamkan-data-rahasia-nik": {
      title1: "FILL & REDACT PDF",
      title2: "BLACK OUT PRIVATE DATA SECURELY",
      subtitle: "Protect Personal Identity • Secure Local Redaction • Android",
      themeColor: "#14b8a6",
      master: "productivity",
    },
    "tips-menang-adu-penalti-game-sepak-bola-android": {
      title1: "PENALTY SHOOTOUT PRO TIPS",
      title2: "SCORE TOP-CORNER GOALS",
      subtitle: "Goalkeeper Timing • Swerve & Power • Arcade Shootout",
      themeColor: "#3b82f6",
      master: "eafc",
    },
    "cara-membaca-arah-gerak-kiper-dalam-game-adu-penalti": {
      title1: "READ GOALKEEPER MOVEMENT",
      title2: "CLUTCH PENALTY TIMING",
      subtitle: "Anticipate Saves • Mind Games • 60 FPS Response",
      themeColor: "#3b82f6",
      master: "eafc",
    },
    "rekomendasi-game-sepak-bola-offline-ringan-adu-penalti-terbaik": {
      title1: "OFFLINE PENALTY SOCCER",
      title2: "BEST ARCADE SOCCER GAMES",
      subtitle: "Lightweight 60 FPS • Play Anywhere • Tournament Mode",
      themeColor: "#3b82f6",
      master: "eafc",
    },
    "panduan-turnamen-world-cup-stickman-penalty-rush-raih-trofi": {
      title1: "STICKMAN PENALTY RUSH",
      title2: "WORLD CUP TOURNAMENT GUIDE",
      subtitle: "Win Championship Trophy • Shootout Masterclass • Offline Fun",
      themeColor: "#3b82f6",
      master: "eafc",
    },
    "trik-jadi-kiper-hebat-menepis-semua-tendangan-penalti-game-hp": {
      title1: "GOALKEEPER MASTERCLASS",
      title2: "HOW TO SAVE EVERY PENALTY",
      subtitle: "Reflex Drills • Dive Physics • Clean Sheet Blueprint",
      themeColor: "#3b82f6",
      master: "eafc",
    },
    "cara-mengatur-keuangan-pribadi-dengan-metode-budgeting-kucing-lucu": {
      title1: "CAT EXPENSE TRACKER",
      title2: "CUTE DAILY BUDGETING GUIDE",
      subtitle: "100% Offline Privacy • Expense Habits • Financial Peace",
      themeColor: "#f59e0b",
      master: "cat_money",
    },
    "cara-menerapkan-metode-anggaran-50-30-20-untuk-gaji-umr-dan-fresh-graduate": {
      title1: "50/30/20 BUDGET RULE",
      title2: "PROVEN FINANCIAL BLUEPRINT",
      subtitle: "Needs, Wants & Savings • Daily Tracking • Zero Debt",
      themeColor: "#f59e0b",
      master: "cat_money",
    },
    "bahaya-kebocoran-finansial-latte-factor-dan-cara-menghentikannya": {
      title1: "THE LATTE FACTOR",
      title2: "STOP MICRO FINANCIAL LEAKS",
      subtitle: "Daily Spending Audit • Save Millions • Offline Budgeting",
      themeColor: "#f59e0b",
      master: "cat_money",
    },
    "alasan-aplikasi-catat-keuangan-offline-lebih-aman-untuk-data-privasi-kamu": {
      title1: "OFFLINE BUDGET SECURITY",
      title2: "WHY LOCAL DATA PRIVACY WINS",
      subtitle: "Zero Cloud Risk • Bank-Grade Privacy • Encrypted Local Storage",
      themeColor: "#f59e0b",
      master: "cat_money",
    },
    "tips-membangun-dana-darurat-dan-pos-tabungan-impian-langkah-demi-langkah": {
      title1: "BUILD EMERGENCY FUND",
      title2: "STEP-BY-STEP SAVINGS BLUEPRINT",
      subtitle: "3-6 Months Cushion • Goal Tracking • Financial Discipline",
      themeColor: "#f59e0b",
      master: "cat_money",
    },
    "rahasia-menyelesaikan-level-sulit-game-platformer-milo-cat": {
      title1: "MILO CAT ADVENTURE",
      title2: "CONQUER HARD PLATFORM LEVELS",
      subtitle: "Precision Wall Jumps • Secret Stars • Speedrun Routes",
      themeColor: "#ec4899",
      master: "milo_cat",
    },
    "cara-mengumpulkan-semua-ikan-emas-dan-bintang-rahasia-milo-cat": {
      title1: "MILO CAT 100% GUIDE",
      title2: "ALL GOLD FISH & SECRET STARS",
      subtitle: "Hidden Collectibles • Level Maps • Completionist Guide",
      themeColor: "#ec4899",
      master: "milo_cat",
    },
    "rekomendasi-game-offline-petualangan-kucing-lucu-dan-menantang": {
      title1: "RETRO CAT PLATFORMER",
      title2: "BEST OFFLINE CAT ADVENTURE",
      subtitle: "Cute Pixel Graphics • Tight Controls • No WiFi Needed",
      themeColor: "#ec4899",
      master: "milo_cat",
    },
    "tips-mengalahkan-bos-monster-tiap-dunia-milo-cat-adventure": {
      title1: "MILO CAT BOSS GUIDE",
      title2: "DEFEAT ALL WORLD MONSTERS",
      subtitle: "Boss Attack Patterns • Dodge Timing • Victory Strategies",
      themeColor: "#ec4899",
      master: "milo_cat",
    },
    "trik-kuasai-manuver-wall-jump-dan-dash-untuk-speedrun-milo-cat": {
      title1: "MILO CAT SPEEDRUN",
      title2: "MASTER WALL JUMP & AIR DASH",
      subtitle: "Advanced Mechanics • Momentum Chaining • Record Times",
      themeColor: "#ec4899",
      master: "milo_cat",
    },
    "cara-meningkatkan-kecepatan-berhitung-cepat-dan-daya-ingat-anak": {
      title1: "MONSTER MATH TRAINING",
      title2: "BOOST SPEED MATH & MEMORY",
      subtitle: "Mental Arithmetic • Brain Stimulation • Fun Visual Learning",
      themeColor: "#8b5cf6",
      master: "monster_math",
    },
    "trik-berhitung-cepat-perkalian-dan-pembagian-tanpa-kertas-coretan": {
      title1: "FAST MENTAL MATH TRICKS",
      title2: "MULTIPLICATION & DIVISION",
      subtitle: "No Scratch Paper • Rapid Calculation • Cognitive Confidence",
      themeColor: "#8b5cf6",
      master: "monster_math",
    },
    "manfaat-latihan-otak-matematika-5-menit-sehari-untuk-daya-fokus": {
      title1: "5-MINUTE BRAIN TRAIN",
      title2: "DAILY MATH FOCUS WORKOUT",
      subtitle: "Cognitive Sharpness • Short Daily Drills • Lifelong Focus",
      themeColor: "#8b5cf6",
      master: "monster_math",
    },
    "panduan-orang-tua-mengatasi-anak-yang-takut-belajar-matematika": {
      title1: "OVERCOME MATH ANXIETY",
      title2: "PARENT GUIDE FOR CONFIDENT KIDS",
      subtitle: "Positive Encouragement • Gamified Learning • Stress-Free Math",
      themeColor: "#8b5cf6",
      master: "monster_math",
    },
    "strategi-meraih-skor-tertinggi-di-mode-survival-monster-math": {
      title1: "MONSTER MATH SURVIVAL",
      title2: "HOW TO SCORE HIGH IN MATH RUSH",
      subtitle: "Speed Chaining • Combo Multipliers • Endless Math Challenge",
      themeColor: "#8b5cf6",
      master: "monster_math",
    },
    "metode-phonics-terbaik-mengajar-anak-belajar-huruf-abc-dan-angka": {
      title1: "BABY SHARK ABC PHONICS",
      title2: "EARLY READING & ALPHABET",
      subtitle: "Letter Sound Recognition • Interactive Tracing • Toddler Learning",
      themeColor: "#06b6d4",
      master: "baby_shark",
    },
    "pentingnya-metode-phonics-untuk-anak-usia-dini-agar-cepat-bisa-membaca": {
      title1: "WHY PHONICS MATTERS",
      title2: "FAST TRACK EARLY READING SKILLS",
      subtitle: "Phonemic Awareness • Reading Foundation • Screen-Safe Education",
      themeColor: "#06b6d4",
      master: "baby_shark",
    },
    "rekomendasi-aplikasi-edukasi-anak-balita-yang-aman-tanpa-iklan-mengganggu": {
      title1: "SAFE TODDLER APPS",
      title2: "AD-FREE EARLY CHILDHOOD LEARNING",
      subtitle: "COPPA Compliant • Pure Educational Value • Offline Friendly",
      themeColor: "#06b6d4",
      master: "baby_shark",
    },
    "cara-melatih-motorik-halus-anak-lewat-fitur-tracing-menulis-huruf": {
      title1: "FINE MOTOR TRACING",
      title2: "LETTER TRACING & HANDWRITING",
      subtitle: "Finger Dexterity • Alphabet Shapes • Early Preschool Skills",
      themeColor: "#06b6d4",
      master: "baby_shark",
    },
    "tips-mendampingi-screen-time-positif-anak-usia-2-sampai-5-tahun": {
      title1: "POSITIVE SCREEN TIME",
      title2: "PARENT GUIDE FOR AGES 2 TO 5",
      subtitle: "Balanced Daily Limits • Active Co-Viewing • Healthy Habits",
      themeColor: "#06b6d4",
      master: "baby_shark",
    },
    "trik-meraih-skor-tinggi-game-merge-semangka-3d": {
      title1: "FRUITY MERGE 3D",
      title2: "GIANT WATERMELON HIGH SCORE",
      subtitle: "Physics Strategy • Box Stacking • Combo Chain Reactions",
      themeColor: "#10b981",
      master: "fruity_merge",
    },
    "panduan-urutan-evolusi-buah-di-fruity-merge-3d-dari-ceri-ke-semangka": {
      title1: "FRUIT EVOLUTION GUIDE",
      title2: "FROM CHERRY TO WATERMELON",
      subtitle: "Complete 11 Fruit Stages • Growth Hierarchy • Spatial Planning",
      themeColor: "#10b981",
      master: "fruity_merge",
    },
    "strategi-penataan-sudut-kotak-agar-buah-tidak-cepat-penuh-game-merge": {
      title1: "FRUIT BOX MANAGEMENT",
      title2: "CORNER STACKING BLUEPRINT",
      subtitle: "Avoid Overflow • Roll Direction Physics • Board Control",
      themeColor: "#10b981",
      master: "fruity_merge",
    },
    "rekomendasi-game-puzzle-santai-offline-penghilang-stres-di-hp": {
      title1: "RELAXING 3D PUZZLE",
      title2: "BEST OFFLINE STRESS-RELIEF GAMES",
      subtitle: "Soothing Sound Design • Tactile Feedback • No Internet Needed",
      themeColor: "#10b981",
      master: "fruity_merge",
    },
    "cara-menciptakan-reaksi-berantai-combo-merge-untuk-skor-berlipat-ganda": {
      title1: "CHAIN MERGE COMBOS",
      title2: "MULTIPLY YOUR PUZZLE SCORE",
      subtitle: "Cascade Reactions • Physics Bounces • High Score Mastery",
      themeColor: "#10b981",
      master: "fruity_merge",
    },
    "aksesoris-mobile-gaming-terbaik-2026-controller-cooler-finger-sleeves-earbuds": {
      title1: "MOBILE GAMING GEAR 2026",
      title2: "CONTROLLERS, COOLERS & EARBUDS",
      subtitle: "Tested Latency Benchmarks • Pro Accessories • Anti-Throttling",
      themeColor: "#f59e0b",
      master: "gear",
    },
    "tablet-edukasi-anak-stylus-pen-casing-tahan-banting-terbaik-2026": {
      title1: "KIDS LEARNING TABLETS",
      title2: "STYLUS PENS & RUGGED CASES",
      subtitle: "Drop-Proof EVA Foam • Kid-Safe Hardware • Verified Reviews",
      themeColor: "#8b5cf6",
      master: "kidstech",
    },
    "stylus-pen-presisi-pelindung-layar-tekstur-kertas-edit-pdf-android": {
      title1: "PRECISION DIGITAL STYLUS",
      title2: "PAPER-FEEL SCREEN PROTECTORS",
      subtitle: "Authentic Writing Drag • Android PDF Work • Tested Hardware",
      themeColor: "#14b8a6",
      master: "stylus_paper",
    },
    "mobile-legends-build-ling-tersakit-2026-item-full-burst-rotasi-cepat-solo-r": {
      title1: "MLBB LING PRO GUIDE",
      title2: "FULL BURST BUILD & ROTATION",
      subtitle: "Assassin Emblem • Wall Mechanics • Solo Mythic Meta 2026",
      themeColor: "#f59e0b",
      master: "mlbb",
    },
    "mlbb-build-ling-tersakit-rotasi-meta-solo-rank-2026-hari-ke-1": {
      title1: "MLBB LING PRO GUIDE",
      title2: "FULL BURST BUILD & ROTATION",
      subtitle: "Assassin Emblem • Wall Mechanics • Solo Mythic Meta 2026",
      themeColor: "#f59e0b",
      master: "mlbb",
    },
  };

  if (activeMap[art.slug]) {
    return activeMap[art.slug];
  }

  // Handle queue slots
  switch (fileKey) {
    case "mlbb-queue.ts": {
      const heroMatch = art.title.match(/Build\s+([\w\s&]+?)\s+Tersakit/i);
      const hero = heroMatch ? heroMatch[1].trim() : "Hero";
      return {
        title1: `MLBB ${hero.toUpperCase()} PRO GUIDE`,
        title2: "BEST BUILD & FAST ROTATION",
        subtitle: "Assassin Emblem • Skill Combos • Solo Mythic Meta 2026",
        themeColor: "#f59e0b",
        master: "mlbb",
      };
    }

    case "freefire-queue.ts": {
      const subMatch = art.title.match(/Trik\s+([^(]+)/i);
      let sub = subMatch ? subMatch[1].trim() : "All Android Devices";
      sub = sub
        .replace("Semua HP Android", "ALL ANDROID PHONES")
        .replace("Karakter ", "")
        .replace("Senjata ", "")
        .replace("Pola Lari ", "SPRINT PATTERN ")
        .replace("Trik Tembak Kepala", "HEADSHOT TECHNIQUE");
      return {
        title1: "FREE FIRE AUTO HEADSHOT",
        title2: `${sub.toUpperCase().slice(0, 32)}`,
        subtitle: "Pro Sensitivity Settings • Custom HUD • Booyah Tactics 2026",
        themeColor: "#f97316",
        master: "freefire",
      };
    }

    case "roblox-queue.ts": {
      const robloxMatch = art.title.match(/Panduan Lengkap\s+([^:]+)/i);
      let topic = robloxMatch ? robloxMatch[1].trim() : "Blox Fruits & Games";
      topic = topic
        .replace("Kode Redeem ", "REDEEM CODES ")
        .replace("Tier List ", "TIER LIST ")
        .replace("Panduan ", "GUIDE ")
        .replace("Cara Dapatkan ", "HOW TO GET ")
        .replace("Tips Farming ", "FAST FARMING ");
      return {
        title1: "ROBLOX PRO MASTERCLASS",
        title2: `${topic.toUpperCase().slice(0, 32)}`,
        subtitle: "Secret Codes • Leveling Blueprint • Pro Gameplay 2026",
        themeColor: "#10b981",
        master: "roblox",
      };
    }

    case "minecraft-queue.ts": {
      const mcMatch = art.title.match(/Trik\s+([^(]+)/i);
      let mcTopic = mcMatch ? mcMatch[1].trim() : "Survival & Redstone";
      mcTopic = mcTopic
        .replace("Seed Desa Berdampingan Mansion", "VILLAGE & WOODLAND MANSION")
        .replace("Seed Survival Island Ekstrem", "SURVIVAL ISLAND HARDCORE SEED")
        .replace("Farm Iron Golem Otomatis", "AUTOMATIC IRON GOLEM FARM")
        .replace("Farm Mob XP 5 Menit", "MOB XP FARM 30 LEVELS")
        .replace("Ancient Debris Netherite", "NETHERITE MINING BLUEPRINT")
        .replace("Kalahkan Ender Dragon", "DEFEAT THE ENDER DRAGON")
        .replace("End City Elytra", "END CITY ELYTRA HUNT")
        .replace("Desain Rumah Kayu", "AESTHETIC WOODEN HOUSE")
        .replace("Dekorasi Interior Modern", "MODERN INTERIOR DECORATION")
        .replace("Shaders Minecraft PE", "ULTRA LIGHT SHADERS 60 FPS")
        .replace("Pintu Rahasia 2x2", "SECRET 2x2 PISTON DOOR")
        .replace("Brewing Stand Resep", "ALL POTION BREWING RECIPES")
        .replace("Villager Trading Hall", "VILLAGER TRADING HALL")
        .replace("Ancient City Warden", "WARDEN ANCIENT CITY SURVIVAL")
        .replace("Trial Chambers", "TRIAL CHAMBERS BREEZE FIGHT");
      return {
        title1: "MINECRAFT SEED & SURVIVAL",
        title2: `${mcTopic.toUpperCase().slice(0, 32)}`,
        subtitle: "Survival Blueprint • Farm Mechanics • Bedrock & Java Edition",
        themeColor: "#22c55e",
        master: "minecraft",
      };
    }

    case "genshin-queue.ts": {
      const gMatch = art.title.match(/Trik\s+([^(]+)/i);
      let gTopic = gMatch ? gMatch[1].trim() : "Spiral Abyss & Endgame";
      gTopic = gTopic
        .replace("Spiral Abyss Lantai 12", "SPIRAL ABYSS FLOOR 12")
        .replace("Artefak Farming Efisien", "EFFICIENT ARTIFACT FARMING")
        .replace("Build ", "")
        .replace("Komposisi Tim", "TEAM COMPOSITION");
      return {
        title1: "GENSHIN & HONKAI META",
        title2: `${gTopic.toUpperCase().slice(0, 32)}`,
        subtitle: "Optimal Rotations • 1:2 Crit Ratio • Endgame Build 2026",
        themeColor: "#06b6d4",
        master: "genshin",
      };
    }

    case "eafc-queue.ts": {
      const fMatch = art.title.match(/Trik\s+([^(]+)/i);
      let fTopic = fMatch ? fMatch[1].trim() : "Tactics & Formations";
      fTopic = fTopic
        .replace("Formasi ", "FORMATION ")
        .replace("Trik Driven Ground Pass", "DRIVEN GROUND PASS")
        .replace("Finesse Shot Melengkung", "CURLED FINESSE SHOT")
        .replace("Jockey Defense", "JOCKEY DEFENSE TACTICS")
        .replace("Kiper Manual", "MANUAL GOALKEEPER SAVES");
      return {
        title1: "EA FC & EFOOTBALL TACTICS",
        title2: `${fTopic.toUpperCase().slice(0, 32)}`,
        subtitle: "Meta Formations • Defensive Jockeying • Pro Gameplay 2026",
        themeColor: "#3b82f6",
        master: "eafc",
      };
    }

    case "battleroyale-queue.ts": {
      const brMatch = art.title.match(/(?:Setting|Trik)\s+([^(]+)/i);
      let brTopic = brMatch ? brMatch[1].trim() : "Recoil Control & Tactics";
      brTopic = brTopic
        .replace("Setting Gyroscope Full 400%", "400% FULL GYROSCOPE")
        .replace("Sensitivitas ", "PRO SENSITIVITY ")
        .replace("Jiggle Movement", "JIGGLE CLOSE COMBAT");
      return {
        title1: "BATTLE ROYALE PRO GUIDE",
        title2: `${brTopic.toUpperCase().slice(0, 32)}`,
        subtitle: "400% Gyroscope • Recoil Control • Close Combat 2026",
        themeColor: "#ec4899",
        master: "battleroyale",
      };
    }

    case "gear-queue.ts": {
      const gearMatch = art.title.match(/(?:Setting|Trik|Panduan|Ulasan)\s+([^(]+)/i);
      let gearTopic = gearMatch ? gearMatch[1].trim() : "Gaming Gear Optimization";
      gearTopic = gearTopic
        .replace("Phone Cooler", "PHONE COOLER BENCHMARK")
        .replace("Finger Sleeves", "FINGER SLEEVES ACCURACY")
        .replace("Layar 120Hz", "120HZ REFRESH RATE SETUP");
      return {
        title1: "MOBILE GAMING HARDWARE",
        title2: `${gearTopic.toUpperCase().slice(0, 32)}`,
        subtitle: "Thermal Throttling • 120 FPS Setup • Tested Benchmarks 2026",
        themeColor: "#eab308",
        master: "gear",
      };
    }

    case "kidstech-queue.ts": {
      const kidsMasters = ["kidstech", "monster_math", "baby_shark"];
      const kidsMatch = art.title.match(/(?:Setting|Trik|Panduan|Pembahasan)\s+([^(]+)/i);
      let kidsTopic = kidsMatch ? kidsMatch[1].trim() : "Safe Kids Digital Learning";
      kidsTopic = kidsTopic
        .replace("Screen Time Sehat", "HEALTHY SCREEN TIME RULES")
        .replace("Casing Busa EVA", "RUGGED DROP-PROOF CASE")
        .replace("Family Link", "PARENTAL CONTROLS GUIDE");
      return {
        title1: "KIDS LEARNING & TECH GUIDE",
        title2: `${kidsTopic.toUpperCase().slice(0, 32)}`,
        subtitle: "Safe Screen Time • Educational Apps • Parent Guide 2026",
        themeColor: "#8b5cf6",
        master: kidsMasters[index % kidsMasters.length],
      };
    }

    case "productivity-queue.ts": {
      const prodMasters = ["productivity", "stylus_paper"];
      const prodMatch = art.title.match(/(?:Setting|Trik|Panduan|Ulasan)\s+([^(]+)/i);
      let prodTopic = prodMatch ? prodMatch[1].trim() : "Offline Digital Paperwork";
      prodTopic = prodTopic
        .replace("Privasi Dokumen", "100% OFFLINE PRIVACY")
        .replace("Tanda Tangan Stylus", "PRECISION STYLUS SIGNATURE")
        .replace("Kompresi PDF", "SHARP PDF COMPRESSION");
      return {
        title1: "OFFLINE DIGITAL PAPERWORK",
        title2: `${prodTopic.toUpperCase().slice(0, 32)}`,
        subtitle: "100% Local Privacy • Stylus Signature • PDF Workflow 2026",
        themeColor: "#14b8a6",
        master: prodMasters[index % prodMasters.length],
      };
    }

    default:
      return {
        title1: "PRO GAMING STRATEGY",
        title2: "TACTICAL MASTERCLASS",
        subtitle: "Comprehensive Pro Guide • Tested Tactics 2026",
        themeColor: "#10b981",
        master: "gear",
      };
  }
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
  console.log("=== PROCESSING 39 ACTIVE ARTICLES (CLEAN TOP, ENGLISH HEADLINES) ===");
  const dir = "src/data/articles";
  const files = [
    "published-gaming.ts",
    "amazon-buyer-guides.ts",
    "offline-pdf.ts",
    "stickman-penalty.ts",
    "kucing-atur-duit.ts",
    "milo-cat.ts",
    "monster-math.ts",
    "baby-shark.ts",
    "fruity-merge.ts",
  ];

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    const mod = loadTs(filePath);
    const articles = Object.values(mod).find((v) => Array.isArray(v)) || [];

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      const info = getEnglishCoverInfo(art, file, i);
      const srcPath = masters[info.master] || masters.gear;
      const destPath = path.join(blogDir, `${art.slug}.webp`);

      await generateUniqueCoverImage({
        srcPath,
        destPath,
        index: i,
        title1: info.title1,
        title2: info.title2,
        subtitle: info.subtitle,
        themeColor: info.themeColor,
      });

      console.log(`  - [Active] ${art.slug}.webp generated (${info.title1} | ${info.title2})`);
    }
  }
}

async function processQueueArticles() {
  console.log("\n=== PROCESSING 829 QUEUE ARTICLES (CLEAN TOP, ENGLISH HEADLINES) ===");
  const queueDir = "src/data/articles/queue";
  const queueFiles = [
    "mlbb-queue.ts",
    "freefire-queue.ts",
    "roblox-queue.ts",
    "minecraft-queue.ts",
    "genshin-queue.ts",
    "eafc-queue.ts",
    "battleroyale-queue.ts",
    "gear-queue.ts",
    "kidstech-queue.ts",
    "productivity-queue.ts",
  ];

  let totalQueue = 0;
  for (const file of queueFiles) {
    const filePath = path.join(queueDir, file);
    if (!fs.existsSync(filePath)) continue;

    const mod = loadTs(filePath);
    const articles = Object.values(mod).find((v) => Array.isArray(v)) || [];
    console.log(`Processing ${file} (${articles.length} articles)...`);

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      const info = getEnglishCoverInfo(art, file, i);
      const srcPath = masters[info.master] || masters.gear;
      const destPath = path.join(blogDir, `${art.slug}.webp`);

      await generateUniqueCoverImage({
        srcPath,
        destPath,
        index: i,
        title1: info.title1,
        title2: info.title2,
        subtitle: info.subtitle,
        themeColor: info.themeColor,
      });

      totalQueue++;
    }
  }

  console.log(`\n🎉 Processed ${totalQueue} queue images with clean top and English headlines!`);
}

async function main() {
  await processActiveArticles();
  await processQueueArticles();
  console.log("\n✨ ALL BLOG IMAGES GENERATED: NO TOP PILLS, 100% ENGLISH HEADLINES, VIBRANT VISUALS!");
}

main().catch(console.error);
