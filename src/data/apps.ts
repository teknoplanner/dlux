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
    "name": "Offline PDF Editor & Sign",
    "packageId": "com.pdflocal.editor.offline",
    "tagline": "Fast & 100% offline PDF editor. Sign, merge, split, compress, and secure documents.",
    "description": "Offline PDF Editor & Sign is a complete solution to edit, sign, and manage your PDF documents 100% offline, lightning fast, and securely right on your device without needing an internet connection.\n\nAll document processing runs purely inside your phone's local memory (On-Device RAM Sandbox). Your personal documents, contracts, forms, and digital signatures are never uploaded to any remote cloud server.\n\nKey Highlights of Offline PDF Editor & Sign:\n🖋️ Digital E-Sign\nDraw your signature or initials directly with your finger and place them onto any PDF page with precise sizing and position.\n\n📝 PDF Editor & Annotations\nAdd text notes, choose font families (Sans, Serif, Monospace), adjust font size and color, or redact sensitive confidential parts of documents.\n\n📑 Merge & Split Documents\nCombine multiple PDF files into one clean document, or extract and separate specific pages in seconds.\n\n🗜️ Compress PDF & Images\nShrink PDF document size without compromising readable quality so they are easy to send via email or chat apps.\n\n🖼️ PDF & Image Conversion\nConvert PDF pages into high-resolution images (exported as a ZIP archive), or convert gallery photos and scanned pages into a single PDF document.\n\n🔒 Lock & Protect PDF\nEncrypt essential PDF files with password protection and wipe unnecessary metadata.\n\n💧 Watermark & Document Stamps\nApply custom copyright text stamps, watermarks, or confidentiality labels across document pages.\n\n📄 Resume Builder & LaTeX Formulas\nCreate ATS-friendly, print-ready CV resumes or render LaTeX math equations into crisp vector graphics.\n\nWhy Choose Offline PDF Editor & Sign?\n✅ 100% Offline: Never consumes mobile data or requires internet access.\n✅ Guaranteed Privacy: Zero telemetry and zero data collection; your files stay entirely on your device.\n✅ Fast & Lightweight: No account registration, no login walls, and no subscription fees.\n✅ Dark Mode & Multi-Language: Supports Dark Theme and clean multilingual interfaces.",
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
    "name": "Stickman Penalty: Soccer Rush",
    "packageId": "com.stickmanpenaltyrush.game",
    "tagline": "Stickman penalty shootout: kick, beat the goalkeeper, and become the champion!",
    "description": "Get ready for the fastest and most exciting football penalty shootout in Stickman Penalty! Step onto the pitch, face the goalkeeper, and show off your shooting skills to the world. Whether you are a casual player looking for quick fun or a passionate soccer fan chasing championship glory, this game will keep your adrenaline pumping!\n\n⚽ THE ULTIMATE PENALTY SHOOTOUT EXPERIENCE\nTake control of your favorite stickman player in thrilling 3D penalty shootouts. Swipe to strike, aim for the top corner, and outsmart the goalie to score spectacular goals. Test your reflexes and become a matchday hero!\n\n🏆 CLIMB THE RANKS IN CAREER MODE\nBegin your journey from amateur level to world elite! Prove your skills across dynamic stadiums and challenging difficulty tiers:\n- Amateur League\n- City League\n- National League\n- World Elite League\nCan you conquer them all and lift the championship trophy?\n\n👕 CUSTOMIZE YOUR STICKMAN\nEarn coins in every match and visit the Shop to upgrade your player! Unlock stylish jerseys, goalkeeper gloves, and unique character looks to stand out on the field.\n\n🌟 KEY FEATURES:\n- Intuitive swipe controls: simple to learn, fun for all ages\n- Stunning 3D graphics: fluid animations, realistic physics, immersive stadiums\n- Career Mode & Levels: progress through challenging soccer tournaments\n- Achievements & Rewards: complete challenges and unlock trophies\n- 100% Offline play: enjoy anywhere without WiFi or cellular data\n- Fast-paced action: quick penalty matches perfect for any break\n\nReady to become a true football legend? Lace up your boots, take aim, and shoot!\n\nDownload Stickman Penalty now and start scoring epic goals today!",
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
    "name": "Milo Cat: Alien Adventure",
    "packageId": "com.miloadventure.game",
    "tagline": "Milo the space cat jumps and battles cosmic aliens: fun 2D platformer!",
    "description": "Get ready for an epic space adventure with Milo! 🚀🐾\n\nPlay as Milo, a brave ginger cat on a mission to save the galaxy! An alien mothership has invaded a beautiful neon planet, unleashing waves of hazardous cosmic monsters. Help Milo run, jump, and fight through dangerous alien landscapes to rescue the universe!\n\nMilo Cat Adventure is an action-packed 2D platformer blending classic arcade nostalgia with stunning modern sci-fi visuals and fluid controls.\n\n🚀 THRILLING PLATFORMER ACTION\nRun, jump, and dash across hovering platforms and neon bridges packed with traps. Master responsive mobile touch controls across vibrant stages filled with cunning enemies.\n\n🐾 MEET MILO: THE SPACE HERO CAT\nPlay the cutest hero in the galaxy! Equipped with sci-fi goggles and a heroic cape, Milo is no ordinary feline, he is a cosmic guardian!\n\n👾 BATTLE ALIEN MONSTERS & EPIC BOSSES\nThe alien planet swarms with bizarre creatures! Use your quick reflexes to dodge or strike back. Watch out for Level 11: a gripping Boss encounter awaits! Can you defeat all 10 elite cosmic foes?\n\n🪃 WIELD THE NEON BOOMERANG\nMilo never travels unarmed! Hurl futuristic glowing boomerangs to defeat incoming foes from a distance. Time your strikes before enemies can reach you.\n\n✨ KEY FEATURES:\n- Fast-paced 2D platforming with intuitive mobile touch controls\n- Play as an adorable, heroic space-traveling cat\n- Throw neon boomerangs to defeat cosmic monsters\n- Collect extra lives (up to 3 lives simultaneously!)\n- Thrilling \"Boss Mode\" challenge on Level 11\n- Crisp edge-to-edge visuals and upbeat sound effects\n- Fully playable offline without internet connection\n\nThe galaxy is calling, and only one brave cat can answer. Are you ready to guide Milo to victory?",
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
    "rating": 5,
    "reviewsCount": null,
    "downloads": "10+",
    "contentRating": "3+",
    "hasAds": true,
    "playUrl": "https://play.google.com/store/apps/details?id=com.miloadventure.game",
    "color": "#f472b6"
  },
  {
    "slug": "monster-math-train-brain",
    "name": "Monster Math: Brain Training",
    "packageId": "com.monsteradventuremath",
    "tagline": "Fun monster math battle game for learning and brain training!",
    "description": "Monster Math Adventure is an exciting educational math game for kids and learners, combining thrilling monster battles with rewarding math puzzles.\n\nEmbark on an adventure where solving math equations powers up your monster, unlocks special abilities, defeats rivals, and clears entertaining stages.\n\nThis interactive learning game is designed to strengthen addition, subtraction, multiplication, and division skills in an engaging, encouraging environment. Perfect for children, students, and beginners looking to sharpen arithmetic while having fun.\n\n👾 Features:\n🎮 Exciting monster combat mechanics powered by math\n➗ Arithmetic challenges: addition, subtraction, multiplication & division\n🌟 Progressive levels and monster power-ups\n🧠 Brain training and logical thinking development\n👾 Colorful graphics and friendly monster characters\n📱 Fully playable offline: anytime, anywhere\n\n🎓 Why Kids & Parents Love It:\n• Makes learning math fun, active, and rewarding\n• Enhances focus, speed, and problem-solving confidence\n• Stimulates cognitive development\n• Family-friendly design made specifically for young learners",
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
    "tagline": "Fun ABC alphabet learning game for children with a friendly, smart shark! Play & learn today.",
    "description": "Baby Shark ABC: Kids Learning is a fun and educational alphabet learning game designed to help children master letters, phonics sounds, and basic reading skills.\n\nJoin our smart and friendly Baby Shark on an exciting ABC adventure! This interactive learning game makes alphabet practice colorful, musical, and engaging for preschool kids, toddlers, and young learners.\n\nChildren can learn uppercase and lowercase letters, improve phonics pronunciation, and build foundational literacy through playful activities, catchy sounds, and vibrant animations.\n\n🦈 Exciting Features:\n🔤 Master the Alphabet: Learn letters from A to Z with ease.\n🎵 Phonics & Sounds: Clear letter pronunciation to assist speech and listening.\n🎮 Interactive Gameplay: Simple, intuitive controls tailored for small hands.\n🌈 Engaging Visuals: Cheerful graphics and kid-friendly animations with your shark friend.\n🧠 Brain Development: Nurtures early cognitive skills, memory, and pattern recognition.\n📱 Play Anywhere: 100% offline, ideal for learning at home or on the road!\n\n🎓 Why Parents Love This App:\n• Safe & Educational: A secure digital environment for independent play and learning.\n• Designed for Early Learners: Specially tailored for preschool and kindergarten ages.\n• Builds Confidence: Encourages letter recognition and early reading curiosity.\n• Positive Motivation: Gentle encouragement keeps children motivated throughout each activity.\n\nStart your child's joyful learning journey today with Baby Shark ABC: Kids Learning!",
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
      "Friendly Baby Shark animations with interactive, joyful feedback",
      "Simple navigation designed specifically for little hands",
      "Safe, family-friendly learning environment with full offline play"
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
    "hasAds": true,
    "playUrl": "https://play.google.com/store/apps/details?id=com.sharksmartalphabet",
    "color": "#22d3ee"
  },
  {
    "slug": "fruity-merge-3d-match-puzzle",
    "name": "Fruit Match: Memory Puzzle",
    "packageId": "com.fruitmatchfun",
    "tagline": "Fruit Match: fun memory card matching puzzle to boost focus & brainpower!",
    "description": "Fruit Match is a cheerful, colorful memory puzzle game for children and the whole family! Flip cards, spot matching pairs of fresh fruits, and train your brain across dozens of enjoyable stages.\n\nThis memory matching game is crafted to enhance focus, concentration, and visual recall through relaxing, satisfying gameplay. Ideal for kids, students, and puzzle lovers of all ages.\n\n🍎 Why You'll Love Fruit Match:\n- Classic card-matching memory gameplay\n- Cute, colorful fresh fruit illustrations\n- Improves short-term memory, attention span, and focus\n- Easy to pick up and play for beginners and children\n- Multiple difficulty stages with progressively rewarding puzzles\n- Play offline anytime, anywhere without an active connection\n\nSharpen your mind, boost concentration, and enjoy the delightful fun of fruit matching!\n\nDownload Fruit Match today and kickstart your daily brain exercise!",
    "category": "game",
    "tags": [
      "Card Puzzle",
      "Memory Match",
      "Fruits",
      "Brain Exercise",
      "Casual"
    ],
    "features": [
      "Match fruit card pairs to exercise visual memory and focus",
      "Fresh, vibrant fruit artwork with calming background music",
      "Progressive challenge levels suited for all ages",
      "Relaxing casual puzzle with complete offline capability"
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
    "name": "Kucing Atur Duit: Money Tracker",
    "packageId": "com.aturduitapp",
    "tagline": "Track daily finances with cute cat companions! Colorful reports, budgets & savings.",
    "description": "# Kucing Atur Duit: Daily Money Tracker\n\nManage your daily income and expenses with ease alongside your friendly cat companion. Record transactions in seconds, plan budgets, monitor cash flow, and review intuitive visual financial reports.\n\nAll core features are free and your financial records remain stored 100% locally on your device, ensuring maximum privacy without requiring an internet connection.\n\n## Key Features\n\n### Built-in Calculator Keyboard\nEnter amounts quickly with an integrated arithmetic keyboard. Calculate expressions like 50 + 20 × 2 directly before saving transactions.\n\n### Interactive Cat Mascots\nChoose your favorite feline companion (Orange, Black, White, Gray, or Calico). Your mascot reacts dynamically to your financial milestones, cheering you on when you save or alerting you when approaching budget limits.\n\n### Visual Financial Insights\nMonitor financial health with clear charts and reports:\n* Expense breakdown by category\n* Income vs. expense comparisons\n* Net cash flow tracking\n* Spending trends over time\n* Budget utilization progress\n\n### Multiple Accounts & Ledgers\nOrganize all your money sources in one app: Cash, Bank Accounts, E-wallets, Credit Cards, and Loans. Create separate ledgers for personal, family, business, or travel needs.\n\n### Monthly Budgets\nSet spending limits for each category and stay on track with smart color-coded alerts (Safe, Caution, Over-budget).\n\n### Privacy & On-Device Security\n* 100% on-device local storage\n* No internet required to record transactions\n* App lock with PIN and biometric authentication\n* Secure local backup and restore\n* Option to blur transaction amounts in public\n* Zero invasive banner ads\n\nStart organizing your daily expenses and savings today with Kucing Atur Duit!",
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
