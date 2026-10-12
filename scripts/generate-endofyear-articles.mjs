import fs from "fs";
import path from "path";
import sharp from "sharp";
import ts from "typescript";

// =========================================================================
// 83 DAYS (2026-10-10 to 2026-12-31) x 10 SLOTS = 830 DEEP & UNIQUE ARTICLES
// =========================================================================

const TOTAL_DAYS = 83; // Oct 10 to Dec 31 inclusive
const START_DATE_STR = "2026-10-10T00:00:00+07:00";

const SLOTS = [
  {
    slotIndex: 0,
    time: "06:30:00",
    label: "Mobile Legends",
    shortTag: "mlbb",
    category: "gaming",
    color: "#f59e0b",
    app: "stickman-penalty-rush",
    affCat: "gaming",
    affIds: ["finger-sleeves", "phone-cooler", "mobile-controller", "gaming-tws"],
  },
  {
    slotIndex: 1,
    time: "08:15:00",
    label: "Free Fire",
    shortTag: "freefire",
    category: "gaming",
    color: "#f97316",
    app: "stickman-penalty-rush",
    affCat: "gaming",
    affIds: ["finger-sleeves", "phone-cooler", "mobile-controller", "gaming-tws"],
  },
  {
    slotIndex: 2,
    time: "10:00:00",
    label: "Roblox",
    shortTag: "roblox",
    category: "gaming",
    color: "#10b981",
    app: "fruity-merge-3d-match-puzzle",
    affCat: "gaming",
    affIds: ["mobile-controller", "gaming-tws", "finger-sleeves"],
  },
  {
    slotIndex: 3,
    time: "11:45:00",
    label: "Minecraft",
    shortTag: "minecraft",
    category: "gaming",
    color: "#22c55e",
    app: "milo-cat-adventure",
    affCat: "gaming",
    affIds: ["mobile-controller", "phone-cooler", "gaming-tws"],
  },
  {
    slotIndex: 4,
    time: "13:30:00",
    label: "Genshin & Honkai",
    shortTag: "genshin",
    category: "gaming",
    color: "#06b6d4",
    app: "stickman-penalty-rush",
    affCat: "gaming",
    affIds: ["phone-cooler", "mobile-controller", "gaming-tws"],
  },
  {
    slotIndex: 5,
    time: "15:15:00",
    label: "EA FC & eFootball",
    shortTag: "eafc",
    category: "gaming",
    color: "#3b82f6",
    app: "stickman-penalty-rush",
    affCat: "gaming",
    affIds: ["mobile-controller", "finger-sleeves", "gaming-tws"],
  },
  {
    slotIndex: 6,
    time: "17:00:00",
    label: "Battle Royale & Action",
    shortTag: "battleroyale",
    category: "gaming",
    color: "#ec4899",
    app: "stickman-penalty-rush",
    affCat: "gaming",
    affIds: ["finger-sleeves", "phone-cooler", "gaming-tws", "mobile-controller"],
  },
  {
    slotIndex: 7,
    time: "18:45:00",
    label: "Gaming Gear & Hardware",
    shortTag: "gear",
    category: "gaming",
    color: "#eab308",
    app: "stickman-penalty-rush",
    affCat: "gaming",
    affIds: ["finger-sleeves", "phone-cooler", "mobile-controller", "gaming-tws"],
  },
  {
    slotIndex: 8,
    time: "20:30:00",
    label: "Kids Tech & Learning",
    shortTag: "kidstech",
    category: "education",
    color: "#8b5cf6",
    app: "monster-math-train-brain",
    affCat: "kids",
    affIds: ["kids-tablet", "kids-stylus", "kids-case"],
  },
  {
    slotIndex: 9,
    time: "22:15:00",
    label: "Productivity & PDF Work",
    shortTag: "productivity",
    category: "productivity",
    color: "#14b8a6",
    app: "offline-pdf-editor",
    affCat: "productivity",
    affIds: ["capacitive-stylus", "paper-screen-protector"],
  },
];

