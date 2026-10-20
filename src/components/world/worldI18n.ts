/**
 * worldI18n.ts - Centralized Internationalization System for D Lucky World 3D
 * Automatically detects Indonesian vs International visitors, with manual toggle persistence.
 */

export type WorldLang = "id" | "en";

export function detectUserLanguage(): WorldLang {
  if (typeof window === "undefined") return "id";
  try {
    const saved = localStorage.getItem("dlucky_world_lang");
    if (saved === "id" || saved === "en") return saved;

    // Check navigator language
    const languages = navigator.languages || [navigator.language || ""];
    for (const lang of languages) {
      if (lang && lang.toLowerCase().startsWith("id")) {
        return "id";
      }
    }
  } catch {
    // ignore
  }
  return "en";
}

export function saveUserLanguage(lang: WorldLang): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("dlucky_world_lang", lang);
  } catch {}
}

export const WORLD_STRINGS = {
  id: {
    common: {
      gameTitle: "D LUCKY WORLD",
      gameBadge: "3D",
      studioName: "DLUCKYX GAMES",
      experience: "PENGALAMAN",
      byStudio: "Oleh D Lucky X Studios",
      serverStatus: "Server Global • 60 FPS",
      readyToPlay: "Siap Dimainkan",
      pressEnter: "Tekan [ENTER] untuk Mulai",
      soundOn: "Suara Aktif",
      muted: "Bisu",
      skip: "Lewati",
      close: "Tutup",
      back: "Kembali",
      coins: "Koin",
      exp: "EXP",
      interact: "Interaksi",
      talkTo: "Bicara dengan",
      goalCelebration: "GOOOL! +100 EXP",
      challenge: "TANTANGAN",
      quitChallenge: "Batalkan",
      challengeWon: "TANTANGAN SELESAI! +5 KOIN EMAS!",
      challengeLost: "WAKTU HABIS! Coba bicara lagi untuk mengulang.",
      targets: "TARGET",
      keyboardHint: "WASD + Space + Shift + E",
      mobileHint: "Layar Sentuh & Gamepad Didukung",
      copyright: "© 2026 D Lucky X Games. Hak Cipta Dilindungi.",
    },
    loading: {
      statuses: [
        "Menghubungkan ke Server D Lucky World...",
        "Memuat Medan 3D, Pantai & Pohon Palem...",
        "Memanggil Warga Pulau & Kios Pasar...",
        "Menyiapkan Ombak Laut & Satwa Liar...",
        "Petualangan Siap! Memulai Penjelajahan...",
      ],
      tips: [
        "Sprint lewati jembatan batu dengan menahan [SHIFT] di keyboard atau tombol [SPRINT] di layar HP!",
        "Tendang bola sepak raksasa di Beach Stadium ke dalam gawang untuk cetak GOAL spektakuler!",
        "Masuklah langsung ke laut—Milo otomatis berenang mulus melintasi terumbu karang!",
        "Tekan [M] kapan saja untuk membuka Peta & Fast Travel ke pulau mana pun yang sudah ditemukan!",
        "Temui warga pulau seperti Mang Ujang di kios buah dan Pak Mamat di dermaga pancing!",
        "Temukan seluruh 30 Koin Emas tersembunyi di kepulauan untuk jadi Juara Kepulauan!",
      ],
    },
    mainMenu: {
      tagline: "Petualangan 3D Pesisir",
      subtitle: "Jelajahi pulau tropis, berenang di terumbu karang, main sepak bola pantai, dan kumpulkan 30 Koin Emas!",
      playNow: "MAIN SEKARANG",
      howToPlay: "Cara Bermain",
      islandAtlas: "Atlas Pulau",
      controlsTitle: "Cara Bermain & Kendali",
      controlsDesc: "Kendali praktis untuk keyboard & layar sentuh",
      keyboardTitle: "Kendali Keyboard",
      touchTitle: "Kendali Layar Sentuh",
      touchDesc1: "• Layar Kiri: D-Pad 4 Arah untuk bergerak dan berbelok mulus.",
      touchDesc2: "• Layar Kanan: Tombol aksi Lompat (Hijau) dan Sprint (Cyan).",
      touchDesc3: "• Tombol Peta: Ketuk MAP di pojok kanan atas untuk berpindah pulau instan.",
      startBtn: "Mulai Petualangan",
      atlasTitle: "Atlas Kepulauan",
      atlasDesc: "5 destinasi pesisir unik untuk dijelajahi",
      exploreBtn: "Jelajahi Sekarang",
    },
    pauseMenu: {
      title: "GAME DIJEDA",
      suspended: "PENJELAJAHAN DIJEDA",
      currentRegion: "WILAYAH SAAT INI",
      goldTokens: "KOIN EMAS",
      questsCompleted: "MISI SELESAI",
      resume: "LANJUTKAN PETUALANGAN",
      mapFastTravel: "PETA KEPULAUAN & FAST TRAVEL",
      howToPlay: "CARA BERMAIN & KENDALI",
      soundEffects: "EFEK SUARA & AMBIENCE",
      backgroundMusic: "MUSIK LATAR (BGM)",
      weatherTitle: "KONDISI CUACA & WAKTU",
      weatherAuto: "Jam Nyata (IP)",
      weatherAutoDesc: "Mengikuti waktu real-life pemain",
      weatherDay: "Siang",
      weatherNight: "Malam",
      weatherRain: "Hujan",
      weatherSnow: "Salju",
      cinematicTitle: "KEPULAUAN CENTRAL PLAZA",
      cinematicSubtitle: "Pelabuhan Awal & Dermaga Dagang",
      cinematicSkip: "Ketuk Layar atau [SPASI] untuk Lewati",
      mainTitle: "MENU UTAMA",
      exitWeb: "KELUAR KE WEB",
      respawn: "KEMBALI KE SPAWN UTAMA",
    },
    hud: {
      menu: "Menu",
      map: "Peta",
      agility: "KELINCAHAN",
      locations: {
        "Central Plaza": "Plaza Utama",
        "MOBA Sanctuary": "Kuil Keramat MOBA",
        "Beach Stadium": "Stadion Pantai",
        "Battle Royale Outpost": "Pos Pengawas Battle Royale",
        "Open Ocean": "Lautan Lepas",
      },
      subtitles: {
        "Central Plaza": "Pelabuhan Awal & Dermaga Dagang",
        "MOBA Sanctuary": "Benteng Kuno Pusaka Pedang Keramat",
        "Beach Stadium": "Arena Pantai & Pesisir Penendang",
        "Battle Royale Outpost": "Menara Pengawas & Peti Suplai Taktis",
        "Open Ocean": "Terumbu Karang Biru & Jalur Bahari",
      },
    },
    slate: {
      title: "ATLAS KEPULAUAN",
      status: "PETA AKTIF",
      subtitle: "Panduan Wisata & Peta D Lucky World",
      tabMap: "Peta",
      tabQuests: "Misi",
      tabResidents: "Warga",
      tabGames: "Game",
      coords: "KOORDINAT",
      fastTravelTitle: "Titik Fast Travel (Pindah Cepat)",
      teleport: "Kunjungi",
      questsTitle: "Buku Misi Petualang",
      residentsTitle: "Daftar Warga & Toko",
      gamesTitle: "Arena Game & Portofolio",
      googlePlay: "Mainkan",
    },
  },
  en: {
    common: {
      gameTitle: "D LUCKY WORLD",
      gameBadge: "3D",
      studioName: "DLUCKYX GAMES",
      experience: "EXPERIENCE",
      byStudio: "By D Lucky X Studios",
      serverStatus: "Global Server • 60 FPS",
      readyToPlay: "Ready to Play",
      pressEnter: "Press [ENTER] to Launch",
      soundOn: "Sound On",
      muted: "Muted",
      skip: "Skip",
      close: "Close",
      back: "Back",
      coins: "Coins",
      exp: "EXP",
      interact: "Interact",
      talkTo: "Talk to",
      goalCelebration: "GOAAAL! +100 EXP",
      challenge: "CHALLENGE",
      quitChallenge: "Quit",
      challengeWon: "CHALLENGE COMPLETE! +5 GOLD TOKENS!",
      challengeLost: "TIME EXPIRED! Talk to resident to retry.",
      targets: "TARGETS",
      keyboardHint: "WASD + Space + Shift + E",
      mobileHint: "Touch & Gamepad Supported",
      copyright: "© 2026 D Lucky X Games. All rights reserved.",
    },
    loading: {
      statuses: [
        "Connecting to D Lucky World Server...",
        "Loading 3D Terrain, Beaches & Palms...",
        "Spawning Island Residents & Market Stalls...",
        "Preparing Ocean Currents & Wildlife...",
        "Experience Ready! Launching Adventure...",
      ],
      tips: [
        "Sprint across stone bridges by holding [SHIFT] on keyboard or tapping [SPRINT] on mobile!",
        "Kick the giant soccer ball at Beach Stadium into the net to score a spectacular GOAL!",
        "Walk straight into the ocean—Milo will automatically swim smoothly across the reefs!",
        "Press [M] anytime to open your Map & Fast Travel to any discovered island instantly!",
        "Meet island villagers like Mang Ujang at the fruit stall and Pak Mamat at the fishing dock!",
        "Find all 30 hidden Gold Tokens scattered across the archipelago to become the Champion!",
      ],
    },
    mainMenu: {
      tagline: "3D Coastal Adventure",
      subtitle: "Explore tropical islands, swim across reefs, play beach soccer, and collect all 30 Gold Tokens!",
      playNow: "PLAY NOW",
      howToPlay: "How to Play",
      islandAtlas: "Island Atlas",
      controlsTitle: "How to Play & Controls",
      controlsDesc: "Simple controls for keyboard & touch",
      keyboardTitle: "Keyboard Controls",
      touchTitle: "Mobile Touch Controls",
      touchDesc1: "• Left Screen: 4-Way D-Pad to move and turn smoothly.",
      touchDesc2: "• Right Screen: Dedicated Jump (Green) and Sprint (Cyan) buttons.",
      touchDesc3: "• Map Button: Tap MAP at top-right for fast travel to any discovered island.",
      startBtn: "Start Adventure",
      atlasTitle: "Island Atlas",
      atlasDesc: "Explore 5 unique coastal destinations",
      exploreBtn: "Explore Now",
    },
    pauseMenu: {
      title: "GAME PAUSED",
      suspended: "EXPEDITION SUSPENDED",
      currentRegion: "CURRENT REGION",
      goldTokens: "GOLDEN TOKENS",
      questsCompleted: "QUESTS COMPLETED",
      resume: "RESUME EXPEDITION",
      mapFastTravel: "ARCHIPELAGO MAP & FAST TRAVEL",
      howToPlay: "HOW TO PLAY & CONTROLS",
      soundEffects: "SOUND EFFECTS & AMBIENCE",
      backgroundMusic: "BACKGROUND MUSIC (BGM)",
      weatherTitle: "WEATHER & TIME OF DAY",
      weatherAuto: "Real-Time (IP)",
      weatherAutoDesc: "Follows player local real-life time",
      weatherDay: "Day",
      weatherNight: "Night",
      weatherRain: "Rain",
      weatherSnow: "Snow",
      cinematicTitle: "CENTRAL PLAZA ARCHIPELAGO",
      cinematicSubtitle: "Port of Beginnings & Merchant Docks",
      cinematicSkip: "Tap Screen or [SPACE] to Skip",
      mainTitle: "MAIN TITLE",
      exitWeb: "EXIT TO WEB",
      respawn: "RESPAWN AT CENTRAL PLAZA",
    },
    hud: {
      menu: "Menu",
      map: "Map",
      agility: "AGILITY",
      locations: {
        "Central Plaza": "Central Plaza",
        "MOBA Sanctuary": "MOBA Sanctuary",
        "Beach Stadium": "Beach Stadium",
        "Battle Royale Outpost": "Battle Royale Outpost",
        "Open Ocean": "Open Ocean",
      },
      subtitles: {
        "Central Plaza": "Port of Beginnings & Merchant Docks",
        "MOBA Sanctuary": "Ancient Citadel of the Sacred Blades",
        "Beach Stadium": "Coastal Arena & Striker's Shore",
        "Battle Royale Outpost": "Fortified Watchtower & Supply Caches",
        "Open Ocean": "Azure Reefs & Maritime Channel",
      },
    },
    slate: {
      title: "ISLAND ATLAS",
      status: "MAP ACTIVE",
      subtitle: "D Lucky World Archipelago Atlas",
      tabMap: "Map",
      tabQuests: "Quests",
      tabResidents: "Residents",
      tabGames: "Games",
      coords: "COORDINATES",
      fastTravelTitle: "Fast Travel Waypoints",
      teleport: "Travel",
      questsTitle: "Adventure Quest Log",
      residentsTitle: "Archipelago Residents",
      gamesTitle: "Games & Apps Portfolio",
      googlePlay: "Play",
    },
  },
};

