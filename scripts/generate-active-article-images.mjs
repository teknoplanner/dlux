import fs from "fs";
import path from "path";
import sharp from "sharp";

const blogDir = "public/images/blog";
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Helper to generate full-canvas SVG artwork with NO text
// Canvas size: 1200 x 630

const illustrations = {
  // === AMAZON HARDWARE BUYER GUIDES ===
  "aksesoris-mobile-gaming-terbaik-2026-controller-cooler-finger-sleeves-earbuds": `
    <defs>
      <linearGradient id="bg_gear" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>
      <radialGradient id="fan_glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="blade_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg_gear)" />
    <!-- Ambient ambient glow -->
    <circle cx="600" cy="315" r="300" fill="#6366f1" opacity="0.15" />
    <circle cx="300" cy="315" r="220" fill="#38bdf8" opacity="0.12" />
    <circle cx="900" cy="315" r="220" fill="#ec4899" opacity="0.12" />

    <!-- Grid lines -->
    <g stroke="#334155" stroke-width="1" opacity="0.25">
      <line x1="0" y1="150" x2="1200" y2="150" stroke-dasharray="8 8" />
      <line x1="0" y1="315" x2="1200" y2="315" stroke-dasharray="8 8" />
      <line x1="0" y1="480" x2="1200" y2="480" stroke-dasharray="8 8" />
      <line x1="300" y1="0" x2="300" y2="630" stroke-dasharray="8 8" />
      <line x1="600" y1="0" x2="600" y2="630" stroke-dasharray="8 8" />
      <line x1="900" y1="0" x2="900" y2="630" stroke-dasharray="8 8" />
    </g>

    <!-- Centerpiece: Smartphone with Active Gaming Controller Mount -->
    <!-- Left Controller Grip -->
    <path d="M 240 180 C 200 180, 160 220, 160 300 C 160 380, 200 440, 250 440 L 320 440 L 320 180 Z" fill="#1e293b" stroke="#475569" stroke-width="4"/>
    <circle cx="230" cy="260" r="32" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
    <circle cx="230" cy="260" r="16" fill="#38bdf8"/>
    <!-- D-Pad -->
    <rect x="215" y="330" width="30" height="70" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
    <rect x="195" y="350" width="70" height="30" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>

    <!-- Right Controller Grip -->
    <path d="M 960 180 C 1000 180, 1040 220, 1040 300 C 1040 380, 1000 440, 950 440 L 880 440 L 880 180 Z" fill="#1e293b" stroke="#475569" stroke-width="4"/>
    <!-- Action Buttons XYAB -->
    <circle cx="970" cy="235" r="14" fill="#ef4444"/>
    <circle cx="940" cy="265" r="14" fill="#3b82f6"/>
    <circle cx="1000" cy="265" r="14" fill="#eab308"/>
    <circle cx="970" cy="295" r="14" fill="#10b981"/>
    <!-- Right Joystick -->
    <circle cx="950" cy="365" r="30" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
    <circle cx="950" cy="365" r="15" fill="#a855f7"/>

    <!-- Smartphone Body in Landscape -->
    <rect x="310" y="160" width="580" height="300" rx="28" fill="#020617" stroke="#38bdf8" stroke-width="4"/>
    <!-- Screen Bezel Area -->
    <rect x="330" y="180" width="540" height="260" rx="18" fill="#030712"/>
    
    <!-- Phone Cooler on the Center (Overlay Fan) -->
    <circle cx="600" cy="310" r="110" fill="#0f172a" stroke="#38bdf8" stroke-width="6"/>
    <circle cx="600" cy="310" r="110" fill="url(#fan_glow)" />
    <circle cx="600" cy="310" r="95" fill="none" stroke="#1e293b" stroke-width="8" stroke-dasharray="6,4"/>
    <!-- Fan Turbofan Blades -->
    <g transform="translate(600, 310)">
      <path d="M 0 0 Q 30 -60 10 -85 Q -10 -65 0 0" fill="url(#blade_grad)"/>
      <path d="M 0 0 Q 65 -30 85 -10 Q 65 10 0 0" fill="url(#blade_grad)"/>
      <path d="M 0 0 Q 60 30 50 75 Q 30 65 0 0" fill="url(#blade_grad)"/>
      <path d="M 0 0 Q -10 65 -30 80 Q -40 55 0 0" fill="url(#blade_grad)"/>
      <path d="M 0 0 Q -65 20 -80 0 Q -60 -20 0 0" fill="url(#blade_grad)"/>
      <path d="M 0 0 Q -50 -50 -30 -75 Q -10 -55 0 0" fill="url(#blade_grad)"/>
      <circle cx="0" cy="0" r="28" fill="#082f49" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="0" cy="0" r="12" fill="#38bdf8"/>
    </g>

    <!-- Gaming TWS Earbuds Floating Top Left & Right -->
    <g transform="translate(130, 80)">
      <ellipse cx="60" cy="50" rx="25" ry="35" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <path d="M 60 85 L 60 130" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
      <circle cx="60" cy="50" r="8" fill="#38bdf8"/>
    </g>
    <g transform="translate(1010, 80)">
      <ellipse cx="60" cy="50" rx="25" ry="35" fill="#0f172a" stroke="#ec4899" stroke-width="3"/>
      <path d="M 60 85 L 60 130" stroke="#ec4899" stroke-width="8" stroke-linecap="round"/>
      <circle cx="60" cy="50" r="8" fill="#ec4899"/>
    </g>
  `,

  "tablet-edukasi-anak-stylus-pen-casing-tahan-banting-terbaik-2026": `
    <defs>
      <linearGradient id="bg_kids_tab" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e1b4b" />
        <stop offset="100%" stop-color="#312e81" />
      </linearGradient>
      <linearGradient id="screen_art" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#818cf8" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg_kids_tab)" />
    
    <!-- Playful shapes in background -->
    <circle cx="200" cy="180" r="120" fill="#f43f5e" opacity="0.15" />
    <circle cx="1020" cy="450" r="150" fill="#38bdf8" opacity="0.18" />
    <circle cx="980" cy="150" r="90" fill="#facc15" opacity="0.15" />

    <!-- Big Kids Rugged Tablet with Thick Foam Bumper Case -->
    <!-- Shockproof Outer Bumper Case (Sky Blue EVA Foam) -->
    <rect x="260" y="80" width="680" height="470" rx="55" fill="#0284c7" stroke="#38bdf8" stroke-width="8"/>
    <!-- Top Carry Handle Grip Hole -->
    <rect x="500" y="95" width="200" height="36" rx="18" fill="#0f172a" stroke="#0369a1" stroke-width="3"/>
    
    <!-- Tablet Screen Glass Bezel -->
    <rect x="310" y="145" width="580" height="375" rx="28" fill="#0f172a"/>
    <!-- Screen Active Display -->
    <rect x="330" y="165" width="540" height="335" rx="20" fill="url(#screen_art)"/>
    
    <!-- Screen Drawing Content: Sun, Rainbow, Alphabet blocks -->
    <circle cx="780" cy="230" r="45" fill="#fef08a" stroke="#facc15" stroke-width="4"/>
    <!-- Rainbow Arcs -->
    <path d="M 370 420 A 180 180 0 0 1 730 420" fill="none" stroke="#f43f5e" stroke-width="14"/>
    <path d="M 390 420 A 160 160 0 0 1 710 420" fill="none" stroke="#fb923c" stroke-width="14"/>
    <path d="M 410 420 A 140 140 0 0 1 690 420" fill="none" stroke="#facc15" stroke-width="14"/>
    <path d="M 430 420 A 120 120 0 0 1 670 420" fill="none" stroke="#4ade80" stroke-width="14"/>
    
    <!-- Floating Kids Chunky Stylus Pen -->
    <g transform="translate(850, 220) rotate(-35)">
      <rect x="0" y="0" width="46" height="220" rx="23" fill="#f43f5e" stroke="#ffffff" stroke-width="4"/>
      <path d="M 0 200 L 23 260 L 46 200 Z" fill="#fb7185"/>
      <circle cx="23" cy="260" r="10" fill="#38bdf8"/>
      <!-- Soft Grip Rings -->
      <line x1="8" y1="80" x2="38" y2="80" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <line x1="8" y1="110" x2="38" y2="110" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <line x1="8" y1="140" x2="38" y2="140" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- ABC Wood Blocks Floating on Left -->
    <g transform="translate(130, 320)">
      <rect x="0" y="0" width="85" height="85" rx="18" fill="#facc15" stroke="#ca8a04" stroke-width="4"/>
      <text x="42" y="60" font-family="sans-serif" font-weight="900" font-size="52" fill="#713f12" text-anchor="middle">A</text>
    </g>
    <g transform="translate(180, 420)">
      <rect x="0" y="0" width="85" height="85" rx="18" fill="#4ade80" stroke="#16a34a" stroke-width="4"/>
      <text x="42" y="60" font-family="sans-serif" font-weight="900" font-size="52" fill="#14532d" text-anchor="middle">B</text>
    </g>
  `,

  "stylus-pen-presisi-pelindung-layar-tekstur-kertas-edit-pdf-android": `
    <defs>
      <linearGradient id="bg_paper" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg_paper)" />

    <!-- Matte Texture Hatching (Paper-Feel Film Illustration) -->
    <g stroke="#38bdf8" stroke-width="1" opacity="0.12">
      <line x1="200" y1="0" x2="600" y2="630" />
      <line x1="300" y1="0" x2="700" y2="630" />
      <line x1="400" y1="0" x2="800" y2="630" />
      <line x1="500" y1="0" x2="900" y2="630" />
      <line x1="600" y1="0" x2="1000" y2="630" />
      <line x1="700" y1="0" x2="1100" y2="630" />
    </g>

    <!-- Large Sleek Tablet in Center Perspective -->
    <rect x="280" y="70" width="640" height="490" rx="36" fill="#0f172a" stroke="#475569" stroke-width="5"/>
    <rect x="310" y="100" width="580" height="430" rx="24" fill="#f8fafc"/>

    <!-- Document Page on Tablet -->
    <!-- Top Document Header Bar -->
    <rect x="350" y="140" width="160" height="24" rx="6" fill="#0284c7"/>
    <rect x="350" y="180" width="480" height="12" rx="4" fill="#cbd5e1"/>
    <rect x="350" y="210" width="500" height="12" rx="4" fill="#cbd5e1"/>
    <rect x="350" y="240" width="460" height="12" rx="4" fill="#cbd5e1"/>
    <rect x="350" y="270" width="420" height="12" rx="4" fill="#cbd5e1"/>
    
    <!-- PDF Document Signature Field Box -->
    <rect x="350" y="330" width="500" height="130" rx="12" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,6"/>
    <!-- Drawn Signature Line -->
    <path d="M 380 400 Q 430 350 470 410 T 540 390 T 600 420 T 660 380 T 720 410" fill="none" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
    
    <!-- Precision Stylus Pen Gliding on Signature Line -->
    <g transform="translate(670, 160) rotate(32)">
      <!-- Pen Body -->
      <rect x="0" y="0" width="24" height="280" rx="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <rect x="0" y="220" width="24" height="40" fill="#0f172a"/>
      <!-- Copper / Disc Precision Tip -->
      <path d="M 0 280 L 12 320 L 24 280 Z" fill="#cbd5e1"/>
      <circle cx="12" cy="320" r="4" fill="#38bdf8"/>
      <!-- Glow Contact Point -->
      <circle cx="12" cy="320" r="14" fill="#38bdf8" opacity="0.5"/>
    </g>

    <!-- Side Paper Texture Peel Angle -->
    <path d="M 850 100 L 890 140 L 850 140 Z" fill="#94a3b8"/>
  `,
};

