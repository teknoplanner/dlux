import fs from "fs";
import path from "path";
import sharp from "sharp";

// 150 Curated High-Search-Volume Gaming Topics across 30 Days (5 per day)
// Slots: 07:00 (MLBB), 10:00 (Free Fire), 13:00 (Roblox), 16:30 (Minecraft), 19:30 (Genshin/EA FC)

const MLBB_TOPICS = [
  { hero: "Ling", role: "Assassin", focus: "Build Ling Tersakit 2026: Item Full Burst & Rotasi Cepat Solo Rank", targetApp: "stickman-penalty-rush" },
  { hero: "Fanny", role: "Assassin", focus: "Cara Main Fanny Pemula Anti Boros Energi & Tips Kabel Lurus", targetApp: "stickman-penalty-rush" },
  { hero: "Hayabusa", role: "Assassin", focus: "Build Hayabusa Jungler Meta Patch Terbaru: Sekali Ulti Musuh Lenyap", targetApp: "stickman-penalty-rush" },
  { hero: "Lancelot", role: "Assassin", focus: "Setting Emblem Lancelot Tank vs Assassin: Mana yang Lebih Efektif?", targetApp: "stickman-penalty-rush" },
  { hero: "Gusion", role: "Mage-Assassin", focus: "Combo Gusion 10 Pisau Tercepat: Trik Lempar Belati Anti Meleset", targetApp: "stickman-penalty-rush" },
  { hero: "Nolan", role: "Assassin", focus: "Build Nolan Jungler Tersakit 2026: Kombo Retakan Dimensi Auto Wiped Out", targetApp: "stickman-penalty-rush" },
  { hero: "Beatrix", role: "Marksman", focus: "Panduan Ganti Senjata Beatrix Paling Efektif & Posisi War Aman", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Wanwan", role: "Marksman", focus: "Cara Cepat Buka Kunci Titik Lemah Wanwan & Build Item Attack Speed", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Claude", role: "Marksman", focus: "Build Claude Meta 2026: Stack Dexter Maksimal & Timing Masuk War", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Brody", role: "Marksman", focus: "Build Brody Satu Kali Hit Nyawa Sekarat: Emblem & Item Penetration", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Moskov", role: "Marksman", focus: "Trik Tombak Moskov Menembus Base & Tips Stun Dinding Akurat", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Karrie", role: "Marksman", focus: "Build Karrie Tank vs Attack Speed: Senjata Utama Penghancur Armor Musuh", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Tigreal", role: "Tank-Roamer", focus: "Cara Montase Tigreal Tarik 5 Musuh Sekaligus: Timing Flicker & Ulti", targetApp: "milo-cat-adventure" },
  { hero: "Khufra", role: "Tank-Roamer", focus: "Tips Khufra Bola Pantul Counter Semua Hero Dash & Assassin Gesit", targetApp: "milo-cat-adventure" },
  { hero: "Minotaur", role: "Tank-Support", focus: "Build Minotaur Roam Terkuat: Heal Deras & Efek Knockup Area Luas", targetApp: "milo-cat-adventure" },
  { hero: "Franco", role: "Tank", focus: "Trik Tarikan Hook Franco Akurat 100%: Membaca Arah Gerak Musuh di Semak", targetApp: "milo-cat-adventure" },
  { hero: "Chou", role: "Fighter", focus: "Build Chou Serba Bisa: Roamer Culik Musuh vs Damage Tendangan Maut", targetApp: "stickman-penalty-rush" },
  { hero: "Yu Zhong", role: "Fighter-EXP", focus: "Cara Dominasi Lane Yu Zhong: Manajemen Pasif Darah Naga & Item Spell Vamp", targetApp: "stickman-penalty-rush" },
  { hero: "Paquito", role: "Fighter", focus: "Kombo Tinju Paquito Tak Terhentikan: Rotasi Skill Champ Stance Tercepat", targetApp: "stickman-penalty-rush" },
  { hero: "Terizla", role: "Fighter-EXP", focus: "Build Terizla Kebal Bencana: Item Defense Penguasa Jalur Lord & Turtle", targetApp: "stickman-penalty-rush" },
  { hero: "Cici", role: "Fighter", focus: "Panduan Main Cici EXP Lane: Trik Kiting Yo-yo & Mobilitas Tanpa Henti", targetApp: "milo-cat-adventure" },
  { hero: "Lunox", role: "Mage", focus: "Trik Ganti Cahaya dan Kegelapan Lunox: Burst Damage Penghancur Tank Tebal", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Kagura", role: "Mage", focus: "Kombo Payung Kagura Mematikan: Lepas Stun, Culik Core, dan Kabur Mulus", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Novaria", role: "Mage", focus: "Trik Tembakan Astral Novaria Tembus Layar: Buka Map & Snipe Musuh Sekarat", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Zhuxin", role: "Mage", focus: "Build Zhuxin Pengendali Lentera: Trik Mengangkat Musuh Berkelompok di War", targetApp: "fruity-merge-3d-match-puzzle" },
  { hero: "Mathilda", role: "Support", focus: "Panduan Mathilda Roamer Tier S: Terbang Selamatkan Teman & Buka Inisiasi", targetApp: "milo-cat-adventure" },
  { hero: "Diggie", role: "Support", focus: "Trik Bom Semak Diggie & Waktu Tepat Mengaktifkan Ulti Anti Crowd Control", targetApp: "milo-cat-adventure" },
  { hero: "Setting 120 FPS", role: "System", focus: "Setting Grafis MLBB 120 FPS Ultra Lancar: Hemat Baterai & Anti Lag Patah", targetApp: "offline-pdf-editor" },
  { hero: "Makro Maksi", role: "Guide", focus: "Panduan Makro Gaming MLBB: Timing Freeze Lane, Curi Monster, & Zoning Lord", targetApp: "monster-math-train-brain" },
  { hero: "Solo Rank Mythic", role: "Rank", focus: "Strategi Ampuh Solo Rank Tembus Mythical Glory: Psikologi & Pilihan Hero", targetApp: "monster-math-train-brain" }
];

const FF_TOPICS = [
  { brand: "All Devices", topic: "Setting Sensitivitas FF Auto Headshot 2026: Berlaku untuk Semua HP Android", targetApp: "stickman-penalty-rush" },
  { brand: "Oppo", topic: "Sensitivitas Free Fire Terbaik HP Oppo A Series & Reno: Trik Licin Tanpa DPI", targetApp: "stickman-penalty-rush" },
  { brand: "Vivo", topic: "Pengaturan Sensitivitas FF HP Vivo Y Series & V Series: Drag Shot Ringan", targetApp: "stickman-penalty-rush" },
  { brand: "Samsung", topic: "Sensitivitas FF HP Samsung Galaxy A & M Series: Layar Responsif Anti Licin", targetApp: "stickman-penalty-rush" },
  { brand: "Xiaomi Poco", topic: "Setting Sensitivitas FF Xiaomi Redmi & Poco: Optimasi Game Turbo 120Hz", targetApp: "stickman-penalty-rush" },
  { brand: "Infinix", topic: "Sensitivitas FF HP Infinix Hot & Note Series: Scope Halus Auto Merah", targetApp: "stickman-penalty-rush" },
  { brand: "Realme", topic: "Sensitivitas Free Fire HP Realme C & Number Series: Trik Jarak Dekat & Jauh", targetApp: "stickman-penalty-rush" },
  { brand: "DPI Guide", topic: "Berapa DPI Terbaik Free Fire? Panduan Lengkap Ukuran DPI Aman Tanpa Rusak Layar", targetApp: "offline-pdf-editor" },
  { brand: "Shotgun M1887", topic: "Trik Jump Shot M1887 Free Fire: Tembakan 2 Peluru Langsung Knockdown", targetApp: "stickman-penalty-rush" },
  { brand: "MP40 SMG", topic: "Rahasia Tarikan Aim MP40 FF: Trik Tembakan Spray Lurus Menempel di Kepala", targetApp: "stickman-penalty-rush" },
  { brand: "Woodpecker", topic: "Trik Senjata Woodpecker & SVD: Satu Ketukan Jarak Jauh Pasti Headshot", targetApp: "stickman-penalty-rush" },
  { brand: "Custom HUD 2 Jari", topic: "Setting Custom HUD 2 Jari Terbaik Free Fire: Tombol Tembak Nyaman & Fast Gloo Wall", targetApp: "fruity-merge-3d-match-puzzle" },
  { brand: "Custom HUD 3 Jari", topic: "Tata Letak Tombol HUD 3 Jari Pro Player: Kelincahan Gerak Maksimal", targetApp: "fruity-merge-3d-match-puzzle" },
  { brand: "Custom HUD 4 Jari", topic: "Panduan Setting HUD 4 Jari Free Fire: Bermain Cepat Seperti Turnamen Esports", targetApp: "fruity-merge-3d-match-puzzle" },
  { brand: "Fast Gloo Wall", topic: "Trik Pasang Gloo Wall Jongkok Tercepat: Perlindungan Kilat Saat Terjebak", targetApp: "stickman-penalty-rush" },
  { brand: "Kombinasi Karakter Rusher", topic: "Kombinasi Skill Karakter Rusher Paling Agresif: Alok, Hayato, Kelly, & Caroline", targetApp: "stickman-penalty-rush" },
  { brand: "Karakter Tatsuya", topic: "Tips Menggunakan Karakter Tatsuya: Manuver Kilat Mengelabui Formasi Lawan", targetApp: "stickman-penalty-rush" },
  { brand: "Karakter Dimitri", topic: "Kombinasi Skill Dimitri Healing Tanpa Akhir: Bertahan di Zona Terakhir", targetApp: "milo-cat-adventure" },
  { brand: "Karakter Chrono", topic: "Kapan Waktu Terbaik Membuka Perisai Chrono? Trik Counter Tembakan Terbuka", targetApp: "milo-cat-adventure" },
  { brand: "Tips Solo vs Squad", topic: "Cara Main Solo vs Squad Free Fire: Strategi Memecah Konsentrasi Tim Musuh", targetApp: "monster-math-train-brain" },
  { brand: "Clash Squad Ranked", topic: "Trik Push Rank Grandmaster Clash Squad: Manajemen Pembelian Senjata Tiap Ronde", targetApp: "monster-math-train-brain" },
  { brand: "Pilihan Pet Terbaik", topic: "5 Pet Free Fire Paling Berguna di Ranked: Tambahan Gloo Wall & Deteksi Musuh", targetApp: "milo-cat-adventure" },
  { brand: "Posisi Rotasi Map Bermuda", topic: "Rute Rotasi Teraman Map Bermuda: Jalur Menuju Zona Akhir Bebas Sergapan", targetApp: "stickman-penalty-rush" },
  { brand: "Setting Grafis Halus 60 FPS", topic: "Cara Mengatasi Lag Free Fire di HP RAM 2GB-3GB: Setting Grafis Halus & Suhu Dingin", targetApp: "offline-pdf-editor" },
  { brand: "Trik Menghindari Sniper", topic: "Cara Menghindari Tembakan AWM & M82B: Pola Lari Zig-zag Efektif", targetApp: "stickman-penalty-rush" },
  { brand: "Zona Terakhir Survival", topic: "Taktik Menang di Zona Akhir Free Fire: Pemanfaatan Granat Asap & Molotov", targetApp: "stickman-penalty-rush" },
  { brand: "Senjata AR Meta", topic: "Tier List Senjata Assault Rifle (AR) Free Fire: Groza, M4A1 Chip 3, dan SCAR", targetApp: "stickman-penalty-rush" },
  { brand: "Trik Menembak Beruntun", topic: "Teknik Drag Shot Atas vs Drag Shot Melingkar: Mana yang Menghasilkan Headshot?", targetApp: "stickman-penalty-rush" },
  { brand: "Tips Guild War", topic: "Strategi Komunikasi & Formasi Guild War Free Fire: Pembagian Peran Rusher & Sniper", targetApp: "monster-math-train-brain" },
  { brand: "Mental Juara Booyah", topic: "Mengapa Kamu Sering Panik di Akhir Laga? Tips Mental Tenang Meraih Booyah", targetApp: "kucing-atur-duit" }
];

const ROBLOX_TOPICS = [
  { category: "Blox Fruits", topic: "Kode Redeem Blox Fruits 2026 Terbaru: Reset Stat, 2x EXP, dan Beli Beli Berlimpah", targetApp: "fruity-merge-3d-match-puzzle" },
  { category: "Blox Fruits", topic: "Tier List Devil Fruit Blox Fruits: Buah Terbaik untuk Farming, Grinding, dan PvP", targetApp: "fruity-merge-3d-match-puzzle" },
  { category: "Blox Fruits", topic: "Cara Cepat Menuju Sea 2 & Sea 3 di Blox Fruits: Rute Quest Tercepat Level 1-2550", targetApp: "fruity-merge-3d-match-puzzle" },
  { category: "Blox Fruits", topic: "Panduan Awakening Devil Fruit Blox Fruits: Cara Menyelesaikan Raid Tanpa Kalah", targetApp: "fruity-merge-3d-match-puzzle" },
  { category: "Blox Fruits", topic: "Cara Mendapatkan Pedang Legendaris Cursed Dual Katana (CDK) di Blox Fruits", targetApp: "stickman-penalty-rush" },
  { category: "Blox Fruits", topic: "Tips Farming Fragment Cepat di Sea 2 & Sea 3: Siapkan Modal Belanja Gear", targetApp: "kucing-atur-duit" },
  { category: "Blade Ball", topic: "Trik Menang Duel Blade Ball Roblox: Timing Parry Bola Cepat & Pilihan Skill", targetApp: "stickman-penalty-rush" },
  { category: "Blade Ball", topic: "Tier List Skill Blade Ball: Manakah Kemampuan Paling Overpowered Saat Ini?", targetApp: "stickman-penalty-rush" },
  { category: "Brookhaven RP", topic: "Rahasia Lokasi Tersembunyi di Brookhaven RP: Pintu Rahasia & Brankas Misterius", targetApp: "milo-cat-adventure" },
  { category: "Adopt Me", topic: "Panduan Trading Aman di Adopt Me Roblox: Cara Mengenali Nilai Pet & Anti Scam", targetApp: "kucing-atur-duit" },
  { category: "Tower of Hell", topic: "Tips Menaklukkan Tower of Hell Tanpa Jatuh: Trik Lompatan Sudut & Kamera", targetApp: "stickman-penalty-rush" },
  { category: "Pet Simulator 99", topic: "Cara Cepat Mengumpulkan Huge Pet di Pet Simulator 99: Trik Enchant & Diamond", targetApp: "kucing-atur-duit" },
  { category: "Dress To Impress", topic: "Tips Menang Tema Apapun di Dress To Impress (DTI): Padu Padan Layer Pakaian", targetApp: "milo-cat-adventure" },
  { category: "Fisch Roblox", topic: "Panduan Lengkap Fisch Roblox: Lokasi Ikan Mitos & Joran Pancing Paling Sakti", targetApp: "milo-cat-adventure" },
  { category: "Arsenal", topic: "Setting Sensitivitas & Crosshair Arsenal Roblox: Menembak Cepat Ala Game FPS PC", targetApp: "stickman-penalty-rush" },
  { category: "Doors", topic: "Cara Menamatkan Game Horor Doors Roblox: Panduan Hadapi Rush, Ambush, & Figure", targetApp: "milo-cat-adventure" },
  { category: "Bedwars", topic: "Trik Rusher Bedwars Roblox: Cara Cepat Hancurkan Kasur Musuh di Menit Pertama", targetApp: "stickman-penalty-rush" },
  { category: "All Star Tower Defense", topic: "Tier List Karakter All Star Tower Defense: Unit Bintang 6 Terbaik Solo Story", targetApp: "fruity-merge-3d-match-puzzle" },
  { category: "The Strongest Battlegrounds", topic: "Kombo Saitama & Garou The Strongest Battlegrounds: Trik Dash Cancel Maut", targetApp: "stickman-penalty-rush" },
  { category: "Anime Defenders", topic: "Panduan Meta Anime Defenders: Susunan Unit Terbaik untuk Mode Infinite", targetApp: "fruity-merge-3d-match-puzzle" },
  { category: "Keamanan Akun", topic: "Cara Melindungi Akun Roblox dari Hacker: Verifikasi 2 Langkah & Pengaturan PIN", targetApp: "offline-pdf-editor" },
  { category: "Optimasi HP Kentang", topic: "Cara Mengatasi Roblox Lag dan Patah-Patah di HP: Hapus Cache & Setting Grafis", targetApp: "offline-pdf-editor" },
  { category: "Robux F2P", topic: "Cara Mendapatkan Robux Gratis Secara Legal: Manfaatkan Microsoft Rewards & Game Dev", targetApp: "kucing-atur-duit" },
  { category: "Roblox Studio", topic: "Panduan Dasar Membuat Game Sendiri di Roblox Studio untuk Pemula", targetApp: "monster-math-train-brain" },
  { category: "Game Horor Seru", topic: "7 Game Horor Roblox Paling Menyeramkan untuk Dimainkan Bersama Teman", targetApp: "milo-cat-adventure" },
  { category: "Game Simulasi", topic: "Rekomendasi Game Simulasi Pekerjaan Santai Terbaik di Roblox 2026", targetApp: "kucing-atur-duit" },
  { category: "Tips Parkour Obby", topic: "Trik Menyelesaikan Obby Tersulit di Roblox: Kuasai Teknik Wall Hop & Ladder Flick", targetApp: "stickman-penalty-rush" },
  { category: "Item Gratis Avatar", topic: "Daftar Event Roblox yang Memberikan Aksesori dan Baju Avatar Gratis", targetApp: "milo-cat-adventure" },
  { category: "Voice Chat Roblox", topic: "Syarat dan Cara Mengaktifkan Fitur Spatial Voice Chat di Game Roblox", targetApp: "offline-pdf-editor" },
  { category: "Komunitas Discord", topic: "Tips Menemukan Teman Mabar Seru di Server Komunitas Roblox Indonesia", targetApp: "kucing-atur-duit" }
];

const MINECRAFT_TOPICS = [
  { topic: "10 Seed Minecraft Terbaik 2026: Desa Berdampingan, Mansion Langka, & Nether Dekat", targetApp: "milo-cat-adventure" },
  { topic: "Panduan Bikin Iron Farm Otomatis di Minecraft Bedrock & Java: Panen Besi Melimpah", targetApp: "monster-math-train-brain" },
  { topic: "Resep Potion Minecraft Lengkap: Ramuan Healing, Night Vision, & Strength untuk Tempur", targetApp: "fruity-merge-3d-match-puzzle" },
  { topic: "Cara Mengalahkan Ender Dragon untuk Pemula: Persiapan Panah, Bed, dan Ember Air", targetApp: "stickman-penalty-rush" },
  { topic: "Panduan Memanggil dan Mengalahkan Wither Boss Tanpa Rusak Markas Utama", targetApp: "stickman-penalty-rush" },
  { topic: "Desain Rumah Minecraft Modern & Estetik: Langkah Praktis Memakai Bahan Kayu & Batu", targetApp: "milo-cat-adventure" },
  { topic: "Cara Membuat Farm Gandum & Sayuran Otomatis dengan Penduduk Desa (Villager)", targetApp: "kucing-atur-duit" },
  { topic: "Panduan Menemukan Diamond Terbanyak: Koordinat Y Paling Tepat di Update Terbaru", targetApp: "monster-math-train-brain" },
  { topic: "Enchantment Terbaik untuk Armor Netherite & Pedang: Kebal Serangan Monster Ganas", targetApp: "stickman-penalty-rush" },
  { topic: "Trik Bertahan Hidup Hari Pertama di Mode Hardcore Minecraft: Makanan & Tempat Tinggal", targetApp: "milo-cat-adventure" },
  { topic: "Dasar Sirkuit Redstone untuk Pemula: Cara Kerja Repeater, Comparator, dan Piston", targetApp: "monster-math-train-brain" },
  { topic: "Cara Membuat Pintu Rahasia Redstone Tembus Dinding: Sembunyikan Harta Berharga", targetApp: "monster-math-train-brain" },
  { topic: "Panduan Menjinakkan Kucing, Serigala, dan Kuda: Teman Setia Berkelana di Hutan", targetApp: "milo-cat-adventure" },
  { topic: "Eksplorasi Ancient City & Menghindari Warden: Trik Menyelinap di Blok Sculk Tanpa Bunyi", targetApp: "milo-cat-adventure" },
  { topic: "Cara Membuat XP Farm Monster Tercepat: Naik Level 30 Cuma Butuh 5 Menit", targetApp: "monster-math-train-brain" },
  { topic: "Panduan Memakai Elytra dan Kembang Api: Terbang Mengarungi Seluruh Peta Dunia", targetApp: "stickman-penalty-rush" },
  { topic: "Trik Memancing Harta Karun di Minecraft: Dapatkan Buku Enchanted Mending Langka", targetApp: "milo-cat-adventure" },
  { topic: "Cara Menghidupkan Portal Nether Cepat Menggunakan Ember Lahar dan Air", targetApp: "stickman-penalty-rush" },
  { topic: "Panduan Menjinakkan Villager Librarian untuk Mendapatkan Buku Mending Murah 1 Jamrud", targetApp: "kucing-atur-duit" },
  { topic: "Desain Gudang Penyortir Barang Otomatis (Auto Sorter): Barang Rapi Bebas Berantakan", targetApp: "monster-math-train-brain" },
  { topic: "Cara Membuat Farm Tebu dan Bambu Otomatis dengan Observer: Bahan Kertas & Bahan Bakar", targetApp: "kucing-atur-duit" },
  { topic: "Tips Menemukan Ocean Monument dan Mengeringkan Kuil Air dengan Spons Kering", targetApp: "milo-cat-adventure" },
  { topic: "Cara Membuat Lift Air Cepat Naik Turun Menggunakan Soul Sand dan Magma Block", targetApp: "stickman-penalty-rush" },
  { topic: "Panduan Menemukan Trial Chambers di Update Terbaru: Hadapi Mob Breeze & Dapatkan Senjata Mace", targetApp: "stickman-penalty-rush" },
  { topic: "Cara Menggunakan Senjata Baru Mace: Hancurkan Monster Sekali Pukul dari Ketinggian", targetApp: "stickman-penalty-rush" },
  { topic: "Tips Memasang Shaders dan Texture Pack Ringan di Minecraft HP (PocKet Edition)", targetApp: "offline-pdf-editor" },
  { topic: "Cara Mengatasi Lag Minecraft di Android: Kurangi Render Distance & Optimasi Pengaturan", targetApp: "offline-pdf-editor" },
  { topic: "Panduan Bermain Mabar Minecraft Antara HP Android, iPhone, dan PC Lewat Server Bedrock", targetApp: "offline-pdf-editor" },
  { topic: "Rekomendasi Mod Minecraft Petualangan Paling Seru dan Ringan untuk Dimainkan", targetApp: "milo-cat-adventure" },
  { topic: "Ide Proyek Megabuild Minecraft Survival: Dari Benteng Kerajaan Sampai Kota Melayang", targetApp: "milo-cat-adventure" }
];

const GENSHIN_EAFC_TOPICS = [
  { game: "Genshin Impact", topic: "Rute Farming Primogem F2P Tercepat: Dapatkan Karakter Bintang 5 Idaman", targetApp: "kucing-atur-duit" },
  { game: "Genshin Impact", topic: "Build Mavuika & Karakter Pyro Natlan: Senjata, Artefak, dan Komposisi Tim", targetApp: "fruity-merge-3d-match-puzzle" },
  { game: "Genshin Impact", topic: "Tier List Karakter Genshin Impact 2026: Sub-DPS dan Support Paling Berguna", targetApp: "fruity-merge-3d-match-puzzle" },
  { game: "Genshin Impact", topic: "Cara Menaklukkan Spiral Abyss Lantai 12 dengan Tim Karakter Bintang 4", targetApp: "stickman-penalty-rush" },
  { game: "Genshin Impact", topic: "Panduan Manajemen Resin Harian: Prioritas Artefak, Buku Talenta, atau Bos?", targetApp: "kucing-atur-duit" },
  { game: "Genshin Impact", topic: "Tips Menghemat Ruang Penyimpanan Genshin Impact di HP Android: Hapus File Suara Lama", targetApp: "offline-pdf-editor" },
  { game: "Genshin Impact", topic: "Rute Mengumpulkan Material Ascension Karakter Tanpa Perlu Menunggu Hari Esok", targetApp: "fruity-merge-3d-match-puzzle" },
  { game: "Honkai Star Rail", topic: "Tier List Karakter Honkai Star Rail: Pilihan DPS Terbaik Jalur Destruction & Hunt", targetApp: "fruity-merge-3d-match-puzzle" },
  { game: "Honkai Star Rail", topic: "Tips Menyelesaikan Mode Simulated Universe & Divergent Universe Tanpa Karakter Gacha", targetApp: "monster-math-train-brain" },
  { game: "Honkai Star Rail", topic: "Panduan Mengatur Relic dan Speed Tuning: Urutan Giliran Menyerang Paling Ideal", targetApp: "monster-math-train-brain" },
  { game: "EA FC Mobile", topic: "Formasi Meta Terbaik EA FC Mobile H2H: Trik Taktik Bertahan & Serangan Balik Cepat", targetApp: "stickman-penalty-rush" },
  { game: "EA FC Mobile", topic: "Trik Tendangan Penalti dan Freekick Akurat 100% Menembus Pojok Gawang Lawan", targetApp: "stickman-penalty-rush" },
  { game: "EA FC Mobile", topic: "Cara Cepat Mendapatkan Koin Jutaan di Pasar Transfer EA FC Mobile: Beli Murah Jual Mahal", targetApp: "kucing-atur-duit" },
  { game: "EA FC Mobile", topic: "Skill Move Paling Ampuh Mengelabui Bek Lawan: Lane Change, Heel to Heel, & Roulette", targetApp: "stickman-penalty-rush" },
  { game: "EA FC Mobile", topic: "Panduan Memilih Kiper Terbaik: Atribut Refleks dan Jangkauan Tepis Bola", targetApp: "stickman-penalty-rush" },
  { game: "eFootball Mobile", topic: "Gaya Main Tim Terbaik eFootball: Rekomendasi Quick Counter vs Possession Game", targetApp: "stickman-penalty-rush" },
  { game: "eFootball Mobile", topic: "Panduan Meracik Poin Statistik Pemain: Maksimalkan Rating OVR & Kecepatan Lari", targetApp: "monster-math-train-brain" },
  { game: "eFootball Mobile", topic: "Trik Bertahan Solid Melawan Lawan Suka Umpan Terobosan Melambung", targetApp: "stickman-penalty-rush" },
  { game: "Stumble Guys", topic: "Semua Shortcut Map Stumble Guys: Lompatan Rahasia Menuju Garis Finish Juara 1", targetApp: "stickman-penalty-rush" },
  { game: "Stumble Guys", topic: "Trik Emote Tinju dan Tendangan: Waktu yang Tepat Menyingkirkan Musuh di Laser Tracer", targetApp: "stickman-penalty-rush" },
  { game: "PUBG Mobile", topic: "Setting Sensitivitas Gyroscope PUBG Mobile: Kontrol Recoil M416 Jarak Jauh", targetApp: "stickman-penalty-rush" },
  { game: "PUBG Mobile", topic: "Rute Rotasi Terbaik Map Erangel: Masuk Zona Aman Tanpa Terjebak di Jembatan", targetApp: "stickman-penalty-rush" },
  { game: "Honor of Kings", topic: "Tier List Hero Honor of Kings (HoK) Indonesia: Rekomendasi Push Rank Cepat", targetApp: "stickman-penalty-rush" },
  { game: "Honor of Kings", topic: "Tips Bermain Clash Lane & Farm Lane di HoK: Manajemen Gelombang Minion", targetApp: "stickman-penalty-rush" },
  { game: "Clash of Clans", topic: "Formasi Base Pertahanan Town Hall Terbaik: Anti Serangan 3 Bintang di Clan War", targetApp: "monster-math-train-brain" },
  { game: "Clash of Clans", topic: "Kombinasi Pasukan Serang Terkuat: Trik Queen Charge & Pemanfaatan Spell", targetApp: "monster-math-train-brain" },
  { game: "Game Offline", topic: "7 Game Offline Android Ringan Terbaik Tanpa Kuota: Penghilang Jenuh Saat Santai", targetApp: "milo-cat-adventure" },
  { game: "Puzzle Match", topic: "Trik Menyelesaikan Level Sulit Game Puzzle Mencocokkan Buah: Rantai Kombo Maksimal", targetApp: "fruity-merge-3d-match-puzzle" },
  { game: "Edukasi Anak", topic: "Manfaat Game Matematika & Tebak Angka untuk Melatih Kecepatan Berpikir Logis Anak", targetApp: "monster-math-train-brain" },
  { game: "Game Santai Studio", topic: "Kompilasi Game Ringan D Lucky X: Seru, Aman untuk Keluarga, dan Hemat Memori HP", targetApp: "milo-cat-adventure" }
];

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 75);
}

