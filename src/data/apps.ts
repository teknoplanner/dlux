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
    "D Lucky X adalah studio pengembang game dan aplikasi Android independen dari Indonesia. Kami merilis game santai yang adiktif, petualangan aksi seru, aplikasi edukasi anak ramah keluarga, serta aplikasi utilitas produktivitas & finansial harian yang ringan, privat, dan aman di Google Play Store.",
  playStoreUrl:
    "https://play.google.com/store/apps/dev?id=5090788794635737630",
  email: "teknoplanner@gmail.com",
  website: "https://dluckyx.cloud",
};

export const apps: AppItem[] = [
  {
    "slug": "offline-pdf-editor",
    "name": "Offline PDF Editor & Sign",
    "packageId": "com.pdflocal.editor.offline",
    "tagline": "PDF cepat & 100% offline. Tanda tangan, gabung, kompres, dan amankan dokumen.",
    "description": "Offline PDF Editor & Sign adalah aplikasi lengkap untuk mengolah, mengedit, dan mengelola dokumen PDF Anda secara 100% offline, secepat kilat, dan aman langsung di perangkat tanpa membutuhkan koneksi internet.\n\nSemua proses dokumen berjalan murni di dalam memori internal ponsel Anda (On-Device RAM Sandbox). Dokumen pribadi, perjanjian kerja, formulir, dan tanda tangan Anda tidak pernah diunggah ke server cloud mana pun.\n\nFitur Unggulan Offline PDF Editor & Sign:\n🖋️ Tanda Tangan Digital (E-Sign)\nBuat tanda tangan atau paraf langsung dengan jari Anda dan tempelkan ke halaman PDF mana pun dengan posisi dan ukuran yang presisi.\n\n📝 Editor & Anotasi PDF\nTambahkan catatan teks, pilih jenis font (Sans, Serif, Monospace), atur ukuran dan warna teks, serta sensor bagian dokumen yang bersifat rahasia.\n\n📑 Gabung & Pisah Dokumen (Merge & Split)\nSatukan beberapa berkas PDF menjadi satu dokumen yang rapi, atau ekstrak dan pisahkan halaman tertentu dalam hitungan detik.\n\n🗜️ Kompres PDF & Gambar\nPerkecil ukuran dokumen PDF atau foto tanpa mengorbankan kualitas tampilan agar mudah dikirim melalui email atau aplikasi pesan.\n\n🖼️ Konversi PDF & Foto\n\nUbah lembaran PDF menjadi gambar beresolusi tinggi (diekspor sebagai arsip ZIP).\nUbah kumpulan foto dan hasil pindaian dari galeri menjadi satu dokumen PDF.\n🔒 Kunci & Lindungi PDF\nEnkripsi dokumen PDF penting Anda dengan kata sandi pengaman dan hapus metadata yang tidak diperlukan.\n\n💧 Watermark & Cap Dokumen\nBubuhkan cap hak cipta, watermark teks, atau label kerahasiaan di seluruh lembar dokumen secara merata.\n\n📄 Pembuat Resume & Rumus LaTeX\nBuat CV / Resume berstandar ATS yang siap cetak, atau render formula matematika LaTeX ke grafik vektor yang tajam.\n\nMengapa Memilih Offline PDF Editor & Sign?\n✅ 100% Offline  -  Tidak memerlukan kuota data atau akses internet sama sekali.\n✅ Privasi Terjamin  -  Tanpa pengumpulan data (zero telemetry); dokumen Anda sepenuhnya tetap berada di perangkat Anda.\n✅ Cepat & Ringan  -  Tanpa perlu registrasi akun, tanpa login, dan tanpa biaya langganan.\n✅ Mode Gelap & Multi-Bahasa  -  Mendukung Tema Gelap (Dark Theme) serta antarmuka dua bahasa (Bahasa Indonesia & English).",
    "category": "tool",
    "tags": [
      "PDF",
      "Offline",
      "Tanda Tangan",
      "Kompres PDF",
      "Produktivitas"
    ],
    "features": [
      "100% Offline, proses murni di memori ponsel tanpa kirim berkas ke server",
      "Tanda tangan digital (E-Sign) dan pengisian formulir instan",
      "Gabung (merge), pisah (split), dan kompres ukuran dokumen PDF",
      "Enkripsi kata sandi dan sensor bagian dokumen rahasia"
    ],
    "icon": "/images/apps/offline-pdf-editor/icon.webp",
    "screenshots": [
      "/images/apps/offline-pdf-editor/screenshot-1.webp",
      "/images/apps/offline-pdf-editor/screenshot-2.webp",
      "/images/apps/offline-pdf-editor/screenshot-3.webp",
      "/images/apps/offline-pdf-editor/screenshot-4.webp"
    ],
    "rating": 5,
    "reviewsCount": null,
    "downloads": "10+",
    "contentRating": "3+",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.pdflocal.editor.offline",
    "color": "#0284c7"
  },
  {
    "slug": "stickman-penalty-rush",
    "name": "Stickman Penalti: Sepak Bola",
    "packageId": "com.stickmanpenaltyrush.game",
    "tagline": "Adu penalti stickman - tendang bola, kalahkan kiper, jadi juara dunia!",
    "description": "Bersiap rasakan aksi sepak bola tercepat dan paling seru di Stickman Penalti! Turun ke lapangan, hadapi kiper, dan tunjukkan skill tendanganmu ke dunia. Baik kamu pemain kasual yang cari hiburan cepat atau penggemar berat sepak bola yang mengejar gelar juara, game ini bikin kamu deg-degan terus!\n\n⚽ PENGALAMAN ADU PENALTI TERBAIK\nKendalikan pemain stickman favoritmu dalam adu penalti 3D yang menegangkan. Swipe untuk menendang, bidik sudut atas gawang, dan kecoh kiper untuk cetak gol spektakuler. Uji refleksmu dan jadi pahlawan pertandingan!\n\n🏆 NAIK PERINGKAT DI MODE KARIR\nMulai perjalananmu dari level pemula hingga level elite dunia! Buktikan skillmu di berbagai stadion dan tingkat kesulitan yang menantang:\n- Liga Pemula\n- Liga Kota\n- Liga Nasional\n- Liga Elite Dunia\nSanggupkah kamu taklukkan semuanya dan raih gelar juara?\n\n👕 KUSTOMISASI STICKMAN-MU\nKumpulkan koin di setiap pertandingan dan belanjakan di Toko untuk upgrade pemainmu! Buka jersey keren, sarung tangan kiper stylish, dan gaya karakter unik biar stickman-mu tampil beda di lapangan.\n\n🌟 FITUR UTAMA:\n- Kontrol intuitif: cukup swipe untuk menendang, cocok untuk semua usia!\n- Grafis 3D memukau: animasi halus, fisika realistis, suasana stadion yang imersif\n- Mode Karir & Level: berkembang lewat berbagai tantangan sepak bola\n- Achievement & Reward: selesaikan tantangan dan buka pencapaian eksklusif\n- Bisa dimainkan offline - tanpa WiFi atau internet!\n- Aksi cepat: pertandingan adu penalti singkat, cocok dimainkan kapan saja\n\nSiap jadi legenda sepak bola sejati? Pakai sepatumu, tarik napas, dan bidik gawang!\n\nDownload Stickman Penalti sekarang dan mulai cetak gol-gol epikmu hari ini!",
    "category": "game",
    "tags": [
      "Sepak Bola",
      "Penalti",
      "Stickman",
      "Olahraga",
      "Arcade"
    ],
    "features": [
      "Kontrol swipe intuitif untuk tendangan akurat dan menipu kiper",
      "Mode Karir bertingkat dari Liga Pemula hingga Liga Elite Dunia",
      "Kustomisasi jersey, sarung tangan, dan gaya stickman",
      "Fisika bola realistis dan dapat dimainkan offline tanpa internet"
    ],
    "icon": "/images/apps/stickman-penalty-rush/icon.webp",
    "screenshots": [
      "/images/apps/stickman-penalty-rush/screenshot-1.webp",
      "/images/apps/stickman-penalty-rush/screenshot-2.webp",
      "/images/apps/stickman-penalty-rush/screenshot-3.webp"
    ],
    "rating": 5,
    "reviewsCount": null,
    "downloads": "10+",
    "contentRating": "3+",
    "hasAds": true,
    "playUrl": "https://play.google.com/store/apps/details?id=com.stickmanpenaltyrush.game",
    "color": "#22c55e"
  },
  {
    "slug": "milo-cat-adventure",
    "name": "Milo Kucing: Petualangan Alien",
    "packageId": "com.miloadventure.game",
    "tagline": "Milo si kucing luar angkasa lompat & lawan alien - game platformer seru",
    "description": "Bersiaplah untuk petualangan luar angkasa yang epik bersama Milo! 🚀🐾\n\nJadilah Milo, kucing oranye yang pemberani, dalam misi menyelamatkan galaksi! Sebuah kapal induk alien menyerang planet neon yang indah, melepaskan gelombang monster kosmik yang berbahaya. Bantu Milo berlari, melompat, dan bertarung melewati medan alien yang penuh bahaya untuk menyelamatkan alam semesta!\n\nMilo Kucing Adventure adalah game platformer 2D aksi penuh yang membawa nuansa arcade klasik, dipadukan dengan visual sci-fi modern yang memukau dan kontrol yang responsif.\n\n🚀 AKSI PLATFORMER YANG MENEGANGKAN\nLari, lompat, dan menerjang platform melayang serta jembatan neon yang penuh jebakan. Kuasai kontrol sentuh yang responsif di level-level yang penuh kejutan dan musuh licik.\n\n🐾 KENALI MILO: KUCING PAHLAWAN LUAR ANGKASA\nMainkan pahlawan terlucu di galaksi! Dilengkapi kacamata sci-fi dan jubah superhero, Milo bukan kucing biasa - dia pejuang galaksi!\n\n👾 LAWAN MONSTER ALIEN & BOSS EPIK\nPlanet ini dipenuhi musuh alien yang aneh! Gunakan refleksmu untuk menghindar atau melawan balik. Waspadai Level 11 - mode Boss yang menegangkan menanti! Sanggupkah kamu mengalahkan 10 monster elite?\n\n🪃 GUNAKAN BOOMERANG NEON\nMilo tidak pernah tanpa senjata! Lempar boomerang futuristik untuk menyingkirkan musuh. Atur waktu seranganmu dengan tepat sebelum alien menyentuhmu.\n\n✨ FITUR UTAMA:\n- Gameplay platformer 2D cepat dengan kontrol mobile yang intuitif\n- Mainkan kucing luar angkasa yang lucu dan heroik\n- Lempar boomerang neon untuk kalahkan monster kosmik\n- Kumpulkan nyawa tambahan (maksimal 3 nyawa sekaligus!)\n- Level \"Boss Mode\" yang menegangkan\n- Visual dan audio berkualitas tinggi edge-to-edge\n- Bisa dimainkan offline sepenuhnya - tanpa internet!\n\nGalaksi memanggil, dan hanya satu kucing yang bisa menyelamatkannya. Apakah kamu siap membawa Milo menuju kemenangan?",
    "category": "game",
    "tags": [
      "Platformer",
      "Kucing",
      "Alien",
      "Petualangan",
      "Retro"
    ],
    "features": [
      "Aksi platformer 2D cepat dengan visual sci-fi neon modern",
      "Karakter Milo si kucing pahlawan bertopeng dan berjubah luar angkasa",
      "Lempar boomerang neon untuk mengalahkan monster alien kosmik",
      "Tantangan Level 11 Boss Mode yang seru dan full offline"
    ],
    "icon": "/images/apps/milo-cat-adventure/icon.webp",
    "screenshots": [
      "/images/apps/milo-cat-adventure/screenshot-1.webp",
      "/images/apps/milo-cat-adventure/screenshot-2.webp",
      "/images/apps/milo-cat-adventure/screenshot-3.webp",
      "/images/apps/milo-cat-adventure/screenshot-4.webp"
    ],
    "rating": 5,
    "reviewsCount": null,
    "downloads": "10+",
    "contentRating": "3+",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.miloadventure.game",
    "color": "#f472b6"
  },
  {
    "slug": "monster-math-train-brain",
    "name": "Monster Math: Latih Otak",
    "packageId": "com.monsteradventuremath",
    "tagline": "Game matematika monster yang seru untuk belajar!",
    "description": "Monster Math Adventure adalah game matematika edukatif yang seru untuk anak-anak, menggabungkan pertarungan monster yang menarik dengan tantangan matematika yang menyenangkan.\n\nIkuti petualangan belajar yang seru, di mana menyelesaikan soal matematika akan membantu meningkatkan kekuatan monster, membuka kemampuan baru, mengalahkan musuh, dan menyelesaikan berbagai level menarik.\n\nGame belajar matematika interaktif ini dirancang untuk meningkatkan kemampuan penjumlahan, pengurangan, perkalian, dan pembagian dengan cara yang menyenangkan dan memotivasi. Cocok untuk anak-anak, pelajar, dan pemula yang ingin meningkatkan kemampuan matematika sambil bermain.\n\n👾 Fitur:\n🎮 Gameplay pertarungan monster yang seru\n➗ Tantangan matematika: penjumlahan, pengurangan, perkalian & pembagian\n🌟 Level progresif dan upgrade monster\n🧠 Melatih otak dan kemampuan logika\n👾 Grafis berwarna-warni dan karakter monster lucu\n📱 Bisa dimainkan secara offline  -  kapan saja dan di mana saja\n\n🎓 Kenapa Anak-Anak Menyukainya:\n\n• Membuat belajar matematika jadi seru dan menyenangkan\n• Meningkatkan fokus dan kemampuan memecahkan masalah\n• Membantu perkembangan otak\n• Game edukasi yang dirancang khusus untuk anak-anak",
    "category": "education",
    "tags": [
      "Matematika",
      "Latih Otak",
      "Anak & Keluarga",
      "Edukasi",
      "Monster"
    ],
    "features": [
      "Tantangan berhitung: penjumlahan, pengurangan, perkalian, dan pembagian",
      "Upgrade monster dan buka kemampuan baru lewat jawaban benar",
      "Melatih konsentrasi, daya ingat, dan kecepatan berpikir logis",
      "Visual penuh warna ramah anak dan berfungsi offline"
    ],
    "icon": "/images/apps/monster-math-train-brain/icon.webp",
    "screenshots": [
      "/images/apps/monster-math-train-brain/screenshot-1.webp",
      "/images/apps/monster-math-train-brain/screenshot-2.webp",
      "/images/apps/monster-math-train-brain/screenshot-3.webp",
      "/images/apps/monster-math-train-brain/screenshot-4.webp"
    ],
    "rating": 5,
    "reviewsCount": 10,
    "downloads": "500+",
    "contentRating": "3+",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.monsteradventuremath",
    "color": "#8b5cf6"
  },
  {
    "slug": "baby-shark-abc-kids-learning",
    "name": "Baby Shark ABC: Kids Learning",
    "packageId": "com.sharksmartalphabet",
    "tagline": "Game belajar ABC yang menyenangkan untuk anak-anak bersama hiu pintar yang ramah! Mainkan & belajar hari ini.",
    "description": "Baby Shark ABC: Kids Learning is a fun and educational alphabet learning game for kids designed to help children learn letters, sounds, and basic reading skills.\n\nJoin our smart and friendly Baby Shark on an exciting ABC adventure! This interactive learning game makes alphabet practice fun, colorful, and engaging for preschool kids, toddlers, and beginners.\n\nChildren can master uppercase and lowercase letters, improve pronunciation, and build early literacy skills through playful activities, catchy sounds, and vibrant animations.\n\n🦈 Exciting Features:\n🔤 Master the Alphabet: Learn ABC letters from A to Z with ease.\n\n🎵 Phonics & Sounds: Clear letter sounds and pronunciation to help speech development.\n\n🎮 Interactive Gameplay: Simple, intuitive, and easy for small hands to navigate.\n\n🌈 Engaging Visuals: Colorful graphics and a kid-friendly design featuring your favorite shark friend.\n\n🧠 Brain Development: Supports early childhood cognitive skills and memory.\n\n📱 Play Anywhere: Works offline  -  perfect for learning at home or on the go!\n\n🎓 Why Parents Love This App:\nSafe & Educational: A secure environment for kids to play and learn independently.\n\nDesigned for Early Learners: Tailored specifically for preschool, nursery, and toddlers.\n\nBoosts Confidence: Helps improve letter recognition and encourages early reading skills.\n\nFun Motivation: The friendly shark character keeps children motivated to finish every lesson.\n\nIf you are looking for the best ABC learning game for kids, Baby Shark ABC: Kids Learning is the perfect choice to start your child's educational journey!\n\nDownload now and start learning the alphabet with your smart shark friend today!",
    "category": "education",
    "tags": [
      "Alfabet ABC",
      "Fonik",
      "Anak Balita",
      "PAUD",
      "Belajar"
    ],
    "features": [
      "Belajar huruf ABC A-Z dengan pengucapan fonik yang jernih",
      "Animasi Baby Shark ramah anak yang interaktif dan ceria",
      "Navigasi simpel yang mudah digunakan oleh tangan si kecil",
      "Lingkungan belajar aman, ramah keluarga, dan full offline"
    ],
    "icon": "/images/apps/baby-shark-abc-kids-learning/icon.webp",
    "screenshots": [
      "/images/apps/baby-shark-abc-kids-learning/screenshot-1.webp",
      "/images/apps/baby-shark-abc-kids-learning/screenshot-2.webp",
      "/images/apps/baby-shark-abc-kids-learning/screenshot-3.webp"
    ],
    "rating": 5,
    "reviewsCount": 10,
    "downloads": "500+",
    "contentRating": "3+",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.sharksmartalphabet",
    "color": "#22d3ee"
  },
  {
    "slug": "fruity-merge-3d-match-puzzle",
    "name": "Fruit Match: Puzzle Memori",
    "packageId": "com.fruitmatchfun",
    "tagline": "Cocok Buah - game puzzle memori seru, latih fokus & daya ingat anak",
    "description": "Cocok Buah adalah game puzzle memori yang seru dan penuh warna untuk anak-anak dan keluarga! Balik kartu, temukan pasangan buah yang cocok, dan latih otakmu di setiap level.\n\nGame memory matching ini dirancang untuk meningkatkan fokus, konsentrasi, dan daya ingat lewat gameplay yang simpel dan menenangkan  -  cocok untuk anak-anak, pelajar, dan siapa saja yang suka latihan otak.\n\n🍎 Kenapa kamu akan suka Cocok Buah:\n- Gameplay klasik mencocokkan kartu memori\n- Desain buah yang lucu dan berwarna-warni\n- Tingkatkan daya ingat, fokus & konsentrasi\n- Mudah dimainkan - cocok untuk anak & pemula\n- Banyak level dengan tantangan yang makin seru\n- Bisa dimainkan offline - kapan saja, di mana saja\n\n\nCocok Buah adalah game latihan otak yang cocok untuk anak-anak, keluarga, dan pecinta puzzle santai. Asah daya ingat, tingkatkan konsentrasi, dan nikmati serunya mencocokkan buah!\n\nDownload Cocok Buah sekarang dan mulai latihan daya ingatmu hari ini!",
    "category": "game",
    "tags": [
      "Puzzle Kartu",
      "Daya Ingat",
      "Buah",
      "Asah Otak",
      "Santai"
    ],
    "features": [
      "Mencocokkan pasangan kartu buah untuk melatih memori visual",
      "Desain buah-buahan segar penuh warna dengan musik menenangkan",
      "Puluhan level tantangan bertahap untuk segala usia",
      "Dapat dimainkan santai tanpa koneksi internet"
    ],
    "icon": "/images/apps/fruity-merge-3d-match-puzzle/icon.webp",
    "screenshots": [
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-1.webp",
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-2.webp",
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-3.webp",
      "/images/apps/fruity-merge-3d-match-puzzle/screenshot-4.webp"
    ],
    "rating": 5,
    "reviewsCount": 16,
    "downloads": "500+",
    "contentRating": "3+",
    "hasAds": true,
    "playUrl": "https://play.google.com/store/apps/details?id=com.fruitmatchfun",
    "color": "#f59e0b"
  },
  {
    "slug": "kucing-atur-duit",
    "name": "Kucing Atur Duit",
    "packageId": "com.aturduitapp",
    "tagline": "Catat keuangan seru bareng Si Meong! Laporan warna-warni, anggaran, tabungan.",
    "description": "# Kucing Atur Duit  -  Catatan Keuangan Harian\n\nKelola pemasukan dan pengeluaran harian dengan cara yang sederhana bersama Kucing Atur Duit. Catat transaksi dalam hitungan detik, atur anggaran, pantau kondisi keuangan, dan lihat laporan yang mudah dipahami.\n\nSemua fitur tersedia secara gratis dan data keuangan tersimpan secara lokal di perangkat, sehingga aplikasi dapat digunakan tanpa koneksi internet.\n\n## Fitur Utama\n\n### Keyboard Kalkulator\n\nMasukkan nominal menggunakan keyboard kalkulator khusus. Kamu juga dapat langsung menghitung ekspresi seperti 50.000 + 20.000 × 2 sebelum menyimpan transaksi.\n\nTersedia nominal cepat seperti 10.000, 20.000, 50.000, dan 100.000 untuk mempercepat pencatatan.\n\n### Maskot Kucing Interaktif\n\nPilih kucing yang ingin menemani aktivitas keuanganmu. Tersedia beberapa karakter seperti Oren, Hitam, Putih, Abu-abu, dan Calico.\n\nMaskot akan memberikan respons berdasarkan kondisi keuangan, misalnya ketika mendapatkan pemasukan, menghemat pengeluaran, mendekati batas anggaran, atau melewati anggaran yang sudah ditentukan.\n\n### Laporan Keuangan\n\nPantau kondisi keuangan melalui berbagai laporan yang mudah dibaca, termasuk:\n\n* Komposisi pengeluaran berdasarkan kategori\n* Perbandingan pemasukan dan pengeluaran\n* Arus kas\n* Perkembangan pengeluaran dari waktu ke waktu\n* Ringkasan kondisi anggaran\n\nAplikasi juga dapat memberikan informasi sederhana mengenai perubahan pola pengeluaran.\n\n### Banyak Akun dan Buku\n\nKelola berbagai sumber keuangan dalam satu aplikasi, seperti:\n\n* Tunai dan dompet\n* Rekening bank\n* E-wallet seperti GoPay, OVO, dan DANA\n* Kartu kredit\n* Utang dan piutang\n\nBuat buku terpisah untuk kebutuhan pribadi, keluarga, usaha, atau perjalanan.\n\n### Anggaran Bulanan\n\nTentukan batas pengeluaran untuk setiap kategori dan pantau penggunaannya secara berkala.\n\nStatus anggaran dibagi menjadi:\n\n* Aman: penggunaan di bawah 80%\n* Waspada: penggunaan 80 - 99%\n* Melebihi anggaran: penggunaan 100% atau lebih\n\n### Riwayat dan Kalender Transaksi\n\nLihat semua transaksi dalam bentuk daftar atau kalender. Gunakan filter berdasarkan kategori dan jenis transaksi, atau cari transaksi tertentu dengan mudah.\n\nTampilan kalender membantu melihat pola pengeluaran berdasarkan tanggal.\n\n## Privasi dan Keamanan\n\nKucing Atur Duit dirancang untuk menyimpan data keuangan langsung di perangkat.\n\n* Data transaksi disimpan secara lokal\n* Tidak membutuhkan koneksi internet untuk pencatatan\n* Kunci aplikasi menggunakan PIN dan biometrik\n* Backup dan restore lokal\n* Opsi untuk menyembunyikan nominal transaksi\n* Tanpa iklan banner yang mengganggu\n\n## Semua Fitur Gratis\n\nKucing Atur Duit dapat digunakan secara gratis tanpa fitur Premium atau langganan.\n\nSeluruh fitur utama tersedia untuk digunakan, termasuk pencatatan transaksi, pengelolaan banyak akun dan buku, anggaran, laporan keuangan, kalender transaksi, pilihan maskot kucing, backup lokal, dan fitur privasi.\n\nAplikasi ini cocok untuk mencatat uang saku, kebutuhan sehari-hari, keuangan keluarga, maupun usaha kecil.\n\nMulai catat pemasukan dan pengeluaran dengan lebih teratur bersama Kucing Atur Duit.",
    "category": "tool",
    "tags": [
      "Keuangan",
      "Catatan Uang",
      "Budget",
      "Kucing",
      "Finansial"
    ],
    "features": [
      "Catat pengeluaran dan pemasukan dengan keyboard kalkulator praktis",
      "Maskot kucing interaktif (Oren, Hitam, Putih, Calico) yang responsif",
      "Laporan arus kas, grafik kategori, dan pemantauan anggaran bulanan",
      "Data tersimpan 100% lokal di HP, aman dengan kunci PIN dan biometrik"
    ],
    "icon": "/images/apps/kucing-atur-duit/icon.webp",
    "screenshots": [
      "/images/apps/kucing-atur-duit/screenshot-1.webp",
      "/images/apps/kucing-atur-duit/screenshot-2.webp",
      "/images/apps/kucing-atur-duit/screenshot-3.webp",
      "/images/apps/kucing-atur-duit/screenshot-4.webp"
    ],
    "rating": 5,
    "reviewsCount": null,
    "downloads": "50+",
    "contentRating": "3+",
    "hasAds": false,
    "playUrl": "https://play.google.com/store/apps/details?id=com.aturduitapp",
    "color": "#f97316"
  }
];
