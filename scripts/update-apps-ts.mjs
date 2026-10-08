import fs from "node:fs";
import path from "node:path";

const playstoreData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts", "playstore-full.json"), "utf8")
);

function cleanText(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[—–]/g, " - ")
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .trim();
}

const customTagsAndFeatures = {
  "offline-pdf-editor": {
    tags: ["PDF", "Offline", "Tanda Tangan", "Kompres PDF", "Produktivitas"],
    features: [
      "100% Offline, proses murni di memori ponsel tanpa kirim berkas ke server",
      "Tanda tangan digital (E-Sign) dan pengisian formulir instan",
      "Gabung (merge), pisah (split), dan kompres ukuran dokumen PDF",
      "Enkripsi kata sandi dan sensor bagian dokumen rahasia",
    ],
  },
  "stickman-penalty-rush": {
    tags: ["Sepak Bola", "Penalti", "Stickman", "Olahraga", "Arcade"],
    features: [
      "Kontrol swipe intuitif untuk tendangan akurat dan menipu kiper",
      "Mode Karir bertingkat dari Liga Pemula hingga Liga Elite Dunia",
      "Kustomisasi jersey, sarung tangan, dan gaya stickman",
      "Fisika bola realistis dan dapat dimainkan offline tanpa internet",
    ],
  },
  "milo-cat-adventure": {
    tags: ["Platformer", "Kucing", "Alien", "Petualangan", "Retro"],
    features: [
      "Aksi platformer 2D cepat dengan visual sci-fi neon modern",
      "Karakter Milo si kucing pahlawan bertopeng dan berjubah luar angkasa",
      "Lempar boomerang neon untuk mengalahkan monster alien kosmik",
      "Tantangan Level 11 Boss Mode yang seru dan full offline",
    ],
  },
  "monster-math-train-brain": {
    tags: ["Matematika", "Latih Otak", "Anak & Keluarga", "Edukasi", "Monster"],
    features: [
      "Tantangan berhitung: penjumlahan, pengurangan, perkalian, dan pembagian",
      "Upgrade monster dan buka kemampuan baru lewat jawaban benar",
      "Melatih konsentrasi, daya ingat, dan kecepatan berpikir logis",
      "Visual penuh warna ramah anak dan berfungsi offline",
    ],
  },
  "baby-shark-abc-kids-learning": {
    tags: ["Alfabet ABC", "Fonik", "Anak Balita", "PAUD", "Belajar"],
    features: [
      "Belajar huruf ABC A-Z dengan pengucapan fonik yang jernih",
      "Animasi Baby Shark ramah anak yang interaktif dan ceria",
      "Navigasi simpel yang mudah digunakan oleh tangan si kecil",
      "Lingkungan belajar aman, ramah keluarga, dan full offline",
    ],
  },
  "fruity-merge-3d-match-puzzle": {
    tags: ["Puzzle Kartu", "Daya Ingat", "Buah", "Asah Otak", "Santai"],
    features: [
      "Mencocokkan pasangan kartu buah untuk melatih memori visual",
      "Desain buah-buahan segar penuh warna dengan musik menenangkan",
      "Puluhan level tantangan bertahap untuk segala usia",
      "Dapat dimainkan santai tanpa koneksi internet",
    ],
  },
  "kucing-atur-duit": {
    tags: ["Keuangan", "Catatan Uang", "Budget", "Kucing", "Finansial"],
    features: [
      "Catat pengeluaran dan pemasukan dengan keyboard kalkulator praktis",
      "Maskot kucing interaktif (Oren, Hitam, Putih, Calico) yang responsif",
      "Laporan arus kas, grafik kategori, dan pemantauan anggaran bulanan",
      "Data tersimpan 100% lokal di HP, aman dengan kunci PIN dan biometrik",
    ],
  },
};

const processedApps = playstoreData.map((app) => {
  const custom = customTagsAndFeatures[app.slug] || { tags: [], features: [] };
  const appDir = path.join(process.cwd(), "public", "images", "apps", app.slug);
  const screenshotFiles = fs
    .readdirSync(appDir)
    .filter((f) => f.startsWith("screenshot-") && f.endsWith(".webp"))
    .sort()
    .map((f) => `/images/apps/${app.slug}/${f}`);

  return {
    slug: app.slug,
    name: cleanText(app.name),
    packageId: app.packageId,
    tagline: cleanText(app.tagline),
    description: cleanText(app.description),
    category: app.category,
    tags: custom.tags,
    features: custom.features,
    icon: `/images/apps/${app.slug}/icon.webp`,
    screenshots: screenshotFiles,
    rating: app.rating || 5.0,
    reviewsCount: app.reviewsCount || null,
    downloads: app.downloads || "10+",
    contentRating: app.contentRating || "3+",
    hasAds: app.slug === "stickman-penalty-rush" || app.slug === "fruity-merge-3d-match-puzzle",
    playUrl: `https://play.google.com/store/apps/details?id=${app.packageId}`,
    color: app.color,
  };
});

const tsContent = `export type AppItem = {
  slug: string;
  name: string;
  packageId: string;
  tagline: string;
  description: string;
  category: "game" | "education" | "tool";
  tags: string[];
  features: string[];
  icon: string;          // /images/apps/<slug>/icon.webp
  screenshots: string[]; // /images/apps/<slug>/screenshot-1.webp ...
  rating?: number;
  reviewsCount?: number | null;
  downloads?: string;    // "500+", "10+", etc.
  contentRating?: string; // "3+"
  hasAds?: boolean;
  playUrl: string;
  color: string;         // accent hex, e.g. "#22d3ee"
};

export type DeveloperProfile = {
  name: string;
  tagline: string;
  description: string;
  playStoreUrl: string;
  email: string;
  website: string;
};

export const developer: DeveloperProfile = {
  name: "D Lucky X",
  tagline:
    "Independent game developer building fun games and useful Android apps for productivity, learning, and entertainment.",
  description:
    "D Lucky X adalah studio pengembang game dan aplikasi Android independen dari Indonesia. Kami merilis game santai yang adiktif, petualangan aksi seru, aplikasi edukasi anak ramah keluarga, serta aplikasi utilitas produktivitas & finansial harian yang ringan, privat, dan aman di Google Play Store.",
  playStoreUrl:
    "https://play.google.com/store/apps/dev?id=5090788794635737630",
  email: "teknoplanner@gmail.com",
  website: "https://dluckyx.cloud",
};

export const apps: AppItem[] = ${JSON.stringify(processedApps, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), "src", "data", "apps.ts"), tsContent, "utf8");
console.log("Successfully generated src/data/apps.ts with 100% real Google Play Store data!");
