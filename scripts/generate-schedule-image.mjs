import fs from "fs";
import path from "path";
import sharp from "sharp";

const width = 1600;
const height = 1060;

const slots = [
  {
    num: "01",
    time: "06:30",
    name: "MOBILE LEGENDS (MLBB)",
    tag: "GAMING / META",
    desc: "Build Item Meta Terbaru, Kombo Skill &amp; Rotasi Hero Solo Rank",
    color: "#f59e0b",
    colorBg: "rgba(245, 158, 11, 0.12)",
    app: "Stickman Penalty Rush",
  },
  {
    num: "02",
    time: "08:15",
    name: "FREE FIRE (FF)",
    tag: "BATTLE ROYALE",
    desc: "Sensitivitas Auto Headshot, Setting DPI &amp; Rekomendasi Senjata",
    color: "#f97316",
    colorBg: "rgba(249, 115, 22, 0.12)",
    app: "Stickman Penalty Rush",
  },
  {
    num: "03",
    time: "10:00",
    name: "ROBLOX",
    tag: "SANDBOX / MULTIPLAYER",
    desc: "Blox Fruits, Kode Redeem Terbaru, Dress To Impress &amp; Leveling",
    color: "#10b981",
    colorBg: "rgba(16, 185, 129, 0.12)",
    app: "Fruity Merge 3D",
  },
  {
    num: "04",
    time: "11:45",
    name: "MINECRAFT",
    tag: "SURVIVAL / ADVENTURE",
    desc: "Seed Langka, Desain Redstone Otomatis &amp; Blueprint Bangunan",
    color: "#22c55e",
    colorBg: "rgba(34, 197, 94, 0.12)",
    app: "Milo Cat Adventure",
  },
  {
    num: "05",
    time: "13:30",
    name: "GENSHIN &amp; HONKAI",
    tag: "RPG / ANIME",
    desc: "Build Karakter S-Tier, Tim Spiral Abyss &amp; Rute Farming Primogems",
    color: "#06b6d4",
    colorBg: "rgba(6, 182, 212, 0.12)",
    app: "Stickman Penalty Rush",
  },
  {
    num: "06",
    time: "15:15",
    name: "EA FC &amp; eFOOTBALL",
    tag: "SPORTS / SIMULATION",
    desc: "Trik Adu Penalti Android, Formasi Terbaik &amp; Taktik Juara",
    color: "#3b82f6",
    colorBg: "rgba(59, 130, 246, 0.12)",
    app: "Stickman Penalty Rush",
  },
  {
    num: "07",
    time: "17:00",
    name: "BATTLE ROYALE &amp; ACTION",
    tag: "SHOOTER / FPS",
    desc: "PUBG Mobile, COD Mobile, Setting Gyroscope &amp; Zona Survival",
    color: "#ec4899",
    colorBg: "rgba(236, 72, 153, 0.12)",
    app: "Stickman Penalty Rush",
  },
  {
    num: "08",
    time: "18:45",
    name: "GAMING GEAR &amp; HARDWARE",
    tag: "HARDWARE / BENCHMARK",
    desc: "Phone Cooler, Controller, Finger Sleeves &amp; Setting 120 FPS",
    color: "#eab308",
    colorBg: "rgba(234, 179, 8, 0.12)",
    app: "Hardware Showcase",
  },
  {
    num: "09",
    time: "20:30",
    name: "KIDS TECH &amp; EDUKASI",
    tag: "PARENTING / LEARNING",
    desc: "Tablet Belajar Anak, Screen Time Positif &amp; Monster Math",
    color: "#8b5cf6",
    colorBg: "rgba(139, 92, 246, 0.12)",
    app: "Monster Math Train Brain",
  },
  {
    num: "10",
    time: "22:15",
    name: "PRODUKTIVITAS &amp; PDF",
    tag: "SECURITY / UTILITY",
    desc: "Edit, Tanda Tangan &amp; Kompres PDF Offline Tanpa Kuota di HP",
    color: "#14b8a6",
    colorBg: "rgba(20, 184, 166, 0.12)",
    app: "Offline PDF Editor",
  },
];

function renderCard(s, x, y, w, h) {
  return `
    <g transform="translate(${x}, ${y})">
      <!-- Card Container -->
      <rect width="${w}" height="${h}" rx="14" ry="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />
      
      <!-- Left Accent Line -->
      <rect x="0" y="14" width="4" height="${h - 28}" rx="2" fill="${s.color}" />

      <!-- Time Badge Box -->
      <rect x="18" y="18" width="130" height="${h - 36}" rx="10" fill="#1e293b" stroke="${s.color}" stroke-opacity="0.3" stroke-width="1" />
      <text x="83" y="42" text-anchor="middle" fill="${s.color}" font-family="sans-serif" font-weight="bold" font-size="11" letter-spacing="1">SLOT ${s.num}</text>
      <text x="83" y="74" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="28">${s.time}</text>
      <text x="83" y="93" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-weight="bold" font-size="12">WIB (UTC+7)</text>

      <!-- Category Tag Pill -->
      <rect x="166" y="20" width="${s.tag.length * 8 + 18}" height="22" rx="6" fill="${s.colorBg}" stroke="${s.color}" stroke-opacity="0.4" stroke-width="1" />
      <text x="175" y="35" fill="${s.color}" font-family="sans-serif" font-weight="bold" font-size="10" letter-spacing="0.5">${s.tag}</text>

      <!-- Slot Title -->
      <text x="166" y="65" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="19">${s.name}</text>

      <!-- Slot Description -->
      <text x="166" y="88" fill="#94a3b8" font-family="sans-serif" font-size="13">${s.desc}</text>

      <!-- Target App / Info -->
      <text x="166" y="108" fill="#64748b" font-family="sans-serif" font-size="11">Terkait App: <tspan fill="#cbd5e1" font-weight="bold">${s.app}</tspan> • Jadwal Rutin Tiap Hari</text>
    </g>
  `;
}

