export type AppItem = {
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
    "D Lucky X is an independent game and Android app development studio from Indonesia. We create engaging casual games, thrilling action adventures, family-friendly educational apps, as well as lightweight, private, and secure daily productivity & financial tools on the Google Play Store.",
  playStoreUrl:
    "https://play.google.com/store/apps/dev?id=5090788794635737630",
  email: "teknoplanner@gmail.com",
  website: "https://dluckyx.cloud",
};

export const apps: AppItem[] = [
  {
    "slug": "offline-pdf-editor",
    "name": "PDF Editor Offline - Sign PDF",
    "packageId": "com.pdflocal.editor.offline",
    "tagline": "Edit, sign, merge, split & compress PDF 100% offline. No login, no upload.",
    "description": "Offline PDF Editor & Sign is your all-in-one toolkit to process, edit, and manage PDF documents 100% offline, lightning-fast, and securely on your device without requiring an internet connection.\n\nAll document processing runs strictly inside your phone’s local memory (On-Device RAM Sandbox). Your private documents, business agreements, forms, and handwritten signatures are never uploaded to any cloud server.\n\nKey Features of Offline PDF Editor & Sign:\n🖋️ Digital Signature (E-Sign) Draw your signature or initials directly with your finger and place them onto any PDF page with precision scaling and positioning.\n\n📝 PDF Editor & Annotation Add custom text notes, choose font families (Sans, Serif, Monospace), adjust font sizes and colors, and redact confidential sections.\n\n📑 Merge & Split Documents Combine multiple PDF files into one neatly organized document, or extract and split specific page ranges in seconds.\n\n🗜️ Compress PDF & Images Reduce the file size of PDF documents or photos while preserving optimal visual clarity for easy sharing via email or messaging apps.\n\n🖼️ Convert PDF & Photos\n\nConvert PDF pages into high-resolution images (exported as a ZIP archive).\nTurn gallery photos and scans into a multi-page PDF document.\n🔒 Protect & Lock PDF Encrypt your sensitive PDF files with password protection and strip unnecessary metadata.\n\n💧 Watermark & Document Stamp Overlay copyright stamps, text watermarks, or confidentiality labels across all document pages.\n\n📄 Resume Builder & LaTeX Equations Build ATS-friendly professional resumes ready for export, or render mathematical LaTeX formulas into crisp vector graphics.\n\nWhy Choose Offline PDF Editor & Sign?\n✅ 100% Offline  -  Zero internet or mobile data required.\n✅ Guaranteed Privacy  -  Zero telemetry and no data collection; your documents stay strictly on your device.\n✅ Fast & Lightweight  -  No account registration, logins, or paid subscriptions needed.\n✅ Dark Mode & Multi-Language  -  Native support for Dark Theme and bilingual interface (English & Indonesian).",
    "category": "tool",
    "tags": [
      "PDF",
      "Offline",
      "Digital Signature",
      "Compress PDF",
      "Productivity"
    ],
    "features": [
      "100% Offline: processes securely on-device without uploading files to servers",
      "Digital signature (E-Sign) and instant PDF form filling",
      "Merge, split, and compress PDF documents effortlessly",
      "Password encryption, metadata removal, and redaction for sensitive data"
    ],
    "icon": "/images/apps/offline-pdf-editor/icon.webp",
    "screenshots": [
      "/images/apps/offline-pdf-editor/screenshot-1.webp",
      "/images/apps/offline-pdf-editor/screenshot-2.webp",
      "/images/apps/offline-pdf-editor/screenshot-3.webp",
      "/images/apps/offline-pdf-editor/screenshot-4.webp"
    ],
    "reviewsCount": null,
    "downloads": "100+",
    "contentRating": "Everyone",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.pdflocal.editor.offline",
    "color": "#0284c7"
  },
  {
    "slug": "stickman-penalty-rush",
    "name": "Stickman Penalty: Soccer Kick",
    "packageId": "com.stickmanpenaltyrush.game",
    "tagline": "Swipe to shoot! Stickman football penalty shootout with leagues. Play offline.",
    "description": "Get ready to experience the most thrilling and fast-paced soccer action in Stickman Penalty Rush! Step onto the pitch, face the goalkeeper, and show the world your striking skills. Whether you are a casual gamer looking for quick fun or a hardcore football fan aiming for the championship, this game will keep you on the edge of your seat!\n\n⚽ THE ULTIMATE PENALTY SHOOTOUT EXPERIENCE \nTake control of your favorite stickman athlete in intense, 3D penalty shootouts. Swipe to kick, aim for the top corners, and outsmart the goalkeeper to score spectacular goals. Show your reflexes, feel the tension of the stadium, and become the hero of the match!\n\n🏆 CLIMB THE RANKS IN CAREER MODE\nStart your journey in the local Street League and work your way up to the World Championship! Prove your skills across different stadiums and challenging leagues:\n• Street League\n• City League\n• National League\n• World Champions League\nCan you conquer them all and lift the ultimate trophy?\n\n👕 CUSTOMIZE YOUR STICKMAN\nEarn coins with every match and use them in the Shop to upgrade your player! Unlock cool jerseys, stylish goalkeeper gloves, and unique character styles to make your stickman stand out on the pitch. \n\n🌟 KEY FEATURES:\n• Intuitive Controls: Simple swipe-to-shoot mechanics. Perfect for players of all ages!\n• Stunning 3D Graphics: Enjoy smooth animations, realistic physics, and immersive stadium environments.\n• Career & Leagues: Progress through various challenging football tournaments.\n• Achievements & Rewards: Complete challenges and unlock exclusive achievements to show off your skills.\n• Offline Gameplay: Play anytime, anywhere - no Wi-Fi or internet connection required!\n• Fast-Paced Action: Quick penalty shootout matches that are perfect for playing on the go.\n\nAre you ready to become the ultimate football legend? Lace up your boots, take a deep breath, and hit the target! \n\nDownload Stickman Penalty Rush NOW and start scoring epic goals today",
    "category": "game",
    "tags": [
      "Soccer",
      "Penalty Shootout",
      "Stickman",
      "Sports",
      "Arcade"
    ],
    "features": [
      "Intuitive swipe controls for precision shooting and tricking goalkeepers",
      "Multi-tier Career Mode from Amateur to World Elite League",
      "Customizable jerseys, goalkeeper gloves, and stickman gear",
      "Realistic ball physics and fully playable offline without internet"
    ],
    "icon": "/images/apps/stickman-penalty-rush/icon.webp",
    "screenshots": [
      "/images/apps/stickman-penalty-rush/screenshot-1.webp",
      "/images/apps/stickman-penalty-rush/screenshot-2.webp",
      "/images/apps/stickman-penalty-rush/screenshot-3.webp",
      "/images/apps/stickman-penalty-rush/screenshot-4.webp",
      "/images/apps/stickman-penalty-rush/screenshot-5.webp"
    ],
    "reviewsCount": null,
    "downloads": "10+",
    "contentRating": "Everyone",
    "hasAds": true,
    "playUrl": "https://play.google.com/store/apps/details?id=com.stickmanpenaltyrush.game",
    "color": "#22c55e"
  },
  {
    "slug": "milo-cat-adventure",
    "name": "Milo Cat: Space Platformer",
    "packageId": "com.miloadventure.game",
    "tagline": "Jump, dash & throw your boomerang! 2D space cat platformer, play offline.",
    "description": "Get ready for an epic cosmic journey with Milo Cat! 🚀🐾\n\nStep into the paws of Milo, a fearless and adorable orange tabby cat who has embarked on a daring mission across the galaxy! An unknown alien mothership has invaded a beautiful neon planet, unleashing waves of strange and dangerous cosmic monsters. It’s up to you to help Milo dash, jump, and battle his way through perilous alien landscapes to save the universe!\n\nMilo Cat is a premium, action-packed 2D platformer that brings back the golden era of classic arcade gaming, mixed with stunning modern sci-fi visuals and incredibly smooth controls.\n\nEXHILARATING PLATFORMER ACTION\nRun, jump, and dash across floating platforms, neon-lit bridges, and treacherous traps. Master the responsive touch controls as you navigate through beautifully crafted levels filled with surprises, hidden dangers, and tricky enemies.\n\nMEET MILO: THE SPACE CAT HERO\nPlay as the cutest hero in the galaxy! Equipped with cool sci-fi goggles and a superhero cape, Milo isn't just an ordinary cat - he’s a galactic warrior!\n\nBATTLE ALIEN MONSTERS & EPIC BOSSES\nThe planet is crawling with bizarre extraterrestrial enemies! Use your reflexes to dodge their attacks or fight back. And beware of Level 11 - a massive, thrilling Boss Mode awaits! Can you survive the onslaught and defeat 10 elite monsters to prove your skills?\n\nWIELD THE NEON BOOMERANG\nMilo is never unarmed! Throw your glowing, futuristic boomerang to blast enemies out of your way. Time your attacks perfectly to defeat aliens before they can even touch you.\n\nSTUNNING SCI-FI VISUALS & SOUNDS\nImmerse yourself in breathtaking 2D artwork! Explore a vibrant alien world filled with glowing flora, neon cities, and starry cosmic skies. Every jump, dash, and attack is accompanied by premium, high-quality sound effects and an epic soundtrack that will keep your heart racing!\n\nKEY FEATURES:\n• Fast-paced 2D platformer gameplay with intuitive mobile controls.\n• Play as an adorable and heroic space cat.\n• Throw your glowing boomerang to defeat cosmic monsters.\n• Collect extra lives, but manage them wisely (maximum of 3 lives at a time!).\n• Thrilling \"Boss Mode\" level where the aliens actively hunt you down.\n• Epic edge-to-edge landscape visuals and high-quality game audio.\n• Completely playable offline - no internet required!\n\nThe galaxy is calling, and only one cat can save it. Do you have what it takes to guide Milo to victory?",
    "category": "game",
    "tags": [
      "Platformer",
      "Cat",
      "Alien",
      "Adventure",
      "Retro Arcade"
    ],
    "features": [
      "Fast-paced 2D platforming action with modern neon sci-fi visuals",
      "Play as Milo, the brave space-exploring caped hero cat",
      "Hurl neon boomerangs to defeat incoming cosmic monsters",
      "Challenging Level 11 Boss Mode with 100% offline gameplay"
    ],
    "icon": "/images/apps/milo-cat-adventure/icon.webp",
    "screenshots": [
      "/images/apps/milo-cat-adventure/screenshot-1.webp",
      "/images/apps/milo-cat-adventure/screenshot-2.webp",
      "/images/apps/milo-cat-adventure/screenshot-3.webp",
      "/images/apps/milo-cat-adventure/screenshot-4.webp"
    ],
    "reviewsCount": null,
    "downloads": "10+",
    "contentRating": "Everyone",
    "hasAds": true,
    "playUrl": "https://play.google.com/store/apps/details?id=com.miloadventure.game",
    "color": "#f472b6"
  },
  {
    "slug": "monster-math-train-brain",
    "name": "Monster Math: Brain Training",
    "packageId": "com.monsteradventuremath",
    "tagline": "Train your brain with fast mental math: add, subtract, multiply and divide!",
    "description": "Monster Math is a mental math game that turns arithmetic practice into monster battles.\n\nSolve math problems to power up your monster, unlock new abilities, defeat enemies and progress through levels.\n\nSharpen your addition, subtraction, multiplication and division with quick challenges that keep you focused.\n\n👾 Features:\n🎮 Monster battle gameplay\n➗ Addition, subtraction, multiplication and division challenges\n🌟 Level progression and monster upgrades\n🧠 Brain training, focus and logic\n📱 Works offline  -  play anytime, anywhere\n\nWarm up your brain, improve your mental math and enjoy a monster adventure at the same time.",
    "category": "education",
    "tags": [
      "Math",
      "Brain Training",
      "Kids & Family",
      "Education",
      "Monsters"
    ],
    "features": [
      "Arithmetic challenges covering addition, subtraction, multiplication, and division",
      "Power up monsters and unlock abilities by answering questions correctly",
      "Enhances focus, memory retention, and mental calculation speed",
      "Vibrant kid-friendly visuals with complete offline support"
    ],
    "icon": "/images/apps/monster-math-train-brain/icon.webp",
    "screenshots": [
      "/images/apps/monster-math-train-brain/screenshot-1.webp",
      "/images/apps/monster-math-train-brain/screenshot-2.webp",
      "/images/apps/monster-math-train-brain/screenshot-3.webp",
      "/images/apps/monster-math-train-brain/screenshot-4.webp",
      "/images/apps/monster-math-train-brain/screenshot-5.webp"
    ],
    "reviewsCount": null,
    "downloads": "500+",
    "contentRating": "Everyone",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.monsteradventuremath",
    "color": "#8b5cf6"
  },
  {
    "slug": "baby-shark-abc-kids-learning",
    "name": "Shark Smart ABC: Kids Learning",
    "packageId": "com.sharksmartalphabet",
    "tagline": "Fun ABC learning game for kids with a friendly smart shark! Play & learn today.",
    "description": "Shark Smart ABC: Kids Learning is a fun and educational alphabet learning game for kids designed to help children learn letters, sounds, and basic reading skills.\n\nJoin our smart and friendly Shark Smart on an exciting ABC adventure! This interactive learning game makes alphabet practice fun, colorful, and engaging for preschool kids, toddlers, and beginners.\n\nChildren can master uppercase and lowercase letters, improve pronunciation, and build early literacy skills through playful activities, catchy sounds, and vibrant animations.\n\n🦈 Exciting Features:\n🔤 Master the Alphabet: Learn ABC letters from A to Z with ease.\n\n🎵 Phonics & Sounds: Clear letter sounds and pronunciation to help speech development.\n\n🎮 Interactive Gameplay: Simple, intuitive, and easy for small hands to navigate.\n\n🌈 Engaging Visuals: Colorful graphics and a kid-friendly design featuring your favorite shark friend.\n\n🧠 Brain Development: Supports early childhood cognitive skills and memory.\n\n📱 Play Anywhere: Works offline  -  perfect for learning at home or on the go!\n\n🎓 Why Parents Love This App:\nSafe & Educational: A secure environment for kids to play and learn independently.\n\nDesigned for Early Learners: Tailored specifically for preschool, nursery, and toddlers.\n\nBoosts Confidence: Helps improve letter recognition and encourages early reading skills.\n\nFun Motivation: The friendly shark character keeps children motivated to finish every lesson.\n\nIf you are looking for the best ABC learning game for kids, Shark Smart ABC: Kids Learning is the perfect choice to start your child's educational journey!\n\nDownload now and start learning the alphabet with your smart shark friend today!",
    "category": "education",
    "tags": [
      "ABC Alphabet",
      "Phonics",
      "Preschool",
      "Toddlers",
      "Early Learning"
    ],
    "features": [
      "Learn letters A-Z with crisp phonics audio pronunciation",
      "Friendly smart shark animations with interactive, joyful feedback",
      "Simple navigation designed specifically for little hands",
      "Safe, family-friendly learning environment with full offline play"
    ],
    "icon": "/images/apps/baby-shark-abc-kids-learning/icon.webp",
    "screenshots": [
      "/images/apps/baby-shark-abc-kids-learning/screenshot-1.webp",
      "/images/apps/baby-shark-abc-kids-learning/screenshot-2.webp",
      "/images/apps/baby-shark-abc-kids-learning/screenshot-3.webp",
      "/images/apps/baby-shark-abc-kids-learning/screenshot-4.webp",
      "/images/apps/baby-shark-abc-kids-learning/screenshot-5.webp"
    ],
    "reviewsCount": null,
    "downloads": "500+",
    "contentRating": "Everyone",
    "hasAds": true,
    "playUrl": "https://play.google.com/store/apps/details?id=com.sharksmartalphabet",
    "color": "#22d3ee"
  },
  {
    "slug": "fruity-merge-3d-match-puzzle",
    "name": "Fruit Match 3D: Triple Puzzle",
    "packageId": "com.fruitmatchfun",
    "tagline": "Tap 3D fruit, match 3 and clear the crate before time runs out! Offline puzzle.",
    "description": "Dive into a crate of shiny 3D fruit and clear it one match at a time!\n\nTap the fruit you want, send it to your tray and match 3 of a kind to make them pop. Be quick and chain matches for big combos. Be careful: when all 7 tray slots fill up, it's over!\n\nHOW TO PLAY\n• Tap fruit in the crate to send it to the tray\n• Match 3 of the same fruit to clear them\n• Clear every fruit before the timer hits zero\n• Chain quick matches for combo points and more stars\n\nNEW CHALLENGES AS YOU GO\n• Bombs: touch one and lose 10 seconds\n• Frozen fruit: tap twice to break the ice\n• Locked tray slots: less room to work with\n• Rush mode: the clock is ticking faster\n• Boss levels: everything at once, with a bigger reward\n\nPOWER-UPS WHEN YOU'RE STUCK\n• Undo: put the last fruit back\n• Shuffle: toss the pile to uncover hidden fruit\n• Magic: automatically completes a set of three\n\nCOME BACK EVERY DAY\n• Daily reward with a 7-day streak bonus\n• Daily missions with coin rewards\n• Lucky wheel with coins and power-ups\n• Earn stars and coins on every level\n\nMORE TO LOVE\n• Smooth, colorful 3D graphics tuned for phones\n• Sign in with Google Play for leaderboards and cloud save\n• Plays offline (ads and online features need a connection)\n• English and Bahasa Indonesia\n\nEasy to pick up, hard to put down. Download Fruit Match 3D and see how far you can go!",
    "category": "game",
    "tags": [
      "Triple Match",
      "Match 3D",
      "Fruits",
      "Puzzle",
      "Offline"
    ],
    "features": [
      "Tap 3D fruit into a 7-slot tray and match 3 of a kind to clear them",
      "Beat the timer and chain quick matches for combo points and stars",
      "New challenges: bombs, frozen fruit, locked tray slots, rush mode and boss levels",
      "Power-ups when stuck: undo, shuffle and magic auto-match, fully offline"
    ],
    "icon": "/images/apps/fruity-merge-3d-match-puzzle/icon.webp",
    "screenshots": [
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-1.webp",
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-2.webp",
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-3.webp",
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-4.webp"
    ],
    "reviewsCount": null,
    "downloads": "500+",
    "contentRating": "Everyone",
    "hasAds": true,
    "playUrl": "https://play.google.com/store/apps/details?id=com.fruitmatchfun",
    "color": "#f59e0b"
  },
  {
    "slug": "kucing-atur-duit",
    "name": "Kucing Atur Duit: Catat Uang",
    "packageId": "com.aturduitapp",
    "tagline": "Offline financial and expense tracking, budgeting, and reporting app.",
    "description": "Kucing Atur Duit  -  Catatan Keuangan Harian\n\nKelola pemasukan dan pengeluaran harian dengan cara yang sederhana bersama Kucing Atur Duit. Catat transaksi dalam hitungan detik, atur anggaran, pantau kondisi keuangan, dan lihat laporan yang mudah dipahami.\n\nSemua fitur tersedia secara gratis dan data keuangan tersimpan secara lokal di perangkat, sehingga aplikasi dapat digunakan tanpa koneksi internet.\n\nFitur Utama\n\nKeyboard Kalkulator\n\nMasukkan nominal menggunakan keyboard kalkulator khusus. Kamu juga dapat langsung menghitung ekspresi seperti 50.000 + 20.000 × 2 sebelum menyimpan transaksi.\n\nTersedia nominal cepat seperti 10.000, 20.000, 50.000, dan 100.000 untuk mempercepat pencatatan.\n\nMaskot Kucing Interaktif\n\nPilih kucing yang ingin menemani aktivitas keuanganmu. Tersedia beberapa karakter seperti Oren, Hitam, Putih, Abu-abu, dan Calico.\n\nMaskot akan memberikan respons berdasarkan kondisi keuangan, misalnya ketika mendapatkan pemasukan, menghemat pengeluaran, mendekati batas anggaran, atau melewati anggaran yang sudah ditentukan.\n\nLaporan Keuangan\n\nPantau kondisi keuangan melalui berbagai laporan yang mudah dibaca, termasuk:\n\n• Komposisi pengeluaran berdasarkan kategori\n• Perbandingan pemasukan dan pengeluaran\n• Arus kas\n• Perkembangan pengeluaran dari waktu ke waktu\n• Ringkasan kondisi anggaran\n\nAplikasi juga dapat memberikan informasi sederhana mengenai perubahan pola pengeluaran.\n\nBanyak Akun dan Buku\n\nKelola berbagai sumber keuangan dalam satu aplikasi, seperti:\n\n• Tunai dan dompet\n• Rekening bank\n• E-wallet seperti GoPay, OVO, dan DANA\n• Kartu kredit\n• Utang dan piutang\n\nBuat buku terpisah untuk kebutuhan pribadi, keluarga, usaha, atau perjalanan.\n\nAnggaran Bulanan\n\nTentukan batas pengeluaran untuk setiap kategori dan pantau penggunaannya secara berkala.\n\nStatus anggaran dibagi menjadi:\n\n• Aman: penggunaan di bawah 80%\n• Waspada: penggunaan 80 - 99%\n• Melebihi anggaran: penggunaan 100% atau lebih\n\nRiwayat dan Kalender Transaksi\n\nLihat semua transaksi dalam bentuk daftar atau kalender. Gunakan filter berdasarkan kategori dan jenis transaksi, atau cari transaksi tertentu dengan mudah.\n\nTampilan kalender membantu melihat pola pengeluaran berdasarkan tanggal.\n\nPrivasi dan Keamanan\n\nKucing Atur Duit dirancang untuk menyimpan data keuangan langsung di perangkat.\n\n• Data transaksi disimpan secara lokal\n• Tidak membutuhkan koneksi internet untuk pencatatan\n• Kunci aplikasi menggunakan PIN dan biometrik\n• Backup dan restore lokal\n• Opsi untuk menyembunyikan nominal transaksi\n• Tanpa iklan banner yang mengganggu\n\nSemua Fitur Gratis\n\nKucing Atur Duit dapat digunakan secara gratis tanpa fitur Premium atau langganan.\n\nSeluruh fitur utama tersedia untuk digunakan, termasuk pencatatan transaksi, pengelolaan banyak akun dan buku, anggaran, laporan keuangan, kalender transaksi, pilihan maskot kucing, backup lokal, dan fitur privasi.\n\nAplikasi ini cocok untuk mencatat uang saku, kebutuhan sehari-hari, keuangan keluarga, maupun usaha kecil.\n\nMulai catat pemasukan dan pengeluaran dengan lebih teratur bersama Kucing Atur Duit.",
    "category": "tool",
    "tags": [
      "Finance",
      "Expense Tracker",
      "Budget",
      "Cute Cat",
      "Money Manager"
    ],
    "features": [
      "Log income and expenses swiftly with an integrated calculator keyboard",
      "Interactive cat mascots (Orange, Black, White, Calico) that react to your spending",
      "Visual cash flow charts, category summaries, and monthly budget alerts",
      "100% local on-device data storage with secure PIN and biometric app lock"
    ],
    "icon": "/images/apps/kucing-atur-duit/icon.webp",
    "screenshots": [
      "/images/apps/kucing-atur-duit/screenshot-1.webp",
      "/images/apps/kucing-atur-duit/screenshot-2.webp",
      "/images/apps/kucing-atur-duit/screenshot-3.webp",
      "/images/apps/kucing-atur-duit/screenshot-4.webp",
      "/images/apps/kucing-atur-duit/screenshot-5.webp"
    ],
    "reviewsCount": null,
    "downloads": "50+",
    "contentRating": "Everyone",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.aturduitapp",
    "color": "#f97316"
  },
  {
    "slug": "soundfx-studio",
    "name": "Voice Changer: SoundFX Studio",
    "packageId": "com.soundfx.studio",
    "tagline": "Voice changer & sound effects: 100+ effects, recorder, EQ. 100% offline.",
    "description": "Transform your voice with studio-grade audio processing! SoundFX Studio is a powerful, 100% offline voice changer and audio effects processor designed for creators, gamers, and audio enthusiasts.\n\n🎙️ KEY FEATURES:\n\n✨ 100+ Professional Voice & Sound Effects:\nExplore a massive library of high-fidelity audio effects categorized for every scenario:\n• Pitch & Modulation: Chipmunk, Deep Voice, Helium, Giant, Monster, Fast Forward\n• Robots & Sci-Fi: Classic Android, Cyber Cyborg, Space Alien, Radio Transmission\n• Environments & Spaces: Cathedral Reverb, Cave Echo, Concert Hall, Underwater, Tunnel\n• Musical & Retro: 8-Bit Bitcrusher, Vinyl Record, Telephone Filter, Megaphone, Vocoder\n• Creative & Unique: Comic Cartoon, Time Warper, Tremolo Pulse, Phased Horizon\n\n🎛️ Pro Manual DAW Mode:\nTake full control of your sound with parametric audio shaping:\n• Multi-band Studio Equalizer (EQ)\n• Real-time Pitch & Tempo Shifting\n• Custom Delay, Echo & Reverb Wet/Dry controls\n• Saturation & Distortion parameters\n\n🔴 Built-in Studio Audio Recorder:\n• Crystal-clear on-device voice recording\n• Live real-time audio waveform visualization\n• Pause, resume, and instant review options\n\n📁 Audio Import & Export:\n• Import audio files directly from your device storage\n• Export processed recordings in high-quality uncompressed audio format\n• Rename, lock, favorite, and organize your audio library\n\n🔒 100% Offline & Private:\nYour privacy comes first. All audio processing runs strictly on your local device hardware using optimized DSP algorithms. No internet required, and no recordings are ever uploaded to any cloud or external servers.\n\nDownload SoundFX Studio now and take your voice recordings to the professional studio level!",
    "category": "tool",
    "tags": [
      "Voice Changer",
      "Sound Effects",
      "Audio Editor",
      "Offline",
      "Productivity"
    ],
    "features": [
      "100+ Professional Voice & Sound Effects (Robots, Pitch, Reverb, Sci-Fi)",
      "Pro Manual DAW Mode with Multi-band EQ, Pitch & Tempo Shifting",
      "Built-in Studio Audio Recorder with live real-time waveform visualization",
      "100% Offline & Private on-device DSP processing with zero data uploads"
    ],
    "icon": "/images/apps/soundfx-studio/icon.webp",
    "screenshots": [
      "/images/apps/soundfx-studio/screenshot-1.webp",
      "/images/apps/soundfx-studio/screenshot-2.webp",
      "/images/apps/soundfx-studio/screenshot-3.webp",
      "/images/apps/soundfx-studio/screenshot-4.webp"
    ],
    "reviewsCount": null,
    "downloads": "100+",
    "contentRating": "Everyone",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.soundfx.studio",
    "color": "#8b5cf6"
  },
  {
    "slug": "guardian-orbit",
    "name": "Guardian Orbit: Tower Defense",
    "packageId": "com.guardianorbit",
    "tagline": "Build orbital towers, upgrade space defenses and stop alien waves. Sci-fi TD!",
    "description": "Protect Orbi, a tiny planet, from waves of goofy aliens in this colorful sci-fi tower defense game!\n\nGuardian Orbit puts a fresh spin on classic tower defense: your towers sit on orbit rings around the planet. Spin the rings with one finger to aim your defenses at incoming invaders  -  active, fast and easy to learn.\n\n🪐 SPIN THE RINGS, STOP THE INVASION\n• Place towers on rotating orbit rings\n• Turn the rings to line up your shots\n• Stop every alien wave before it reaches the planet\n\n🛸 10 TOWERS, 14 ALIENS\nUnlock and upgrade 10 different defense towers. Face 14 quirky alien types  -  fast ones, tough ones, flying ones and big bosses. Discover them all in the alien almanac.\n\n🃏 POWER-UP CARDS & NOVA BLAST\nPick power-up cards between waves to build a different strategy every run. Fill the Nova meter and unleash a blast that sweeps the whole screen!\n\n🌌 12 LEVELS IN 2 WORLDS\nEarn stars, collect gems, buy boosters and grab your daily gift in the shop.\n\n📱 SHORT SESSIONS, PLAY OFFLINE\nQuick levels that fit a coffee break. No internet needed.\n\nIf you love tower defense, strategy and space games, download Guardian Orbit for free and defend the galaxy!",
    "category": "game",
    "tags": [
      "Tower Defense",
      "Strategy",
      "Space",
      "Sci-Fi",
      "Offline"
    ],
    "features": [
      "Spin orbit rings around tiny planet Orbi to aim your towers at alien waves",
      "10 defense towers to unlock and upgrade, 14 quirky alien types and bosses",
      "Power-up cards between waves and a screen-clearing Nova blast",
      "12 levels in 2 worlds, gems, boosters and daily gifts, playable offline"
    ],
    "icon": "/images/apps/guardian-orbit/icon.webp",
    "screenshots": [
      "/images/apps/guardian-orbit/screenshot-1.webp",
      "/images/apps/guardian-orbit/screenshot-2.webp",
      "/images/apps/guardian-orbit/screenshot-3.webp",
      "/images/apps/guardian-orbit/screenshot-4.webp"
    ],
    "reviewsCount": null,
    "downloads": "10+",
    "contentRating": "Everyone",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.guardianorbit",
    "color": "#6366f1"
  }
];