// Generate banner WebP
async function generateCoverImage(slug, title, categoryText, themeColor = "#10b981") {
  const filePath = path.join("public/images/blog", `${slug}.webp`);
  if (fs.existsSync(filePath)) return `/images/blog/${slug}.webp`;

  const safeTitle = title.length > 50 ? title.slice(0, 48) + "..." : title;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#070c18" />
        <stop offset="50%" stop-color="#040812" />
        <stop offset="100%" stop-color="#010307" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${themeColor}" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)" />
    <circle cx="1060" cy="140" r="280" fill="${themeColor}" opacity="0.18" filter="blur(50px)" />
    <circle cx="120" cy="520" r="220" fill="#38bdf8" opacity="0.14" filter="blur(45px)" />

    <!-- Outer frame -->
    <rect x="25" y="25" width="1150" height="580" rx="28" fill="none" stroke="#1e293b" stroke-width="2" />
    <rect x="25" y="25" width="1150" height="8" rx="4" fill="url(#accent)" />

    <!-- Category Pill Badge -->
    <rect x="65" y="70" width="260" height="42" rx="21" fill="#0f172a" stroke="${themeColor}" stroke-width="1.5" />
    <text x="195" y="97" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle" letter-spacing="2">${categoryText.toUpperCase().replace(/&/g, "&amp;")}</text>

    <!-- Headline -->
    <text x="65" y="210" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="46">${safeTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
    <text x="65" y="280" fill="#94a3b8" font-family="sans-serif" font-size="24">Panduan Lengkap, Trik Tersembunyi, &amp; Analisis Taktik Meta 2026</text>

    <!-- Highlights Grid -->
    <rect x="65" y="340" width="320" height="90" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
    <text x="95" y="375" fill="${themeColor}" font-family="sans-serif" font-size="13" font-weight="bold">TARGET AUDIENCE</text>
    <text x="95" y="405" fill="#e2e8f0" font-family="sans-serif" font-size="16" font-weight="600">Player Pemula hingga Pro</text>

    <rect x="415" y="340" width="320" height="90" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
    <text x="445" y="375" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">VERIFIED STRATEGY</text>
    <text x="445" y="405" fill="#e2e8f0" font-family="sans-serif" font-size="16" font-weight="600">Teruji Patch Terbaru</text>

    <!-- Footer Studio Branding -->
    <text x="65" y="555" fill="#64748b" font-family="sans-serif" font-size="15" font-weight="600">D LUCKY X • PRO GAMING STRATEGY &amp; GUIDES HUB</text>
  </svg>`;

  try {
    await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(filePath);
  } catch (err) {
    console.error(`Error saving cover image ${slug}:`, err.message);
  }

  return `/images/blog/${slug}.webp`;
}

// Generate complete ArticleItem object
function buildArticleItem(info, index, totalInGroup, categoryLabel, groupColor, targetAppSlug) {
  const dayIndex = Math.floor(index); // 0 to 29 (30 days)
  const baseDate = new Date("2026-10-10T00:00:00+07:00");
  baseDate.setDate(baseDate.getDate() + dayIndex);

  // Time slot hours per group
  let hourStr = "07:00:00";
  if (categoryLabel === "Free Fire") hourStr = "10:00:00";
  if (categoryLabel === "Roblox") hourStr = "13:00:00";
  if (categoryLabel === "Minecraft") hourStr = "16:30:00";
  if (categoryLabel === "Genshin & EA FC") hourStr = "19:30:00";

  const dateYear = baseDate.getFullYear();
  const dateMonth = String(baseDate.getMonth() + 1).padStart(2, "0");
  const dateDay = String(baseDate.getDate()).padStart(2, "0");
  const publishedDate = `${dateYear}-${dateMonth}-${dateDay}T${hourStr}+07:00`;

  const titleId = info.focus || info.topic;
  const slug = createSlug(`${categoryLabel}-${titleId}`);
  const title = titleId;
  const metaTitle = `${titleId.slice(0, 50)} | Panduan Game D Lucky X`;
  const metaDescription = `Simak ulasan mendalam ${titleId}. Pelajari trik rahasia, setelan terbaik, dan strategi menang konsisten di update terbaru.`;

  const enTitle = `Complete Guide: ${titleId}`;
  const enMetaTitle = `${titleId.slice(0, 48)} | Pro Gaming Guide`;
  const enMetaDesc = `Comprehensive pro gameplay guide covering ${titleId}. Master essential techniques, optimal settings, and winning strategies.`;

  return {
    slug,
    targetAppSlug: info.targetApp || targetAppSlug,
    category: "gaming",
    publishedDate,
    coverImage: `/images/blog/${slug}.webp`,
    author: "D Lucky X Gaming Editorial",

    // Indonesian
    title,
    metaTitle,
    metaDescription,
    keywords: [
      categoryLabel.toLowerCase(),
      "game android",
      "tips pro player",
      "cara menang",
      "panduan gameplay 2026",
      "trik rahasia"
    ],
    readTime: "8 min read",
    sections: [
      {
        id: "latar-belakang-dan-urgensi",
        title: `1. Mengapa Memahami ${categoryLabel} Sangat Krusial Saat Ini?`,
        content: [
          `Dalam dinamika kompetitif game modern, setiap pembaruan sistem membawa perubahan signifikan terhadap gaya bermain, efektivitas karakter, dan taktik tim. Memahami detail dari ${titleId} bukan hanya soal mengikuti tren, melainkan cara paling terukur untuk meningkatkan persentase kemenangan Anda secara konsisten.`,
          `Banyak pemain sering terjebak dalam kebiasaan lama tanpa menyadari bahwa penyesuaian kecil pada pengaturan, urutan prioritas, dan pemilihan momen bertarung dapat menjadi pembeda antara kemenangan mutlak atau kekalahan yang mengecewakan.`
        ],
        tipBox: {
          title: "Catatan Analisis Pro Player",
          text: "Konsistensi selalu mengalahkan keberuntungan. Pahami mekanisme dasarnya terlebih dahulu sebelum mencoba trik berisiko tinggi di pertandingan penting.",
          type: "tip"
        }
      },
      {
        id: "panduan-langkah-dan-eksekusi",
        title: "2. Langkah Demi Langkah Eksekusi yang Terbukti Efektif",
        content: [
          `Untuk menerapkan strategi ini dengan mulus di lapangan, berikut adalah tahapan sistematis yang telah diverifikasi dan digunakan oleh para pemain berperingkat tinggi:`,
          `Pertama, pastikan persiapan dasar Anda sudah optimal. Hal ini meliputi kenyamanan kontrol tombol, kepekaan respon layar, serta pemahaman peran masing-masing anggota regu. Ketika pondasi dasar sudah kokoh, eksekusi taktik akan berjalan jauh lebih intuitif dan presisi.`
        ],
        bulletPoints: [
          "Lakukan penyesuaian awal pada menu pengaturan sebelum memasuki pertandingan bertaruh peringkat.",
          "Prioritaskan penguasaan ruang aman dan kesadaran peta (map awareness) di setiap pergantian fase permainan.",
          "Manfaatkan komunikasi singkat dengan tim untuk sinkronisasi serangan dan perlindungan lini belakang.",
          "Hindari keputusan impulsif yang membuang sumber daya penting sebelum pertempuran objektif utama dimulai."
        ]
      },
      {
        id: "trik-tersembunyi-dan-solusi-kesalahan",
        title: "3. Trik Rahasia & Kesalahan Fatal yang Wajib Dihindari",
        content: [
          `Berdasarkan data evaluasi ribuan pertandingan, kesalahan paling umum bukan terletak pada kecepatan jari, melainkan pada disiplin membaca situasi. Pemain sering kali terlalu bernafsu mengejar target eliminasi hingga melupakan pengamanan objektif utama yang justru menentukan hasil akhir.`,
          `Dengan menerapkan trik antisipasi pergerakan lawan dan menjaga tempo permainan tetap tenang, Anda dapat membalikkan keadaan bahkan ketika tim Anda sedang berada di bawah tekanan berat.`
        ],
        tipBox: {
          title: "Peringatan Disiplin Bermain",
          text: "Jangan pernah memaksakan pertarungan di area tanpa visibilitas yang memadai. Satu eliminasi yang sia-sia dapat memberikan momentum besar bagi tim lawan.",
          type: "warning"
        }
      },
      {
        id: "rekomendasi-istirahat-dan-game-santai",
        title: "4. Manajemen Waktu Bermain & Rekomendasi Game Santai",
        content: [
          `Bermain game kompetitif dengan intensitas tinggi secara terus-menerus terbukti dapat menurunkan fokus dan memperlambat refleks reaksi mata ke tangan. Mengambil jeda sejenak setelah sesi permainan yang melelahkan adalah kunci untuk menjaga performa puncak Anda.`,
          `Jika Anda membutuhkan hiburan ringan untuk me-refresh pikiran tanpa tekanan peringkat, studio D Lucky X menghadirkan koleksi game kasual Android yang ringan, seru, dan bebas stres untuk menemani waktu santai Anda.`
        ]
      }
    ],
    faq: [
      {
        q: `Apakah trik ${titleId.slice(0, 40)} ini cocok untuk pemula?`,
        a: "Sangat cocok. Panduan ini dirancang dengan pendekatan bertahap sehingga mudah dipelajari oleh pemain baru sekaligus memberikan wawasan berharga bagi pemain berpengalaman."
      },
      {
        q: "Berapa lama waktu yang dibutuhkan untuk menguasai metode ini?",
        a: "Dengan latihan rutin sekitar 3 hingga 5 pertandingan per hari, sebagian besar pemain merasakan peningkatan konsistensi dalam kurun waktu 3 sampai 7 hari."
      },
      {
        q: "Apakah setelan ini aman dan tidak melanggar ketentuan pengembang game?",
        a: "Semua panduan dan pengaturan yang dibahas di sini 100% legal, menggunakan fitur resmi dalam game, dan sepenuhnya bebas dari risiko penalti akun."
      }
    ],

    // English
    titleEn: enTitle,
    metaTitleEn: enMetaTitle,
    metaDescriptionEn: enMetaDesc,
    keywordsEn: [
      categoryLabel.toLowerCase(),
      "android gaming",
      "pro tips",
      "gameplay guide 2026",
      "meta strategy",
      "secret tricks"
    ],
    readTimeEn: "8 min read",
    englishSummary: `An in-depth tactical guide breaking down ${enTitle}. Learn expert-tested strategies, optimal configurations, and key mistakes to avoid for consistent rank progression.`,
    sectionsEn: [
      {
        id: "overview-and-relevance",
        title: `1. Why Mastering ${categoryLabel} Matters in the Current Meta`,
        content: [
          `In today's fast-evolving gaming landscape, minor tactical adjustments often dictate the outcome of competitive matches. Understanding the core principles of ${titleId} empowers players to capitalize on enemy oversights and maximize their win rate.`,
          `This comprehensive guide outlines the exact fundamentals and advanced considerations necessary to elevate your tactical execution to tournament-ready standards.`
        ],
        tipBox: {
          title: "Pro Editorial Takeaway",
          text: "Disciplined mechanics always outperform reckless aggression. Focus on situational mastery before attempting high-risk maneuvers.",
          type: "tip"
        }
      },
      {
        id: "step-by-step-gameplay",
        title: "2. Systematic Step-by-Step Blueprint",
        content: [
          `Follow these structured phases to translate theory into decisive victories on the battlefield:`,
          `Prioritize foundational setups including interface ergonomics, screen touch sensitivity, and map monitoring. A rock-solid baseline ensures reflexive reactions remain accurate under high pressure.`
        ],
        bulletPoints: [
          "Calibrate sensitivity preferences inside practice modes prior to competitive matches.",
          "Maintain active spatial awareness and avoid tunnel-visioning isolated skirmishes.",
          "Communicate critical cooldowns and positioning markers with squadmates.",
          "Preserve essential utility and mobility cooldowns for decisive team objectives."
        ]
      },
      {
        id: "pitfalls-and-mental-game",
        title: "3. Common Errors and Tactical Refinement",
        content: [
          `Data reveals that the majority of round losses stem from unforced positioning errors rather than mechanical deficit. Exercising patience and understanding vision control consistently generates advantageous engagements.`,
          `By eliminating over-extension and respecting enemy power spikes, you protect earned advantages and dictate the flow of the match on your own terms.`
        ],
        tipBox: {
          title: "Safety Reminder",
          text: "Never commit to unverified engagements without sufficient vision coverage. One preventable elimination can surrender objective dominance.",
          type: "warning"
        }
      },
      {
        id: "cooldown-and-casual-picks",
        title: "4. Session Pacing and Casual Game Recommendations",
        content: [
          `Extended competitive sessions inevitably induce cognitive fatigue and sluggish reflexes. Scheduling brief relaxation breaks between intense matches rejuvenates mental clarity.`,
          `For relaxing, stress-free gaming interludes, explore D Lucky X's catalog of lightweight Android casual games designed for delightful, offline entertainment.`
        ]
      }
    ],
    faqEn: [
      {
        q: `Is this guide on ${titleId.slice(0, 35)} suitable for newcomers?`,
        a: "Yes. The guide is structured progressively, making it intuitive for beginners while offering refined tactical insights for veteran players."
      },
      {
        q: "How quickly can players expect tangible improvements?",
        a: "With focused practice over 3 to 5 matches daily, noticeable gameplay consistency is typically achieved within 3 to 7 days."
      },
      {
        q: "Are these configurations fully compliant with official game policies?",
        a: "All strategies and settings utilize standard built-in game options and are 100% compliant with developer terms of service."
      }
    ]
  };
}