// Generic thematic generator for other categories
function getCategoryThematicArt(slug, file) {
  if (illustrations[slug]) {
    return illustrations[slug];
  }

  // 1. OFFLINE PDF EDITOR
  if (file === "offline-pdf.ts") {
    return `
      <defs>
        <linearGradient id="bg_pdf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#031525" />
          <stop offset="60%" stop-color="#0b2447" />
          <stop offset="100%" stop-color="#19376d" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg_pdf)" />
      <circle cx="950" cy="315" r="280" fill="#0284c7" opacity="0.18" />
      <circle cx="250" cy="315" r="220" fill="#38bdf8" opacity="0.12" />

      <!-- Center Big Document Stack -->
      <g transform="translate(380, 80)">
        <!-- Back sheet 2 -->
        <rect x="60" y="40" width="380" height="460" rx="20" fill="#1e293b" stroke="#334155" stroke-width="3" opacity="0.6"/>
        <!-- Back sheet 1 -->
        <rect x="30" y="20" width="380" height="460" rx="20" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        <!-- Main sheet -->
        <rect x="0" y="0" width="380" height="460" rx="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>

        <!-- Document Lines -->
        <rect x="40" y="50" width="120" height="28" rx="6" fill="#0284c7"/>
        <line x1="40" y1="120" x2="340" y2="120" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>
        <line x1="40" y1="150" x2="310" y2="150" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>
        <line x1="40" y1="180" x2="340" y2="180" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>
        <line x1="40" y1="210" x2="280" y2="210" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>

        <!-- Lock / Privacy Shield Badge on Sheet -->
        <circle cx="190" cy="310" r="60" fill="#0284c7"/>
        <!-- Shield Vector -->
        <path d="M 190 270 Q 225 270 230 300 Q 230 340 190 355 Q 150 340 150 300 Q 155 270 190 270 Z" fill="#ffffff"/>
        <path d="M 180 310 L 188 318 L 205 300" fill="none" stroke="#0284c7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- Precision Stylus Pen Floating Right -->
      <g transform="translate(860, 200) rotate(25)">
        <rect x="0" y="0" width="26" height="260" rx="13" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
        <path d="M 0 260 L 13 300 L 26 260 Z" fill="#0284c7"/>
        <circle cx="13" cy="300" r="4" fill="#38bdf8"/>
      </g>
    `;
  }

  // 2. STICKMAN PENALTY RUSH
  if (file === "stickman-penalty.ts") {
    return `
      <defs>
        <linearGradient id="bg_soccer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#022c22" />
          <stop offset="60%" stop-color="#064e3b" />
          <stop offset="100%" stop-color="#065f46" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg_soccer)" />
      <!-- Turf Pitch Lines -->
      <ellipse cx="600" cy="580" rx="550" ry="160" fill="none" stroke="#34d399" stroke-width="4" opacity="0.4"/>
      <line x1="600" y1="420" x2="600" y2="630" stroke="#34d399" stroke-width="4" opacity="0.4"/>
      <circle cx="600" cy="460" r="8" fill="#ffffff"/> <!-- Penalty Spot -->

      <!-- Stadium Goal Post and Net in Background -->
      <g opacity="0.3" stroke="#ffffff" stroke-width="3" fill="none">
        <rect x="220" y="100" width="760" height="320" rx="10" stroke-width="8"/>
        <!-- Net cross grid -->
        <line x1="220" y1="160" x2="980" y2="160" stroke-dasharray="8 8"/>
        <line x1="220" y1="220" x2="980" y2="220" stroke-dasharray="8 8"/>
        <line x1="220" y1="280" x2="980" y2="280" stroke-dasharray="8 8"/>
        <line x1="220" y1="340" x2="980" y2="340" stroke-dasharray="8 8"/>
        <line x1="320" y1="100" x2="320" y2="420" stroke-dasharray="8 8"/>
        <line x1="420" y1="100" x2="420" y2="420" stroke-dasharray="8 8"/>
        <line x1="520" y1="100" x2="520" y2="420" stroke-dasharray="8 8"/>
        <line x1="620" y1="100" x2="620" y2="420" stroke-dasharray="8 8"/>
        <line x1="720" y1="100" x2="720" y2="420" stroke-dasharray="8 8"/>
        <line x1="820" y1="100" x2="820" y2="420" stroke-dasharray="8 8"/>
      </g>

      <!-- Dynamic Curved Shot Line -->
      <path d="M 600 460 Q 750 340 880 180" fill="none" stroke="#facc15" stroke-width="8" stroke-dasharray="14 14" opacity="0.8"/>

      <!-- Giant Spinning 3D Soccer Ball Heading to Top Corner -->
      <g transform="translate(860, 160)">
        <circle cx="0" cy="0" r="75" fill="#f8fafc" stroke="#0f172a" stroke-width="5"/>
        <!-- Pentagon Patches -->
        <polygon points="0,-35 25,-15 15,15 -15,15 -25,-15" fill="#0f172a"/>
        <polygon points="45,-5 65,-25 70,-5 55,20 40,10" fill="#0f172a"/>
        <polygon points="-45,-5 -65,-25 -70,-5 -55,20 -40,10" fill="#0f172a"/>
        <circle cx="0" cy="0" r="85" fill="none" stroke="#facc15" stroke-width="4" opacity="0.6"/>
      </g>

      <!-- Goalkeeper Gloves Diving Left -->
      <g transform="translate(480, 240)">
        <rect x="0" y="0" width="70" height="90" rx="20" fill="#ef4444" stroke="#ffffff" stroke-width="4"/>
        <rect x="15" y="-15" width="20" height="30" rx="8" fill="#ef4444" stroke="#ffffff" stroke-width="3"/>
        <circle cx="35" cy="45" r="18" fill="#ffffff" opacity="0.4"/>
      </g>
    `;
  }

  // 3. KUCING ATUR DUIT
  if (file === "kucing-atur-duit.ts") {
    return `
      <defs>
        <linearGradient id="bg_money" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1c1917" />
          <stop offset="50%" stop-color="#292524" />
          <stop offset="100%" stop-color="#451a03" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg_money)" />
      <circle cx="600" cy="315" r="280" fill="#f59e0b" opacity="0.14" />

      <!-- Cute Cat Silhouette Head in Center -->
      <g transform="translate(600, 260)">
        <!-- Cat Ears -->
        <polygon points="-110,-50 -150,-150 -50,-90" fill="#ea580c"/>
        <polygon points="110,-50 150,-150 50,-90" fill="#ea580c"/>
        <polygon points="-100,-60 -135,-135 -60,-95" fill="#fca5a5"/>
        <polygon points="100,-60 135,-135 60,-95" fill="#fca5a5"/>
        <!-- Head -->
        <circle cx="0" cy="0" r="120" fill="#f97316"/>
        <!-- Eyes -->
        <ellipse cx="-45" cy="-10" rx="18" ry="24" fill="#0f172a"/>
        <ellipse cx="45" cy="-10" rx="18" ry="24" fill="#0f172a"/>
        <circle cx="-50" cy="-18" r="6" fill="#ffffff"/>
        <circle cx="40" cy="-18" r="6" fill="#ffffff"/>
        <!-- Nose and mouth -->
        <polygon points="0,15 -10,5 10,5" fill="#fca5a5"/>
        <path d="M 0 15 Q -15 30 -30 20" fill="none" stroke="#0f172a" stroke-width="4"/>
        <path d="M 0 15 Q 15 30 30 20" fill="none" stroke="#0f172a" stroke-width="4"/>
      </g>

      <!-- Stacked Golden Coins on Left -->
      <g transform="translate(240, 260)">
        <ellipse cx="60" cy="180" rx="70" ry="24" fill="#d97706" stroke="#f59e0b" stroke-width="3"/>
        <ellipse cx="60" cy="140" rx="70" ry="24" fill="#d97706" stroke="#f59e0b" stroke-width="3"/>
        <ellipse cx="60" cy="100" rx="70" ry="24" fill="#d97706" stroke="#f59e0b" stroke-width="3"/>
        <ellipse cx="60" cy="60" rx="70" ry="24" fill="#fbbf24" stroke="#fef08a" stroke-width="4"/>
        <text x="60" y="68" font-family="sans-serif" font-weight="900" font-size="28" fill="#78350f" text-anchor="middle">$</text>
      </g>

      <!-- Financial Growth Bar Charts on Right -->
      <g transform="translate(860, 240)">
        <rect x="0" y="140" width="45" height="140" rx="10" fill="#f59e0b" opacity="0.5"/>
        <rect x="65" y="80" width="45" height="200" rx="10" fill="#f59e0b" opacity="0.7"/>
        <rect x="130" y="20" width="45" height="260" rx="10" fill="#10b981"/>
        <!-- Growth Arrow -->
        <path d="M 10 130 Q 75 70 155 10" fill="none" stroke="#34d399" stroke-width="6"/>
      </g>
    `;
  }

  // 4. MILO CAT ADVENTURE
  if (file === "milo-cat.ts") {
    return `
      <defs>
        <linearGradient id="bg_milo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f0728" />
          <stop offset="50%" stop-color="#240046" />
          <stop offset="100%" stop-color="#3c096c" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg_milo)" />
      
      <!-- Stars and Galaxy Particles -->
      <circle cx="200" cy="120" r="3" fill="#ffffff"/>
      <circle cx="340" cy="80" r="4" fill="#f472b6"/>
      <circle cx="850" cy="100" r="5" fill="#a78bfa"/>
      <circle cx="1020" cy="220" r="3" fill="#ffffff"/>
      <circle cx="950" cy="480" r="4" fill="#38bdf8"/>

      <!-- Floating Neon Cyberpunk Platforms -->
      <rect x="180" y="420" width="220" height="34" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="4"/>
      <rect x="480" y="320" width="260" height="34" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="4"/>
      <rect x="820" y="240" width="240" height="34" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="4"/>

      <!-- Hero Cat Milo on Center Platform -->
      <g transform="translate(610, 210)">
        <!-- Hero Cape -->
        <path d="M -20 50 Q -60 80 -80 120 Q -40 100 -10 70 Z" fill="#ef4444"/>
        <!-- Body -->
        <ellipse cx="0" cy="50" rx="35" ry="40" fill="#f97316"/>
        <!-- Head -->
        <circle cx="0" cy="0" r="40" fill="#fb923c"/>
        <!-- Cat Ears -->
        <polygon points="-35,-25 -45,-60 -15,-35" fill="#f97316"/>
        <polygon points="35,-25 45,-60 15,-35" fill="#f97316"/>
        <!-- Sci-Fi Goggles -->
        <rect x="-35" y="-15" width="70" height="24" rx="10" fill="#06b6d4" stroke="#ffffff" stroke-width="3"/>
        <circle cx="-15" cy="-3" r="8" fill="#ffffff" opacity="0.6"/>
        <circle cx="15" cy="-3" r="8" fill="#ffffff" opacity="0.6"/>
      </g>

      <!-- Flying Neon Glowing Boomerang -->
      <g transform="translate(380, 180) rotate(-45)">
        <path d="M 0 0 Q 60 -30 110 0 Q 60 20 0 0 Z" fill="#f43f5e" stroke="#fecdd3" stroke-width="3"/>
        <circle cx="55" cy="0" r="16" fill="#f43f5e" opacity="0.6"/>
      </g>

      <!-- Golden Fish Trophy on Right Platform -->
      <g transform="translate(940, 160)">
        <path d="M -40 0 C -20 -30, 30 -30, 50 0 C 30 30, -20 30, -40 0 Z" fill="#facc15" stroke="#fef08a" stroke-width="3"/>
        <polygon points="50,0 75,-20 75,20" fill="#facc15"/>
        <circle cx="-15" cy="-5" r="5" fill="#713f12"/>
      </g>
    `;
  }

  // 5. MONSTER MATH
  if (file === "monster-math.ts") {
    return `
      <defs>
        <linearGradient id="bg_math" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1035" />
          <stop offset="50%" stop-color="#2e1065" />
          <stop offset="100%" stop-color="#4c1d95" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg_math)" />
      
      <!-- Glowing 3D Math Operators Floating in Canvas -->
      <g font-family="sans-serif" font-weight="900" font-size="120" text-anchor="middle" opacity="0.25">
        <text x="220" y="240" fill="#f43f5e">+</text>
        <text x="1000" y="220" fill="#38bdf8">&times;</text>
        <text x="280" y="520" fill="#facc15">&minus;</text>
        <text x="960" y="520" fill="#4ade80">&divide;</text>
      </g>

      <!-- Friendly Purple Monster Character in Center -->
      <g transform="translate(600, 330)">
        <!-- Body -->
        <rect x="-110" y="-120" width="220" height="220" rx="70" fill="#8b5cf6" stroke="#c4b5fd" stroke-width="6"/>
        <!-- Horns -->
        <polygon points="-70,-115 -90,-175 -40,-125" fill="#facc15"/>
        <polygon points="70,-115 90,-175 40,-125" fill="#facc15"/>
        <!-- Big Cyclops Eye -->
        <circle cx="0" cy="-25" r="55" fill="#ffffff" stroke="#4c1d95" stroke-width="6"/>
        <circle cx="0" cy="-25" r="26" fill="#3b82f6"/>
        <circle cx="8" cy="-33" r="10" fill="#ffffff"/>
        <!-- Happy Big Smile -->
        <path d="M -50 45 Q 0 85 50 45" fill="none" stroke="#4c1d95" stroke-width="8" stroke-linecap="round"/>
        <!-- Cute Little Fangs -->
        <polygon points="-25,48 -15,48 -20,62" fill="#ffffff"/>
        <polygon points="15,48 25,48 20,62" fill="#ffffff"/>
      </g>

      <!-- Brain Energy Wave Sparks -->
      <circle cx="600" cy="330" r="210" fill="none" stroke="#a78bfa" stroke-width="3" stroke-dasharray="10 10" opacity="0.5"/>
      <circle cx="600" cy="330" r="240" fill="none" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6 6" opacity="0.3"/>
    `;
  }

  // 6. BABY SHARK ABC
  if (file === "baby-shark.ts") {
    return `
      <defs>
        <linearGradient id="bg_shark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0369a1" />
          <stop offset="50%" stop-color="#0284c7" />
          <stop offset="100%" stop-color="#38bdf8" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg_shark)" />

      <!-- Gentle Underwater Waves -->
      <path d="M 0 540 Q 300 480 600 540 T 1200 540 L 1200 630 L 0 630 Z" fill="#0284c7" opacity="0.6"/>
      <path d="M 0 580 Q 300 520 600 580 T 1200 580 L 1200 630 L 0 630 Z" fill="#0369a1" opacity="0.8"/>

      <!-- Floating ABC Sea Bubbles -->
      <g transform="translate(220, 200)">
        <circle cx="0" cy="0" r="65" fill="#ffffff" fill-opacity="0.25" stroke="#ffffff" stroke-width="4"/>
        <text x="0" y="24" font-family="sans-serif" font-weight="900" font-size="70" fill="#fef08a" text-anchor="middle">A</text>
      </g>
      <g transform="translate(980, 220)">
        <circle cx="0" cy="0" r="65" fill="#ffffff" fill-opacity="0.25" stroke="#ffffff" stroke-width="4"/>
        <text x="0" y="24" font-family="sans-serif" font-weight="900" font-size="70" fill="#f472b6" text-anchor="middle">B</text>
      </g>
      <g transform="translate(600, 130)">
        <circle cx="0" cy="0" r="55" fill="#ffffff" fill-opacity="0.25" stroke="#ffffff" stroke-width="4"/>
        <text x="0" y="20" font-family="sans-serif" font-weight="900" font-size="60" fill="#4ade80" text-anchor="middle">C</text>
      </g>

      <!-- Cute Baby Shark in Center -->
      <g transform="translate(600, 370)">
        <!-- Shark Fin on Top -->
        <path d="M -30 -60 Q -20 -130 30 -70 Z" fill="#facc15"/>
        <!-- Shark Tail on Left -->
        <path d="M -110 0 L -180 -50 Q -150 0 -180 50 Z" fill="#facc15"/>
        <!-- Body -->
        <ellipse cx="0" cy="0" rx="140" ry="75" fill="#facc15"/>
        <!-- White Belly -->
        <path d="M -90 20 Q 0 75 90 20 Q 0 40 -90 20 Z" fill="#ffffff"/>
        <!-- Big Smiling Eye -->
        <circle cx="65" cy="-20" r="22" fill="#0f172a"/>
        <circle cx="72" cy="-26" r="8" fill="#ffffff"/>
        <!-- Cute Smile -->
        <path d="M 40 10 Q 75 35 110 10" fill="none" stroke="#713f12" stroke-width="5" stroke-linecap="round"/>
      </g>
    `;
  }

  // 7. FRUITY MERGE 3D
  if (file === "fruity-merge.ts") {
    return `
      <defs>
        <linearGradient id="bg_fruit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#14532d" />
          <stop offset="50%" stop-color="#166534" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg_fruit)" />
      
      <!-- Clear Glass Drop Container Silhouette in Center -->
      <rect x="360" y="70" width="480" height="510" rx="24" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-width="4"/>

      <!-- Giant Juicy Watermelon Slice & Sphere at the Bottom -->
      <g transform="translate(600, 410)">
        <!-- Watermelon Outer Green Rind -->
        <circle cx="0" cy="0" r="140" fill="#15803d" stroke="#22c55e" stroke-width="6"/>
        <circle cx="0" cy="0" r="124" fill="#86efac"/>
        <circle cx="0" cy="0" r="114" fill="#ef4444"/>
        <!-- Black Seeds -->
        <circle cx="-50" cy="-30" r="6" fill="#0f172a"/>
        <circle cx="50" cy="-30" r="6" fill="#0f172a"/>
        <circle cx="0" cy="40" r="6" fill="#0f172a"/>
        <circle cx="-40" cy="40" r="6" fill="#0f172a"/>
        <circle cx="40" cy="40" r="6" fill="#0f172a"/>
      </g>

      <!-- Smaller Fruits Falling / Merging Above -->
      <!-- Orange -->
      <circle cx="480" cy="200" r="65" fill="#f97316" stroke="#fb923c" stroke-width="4"/>
      <!-- Apple -->
      <circle cx="700" cy="190" r="55" fill="#dc2626" stroke="#ef4444" stroke-width="4"/>
      <!-- Lemon -->
      <circle cx="590" cy="130" r="42" fill="#facc15" stroke="#fef08a" stroke-width="3"/>
      <!-- Cherries with Stem -->
      <g transform="translate(220, 240)">
        <circle cx="-20" cy="30" r="30" fill="#b91c1c"/>
        <circle cx="25" cy="40" r="30" fill="#b91c1c"/>
        <path d="M -20 30 Q 0 -30 10 -40 Q 20 -30 25 40" fill="none" stroke="#15803d" stroke-width="5"/>
      </g>
      <!-- Juicy Sparkle Burst -->
      <polygon points="600,240 610,260 630,270 610,280 600,300 590,280 570,270 590,260" fill="#fef08a"/>
    `;
  }

  // Fallback: Elegant Tech Minimalist Grid
  return `
    <defs>
      <linearGradient id="bg_default" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg_default)" />
    <circle cx="600" cy="315" r="280" fill="#38bdf8" opacity="0.15" />
    <circle cx="600" cy="315" r="160" fill="#818cf8" opacity="0.2" />
  `;
}

async function generateAll() {
  const dir = "src/data/articles";
  const files = [
    "offline-pdf.ts",
    "stickman-penalty.ts",
    "kucing-atur-duit.ts",
    "milo-cat.ts",
    "monster-math.ts",
    "baby-shark.ts",
    "fruity-merge.ts",
    "amazon-buyer-guides.ts",
  ];

  let total = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf8");
    const slugMatches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)];

    console.log(`Generating artwork for ${file} (${slugMatches.length} items)...`);

    for (const match of slugMatches) {
      const slug = match[1];
      const svgBody = getCategoryThematicArt(slug, file);

      const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
        ${svgBody}
      </svg>`;

      const outPath = path.join(blogDir, `${slug}.webp`);
      await sharp(Buffer.from(fullSvg)).webp({ quality: 85 }).toFile(outPath);
      total++;
    }
  }

  console.log(`\n🎉 SUCCESS: All ${total} article header cards generated with PURE VISUAL ARTWORK (ZERO LONG TEXT)!`);
}

generateAll().catch(console.error);
