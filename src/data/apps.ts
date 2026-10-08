export type AppItem = {
  slug: string;
  name: string;
  packageId: string;
  tagline: string;
  description: string;
  category: "game" | "education" | "tool";
  tags: string[];
  icon: string;          // /images/apps/<slug>/icon.webp
  screenshots: string[]; // /images/apps/<slug>/screenshot-1.webp ...
  rating?: number;
  downloads?: string;    // "500+"
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
    "D Lucky X adalah studio pengembang game dan aplikasi Android independen. Kami menghadirkan karya yang menghibur, edukatif, dan bermanfaat mulai dari game aksi & santai hingga aplikasi produktivitas dan finansial harian yang aman serta ringan untuk pengguna.",
  playStoreUrl:
    "https://play.google.com/store/apps/dev?id=5090788794635737630",
  email: "support@dluckyx.cloud",
  website: "https://dluckyx.cloud",
};

export const apps: AppItem[] = [
  {
    slug: "offline-pdf-editor",
    name: "Offline PDF Editor & Sign",
    packageId: "com.dluckyx.pdfeditor",
    tagline: "Edit dokumen, isi formulir, dan bubuhkan tanda tangan digital secara offline.",
    description:
      "Aplikasi pengelola dan pembaca dokumen PDF yang 100% berjalan offline tanpa perlu koneksi internet. Lindungi privasi data sensitif Anda saat menandatangani berkas resmi, mengisi formulir digital, atau mengelola dokumen pekerjaan penting langsung dari smartphone Android.",
    category: "tool",
    tags: ["PDF", "Editor", "Tanda Tangan", "Offline", "Produktivitas"],
    icon: "/images/apps/offline-pdf-editor/icon.webp",
    screenshots: [
      "/images/apps/offline-pdf-editor/screenshot-1.webp",
      "/images/apps/offline-pdf-editor/screenshot-2.webp",
      "/images/apps/offline-pdf-editor/screenshot-3.webp",
    ],
    rating: 5.0,
    downloads: "500+",
    contentRating: "3+",
    hasAds: false,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.dluckyx.pdfeditor",
    color: "#0284c7",
  },
  {
    slug: "stickman-penalty-rush",
    name: "Stickman Penalty Rush",
    packageId: "com.stickmanpenaltyrush.game",
    tagline: "Adu penalti sepak bola aksi seru ala stickman!",
    description:
      "Game adu penalti penuh aksi dengan karakter stickman yang lincah! Bidik sudut gawang, tentukan kekuatan tendangan, kecoh kiper lawan, dan raih trofi juara turnamen sepak bola paling bergengsi.",
    category: "game",
    tags: ["Sepak Bola", "Penalti", "Stickman", "Arcade", "Olahraga"],
    icon: "/images/apps/stickman-penalty-rush/icon.webp",
    screenshots: [
      "/images/apps/stickman-penalty-rush/screenshot-1.webp",
      "/images/apps/stickman-penalty-rush/screenshot-2.webp",
      "/images/apps/stickman-penalty-rush/screenshot-3.webp",
    ],
    rating: 4.8,
    downloads: "1K+",
    contentRating: "3+",
    hasAds: true,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.stickmanpenaltyrush.game",
    color: "#22c55e",
  },
  {
    slug: "milo-cat-adventure",
    name: "Milo Cat Adventure",
    packageId: "com.miloadventure.game",
    tagline: "Petualangan Milo, kucing luar angkasa, melintasi rintangan alien!",
    description:
      "Game platformer aksi 2D yang menawan! Jelajahi planet-planet asing bersama Milo si kucing luar angkasa. Melompat melewati rintangan berbahaya, kumpulkan koin bintang, dan kalahkan invasi alien.",
    category: "game",
    tags: ["Platformer", "Petualangan", "Kucing", "Alien", "Retro"],
    icon: "/images/apps/milo-cat-adventure/icon.webp",
    screenshots: [
      "/images/apps/milo-cat-adventure/screenshot-1.webp",
      "/images/apps/milo-cat-adventure/screenshot-2.webp",
      "/images/apps/milo-cat-adventure/screenshot-3.webp",
    ],
    rating: 4.7,
    downloads: "500+",
    contentRating: "3+",
    hasAds: false,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.miloadventure.game",
    color: "#f472b6",
  },
  {
    slug: "monster-math-train-brain",
    name: "Monster Math Train Brain",
    packageId: "com.monsteradventuremath",
    tagline: "Game matematika edukatif seru untuk melatih ketangkasan berhitung & otak.",
    description:
      "Game edukasi matematika seru bersama para monster menggemaskan! Dirancang khusus untuk melatih kecepatan berhitung, konsentrasi, dan ketangkasan otak anak-anak maupun remaja dengan cara yang menyenangkan.",
    category: "education",
    tags: ["Matematika", "Latih Otak", "Anak", "Edukasi", "Puzzle"],
    icon: "/images/apps/monster-math-train-brain/icon.webp",
    screenshots: [
      "/images/apps/monster-math-train-brain/screenshot-1.webp",
      "/images/apps/monster-math-train-brain/screenshot-2.webp",
      "/images/apps/monster-math-train-brain/screenshot-3.webp",
    ],
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
    tagline: "Belajar mengenal huruf alfabet ABC interaktif dan ramah anak usia dini.",
    description:
      "Aplikasi edukasi interaktif untuk anak usia dini (PAUD/TK). Mengenal huruf alfabet A-Z, bunyi fonik, kosa kata bergambar, dan animasi lucu yang aman serta ramah anak tanpa konten berbahaya.",
    category: "education",
    tags: ["Alfabet", "ABC", "Anak", "Belajar", "Edukasi Balita"],
    icon: "/images/apps/baby-shark-abc-kids-learning/icon.webp",
    screenshots: [
      "/images/apps/baby-shark-abc-kids-learning/screenshot-1.webp",
      "/images/apps/baby-shark-abc-kids-learning/screenshot-2.webp",
      "/images/apps/baby-shark-abc-kids-learning/screenshot-3.webp",
    ],
    rating: 5.0,
    downloads: "1K+",
    contentRating: "3+",
    hasAds: false,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.sharksmartalphabet",
    color: "#22d3ee",
  },
  {
    slug: "fruity-merge-3d-match-puzzle",
    name: "Fruit Match: Memory Puzzle",
    packageId: "com.fruitmatchfun",
    tagline: "Puzzle mencocokkan kartu buah dan melatih daya ingat visual.",
    description:
      "Game puzzle santai mengasah daya ingat visual! Temukan dan cocokkan pasangan buah 3D lezat sebelum waktu habis. Grafis cerah, animasi halus, dan level tantangan bertingkat untuk relaksasi harian Anda.",
    category: "game",
    tags: ["Puzzle", "Memori", "Buah", "Casual", "Santai"],
    icon: "/images/apps/fruity-merge-3d-match-puzzle/icon.webp",
    screenshots: [
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-1.webp",
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-2.webp",
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-3.webp",
    ],
    rating: 5.0,
    downloads: "500+",
    contentRating: "3+",
    hasAds: true,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.fruitmatchfun",
    color: "#f59e0b",
  },
  {
    slug: "kucing-atur-duit",
    name: "Kucing Atur Duit",
    packageId: "com.dluckyx.kucingaturduit",
    tagline: "Catat pengeluaran dan kelola anggaran keuangan harian bersama kucing lucu.",
    description:
      "Aplikasi pencatat keuangan harian yang menyenangkan dan mudah digunakan. Pantau arus kas masuk dan keluar, atur batas anggaran bulanan, dan nikmati visual kucing menggemaskan yang menemani pencatatan keuangan Anda tanpa ribet.",
    category: "tool",
    tags: ["Keuangan", "Catatan Uang", "Budget", "Kucing", "Finansial"],
    icon: "/images/apps/kucing-atur-duit/icon.webp",
    screenshots: [
      "/images/apps/kucing-atur-duit/screenshot-1.webp",
      "/images/apps/kucing-atur-duit/screenshot-2.webp",
      "/images/apps/kucing-atur-duit/screenshot-3.webp",
    ],
    rating: 5.0,
    downloads: "500+",
    contentRating: "3+",
    hasAds: false,
    playUrl:
      "https://play.google.com/store/apps/details?id=com.dluckyx.kucingaturduit",
    color: "#f97316",
  },
];
