export interface AmazonProduct {
  id: string;
  name: string;
  nameEn: string;
  category: "gaming" | "kids" | "productivity";
  tagline: string;
  taglineEn: string;
  badge: string;
  badgeEn: string;
  url: string;
  image: string;
  features: string[];
  featuresEn: string[];
  iconType: "sparkles" | "fan" | "gamepad" | "headphones" | "tablet" | "pen" | "shield";
}

export const amazonProducts: AmazonProduct[] = [
  // --- GAMING GEAR ---
  {
    id: "finger-sleeves",
    image: "/images/gear/finger-sleeves.webp",
    name: "Sarung Jempol Gaming Anti-Keringat & Ultra Sensitif",
    nameEn: "Breathable Mobile Gaming Finger Sleeves (Anti-Sweat)",
    category: "gaming",
    tagline: "Serat perak konduktif elastis untuk presisi sentuhan layar licin tanpa hambatan keringat.",
    taglineEn: "0.3mm ultra-thin conductive silver fiber for zero-friction swipes and pinpoint touch response in MLBB, Free Fire & PUBG.",
    badge: "Anti-Keringat & Licin",
    badgeEn: "Anti-Friction & Sweat Control",
    url: "https://amzn.to/4drxCT5",
    features: [
      "Bahan perak 0.3mm super tipis & bersirkulasi udara tinggi",
      "Mengatasi layar kesat akibat tangan basah dan berkeringat",
      "Kompatibel untuk semua layar smartphone Android & iPhone"
    ],
    featuresEn: [
      "Ultra-thin 0.3mm silver fiber weave prevents sweaty friction",
      "Zero touch latency for lightning-fast skill casting & aim",
      "Seamless elastic fit compatible with all Android & iOS devices"
    ],
    iconType: "sparkles",
  },
  {
    id: "phone-cooler",
    image: "/images/gear/phone-cooler.webp",
    name: "Kipas Cooler HP Semikonduktor Peltier (Anti Drop FPS)",
    nameEn: "Semiconductor Magnetic Mobile Phone Cooler (Peltier)",
    category: "gaming",
    tagline: "Pendinginan aktif berbasis plat peltier, turunkan suhu smartphone hingga belasan derajat secara instan.",
    taglineEn: "Active Peltier thermoelectric plate drops device temperatures in seconds, eliminating thermal throttling and frame drops.",
    badge: "Pendingin Suhu Aktif",
    badgeEn: "Active Thermal Cooling",
    url: "https://amzn.to/3VrYsV4",
    features: [
      "Pendinginan instan dalam 30 detik untuk cegah overheating",
      "Kipas turbofan senyap tanpa mengganggu audio mic open mic",
      "Sistem penjepit & magnet universal untuk segala tipe HP"
    ],
    featuresEn: [
      "Cools down phone within 30 seconds to lock max FPS",
      "Whisper-quiet turbofan ensures crystal-clear voice comms",
      "Universal clamp & magnetic dual mount for any smartphone"
    ],
    iconType: "fan",
  },
  {
    id: "mobile-controller",
    image: "/images/gear/mobile-controller.webp",
    name: "Gamepad Controller HP Ergonomis Type-C / Bluetooth",
    nameEn: "Ergonomic Mobile Gaming Controller for Android & iOS",
    category: "gaming",
    tagline: "Kontrol analog taktil dan tombol trigger responsif untuk sensasi bermain game ala konsol di smartphone.",
    taglineEn: "Console-grade tactile analog joysticks and responsive triggers for effortless aim and fluid movement on mobile.",
    badge: "Kontrol Ergonomis",
    badgeEn: "Ergonomic Handheld Grip",
    url: "https://amzn.to/3VAMtog",
    features: [
      "Analog stik bebas drift dan tombol trigger ultra responsif",
      "Koneksi minim delay dengan dukungan pass-through charging",
      "Desain teleskopik fleksibel cocok untuk berbagai ukuran layar"
    ],
    featuresEn: [
      "Clickable drift-resistant thumbsticks & tactile microswitch triggers",
      "Ultra-low latency connectivity with pass-through charging support",
      "Telescopic design comfortably fits virtually any phone size"
    ],
    iconType: "gamepad",
  },
  {
    id: "gaming-tws",
    image: "/images/gear/gaming-tws.webp",
    name: "Gaming TWS Earbuds Latensi Super Rendah (<45ms)",
    nameEn: "Low-Latency (<45ms) Gaming True Wireless Earbuds",
    category: "gaming",
    tagline: "Dengar langkah kaki dan suara skill musuh secara real-time tanpa delay audio bluetooth yang mengganggu.",
    taglineEn: "Dedicated ultra-low 45ms gaming mode lets you hear enemy footsteps, skill casts, and gunshots in real time.",
    badge: "Audio Responsif <45ms",
    badgeEn: "Low-Latency Audio (<45ms)",
    url: "https://amzn.to/4j7NbTz",
    features: [
      "Mode gaming khusus dengan delay audio di bawah 45ms",
      "Dual microphone peredam bising untuk koordinasi tim yang jernih",
      "Daya tahan baterai tahan lama hingga 24+ jam bersama casing pengisi daya"
    ],
    featuresEn: [
      "Sub-45ms dedicated gaming mode eliminates noticeable audio lag",
      "Noise-filtering dual microphones for crystal-clear team communication",
      "Up to 24+ hours total playtime with portable USB-C charging case"
    ],
    iconType: "headphones",
  },

  // --- KIDS & EDUCATIONAL HARDWARE ---
  {
    id: "kids-tablet",
    image: "/images/gear/kids-tablet.webp",
    name: "Tablet Edukasi Anak dengan Kontrol Orang Tua & Filter Aman",
    nameEn: "All-New Kids Educational Tablet with Parental Controls",
    category: "kids",
    tagline: "Tablet ramah anak dengan casing tahan jatuh dan dashboard kontrol durasi waktu layar (screen time).",
    taglineEn: "Kid-proof educational tablet featuring built-in parental dashboard, screen-time controls, and rich curated learning apps.",
    badge: "Tablet Belajar & Edukasi",
    badgeEn: "Educational Kids Tablet",
    url: "https://amzn.to/4j8GXTt",
    features: [
      "Casing bumper tebal tahan benturan dan bantingan",
      "Dashboard kontrol orang tua untuk membatasi durasi main anak",
      "Layar HD jernih dengan perlindungan filter cahaya biru"
    ],
    featuresEn: [
      "Rugged kid-proof bumper case engineered to survive tough drops",
      "Intuitive parent dashboard to set daily goals and screen time limits",
      "Vivid HD display with eye-comfort blue light filter for growing eyes"
    ],
    iconType: "tablet",
  },
  {
    id: "kids-stylus",
    image: "/images/gear/kids-stylus.webp",
    name: "Stylus Pen Ergonomis Anak & Balita untuk Belajar Menulis",
    nameEn: "Ergonomic Chunky Grip Stylus Pen for Kids & Toddlers",
    category: "kids",
    tagline: "Bentuk segitiga tebal melatih genggaman motorik halus anak saat menggambar dan belajar berhitung di layar.",
    taglineEn: "Chunky ergonomic grip stylus designed for small hands to practice handwriting, trace alphabet letters, and solve puzzles.",
    badge: "Stylus Motorik Anak",
    badgeEn: "Ergonomic Kids Stylus",
    url: "https://amzn.to/4yFqOdb",
    features: [
      "Grip tebal ergonomis melatih posisi memegang pensil yang benar",
      "Ujung silikon lembut anti-gores aman untuk semua permukaan layar",
      "Langsung pakai tanpa perlu baterai atau pairing bluetooth"
    ],
    featuresEn: [
      "Chunky triangular grip promotes natural pencil-grasp development",
      "Soft, durable silicone tip protects tablet glass from scratches",
      "Ready to use instantly—no batteries or Bluetooth pairing needed"
    ],
    iconType: "pen",
  },
  {
    id: "kids-case",
    image: "/images/gear/kids-case.webp",
    name: "Casing Tablet Anak Anti-Benturan Berat dengan Handle & Stand",
    nameEn: "Heavy-Duty Shockproof Kids Tablet Case with Handle & Stand",
    category: "kids",
    tagline: "Material EVA foam tebal menyerap benturan ekstrem dengan pegangan jinjing yang bisa jadi penyangga meja.",
    taglineEn: "Heavy-duty shockproof EVA foam bumper surviving accidental drops and throws, with a 180° rotatable handle stand.",
    badge: "Casing Tahan Benturan",
    badgeEn: "Drop-Proof Bumper Case",
    url: "https://amzn.to/4j9fJMx",
    features: [
      "Material busa EVA tebal tidak beracun dan menyerap guncangan",
      "Handle jinjing multifungsi yang dapat ditekuk menjadi kickstand nonton",
      "Bibir bezel terangkat melindungi kaca layar saat jatuh tengkurap"
    ],
    featuresEn: [
      "Non-toxic, shock-absorbing dense EVA foam absorbs extreme impacts",
      "Convertible 180° rotatable handle doubles as a dual-angle kickstand",
      "Raised screen bezel edges protect tablet glass from face-down drops"
    ],
    iconType: "shield",
  },

  // --- PRODUCTIVITY & PDF HARDWARE ---
  {
    id: "capacitive-stylus",
    image: "/images/gear/capacitive-stylus.webp",
    name: "Stylus Pen Presisi Universal untuk Tablet & HP Android",
    nameEn: "High-Precision Universal Capacitive Stylus for Touchscreens",
    category: "productivity",
    tagline: "Ujung tembaga halus 1.5mm untuk tanda tangan digital e-sign dokumen PDF dan mencatat rapat dengan akurasi tinggi.",
    taglineEn: "Ultra-fine 1.5mm precision tip ideal for signing digital PDF contracts, annotating reports, and freehand note-taking.",
    badge: "Stylus Presisi E-Sign",
    badgeEn: "Precision E-Signature Stylus",
    url: "https://amzn.to/4ibSJLJ",
    features: [
      "Ujung runcing 1.5mm presisi tinggi tanpa goresan terputus",
      "Tombol on/off instan tanpa perlu pengaturan bluetooth rumit",
      "Baterai tahan lama hingga 10 jam pemakaian dengan penghematan otomatis"
    ],
    featuresEn: [
      "Fine 1.5mm copper tip delivers pixel-precise signature strokes",
      "One-button instant start with zero Bluetooth pairing hurdles",
      "Long-lasting battery with intelligent auto-sleep power saving"
    ],
    iconType: "pen",
  },
  {
    id: "paper-screen-protector",
    image: "/images/gear/paper-screen-protector.webp",
    name: "Pelindung Layar Matte Tekstur Kertas (Anti-Silau & Gesekan Alami)",
    nameEn: "Matte Paper-Feel Screen Protector (Anti-Glare & Friction)",
    category: "productivity",
    tagline: "Ubah permukaan kaca licin menjadi sensasi menulis di atas kertas asli, anti-silau dan nyaman untuk baca PDF berjam-jam.",
    taglineEn: "Transforms slippery tablet glass into authentic paper texture, reducing hand fatigue and glare during document review.",
    badge: "Tekstur Kertas Alami",
    badgeEn: "Matte Paper-Feel Surface",
    url: "https://amzn.to/4AXREyG",
    features: [
      "Koefisien gesekan menyerupai kertas mencegah stylus tergelincir",
      "Lapisan matte anti-silau nyaman dipandang di ruangan terang",
      "Tahan noda minyak sidik jari dan goresan benda tajam"
    ],
    featuresEn: [
      "Precise paper damping ratio prevents annoying stylus slips",
      "Anti-glare matte coating minimizes eye fatigue under bright lighting",
      "Repels fingerprint smudges, oils, and everyday surface scratches"
    ],
    iconType: "shield",
  },
];

export function getAmazonProductById(id: string): AmazonProduct | undefined {
  return amazonProducts.find((p) => p.id === id);
}

export function getAmazonProductsByCategory(
  category: "gaming" | "kids" | "productivity"
): AmazonProduct[] {
  return amazonProducts.filter((p) => p.category === category);
}

export function getAmazonProductsByIds(ids: string[]): AmazonProduct[] {
  return amazonProducts.filter((p) => ids.includes(p.id));
}