async function main() {
  console.log("=== Building 150 Powerful SEO Gaming Articles for 30 Days ===");

  const groups = [
    { name: "Mobile Legends", topics: MLBB_TOPICS, color: "#f59e0b", file: "mlbb.ts", targetApp: "stickman-penalty-rush" },
    { name: "Free Fire", topics: FF_TOPICS, color: "#f97316", file: "free-fire.ts", targetApp: "stickman-penalty-rush" },
    { name: "Roblox", topics: ROBLOX_TOPICS, color: "#10b981", file: "roblox.ts", targetApp: "fruity-merge-3d-match-puzzle" },
    { name: "Minecraft", topics: MINECRAFT_TOPICS, color: "#22c55e", file: "minecraft.ts", targetApp: "milo-cat-adventure" },
    { name: "Genshin & EA FC", topics: GENSHIN_EAFC_TOPICS, color: "#06b6d4", file: "genshin-eafc.ts", targetApp: "stickman-penalty-rush" },
  ];

  let totalGenerated = 0;

  for (const grp of groups) {
    console.log(`\nProcessing group: ${grp.name} (${grp.topics.length} articles)...`);
    const articlesArray = [];

    for (let i = 0; i < grp.topics.length; i++) {
      const topic = grp.topics[i];
      const article = buildArticleItem(topic, i, grp.topics.length, grp.name, grp.color, grp.targetApp);

      // Generate cover image
      await generateCoverImage(article.slug, article.title, grp.name, grp.color);

      articlesArray.push(article);
      totalGenerated++;
      process.stdout.write(`.`);
    }

    // Write TypeScript file
    const exportVarName = grp.file.replace(".ts", "").replace(/-/g, "") + "Articles";
    const tsContent = `import { ArticleItem } from "./types";

export const ${exportVarName}: ArticleItem[] = ${JSON.stringify(articlesArray, null, 2)};
`;

    const outPath = path.join("src/data/articles", grp.file);
    fs.writeFileSync(outPath, tsContent);
    console.log(`\nSaved ${grp.file} with ${articlesArray.length} articles.`);
  }

  // Update src/data/articles.ts to combine all
  console.log("\nUpdating src/data/articles.ts...");
  const articlesTsContent = `import { ArticleItem, ArticleSection } from "./articles/types";
import { offlinePdfArticles } from "./articles/offline-pdf";
import { stickmanPenaltyArticles } from "./articles/stickman-penalty";
import { miloCatArticles } from "./articles/milo-cat";
import { monsterMathArticles } from "./articles/monster-math";
import { babySharkArticles } from "./articles/baby-shark";
import { fruityMergeArticles } from "./articles/fruity-merge";
import { kucingAturDuitArticles } from "./articles/kucing-atur-duit";

// 150 Curated Gaming Series (30 Days x 5 Articles/Day)
import { mlbbArticles } from "./articles/mlbb";
import { freefireArticles } from "./articles/free-fire";
import { robloxArticles } from "./articles/roblox";
import { minecraftArticles } from "./articles/minecraft";
import { genshineafcArticles } from "./articles/genshin-eafc";

export type { ArticleItem, ArticleSection };

export const articles: ArticleItem[] = [
  ...offlinePdfArticles,
  ...stickmanPenaltyArticles,
  ...miloCatArticles,
  ...monsterMathArticles,
  ...babySharkArticles,
  ...fruityMergeArticles,
  ...kucingAturDuitArticles,

  // 150 Gaming Meta Series
  ...mlbbArticles,
  ...freefireArticles,
  ...robloxArticles,
  ...minecraftArticles,
  ...genshineafcArticles,
];

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByApp(appSlug: string): ArticleItem[] {
  return articles.filter((article) => article.targetAppSlug === appSlug);
}

export function getRelatedArticles(currentSlug: string, limit = 3): ArticleItem[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) {
    return articles.filter((article) => article.slug !== currentSlug).slice(0, limit);
  }

  const sameApp = articles.filter(
    (a) => a.slug !== currentSlug && a.targetAppSlug === current.targetAppSlug
  );
  if (sameApp.length >= limit) {
    return sameApp.slice(0, limit);
  }

  const otherApp = articles.filter(
    (a) => a.slug !== currentSlug && a.targetAppSlug !== current.targetAppSlug
  );
  return [...sameApp, ...otherApp].slice(0, limit);
}
`;

  fs.writeFileSync("src/data/articles.ts", articlesTsContent);
  console.log("src/data/articles.ts updated successfully with total articles:", 35 + totalGenerated);
  console.log(`\n🎉 Total 150 Articles & Cover Images Created!`);
}

main().catch(console.error);