// Bilingual NPC & Villager Dialogues
export const BILINGUAL_NPCS: Record<
  string,
  {
    name: { id: string; en: string };
    title: { id: string; en: string };
    island: { id: string; en: string };
    dialogue: { id: string[]; en: string[] };
    challenge?: {
      title: { id: string; en: string };
      instructions: { id: string; en: string };
    };
  }
> = {
  lexa: {
    name: { id: "Lexa sang Penjelajah", en: "Lexa the Explorer" },
    title: { id: "Navigator Kepulauan", en: "Archipelago Navigator" },
    island: { id: "Plaza Utama", en: "Central Plaza" },
    dialogue: {
      id: [
        "Halo Milo! Selamat datang di Kepulauan Game D Lucky World 3D!",
        "Sprint dan lompati jembatan gantung indah yang menghubungkan Kuil MOBA, Pos Battle Royale, dan Stadion Sepak Bola Pantai.",
        "Kumpulkan 30 koin emas arkade, ikuti tantangan warga pulau, dan cetak gol spektakuler di stadion pantai!",
      ],
      en: [
        "Hello Milo! Welcome to the Coastal Gaming Archipelago!",
        "Sprint and leap across the scenic suspension bridges linking MOBA Sanctuary, Battle Royale Outpost, and the Soccer Arena.",
        "Collect 30 gold arcade tokens, challenge the island champions, and score a screamer at the beach stadium!",
      ],
    },
    challenge: {
      title: { id: "Lari Cepat Kepulauan", en: "Archipelago Dash" },
      instructions: {
        id: "Sprint dan lewati 3 pos cincin emas di sepanjang jembatan dermaga kayu!",
        en: "Sprint and pass through 3 golden checkpoint rings along the wooden pier bridge!",
      },
    },
  },
  valen: {
    name: { id: "Kesatria Valen", en: "Valen the Knight" },
    title: { id: "Grandmaster MOBA", en: "MOBA Grandmaster" },
    island: { id: "Kuil Keramat MOBA", en: "MOBA Sanctuary" },
    dialogue: {
      id: [
        "Salam, sang juara! Kamu berdiri di depan Monolit Para Pendahulu.",
        "Kristal ametis berkilau di atas altar kami memancarkan intisari penguasaan taktik dan strategi.",
        "Waktu yang tepat dan penguasaan posisi adalah ciri khas sejati seorang Grandmaster!",
      ],
      en: [
        "Greetings, star champion! You stand before the Monolith of the Ancients.",
        "The glowing amethyst crystal above our altar radiates the essence of tactical mastery.",
        "Impeccable timing and lane positioning are the true hallmarks of a Grandmaster!",
      ],
    },
    challenge: {
      title: { id: "Rune Kuil Kuno", en: "Ancient Sanctuary Runes" },
      instructions: {
        id: "Dekati dan lewati 3 batu rune bercahaya di sekitar pilar kuil keramat!",
        en: "Walk through 3 illuminated rune stones around the sanctuary columns!",
      },
    },
  },
  jax: {
    name: { id: "Kapten Jax", en: "Captain Jax" },
    title: { id: "Pembalap Perahu Cepat", en: "Speedboat Racing Ace" },
    island: { id: "Pos Pengawas BR", en: "Battle Royale Outpost" },
    dialogue: {
      id: [
        "Milo! Selamat datang di Dermaga Balap Pulau Battle Royale!",
        "Nyalakan mesin speedboat-mu, kita akan balapan mengelilingi seluruh pulau di lautan lepas!",
        "Ikuti panduan panah belok laut, terobos cincin kecepatan untuk koin bonus, dan kalahkan perahuku menuju garis finish!",
      ],
      en: [
        "Milo! Welcome to the Battle Royale Speedboat Racing Marina!",
        "Fire up your engine, we're going to race all the way around the island in the open ocean!",
        "Follow the marine turn arrows, hit the boost rings for gold coins, and beat my boat to the finish line!",
      ],
    },
    challenge: {
      title: { id: "Grand Prix Perahu Lautan", en: "Nautical Speedboat Grand Prix" },
      instructions: {
        id: "Kemudikan perahu balap mengelilingi pulau, lewati cincin koin, dan capai garis Finish di depan Jax!",
        en: "Pilot your speedboat around the island, boost through coin rings, and beat Jax to the finish line!",
      },
    },
  },
  leo: {
    name: { id: "Leo sang Striker", en: "Leo the Striker" },
    title: { id: "Penyerang Utama #10", en: "Striker #10" },
    island: { id: "Stadion Pantai", en: "Beach Stadium" },
    dialogue: {
      id: [
        "Ayo Milo! Rumput pasir stadion pantai sudah siap untuk aksi tendangan terbaikmu!",
        "Giring bola raksasa itu melewati tiang gawang dan jebol gawang lawan!",
        "Tunjukkan bahwa kamu adalah striker nomor satu di seluruh kepulauan!",
      ],
      en: [
        "Hey Milo! The beach stadium sand pitch is warmed up and ready for your best strikes!",
        "Dribble the giant soccer ball past the posts and slam it into the back of the net!",
        "Show the archipelago that you have the footwork of a true #10 champion!",
      ],
    },
    challenge: {
      title: { id: "Penendang Emas", en: "Golden Striker" },
      instructions: {
        id: "Giring dan tendang bola sepak raksasa ke dalam gawang sebanyak 3 kali!",
        en: "Dribble and kick the giant soccer ball into the goal net 3 times!",
      },
    },
  },
  mang_ujang: {
    name: { id: "Mang Ujang", en: "Mang Ujang" },
    title: { id: "Pedagang Buah Segar", en: "Fruit Merchant" },
    island: { id: "Pasar Plaza Utama", en: "Central Plaza Market" },
    dialogue: {
      id: [
        "Sampurasun Milo! Mau buah semangka manis atau apel segar dari kebun pesisir?",
        "Segar-segar buahnya, pas sekali untuk bekal keliling pulau sambil lari dan lompat!",
        "Jangan lupa mampir ke dermaga sebelah, Pak Mamat lagi asyik memancing tuh!",
      ],
      en: [
        "Welcome Milo! Care for sweet watermelons or crisp apples fresh from the orchards?",
        "Fresh and delicious fruits, perfect fuel for running and jumping across the islands!",
        "Don't forget to visit the nearby pier, Pak Mamat is enjoying his fishing session!",
      ],
    },
  },
  luna: {
    name: { id: "Alkemis Luna", en: "Alchemist Luna" },
    title: { id: "Pakar Ramuan Berkilau", en: "Potion Master" },
    island: { id: "Bazar Plaza", en: "Plaza Bazaar" },
    dialogue: {
      id: [
        "Ah, kucing penjelajah yang berani! Lihatlah kuali tembagaku yang mendidih dengan ramuan bintang.",
        "Kecubung dan kristal laut menghasilkan ekstrak kelincahan yang membuat langkahmu seringan angin sepoi-sepoi.",
        "Semoga angin laut membawakanmu keberuntungan dalam mengumpulkan seluruh koin emas!",
      ],
      en: [
        "Ah, brave traveler cat! Gaze upon my copper cauldron bubbling with star tinctures.",
        "Sea crystals and amethyst produce an essence of swiftness, making your steps light as the sea breeze.",
        "May the trade winds bring you good fortune on your quest for the golden tokens!",
      ],
    },
  },
  riko: {
    name: { id: "Riko", en: "Riko" },
    title: { id: "Barista Kelapa Pantai", en: "Beach Coconut Bartender" },
    island: { id: "Pesisir Plaza", en: "Central Beachside" },
    dialogue: {
      id: [
        "Selamat siang penjelajah! Es kelapa muda dingin langsung dari pohon siap menyegarkanmu!",
        "Duduk santai di bawah atap jerami sambil menikmati semilir angin pantai dan deburan ombak.",
        "Nikmati petualanganmu di D Lucky World!",
      ],
      en: [
        "Good day explorer! Chilled fresh coconut water right from the palm trees, ready to refresh you!",
        "Relax under the thatched roof, feel the ocean breeze and listen to the gentle waves.",
        "Enjoy your wonderful adventure in D Lucky World!",
      ],
    },
  },
  pak_mamat: {
    name: { id: "Pak Mamat", en: "Pak Mamat" },
    title: { id: "Pemancing Handal", en: "Master Angler" },
    island: { id: "Dermaga Plaza Utama", en: "Central Fishing Pier" },
    dialogue: {
      id: [
        "Ssst, pelan-pelan Milo, nanti ikannya kaget! Hari ini air laut tenang sekali.",
        "Umpan bambuku baru saja disambar ikan kakap merah besar! Mancing di sini memang paling damai.",
        "Kadang-kadang ada perahu layar Dewi Samudra lewat di teluk membawa pelaut ramah.",
      ],
      en: [
        "Shh, tread softly Milo, you might startle the fish! The sea is wonderfully calm today.",
        "My bamboo line just had a nibble from a big red snapper! Fishing here is pure tranquility.",
        "Every now and then, the sloop Dewi Samudra cruises across the bay with friendly sailors.",
      ],
    },
  },
  joko: {
    name: { id: "Joko", en: "Joko" },
    title: { id: "Nelayan Karang", en: "Reef Fisherman" },
    island: { id: "Batu Karang Pesisir", en: "Coastal Rocks" },
    dialogue: {
      id: [
        "Angin laut sedang bagus hari ini! Ombak membawa banyak ikan karang mendekati pantai.",
        "Hati-hati melompat di atas batu licin ya, Milo. Kalau tercebur, tenang saja kamu bisa berenang cepat!",
      ],
      en: [
        "The sea breeze is glorious today! The swell is bringing schools of reef fish close to shore.",
        "Watch your footing on the wet rocks, Milo. If you slip, no worries—you're a natural swimmer!",
      ],
    },
  },
  kai: {
    name: { id: "Kai si Pembangun", en: "Kai the Builder" },
    title: { id: "Arsitek Teluk Heksagon", en: "Hexagon Bay Mason" },
    island: { id: "Teluk Kotak Sandbox", en: "Hexagon Sandbox Bay" },
    dialogue: {
      id: [
        "Halo Milo! Selamat datang di Teluk Kotak Heksagon!",
        "Aku baru saja merancang lintasan rintangan balok melayang ala Super Mario di atas laguna teluk ini!",
        "Lompati balok terapung, tabrak balok misteri [?], dan capai Tiang Bendera Finish di puncak sebelum waktu habis!",
      ],
      en: [
        "Welcome to Hexagon Sandbox Bay, Milo!",
        "I just constructed an aerial 3D obstacle course inspired by Super Mario above our crystal lagoon!",
        "Leap across floating platforms, hit the mystery [?] blocks, and touch the Finish Flagpole at the summit before time runs out!",
      ],
    },
    challenge: {
      title: { id: "Tantangan Balok Super Milo", en: "Super Milo 3D Hexagon Run" },
      instructions: {
        id: "Lompati balok melayang, benturkan balok [?], dan capai Tiang Bendera Finish!",
        en: "Leap across floating blocks, bump mystery [?] blocks, and touch the Finish Flagpole!",
      },
    },
  },
};