async function main() {
  const col1Slots = slots.slice(0, 5);
  const col2Slots = slots.slice(5, 10);

  const cardW = 690;
  const cardH = 126;
  const startY = 200;
  const gapY = 144;

  const col1Svg = col1Slots.map((s, idx) => renderCard(s, 80, startY + idx * gapY, cardW, cardH)).join("\n");
  const col2Svg = col2Slots.map((s, idx) => renderCard(s, 830, startY + idx * gapY, cardW, cardH)).join("\n");

  const fullSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Gradient -->
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#070b14" />
        <stop offset="50%" stop-color="#0a0f1d" />
        <stop offset="100%" stop-color="#060913" />
      </linearGradient>

      <!-- Ambient Glow Top Left -->
      <radialGradient id="glowTop" cx="20%" cy="10%" r="50%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
      </radialGradient>

      <!-- Ambient Glow Bottom Right -->
      <radialGradient id="glowBottom" cx="80%" cy="90%" r="50%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Canvas Background -->
    <rect width="${width}" height="${height}" fill="url(#bg)" />
    <rect width="${width}" height="${height}" fill="url(#glowTop)" />
    <rect width="${width}" height="${height}" fill="url(#glowBottom)" />

    <!-- Top Border Line -->
    <line x1="0" y1="0" x2="${width}" y2="0" stroke="#3b82f6" stroke-width="4" />

    <!-- Header Section -->
    <g transform="translate(80, 50)">
      <!-- System Tag -->
      <rect x="0" y="0" width="280" height="26" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1" />
      <circle cx="14" cy="13" r="4" fill="#10b981" />
      <text x="26" y="17" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="11" letter-spacing="1">D LUCKY X • PUBLISHING PIPELINE</text>

      <!-- Main Title -->
      <text x="0" y="68" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="38" letter-spacing="0.5">JADWAL PUBLISH ARTIKEL HARIAN</text>

      <!-- Subtitle -->
      <text x="0" y="102" fill="#94a3b8" font-family="sans-serif" font-size="17">10 Slot Artikel Terjadwal Setiap Hari • Zona Waktu Indonesia Barat (WIB / UTC+7)</text>

      <!-- Right Automation Badge -->
      <g transform="translate(1080, 15)">
        <rect x="0" y="0" width="360" height="76" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
        <circle cx="28" cy="28" r="6" fill="#10b981" />
        <text x="44" y="32" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13" letter-spacing="0.5">SISTEM AKTIF: 100% OTOMATIS</text>
        <text x="24" y="56" fill="#cbd5e1" font-family="sans-serif" font-size="12">GitHub Actions Cron: Setiap 15 Menit</text>
      </g>
    </g>

    <!-- Cards Columns -->
    ${col1Svg}
    ${col2Svg}

    <!-- Bottom Footer Bar -->
    <g transform="translate(80, 950)">
      <rect width="1440" height="70" rx="12" fill="#0b1324" stroke="#1e293b" stroke-width="1" />
      
      <!-- Icon/Label -->
      <rect x="20" y="18" width="130" height="34" rx="8" fill="#1e293b" />
      <text x="85" y="40" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="12">GITHUB CRON</text>

      <!-- Footer text -->
      <text x="170" y="41" fill="#cbd5e1" font-family="sans-serif" font-size="13.5">
        Auto Publish mengecek antrean setiap 15 menit (<tspan fill="#38bdf8" font-weight="bold">:05, :20, :35, :50</tspan>). Artikel terbit otomatis ke Blog &amp; RSS tanpa perlu push manual.
      </text>

      <!-- Right Counter -->
      <text x="1410" y="41" text-anchor="end" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13">
        830+ Total Artikel Siap Rilis
      </text>
    </g>
  </svg>
  `;

  const destPng = "public/images/jadwal-publish-artikel.png";
  const destWebp = "public/images/jadwal-publish-artikel.webp";

  console.log("Generating schedule infographic images...");
  await sharp(Buffer.from(fullSvg)).png().toFile(destPng);
  await sharp(Buffer.from(fullSvg)).webp({ quality: 90 }).toFile(destWebp);

  // Also copy to artifact directory for easy inspection
  const artifactDir = "/Users/dederpl/.gemini/antigravity/brain/1aea934d-9bb9-44df-bdc1-7ee743225936";
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(destPng, path.join(artifactDir, "jadwal-publish-artikel.png"));
  }

  console.log(`Success! Created:`);
  console.log(`- ${destPng}`);
  console.log(`- ${destWebp}`);
}

main().catch(console.error);