const TOPIC_TRANSLATIONS = {
  "devices": {
    "Semua HP Android": "All Android Smartphones",
    "Oppo Reno & A Series": "Oppo Reno & A-Series Phones",
    "Vivo Y & V Series": "Vivo Y & V-Series Phones",
    "Samsung Galaxy A Series": "Samsung Galaxy A-Series Phones",
    "Xiaomi Redmi & Poco": "Xiaomi Redmi & POCO Phones",
    "Infinix Hot & Note": "Infinix Hot & Note Series",
    "Realme Number & C Series": "Realme Number & C-Series",
    "Tecno Pova & Camon": "Tecno Pova & Camon Series",
    "Asus ROG Phone": "Asus ROG Phone Gaming Flagships",
    "iQOO Neo & Z Series": "iQOO Neo & Z-Series Phones",
    "M1887 Shotgun": "M1887 Double-Barrel Shotgun",
    "MP40 SMG": "MP40 Submachine Gun",
    "Woodpecker & SVD": "Woodpecker & SVD Marksman Rifles",
    "Groza & Scar": "Groza & SCAR Assault Rifles",
    "AK47 & M4A1": "AK47 & M4A1 Assault Rifles",
    "Custom HUD 2 Jari": "2-Finger Default Claw HUD Layout",
    "Custom HUD 3 Jari": "3-Finger Fast-Action HUD Layout",
    "Custom HUD 4 Jari": "4-Finger Pro Tournament HUD Layout",
    "Fast Gloo Wall": "Rapid Gloo Wall Drop & Crouch Trick",
    "Kombinasi Skill Alok": "DJ Alok Active Skill Combinations",
    "Karakter Tatsuya": "Tatsuya Dash Sprint Mechanics",
    "Karakter Dimitri": "Dimitri Self-Revive Healing Zone",
    "Karakter Chrono": "Chrono Force Field Shield Timing",
    "Karakter Homer": "Homer Drone Sensor & Slow Tactic",
    "Karakter Santino": "Santino Mannequin Teleport Tricks",
    "Setting DPI Aman": "Safe Screen DPI Calibration Range",
    "Clash Squad Ranked": "Clash Squad Ranked Meta Formations",
    "Solo vs Squad": "Solo vs Squad Clutch Survival Tactic",
    "Rotasi Map Bermuda": "Bermuda Map Safe Rotation Routes",
    "Grafis Halus 60 FPS": "Smooth 60 FPS Graphics Performance",
    "Pola Lari Anti Sniper": "Zig-Zag Anti-Sniper Evasion Sprint",
    "Taktik Zona Akhir": "Endzone Chokepoints & Position Denial",
    "Senjata AR Meta": "Meta Assault Rifle Recoil Control",
    "Teknik Drag Shot": "Vertical Drag Shot Headshot Mechanics",
    "Guild War Formasi": "Competitive Guild War Tactical Formations",
    "Mental Juara Booyah": "Clutch Mindset & High-Pressure Booyah Play",
    "Jump Shot Shotgun": "Shotgun Jump-Shot Timing & Crosshair Lock",
    "Scope 4x Akurat": "Pinpoint 4x Scope Spray Tracking",
    "Deteksi Musuh Pet": "Recon Pet Detection Skill Synergy",
    "Attachment Silencer": "Silencer Muzzle Stealth Ambush Tactics",
    "Pendaratan Clock Tower": "Clock Tower Hot-Drop Looting Route",
    "Jalur Aman Purgatory": "Purgatory Safe Valley Rotation Routes",
    "Bertahan di NexTerra": "NexTerra Anti-Gravity Compound Defense",
    "Kombo Kelly & Hayato": "Kelly & Hayato Speed & Armor Penetration Combo",
    "Trik Tembak Kepala": "Instant Red-Aim Headshot Tracking",
    "Uji Kepekaan Touch": "Touch Sampling Rate & Swipe Precision Test",
    "Sensitivitas Layar Licin": "Oleophobic High-Glide Screen Calibration",
    "Aim Merah Jarak Dekat": "Close-Range Red Crosshair Lock-On",
    "Kontrol Recoil SMG": "SMG Burst Firing & Recoil Reset",
    "Senjata UMP & MP5": "UMP & MP5 Mid-Range Headshot Tuning",
    "Granat Flashbang": "Flashbang Blind & Breach Strategies",
    "Medkit Healing Zona": "Electric Blue Zone Healing Race Timing",
    "Revive Point Taktik": "Revive Point Resurgence Defense",
    "Airdrop Looting Cepat": "High-Speed Airdrop Loot & Smoke Cover",
    "Senjata Charge Buster": "Charge Buster Shotgun Energy Timing",
    "Trik Panjat Atap": "Rooftop Parkour & Vertical Vision Angle",
    "Sniper AWM Tembus Vest": "AWM Sniper Vest Armor Penetration",
    "Baju Pelindung Level 4": "Level 4 Vest Armor Durability Management",
    "Helm Anti Headshot": "Level 3 Helmet Protection & Peek Angles",
    "Peta Radar Mini": "Minimap Radar Audio Ping Tracking",
    "Suara Langkah Musuh": "Footstep Audio Direction & Stereo Cues",
    "Setting Tombol Tembak Kiri": "Left Fire Button Scope-In Layout",
    "Ukuran Tombol Analog": "Virtual Joystick Sizing & Zero Deadzone",
    "Transparansi Tombol HUD": "HUD Opacity Tuning for Clear Peripheral View",
    "Trik Peek Semak": "Bush Camouflage & Third-Person Peek Advantage",
    "Taktik Rusher Duo": "Duo Rusher Coordinated Pincer Push",
    "Support Medis Squad": "Squad Combat Medic Healing Loadouts",
    "Sniper Penjaga Belakang": "Rear Sniper Overwatch & Enemy Tagging",
    "Kendaraan Monster Truck": "Monster Truck Driving & Emergency Cover",
    "Zip Line Manuver": "Zipline Mid-Air Escape & Jump Drops",
    "Peluncur Launch Pad": "Launch Pad High-Altitude Flank Angles",
    "Pintu Rumah Pertahanan": "Building Entrance Trapping & Chokepoint Holds",
    "Jendela Tembak Mundur": "Window Peek-and-Retreat Firing Lines",
    "Granat Asap Penyelamat": "Smoke Wall Cover & Emergency Revive Routes",
    "Lampu Sinyal UAV": "UAV Recon Drone Sweep & Position Exposure",
    "Mesin Penjual Koin": "FF Coin Vending Machine Buy Priorities",
    "Chip Senjata Level 3": "Level 3 Weapon Upgrade Chip Priority",
    "Vending Machine Trik": "Vending Machine Resupply & Revive Cards",
    "Armor Plate Pengganti": "Armor Plate Field Repair & Swap Tricks",
    "Darah Putih EP": "EP Energy Conversion & Continuous Regen",
    "Inhaler Stamina Cepat": "Fast Inhaler Movement & Stamina Buffs",
    "Jamur Jamur Level 4": "Level 4 Mushroom Foraging & Full EP Bank",
    "Kemenangan Booyah Konsisten": "Endgame Booyah Win-Rate Consistency Routines"
  },
  "roblox": {
    "Kode Redeem Blox Fruits Terbaru": "Latest Blox Fruits Redeem Codes",
    "Tier List Devil Fruit Blox Fruits": "Blox Fruits Devil Fruit Tier List",
    "Rute Menuju Sea 2 & Sea 3": "Fast Progression Route to Sea 2 & Sea 3",
    "Panduan Awakening Devil Fruit": "Devil Fruit Awakening Complete Walkthrough",
    "Cara Dapatkan Cursed Dual Katana": "How to Unlock Cursed Dual Katana (CDK)",
    "Tips Farming Fragment Cepat": "Fast Fragment Farming Strategies",
    "Pet Simulator 99 Huge Pet": "Pet Simulator 99 Huge Pet Hatching Tips",
    "Adopt Me Panduan Trading Aman": "Adopt Me Safe Trading & Pet Value Guide",
    "Dress to Impress Layering Juara": "Dress to Impress Winning Layering Techniques",
    "Blade Ball Timing Parry Sempurna": "Blade Ball Perfect Parry Timing Guide",
    "Tier List Skill Blade Ball": "Blade Ball Abilities & Skills Tier List",
    "The Strongest Battlegrounds Combo": "The Strongest Battlegrounds Lethal Combos",
    "Anime Defenders Formasi Unit": "Anime Defenders Meta Unit Placement",
    "All Star Tower Defense Unit Bintang 6": "All Star Tower Defense 6-Star Unit Tier List",
    "Fisch Lokasi Ikan Mitos": "Fisch Mythic Fish Locations & Best Rods",
    "Doors Trik Lolos Hadapi Rush": "Doors How to Evade Rush, Ambush & Screech",
    "7 Game Horor Roblox Mabar": "7 Best Multiplayer Co-Op Roblox Horror Games",
    "Brookhaven Lokasi Brankas Rahasia": "Brookhaven Secret Vault & Safe Locations",
    "Simulasi Pekerjaan Santai Terbaik": "Best Relaxing Job Simulation Games in Roblox",
    "Obby Hardcore Wall Hop Trik": "Hardcore Obby Wall-Hop & Ladder Flick Tricks",
    "Tower of Hell Bebas Jatuh": "Tower of Hell Zero-Fall Speedrun Guide",
    "BedWars Rusher Kasur Kilat": "BedWars Fast Bed-Breaker Rusher Strategies",
    "Arsenal Crosshair & Sensitivity": "Arsenal Pro Crosshair & Sensitivity Tuning",
    "Roblox Studio Panduan Pemula": "Roblox Studio Game Creation Beginner Guide",
    "Item dan Baju Avatar Gratis": "Free Avatar Items & Aesthetic Outfits Catalog",
    "Cara Dapatkan Robux Legal": "How to Earn Robux Safely and Legitimately",
    "Spatial Voice Chat Syarat": "Spatial Voice Chat Setup & Verification",
    "Lindungi Akun dari Hacker PIN": "Account Security & 2-Step PIN Protection",
    "Atasi Lag Roblox di HP Kentang": "How to Fix Roblox Lag on Low-End Android Phones",
    "Komunitas Mabar Seru Indonesia": "Best Multiplayer Roblox Communities",
    "Rivals FPS Mobile Trik": "Rivals FPS Mobile Aim & Movement Tricks",
    "Pressure Game Horor Bawah Laut": "Pressure Deep-Sea Horror Survival Walkthrough",
    "Slap Battles Sarung Sakti": "Slap Battles Secret Glove Unlocks & Combos",
    "Murder Mystery 2 Sheriff Aim": "Murder Mystery 2 Sheriff Aim & Innocent Survival",
    "Da Hood Survival & Cash": "Da Hood Cash Farming & Armor Defense",
    "Total Roblox Drama Trik": "Total Roblox Drama Immunity Challenge Tricks",
    "Evade Lari Cepat Respawn": "Evade Super-Speed Movement & Revive Mechanics",
    "Bee Swarm Simulator Honey": "Bee Swarm Simulator Fast Honey Farming",
    "Royale High Farming Diamond": "Royale High Fast Diamond Farming Routine",
    "Shindo Life Bloodline Tier": "Shindo Life Best Bloodlines Tier List",
    "Grand Piece Online Leveling": "Grand Piece Online Fast Leveling Guide",
    "YBA Stand Tier List": "Your Bizarre Adventure Stand Tier List",
    "Project Slayers Breathing": "Project Slayers Breathing Styles Progression",
    "Deepwoken Survival Tips": "Deepwoken Permadeath Survival & Combat Tips",
    "Type Soul Shikai Guide": "Type Soul Shikai & Bankai Progression Guide",
    "A Universal Time Farming": "A Universal Time Fast Currency & Stand Farming",
    "Pet Sim Diamond Enchant": "Pet Simulator 99 Diamond Enchants & Loadouts",
    "Fisch Joran Pancing Kraken": "Fisch Kraken Catching & Rod Setup Guide",
    "Blox Fruits Race V4 Trial": "Blox Fruits Race V4 Trial Puzzles & Awakenings",
    "Blox Fruits Soul Guitar Quest": "Blox Fruits Soul Guitar Quest Step-by-Step",
    "Blox Fruits Godhuman Fighting": "Blox Fruits Godhuman Fighting Style Unlock",
    "Doors Floor 2 The Mines": "Doors Floor 2 The Mines Walkthrough",
    "DTI VIP Outfit Styling": "Dress to Impress VIP Styling & Theme Matching",
    "Blade Ball Infinity Ability": "Blade Ball Infinity Ability Mechanics",
    "BedWars Kit Tier List": "BedWars Best Kits Tier List & Matchups",
    "Anime Vanguards Meta Units": "Anime Vanguards Meta Units & Evolution Guide",
    "Anime Last Stand Guide": "Anime Last Stand Unit Placements & Raid Tips",
    "Toilet Tower Defense Mythic": "Toilet Tower Defense Mythic Unit Strategies",
    "Lumber Tycoon 2 Wood Farming": "Lumber Tycoon 2 Rare Wood Farming & Sawmills",
    "Theme Park Tycoon 2 Rollercoaster": "Theme Park Tycoon 2 Smooth Rollercoaster Physics",
    "Restaurant Tycoon 2 Star Rating": "Restaurant Tycoon 2 Fast 5-Star Rating Setup",
    "Work at a Pizza Place Delivery": "Work at a Pizza Place Fast Delivery Efficiency",
    "Vehicle Legends Money Farm": "Vehicle Legends Highway Money Grinding",
    "Car Driving Indonesia Roleplay": "Car Driving Indonesia Realistic Roleplay Tips",
    "Emergency Hamburg Police RP": "Emergency Hamburg Police & EMT Roleplay Guide",
    "Natural Disaster Survival Tips": "Natural Disaster Survival Evacuation Spots",
    "Flee the Facility Beast Escape": "Flee the Facility Beast Evading & Hacking",
    "Survive the Killer Perks": "Survive the Killer Best Survivor & Killer Perks",
    "Piggy Escape Chapter Guide": "Piggy Puzzle Solutions & Chapter Escape Guide",
    "Rainbow Friends Monster Evade": "Rainbow Friends Monster Evasion & Item Collection",
    "Banana Eats Puzzle Solver": "Banana Eats Fast Puzzle Solving & Stealth",
    "Color Hide and Seek Hiding": "Color Hide and Seek Best Camouflage Spots",
    "SharkBite 2 Boat Driving": "SharkBite 2 High-Speed Boat Driving & Weapon Aim",
    "Build a Boat for Treasure Gold": "Build a Boat for Treasure Unlimited Gold Glitch",
    "Babft Auto Farm Mechanics": "Build a Boat Auto-Farming Redstone Mechanics",
    "Speed Run 4 Fast Route": "Speed Run 4 Fast Level Completion Routes",
    "Super Hero Tycoon Upgrade": "Super Hero Tycoon Fast Base Upgrades",
    "Mega Mansion Tycoon Fast Cash": "Mega Mansion Tycoon Fast Cash Multipliers",
    "Driving Empire Supercar Tuning": "Driving Empire Supercar Tuning & Drag Racing",
    "Weight Lifting Simulator Brawn": "Weight Lifting Simulator Fast Brawn & Rebirths",
    "Muscle Legends Fast Rebirth": "Muscle Legends Agility & Fast Rebirth Guide",
    "Ninja Legends Chi Farm": "Ninja Legends Fast Chi & Ninjutsu Maxing",
    "Roblox Performance Booster 2026": "Roblox Mobile Performance Boost & Ping Optimization"
  },
  "minecraft": {
    "Seed Desa Berdampingan Mansion": "Village Beside Woodland Mansion World Seed",
    "Seed Survival Island Ekstrem": "Extreme Survival Island Ocean Seed",
    "Farm Iron Golem Otomatis": "Automatic Iron Golem Farm Tutorial",
    "Farm Mob XP 5 Menit Level 30": "5-Minute Mob XP Farm to Reach Level 30",
    "Ancient Debris Netherite Tempat Tidur": "Ancient Debris Bed-Mining Blast Method",
    "Kalahkan Ender Dragon Panah & Air": "How to Defeat Ender Dragon with Water Bucket & Bow",
    "End City Elytra & Shulker Box": "End City Elytra & Shulker Box Raiding Route",
    "Desain Rumah Kayu Estetik Pemula": "Aesthetic Wooden Starter House Architectural Design",
    "Dekorasi Interior Modern Kamar": "Modern Interior Bedroom & Furniture Ideas",
    "Shaders Minecraft PE Ringan 60 FPS": "Lightweight 60 FPS Shaders for Bedrock PE",
    "7 Addon Bedrock Terbaik": "7 Best Quality-of-Life Bedrock Edition Addons",
    "Pintu Rahasia 2x2 Redstone Piston": "Compact 2x2 Piston Hidden Door Tutorial",
    "Brewing Stand Resep Semua Ramuan": "Complete Brewing Stand Potion Recipes Chart",
    "Jinakkan Hewan Peliharaan Serigala": "How to Tame & Breed Wolves and Dogs",
    "Villager Trading Hall Mending 1 Zamrud": "1-Emerald Mending Villager Trading Hall Setup",
    "Pillager Raid Totem of Undying": "Pillager Raid Farm for Totem of Undying",
    "Ancient City Warden Sensor Wool": "Ancient City Wool Stealth Guide to Avoid the Warden",
    "Kapal Karam Peti Harta Karun": "Sunken Shipwreck & Buried Treasure Map Exploration",
    "Bangun Kastil Batu Megah Benteng": "Majestic Medieval Stone Fortress Construction",
    "Farm Gandum & Wortel Villager": "Automatic Villager Wheat & Carrot Crop Farm",
    "Kombinasi Enchantment Senjata Armor": "Best Weapon & Armor Enchantment Combinations",
    "Peta Kartografi & Navigasi Kompas": "Cartography Table Map Scaling & Compass Navigation",
    "Jinakkan Kuda & Unta Gurun": "How to Tame Horses & Desert Camels",
    "Farm Tebu & Bambu Observer": "Observer-Powered Automatic Sugar Cane & Bamboo Farm",
    "Woodland Mansion Kalahkan Evoker": "Woodland Mansion Evoker & Vex Battle Strategies",
    "Bertahan di Bioma Salju Powder": "Surviving Powder Snow in Cold Mountain Biomes",
    "Trik Mancing Buku Mitos Sakti": "AFK Fishing Tricks for Rare Enchanted Books",
    "Lift Air Soul Sand Gelembung": "Soul Sand Bubble Column Water Elevator Setup",
    "Setting Grafis HP Kentang 120 FPS": "Low-End Android Settings for Smooth 120 FPS",
    "Mabar Realms Server Gratis HP PC": "Free Crossplay Bedrock & Java Server Setup",
    "Farm Emas Nether Piglin Otomatis": "Automatic Nether Piglin Gold & Barter Farm",
    "Farm Raid Emerald Tanpa Batas": "Infinite Emerald Stacking Raid Farm Mechanics",
    "Farm Slime Chunk Bawah Tanah": "Subterranean Slime Chunk Finding & Farm Setup",
    "Farm Enderman Void Cepat XP": "High-Speed Enderman Void XP Farm",
    "Farm Kayu Otomatis TNT Blast": "Automated Tree Farm with TNT Blast Chamber",
    "Trial Chambers Kalahkan Breeze": "Trial Chambers Breeze Mobility & Vault Keys",
    "Senjata Mace Kombo Wind Charge": "Heavy Mace Weapon & Wind Charge Smash Combo",
    "Armadillo Scute Armor Serigala": "Armadillo Scute Foraging & Wolf Armor Crafting",
    "Auto Crafter Redstone Fabrikasi": "Auto-Crafter Redstone Automated Assembly Lines",
    "Copper Bulb Delay Mekanisme": "Copper Bulb 1-Tick Redstone Pulse Delayer",
    "Desain Jembatan Gantung Estetik": "Aesthetic Suspension Bridge Architectural Ideas",
    "Ide Mercusuar Tepi Pantai": "Coastal Shoreline Working Lighthouse Design",
    "Desain Kincir Angin Pertanian": "Rustic Agricultural Windmill Building Guide",
    "Rumah Bawah Tanah Rahasia": "Hidden Underground Survival Bunker Design",
    "Bunker Anti Creeper Kaca": "Blast-Proof Anti-Creeper Glass Safehouse",
    "Kolam Ikan Hias Akuarium Kaca": "Decorative Indoor Glass Aquarium Build",
    "Taman Bunga Lebah Honey Farm": "Beehive Flower Garden & Automated Honey Farm",
    "Farm Katak Froglight Rawa": "Swamp Frog Froglight Farming Mechanics",
    "Axolotl Kolam Bioma Lush Cave": "Lush Cave Lush Pond & Axolotl Breeding",
    "Glow Berry Tanaman Hias Cahaya": "Glow Berry Ambient Lighting & Farm Setup",
    "Amethyst Geode Kristal Suara": "Amethyst Geode Crystal Harvesting Guidelines",
    "Deepslate Tambang Berlian Y-58": "Deepslate Diamond Strip-Mining at Y=-58",
    "Gua Karst Dripstone Lava Tanpa Batas": "Pointed Dripstone Infinite Lava Generator",
    "Sculk Catalyst XP Generator": "Sculk Catalyst Subterranean XP Generator",
    "Allay Otomatis Sortir Barang": "Allay Musical Note Automated Item Sorter",
    "Piston Door 3x3 Kompak Redstone": "Compact 3x3 Redstone Piston Vault Door",
    "Item Sorter Gudang Otomatis": "Centralized Warehouse Automated Item Sorter",
    "Furnace Smelter Super Cepat": "Super-Fast Industrial Furnace Smelting Array",
    "Brewing Otomatis Potion Generator": "Automated Multi-Potion Brewing Station",
    "Lonceng Alarm Desa Sensor Cahaya": "Daylight Detector Village Bell Defense Alarm",
    "Buku Catatan Lectern Rahasia": "Lectern Comparator Secret Book Switch Mechanism",
    "Armor Stand Pose Kustom Show": "Armor Stand Custom Poses & Display Gallery",
    "Banner Bendera Desain Keren": "Custom Loom Banner Patterns & Coat of Arms",
    "Pot Bunga Sniffer Biji Kuno": "Sniffer Ancient Seeds Cultivation & Decor",
    "Sniffer Farm Tanaman Purba": "Automated Sniffer Digging & Torchflower Farm",
    "Armor Trim Pola Keren Baju": "Smithing Template Armor Trim Customization",
    "Netherite Upgrade Template Duplikasi": "How to Duplicate Netherite Upgrade Templates",
    "Pottery Sherd Arkeologi Pasir": "Archaeology Pottery Sherds & Trail Ruins",
    "Kuas Arkeologi Kuil Gurun": "Archaeology Brush Excavation at Desert Pyramids",
    "Sponge Keringkan Monumen Laut": "Ocean Monument Guardian Draining with Sponges",
    "Kalahkan Elder Guardian Prismarine": "Defeating Elder Guardians for Prismarine & Sponges",
    "Conduit Jantung Laut Nafas Air": "Conduit Heart of the Sea Water-Breathing Power",
    "Beacon Cahaya Kecepatan Haste 2": "Full Beacon Pyramid Activation for Haste II",
    "Wither Boss Trik Bawah Bedrock": "Bedrock Ceiling Wither Boss Suffocation Trap",
    "Wither Skeleton Tengkorak Hitam": "Wither Skeleton Skull Hunting & Fortress Outposts",
    "Nether Fortress Blaze Rod Farm": "Nether Fortress Blaze Spawner XP & Rod Farm",
    "Piglin Bartering Emas Mutiara": "Automated Piglin Gold Barter for Ender Pearls",
    "Ghast Tear Ramuan Regenerasi": "Ghast Hunting Strategies for Regeneration Tears",
    "Magma Cream Tahan Api Ramuan": "Magma Cream Sourcing for Fire Resistance Potions",
    "Phantom Membrane Membran Elytra": "Phantom Membrane Hunting for Elytra Repair",
    "Turtle Helmet Nafas Air Tambahan": "Turtle Helmet Crafting for Extra Water Breathing",
    "Trident Riptide Terbang Hujan": "Riptide Trident Rain Flight & Kinetic Damage",
    "Minecraft Mastery Guide 2026": "Comprehensive Minecraft 2026 Technical Survival Mastery"
  },
  "genshin": {
    "Spiral Abyss Lantai 12 Komposisi Tim": "Spiral Abyss Floor 12 Team Compositions",
    "Artefak Farming Efisien Domain": "Efficient Artifact Domain Resin Management",
    "Build Hyperbloom Kuki Shinobu Alhaitham": "Alhaitham & Kuki Shinobu Hyperbloom Synergy",
    "Build Neuvillette Solo Carry": "Neuvillette Solo Hydro Hypercarry Build",
    "Build Furina Buff Fanfare": "Furina Fanfare Buffer & Sub-DPS Build",
    "Build Arlecchino Bond of Life": "Arlecchino Bond of Life Pyro Hypercarry Build",
    "Build Raiden Shogun National Team": "Raiden Shogun Rational Team Cycling",
    "Build Nahida Dendro Applicator": "Nahida Dendro Application & Tri-Karma Setup",
    "Build Kazuha Swirl Double VV": "Kaedehara Kazuha Double Swirl Viridescent Venerer",
    "Build Zhongli Shield Kebal Bintang 5": "Zhongli Unbreakable Shield & Resistance Shred",
    "Build Hu Tao Vaporize Yelan": "Hu Tao & Yelan High-Multiplier Vaporize Team",
    "Build Navia Geo Crystallize Nuke": "Navia Crystallize Gunbrella Shotgun Nuke",
    "Build Clorinde Electro Pistol Dash": "Clorinde Electro Pistol Thrust & Dash Mechanics",
    "Build Emilie Dendro Burning": "Emilie Dendro Burning Sub-DPS Harmonization",
    "Build Kinich Saurian Grapple": "Kinich Saurian Grapple & Nightsoul Cannon",
    "Build Mualani Shark Surf Vaporize": "Mualani Shark-Surfing Vaporize Burst",
    "Build Xilonen Geo Resonansi Shred": "Xilonen Geo Resonance Resistance Shred",
    "Build Chasca Anemo Flying Gun": "Chasca Anemo Aerial Recon & Multi-Element Burst",
    "Build Mavuika Pyro Archon Teori": "Mavuika Pyro Archon Team Synergy Predictions",
    "Build Capitano Fatui Harbinger": "Capitano Harbinger Combat Meta Analysis",
    "Honkai Star Rail Memory of Chaos 12": "Honkai Star Rail Memory of Chaos Floor 12",
    "Build Firefly Super Break Ruan Mei": "Firefly & Ruan Mei Super Break Harmony",
    "Build Acheron Nihility Nuke": "Acheron Nihility Debuff Stacking Nuke",
    "Build Feixiao Hunt Follow-Up": "Feixiao Hunt Follow-Up Attack Speed Synergy",
    "Build Robin Harmony Chorus": "Robin Harmony Concerto Team Action Advance",
    "Build Aventurine Preservation Shield": "Aventurine Stacked Coin Shields & Blind Bet",
    "Build Sparkle Quantum Action Advance": "Sparkle Quantum Skill Point & Action Advance",
    "Build Ruan Mei Break Speed Buffer": "Ruan Mei Break Efficiency & Speed Amplification",
    "Build Dan Heng IL Propagation": "Dan Heng Imbibitor Lunae Propagation 3-SP Burst",
    "Build Jingliu Destruction Transmigration": "Jingliu Destruction Spectral Transmigration",
    "Speed Tuning 134 Breakpoint HSR": "Honkai Star Rail 134 Speed Breakpoint Tuning",
    "Energy Recharge Threshold Genshin": "Genshin Impact Energy Recharge Threshold Benchmarks",
    "Elemental Gauge Theory ICD Trik": "Elemental Gauge Theory & ICD Aura Application",
    "Farm Primogem Gratis Natlan Map": "Free Primogems Exploration Route in Natlan",
    "Farm Stellar Jade Penacony Chest": "Penacony Chest Route for Free Stellar Jades",
    "Simulated Universe Gold and Gears": "Simulated Universe Gold & Gears Dice Customization",
    "Divergent Universe Path Resonance": "Divergent Universe Equations & Path Resonances",
    "Echo of War Boss Farming Material": "Echo of War Weekly Boss Material Optimization",
    "Reroll Substat Artefak Roll 4 Crit": "Artifact Substat Rolling & 4-Crit Upgrade Priorities",
    "Crit Ratio 1:2 Golden Rule": "The 1:2 Golden Crit Ratio (60/120 to 80/160)",
    "Ascension Material Boss Route": "Fast Boss Routes for Character Ascension Materials",
    "Local Specialty 168 Karakter Cepat": "168 Local Specialty Collection Route Optimization",
    "Senjata Bintang 4 F2P Alternatif": "Best F2P 4-Star Weapon Alternatives",
    "Light Cone Bintang 4 Herta Store": "Best 4-Star Light Cones & Herta Store Priorities",
    "Daily Resin Management Efisien": "Daily Resin & Condensed Resin Spending Discipline",
    "Trailblaze Power Cap Farm Relic": "Trailblaze Power Efficiency & Cavern Relic Farming",
    "Lore Teyvat Rahasia Khaenriah": "Teyvat Lore Mysteries: Khaenri'ah & Ancient Dynasties",
    "Lore Penacony Stellaron Hunter": "Penacony Stellaron Hunter Motives & Destiny Lore",
    "Co-op Domain Tips Mabar Cepat": "Fast Co-Op Artifact Domain Farming Routines",
    "Event Limited Waktu Reward": "Limited-Time Event Rewards & Crown Prioritization",
    "Fishing The Catch Tombak Gratis": "Fishing Route to Unlock R5 'The Catch' Polearm",
    "Reputation Reward Glider Natlan": "Natlan City Reputation & Wind Glider Unlocks",
    "Teapot Dekorasi Load Limit": "Serenitea Pot Load Limit & Coin Generation",
    "Paimon Bargain Fate Bulanan": "Paimon's Bargains Monthly Intertwined Fate Shop",
    "Starlight Exchange Senjata Blackcliff": "Starlight Exchange Blackcliff Weapon Investment",
    "Banner Pity 50:50 Strategi Simpan": "Gacha Pity Management & 50:50 Guarantee Strategies",
    "Weapon Banner Fate Point Trik": "Epitomized Path Fate Point Strategy on Weapon Banners",
    "Battle Pass Senjata Rekomendasi": "Battle Pass 4-Star Weapon Selection Priorities",
    "Suikoden Saurian Natlan Mekanik": "Natlan Saurian Transformation & Travel Mechanics",
    "Phlogiston Bar Natlan Movement": "Phlogiston Energy Bar Management in Natlan",
    "Nightsoul Transmission Trik Ganti": "Nightsoul Transmission Character Swapping Tech",
    "Pure Fiction Erudition Team": "Pure Fiction Erudition High-Score Waveclearing",
    "Apocalyptic Shadow Boss Trik": "Apocalyptic Shadow Boss Break Strategy",
    "Planar Ornaments World 9 Farm": "Planar Ornaments World 9 Immersion Extraction",
    "Relic Synthesis Self-Modeling Resin": "Self-Modeling Resin Crafting Priorities for Relics",
    "Genshin Cooking Stat Buff Boss": "Consumable Food Buff Stacking for Weekly Bosses",
    "Condensed Resin Crafting Hemat": "Condensed Resin Crafting & Time-Saving Routines",
    "Parametric Transformer Loot": "Parametric Transformer Input Materials & Best Loot",
    "Treasure Compass Natlan 100%": "Natlan Treasure Compass for 100% Map Completion",
    "Oculi Natlan Pyroculus Lokasi": "All Natlan Pyroculus Locations & Collection Routes",
    "Shrine of Depths Kunci Natlan": "Natlan Shrine of Depths Keys & Luxurious Chests",
    "Spiral Abyss Buff Lunar Phase": "Exploiting Lunar Phase Blessings in Spiral Abyss",
    "Floor 11 Monolith Defense Trik": "Floor 11 Monolith Defense Crowd-Control Taunts",
    "Teyvat Fishing Weapon Polearm": "Teyvat Fishing Hotspots & Achievement Rewards",
    "Natlan Tribe Reputation Max": "Maxing Natlan Tribal Reputation Expeditions",
    "HSR Fate Collaboration Update": "Honkai Star Rail x Fate Collaboration Overview",
    "Genshin Anime Ufotable Update": "Genshin Impact Anime Animation Milestones",
    "Mobile Graphics 60 FPS Suhu Dingin": "Mobile Graphics Configuration for Cool 60 FPS",
    "Controller Bluetooth Support Android": "Bluetooth Controller Mapping for Android Gacha",
    "Cross Save PC Mobile Cloud": "Cross-Save Sync Between PC, Mobile & Cloud Platforms",
    "Genshin Endgame Mode Teori 2026": "Genshin Impact Permanent Endgame Modes Roadmap",
    "HSR Powercreep Management": "Honkai Star Rail Roster Longevity & Powercreep Prep",
    "Bilingual Voice Cast Pilihan Seru": "Audio Settings: Japanese, English & Chinese Voiceovers"
  },
  "football": {
    "Formasi 4-3-3 False Nine Juara": "4-3-3 False Nine Championship Tactics",
    "Formasi 4-2-2-2 Counter Attack Cepat": "4-2-2-2 Rapid Counter-Attack Formation",
    "Formasi 4-1-2-1-2 Narrow Tiki-Taka": "4-1-2-1-2 Narrow Tiki-Taka Possession Play",
    "Formasi 3-5-2 Wing Play Silang": "3-5-2 Overlapping Wing Play & Crosses",
    "Formasi 4-2-3-1 Penguasaan Bola": "4-2-3-1 Controlled Possession Blueprint",
    "Trik Driven Ground Pass Menembus Bek": "Driven Ground Pass to Pierce Low-Block Defenses",
    "Finesse Shot Melengkung Luar Kotak": "Curling Finesse Shots from Outside the 18-Yard Box",
    "Power Shot Timing Hijau Presisi": "Green-Timed Power Shot Shooting Mechanics",
    "Skill Move Heel to Heel Flick": "Heel-to-Heel Flick Acceleration Burst",
    "Skill Move Lane Change Roll": "Ball Roll & Lane Change Dribbling Combos",
    "Skill Move Roulette Berputar Cepat": "Quick 360-Degree Roulette Spin Mechanics",
    "Skill Move Rainbow Flick Chip": "Rainbow Flick Dribble Over Rushing Keepers",
    "Jockey Defense Tahan Tombol L2": "Jockey Defending & Distance Control Mechanics",
    "Second Man Press Jebakan Offside": "Second Man Press & Offside Trap Timing",
    "Kiper Manual Tutup Sudut Sempit": "Manual Goalkeeper Positioning for Near-Post Angles",
    "Umpan Terobosan Lambung L1 Segitiga": "Lofted Through Balls to Break Defensive Lines",
    "Crossing Umpan Silang Tiang Jauh": "Far-Post Driven Crosses for Header Goals",
    "Sundulan Kepala Heading Power": "Timed Power Headers from Set Pieces",
    "Tendangan Bebas Free Kick Curve": "Direct Free Kick Curler Technique & Wall Heights",
    "Penalti Panenka Tipu Kiper": "Panenka Chip Penalty Mind Games",
    "Tendangan Sudut Corner Kick Glitch": "Corner Kick Near-Post Flick-On Routines",
    "Manajemen Stamina Babak Kedua": "Second-Half Stamina Conservation Guidelines",
    "Super Sub Penyerang Sayap Cepat": "Pacey Super-Sub Wingers for Late Goals",
    "Setting Kamera Tele Broadcast Lebar": "Tele Broadcast Camera Settings for Field Vision",
    "Setting Tombol Virtual Stick Halus": "Virtual Joystick Sensitivity & Floating Stick Setup",
    "eFootball Formasi Quick Counter": "eFootball Quick Counter Playstyle Setup",
    "eFootball Trik Possession Game": "eFootball Possession Game Short Passing Routine",
    "eFootball Match-up Defense Intersep": "eFootball Match-Up Button Interception Defense",
    "eFootball Stunner Cross Umpan Maut": "eFootball Stunning Cross Delivery into the Box",
    "eFootball Stunning Shot Jarum Jam": "eFootball Stunning Shot Power & Wind-Up Timing",
    "Farming Koin eFootball Gratis": "How to Earn Free eFootball Coins Efficiently",
    "Farming FC Points & Gems Efisien": "EA FC Gems & Season Points Farming",
    "Event Division Rivals Rank 1": "Division Rivals Promotion Climbing Blueprint",
    "Weekend League Juara 20 Win": "Weekend League 20-Win Tournament Strategy",
    "Pasar Transfer Trading Pemain": "Transfer Market Flipping & Coin Investment",
    "Investasi Kartu Rating Tinggi": "High-Rated Player Card Investing for SBCs",
    "Evolution Player Kartu Favorit": "Player Evolution Pathways for Hidden Gems",
    "Chemistry Squad 33 Penuh": "Building 33/33 Full Squad Chemistry",
    "Kiper Terbaik Refleks Kucing": "Top Goalkeepers with Lightning Reflexes",
    "Bek Tengah CB Cepat Anti Terobos": "Pacey Center Backs to Stop Fast Counter-Attacks",
    "Gelandang Bertahan CDM Badak": "Bulky Defensive Midfielders for Midfield Dominance",
    "Playmaker CAM Umpan Ajaib": "Creative Central Attacking Midfielders",
    "Sayap Kilat Pace 95+ Lari": "95+ Pace Explosive Wingers for Flank Dominance",
    "Striker Monster Finishing 90+": "Clinical 90+ Finishing Target Strikers",
    "Atasi Delay Koneksi Ping Hijau": "Eliminating Network Latency for Solid Green Ping",
    "Main Pakai Stik Bluetooth HP": "Configuring Bluetooth Controllers for Mobile Football",
    "Trik Hindari Scripting Comeback": "Countering Dynamic Momentum Shifts & Scripting",
    "Mental Tenang Adu Penalti Final": "Composure & Psychology During Final Penalty Shootouts",
    "Analisis Taktik Pep vs Ancelotti": "Tactical Study: Positional Play vs Fluid Transitions",
    "Turnamen Esports Mobile Indo 2026": "Mobile Football Esports Tournament Preparation",
    "Formasi 5-2-3 Anti Kebobolan": "5-2-3 Lockdown Formation for Tight Leads",
    "Formasi 4-4-2 Klasik Solid": "Classic 4-4-2 Balanced Flat Line Tactical Setup",
    "Trik Dribble R1 Sprint Halus": "Controlled Sprint Dribbling & Micro-Touches",
    "Fake Shot Stop Hentikan Bola": "Fake Shot Stop & Immediate Body Feint",
    "Driven Lobbed Through Ball": "Driven Lobbed Through Pass Execution",
    "Trik Pagar Hidup Melompat": "Defensive Wall Jump Timing on Direct Free Kicks",
    "Kiper Maju Keluar Kotak": "Goalkeeper Sweeper-Keeper Rushing Trajectories",
    "Build Squad Budget 1 Juta Koin": "Building a Competitive Squad Under 1 Million Coins",
    "Pemain Muda Wonderkid Murah": "Top Bargain Wonderkids for Career & League Squads",
    "Master League Mode Offline": "Master League & Career Mode Transfer Strategies",
    "Manager Mode Taktik Otomatis": "Manager Mode Simulation & Automated Tactical Presets",
    "Pelatih Taktik Out Wide eFootball": "eFootball Out Wide Manager Playstyle Optimization",
    "Pelatih Long Ball Counter": "Long Ball Counter Manager Tactics in eFootball",
    "Progression Points Reset Trik": "eFootball Progression Points Allocation & Resets",
    "Player Skills Tambahan Konami": "Adding Essential Player Skills via Training Programs",
    "Skill Double Touch eFootball": "Executing Double Touch Dribbles in eFootball",
    "Skill Marseille Turn Cepat": "Smooth Marseille Roulette Turns on Mobile Controls",
    "Skill One-Touch Pass Wajib": "One-Touch Passing Skill Priority for Midfielders",
    "Skill Interception Bek Terbaik": "Interception & Blocker Defensive Traits for CBs",
    "Skill Blocker Blokir Tembakan": "Blocker Trait Positioning to Stop Outside Shots",
    "Server Maintenance Waktu Rutin": "Navigating Server Maintenance Schedules & Downtime",
    "Pemberian Booster eFootball 2026": "eFootball Stat Booster Items & Best Targets",
    "Update Transfer Musim Dingin": "Winter Roster Updates & Rating Rebalances",
    "Kartu Icon Legenda Sepak Bola": "Iconic Legend Cards & Nostalgia Squad Building",
    "Event Co-op Mabar 3v3 Teman": "3v3 Co-Op Mode Chemistry with Friends",
    "Koneksi LAN Kabel via Type-C": "Zero-Lag Wired Ethernet Gaming on Mobile",
    "Layar 120Hz Respons Sentuhan Stik": "120Hz Refresh Rate Touch Synchronization",
    "Turnamen Komunitas Cafe Mabar": "Community League Match Setup & Tournament Rules"
  },
  "br": {
    "Setting Gyroscope Full 400% PUBGM": "Full 400% Gyroscope Sensitivity Tuning",
    "Sensitivitas ADS No Recoil M416": "Zero-Recoil M416 ADS Sensitivity Configuration",
    "Setting Sensitivitas CODM Battle Royale": "CODM Battle Royale Optimal Sensitivity Settings",
    "Sensitivitas Free Look & Red Dot": "Free Look & Red Dot Optical Sensitivity Alignment",
    "Setting Scope 3x Semprotan Laser": "3x Scope Laser-Accurate Spray Calibration",
    "Setting Scope 4x DMR Mini 14": "4x Scope Tap-Shooting Sensitivity for DMRs",
    "Setting Scope 6x Ubah ke 3x M416": "6x-to-3x Scope Recoil Pull-Down Benchmark",
    "Setting AWM One Shot Satu Peluru": "AWM Sniper Bolt-Action Aim Sensitivity",
    "Trik Close Combat Jiggle Gerak Cepat": "CQC Rapid Jiggle Movement & Crosshair Placement",
    "Trik Crouch Shoot Tembak Jongkok": "Crouch-Shooting Spray Stabilization in Gunfights",
    "Trik Prone Shoot Tiarap Dadakan": "Drop-Shotting Techniques to Evade Enemy Crosshairs",
    "Trik Jump Shot Lompat Tembak": "Jump-Shotting Corners & Breaking Enemy Angles",
    "Trik Peek Kiri Kanan Cepat Semak": "Quick Peek & Lean Mechanics from Cover",
    "Rotasi Zona Biru Pinggir Peta": "Blue Zone Edge-Playing Rotation Strategies",
    "Rotasi Kendaraan Kompon Aman": "Vehicle Rotation Pathways to Secure Central Compounds",
    "Pendaratan Cepat Hot Drop Pochinki": "Fast Hot-Drop Parachuting into High-Loot Zones",
    "Looting Efisien 2 Menit Siap Tempur": "2-Minute Combat-Ready Speed Looting Routines",
    "Attachment Kompensator vs Suppressor": "Compensator vs Suppressor Muzzle Comparison",
    "Attachment Vertical Grip vs Angled": "Vertical Foregrip vs Angled Foregrip Recoil Test",
    "Extended Mag Quickdraw Wajib": "Extended Quickdraw Magazine Reload Speed Advantage",
    "Manajemen Granat Asap Smoke Wall": "Smoke Wall Placement for Safe Rotations",
    "Granat Ledak Frag Waktu 3 Detik": "3-Second Cooked Frag Grenade Explosions",
    "Molotov Koktail Bakar Kompon": "Molotov Cocktails for Room Clearing & Area Denial",
    "Flashbang Butakan Musuh Ruangan": "Flashbang Stun Tactics Before Room Breaches",
    "Revive Rekan Tim di Asap Tebal": "Safe Teammate Revivals Inside Smoke Clouds",
    "Komunikasi Suara Mikrofon Squad": "Clear Voice Comms & Coordinate Callouts",
    "Formasi Rusher Flanker Support": "Rusher, Flanker, and Support Squad Roles",
    "Sniper Pengintai Informasi Bukit": "High-Ground Sniper Scouting & Reconnaissance",
    "Kendaraan Dacia vs UAZ Lindungi": "Sedan vs Armored UAZ Vehicle Cover Utilities",
    "Buggy Bermanuver Cepat Tebing": "Off-Road Buggy Mountain Driving Mechanics",
    "Air Drop Kotak Merah Senjata Groza": "Securing Red Airdrops for Groza & AWM Supplies",
    "Senjata AWM vs AMR Anti Kendaraan": "AWM vs Anti-Materiel AMR Sniper Comparisons",
    "Senjata MG3 LMG Tembak Cepat": "MG3 990-RPM Machine Gun Rapid Suppressive Fire",
    "Senjata DBS Shotgun Raja Rumah": "DBS Double-Barrel Shotgun Indoor Dominance",
    "Senjata UMP45 Laser Jarak Dekat": "UMP45 Close-Quarters Laser Spray Loadout",
    "Audio Jejak Kaki Headset Presisi": "Stereo Headset Audio Tuning for Footstep Cues",
    "Grafis Smooth Extreme 90 FPS": "Smooth + 90 FPS Graphic Preset Configuration",
    "Atasi Frame Drop Pertempuran Akhir": "Preventing Frame Drops During Dense Final Zones",
    "Posisi Duduk Ergonomis Mabar 4 Jam": "Ergonomic Posture Guidelines for Long Gaming Sessions",
    "Kain Pembersih Layar Sentuh Licin": "Screen Cleaning & Touch Friction Maintenance",
    "Map Erangel Rute Jembatan Militer": "Erangel Military Island Bridge Ambush Tactics",
    "Map Miramar Tebing Sniper AWM": "Miramar Ridge-to-Ridge Long-Range Sniper Duels",
    "Map Sanhok Semak Kamuflase Rumput": "Sanhok Prone Camouflage & Grass Concealment",
    "Map Vikendi Salju Jejak Kaki": "Vikendi Snow Terrain Tracking & Compound Defense",
    "Map Livik Pertempuran Kilat 15 Menit": "Livik High-Speed 15-Minute Combat Strategy",
    "Event Kolaborasi Mode Khusus PUBGM": "Special Event Mode Abilities & Item Utilization",
    "CODM Custom Gunsmith Meta 2026": "CODM Gunsmith Attachments for ADS Speed & Range",
    "CODM Operator Class Medic Ninja": "CODM Battle Royale Operator Class Synergies",
    "CODM Sniper Kar98k Quick Scope": "Quick-Scope Sniping Mechanics in CODM",
    "CODM Shotgun KRM Sliding Jump": "Slide-Jump Shotgun KRM Movement Techniques",
    "Turnamen PMGC & PMGO Indonesia": "Competitive Esports Tournament Mindset & Rules",
    "Mental Baja Clutch 1 Lawan 4": "Clutching 1v4 Squad Wipes with Strategic Separation",
    "Review Killcam Evaluasi Mati": "Analyzing Killcams to Correct Positioning Mistakes",
    "Warm Up TDM Latihan Aim 15 Menit": "15-Minute Daily TDM Aim Warm-Up Routine",
    "Cheater Report Sistem Tencent": "Reporting Fair-Play Violations & Anti-Cheat Updates",
    "Keamanan Akun Verifikasi 2 Langkah": "Securing Gaming Accounts with 2-Factor Authentication",
    "Top Up UC Legal Promo Resmi": "Official In-Game Currency Top-Up & Safety Guidelines",
    "Skin Senjata Upgrade Efek Kill": "Progressive Weapon Skin Upgrade Priorities",
    "Title Gelaran Keren Profil Akun": "Unlocking Prestigious In-Game Achievement Titles",
    "Tier Conqueror Target Awal Musim": "Fast-Track Conqueror Rank Push in Early Season",
    "Point Rank Minus Pencegahan Trik": "Preventing Tier Demotion & Minimizing Minus Points",
    "Mabar Duo Serasi Komunikasi": "Duo Queue Synergy & Coordinated Target Firing",
    "Setting Sensitivitas iPad vs HP": "Tablet vs Smartphone Sensitivity Conversion Ratios",
    "Sensitivitas Layar Sentuh Lengket": "Solving Sticky Screen Touch Delay with Accessories",
    "Pencegahan Panas HP Baterai Awet": "Preventing Battery Overheating During Long Matches",
    "Suara Peluru Silencer Jarak Jauh": "Disguising Gunfire Location with Ranged Silencers",
    "Recoil Beryl M762 Peluru 7.62": "Taming Beryl M762 Heavy 7.62mm Recoil",
    "Recoil AKM Jarak Dekat Mematikan": "AKM Close-Range Hipfire & Iron-Sight Mastery",
    "DMR SLR vs SKS Pilihan Pro": "SLR vs SKS Designated Marksman Rifle Comparisons",
    "Pistol Scorpion Darurat Awal Turun": "Early Hot-Drop Survival with Machine Pistols",
    "Trik Panjat Tebing Parkour Gedung": "Urban Parkour & Rooftop Vaulting Shortcuts",
    "Pintu Rumah Jebakan Ledakan": "Doorway Traps & Frag Grenade Ambush Angles",
    "Atap Rumah Posisi Tembak Rahasia": "Unconventional Rooftop Sniping & Overwatch Perches",
    "Kolong Jembatan Sembunyi Zona": "Under-Bridge Survival & Water Evacuation Routes",
    "Taktik Chicken Dinner Konsisten": "Endgame Discipline to Secure Consistent Chicken Dinners"
  },
  "gear": {
    "Pendingin HP Peltier Magnetik vs Kipas": "Magnetic Semiconductor Phone Coolers vs Conventional Fans",
    "Sarung Jari Serat Perak 0.3mm Licin": "0.3mm Conductive Silver Fiber Gaming Finger Sleeves",
    "Gamepad Controller Bluetooth Android": "Ultra-Low Latency Bluetooth Android Gamepads",
    "TWS Gaming Latensi Rendah 40ms": "40ms Low-Latency Gaming Wireless Earbuds",
    "Kabel Charger Siku 90 Derajat L-Shape": "90-Degree L-Shaped Fast Charging Cables",
    "Kabel Converter Type-C Audio Charger": "2-in-1 Type-C Audio Jack & Fast Charge Splitters",
    "Screen Protector Tempered Glass Matte": "Matte Anti-Glare Tempered Glass Screen Protectors",
    "Pelindung Layar Anti Sidik Jari Keringat": "Oleophobic Anti-Fingerprint Screen Shields",
    "Power Bank Fast Charging 65W Ringan": "Compact 65W Fast-Charging Power Banks",
    "Dudukan HP Stand Meja Ergonomis Holder": "Ergonomic Adjustable Desktop Smartphone Stands",
    "Headset Gaming Jack 3.5mm Surround 7.1": "3.5mm Wired Headsets with 7.1 Virtual Surround",
    "Stylus Pen Presisi Palm Rejection": "Active Precision Stylus Pens with Palm Rejection",
    "Cooler RGB HP Dual Fan Super Dingin": "Dual-Turbine RGB Semiconductor Smartphone Coolers",
    "Trigger L1 R1 Tombol Fisik Layar": "Capacitive L1/R1 Physical Trigger Buttons",
    "Thumb Grip Analog Karet Anti Slip": "Anti-Slip Silicone Analog Thumbstick Grips",
    "Pembersih Semprotan Layar Antibakteri": "Antibacterial Screen Cleaner Sprays & Microfiber Tools",
    "Tas Pouch Simpan Aksesoris Gaming": "Shockproof Travel Pouches for Gaming Gear",
    "Kabel LAN RJ45 ke Type-C Internet Stabil": "USB-C to Gigabit Ethernet Adapters for Zero Ping",
    "Docking Hub 6 in 1 HDMI 4K Monitor": "6-in-1 Multiport USB-C Hubs for External Displays",
    "Monitor Gaming Portabel 144Hz Type-C": "144Hz Portable Gaming Monitors via Type-C",
    "Kursi Ergonomis Bantal Punggung Gaming": "Ergonomic Gaming Chairs with Lumbar Support",
    "Lampu LED Meja Screenbar Lindungi Mata": "Monitor Screenbar LED Lamps for Eye Protection",
    "Microphone Clip On Noise Cancelling": "Clip-On Lavalier Microphones with Active Noise Cancelling",
    "Webcam Eksternal Streaming Game HP": "External High-Definition Streaming Webcams",
    "Kipas Angin Meja Mini USB Senyap": "Quiet Mini USB Desktop Desk Fans",
    "Kabel Data Braided Kuat Tahan Tarik": "Braided High-Durability USB-C Data Cables",
    "Adapter Charger GaN 100W Dingin Ringkas": "Compact 100W GaN Fast Chargers",
    "Case HP Lubang Ventilasi Grafena": "Graphene-Infused Ventilated Phone Cases",
    "Pelekat Magnetik Plat Besi Cooler": "Magnetic Heat-Conducting Metal Plates for Coolers",
    "Pelindung Kamera Belakang HP Anti Gores": "Scratch-Resistant Camera Lens Protectors",
    "Tester Sensitivitas Layar Sentuh Hz": "Touch Screen Sampling Rate & Display Tester Apps",
    "Aplikasi Monitoring Suhu CPU GPU": "Real-Time CPU & GPU Temperature Monitoring Apps",
    "Setting Developer Options 120 FPS": "Developer Options Tweaks to Unlock Smooth 120 FPS",
    "Disable Animasi Transisi Percepat HP": "Disabling Window Animation Scales for Snappy UI",
    "Hapus Cache Tersembunyi Ruang Lega": "Clearing Hidden App Caches to Reclaim Storage",
    "Optimasi RAM Virtual Swap Eksternal": "Virtual RAM & Swap File Memory Optimization",
    "Kalibrasi Baterai HP Supaya Akurat": "Android Battery Recalibration for Accurate Percentage",
    "Bypass Charging Main Sambil Cas Aman": "Bypass Charging Technology to Play While Charging Safely",
    "Mode Jangan Ganggu Game Turbo Aktif": "Game Turbo & Do-Not-Disturb Modes for Focus",
    "Setting DNS Cloudflare Internet Cepat": "Cloudflare 1.1.1.1 Private DNS for Reduced Ping",
    "Uji Latensi Bluetooth Audio Delay Test": "Measuring Audio-Video Bluetooth Latency",
    "Setting Equalizer Suara Langkah Kaki": "Equalizer Audio Presets to Emphasize Footstep Frequencies",
    "Pembersih Debu Port Speaker Type-C": "Safely Cleaning Dust from Type-C & Speaker Ports",
    "Pelindung Kabel Spiral Anti Putus": "Spiral Cable Protectors to Prevent Cord Fraying",
    "Grip Holder Tangan Ergonomis Nyaman": "Ergonomic Hand Grips to Prevent Finger Cramps",
    "Gamepad Teleskopik HP Jadi Nintendo Switch": "Telescopic Gamepad Controllers for Handheld Style",
    "Mouse & Keyboard Converter HP FPS": "Keyboard & Mouse Converters for Android FPS",
    "Kacamata Anti Radiasi Blue Light": "Blue-Light Blocking Glasses for Prolonged Screen Time",
    "Matras Meja Deskmat Lebar Halus": "Smooth Extended Gaming Deskmats & Mousepads",
    "Kabel Aux Audio Speaker Eksternal": "Shielded 3.5mm Aux Cables for External Speakers",
    "Power Strip Colokan Listrik Surge Protector": "Surge-Protected Power Strips for Gaming Rigs",
    "Holder Mobil Vent Ac GPS Dingin": "Air Vent Car Mounts for Cool GPS Navigation",
    "Pembersih Gel Slime Debu Keyboard": "Cleaning Slime Gel for Vents and Keyboards",
    "Lap Microfiber Kacamata Layar Bersih": "High-Density Microfiber Cloths for Scratch-Free Screens",
    "Ring Light Holder Konten Kreator HP": "Adjustable Ring Lights for Streaming Creators",
    "Green Screen Lipat Portabel Streaming": "Collapsible Portable Green Screens for Broadcasters",
    "Tripod HP Kokoh Ketinggian Fleksibel": "Heavy-Duty Flexible Phone Tripods & Mounts",
    "Pelindung Sudut Bumper HP Anti Jatuh": "Drop-Resistant Corner Bumper Cases",
    "Stiker Skin Belakang HP Tekstur Karbon": "Textured Carbon Fiber Protective Phone Skins",
    "Pembersih Kontak Cleaner Elektronik": "Electronic Contact Cleaners for Port Oxidation",
    "Uji Benchmark AnTuTu Geekbench 2026": "AnTuTu & Geekbench Performance Benchmark Analysis",
    "Perbandingan Layar AMOLED vs IPS Game": "AMOLED vs IPS Displays for Gaming Contrast",
    "Pengaruh Suhu Ruangan Terhadap FPS HP": "Ambient Room Temperature Impact on Sustained FPS",
    "Bahaya Bermain Game Sambil Menidih Cas": "Risks of Heavy Gaming During Standard Fast-Charging",
    "Tips Baterai Sehat 3 Tahun Tanpa Gembung": "Extending Smartphone Battery Health Across 3+ Years",
    "Koneksi WiFi 6 vs Kuota Data 5G Game": "Wi-Fi 6 vs 5G Mobile Data Latency & Stability",
    "Cara Menghindari Ghost Touch Layar Basah": "Preventing Ghost Touch from Screen Moisture",
    "Pilihan Gear Gaming Hemat Mahasiswa": "Budget-Friendly Mobile Gaming Gear Setups",
    "Review Aksesoris Gaming Resmi Amazon": "Verified Amazon Mobile Gaming Gear Buyer Guide",
    "Investasi Gear Fisik Tingkatkan Skill": "How Ergonomic Physical Gear Enhances In-Game Skill"
  },
  "kids": {
    "Batas Waktu Layar Screen Time Sehat Anak": "Healthy Daily Screen Time Limits & Sleep Routines",
    "Aplikasi Belajar Berhitung Menyenangkan": "Engaging Early Math & Arithmetic Learning Apps",
    "Aplikasi Mengenal Huruf Alfabet Interaktif": "Interactive Phonics & Alphabet Learning Apps",
    "Game Teka Teki Asah Otak Anak Usia Dini": "Cognitive Puzzle & Brain-Teaser Games for Toddlers",
    "Aplikasi Menggambar & Mewarnai Digital": "Creative Digital Drawing & Coloring Tools for Kids",
    "Fitur Google Family Link Panduan Orang Tua": "Google Family Link Parental Controls Setup Guide",
    "Kunci Layar Sematkan Aplikasi Pin Screen": "Android App Pinning to Child-Proof Screen Access",
    "Mematikan Pembelian Dalam Game In-App Purchases": "Disabling In-App Purchases & Accidental Charges",
    "Memblokir Konten Dewasa & Iklan Berbahaya": "Filtering Mature Content & Blocking Harmful Online Ads",
    "Pencarian Suara Ramah Anak YouTube Kids": "Safe Voice Search & Curated Playlists on YouTube Kids",
    "Tablet Belajar Anak Casing Tahan Banting": "Durable Drop-Proof Kids Learning Tablets & Cases",
    "Stylus Pen Ujung Lembut Ramah Jari Anak": "Soft-Tipped Ergonomic Stylus Pens for Children",
    "Pelindung Layar Mata Anti Radiasi Anak": "Blue-Light Filtering Screen Protectors for Young Eyes",
    "Headphone Batas Volume Aman 85 Desibel": "Volume-Limiting 85dB Safe Headphones for Kids",
    "Dudukan Tablet Meja Belajar Ergonomis": "Ergonomic Tablet Stands for Study Desks",
    "Metode Belajar Montessori Lewat Gadget": "Montessori-Inspired Digital Learning Methods",
    "Belajar Bahasa Inggris Kosakata Sehari-hari": "Daily Vocabulary & English Language Learning Apps",
    "Belajar Mengenal Bentuk Geometri Warna": "Color Recognition & Geometric Shape Puzzles",
    "Dongeng Interaktif Suara Sebelum Tidur": "Interactive Bedtime Audiobooks & Story Apps",
    "Lagu Anak Edukatif Melatih Pendengaran": "Auditory Development through Educational Nursery Rhymes",
    "Kreativitas Membangun Balok Virtual Aman": "Creative Virtual Block Building Games for Toddlers",
    "Eksperimen Sains Sederhana Anak di Rumah": "Interactive Science Discovery Apps for Young Learners",
    "Menjaga Kesehatan Mata Anak Saat Pakai HP": "Preventing Eye Strain & Nearsightedness from Screens",
    "Aturan Gadget Bebas Saat Makan & Tidur": "Establishing Screen-Free Mealtime & Bedtime Zones",
    "Aktivitas Fisik Penyeimbang Waktu Layar": "Balancing Digital Screen Time with Outdoor Play",
    "Deteksi Bakat Anak Lewat Minat Digital": "Identifying Early Talents through Creative Apps",
    "Melatih Kesabaran Anak Lewat Game Edukasi": "Fostering Patience & Resilience through Educational Games",
    "Mengenalkan Jam & Konsep Waktu Harian": "Teaching Daily Time Management to Young Children",
    "Belajar Menabung Celengan Digital Anak": "Interactive Apps to Teach Smart Saving Habits",
    "Etika Sopan Santun Komunikasi Digital": "Teaching Safe & Respectful Digital Communication",
    "Aplikasi Belajar Iqro & Mengaji Online": "Interactive Quranic Phonics & Recitation Learning Apps",
    "Aplikasi Musik Piano Drum Anak Ceria": "Playful Piano & Drum Musical Instrument Apps",
    "Belajar Anatomi Tubuh & Hidup Sehat": "Fun Human Anatomy & Healthy Lifestyle Learning Apps",
    "Mengenal Hewan & Suara Habitat Hutan": "Wildlife Animals & Habitat Sound Exploration Apps",
    "Mengenal Transportasi Kendaraan Kota": "City Vehicles & Public Transportation Discovery",
    "Melatih Motorik Halus Lewat Tarikan Garis": "Fine Motor Skill Tracing & Hand-Eye Coordination",
    "Mengenalkan Emosi Perasaan Pada Anak": "Emotional Intelligence & Feelings Recognition Apps",
    "Bermain Peran Dokter Koki Pemadam Kebakaran": "Roleplay Career Simulation Games for Early Learners",
    "Permainan Memori Cocokkan Gambar Kembar": "Visual Memory Matching & Pattern Recognition Games",
    "Mengenal Planet Tata Surya Bintang Luar": "Solar System & Astronomy Exploration for Kids",
    "Pendampingan Orang Tua Tanpa Emosi Marah": "Mindful Parental Co-Viewing without Stress",
    "Menghadapi Tantrum Saat Gadget Dimatikan": "Preventing Screen-Time Tantrums with Gentle Transitions",
    "Memberi Hadiah Pujian Positif Usaha Anak": "Positive Reinforcement Techniques in Early Learning",
    "Jadwal Harian Visual Anak Tertib Mandiri": "Visual Daily Routines for Fostering Independence",
    "Main Bersama Orang Tua Game Edukatif Seru": "Fun Co-Play Educational Games for Parents & Kids",
    "Aplikasi Offline Edukasi Tanpa Kuota Habis": "Best Offline Learning Apps That Require Zero Data",
    "Keamanan Data Privasi Aplikasi Anak Aman": "Auditing Data Privacy in Children's Android Apps",
    "Review Tablet Edukasi Murah Berkualitas": "Top Affordable Educational Android Tablets",
    "Tips Baterai Tablet Anak Tahan Seharian": "All-Day Tablet Battery Management for School & Play",
    "Aplikasi Belajar Membaca Suku Kata Lancar": "Fluent Syllable Reading & Early Literacy Apps"
  },
  "prod": {
    "Edit Teks Dokumen PDF Offline Tanpa Internet": "Edit PDF Document Text Offline Without Cloud Servers",
    "Tanda Tangan Digital Formulir PDF Cepat": "Sign Digital PDF Forms Quickly on Mobile Devices",
    "Isi Formulir PDF Lamaran Kerja Beasiswa": "Fill Out Job & Scholarship PDF Application Forms",
    "Gabung Banyak File PDF Jadi Satu Dokumen": "Merge Multiple PDF Files into One Document Offline",
    "Pisahkan Halaman PDF Tertentu Tanpa Ribet": "Split and Extract Specific PDF Pages Without Hassle",
    "Kompres Ukuran File PDF Tetap Terbaca Jelas": "Compress PDF File Size While Retaining Crystal-Clear Text",
    "Kunci PDF Password Lindungi Data Rahasia": "Password-Protect & Encrypt Sensitive PDF Documents",
    "Hapus Password PDF Milik Sendiri Praktis": "Remove Passwords & Permissions from Your Own PDFs",
    "Ubah Foto Kertas Scan Jadi PDF Rapi": "Convert Scanned Paper Photos into Clean PDF Documents",
    "Konversi PDF ke Gambar JPEG Transparan": "Export PDF Pages into High-Resolution PNG & JPEG Images",
    "Anotasi Catatan Garis Bawah Dokumen PDF": "Annotate, Underline, and Highlight Key PDF Sections",
    "Sorot Teks Stabilo Warna PDF Buku Pelajaran": "Color-Coded Highlighter Tools for Digital Textbooks",
    "Beri Stempel Lunas Sah Pada Faktur PDF": "Apply Official 'Paid' & 'Approved' Rubber Stamps to Invoices",
    "Beri Cap Watermark Rahasia Draft Dokumen": "Watermark Confidential Drafts on Android Without Software Fees",
    "Ubah Urutan Halaman PDF Geser Fleksibel": "Reorder & Rearrange PDF Pages with Drag-and-Drop",
    "Putar Rotasi Halaman PDF Terbalik 90 Derajat": "Rotate Upside-Down PDF Pages by 90 or 180 Degrees",
    "Hapus Halaman Kosong PDF Tanpa Aplikasi Berat": "Delete Blank or Unwanted PDF Pages Quickly",
    "Ekstrak Teks OCR Gambar Hasil Scan Buku": "OCR Text Extraction from Scanned Book Photos",
    "Stylus Pen Presisi Tulis Tangan Catatan PDF": "Handwritten Note-Taking on PDFs with Precision Stylus",
    "Pelindung Layar Tekstur Kertas Paperlike Tulis": "Paper-Feel Matte Screen Protectors for Natural Writing",
    "Simpan Dokumen KTP Ijazah Offline Bebas Sadap": "Securing Scanned IDs & Diplomas Offline Without Cloud Sync",
    "Bahaya Unggah Dokumen Rahasia ke Web Gratis": "Risks of Uploading Confidential Documents to Free Cloud Editors",
    "Kelola Bukti Nota Pembayaran Pajak PDF": "Organizing Tax Invoices & Payment Receipts in PDF",
    "Buku Catatan Rapat Digital Bebas Kertas Paperless": "Paperless Meeting Minutes & Digital Agendas",
    "Katalog Produk Portofolio PDF Bisnis Rapi": "Creating Clean Business Portfolios & Product Catalogs",
    "Buat Ebook Format PDF Sendiri di Android": "Self-Publishing Clean PDF eBooks on Android",
    "Baca File Buku PDF Mode Gelap Nyaman Mata": "Eye-Comfort Dark Mode PDF Reading for Long Study Sessions",
    "Navigasi Cepat Daftar Isi Bookmark PDF": "Adding Interactive Bookmarks & Table of Contents to PDFs",
    "Cari Kata Kunci Dokumen PDF Ratusan Halaman": "Instant Full-Text Search in 500+ Page PDF Documents",
    "Cetak Dokumen PDF Lewat Printer WiFi HP": "Wireless PDF Printing from Android to Network Printers",
    "Kirim File PDF Lewat Email Ukuran Standar": "Optimizing PDF Attachments for Standard Email File Limits",
    "Backup File PDF Penting ke Flashdisk Type-C": "Backing Up Essential Documents to USB-C Flash Drives",
    "Organisasi Folder Dokumen Kerja HP Rapi": "Organizing Clean Document Folder Hierarchies on Mobile",
    "Aplikasi Edit PDF Ringan Hemat Memori HP": "Lightweight Offline PDF Editors That Save RAM and Storage",
    "Tips Baterai HP Awet Saat Baca Dokumen Lama": "Maximizing Battery Life During Long PDF Reading Sessions",
    "Perjanjian Kontrak Kerjasama Digital Legal": "Legally Binding Electronic Signatures on Business Contracts",
    "Review Stylus Pen Murah Alternatif Apple S Pen": "Top Budget Active Stylus Pens for Android Note-Taking",
    "Keyboard Bluetooth Ringan Ngetik Dokumen HP": "Portable Bluetooth Keyboards for Document Typing on Mobile",
    "Dudukan Tablet Baca Dokumen Tanpa Pegal": "Adjustable Tablet Mounts for Ergonomic Document Review",
    "Scan Dokumen Lurus Otomatis Potong Sudut": "Automatic Perspective Crop & Document Boundary Correction",
    "Bikin Lembar Soal Ujian Kuis Format PDF": "Formatting Exam Sheets & Quiz Papers in Clean PDF",
    "Koreksi Skripsi Tesis Guru Dosen Coretan Digital": "Grading & Marking Thesis Drafts with Digital Red Pen Tools",
    "Bagan Alur Flowchart Sisipkan Dalam PDF": "Inserting High-Resolution Flowcharts & Diagrams into PDFs",
    "Kop Surat Resmi Logo Lembaga Stempel PDF": "Adding Official Letterheads, Seals, and Signatures to Letters",
    "Format PDF/A Arsip Jangka Panjang Standar": "Standard PDF/A Formats for Long-Term Archival Compliance",
    "Tips Produktivitas Kerja Paperless 2026": "Top Paperless Productivity Hacks for Mobile Professionals",
    "Keamanan Dokumen Tanpa Jejak Pelacak Online": "Zero-Tracker Local PDF Tools for Total Confidentiality",
    "Workflow Tanda Tangan Kontrak Cepat 2 Menit": "2-Minute Contract Signing Workflow on Mobile",
    "Aplikasi Zero Network Perlindungan Privasi Penuh": "Zero-Network Permission Apps for Ironclad Data Protection",
    "Solusi Dokumen Mobile Profesional Tanpa Laptop": "Laptop-Free Mobile Document Workflows for Remote Professionals"
  }
};


function safeTruncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  const cut = str.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > 10 ? cut.slice(0, lastSpace) : cut;
}

// TOPIC TEMPLATES FOR 83 DAYS
function getTopicForDay(slotIndex, day) {
  const dayNum = day + 1;
  switch (slotIndex) {
    case 0: { // MLBB Heroes
      const heroes = [
        "Ling", "Fanny", "Hayabusa", "Lancelot", "Gusion", "Nolan", "Beatrix", "Wanwan", "Claude", "Brody",
        "Moskov", "Karrie", "Tigreal", "Khufra", "Minotaur", "Franco", "Chou", "Yu Zhong", "Paquito", "Terizla",
        "Cici", "Lunox", "Kagura", "Novaria", "Zhuxin", "Mathilda", "Diggie", "Fredrinn", "Baxia", "Akai",
        "Arlott", "Lapu-Lapu", "Joy", "Benedetta", "Natalia", "Helcurt", "Saber", "Karina", "Harley", "Cyclops",
        "Vale", "Pharsa", "Yve", "Xavier", "Cecilion", "Lylia", "Kadita", "Lesley", "Clint", "Granger",
        "Bruno", "Irithel", "Popol & Kupa", "Melissa", "Natan", "Miya", "Layla", "Hanabi", "Edith", "Gatotkaca",
        "Grock", "Atlas", "Belerick", "Hylos", "Lolita", "Johnson", "Ruby", "Alpha", "Martis", "Thamuz",
        "Dyrroth", "Silvanna", "Guinevere", "Badang", "Leomord", "Aldous", "Jawhead", "Roger", "Sun", "Argus",
        "Alucard", "Zilong", "Hilda"
      ];
      const h = heroes[day % heroes.length];
      const title = `Build ${h} Tersakit & Rotasi Meta Solo Rank 2026 (Hari ke-${dayNum})`;
      const enTitle = `Mobile Legends: Best ${h} Build & Solo Rank Meta Rotation 2026 (Day #${dayNum})`;
      const slugEn = createSlugEn(`mlbb-best-${h}-build-solo-rank-rotation-2026-day-${dayNum}`);
      const enMetaTitle = `Best ${h} Build 2026: Solo Rank Meta Guide | D Lucky X`;
      const enMetaDesc = `Comprehensive 2026 ${h} build guide in Mobile Legends: Bang Bang. Discover core burst item synergy, custom emblem configurations, execution combos, and solo rank rotation tips.`;
      const englishSummary = `A comprehensive tactical masterclass detailing the definitive 2026 ${h} build in Mobile Legends: Bang Bang. Master pro itemization curves, emblem setups, decisive mechanical combos, and solo queue rotations to reach Mythical Glory.`;
      return { title, enTitle, enTopic: h, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 1: { // Free Fire
      const devices = [
        "Semua HP Android", "Oppo Reno & A Series", "Vivo Y & V Series", "Samsung Galaxy A Series", "Xiaomi Redmi & Poco",
        "Infinix Hot & Note", "Realme Number & C Series", "Tecno Pova & Camon", "Asus ROG Phone", "iQOO Neo & Z Series",
        "M1887 Shotgun", "MP40 SMG", "Woodpecker & SVD", "Groza & Scar", "AK47 & M4A1",
        "Custom HUD 2 Jari", "Custom HUD 3 Jari", "Custom HUD 4 Jari", "Fast Gloo Wall", "Kombinasi Skill Alok",
        "Karakter Tatsuya", "Karakter Dimitri", "Karakter Chrono", "Karakter Homer", "Karakter Santino",
        "Setting DPI Aman", "Clash Squad Ranked", "Solo vs Squad", "Rotasi Map Bermuda", "Grafis Halus 60 FPS",
        "Pola Lari Anti Sniper", "Taktik Zona Akhir", "Senjata AR Meta", "Teknik Drag Shot", "Guild War Formasi",
        "Mental Juara Booyah", "Jump Shot Shotgun", "Scope 4x Akurat", "Deteksi Musuh Pet", "Attachment Silencer",
        "Pendaratan Clock Tower", "Jalur Aman Purgatory", "Bertahan di NexTerra", "Kombo Kelly & Hayato", "Trik Tembak Kepala",
        "Uji Kepekaan Touch", "Sensitivitas Layar Licin", "Aim Merah Jarak Dekat", "Kontrol Recoil SMG", "Senjata UMP & MP5",
        "Granat Flashbang", "Medkit Healing Zona", "Revive Point Taktik", "Airdrop Looting Cepat", "Senjata Charge Buster",
        "Trik Panjat Atap", "Sniper AWM Tembus Vest", "Baju Pelindung Level 4", "Helm Anti Headshot", "Peta Radar Mini",
        "Suara Langkah Musuh", "Setting Tombol Tembak Kiri", "Ukuran Tombol Analog", "Transparansi Tombol HUD", "Trik Peek Semak",
        "Taktik Rusher Duo", "Support Medis Squad", "Sniper Penjaga Belakang", "Kendaraan Monster Truck", "Zip Line Manuver",
        "Peluncur Launch Pad", "Pintu Rumah Pertahanan", "Jendela Tembak Mundur", "Granat Asap Penyelamat", "Lampu Sinyal UAV",
        "Mesin Penjual Koin", "Chip Senjata Level 3", "Vending Machine Trik", "Armor Plate Pengganti", "Darah Putih EP",
        "Inhaler Stamina Cepat", "Jamur Jamur Level 4", "Kemenangan Booyah Konsisten"
      ];
      const d = devices[day % devices.length];
      const enTopic = TOPIC_TRANSLATIONS.devices[d] || d;
      const title = `Setting Sensitivitas FF Auto Headshot 2026: Trik ${d} (Update ke-${dayNum})`;
      const enTitle = `Free Fire Auto Headshot Sensitivity 2026: ${enTopic} (Update #${dayNum})`;
      const slugEn = createSlugEn(`freefire-auto-headshot-sensitivity-2026-${enTopic}-update-${dayNum}`);
      const enMetaTitle = `FF Sensitivity 2026: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Comprehensive 2026 Free Fire sensitivity guide covering ${enTopic}. Master DPI calibration, drag shot headshot mechanics, and pro HUD layout.`;
      const englishSummary = `A comprehensive tactical masterclass detailing Free Fire Auto Headshot Sensitivity 2026 for ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 2: { // Roblox
      const robloxTitles = [
        "Kode Redeem Blox Fruits Terbaru", "Tier List Devil Fruit Blox Fruits", "Rute Menuju Sea 2 & Sea 3", "Panduan Awakening Devil Fruit", "Cara Dapatkan Cursed Dual Katana",
        "Tips Farming Fragment Cepat", "Pet Simulator 99 Huge Pet", "Adopt Me Panduan Trading Aman", "Dress to Impress Layering Juara", "Blade Ball Timing Parry Sempurna",
        "Tier List Skill Blade Ball", "The Strongest Battlegrounds Combo", "Anime Defenders Formasi Unit", "All Star Tower Defense Unit Bintang 6", "Fisch Lokasi Ikan Mitos",
        "Doors Trik Lolos Hadapi Rush", "7 Game Horor Roblox Mabar", "Brookhaven Lokasi Brankas Rahasia", "Simulasi Pekerjaan Santai Terbaik", "Obby Hardcore Wall Hop Trik",
        "Tower of Hell Bebas Jatuh", "BedWars Rusher Kasur Kilat", "Arsenal Crosshair & Sensitivity", "Roblox Studio Panduan Pemula", "Item dan Baju Avatar Gratis",
        "Cara Dapatkan Robux Legal", "Spatial Voice Chat Syarat", "Lindungi Akun dari Hacker PIN", "Atasi Lag Roblox di HP Kentang", "Komunitas Mabar Seru Indonesia",
        "Rivals FPS Mobile Trik", "Pressure Game Horor Bawah Laut", "Slap Battles Sarung Sakti", "Murder Mystery 2 Sheriff Aim", "Da Hood Survival & Cash",
        "Total Roblox Drama Trik", "Evade Lari Cepat Respawn", "Bee Swarm Simulator Honey", "Royale High Farming Diamond", "Shindo Life Bloodline Tier",
        "Grand Piece Online Leveling", "YBA Stand Tier List", "Project Slayers Breathing", "Deepwoken Survival Tips", "Type Soul Shikai Guide",
        "A Universal Time Farming", "Pet Sim Diamond Enchant", "Fisch Joran Pancing Kraken", "Blox Fruits Race V4 Trial", "Blox Fruits Soul Guitar Quest",
        "Blox Fruits Godhuman Fighting", "Doors Floor 2 The Mines", "DTI VIP Outfit Styling", "Blade Ball Infinity Ability", "BedWars Kit Tier List",
        "Anime Vanguards Meta Units", "Anime Last Stand Guide", "Toilet Tower Defense Mythic", "Lumber Tycoon 2 Wood Farming", "Theme Park Tycoon 2 Rollercoaster",
        "Restaurant Tycoon 2 Star Rating", "Work at a Pizza Place Delivery", "Vehicle Legends Money Farm", "Car Driving Indonesia Roleplay", "Emergency Hamburg Police RP",
        "Natural Disaster Survival Tips", "Flee the Facility Beast Escape", "Survive the Killer Perks", "Piggy Escape Chapter Guide", "Rainbow Friends Monster Evade",
        "Banana Eats Puzzle Solver", "Color Hide and Seek Hiding", "SharkBite 2 Boat Driving", "Build a Boat for Treasure Gold", "Babft Auto Farm Mechanics",
        "Speed Run 4 Fast Route", "Super Hero Tycoon Upgrade", "Mega Mansion Tycoon Fast Cash", "Driving Empire Supercar Tuning", "Weight Lifting Simulator Brawn",
        "Muscle Legends Fast Rebirth", "Ninja Legends Chi Farm", "Roblox Performance Booster 2026"
      ];
      const r = robloxTitles[day % robloxTitles.length];
      const enTopic = TOPIC_TRANSLATIONS.roblox[r] || r;
      const title = `Panduan Lengkap ${r}: Trik Rahasia Update 2026 (Seri #${dayNum})`;
      const enTitle = `Roblox Complete Guide: ${enTopic} (2026 Series #${dayNum})`;
      const slugEn = createSlugEn(`roblox-guide-${enTopic}-2026-series-${dayNum}`);
      const enMetaTitle = `Roblox Guide: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Comprehensive 2026 Roblox guide on ${enTopic}. Master fast progression routes, secret gameplay mechanics, and pro optimization setups.`;
      const englishSummary = `A comprehensive tactical masterclass detailing Roblox Complete Guide: ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 3: { // Minecraft
      const mcTopics = [
        "Seed Desa Berdampingan Mansion", "Seed Survival Island Ekstrem", "Farm Iron Golem Otomatis", "Farm Mob XP 5 Menit Level 30", "Ancient Debris Netherite Tempat Tidur",
        "Kalahkan Ender Dragon Panah & Air", "End City Elytra & Shulker Box", "Desain Rumah Kayu Estetik Pemula", "Dekorasi Interior Modern Kamar", "Shaders Minecraft PE Ringan 60 FPS",
        "7 Addon Bedrock Terbaik", "Pintu Rahasia 2x2 Redstone Piston", "Brewing Stand Resep Semua Ramuan", "Jinakkan Hewan Peliharaan Serigala", "Villager Trading Hall Mending 1 Zamrud",
        "Pillager Raid Totem of Undying", "Ancient City Warden Sensor Wool", "Kapal Karam Peti Harta Karun", "Bangun Kastil Batu Megah Benteng", "Farm Gandum & Wortel Villager",
        "Kombinasi Enchantment Senjata Armor", "Peta Kartografi & Navigasi Kompas", "Jinakkan Kuda & Unta Gurun", "Farm Tebu & Bambu Observer", "Woodland Mansion Kalahkan Evoker",
        "Bertahan di Bioma Salju Powder", "Trik Mancing Buku Mitos Sakti", "Lift Air Soul Sand Gelembung", "Setting Grafis HP Kentang 120 FPS", "Mabar Realms Server Gratis HP PC",
        "Farm Emas Nether Piglin Otomatis", "Farm Raid Emerald Tanpa Batas", "Farm Slime Chunk Bawah Tanah", "Farm Enderman Void Cepat XP", "Farm Kayu Otomatis TNT Blast",
        "Trial Chambers Kalahkan Breeze", "Senjata Mace Kombo Wind Charge", "Armadillo Scute Armor Serigala", "Auto Crafter Redstone Fabrikasi", "Copper Bulb Delay Mekanisme",
        "Desain Jembatan Gantung Estetik", "Ide Mercusuar Tepi Pantai", "Desain Kincir Angin Pertanian", "Rumah Bawah Tanah Rahasia", "Bunker Anti Creeper Kaca",
        "Kolam Ikan Hias Akuarium Kaca", "Taman Bunga Lebah Honey Farm", "Farm Katak Froglight Rawa", "Axolotl Kolam Bioma Lush Cave", "Glow Berry Tanaman Hias Cahaya",
        "Amethyst Geode Kristal Suara", "Deepslate Tambang Berlian Y-58", "Gua Karst Dripstone Lava Tanpa Batas", "Sculk Catalyst XP Generator", "Allay Otomatis Sortir Barang",
        "Piston Door 3x3 Kompak Redstone", "Item Sorter Gudang Otomatis", "Furnace Smelter Super Cepat", "Brewing Otomatis Potion Generator", "Lonceng Alarm Desa Sensor Cahaya",
        "Buku Catatan Lectern Rahasia", "Armor Stand Pose Kustom Show", "Banner Bendera Desain Keren", "Pot Bunga Sniffer Biji Kuno", "Sniffer Farm Tanaman Purba",
        "Armor Trim Pola Keren Baju", "Netherite Upgrade Template Duplikasi", "Pottery Sherd Arkeologi Pasir", "Kuas Arkeologi Kuil Gurun", "Sponge Keringkan Monumen Laut",
        "Kalahkan Elder Guardian Prismarine", "Conduit Jantung Laut Nafas Air", "Beacon Cahaya Kecepatan Haste 2", "Wither Boss Trik Bawah Bedrock", "Wither Skeleton Tengkorak Hitam",
        "Nether Fortress Blaze Rod Farm", "Piglin Bartering Emas Mutiara", "Ghast Tear Ramuan Regenerasi", "Magma Cream Tahan Api Ramuan", "Phantom Membrane Membran Elytra",
        "Turtle Helmet Nafas Air Tambahan", "Trident Riptide Terbang Hujan", "Minecraft Mastery Guide 2026"
      ];
      const m = mcTopics[day % mcTopics.length];
      const enTopic = TOPIC_TRANSLATIONS.minecraft[m] || m;
      const title = `Panduan Lengkap Minecraft: Trik ${m} (Update 2026 Seri #${dayNum})`;
      const enTitle = `Minecraft Master Guide: ${enTopic} (2026 Update Series #${dayNum})`;
      const slugEn = createSlugEn(`minecraft-guide-${enTopic}-2026-series-${dayNum}`);
      const enMetaTitle = `Minecraft Guide: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Complete 2026 Minecraft survival guide on ${enTopic}. Master automated mechanics, technical builds, and essential survival tips.`;
      const englishSummary = `A comprehensive tactical masterclass detailing Minecraft Master Guide: ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 4: { // Genshin & Honkai
      const genshinTopics = [
        "Spiral Abyss Lantai 12 Komposisi Tim", "Artefak Farming Efisien Domain", "Build Hyperbloom Kuki Shinobu Alhaitham", "Build Neuvillette Solo Carry", "Build Furina Buff Fanfare",
        "Build Arlecchino Bond of Life", "Build Raiden Shogun National Team", "Build Nahida Dendro Applicator", "Build Kazuha Swirl Double VV", "Build Zhongli Shield Kebal Bintang 5",
        "Build Hu Tao Vaporize Yelan", "Build Navia Geo Crystallize Nuke", "Build Clorinde Electro Pistol Dash", "Build Emilie Dendro Burning", "Build Kinich Saurian Grapple",
        "Build Mualani Shark Surf Vaporize", "Build Xilonen Geo Resonansi Shred", "Build Chasca Anemo Flying Gun", "Build Mavuika Pyro Archon Teori", "Build Capitano Fatui Harbinger",
        "Honkai Star Rail Memory of Chaos 12", "Build Firefly Super Break Ruan Mei", "Build Acheron Nihility Nuke", "Build Feixiao Hunt Follow-Up", "Build Robin Harmony Chorus",
        "Build Aventurine Preservation Shield", "Build Sparkle Quantum Action Advance", "Build Ruan Mei Break Speed Buffer", "Build Dan Heng IL Propagation", "Build Jingliu Destruction Transmigration",
        "Speed Tuning 134 Breakpoint HSR", "Energy Recharge Threshold Genshin", "Elemental Gauge Theory ICD Trik", "Farm Primogem Gratis Natlan Map", "Farm Stellar Jade Penacony Chest",
        "Simulated Universe Gold and Gears", "Divergent Universe Path Resonance", "Echo of War Boss Farming Material", "Reroll Substat Artefak Roll 4 Crit", "Crit Ratio 1:2 Golden Rule",
        "Ascension Material Boss Route", "Local Specialty 168 Karakter Cepat", "Senjata Bintang 4 F2P Alternatif", "Light Cone Bintang 4 Herta Store", "Daily Resin Management Efisien",
        "Trailblaze Power Cap Farm Relic", "Lore Teyvat Rahasia Khaenriah", "Lore Penacony Stellaron Hunter", "Co-op Domain Tips Mabar Cepat", "Event Limited Waktu Reward",
        "Fishing The Catch Tombak Gratis", "Reputation Reward Glider Natlan", "Teapot Dekorasi Load Limit", "Paimon Bargain Fate Bulanan", "Starlight Exchange Senjata Blackcliff",
        "Banner Pity 50:50 Strategi Simpan", "Weapon Banner Fate Point Trik", "Battle Pass Senjata Rekomendasi", "Suikoden Saurian Natlan Mekanik", "Phlogiston Bar Natlan Movement",
        "Nightsoul Transmission Trik Ganti", "Pure Fiction Erudition Team", "Apocalyptic Shadow Boss Trik", "Planar Ornaments World 9 Farm", "Relic Synthesis Self-Modeling Resin",
        "Genshin Cooking Stat Buff Boss", "Condensed Resin Crafting Hemat", "Parametric Transformer Loot", "Treasure Compass Natlan 100%", "Oculi Natlan Pyroculus Lokasi",
        "Shrine of Depths Kunci Natlan", "Spiral Abyss Buff Lunar Phase", "Floor 11 Monolith Defense Trik", "Teyvat Fishing Weapon Polearm", "Natlan Tribe Reputation Max",
        "HSR Fate Collaboration Update", "Genshin Anime Ufotable Update", "Mobile Graphics 60 FPS Suhu Dingin", "Controller Bluetooth Support Android", "Cross Save PC Mobile Cloud",
        "Genshin Endgame Mode Teori 2026", "HSR Powercreep Management", "Bilingual Voice Cast Pilihan Seru"
      ];
      const g = genshinTopics[day % genshinTopics.length];
      const enTopic = TOPIC_TRANSLATIONS.genshin[g] || g;
      const title = `Panduan Meta Genshin & Honkai: Trik ${g} (Edisi 2026 #${dayNum})`;
      const enTitle = `Genshin & Honkai Meta Guide: ${enTopic} (2026 Edition #${dayNum})`;
      const slugEn = createSlugEn(`genshin-honkai-meta-${enTopic}-2026-edition-${dayNum}`);
      const enMetaTitle = `Genshin Meta: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Comprehensive 2026 meta breakdown for Genshin Impact & Honkai Star Rail on ${enTopic}. Master optimal team compositions, rotations, and builds.`;
      const englishSummary = `A comprehensive tactical masterclass detailing Genshin & Honkai Meta Guide: ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 5: { // EA FC & eFootball
      const footballTopics = [
        "Formasi 4-3-3 False Nine Juara", "Formasi 4-2-2-2 Counter Attack Cepat", "Formasi 4-1-2-1-2 Narrow Tiki-Taka", "Formasi 3-5-2 Wing Play Silang", "Formasi 4-2-3-1 Penguasaan Bola",
        "Trik Driven Ground Pass Menembus Bek", "Finesse Shot Melengkung Luar Kotak", "Power Shot Timing Hijau Presisi", "Skill Move Heel to Heel Flick", "Skill Move Lane Change Roll",
        "Skill Move Roulette Berputar Cepat", "Skill Move Rainbow Flick Chip", "Jockey Defense Tahan Tombol L2", "Second Man Press Jebakan Offside", "Kiper Manual Tutup Sudut Sempit",
        "Umpan Terobosan Lambung L1 Segitiga", "Crossing Umpan Silang Tiang Jauh", "Sundulan Kepala Heading Power", "Tendangan Bebas Free Kick Curve", "Penalti Panenka Tipu Kiper",
        "Tendangan Sudut Corner Kick Glitch", "Manajemen Stamina Babak Kedua", "Super Sub Penyerang Sayap Cepat", "Setting Kamera Tele Broadcast Lebar", "Setting Tombol Virtual Stick Halus",
        "eFootball Formasi Quick Counter", "eFootball Trik Possession Game", "eFootball Match-up Defense Intersep", "eFootball Stunner Cross Umpan Maut", "eFootball Stunning Shot Jarum Jam",
        "Farming Koin eFootball Gratis", "Farming FC Points & Gems Efisien", "Event Division Rivals Rank 1", "Weekend League Juara 20 Win", "Pasar Transfer Trading Pemain",
        "Investasi Kartu Rating Tinggi", "Evolution Player Kartu Favorit", "Chemistry Squad 33 Penuh", "Kiper Terbaik Refleks Kucing", "Bek Tengah CB Cepat Anti Terobos",
        "Gelandang Bertahan CDM Badak", "Playmaker CAM Umpan Ajaib", "Sayap Kilat Pace 95+ Lari", "Striker Monster Finishing 90+", "Atasi Delay Koneksi Ping Hijau",
        "Main Pakai Stik Bluetooth HP", "Trik Hindari Scripting Comeback", "Mental Tenang Adu Penalti Final", "Analisis Taktik Pep vs Ancelotti", "Turnamen Esports Mobile Indo 2026",
        "Formasi 5-2-3 Anti Kebobolan", "Formasi 4-4-2 Klasik Solid", "Trik Dribble R1 Sprint Halus", "Fake Shot Stop Hentikan Bola", "Driven Lobbed Through Ball",
        "Trik Pagar Hidup Melompat", "Kiper Maju Keluar Kotak", "Build Squad Budget 1 Juta Koin", "Pemain Muda Wonderkid Murah", "Master League Mode Offline",
        "Manager Mode Taktik Otomatis", "Pelatih Taktik Out Wide eFootball", "Pelatih Long Ball Counter", "Progression Points Reset Trik", "Player Skills Tambahan Konami",
        "Skill Double Touch eFootball", "Skill Marseille Turn Cepat", "Skill One-Touch Pass Wajib", "Skill Interception Bek Terbaik", "Skill Blocker Blokir Tembakan",
        "Server Maintenance Waktu Rutin", "Pemberian Booster eFootball 2026", "Update Transfer Musim Dingin", "Kartu Icon Legenda Sepak Bola", "Event Co-op Mabar 3v3 Teman",
        "Koneksi LAN Kabel via Type-C", "Layar 120Hz Respons Sentuhan Stik", "Turnamen Komunitas Cafe Mabar"
      ];
      const f = footballTopics[day % footballTopics.length];
      const enTopic = TOPIC_TRANSLATIONS.football[f] || f;
      const title = `Taktik Juara EA FC & eFootball: Trik ${f} (Update 2026 #${dayNum})`;
      const enTitle = `EA FC & eFootball Champion Tactics: ${enTopic} (2026 Update #${dayNum})`;
      const slugEn = createSlugEn(`eafc-efootball-tactics-${enTopic}-2026-update-${dayNum}`);
      const enMetaTitle = `FC Football Tactics: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Tactical 2026 gameplay guide for EA FC & eFootball covering ${enTopic}. Master top formations, skill moves, defensive discipline, and substitutions.`;
      const englishSummary = `A comprehensive tactical masterclass detailing EA FC & eFootball Champion Tactics: ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 6: { // Battle Royale & Action
      const brTopics = [
        "Setting Gyroscope Full 400% PUBGM", "Sensitivitas ADS No Recoil M416", "Setting Sensitivitas CODM Battle Royale", "Sensitivitas Free Look & Red Dot", "Setting Scope 3x Semprotan Laser",
        "Setting Scope 4x DMR Mini 14", "Setting Scope 6x Ubah ke 3x M416", "Setting AWM One Shot Satu Peluru", "Trik Close Combat Jiggle Gerak Cepat", "Trik Crouch Shoot Tembak Jongkok",
        "Trik Prone Shoot Tiarap Dadakan", "Trik Jump Shot Lompat Tembak", "Trik Peek Kiri Kanan Cepat Semak", "Rotasi Zona Biru Pinggir Peta", "Rotasi Kendaraan Kompon Aman",
        "Pendaratan Cepat Hot Drop Pochinki", "Looting Efisien 2 Menit Siap Tempur", "Attachment Kompensator vs Suppressor", "Attachment Vertical Grip vs Angled", "Extended Mag Quickdraw Wajib",
        "Manajemen Granat Asap Smoke Wall", "Granat Ledak Frag Waktu 3 Detik", "Molotov Koktail Bakar Kompon", "Flashbang Butakan Musuh Ruangan", "Revive Rekan Tim di Asap Tebal",
        "Komunikasi Suara Mikrofon Squad", "Formasi Rusher Flanker Support", "Sniper Pengintai Informasi Bukit", "Kendaraan Dacia vs UAZ Lindungi", "Buggy Bermanuver Cepat Tebing",
        "Air Drop Kotak Merah Senjata Groza", "Senjata AWM vs AMR Anti Kendaraan", "Senjata MG3 LMG Tembak Cepat", "Senjata DBS Shotgun Raja Rumah", "Senjata UMP45 Laser Jarak Dekat",
        "Audio Jejak Kaki Headset Presisi", "Grafis Smooth Extreme 90 FPS", "Atasi Frame Drop Pertempuran Akhir", "Posisi Duduk Ergonomis Mabar 4 Jam", "Kain Pembersih Layar Sentuh Licin",
        "Map Erangel Rute Jembatan Militer", "Map Miramar Tebing Sniper AWM", "Map Sanhok Semak Kamuflase Rumput", "Map Vikendi Salju Jejak Kaki", "Map Livik Pertempuran Kilat 15 Menit",
        "Event Kolaborasi Mode Khusus PUBGM", "CODM Custom Gunsmith Meta 2026", "CODM Operator Class Medic Ninja", "CODM Sniper Kar98k Quick Scope", "CODM Shotgun KRM Sliding Jump",
        "Turnamen PMGC & PMGO Indonesia", "Mental Baja Clutch 1 Lawan 4", "Review Killcam Evaluasi Mati", "Warm Up TDM Latihan Aim 15 Menit", "Cheater Report Sistem Tencent",
        "Keamanan Akun Verifikasi 2 Langkah", "Top Up UC Legal Promo Resmi", "Skin Senjata Upgrade Efek Kill", "Title Gelaran Keren Profil Akun", "Tier Conqueror Target Awal Musim",
        "Point Rank Minus Pencegahan Trik", "Mabar Duo Serasi Komunikasi", "Setting Sensitivitas iPad vs HP", "Sensitivitas Layar Sentuh Lengket", "Pencegahan Panas HP Baterai Awet",
        "Suara Peluru Silencer Jarak Jauh", "Recoil Beryl M762 Peluru 7.62", "Recoil AKM Jarak Dekat Mematikan", "DMR SLR vs SKS Pilihan Pro", "Pistol Scorpion Darurat Awal Turun",
        "Trik Panjat Tebing Parkour Gedung", "Pintu Rumah Jebakan Ledakan", "Atap Rumah Posisi Tembak Rahasia", "Kolong Jembatan Sembunyi Zona", "Taktik Chicken Dinner Konsisten"
      ];
      const b = brTopics[day % brTopics.length];
      const enTopic = TOPIC_TRANSLATIONS.br[b] || b;
      const title = `Setting Sensitivitas & Trik Juara Battle Royale: ${b} (Panduan 2026 #${dayNum})`;
      const enTitle = `Battle Royale Sensitivity & Pro Tactics: ${enTopic} (2026 Guide #${dayNum})`;
      const slugEn = createSlugEn(`battleroyale-tactics-${enTopic}-2026-guide-${dayNum}`);
      const enMetaTitle = `Battle Royale Pro: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Pro 2026 Battle Royale tactics guide covering ${enTopic}. Master recoil control, gyroscope sensitivities, rotation pathing, and clutch survival.`;
      const englishSummary = `A comprehensive tactical masterclass detailing Battle Royale Sensitivity & Pro Tactics: ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 7: { // Gaming Gear & Hardware
      const gearTopics = [
        "Pendingin HP Peltier Magnetik vs Kipas", "Sarung Jari Serat Perak 0.3mm Licin", "Gamepad Controller Bluetooth Android", "TWS Gaming Latensi Rendah 40ms", "Kabel Charger Siku 90 Derajat L-Shape",
        "Kabel Converter Type-C Audio Charger", "Screen Protector Tempered Glass Matte", "Pelindung Layar Anti Sidik Jari Keringat", "Power Bank Fast Charging 65W Ringan", "Dudukan HP Stand Meja Ergonomis Holder",
        "Headset Gaming Jack 3.5mm Surround 7.1", "Stylus Pen Presisi Palm Rejection", "Cooler RGB HP Dual Fan Super Dingin", "Trigger L1 R1 Tombol Fisik Layar", "Thumb Grip Analog Karet Anti Slip",
        "Pembersih Semprotan Layar Antibakteri", "Tas Pouch Simpan Aksesoris Gaming", "Kabel LAN RJ45 ke Type-C Internet Stabil", "Docking Hub 6 in 1 HDMI 4K Monitor", "Monitor Gaming Portabel 144Hz Type-C",
        "Kursi Ergonomis Bantal Punggung Gaming", "Lampu LED Meja Screenbar Lindungi Mata", "Microphone Clip On Noise Cancelling", "Webcam Eksternal Streaming Game HP", "Kipas Angin Meja Mini USB Senyap",
        "Kabel Data Braided Kuat Tahan Tarik", "Adapter Charger GaN 100W Dingin Ringkas", "Case HP Lubang Ventilasi Grafena", "Pelekat Magnetik Plat Besi Cooler", "Pelindung Kamera Belakang HP Anti Gores",
        "Tester Sensitivitas Layar Sentuh Hz", "Aplikasi Monitoring Suhu CPU GPU", "Setting Developer Options 120 FPS", "Disable Animasi Transisi Percepat HP", "Hapus Cache Tersembunyi Ruang Lega",
        "Optimasi RAM Virtual Swap Eksternal", "Kalibrasi Baterai HP Supaya Akurat", "Bypass Charging Main Sambil Cas Aman", "Mode Jangan Ganggu Game Turbo Aktif", "Setting DNS Cloudflare Internet Cepat",
        "Uji Latensi Bluetooth Audio Delay Test", "Setting Equalizer Suara Langkah Kaki", "Pembersih Debu Port Speaker Type-C", "Pelindung Kabel Spiral Anti Putus", "Grip Holder Tangan Ergonomis Nyaman",
        "Gamepad Teleskopik HP Jadi Nintendo Switch", "Mouse & Keyboard Converter HP FPS", "Kacamata Anti Radiasi Blue Light", "Matras Meja Deskmat Lebar Halus", "Kabel Aux Audio Speaker Eksternal",
        "Power Strip Colokan Listrik Surge Protector", "Holder Mobil Vent Ac GPS Dingin", "Pembersih Gel Slime Debu Keyboard", "Lap Microfiber Kacamata Layar Bersih", "Ring Light Holder Konten Kreator HP",
        "Green Screen Lipat Portabel Streaming", "Tripod HP Kokoh Ketinggian Fleksibel", "Pelindung Sudut Bumper HP Anti Jatuh", "Stiker Skin Belakang HP Tekstur Karbon", "Pembersih Kontak Cleaner Elektronik",
        "Uji Benchmark AnTuTu Geekbench 2026", "Perbandingan Layar AMOLED vs IPS Game", "Pengaruh Suhu Ruangan Terhadap FPS HP", "Bahaya Bermain Game Sambil Menidih Cas", "Tips Baterai Sehat 3 Tahun Tanpa Gembung",
        "Koneksi WiFi 6 vs Kuota Data 5G Game", "Cara Menghindari Ghost Touch Layar Basah", "Pilihan Gear Gaming Hemat Mahasiswa", "Review Aksesoris Gaming Resmi Amazon", "Investasi Gear Fisik Tingkatkan Skill"
      ];
      const gr = gearTopics[day % gearTopics.length];
      const enTopic = TOPIC_TRANSLATIONS.gear[gr] || gr;
      const title = `Panduan Hardware & Optimasi HP Android: ${gr} (Ulasan 2026 #${dayNum})`;
      const enTitle = `Android Hardware & Gaming Gear Guide: ${enTopic} (2026 Review #${dayNum})`;
      const slugEn = createSlugEn(`gaming-gear-hardware-${enTopic}-2026-review-${dayNum}`);
      const enMetaTitle = `Gaming Gear: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Comprehensive mobile gaming hardware review covering ${enTopic}. Prevent thermal throttling, lower touch latency, and optimize system FPS in 2026.`;
      const englishSummary = `A comprehensive tactical masterclass detailing Android Hardware & Gaming Gear Guide: ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 8: { // Kids Tech & Learning
      const kidsTopics = [
        "Batas Waktu Layar Screen Time Sehat Anak", "Aplikasi Belajar Berhitung Menyenangkan", "Aplikasi Mengenal Huruf Alfabet Interaktif", "Game Teka Teki Asah Otak Anak Usia Dini", "Aplikasi Menggambar & Mewarnai Digital",
        "Fitur Google Family Link Panduan Orang Tua", "Kunci Layar Sematkan Aplikasi Pin Screen", "Mematikan Pembelian Dalam Game In-App Purchases", "Memblokir Konten Dewasa & Iklan Berbahaya", "Pencarian Suara Ramah Anak YouTube Kids",
        "Tablet Belajar Anak Casing Tahan Banting", "Stylus Pen Ujung Lembut Ramah Jari Anak", "Pelindung Layar Mata Anti Radiasi Anak", "Headphone Batas Volume Aman 85 Desibel", "Dudukan Tablet Meja Belajar Ergonomis",
        "Metode Belajar Montessori Lewat Gadget", "Belajar Bahasa Inggris Kosakata Sehari-hari", "Belajar Mengenal Bentuk Geometri Warna", "Dongeng Interaktif Suara Sebelum Tidur", "Lagu Anak Edukatif Melatih Pendengaran",
        "Kreativitas Membangun Balok Virtual Aman", "Eksperimen Sains Sederhana Anak di Rumah", "Menjaga Kesehatan Mata Anak Saat Pakai HP", "Aturan Gadget Bebas Saat Makan & Tidur", "Aktivitas Fisik Penyeimbang Waktu Layar",
        "Deteksi Bakat Anak Lewat Minat Digital", "Melatih Kesabaran Anak Lewat Game Edukasi", "Mengenalkan Jam & Konsep Waktu Harian", "Belajar Menabung Celengan Digital Anak", "Etika Sopan Santun Komunikasi Digital",
        "Aplikasi Belajar Iqro & Mengaji Online", "Aplikasi Musik Piano Drum Anak Ceria", "Belajar Anatomi Tubuh & Hidup Sehat", "Mengenal Hewan & Suara Habitat Hutan", "Mengenal Transportasi Kendaraan Kota",
        "Melatih Motorik Halus Lewat Tarikan Garis", "Mengenalkan Emosi Perasaan Pada Anak", "Bermain Peran Dokter Koki Pemadam Kebakaran", "Permainan Memori Cocokkan Gambar Kembar", "Mengenal Planet Tata Surya Bintang Luar",
        "Pendampingan Orang Tua Tanpa Emosi Marah", "Menghadapi Tantrum Saat Gadget Dimatikan", "Memberi Hadiah Pujian Positif Usaha Anak", "Jadwal Harian Visual Anak Tertib Mandiri", "Main Bersama Orang Tua Game Edukatif Seru",
        "Aplikasi Offline Edukasi Tanpa Kuota Habis", "Keamanan Data Privasi Aplikasi Anak Aman", "Review Tablet Edukasi Murah Berkualitas", "Tips Baterai Tablet Anak Tahan Seharian", "Aplikasi Belajar Membaca Suku Kata Lancar"
      ];
      const k = kidsTopics[day % kidsTopics.length];
      const enTopic = TOPIC_TRANSLATIONS.kids[k] || k;
      const title = `Panduan Belajar Anak & Gadget Edukatif: ${k} (Tips 2026 #${dayNum})`;
      const enTitle = `Kids Tech & Educational Screen Time Guide: ${enTopic} (2026 Advice #${dayNum})`;
      const slugEn = createSlugEn(`kidstech-learning-${enTopic}-2026-advice-${dayNum}`);
      const enMetaTitle = `Kids EdTech: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Parenting and edtech guide covering ${enTopic}. Build healthy digital habits, set safe screen time routines, and boost early childhood learning.`;
      const englishSummary = `A comprehensive tactical masterclass detailing Kids Tech & Educational Screen Time Guide: ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    case 9: { // Productivity & PDF Work
      const prodTopics = [
        "Edit Teks Dokumen PDF Offline Tanpa Internet", "Tanda Tangan Digital Formulir PDF Cepat", "Isi Formulir PDF Lamaran Kerja Beasiswa", "Gabung Banyak File PDF Jadi Satu Dokumen", "Pisahkan Halaman PDF Tertentu Tanpa Ribet",
        "Kompres Ukuran File PDF Tetap Terbaca Jelas", "Kunci PDF Password Lindungi Data Rahasia", "Hapus Password PDF Milik Sendiri Praktis", "Ubah Foto Kertas Scan Jadi PDF Rapi", "Konversi PDF ke Gambar JPEG Transparan",
        "Anotasi Catatan Garis Bawah Dokumen PDF", "Sorot Teks Stabilo Warna PDF Buku Pelajaran", "Beri Stempel Lunas Sah Pada Faktur PDF", "Beri Cap Watermark Rahasia Draft Dokumen", "Ubah Urutan Halaman PDF Geser Fleksibel",
        "Putar Rotasi Halaman PDF Terbalik 90 Derajat", "Hapus Halaman Kosong PDF Tanpa Aplikasi Berat", "Ekstrak Teks OCR Gambar Hasil Scan Buku", "Stylus Pen Presisi Tulis Tangan Catatan PDF", "Pelindung Layar Tekstur Kertas Paperlike Tulis",
        "Simpan Dokumen KTP Ijazah Offline Bebas Sadap", "Bahaya Unggah Dokumen Rahasia ke Web Gratis", "Kelola Bukti Nota Pembayaran Pajak PDF", "Buku Catatan Rapat Digital Bebas Kertas Paperless", "Katalog Produk Portofolio PDF Bisnis Rapi",
        "Buat Ebook Format PDF Sendiri di Android", "Baca File Buku PDF Mode Gelap Nyaman Mata", "Navigasi Cepat Daftar Isi Bookmark PDF", "Cari Kata Kunci Dokumen PDF Ratusan Halaman", "Cetak Dokumen PDF Lewat Printer WiFi HP",
        "Kirim File PDF Lewat Email Ukuran Standar", "Backup File PDF Penting ke Flashdisk Type-C", "Organisasi Folder Dokumen Kerja HP Rapi", "Aplikasi Edit PDF Ringan Hemat Memori HP", "Tips Baterai HP Awet Saat Baca Dokumen Lama",
        "Perjanjian Kontrak Kerjasama Digital Legal", "Review Stylus Pen Murah Alternatif Apple S Pen", "Keyboard Bluetooth Ringan Ngetik Dokumen HP", "Dudukan Tablet Baca Dokumen Tanpa Pegal", "Scan Dokumen Lurus Otomatis Potong Sudut",
        "Bikin Lembar Soal Ujian Kuis Format PDF", "Koreksi Skripsi Tesis Guru Dosen Coretan Digital", "Bagan Alur Flowchart Sisipkan Dalam PDF", "Kop Surat Resmi Logo Lembaga Stempel PDF", "Format PDF/A Arsip Jangka Panjang Standar",
        "Tips Produktivitas Kerja Paperless 2026", "Keamanan Dokumen Tanpa Jejak Pelacak Online", "Workflow Tanda Tangan Kontrak Cepat 2 Menit", "Aplikasi Zero Network Perlindungan Privasi Penuh", "Solusi Dokumen Mobile Profesional Tanpa Laptop"
      ];
      const p = prodTopics[day % prodTopics.length];
      const enTopic = TOPIC_TRANSLATIONS.prod[p] || p;
      const title = `Panduan Dokumen & Produktivitas Mobile: ${p} (Solusi 2026 #${dayNum})`;
      const enTitle = `Mobile Document & PDF Productivity Guide: ${enTopic} (2026 Solution #${dayNum})`;
      const slugEn = createSlugEn(`productivity-pdf-${enTopic}-2026-solution-${dayNum}`);
      const enMetaTitle = `PDF Productivity: ${safeTruncate(enTopic, 32)} | D Lucky X`;
      const enMetaDesc = `Paperless productivity and mobile document guide on ${enTopic}. Master 100% offline PDF editing, digital signatures, and safe on-device workflows.`;
      const englishSummary = `A comprehensive tactical masterclass detailing Mobile Document & PDF Productivity Guide: ${enTopic}. Learn exact mechanics, pro settings, step-by-step execution workflows, and critical mistakes to avoid.`;
      return { title, enTitle, enTopic, slugEn, enMetaTitle, enMetaDesc, englishSummary };
    }
    default:
      return {
        title: `Panduan Lengkap Update 2026 (Hari ke-${dayNum})`,
        enTitle: `Complete Pro Guide: 2026 Strategy Update (Day #${dayNum})`,
        enTopic: "Pro Strategy",
        slugEn: createSlug(`complete-pro-guide-2026-strategy-update-day-${dayNum}`),
        enMetaTitle: `2026 Strategy Guide | D Lucky X`,
        enMetaDesc: `Comprehensive pro tactics guide for 2026.`,
        englishSummary: `A comprehensive tactical masterclass for 2026.`
      };
  }
}

function createSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 75);
}

function createSlugEn(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 75)
    .replace(/-+$/g, "");
}

const ITEM_DESCRIPTIONS = {
  "Tough Boots": {
    id: "Memangkas durasi crowd control (stun/slow) lawan sebesar 30% dan menambah pertahanan sihir krusial.",
    en: "Reduces incoming crowd-control duration by 30% while providing vital early magic resistance."
  },
  "Warrior Boots": {
    id: "Meningkatkan physical defense bertingkat setiap kali menerima serangan fisik lawan.",
    en: "Progressively stacks physical defense upon receiving incoming physical hits."
  },
  "Swift Boots": {
    id: "Meningkatkan attack speed dasar sebesar 15% untuk mempercepat akumulasi pasif serangan.",
    en: "Boosts baseline attack speed by 15% to accelerate basic attack passive charges."
  },
  "Arcane Boots": {
    id: "Memberikan +10 Magic Penetration untuk menembus pertahanan sihir lawan di menit awal.",
    en: "Provides flat +10 Magic Penetration to pierce early enemy magic resistance."
  },
  "Rapid Boots": {
    id: "Memberikan movement speed tertinggi untuk rotasi roaming kilat melintasi seluruh lane.",
    en: "Delivers maximum out-of-combat movement speed for lightning-fast cross-map rotations."
  },
  "Berserker's Fury": {
    id: "Fondasi damage kritikal utama dengan +65 Physical Attack dan pasif unik +40% Critical Damage.",
    en: "Core critical milestone providing +65 Physical Attack and +40% unique Critical Damage."
  },
  "Great Dragon Spear": {
    id: "Memberikan +70 Physical Attack, +20% Critical Chance, dan dorongan lari instan 15% setelah melancarkan Ultimate.",
    en: "Grants +70 Physical Attack, +20% Critical Chance, and a 15% sprint surge upon casting Ultimate."
  },
  "Endless Battle": {
    id: "Memicu True Damage tambahan pasca penggunaan skill, physical lifesteal, dan reduksi cooldown.",
    en: "Triggers scaling True Damage following ability casts, paired with physical lifesteal and CDR."
  },
  "Malefic Roar": {
    id: "Penetrasi armor berbasis persentase armor fisik lawan, mutlak dibutuhkan untuk merontokkan hero tebal.",
    en: "Scales percentage physical penetration to pierce high-armor tanks and bulky frontline fighters."
  },
  "Immortality": {
    id: "Memberikan asuransi bangkit kembali dengan 16% HP dan shield pelindung untuk meloloskan diri atau counter attack.",
    en: "Grants resurrection with 16% HP and a temporary shield for clutch escape or counter-attack."
  },
  "Blade of the Heptaseas": {
    id: "Memberikan bonus damage burst pada serangan dasar pertama setelah tidak terkena hit selama 5 detik.",
    en: "Delivers ambush burst damage on the first basic attack after remaining out of combat for 5 seconds."
  },
  "Hunter Strike": {
    id: "Memicu lonjakan movement speed 50% setelah memberikan damage 5 kali berturut-turut ke hero lawan.",
    en: "Triggers a 50% movement speed surge after dealing damage 5 consecutive times to enemy heroes."
  },
  "Rose Gold Meteor": {
    id: "Menciptakan shield sihir darurat dan lifesteal ekstra saat darah sekarat di bawah 30%.",
    en: "Deploys an emergency magic shield and bonus lifesteal when health drops below 30%."
  },
  "Athena's Shield": {
    id: "Mengurangi damage sihir ledakan (burst magic) sebesar 25% selama beberapa detik pertama serangan.",
    en: "Reduces incoming burst magic damage by 25% for several critical seconds."
  },
  "Blade of Despair": {
    id: "Pemberi Physical Attack tertinggi (+160) dengan pasif ekstra 25% damage saat target sekarat di bawah 50% HP.",
    en: "Delivers maximum +160 Physical Attack with a 25% damage amplifier against low-health targets."
  },
  "War Axe": {
    id: "Memberikan tumpukan attack dan penetration berkelanjutan serta True Damage saat pasif penuh.",
    en: "Stacks progressive attack power and penetration, unleashing True Damage at maximum battle stacks."
  },
  "Queen's Wings": {
    id: "Memicu damage reduction masif dan reset cooldown skill saat HP berada di titik kritis.",
    en: "Triggers massive damage reduction and skill cooldown resets when health hits critical thresholds."
  },
  "Genius Wand": {
    id: "Mengikis Magic Defense lawan secara bertumpuk setiap kali skill sihir mengenai target.",
    en: "Progressively shreds enemy Magic Defense with each connecting magical ability."
  },
  "Holy Crystal": {
    id: "Memberikan lonjakan Magic Power persentase scaling yang melipatgandakan output damage penyihir.",
    en: "Bestows percentage-scaling Magic Power to exponentially amplify mage spell damage."
  },
  "Glowing Wand": {
    id: "Memberikan efek bakar terus menerus berbasis persentase HP lawan dan mengurangi efek regenerasi darah.",
    en: "Applies continuous percentage HP burn while cutting enemy healing regeneration."
  },
  "Divine Glaive": {
    id: "Penetrasi sihir persentase tertinggi untuk menembus Tank yang membeli Radiant Armor atau Athena.",
    en: "Maximum percentage magic penetration tailored to melt tanks building heavy magic resistance."
  },
  "Blood Wings": {
    id: "Memberikan shield tebal yang beregenerasi otomatis dan lonjakan Magic Power tertinggi di late game.",
    en: "Grants a thick auto-regenerating shield alongside massive late-game Magic Power."
  },
  "Demon Hunter Sword": {
    id: "Memberikan damage berbasis persentase HP musuh saat ini, senjata penghancur hero berdarah tebal.",
    en: "Deals percentage current-HP damage per strike, acting as the premier anti-tank shredder."
  },
  "Golden Staff": {
    id: "Mengonversi Critical Chance menjadi attack speed dan melipatgandakan aktivasi pasif basic attack.",
    en: "Converts Critical Chance into pure attack speed while tripling on-hit passive activations."
  },
  "Wind of Nature": {
    id: "Memberikan kekebalan total dari semua damage fisik selama 2 detik untuk bertahan dari assassin lawan.",
    en: "Grants complete physical damage immunity for 2 seconds to survive lethal assassin dives."
  },
  "Corrosion Scythe": {
    id: "Memberikan efek slow pada serangan dasar dan meningkatkan attack speed secara akumulatif.",
    en: "Applies slowing debuffs on basic attacks while stacking attack speed exponentially."
  },
  "Dominance Ice": {
    id: "Mengurangi attack speed lawan di sekitar sebesar 70% dan memangkas regenerasi HP/shield musuh hingga 50%.",
    en: "Reduces nearby enemy attack speed by 70% and cuts healing/shield regeneration by 50%."
  },
  "Antique Cuirass": {
    id: "Memangkas persentase Physical Attack musuh saat Anda terkena skill fisik bertubi-tubi.",
    en: "Progressively diminishes enemy Physical Attack upon receiving incoming physical skill hits."
  },
  "Blade Armor": {
    id: "Memantulkan damage serangan fisik kembali ke penyerang dan memangkas Critical Damage musuh.",
    en: "Reflects incoming physical basic attack damage while dampening incoming Critical Damage."
  },
  "Thunder Belt": {
    id: "Memberikan True Damage berbasis HP dan efek slow area setelah penggunaan skill, serta menambah defense permanen.",
    en: "Deals HP-scaling True Damage with an area slow while permanently stacking hybrid defenses."
  }
};

function getItemDesc(item, lang = "id") {
  // Strip roaming/jungling prefix
  const cleanItem = item.replace(/^(Ice Hunter's|Flame Hunter's|Bloody Hunter's)\s+/i, "").replace(/\s+\(Conceal\)$/i, "");
  if (ITEM_DESCRIPTIONS[cleanItem]) {
    return ITEM_DESCRIPTIONS[cleanItem][lang] || ITEM_DESCRIPTIONS[cleanItem].id;
  }
  return lang === "id"
    ? "Memberikan atribut sinergis esensial untuk memaksimalkan efektivitas skill dan ketahanan hero di arena."
    : "Delivers essential synergistic attributes to maximize skill scaling and battle survivability.";
}

// Generate cover WebP only if doesn't exist
async function generateCoverImage(slug, title, categoryText, themeColor = "#10b981") {
  const filePath = path.join("public/images/blog", `${slug}.webp`);
  if (fs.existsSync(filePath)) return `/images/blog/${slug}.webp`;

  const safeTitle = title.length > 52 ? title.slice(0, 50) + "..." : title;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <rect width="1200" height="630" fill="#0f172a" />
    <rect x="25" y="25" width="1150" height="580" rx="28" fill="none" stroke="#1e293b" stroke-width="2" />
    <rect x="65" y="65" width="310" height="44" rx="22" fill="#1e293b" stroke="${themeColor}" stroke-width="1.5" />
    <text x="220" y="93" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle" letter-spacing="2">${categoryText.toUpperCase().replace(/&/g, "&amp;")}</text>
    <text x="65" y="240" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="38">${safeTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
    <text x="65" y="300" fill="#94a3b8" font-family="sans-serif" font-size="22">Panduan Lengkap, Analisis Taktik, &amp; Tips Juara 2026</text>
    <text x="65" y="555" fill="#64748b" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="1">D LUCKY X • PRO EDITORIAL &amp; STRATEGY LAB</text>
  </svg>`;

  try {
    await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(filePath);
  } catch (err) {}

  return `/images/blog/${slug}.webp`;
}

// =========================================================================
// HIGH-VALUE, CATEGORY-TAILORED CONTENT GENERATION ENGINE
// =========================================================================

function buildHeroContent(heroName, dayNum) {
  const heroDb = {
    "Ling": {
      role: "Assassin Jungler",
      tier: "S-Tier",
      items: ["Ice Hunter's Tough Boots", "Berserker's Fury", "Great Dragon Spear", "Endless Battle", "Malefic Roar", "Immortality"],
      spell: "Retribution (Ice)",
      emblem: "Custom Assassin Emblem: Rupture (+5 Adaptive Pen), Seasoned Hunter (+15% Dmg Monster/Lord), Lethal Ignition",
      combo: "Finch Poise lompat ke dinding -> Defiant Sword tusuk target empuk -> Tempest of Blades kebal serangan -> ambil 4 pedang berputar dalam 1.5 detik",
      comboEn: "Finch Poise onto terrain wall -> Defiant Sword dive onto squishy target -> Tempest of Blades invulnerability -> cycle 4 blades within 1.5 seconds",
      tip: "Jangan pernah memulai kontes Turtle atau Lord tanpa efek Purple Buff aktif. Reduksi energi 50% adalah nyawa mobilitas vertikal Ling.",
      tipEn: "Never contest Turtle or Lord objectives without an active Purple Buff. The 50% energy reduction is the absolute lifeblood of Ling's vertical wall mobility.",
      counter: "Franco, Khufra, Minsitthar, Kaja",
      counterEn: "Franco, Khufra, Minsitthar, Kaja"
    },
    "Fanny": {
      role: "Assassin Jungler",
      tier: "S-Tier",
      items: ["Ice Hunter's Tough Boots", "Blade of the Heptaseas", "Hunter Strike", "Malefic Roar", "Rose Gold Meteor", "Athena's Shield"],
      spell: "Retribution (Ice)",
      emblem: "Custom Assassin Emblem: Rupture, Seasoned Hunter, Killing Spree (+8% HP & +15% Speed setelah eliminasi)",
      combo: "Steel Cable 2 kabel lintasi dinding -> Steel Cable lurus koridor sempit -> Cut Throat finisher instan",
      comboEn: "Steel Cable dual-wire wall traverse -> straight cable thrust through tight corridor -> Cut Throat instant execute",
      tip: "Kuasai teknik kabel lurus di celah dinding sempit jungle untuk menghasilkan putaran damage berulang dengan efisiensi energi maksimal.",
      tipEn: "Master straight cable trajectories in narrow jungle corridors to maximize damage cycling with optimal energy efficiency.",
      counter: "Khufra, Saber, Chou, Franco",
      counterEn: "Khufra, Saber, Chou, Franco"
    },
    "Hayabusa": {
      role: "Assassin Jungler",
      tier: "S-Tier",
      items: ["Swift Boots", "Hunter Strike", "Blade of Despair", "Malefic Roar", "Endless Battle", "Immortality"],
      spell: "Retribution (Ice)",
      emblem: "Custom Assassin Emblem: Rupture, Seasoned Hunter, Lethal Ignition",
      combo: "Ninjutsu: Quad Shadow pasang 4 bayangan -> Phantom Shuriken cicil stack pasif -> Shadow Kill saat musuh terisolasi",
      comboEn: "Ninjutsu: Quad Shadow to deploy 4 shadow markers -> Phantom Shuriken to stack passive marks -> Shadow Kill when target is isolated",
      tip: "Pastikan minion atau monster hutan sudah bersih sebelum mengaktifkan Shadow Kill agar tebasan fokus 100% pada hero musuh.",
      tipEn: "Ensure nearby minions and jungle creeps are fully cleared before unleashing Shadow Kill so all strikes concentrate 100% on the enemy hero.",
      counter: "Saber, Kaja, Khufra",
      counterEn: "Saber, Kaja, Khufra"
    },
    "Lancelot": {
      role: "Assassin Jungler",
      tier: "S-Tier",
      items: ["Ice Hunter's Tough Boots", "War Axe", "Endless Battle", "Blade of Despair", "Malefic Roar", "Queen's Wings"],
      spell: "Retribution",
      emblem: "Custom Assassin Emblem: Swift, Seasoned Hunter, Killing Spree",
      combo: "Puncture tembus minion tanpa batas reset -> Thorned Rose saat musuh di titik tengah segitiga -> Phantom Execution",
      comboEn: "Puncture reset dash through minion waves -> Thorned Rose centered on target triangle -> Phantom Execution finisher",
      tip: "Gunakan iframe Thorned Rose untuk menghindari stun atau proyektil mematikan dari mage lawan.",
      tipEn: "Utilize the iframe invulnerability window of Thorned Rose to evade enemy stun projectiles and lethal burst abilities.",
      counter: "Phoveus, Khufra, Franco",
      counterEn: "Phoveus, Khufra, Franco"
    },
    "Gusion": {
      role: "Assassin / Mage Mid & Jungler",
      tier: "A-Tier",
      items: ["Arcane Boots", "Genius Wand", "Holy Crystal", "Glowing Wand", "Divine Glaive", "Blood Wings"],
      spell: "Flicker / Retribution",
      emblem: "Custom Mage Emblem: Rupture, Bargain Hunter, Lethal Ignition",
      combo: "Sword Spike tandai target -> Shadowblade Slaughter 5 belati -> Incandescence reset -> ulangi belati -> recall konvergensi",
      comboEn: "Sword Spike to tag target -> Shadowblade Slaughter 5 daggers -> Incandescence reset -> recast daggers -> dagger recall convergence",
      tip: "Tarik kembali belati tepat saat meluncur ke badan musuh agar seluruh 10 belati mengenai satu titik untuk burst instan.",
      tipEn: "Recall your daggers right as you dash into the target so all 10 blades converge simultaneously for instant burst damage.",
      counter: "Radiant Armor, Athena's Shield, Lolita",
      counterEn: "Radiant Armor, Athena's Shield, Lolita"
    },
    "Nolan": {
      role: "Assassin Jungler",
      tier: "S-Tier",
      items: ["Ice Hunter's Tough Boots", "Hunter Strike", "Blade of the Heptaseas", "Malefic Roar", "Blade of Despair", "Immortality"],
      spell: "Retribution",
      emblem: "Custom Assassin Emblem: Rupture, Seasoned Hunter, Killing Spree",
      combo: "Expansion silang dengan Gauge untuk tarik musuh -> Cosmic Leap menusuk -> The Dimension Charge bersihkan debuff",
      comboEn: "Expansion intersecting with Gauge to pull targets -> Cosmic Leap thrust -> The Dimension Charge to cleanse CC",
      tip: "Posisikan dua retakan dimensional saling bersinggungan di bawah kaki musuh untuk memicu ledakan kosmik yang menarik lawan.",
      tipEn: "Cross two dimensional rifts directly beneath the enemy's feet to trigger cosmic fracture implosions that pull them in.",
      counter: "Minsitthar, Phoveus, Khufra",
      counterEn: "Minsitthar, Phoveus, Khufra"
    },
    "Beatrix": {
      role: "Marksman Goldlane",
      tier: "S-Tier",
      items: ["Swift Boots", "Blade of Despair", "Demon Hunter Sword", "Malefic Roar", "Rose Gold Meteor", "Wind of Nature"],
      spell: "Flicker",
      emblem: "Custom Marksman Emblem: Swift, Weapon Master, Quantum Charge",
      combo: "Renner (Sniper) poke jarak jauh -> ganti Wesker (Shotgun) di semak -> Wesker's Elation tembakan burst 5 peluru",
      comboEn: "Renner long-range sniper poke -> switch to Wesker in bush -> Wesker's Elation 5-shot point-blank burst",
      tip: "Kuasai timing ganti senjata saat rotasi di semak-semak. Wesker adalah senjata paling mematikan saat menghadapi assassin lawan.",
      tipEn: "Master weapon-swapping timing while maneuvering in bushes. Wesker shotgun is your deadliest self-defense against diving assassins.",
      counter: "Claude, Lolita, Natalia",
      counterEn: "Claude, Lolita, Natalia"
    },
    "Wanwan": {
      role: "Marksman Goldlane",
      tier: "A-Tier",
      items: ["Swift Boots", "Corrosion Scythe", "Demon Hunter Sword", "Golden Staff", "Wind of Nature", "Malefic Roar"],
      spell: "Aegis / Inspire",
      emblem: "Custom Marksman Emblem: Swift, Bargain Hunter, Weakness Finder",
      combo: "Swallow's Path lempar ke belakang musuh -> lompat memutar pecahkan 4 weakness -> Crossbow of Tang terbang kebal serangan",
      comboEn: "Swallow's Path behind enemy -> circular hopping dashes to break 4 weakness vitals -> Crossbow of Tang aerial invulnerability",
      tip: "Simpan skill 2 murni sebagai Purify darurat untuk melepaskan diri dari stun saat membuka titik kelemahan musuh.",
      tipEn: "Save Needles in Flowers strictly as an emergency Purify to cleanse hard CC while breaking enemy weakness marks.",
      counter: "Phoveus, Khufra, Natalia",
      counterEn: "Phoveus, Khufra, Natalia"
    },
    "Claude": {
      role: "Marksman Goldlane",
      tier: "S-Tier",
      items: ["Swift Boots", "Demon Hunter Sword", "Golden Staff", "Corrosion Scythe", "Wind of Nature", "Immortality"],
      spell: "Vengeance / Flicker",
      emblem: "Custom Marksman Emblem: Agility, Bargain Hunter, Quantum Charge",
      combo: "Art of Thievery jaga 10 stack -> Battle Mirror Image taruh hologram di semak -> Blazing Duet serbu pertempuran",
      comboEn: "Maintain 10 stacks of Art of Thievery -> Battle Mirror Image clone in bush -> Blazing Duet dive into teamfight",
      tip: "Jangan pernah meluncur dengan Ultimate sebelum stack Art of Thievery penuh di angka 10, karena jumlah peluru bergantung pada attack speed.",
      tipEn: "Never dive with Blazing Duet before stacking Art of Thievery to maximum 10 stacks, as total ultimate bullet count scales with attack speed.",
      counter: "Belerick, Franco, Kaja",
      counterEn: "Belerick, Franco, Kaja"
    },
    "Tigreal": {
      role: "Tank Roamer",
      tier: "S-Tier",
      items: ["Tough Boots (Conceal)", "Dominance Ice", "Athena's Shield", "Antique Cuirass", "Blade Armor", "Immortality"],
      spell: "Flicker",
      emblem: "Custom Tank Emblem: Firmness, Tenacity, Brave Smite",
      combo: "Conceal dekati formasi lawan -> Flicker + Implosion tarik 5 musuh -> Sacred Hammer dorong ke arah rekan tim",
      comboEn: "Conceal approach -> Flicker + Implosion 5-man vacuum pull -> Sacred Hammer push toward allied carries",
      tip: "Tunggu hero lawan menghabiskan skill dash atau Purify sebelum melancarkan wombo combo Flicker Implosion.",
      tipEn: "Wait for enemy carries to expend their mobility dashes or Purify spells before committing your Flicker into Implosion combo.",
      counter: "Diggie, Valir, Karrie",
      counterEn: "Diggie, Valir, Karrie"
    },
    "Chou": {
      role: "Fighter Explane & Roamer",
      tier: "S-Tier",
      items: ["Warrior Boots", "Blade of the Heptaseas", "Hunter Strike", "Blade of Despair", "Thunder Belt", "Immortality"],
      spell: "Flicker",
      emblem: "Custom Assassin / Fighter Emblem: Rupture, Weapon Master, Killing Spree",
      combo: "Jeet Kune Do pukulan 1-2 -> Shunpo kebal crowd control -> Jeet Kune Do 3 knockup -> The Way of Dragon tendang ke turret",
      comboEn: "Jeet Kune Do strikes 1-2 -> Shunpo CC immunity slide -> Jeet Kune Do 3 knockup -> The Way of Dragon kick into turret",
      tip: "Gunakan Shunpo tepat saat proyektil stun musuh meluncur untuk menyerap efek crowd control dan memperoleh bonus penetrasi.",
      tipEn: "Time Shunpo right as incoming enemy stun projectiles travel to absorb crowd control and gain bonus physical penetration.",
      counter: "Minsitthar, Phoveus, Diggie",
      counterEn: "Minsitthar, Phoveus, Diggie"
    },
    "Franco": {
      role: "Tank Roamer",
      tier: "A-Tier",
      items: ["Rapid Boots (Conceal)", "Dominance Ice", "Athena's Shield", "Antique Cuirass", "Thunder Belt", "Immortality"],
      spell: "Flicker",
      emblem: "Custom Tank Emblem: Swift, Tenacity, Concussive Blast",
      combo: "Iron Hook dari semak tanpa tanda -> Bloody Hunt kuncian suppression mutlak -> Fury Shock slow area",
      comboEn: "Iron Hook from unspotted bush -> Bloody Hunt absolute suppression lock -> Fury Shock area slow",
      tip: "Arahkan Iron Hook 0.5 meter di depan arah lari musuh untuk membaca pergerakan refleks lawan.",
      tipEn: "Lead your Iron Hook approximately half a meter ahead of the enemy's moving vector to predict their reaction pattern.",
      counter: "Tigreal, Atlas, Grock",
      counterEn: "Tigreal, Atlas, Grock"
    }
  };

  const defaultHero = {
    role: "Fighter / Flexible Meta",
    tier: "A-Tier",
    items: ["Warrior Boots", "War Axe", "Hunter Strike", "Dominance Ice", "Malefic Roar", "Immortality"],
    spell: "Flicker / Vengeance",
    emblem: "Custom Fighter / Assassin Emblem: Rupture, Festival of Blood (+8% Spell Vamp), Brave Smite",
    combo: "Inisiasi skill dash pembuka -> cicil damage dengan skill area -> aktifkan ultimate saat musuh berkumpul di objektif",
    comboEn: "Initiate with forward mobility dash -> soften targets with AoE abilities -> unleash Ultimate once enemies gather around objectives",
    tip: "Kuasai freeze lane di menit awal untuk membuat offlaner musuh tertinggal gold dan level dari tim Anda.",
    tipEn: "Master minion wave freezing in early laning to starve the enemy offlaner of gold and experience.",
    counter: "Hero poke jarak jauh, hero anti-dash, hero suppression",
    counterEn: "Long-range poke heroes, anti-dash grounding specialists, and instant suppression locks"
  };

  const data = heroDb[heroName] || defaultHero;

  return {
    id: [
      {
        id: "analisis-meta-karakter",
        title: `1. Analisis Meta ${heroName} 2026: Mengapa Hero Ini Mendominasi Solo Rank?`,
        content: [
          `Dalam meta kompetitif *Mobile Legends: Bang Bang* tahun 2026, **${heroName}** menduduki posisi sentral sebagai **${data.role}** bertaraf **${data.tier}**. Efektivitasnya bertumpu pada perpaduan output damage ledakan yang tajam dan fleksibilitas rotasi yang mampu membalikkan tempo pertandingan.`,
          `Di tangan pemain yang disiplin membaca pergerakan map, **${heroName}** mampu memberikan tekanan psikologis besar sejak *early game*. Penguasaan jalur rotasi dan kalkulasi cooldown skill menjadi pembeda mendasar antara pemain rata-rata dengan *Mythical Glory* sejati.`
        ],
        tipBox: {
          title: "Kunci Kemenangan Utama",
          text: data.tip,
          type: "tip"
        }
      },
      {
        id: "susunan-item-build-terkuat",
        title: `2. Susunan Item Build ${heroName} Tersakit 2026 (Full Sinergi)`,
        content: [
          `Untuk memaksimalkan potensi pasif dan scaling damage **${heroName}**, susunan 6 item inti berikut dirancang untuk menyeimbangkan penetrasi, damage ledakan, dan daya tahan hidup di pertarungan intens:`,
          `Gunakan urutan pembelian item berikut secara disiplin agar kurva kekuatan (*power spike*) Anda selalu unggul di setiap fase pertandingan:`
        ],
        bulletPoints: data.items.map((item, i) => `${i + 1}. **${item}**: ${getItemDesc(item, "id")}`)
      },
      {
        id: "setting-emblem-dan-spell",
        title: `3. Konfigurasi Emblem, Talent & Battle Spell Rekomendasi Pro`,
        content: [
          `Konfigurasi emblem memainkan peran krusial dalam 5 menit pertama pertandingan:`,
          `Gunakan **${data.emblem}**. Susunan talent ini memberikan kestabilan stat sejak menit pertama dan mempercepat eliminasi objektif Turtle maupun Lord.`,
          `Untuk Battle Spell, gunakan **${data.spell}** sesuai peran Anda di dalam tim.`
        ],
        tipBox: {
          title: "Peringatan Counter Pick",
          text: `Waspadai hero counter alami seperti: **${data.counter}**. Pastikan hero-hero tersebut sudah terpancing mengeluarkan skill kunci sebelum Anda masuk ke pertempuran.`,
          type: "warning"
        }
      },
      {
        id: "mekanika-kombo-dan-rotasi",
        title: `4. Rute Rotasi Map & Mekanika Kombo Skill Paling Mematikan`,
        content: [
          `Urutan eksekusi kombo paling konsisten: **${data.combo}**.`,
          `**Rute Rotasi**: Mulai dari pengamanan objektif terdekat pada detik **0:35**, lakukan kontes Lithowanderer di sungai, lalu potong jalur rotasi goldlane lawan pada menit **1:30** sebelum Turtle pertama muncul pada menit ke-2.`,
          `Saat memasuki fase *late game*, hindari memperlihatkan posisi Anda di minimap sebelum pertempuran besar dimulai. Gunakan semak-semak tanpa visi musuh untuk melancarkan serangan kejutan.`
        ]
      },
      {
        id: "tips-konsistensi-dan-kesalahan",
        title: `5. Kesalahan Umum Pemula & Cara Menjaga Win Rate Tinggi`,
        content: [
          `Kesalahan paling sering terjadi adalah terlalu bernafsu mengejar kill individual (*tunnel vision*) hingga mengabaikan pertahanan turret atau objektif Lord. Ingatlah bahwa *Mobile Legends* adalah game penghancuran base, bukan kontes jumlah eliminasi.`,
          `Selalu perhatikan posisi *Roamer* dan *Midlaner* lawan di radar mini sebelum memutuskan untuk melakukan diving ke dalam formasi pertahanan musuh.`
        ]
      }
    ],
    en: [
      {
        id: "meta-analysis-character",
        title: `1. 2026 Meta Breakdown: Why ${heroName} Dominates Ranked Lobbies`,
        content: [
          `In the 2026 competitive landscape of *Mobile Legends: Bang Bang*, **${heroName}** stands firmly as an elite **${data.role}** rated at **${data.tier}**. Its dominance is rooted in exceptional burst potential and versatile rotation tempo that dictates match outcomes.`,
          `In the hands of disciplined macro-oriented players, **${heroName}** exerts relentless pressure across lanes. Mastering rotation timing and ability cooldowns represents the true dividing line between casual rankers and elite champions.`
        ],
        tipBox: {
          title: "Core Tactical Secret",
          text: data.tipEn,
          type: "tip"
        }
      },
      {
        id: "optimal-equipment-build",
        title: `2. Definitive 2026 Equipment Build for ${heroName}`,
        content: [
          `To unlock the full damage scaling and survivability of **${heroName}**, this 6-item core arsenal harmonizes penetration, sustained burst, and defensive safety:`,
          `Prioritize this itemization curve to stay ahead of power spikes at every stage of the match:`
        ],
        bulletPoints: data.items.map((item, i) => `${i + 1}. **${item}**: ${getItemDesc(item, "en")}`)
      },
      {
        id: "emblem-and-spell-configuration",
        title: `3. Pro-Grade Emblem, Talent & Battle Spell Configuration`,
        content: [
          `Emblem tuning dictates early-game lane dominance during the first five minutes:`,
          `Equip **${data.emblem}**. This configuration anchors your early baseline stats and expedites Turtle and Lord objective clear speeds.`,
          `For Battle Spell, lock in **${data.spell}** to match your squad's draft tempo.`
        ],
        tipBox: {
          title: "Counter Pick Warning",
          text: `Be vigilant against natural counters: **${data.counterEn}**. Wait for these threats to expend key control skills before committing your dive.`,
          type: "warning"
        }
      },
      {
        id: "combo-mechanics-and-rotation",
        title: `4. Decisive Skill Combo Execution & Objective Rotation Blueprint`,
        content: [
          `Primary execution combo: **${data.comboEn}**.`,
          `**Rotation Blueprint**: Clear primary jungle/lane camps by second **0:35**, contest the river Lithowanderer, and execute a lethal flank onto the enemy goldlane carry at **1:30** ahead of the **2:00** Turtle pit emergence.`,
          `During late-game scenarios, maintain strict fog-of-war concealment. Conceal your presence in unspotted brushes to unleash game-winning ambush strikes.`
        ]
      },
      {
        id: "common-pitfalls-and-winrate-discipline",
        title: `5. Frequent Beginner Mistakes & Consistency Habits`,
        content: [
          `The most prevalent blunder is chasing isolated kills (*tunnel vision*) while neglecting turret pressure or Lord vision control. *Mobile Legends* is ultimately a base-siege strategy game, not a kill-count race.`,
          `Always cross-reference enemy *Roamer* and *Midlaner* positions on the mini-radar before committing to aggressive tower dives.`
        ]
      }
    ],
    faq: [
      {
        q: `Kapan waktu terbaik memilih ${heroName} saat fase draft pick?`,
        a: `Pilih ${heroName} saat musuh kekurangan hero crowd-control bertipe suppression dan tim Anda membutuhkan carry yang mampu mengamankan objektif secara mandiri.`
      },
      {
        q: `Bagaimana cara membalikkan keadaan jika tim tertinggal gold di early game?`,
        a: `Hindari pertarungan 5v5 terbuka. Fokus melakukan split push di lane samping untuk memecah konsentrasi musuh, sambil menunggu momentum mencuri Lord.`
      },
      {
        q: `Apakah build item di atas fleksibel di setiap pertandingan?`,
        a: `Sangat fleksibel. Jika tim musuh didominasi magic damage, ganti item pertahanan fisik penutup dengan Athena's Shield atau Radiant Armor.`
      }
    ],
    faqEn: [
      {
        q: `When is the optimal draft moment to lock in ${heroName}?`,
        a: `Draft ${heroName} when enemy compositions lack heavy suppression crowd-controls and your squad requires an independent objective carry.`
      },
      {
        q: `How do you orchestrate a comeback when trailing in gold early?`,
        a: `Avoid head-on 5v5 clashes. Focus on side-lane split pushing to disrupt enemy formations while seeking clutch Lord steal windows.`
      },
      {
        q: `Is this equipment build adaptable against diverse team compositions?`,
        a: `Yes. Swap your final defensive slot for Athena's Shield or Radiant Armor if confronting heavy magic burst compositions.`
      }
    ]
  };
}

// Build Deep, Unique Content for All 10 Slots
function buildDeepArticleItem(topicInfo, slotInfo, dayIndex) {
  const baseDate = new Date(START_DATE_STR);
  baseDate.setDate(baseDate.getDate() + dayIndex);

  const dateYear = baseDate.getFullYear();
  const dateMonth = String(baseDate.getMonth() + 1).padStart(2, "0");
  const dateDay = String(baseDate.getDate()).padStart(2, "0");
  const publishedDate = `${dateYear}-${dateMonth}-${dateDay}T${slotInfo.time}+07:00`;

  const { title, enTitle, slugEn, enMetaTitle, enMetaDesc, englishSummary } = topicInfo;

  const slug = createSlug(`${slotInfo.shortTag}-${title}`);
  const metaTitle = `${title.slice(0, 50)} | Panduan Lengkap D Lucky X`;
  const metaDescription = `Ulasan mendalam ${title}. Pelajari rahasia teknis, langkah eksekusi pro, rekomendasi setup resmi, dan tips menang konsisten 2026.`;

  let generatedSections;
  if (slotInfo.slotIndex === 0) {
    const match = title.match(/Build\s+([\w\s&]+?)\s+Tersakit/i);
    const heroName = match ? match[1].trim() : "Hero";
    generatedSections = buildHeroContent(heroName, dayIndex + 1);
  } else {
    generatedSections = buildGeneralSlotContent(slotInfo.slotIndex, title, enTitle, slotInfo.label, dayIndex + 1);
  }

  return {
    slug,
    slugEn,
    targetAppSlug: slotInfo.app,
    category: slotInfo.category,
    affiliateCategory: slotInfo.affCat,
    affiliateProductIds: slotInfo.affIds,
    publishedDate,
    coverImage: `/images/blog/${slug}.webp`,
    author: "D Lucky X Editorial",

    // Indonesian
    title,
    metaTitle,
    metaDescription,
    keywords: [
      slotInfo.label.toLowerCase(),
      "panduan gameplay 2026",
      "tips pro player",
      "setting sensivitas",
      "strategi menang"
    ],
    readTime: "9 menit baca",
    sections: generatedSections.id,
    faq: generatedSections.faq,

    // English
    titleEn: enTitle,
    metaTitleEn: enMetaTitle,
    metaDescriptionEn: enMetaDesc,
    keywordsEn: [
      slotInfo.label.toLowerCase(),
      "pro gameplay guide 2026",
      "competitive tips",
      "optimal setup",
      "rank progression"
    ],
    readTimeEn: "9 min read",
    englishSummary,
    sectionsEn: generatedSections.en,
    faqEn: generatedSections.faqEn
  };
}

function buildGeneralSlotContent(slotIndex, title, enTitle, categoryLabel, dayNum) {
  const configs = {
    1: { // Free Fire
      s1: "Dinamika Recoil & Analisis Respon Sensitivitas di Patch 2026",
      s1Desc: `Dalam update kompetitif *Free Fire* tahun 2026, algoritma pendaftaran tembakan kepala (*headshot registration*) menuntut sinkronisasi antara **DPI layar** dan kecepatan tarikan tombol tembak. Memahami "**${title}**" memberikan keunggulan presisi saat baku tembak jarak dekat maupun menengah.`,
      s2: "Tabel Rekomendasi Angka Sensitivitas Presisi",
      points: [
        "**Lihat Sekeliling**: **95 - 100** (*Optimal untuk rotasi pandangan instan*)",
        "**Red Dot Sight**: **88 - 92** (*Akurasi tarikan drag shot jarak dekat*)",
        "**2x Scope**: **82 - 86** (*Keseimbangan tembakan senapan SMG & AR*)",
        "**4x Scope**: **76 - 80** (*Stabilitas tembakan jarak jauh tanpa goyang*)",
        "**Sniper Scope**: **50 - 55** (*Akurasi bidikan presisi AWM & M82B*)",
        "**Lihat Sekitar / Free Look**: **65 - 70** (*Pemantauan radar fleksibel*)"
      ],
      s3: "Tata Letak Tombol HUD & Ukuran Tombol Tembak Kanan",
      s3Desc: "Atur ukuran tombol tembak kanan pada kisaran **45% hingga 52%**. Posisikan sedikit lebih rendah di area kanan bawah layar untuk memberikan ruang sapuan jempol yang cukup saat melakukan tarikan ke atas (*drag shot*).",
      s4: "Teknik Eksekusi Drag Shot: Trik Huruf 'J' vs Tarikan Lurus",
      s4Desc: "Untuk senjata shotgun (**M1887**) jarak sangat dekat, gunakan teknik tarikan melengkung menyerupai **huruf 'J'**. Untuk senjata SMG (**MP40, UMP**) jarak menengah, gunakan **tarikan vertikal lurus** yang konsisten tepat saat bidikan berubah warna menjadi merah.",
      s5: "Sinergi Karakter Meta & Disiplin Rotasi Booyah",
      s5Desc: "Kombinasikan karakter aktif berkecepatan tinggi seperti **Tatsuya** atau **Alok** dengan karakter pasif penambah penetrasi seperti **Hayato** dan **Kelly** untuk memastikan setiap peluru yang mendarat menghasilkan damage maksimal.",

      // English
      s1En: "Recoil Dynamics & Sensitivity Response Analysis in the 2026 Patch",
      s1DescEn: `In the competitive 2026 Free Fire updates, headshot hit registration demands strict calibration between screen touch response and drag-button flick speeds. Mastering "${enTitle}" unlocks precision advantage in close and mid-range duels.`,
      s2En: "Recommended Precision Sensitivity Benchmark Table",
      pointsEn: [
        "**General / Look Around**: **95 - 100** (*Optimal for instant target acquisition and 360-degree swivels*)",
        "**Red Dot Sight**: **88 - 92** (*Consistent close-range drag shot headshot alignment*)",
        "**2x Scope**: **82 - 86** (*Stable recoil tracking for mid-range SMG and AR bursts*)",
        "**4x Scope**: **76 - 80** (*Zero-jitter long-range precision tapping and tracking*)",
        "**Sniper Scope**: **50 - 55** (*High-accuracy micro-adjustments for AWM and M82B rifles*)",
        "**Free Look**: **65 - 70** (*Flexible situational awareness and sprint scouting*)"
      ],
      s3En: "HUD Button Layout & Right Fire Button Sizing",
      s3DescEn: "Scale your right fire button between **45% and 52%**. Anchor it slightly lower in the bottom-right quadrant of the display to maximize thumb swipe runway for vertical drag shots.",
      s4En: "Drag Shot Mechanics: 'J-Curve' Flick vs Straight Vertical Pull",
      s4DescEn: "For close-quarters shotguns (**M1887**), employ a curved **J-shaped drag gesture**. For mid-range SMGs (**MP40, UMP**), execute a **consistent straight vertical pull** the instant your crosshair turns red on the target.",
      s5En: "Meta Character Synergies & Booyah Rotation Discipline",
      s5DescEn: "Pair active high-mobility characters like **Tatsuya** or **Alok** with passive penetration boosters like **Hayato** and **Kelly** to ensure every connecting shot deals maximum armor-piercing damage."
    },
    2: { // Roblox
      s1: "Pemahaman Mekanik Inti & Update Terkini 2026",
      s1Desc: `Dunia *Roblox* terus menghadirkan tantangan kompleks di update 2026. Melalui panduan "**${title}**", Anda akan mempelajari rute tercepat dan rahasia mekanik yang sering dilewatkan pemain biasa.`,
      s2: "Langkah Demi Langkah Menyelesaikan Objektif Utama",
      points: [
        "**Fase 1 (Persiapan)**: Pengaturan resource dan antarmuka grafis ke level optimal (*60 FPS*).",
        "**Fase 2 (Rute Tercepat)**: Memprioritaskan quest bertingkat dengan reward exp dan koin tertinggi.",
        "**Fase 3 (Item Utilitas)**: Mengoptimalkan penggunaan item utilitas untuk memangkas waktu penyelesaian hingga **50%**.",
        "**Fase 4 (Penyimpanan)**: Evaluasi hasil dan pengamanan progress akun secara aman dari bug server."
      ],
      s3: "Tier List Kemampuan & Rekomendasi Pilihan Terkuat",
      s3Desc: "Prioritaskan unit atau kemampuan yang memiliki sinergi area (**AoE**) dan mobilitas tinggi. Di update terbaru, kemampuan dengan efek *crowd control* memberikan keuntungan mutlak di server kompetitif.",
      s4: "Trik Rahasia & Mekanisme Efisiensi Grinding Cepat",
      s4Desc: "Manfaatkan siklus *spawn server* dan waktu reset harian. Bermain di *private server* atau bersama rekan guild terbukti melipatgandakan kecepatan perolehan item langka secara terukur.",
      s5: "Kesalahan Fatal Pemula & Cara Menghindarinya",
      s5Desc: "Jangan membuang koin atau Robux pada gacha tier bawah di awal permainan. Fokuskan investasi resource pada pilar utama yang meningkatkan efisiensi jangka panjang.",

      // English
      s1En: "Core Mechanical Systems & Latest 2026 Meta Landscape",
      s1DescEn: `Roblox continues to deliver intricate game mechanics in 2026. This comprehensive guide on "${enTitle}" covers optimal pathing and mechanics that casual players frequently overlook.`,
      s2En: "Step-by-Step Blueprint to Clear Primary Objectives",
      pointsEn: [
        "**Phase 1 (Setup)**: Calibrate graphics fidelity and network settings for steady 60 FPS performance.",
        "**Phase 2 (Fast Routing)**: Prioritize tiered quests yielding the highest EXP and currency payout.",
        "**Phase 3 (Utility Items)**: Maximize utility item rotations to cut completion time by up to 50%.",
        "**Phase 4 (Safeguarding)**: Verify milestone save points and secure account progress against server disconnects."
      ],
      s3En: "Ability Tier List & High-Impact Selection Matrix",
      s3DescEn: "Prioritize abilities and units offering large Area-of-Effect (**AoE**) coverage and agile repositioning. In recent balance updates, reliable crowd-control tools dictate match outcomes in competitive servers.",
      s4En: "Secret Farming Tricks & Maximum Grinding Efficiency",
      s4DescEn: "Capitalize on server spawn cycles and daily reset windows. Playing on private servers or coordinating with guild partners consistently accelerates rare item drop rates.",
      s5En: "Frequent Beginner Traps & How to Avoid Them",
      s5DescEn: "Avoid spending valuable currency or Robux on low-tier starter rolls. Focus investments on permanent upgrades that multiply long-term progression speed."
    },
    3: { // Minecraft
      s1: "Mekanika Sistem & Aturan Spawn yang Bekerja di Balik Layar",
      s1Desc: `Dalam pembaruan *Minecraft* terbaru, memahami koordinat presisi dan mekanika *tick rate* adalah fondasi utama keberhasilan. Panduan "**${title}**" menyajikan langkah teruji untuk memaksimalkan hasil dunia survival Anda.`,
      s2: "Daftar Bahan & Peralatan yang Wajib Disiapkan",
      points: [
        "Peralatan utama dengan enchant minimal **Unbreaking III** dan **Mending**.",
        "Blok bangunan non-flammable (**Cobblestone / Stone Bricks**) dalam jumlah memadai.",
        "Komponen redstone: **Repeater**, **Comparator**, **Observer**, dan **Piston** sesuai kebutuhan desain.",
        "Ember air dan lava untuk mekanisme pergerakan mob atau pemusnahan otomatis."
      ],
      s3: "Tutorial Eksekusi Tahap Demi Tahap",
      s3Desc: "Mulai dari penentuan chunk perbatasan (`F3 + G`), penggalian area aman, pemasangan komponen penampung hopper, hingga pengujian jalur mob. Pastikan seluruh area gelap di sekitar radius **128 blok** telah diberi penerangan.",
      s4: "Tips Troubleshooting & Efisiensi Maksimal",
      s4Desc: "Jika mekanisme tidak berjalan sesuai harapan, periksa arah hadap **Observer** dan pastikan tidak ada mob cap yang tersumbat di gua-gua bawah tanah sekitar fasilitas Anda.",
      s5: "Variasi Desain & Peningkatan Keamanan Fasilitas",
      s5Desc: "Tambahkan sistem alarm lampu redstone dan pintu otomatis anti-creeper untuk menjaga kelangsungan fasilitas jangka panjang.",

      // English
      s1En: "Underlying System Mechanics & Spawn Conditions",
      s1DescEn: `In modern Minecraft updates, understanding exact coordinate systems and tick rate mechanics forms the bedrock of survival mastery. This guide on "${enTitle}" provides proven steps to maximize your survival world productivity.`,
      s2En: "Essential Materials & Equipment Checklist",
      pointsEn: [
        "Primary gear enchanted with at least **Unbreaking III** and **Mending**.",
        "Adequate supply of non-flammable solid building blocks (**Cobblestone / Stone Bricks**).",
        "Modular redstone components: **Repeaters**, **Comparators**, **Observers**, and **Pistons** configured to build specs.",
        "Water and lava buckets for automated mob transport streams or disposal pits."
      ],
      s3En: "Step-by-Step Construction & Setup Walkthrough",
      s3DescEn: "Begin by identifying chunk borders (`F3 + G`), excavating safety zones, installing hopper storage collection arrays, and routing mob pathways. Ensure all dark zones within a 128-block radius are illuminated.",
      s4En: "Troubleshooting Tips & Efficiency Maximization",
      s4DescEn: "If mechanisms behave unexpectedly, verify **Observer** facing directions and ensure subterranean caves within your simulation distance are not bottlenecking the local mob cap.",
      s5En: "Architectural Variations & Long-Term Facility Security",
      s5DescEn: "Incorporate redstone indicator lamps and automated blast-resistant iron doors to safeguard your automated installations over extended playthroughs."
    },
    4: { // Genshin & Honkai
      s1: "Analisis Reaksi Elemen & Prioritas Sinergi Karakter",
      s1Desc: `Tantangan endgame *Spiral Abyss* dan *Memory of Chaos* di tahun 2026 menuntut pemahaman mendalam tentang teori reaksi elemen dan kalkulasi *internal cooldown* (ICD). Ulasan "**${title}**" merinci komposisi tim paling solid.`,
      s2: "Pilihan Senjata / Light Cone Terbaik (F2P & Bintang 5)",
      points: [
        "**Opsi Senjata Utama**: Memberikan peningkatan stat kritis dan multiplier damage tertinggi.",
        "**Alternatif F2P Terbaik**: Senjata craftable atau hadiah event dengan pasif regenerasi energi (*Energy Recharge*) konsisten.",
        "**Opsi Pendukung Tim**: Senjata yang memberikan buff attack persentase atau *Elemental Mastery* ke seluruh party."
      ],
      s3: "Set Artefak / Relic & Rasio Stat Emas",
      s3Desc: "Jaga rasio **Crit Rate : Crit Damage** pada proporsi emas **1:2** (minimal **60% Crit Rate : 120% Crit Damage**). Pastikan ambang batas **Energy Recharge** terpenuhi agar rotasi Burst dapat dieksekusi setiap siklus tanpa jeda.",
      s4: "Urutan Rotasi Skill Tim Tanpa Jeda",
      s4Desc: "Mulai dari penyalaan shield atau buff pendukung, aplikasikan elemen pemicu, lalu masuki fase carry utama untuk menghabiskan durasi burst saat seluruh buff tim sedang mencapai puncaknya.",
      s5: "Strategi Menghadapi Boss & Optimalisasi Waktu",
      s5Desc: "Kenali pola serangan boss lantai 12 dan manfaatkan *iframe* saat melepaskan Ultimate untuk menghindari serangan mematikan tanpa kehilangan momentum damage.",

      // English
      s1En: "Elemental Reaction Dynamics & Character Synergy Priority",
      s1DescEn: `High-level endgame challenges in Spiral Abyss and Memory of Chaos demand a deep grasp of elemental gauge theory and Internal Cooldown (ICD) mechanics. This analysis on "${enTitle}" details optimal team synergy.`,
      s2En: "Top Weapon & Light Cone Selections (F2P & 5-Star Options)",
      pointsEn: [
        "**Best-in-Slot Premium Options**: Maximize critical multipliers and unique talent scaling bonuses.",
        "**Top F2P Craftable Alternatives**: Readily accessible weapons providing reliable Energy Recharge and burst cycling.",
        "**Team Utility Support Options**: Weapons that bestow party-wide Attack percentage or Elemental Mastery buffs."
      ],
      s3En: "Artifact / Relic Sets & The Golden Stat Ratio",
      s3DescEn: "Maintain a strict **1:2 Crit Rate to Crit Damage ratio** (aiming for at least 60% Crit Rate to 120% Crit Damage). Ensure Energy Recharge thresholds are met so team burst rotations cycle seamlessly without downtime.",
      s4En: "Seamless Team Ability Rotation Sequencing",
      s4DescEn: "Begin by activating defensive shields and off-field buffs, apply enabling aura elements, and enter your main carry phase to maximize damage output while all team buffs remain active.",
      s5En: "Boss Encounter Strategies & Execution Windows",
      s5DescEn: "Learn Floor 12 boss telegraph animations and exploit burst animation iframes to shrug off lethal incoming attacks without compromising offensive tempo."
    },
    5: { // EA FC & eFootball
      s1: "Filosofi Formasi & Meta Taktik Pertandingan 2026",
      s1Desc: `Dinamika gameplay sepak bola mobile menuntut keseimbangan antara garis pertahanan kompak dan transisi cepat. Panduan "**${title}**" menyajikan instruksi taktik teruji untuk mengamankan kemenangan beruntun.`,
      s2: "Kriteria Atribut Pemain per Posisi Kunci",
      points: [
        "**Bek Tengah (CB)**: Prioritaskan atribut **Pace di atas 85** dan **Defensive Awareness tinggi**.",
        "**Gelandang Bertahan (CDM)**: Wajib memiliki work rate **High/High** dan stamina prima untuk menutup ruang umpan.",
        "**Sayap (Winger)**: Kecepatan akselerasi tinggi dengan kemampuan crossing atau *finesse shot* akurat.",
        "**Penyerang (ST)**: Finishing tajam dengan keunggulan fisik atau *skill moves* bintang 4 ke atas."
      ],
      s3: "Trik Eksekusi Skill Moves & Akurasi Tembakan",
      s3Desc: "Gunakan **Driven Ground Pass** untuk memecah garis pressing lawan. Saat berada di sudut kotak penalti, manfaatkan **Finesse Shot** melengkung dengan power terukur **60-70%**.",
      s4: "Taktik Bertahan Disiplin: Jockeying & Menutup Jalur Umpan",
      s4Desc: "Hindari menekan tombol sprint saat melakukan tekel satu lawan satu. Tahan tombol **Jockey** untuk membayangi arah lari penyerang lawan dan tunggu momen yang tepat untuk intersep bola.",
      s5: "Manajemen Stamina & Pergantian Pemain Babak Kedua",
      s5Desc: "Lakukan pergantian pemain sayap pada **menit ke-60**. Memasukkan penyerang segar melawan bek lawan yang sudah lelah adalah kunci mencetak gol kemenangan di menit akhir.",

      // English
      s1En: "Tactical Philosophy & 2026 Competitive Formation Meta",
      s1DescEn: `Mobile football requires harmony between compact defensive structures and rapid counter-attacking transitions. This breakdown on "${enTitle}" provides tested instructions to build consistent winning streaks.`,
      s2En: "Key Player Attribute Benchmarks by Position",
      pointsEn: [
        "**Center Backs (CB)**: Prioritize **Pace above 85** paired with elite Defensive Awareness and Physicality.",
        "**Defensive Midfielders (CDM)**: Require **High/High work rates** and high stamina reserves to intercept passing lanes.",
        "**Wingers (LM/RM/LW/RW)**: Explosive acceleration combined with pinpoint crossing or finesse shot traits.",
        "**Strikers (ST)**: Clinical finishing stats paired with physical strength or 4-star+ skill moves."
      ],
      s3En: "Skill Move Mechanics & Shooting Accuracy",
      s3DescEn: "Use **Driven Ground Passes** to slice through defensive pressing lines. When opening angles at the edge of the penalty box, trigger curved **Finesse Shots** with 60-70% power calibration.",
      s4En: "Disciplined Defensive Play: Jockeying & Lane Interceptions",
      s4DescEn: "Avoid holding sprint during 1v1 defensive engagements. Hold the **Jockey button** to mirror the attacker's trajectory and time your tackle when the ball is pushed forward.",
      s5En: "Stamina Management & Decisive Second-Half Substitutions",
      s5DescEn: "Make decisive wing substitutions around the **60th minute**. Introducing fresh, pacey attackers against fatigued opposition fullbacks is the premier key to late winning goals."
    },
    6: { // Battle Royale
      s1: "Analisis Medan Tempur & Kontrol Recoil Senjata Meta",
      s1Desc: `Dalam pertempuran sengit Battle Royale tahun 2026, penguasaan recoil dan pengambilan keputusan posisi compound adalah penentu gelar juara. Ulasan "**${title}**" mengupas rahasia bermain pro secara mendalam.`,
      s2: "Konfigurasi Sensitivitas Kamera & Sensor Gyroscope",
      points: [
        "**Third Person No Scope**: **300% - 350%** (*Responsivitas gerak lincah jarak dekat*)",
        "**Red Dot & Holographic**: **280% - 320%** (*Akurasi semprotan tembakan 20-50 meter*)",
        "**2x Scope**: **220% - 250%** (*Stabilitas bidikan jarak menengah*)",
        "**3x Scope (Ubah dari 6x)**: **180% - 210%** (*Kombinasi laser spray paling stabil pada M416*)",
        "**4x Scope**: **160% - 190%** (*Penembak DMR semi-otomatis*)"
      ],
      s3: "Trik Adu Tembak Jarak Dekat (Close Combat)",
      s3Desc: "Gunakan gerakan **jiggle kiri-kanan** cepat dipadukan dengan teknik crouch mendadak saat bertatapan muka. Jangan membidik lewat scope pada jarak di bawah **5 meter**; prioritaskan **hip-fire akurat**.",
      s4: "Taktik Rotasi Zona & Memilih Compound Terbaik",
      s4Desc: "Selalu prioritaskan kendaraan roda empat untuk mobilitas dan perlindungan darurat. Rotasi lewat sisi terluar zona (*edge playing*) sering kali lebih aman daripada menerobos langsung ke pusat peta.",
      s5: "Manajemen Utilitas: Smoke Grenade & Molotov Penyelamat",
      s5Desc: "Bawa minimal **4 hingga 5 granat asap** (*smoke grenade*) untuk fase zona akhir. Asap bukan hanya untuk menyelamatkan rekan yang tumbang, melainkan jembatan rotasi melintasi padang terbuka.",

      // English
      s1En: "Terrain Analysis & Meta Weapon Recoil Control",
      s1DescEn: `In high-stakes Battle Royale lobbies, recoil mastery and compound selection decide match winners. This guide on "${enTitle}" breaks down top-tier positioning and shooting discipline.`,
      s2En: "Camera Sensitivity & Gyroscope Calibration Benchmarks",
      pointsEn: [
        "**Third Person No Scope**: **300% - 350%** (*Snappy close-quarters hipfire flicking and tracking*)",
        "**Red Dot & Holographic**: **280% - 320%** (*High-accuracy 20-50m spray transfer control*)",
        "**2x Scope**: **220% - 250%** (*Mid-range automatic spray stabilization*)",
        "**3x Scope (Adjusted from 6x)**: **180% - 210%** (*Laser-accurate long-range M416 spray tracking*)",
        "**4x Scope**: **160% - 190%** (*Semi-automatic DMR precision tap shooting*)"
      ],
      s3En: "Close-Quarters Combat (CQC) Techniques",
      s3DescEn: "Employ rapid **left-right jiggle movements** combined with sudden crouch taps in face-to-face duels. Do not open scopes at distances under 5 meters; prioritize tight **hip-fire spread**.",
      s4En: "Blue Zone Rotation Strategy & Compound Prioritization",
      s4DescEn: "Always secure 4-wheeled vehicles for emergency mobile cover and rapid transit. Playing along the outer edge of the safe zone often proves significantly safer than driving into crowded map centers.",
      s5En: "Utility Economy: Smoke Grenades & Molotov Denial",
      s5DescEn: "Carry at least **4 to 5 smoke grenades** into final zones. Smokes serve not just to revive fallen teammates, but to build visual walls across open fields."
    },
    7: { // Gaming Gear & Hardware
      s1: "Mengapa Performa Hardware Membatasi Potensi Gameplay Anda",
      s1Desc: `Banyak gamer merasa kemampuan mekaniknya menurun padahal penyebab aslinya adalah pelambatan perangkat keras (*thermal throttling*). Panduan "**${title}**" mengulas cara menjaga kestabilan sistem pada performa puncak.`,
      s2: "Optimasi Pengaturan Sistem & Refresh Rate Layar",
      points: [
        "Kunci layar pada **90Hz atau 120Hz** di menu tampilan untuk animasi gerakan ultra mulus.",
        "Aktifkan mode **Touch Sampling Rate** tertinggi di aplikasi game turbo bawaan ponsel.",
        "Atur skala animasi jendela di menu Opsi Pengembang ke angka **0.5x** untuk respons kilat.",
        "Batasi proses latar belakang agar seluruh alokasi RAM dan CPU fokus pada game utama."
      ],
      s3: "Mengatasi Panas Berlebih: Manajemen Suhu Chipset",
      s3Desc: "Saat suhu baterai melewati **42°C**, sistem operasi akan secara otomatis memangkas clock speed prosesor (*throttling*), memicu *drop frame* drastis. Penggunaan pendingin aktif (*phone cooler*) menjaga performa tetap stabil di **60/120 FPS konstan**.",
      s4: "Menghilangkan Hambatan Fisik: Sentuhan & Latensi Audio",
      s4Desc: "Keringat mikro pada jari menciptakan hambatan gesek yang membuat sapuan layar meleset. Perlengkapan seperti **sarung jari serat perak** (*finger sleeves*) dan **TWS berlatensi rendah** memangkas jeda audio-visual hingga mendekati nol.",
      s5: "Kebiasaan Sehat untuk Umur Baterai Smartphone",
      s5Desc: "Hindari bermain game berat saat ponsel sedang diisi daya dengan adaptor biasa. Gunakan fitur **bypass charging** jika tersedia untuk mengalirkan daya langsung ke motherboard tanpa memanaskan baterai.",

      // English
      s1En: "Why Hardware Limitations Bottle-Neck Your Gameplay Potential",
      s1DescEn: `Many mobile gamers blame mechanical skill for missed plays when the real culprit is processor thermal throttling. This guide on "${enTitle}" explains how to sustain peak system stability.`,
      s2En: "Display Refresh Rate & System Settings Optimization",
      pointsEn: [
        "Lock screen refresh rate to **90Hz or 120Hz** in display settings for buttery-smooth visual tracking.",
        "Activate maximum **Touch Sampling Rate** inside your device's built-in gaming assistant app.",
        "Set window and transition animation scales to **0.5x** in Developer Options for snappier UI response.",
        "Restrict background processes so memory and CPU clock cycles remain dedicated to your active game."
      ],
      s3En: "Tackling Overheating: Thermal Management for Mobile Chipsets",
      s3DescEn: "When battery temperature climbs past **42°C**, the OS throttles processor clock speeds, causing severe frame drops. Attaching an active **semiconductor phone cooler** maintains smooth **60 or 120 FPS** performance.",
      s4En: "Eliminating Physical Friction: Touch & Audio Latency",
      s4DescEn: "Micro-sweat creates skin drag that causes touch inputs to drop or stutter. Accessories like **silver-fiber finger sleeves** and **low-latency gaming TWS earbuds** eliminate tactile resistance and audio delay.",
      s5En: "Battery Health Practices for Intensive Gaming",
      s5DescEn: "Avoid running demanding games while fast-charging from standard adapters. Use **bypass charging** features whenever available to power the motherboard directly without heating the battery cell."
    },
    8: { // Kids Tech & Learning
      s1: "Prinsip Edukasi Digital Sehat untuk Anak di Era Modern",
      s1Desc: `Teknologi dapat menjadi sarana stimulasi kognitif yang luar biasa jika didampingi dengan metode yang tepat. Pembahasan "**${title}**" merangkum pendekatan terarah bagi orang tua cerdas.`,
      s2: "Langkah Mengubah Layar Menjadi Media Belajar Interaktif",
      points: [
        "Pilih aplikasi yang melibatkan **interaksi aktif** (*menyentuh, memecahkan teka-teki, meniru bunyi*).",
        "Tetapkan batas waktu harian terstruktur: **30 hingga 60 menit per sesi**.",
        "Dampingi anak secara langsung untuk mendiskusikan apa yang dilihat di layar (*co-viewing*).",
        "Kombinasikan materi digital dengan aktivitas fisik nyata seperti menggambar atau menyusun balok."
      ],
      s3: "Fitur Keamanan & Perlindungan Privasi Anak di Android",
      s3Desc: "Gunakan fitur **Pin Screen (Sematkan Aplikasi)** agar anak tidak dapat keluar dari aplikasi belajar tanpa izin, dan aktifkan batasan waktu otomatis melalui **Google Family Link**.",
      s4: "Tips Pendampingan Belajar Bersama Tanpa Tantrum",
      s4Desc: "Beri peringatan waktu **5 menit sebelum durasi layar berakhir**. Pengalihan perhatian ke aktivitas fisik yang menyenangkan terbukti efektif mencegah rasa frustrasi saat tablet dimatikan.",
      s5: "Memilih Perangkat yang Aman & Ergonomis",
      s5Desc: "Gunakan casing berbahan **busa EVA tahan banting** dan aktifkan fitur pelindung mata (**Eye Comfort Shield**) untuk menyaring radiasi cahaya biru yang dapat mengganggu pola tidur anak.",

      // English
      s1En: "Healthy Digital Education Principles for Modern Children",
      s1DescEn: `Technology offers extraordinary cognitive stimulation when guided with structured methodology. This comprehensive overview on "${enTitle}" provides practical advice for mindful parents.`,
      s2En: "Transforming Screen Time into Meaningful Interactive Learning",
      pointsEn: [
        "Select applications prioritizing **active engagement** (*tracing, puzzle-solving, auditory recognition*).",
        "Establish structured daily time limits: **30 to 60 minutes per session**.",
        "Engage directly in **co-viewing and dialogue** to discuss concepts shown on the screen.",
        "Balance digital screen time with hands-on physical activities like drawing or wooden blocks."
      ],
      s3En: "Child Privacy & Safety Features on Android",
      s3DescEn: "Activate **Screen Pinning (App Pinning)** to prevent accidental app exits, and set automated daily downtime limits via **Google Family Link**.",
      s4En: "Guiding Screen Sessions Without Meltdowns",
      s4DescEn: "Provide a gentle **5-minute warning before screen time ends**. Transitioning smoothly to a fun physical activity prevents frustration when tablets are turned off.",
      s5En: "Choosing Child-Safe, Ergonomic Hardware",
      s5DescEn: "Use protective cases made of **shockproof EVA foam** and enable **Eye Comfort Shield** to filter out blue light that could disrupt natural sleep cycles."
    },
    9: { // Productivity & PDF Work
      s1: "Transformasi Alur Kerja Paperless: Cepat, Rapi & Efisien",
      s1Desc: `Era kerja digital menuntut pengelolaan dokumen yang cepat tanpa ketergantungan pada printer fisik. Ulasan "**${title}**" menyajikan solusi praktis untuk mempercepat administrasi harian.`,
      s2: "Keunggulan Keamanan: Mengapa Pengolahan Dokumen Offline Mutlak Diperlukan",
      points: [
        "**Privasi 100%**: Dokumen rahasia tidak pernah diunggah ke server pihak ketiga di cloud.",
        "**Kecepatan Instan**: Pengeditan dan penandatanganan berlangsung seketika tanpa perlu kuota internet.",
        "**Kepatuhan Hukum**: Mempertahankan keaslian format berkas dan metadata dokumen asli.",
        "**Bebas Risiko Kebocoran**: Data kartu identitas, kontrak, dan laporan keuangan tetap aman di perangkat lokal."
      ],
      s3: "Tanda Tangan Digital Presisi & Anotasi Dokumen",
      s3Desc: "Manfaatkan **stylus presisi** untuk menandatangani berkas PDF secara otentik. Pastikan garis tanda tangan memiliki resolusi tajam setara guratan pulpen fisik.",
      s4: "Kompresi Berkas Tanpa Menurunkan Keterbacaan",
      s4Desc: "Pilih metode kompresi berbasis optimasi aliran vektor (*vector stream*). Teks tetap jernih dan tajam saat diperbesar meskipun ukuran berkas berkurang hingga **70%**.",
      s5: "Tips Membangun Arsip Digital Teratur di Android",
      s5Desc: "Terapkan sistem penamaan berkas standar berbasis tanggal (`YYYY-MM-DD_NamaDokumen`) dan simpan salinan cadangan secara terenkripsi untuk kemudahan pencarian di masa depan.",

      // English
      s1En: "Paperless Workflow Transformation: Fast, Clean & Efficient",
      s1DescEn: `The digital workspace requires agile document management without relying on desktop printers. This guide on "${enTitle}" delivers practical solutions to speed up daily paperwork.`,
      s2En: "Offline Security: Why On-Device Processing is Essential",
      pointsEn: [
        "**100% Privacy**: Confidential contracts and IDs are never uploaded to remote cloud servers.",
        "**Zero Network Delay**: Edit, annotate, and sign documents instantly without Wi-Fi or data.",
        "**Legal Compliance**: Maintain authentic file structures, vector sharp resolution, and document metadata.",
        "**Zero Breach Risk**: Personal credentials, contracts, and financial ledgers stay secured on local device storage."
      ],
      s3En: "Precision Digital Signatures & Document Annotation",
      s3DescEn: "Leverage a **precision stylus** to sign PDF contracts with pen-on-paper authenticity, ensuring crisp resolution on signature lines.",
      s4En: "File Compression Without Sacrificing Readability",
      s4DescEn: "Opt for vector-stream optimization when compressing documents. Text remains sharp when zoomed while total file size shrinks by up to **70%**.",
      s5En: "Building an Organized Digital Archive on Android",
      s5DescEn: "Adopt consistent date-stamped naming conventions (`YYYY-MM-DD_DocName`) and maintain encrypted local backups for effortless searchability."
    }
  };

  const c = configs[slotIndex] || configs[1];

  return {
    id: [
      {
        id: "analisis-mendalam-dan-urgensi",
        title: `1. ${c.s1}`,
        content: [c.s1Desc, `Penerapan disiplin pada aspek ini merupakan pembeda nyata antara hasil amatir dengan performa profesional yang teruji di lapangan.`]
      },
      {
        id: "langkah-sistematis-dan-rekomendasi",
        title: `2. ${c.s2}`,
        content: [`Berikut adalah poin-poin acuan yang telah divalidasi untuk memberikan hasil optimal:`],
        bulletPoints: c.points
      },
      {
        id: "pengaturan-antarmuka-dan-tata-letak",
        title: `3. ${c.s3}`,
        content: [c.s3Desc]
      },
      {
        id: "teknik-eksekusi-dan-taktik-lapangan",
        title: `4. ${c.s4}`,
        content: [c.s4Desc]
      },
      {
        id: "sinergi-lanjutan-dan-kebiasaan-juara",
        title: `5. ${c.s5}`,
        content: [c.s5Desc]
      }
    ],
    en: [
      {
        id: "technical-meta-overview",
        title: `1. ${c.s1En}`,
        content: [
          c.s1DescEn,
          `Disciplined application of these principles directly separates inconsistent results from top-tier performance.`
        ]
      },
      {
        id: "systematic-execution-blueprint",
        title: `2. ${c.s2En}`,
        content: [`Reference these verified operational standards for consistent performance:`],
        bulletPoints: c.pointsEn
      },
      {
        id: "interface-and-layout-optimization",
        title: `3. ${c.s3En}`,
        content: [c.s3DescEn]
      },
      {
        id: "execution-tactics-and-techniques",
        title: `4. ${c.s4En}`,
        content: [c.s4DescEn]
      },
      {
        id: "advanced-synergy-and-habits",
        title: `5. ${c.s5En}`,
        content: [c.s5DescEn]
      }
    ],
    faq: [
      {
        q: `Berapa lama waktu yang dibutuhkan untuk merasakan peningkatan nyata?`,
        a: `Dengan menerapkan panduan ini secara konsisten, sebagian besar pengguna merasakan adaptasi dan peningkatan hasil dalam 2 hingga 4 hari pertama.`
      },
      {
        q: `Apakah trik ini aman digunakan pada semua tipe perangkat Android?`,
        a: `Sangat aman 100%. Semua panduan menggunakan fitur bawaan sistem resmi dan mematuhi kebijakan pengembang.`
      },
      {
        q: `Apa langkah pertama yang harus dilakukan jika hasil belum maksimal?`,
        a: `Evaluasi kembali sensitivitas dan lakukan kalibrasi bertahap di mode latihan sebelum terjun ke pertandingan kompetitif.`
      }
    ],
    faqEn: [
      {
        q: `How quickly can noticeable improvements be expected?`,
        a: `By following this guide consistently, most users experience measurable consistency improvements within 2 to 4 days.`
      },
      {
        q: `Is this approach compatible with all modern Android smartphones?`,
        a: `Yes, 100%. All recommendations utilize standard built-in options and strictly follow developer guidelines.`
      },
      {
        q: `What is the first troubleshooting step if initial results feel inconsistent?`,
        a: `Re-evaluate your base sensitivities and practice progressive calibration in sandbox practice modes first.`
      }
    ]
  };
}

async function main() {
  console.log(`=== REGENERATING ALL 830 HIGH-VALUE ARTICLES WITH 100% PURE ENGLISH LOCALIZATION ===`);

  const queueDir = "src/data/articles/queue";
  if (!fs.existsSync(queueDir)) fs.mkdirSync(queueDir, { recursive: true });

  const slotFiles = [
    { key: 0, file: "mlbb-queue.ts", varName: "mlbbQueueArticles" },
    { key: 1, file: "freefire-queue.ts", varName: "freefireQueueArticles" },
    { key: 2, file: "roblox-queue.ts", varName: "robloxQueueArticles" },
    { key: 3, file: "minecraft-queue.ts", varName: "minecraftQueueArticles" },
    { key: 4, file: "genshin-queue.ts", varName: "genshinQueueArticles" },
    { key: 5, file: "eafc-queue.ts", varName: "eafcQueueArticles" },
    { key: 6, file: "battleroyale-queue.ts", varName: "battleroyaleQueueArticles" },
    { key: 7, file: "gear-queue.ts", varName: "gearQueueArticles" },
    { key: 8, file: "kidstech-queue.ts", varName: "kidstechQueueArticles" },
    { key: 9, file: "productivity-queue.ts", varName: "productivityQueueArticles" },
  ];

  let totalGenerated = 0;

  // Track all published articles across slots
  const publishedArticlesBySlug = new Map();

  for (let s = 0; s < SLOTS.length; s++) {
    const slotInfo = SLOTS[s];
    const slotConfig = slotFiles[s];
    console.log(`\nGenerating Slot ${s + 1}/10: ${slotInfo.label} (${TOTAL_DAYS} articles)...`);

    const articles = [];
    // Day 0 & Day 1 for slots 0-1 (MLBB, Free Fire) are published into published-gaming.ts.
    // Day 0 for slots 2-9 are published into published-gaming.ts.
    const startDay = (s <= 1) ? 2 : 1;

    // Always generate published days to store in publishedArticlesBySlug for published-gaming update
    const pubDays = (s <= 1) ? [0, 1] : [0];
    for (const pDay of pubDays) {
      const pTopicInfo = getTopicForDay(s, pDay);
      const pArticle = buildDeepArticleItem(pTopicInfo, slotInfo, pDay);
      await generateCoverImage(pArticle.slug, pArticle.title, slotInfo.label, slotInfo.color);
      publishedArticlesBySlug.set(pArticle.slug, pArticle);
    }

    for (let day = startDay; day < TOTAL_DAYS; day++) {
      const topicInfo = getTopicForDay(s, day);
      const article = buildDeepArticleItem(topicInfo, slotInfo, day);

      await generateCoverImage(article.slug, article.title, slotInfo.label, slotInfo.color);
      articles.push(article);
      totalGenerated++;
      if (day % 10 === 0) process.stdout.write(`${day + 1}`);
      else process.stdout.write(".");
    }

    // Write queue file
    const content = `import { ArticleItem } from "../types";\n\nexport const ${slotConfig.varName}: ArticleItem[] = ${JSON.stringify(articles, null, 2)};\n`;
    fs.writeFileSync(path.join(queueDir, slotConfig.file), content);
    console.log(`\nSaved ${slotConfig.file} (${articles.length} articles)`);
  }

  // Update published-gaming.ts: preserve handcrafted Article 0, and update any Day 0 articles
  const publishedPath = "src/data/articles/published-gaming.ts";
  if (fs.existsSync(publishedPath)) {
    console.log("\nUpdating published articles in published-gaming.ts with 100% English fields...");

    const code = fs.readFileSync(publishedPath, "utf8");
    const result = ts.transpileModule(code, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    const m = { exports: {} };
    const fn = new Function("module", "exports", "require", result.outputText);
    fn(m, m.exports, () => ({}));
    const publishedGamingArticles = m.exports.publishedGamingArticles || [];

    const updatedPublished = publishedGamingArticles.map(art => {
      const cleanSlug = art.slug.replace(/-+$/, "");
      for (const [sKey, repl] of publishedArticlesBySlug.entries()) {
        if (art.slug === sKey || cleanSlug === sKey.replace(/-+$/, "")) {
          console.log(`  Updating published article: ${art.slug}`);
          return {
            ...repl,
            slug: art.slug,
            coverImage: art.coverImage,
            publishedDate: art.publishedDate
          };
        }
      }
      return art;
    });

    const pubContent = `import { ArticleItem } from "./types";\n\nexport const publishedGamingArticles: ArticleItem[] = ${JSON.stringify(updatedPublished, null, 2)};\n`;
    fs.writeFileSync(publishedPath, pubContent);
    console.log(`Updated ${publishedPath} successfully (Total published: ${updatedPublished.length})!`);
  }

  console.log(`\n🎉 SUCCESS: All ${totalGenerated} articles generated with 100% pure English localization!`);
}

main().catch(console.error);