// Bilingual Quests for Navigator's Slate
// One mission per place on the map. The key is the minigame id, so winning it ticks the mission off.
export const BILINGUAL_QUESTS: Record<
  string,
  {
    title: { id: string; en: string };
    desc: { id: string; en: string };
    reward: { id: string; en: string };
    place: { id: string; en: string };
  }
> = {
  ring_trial: {
    title: { id: "Slalom Plaza", en: "Plaza Slalom" },
    desc: {
      id: "Lewati 5 cincin neon di sekitar Central Plaza sebelum waktu habis. Bicara dengan Lexa untuk memulai.",
      en: "Pass through 5 neon rings around Central Plaza before time runs out. Talk to Lexa to start.",
    },
    reward: { id: "+5 Koin", en: "+5 Coins" },
    place: { id: "Central Plaza", en: "Central Plaza" },
  },
  penalty_kick: {
    title: { id: "Tendangan Emas", en: "Golden Shootout" },
    desc: {
      id: "Giring bola dan masukkan 3 kali ke zona gawang emas di stadion. Bicara dengan Leo untuk memulai.",
      en: "Dribble and score 3 times into the golden goal zones in the stadium. Talk to Leo to start.",
    },
    reward: { id: "+5 Koin", en: "+5 Coins" },
    place: { id: "Arena Sepak Bola", en: "Arcade Soccer Arena" },
  },
  crystal_runes: {
    title: { id: "Rune Kuil Keramat", en: "Sanctuary Runes" },
    desc: {
      id: "Aktifkan 4 rune kuno di sekitar altar dalam 35 detik. Bicara dengan Valen untuk memulai.",
      en: "Activate 4 ancient runes around the altar within 35 seconds. Talk to Valen to start.",
    },
    reward: { id: "+5 Koin", en: "+5 Coins" },
    place: { id: "Kuil MOBA", en: "MOBA Sanctuary" },
  },
  airdrop_hunt: {
    title: { id: "Balap Perahu", en: "Boat Grand Prix" },
    desc: {
      id: "Balap 2 putaran mengelilingi pulau dan kalahkan Jax ke garis finis. Bicara dengan Jax untuk memulai.",
      en: "Race 2 laps around the island and beat Jax to the finish line. Talk to Jax to start.",
    },
    reward: { id: "+10 Koin", en: "+10 Coins" },
    place: { id: "Pos Battle Royale", en: "Battle Royale Outpost" },
  },
  hex_mario_run: {
    title: { id: "Lintasan Super Milo", en: "Super Milo Course" },
    desc: {
      id: "Lompati balok heksagon melayang dan sentuh tiang bendera finish. Bicara dengan Kai untuk memulai.",
      en: "Jump across the floating hexagon blocks and touch the finish flagpole. Talk to Kai to start.",
    },
    reward: { id: "+10 Koin", en: "+10 Coins" },
    place: { id: "Teluk Heksagon", en: "Hexagon Sandbox Bay" },
  },
};

// Bilingual Residents Directory
export const BILINGUAL_RESIDENTS = [
  {
    id: "milo",
    name: { id: "Milo si Kucing", en: "Milo the Cat" },
    role: { id: "Maskot & Penjelajah Kepulauan", en: "Expedition Mascot & Explorer" },
    location: { id: "Keliling Kepulauan", en: "Archipelago Wanderer" },
    avatar: "🐱",
    desc: {
      id: "Kucing penjelajah pemberani yang mencari 30 Koin Emas arkade di seluruh pulau.",
      en: "The brave feline protagonist wandering the islands, searching for ancient Golden Tokens.",
    },
  },
  {
    id: "lexa",
    name: { id: "Lexa sang Penjelajah", en: "Lexa the Explorer" },
    role: { id: "Navigator Kepulauan", en: "Archipelago Navigator" },
    location: { id: "Plaza Utama", en: "Central Plaza" },
    avatar: "🧭",
    desc: {
      id: "Petualang ramah yang memandu para pendatang baru melintasi jembatan dan dermaga kepulauan.",
      en: "A cheerful voyager guiding newcomers through scenic suspension bridges and archipelagos.",
    },
  },
  {
    id: "ujang",
    name: { id: "Mang Ujang", en: "Mang Ujang" },
    role: { id: "Pedagang Buah Segar", en: "Fruit Merchant" },
    location: { id: "Pasar Plaza Utama", en: "Central Plaza Market" },
    avatar: "🍎",
    desc: {
      id: "Menjual semangka manis, jeruk, dan apel segar dari kebun pesisir tropis.",
      en: "Sells fresh watermelons, citrus, and apples harvested from the coastal orchards.",
    },
  },
  {
    id: "luna",
    name: { id: "Alkemis Luna", en: "Alchemist Luna" },
    role: { id: "Pakar Ramuan Bintang", en: "Potion Master" },
    location: { id: "Bazar Plaza", en: "Plaza Bazaar" },
    avatar: "🧪",
    desc: {
      id: "Meracik ramuan kecepatan mendidih dan tingtur bintang di kuali tembaga miliknya.",
      en: "Brews bubbling speed elixirs and glowing star tinctures in her copper cauldron.",
    },
  },
  {
    id: "mamat",
    name: { id: "Pak Mamat", en: "Pak Mamat" },
    role: { id: "Pemancing Handal", en: "Master Angler" },
    location: { id: "Dermaga Plaza Utama", en: "Central Fishing Pier" },
    avatar: "🎣",
    desc: {
      id: "Pemancing kawakan yang duduk santai di tepi dermaga menangkap ikan kakap merah segar.",
      en: "A veteran coastal fisherman sitting at the pier edge, catching red snappers and reef fish.",
    },
  },
  {
    id: "valen",
    name: { id: "Kesatria Valen", en: "Valen the Knight" },
    role: { id: "Grandmaster Penjaga Kuil", en: "Grandmaster Guardian" },
    location: { id: "Kuil Keramat MOBA", en: "MOBA Sanctuary" },
    avatar: "⚔️",
    desc: {
      id: "Menjaga pilar marmer kuno dan pusaka pedang suci pelindung kepulauan.",
      en: "Stands watch over the ancient marble sanctuary columns and the sacred MOBA blades.",
    },
  },
  {
    id: "leo",
    name: { id: "Leo sang Striker", en: "Leo the Striker" },
    role: { id: "Penyerang Bintang #10", en: "Striker #10" },
    location: { id: "Stadion Pantai", en: "Beach Stadium" },
    avatar: "⚽",
    desc: {
      id: "Penyerang sepak bola handal yang menantang para penjelajah mencetak gol di pasir pantai.",
      en: "The star soccer forward challenging adventurers to score goals on the sandy beach pitch.",
    },
  },
  {
    id: "jax",
    name: { id: "Kapten Jax", en: "Captain Jax" },
    role: { id: "Pembalap Perahu Cepat", en: "Speedboat Grand Prix Ace" },
    location: { id: "Pos Pengawas BR", en: "Battle Royale Outpost" },
    avatar: "🛥️",
    desc: {
      id: "Juara bertahan balapan perahu cepat mengelilingi samudra pulau Battle Royale.",
      en: "Defending champion of the high-speed marine circuit around Battle Royale Island.",
    },
  },
  {
    id: "kai",
    name: { id: "Kai si Pembangun", en: "Kai the Builder" },
    role: { id: "Arsitek Teluk Heksagon", en: "Hexagon Bay Mason" },
    location: { id: "Teluk Kotak Sandbox", en: "Hexagon Sandbox Bay" },
    avatar: "🧱",
    desc: {
      id: "Membangun undakan batu heksagon bertingkat dan jembatan dermaga air lily di teluk laguna.",
      en: "Master craftsman constructing stepped hexagon terraces and lagoon bridges in Sandbox Bay.",
    },
  },
];
