import fs from "fs";
import path from "path";
import sharp from "sharp";

const gearDir = "public/images/gear";
if (!fs.existsSync(gearDir)) {
  fs.mkdirSync(gearDir, { recursive: true });
}

const products = [
  {
    id: "finger-sleeves",
    name: "Mobile Gaming Finger Sleeves",
    color1: "#1e1b4b", // deep indigo
    color2: "#312e81",
    accent: "#38bdf8", // electric cyan
    svg: `
      <!-- Smartphone outline -->
      <rect x="220" y="80" width="360" height="340" rx="28" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      <!-- Screen -->
      <rect x="236" y="96" width="328" height="308" rx="20" fill="#020617"/>
      <!-- Grid/Aim Target on screen -->
      <circle cx="400" cy="250" r="70" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="6,6" opacity="0.6"/>
      <circle cx="400" cy="250" r="30" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <line x1="320" y1="250" x2="480" y2="250" stroke="#38bdf8" stroke-width="2" opacity="0.4"/>
      <line x1="400" y1="170" x2="400" y2="330" stroke="#38bdf8" stroke-width="2" opacity="0.4"/>
      <!-- Left Thumb with Conductive Silver Sleeve -->
      <g transform="translate(180, 200)">
        <path d="M 0 140 C 20 80, 70 50, 110 50 C 130 50, 140 70, 130 110 C 120 150, 80 180, 10 200 Z" fill="#475569" stroke="#94a3b8" stroke-width="3"/>
        <!-- Sleeve texture / Silver weave lines -->
        <path d="M 50 65 Q 90 70 120 90" fill="none" stroke="#e2e8f0" stroke-width="3"/>
        <path d="M 40 85 Q 80 90 115 110" fill="none" stroke="#e2e8f0" stroke-width="3"/>
        <path d="M 30 105 Q 70 110 105 130" fill="none" stroke="#e2e8f0" stroke-width="3"/>
        <!-- Silver fiber badge tag -->
        <rect x="75" y="80" width="36" height="18" rx="6" fill="#38bdf8"/>
        <text x="93" y="93" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Ag+</text>
        <!-- Touch glow ripple -->
        <circle cx="115" cy="65" r="18" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.8"/>
        <circle cx="115" cy="65" r="32" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.5"/>
      </g>
      <!-- Right Thumb with Conductive Silver Sleeve -->
      <g transform="translate(480, 190)">
        <path d="M 140 150 C 120 90, 70 60, 30 60 C 10 60, 0 80, 10 120 C 20 160, 60 190, 130 210 Z" fill="#475569" stroke="#94a3b8" stroke-width="3"/>
        <path d="M 90 75 Q 50 80 20 100" fill="none" stroke="#e2e8f0" stroke-width="3"/>
        <path d="M 100 95 Q 60 100 25 120" fill="none" stroke="#e2e8f0" stroke-width="3"/>
        <rect x="35" y="90" width="36" height="18" rx="6" fill="#38bdf8"/>
        <text x="53" y="103" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Ag+</text>
        <circle cx="25" cy="75" r="18" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.8"/>
      </g>
      <!-- Label -->
      <rect x="290" y="30" width="220" height="34" rx="17" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8" text-anchor="middle" letter-spacing="1">ZERO-FRICTION SILVER WEAVE</text>
    `
  },
  {
    id: "phone-cooler",
    name: "Semiconductor Magnetic Peltier Cooler",
    color1: "#042f2e", // deep teal
    color2: "#0f172a",
    accent: "#06b6d4", // cyan
    svg: `
      <!-- Phone Backplate -->
      <rect x="240" y="80" width="320" height="340" rx="24" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      <!-- Camera island -->
      <rect x="260" y="100" width="80" height="120" rx="16" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <circle cx="300" cy="130" r="18" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
      <circle cx="300" cy="180" r="18" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
      <!-- Magnetic Cooler Base (Outer Ring) -->
      <circle cx="430" cy="250" r="120" fill="#0f172a" stroke="#06b6d4" stroke-width="6"/>
      <!-- Radiator Fins ring -->
      <circle cx="430" cy="250" r="105" fill="none" stroke="#1e293b" stroke-width="12" stroke-dasharray="5,3"/>
      <!-- Fan Hub & Blades -->
      <circle cx="430" cy="250" r="90" fill="#082f49"/>
      <!-- 7 Curved Turbofan Blades -->
      <g stroke="#38bdf8" stroke-width="5" fill="#0284c7" opacity="0.9">
        <path d="M 430 250 Q 450 170 430 165 C 410 185 425 240 430 250 Z"/>
        <path d="M 430 250 Q 510 200 515 220 C 490 235 440 245 430 250 Z"/>
        <path d="M 430 250 Q 520 280 505 300 C 480 290 440 260 430 250 Z"/>
        <path d="M 430 250 Q 470 340 445 340 C 435 320 430 270 430 250 Z"/>
        <path d="M 430 250 Q 380 340 365 320 C 380 300 420 265 430 250 Z"/>
        <path d="M 430 250 Q 340 260 345 240 C 370 240 415 250 430 250 Z"/>
        <path d="M 430 250 Q 360 180 380 170 C 395 190 420 235 430 250 Z"/>
      </g>
      <!-- Center Digital LED Temp Display -->
      <circle cx="430" cy="250" r="42" fill="#020617" stroke="#06b6d4" stroke-width="3"/>
      <text x="430" y="258" font-family="system-ui, monospace, sans-serif" font-size="24" font-weight="bold" fill="#38bdf8" text-anchor="middle">12°C</text>
      <!-- Frost Frosting Crystals -->
      <path d="M 320 200 L 330 205 M 325 195 L 325 210 M 340 270 L 350 275 M 345 265 L 345 280" stroke="#bae6fd" stroke-width="2.5"/>
      <path d="M 530 180 L 540 185 M 535 175 L 535 190 M 520 310 L 530 315 M 525 305 L 525 320" stroke="#bae6fd" stroke-width="2.5"/>
      <!-- Label -->
      <rect x="270" y="30" width="260" height="34" rx="17" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#22d3ee" text-anchor="middle" letter-spacing="1">RAPID THERMOELECTRIC COOLING</text>
    `
  },
  {
    id: "mobile-controller",
    name: "Ergonomic Mobile Gaming Controller",
    color1: "#1e1b4b",
    color2: "#0f172a",
    accent: "#6366f1",
    svg: `
      <!-- Telescopic Bridge (Back) -->
      <rect x="220" y="210" width="360" height="70" rx="8" fill="#1e293b" stroke="#334155" stroke-width="3"/>
      <!-- Phone Clamped in Middle -->
      <rect x="260" y="110" width="280" height="280" rx="18" fill="#090d16" stroke="#475569" stroke-width="3"/>
      <!-- Game Screen Graphic (Crosshairs & Map) -->
      <rect x="275" y="125" width="250" height="250" rx="12" fill="#020617"/>
      <circle cx="400" cy="250" r="50" fill="none" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,4"/>
      <!-- Left Controller Grip -->
      <path d="M 140 150 C 140 120, 180 110, 260 110 L 260 390 C 180 390, 140 380, 140 350 Z" fill="#0f172a" stroke="#6366f1" stroke-width="4"/>
      <!-- Left Analog Stick -->
      <circle cx="200" cy="180" r="32" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <circle cx="200" cy="180" r="24" fill="#020617" stroke="#6366f1" stroke-width="2.5"/>
      <path d="M 194 180 L 206 180 M 200 174 L 200 186" stroke="#818cf8" stroke-width="3"/>
      <!-- Left D-Pad -->
      <g transform="translate(178, 250)">
        <rect x="15" y="0" width="14" height="44" rx="4" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
        <rect x="0" y="15" width="44" height="14" rx="4" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
      </g>
      <!-- Right Controller Grip -->
      <path d="M 660 150 C 660 120, 620 110, 540 110 L 540 390 C 620 390, 660 380, 660 350 Z" fill="#0f172a" stroke="#6366f1" stroke-width="4"/>
      <!-- ABXY Buttons -->
      <circle cx="600" cy="160" r="12" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>
      <text x="600" y="165" font-family="system-ui" font-size="12" font-weight="bold" fill="#f43f5e" text-anchor="middle">Y</text>
      <circle cx="625" cy="185" r="12" fill="#1e293b" stroke="#eab308" stroke-width="2"/>
      <text x="625" y="190" font-family="system-ui" font-size="12" font-weight="bold" fill="#eab308" text-anchor="middle">B</text>
      <circle cx="600" cy="210" r="12" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <text x="600" y="215" font-family="system-ui" font-size="12" font-weight="bold" fill="#10b981" text-anchor="middle">A</text>
      <circle cx="575" cy="185" r="12" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <text x="575" y="190" font-family="system-ui" font-size="12" font-weight="bold" fill="#3b82f6" text-anchor="middle">X</text>
      <!-- Right Analog Stick -->
      <circle cx="600" cy="280" r="32" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <circle cx="600" cy="280" r="24" fill="#020617" stroke="#6366f1" stroke-width="2.5"/>
      <!-- Label -->
      <rect x="270" y="30" width="260" height="34" rx="17" fill="#0f172a" stroke="#6366f1" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#a5b4fc" text-anchor="middle" letter-spacing="1">CONSOLE PRECISION ON SMARTPHONE</text>
    `
  },
  {
    id: "gaming-tws",
    name: "Low-Latency Gaming TWS Earbuds",
    color1: "#022c22", // deep emerald
    color2: "#0f172a",
    accent: "#10b981",
    svg: `
      <!-- Open Charging Case Base -->
      <rect x="280" y="180" width="240" height="190" rx="40" fill="#0f172a" stroke="#10b981" stroke-width="4"/>
      <!-- Case Inner Cavity -->
      <rect x="300" y="200" width="200" height="130" rx="30" fill="#020617"/>
      <!-- Open Lid Profile -->
      <path d="M 280 180 C 280 90, 520 90, 520 180 Z" fill="#1e293b" stroke="#10b981" stroke-width="3" opacity="0.4"/>
      <!-- Left Earbud (Floating) -->
      <g transform="translate(240, 120)">
        <ellipse cx="60" cy="60" rx="36" ry="28" fill="#0f172a" stroke="#10b981" stroke-width="3.5"/>
        <path d="M 60 88 L 60 170 C 60 180, 48 180, 48 170 L 48 88 Z" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/>
        <circle cx="60" cy="60" r="14" fill="#10b981" opacity="0.8"/>
        <!-- Latency wave ripple -->
        <path d="M 10 40 Q -10 60 10 80" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
        <path d="M -5 30 Q -30 60 -5 90" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
      </g>
      <!-- Right Earbud (Floating) -->
      <g transform="translate(460, 120)">
        <ellipse cx="40" cy="60" rx="36" ry="28" fill="#0f172a" stroke="#10b981" stroke-width="3.5"/>
        <path d="M 40 88 L 40 170 C 40 180, 52 180, 52 170 L 52 88 Z" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/>
        <circle cx="40" cy="60" r="14" fill="#10b981" opacity="0.8"/>
        <path d="M 90 40 Q 110 60 90 80" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
        <path d="M 105 30 Q 130 60 105 90" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
      </g>
      <!-- LED Battery Indicator on Case -->
      <circle cx="370" cy="340" r="4" fill="#10b981"/>
      <circle cx="390" cy="340" r="4" fill="#10b981"/>
      <circle cx="410" cy="340" r="4" fill="#10b981"/>
      <circle cx="430" cy="340" r="4" fill="#10b981"/>
      <!-- Latency Speed Badge -->
      <rect x="340" y="240" width="120" height="34" rx="17" fill="#020617" stroke="#10b981" stroke-width="2"/>
      <text x="400" y="262" font-family="system-ui, monospace, sans-serif" font-size="14" font-weight="bold" fill="#34d399" text-anchor="middle">&lt; 45ms SYNC</text>
      <!-- Label -->
      <rect x="270" y="30" width="260" height="34" rx="17" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#6ee7b7" text-anchor="middle" letter-spacing="1">INSTANT FOOTSTEP AUDIO RESPONSE</text>
    `
  },
  {
    id: "kids-tablet",
    name: "All-New Kids Educational Tablet",
    color1: "#451a03", // warm amber
    color2: "#0f172a",
    accent: "#f59e0b",
    svg: `
      <!-- Kid-Proof Thick Bumper Silicone Case Outer -->
      <rect x="180" y="80" width="440" height="320" rx="46" fill="#f59e0b" stroke="#d97706" stroke-width="6"/>
      <!-- Bumper Handle Grip Stand at Top -->
      <path d="M 280 80 Q 400 20 520 80" fill="none" stroke="#f59e0b" stroke-width="24" stroke-linecap="round"/>
      <!-- Inner Screen Bezel -->
      <rect x="210" y="110" width="380" height="260" rx="20" fill="#0f172a"/>
      <!-- Screen Display -->
      <rect x="225" y="125" width="350" height="230" rx="12" fill="#1e1b4b"/>
      <!-- Educational Content on Screen (ABC 123 Star) -->
      <circle cx="285" cy="180" r="30" fill="#ec4899"/>
      <text x="285" y="190" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">A</text>
      <circle cx="360" cy="180" r="30" fill="#3b82f6"/>
      <text x="360" y="190" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
      <circle cx="435" cy="180" r="30" fill="#10b981"/>
      <text x="435" y="190" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">C</text>
      <circle cx="510" cy="180" r="30" fill="#f59e0b"/>
      <text x="510" y="190" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">★</text>
      <!-- Safe Screen-Time / Parental Shield Badge -->
      <rect x="285" y="250" width="230" height="60" rx="16" fill="#020617" stroke="#38bdf8" stroke-width="2"/>
      <text x="400" y="275" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Parental Screen Filter</text>
      <text x="400" y="296" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Safe Apps • Auto-Timer Lock</text>
      <!-- Label -->
      <rect x="270" y="30" width="260" height="34" rx="17" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#fbbf24" text-anchor="middle" letter-spacing="1">SHOCKPROOF LEARNING TABLET</text>
    `
  },
  {
    id: "kids-stylus",
    name: "Ergonomic Chunky Grip Stylus for Kids",
    color1: "#78350f",
    color2: "#0f172a",
    accent: "#fbbf24",
    svg: `
      <!-- Tablet Canvas Base -->
      <rect x="200" y="90" width="400" height="320" rx="28" fill="#1e293b" stroke="#334155" stroke-width="4"/>
      <rect x="220" y="110" width="360" height="280" rx="16" fill="#f8fafc"/>
      <!-- Child Drawing Doodles on Screen -->
      <path d="M 260 280 Q 320 180 380 260 T 500 220" fill="none" stroke="#ec4899" stroke-width="12" stroke-linecap="round"/>
      <circle cx="300" cy="180" r="24" fill="#38bdf8"/>
      <polygon points="480,150 495,185 530,190 505,215 510,250 480,230 450,250 455,215 430,190 465,185" fill="#facc15"/>
      <!-- Chunky Ergonomic Triangular Stylus Pen -->
      <g transform="translate(380, 80) rotate(35)">
        <!-- Pen Body (Thick ergonomic grip) -->
        <rect x="0" y="0" width="46" height="220" rx="16" fill="#f59e0b" stroke="#d97706" stroke-width="4"/>
        <rect x="6" y="20" width="34" height="60" rx="8" fill="#fbbf24"/>
        <!-- Soft Rounded Silicone Tip -->
        <path d="M 3 220 Q 23 260 43 220 Z" fill="#0284c7" stroke="#0369a1" stroke-width="3"/>
        <!-- Grip Ridges -->
        <line x1="8" y1="130" x2="38" y2="130" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
        <line x1="8" y1="150" x2="38" y2="150" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
        <line x1="8" y1="170" x2="38" y2="170" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
      </g>
      <!-- Label -->
      <rect x="270" y="30" width="260" height="34" rx="17" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#fde047" text-anchor="middle" letter-spacing="1">NATURAL PENCIL-GRIP DEVELOPMENT</text>
    `
  },
  {
    id: "kids-case",
    name: "Heavy-Duty Shockproof Kids Tablet Case",
    color1: "#134e4a",
    color2: "#0f172a",
    accent: "#14b8a6",
    svg: `
      <!-- Heavy Duty EVA Foam Case -->
      <rect x="180" y="100" width="440" height="300" rx="48" fill="#0d9488" stroke="#115e59" stroke-width="6"/>
      <!-- 180° Rotatable Handle (Doubles as Dual-Angle Kickstand) -->
      <path d="M 280 100 C 280 30, 520 30, 520 100" fill="none" stroke="#0d9488" stroke-width="28" stroke-linecap="round"/>
      <circle cx="280" cy="100" r="16" fill="#115e59"/>
      <circle cx="520" cy="100" r="16" fill="#115e59"/>
      <!-- Raised Screen Bezel -->
      <rect x="220" y="130" width="360" height="240" rx="18" fill="#0f172a" stroke="#14b8a6" stroke-width="4"/>
      <!-- Screen Surface with Shockwave Ripples -->
      <rect x="235" y="145" width="330" height="210" rx="12" fill="#042f2e"/>
      <circle cx="400" cy="250" r="60" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-dasharray="8,6"/>
      <circle cx="400" cy="250" r="30" fill="none" stroke="#5eead4" stroke-width="2"/>
      <path d="M 380 250 L 395 265 L 425 235" fill="none" stroke="#5eead4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Drop-Tested Badge -->
      <rect x="300" y="300" width="200" height="36" rx="18" fill="#0f172a" stroke="#2dd4bf" stroke-width="2"/>
      <text x="400" y="323" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">10-FOOT DROP SURVIVAL</text>
      <!-- Label -->
      <rect x="270" y="30" width="260" height="34" rx="17" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#5eead4" text-anchor="middle" letter-spacing="1">DENSE SHOCK-ABSORBING EVA FOAM</text>
    `
  },
  {
    id: "capacitive-stylus",
    name: "High-Precision Universal Capacitive Stylus",
    color1: "#312e81",
    color2: "#0f172a",
    accent: "#818cf8",
    svg: `
      <!-- Tablet with PDF Contract on Screen -->
      <rect x="200" y="80" width="400" height="340" rx="24" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      <rect x="220" y="100" width="360" height="300" rx="14" fill="#ffffff"/>
      <!-- PDF Document Header & Lines -->
      <rect x="250" y="130" width="120" height="18" rx="4" fill="#1e293b"/>
      <rect x="250" y="165" width="300" height="8" rx="4" fill="#cbd5e1"/>
      <rect x="250" y="185" width="280" height="8" rx="4" fill="#cbd5e1"/>
      <rect x="250" y="205" width="260" height="8" rx="4" fill="#cbd5e1"/>
      <rect x="250" y="225" width="290" height="8" rx="4" fill="#cbd5e1"/>
      <!-- Digital Signature Line & Cursive Signature -->
      <line x1="250" y1="320" x2="480" y2="320" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4"/>
      <path d="M 260 310 Q 290 270 320 310 T 360 300 T 420 290" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
      <text x="250" y="340" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0284c7">✓ Verified Digital Signature (E-Sign)</text>
      <!-- Sleek Metallic Active Stylus Pen (Fine Copper Tip) -->
      <g transform="translate(420, 60) rotate(30)">
        <rect x="0" y="0" width="22" height="260" rx="11" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
        <rect x="3" y="20" width="16" height="30" fill="#94a3b8"/>
        <circle cx="11" cy="70" r="4" fill="#22c55e"/> <!-- Power LED indicator -->
        <!-- 1.5mm Ultra-fine Copper Tip -->
        <polygon points="4,260 18,260 11,290" fill="#d97706" stroke="#b45309" stroke-width="2"/>
        <circle cx="11" cy="290" r="3" fill="#f59e0b"/>
      </g>
      <!-- Label -->
      <rect x="270" y="30" width="260" height="34" rx="17" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#c7d2fe" text-anchor="middle" letter-spacing="1">FINE 1.5MM COPPER NIB PRECISION</text>
    `
  },
  {
    id: "paper-screen-protector",
    name: "Matte Paper-Feel Screen Protector",
    color1: "#1c1917", // warm stone
    color2: "#0f172a",
    accent: "#a8a29e",
    svg: `
      <!-- Tablet Display Frame -->
      <rect x="180" y="80" width="440" height="330" rx="24" fill="#0f172a" stroke="#44403c" stroke-width="4"/>
      <!-- Left Half: Glossy & Glare (Harsh Reflection) -->
      <path d="M 200 100 L 400 100 L 400 390 L 200 390 Z" fill="#090d16"/>
      <polygon points="220,100 280,100 240,390 180,390" fill="#ffffff" opacity="0.15"/>
      <text x="300" y="360" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#78716c" text-anchor="middle">Bare Glass (Glare &amp; Slippery)</text>
      <!-- Right Half: Matte Paper-Feel Protector (No Glare, Textured) -->
      <path d="M 400 100 L 600 100 L 600 390 L 400 390 Z" fill="#1c1917"/>
      <!-- Micro-texture pattern lines -->
      <g stroke="#78716c" stroke-width="1" opacity="0.3">
        <line x1="410" y1="120" x2="590" y2="120" stroke-dasharray="2,4"/>
        <line x1="410" y1="150" x2="590" y2="150" stroke-dasharray="3,3"/>
        <line x1="410" y1="180" x2="590" y2="180" stroke-dasharray="4,2"/>
        <line x1="410" y1="210" x2="590" y2="210" stroke-dasharray="2,4"/>
        <line x1="410" y1="240" x2="590" y2="240" stroke-dasharray="3,3"/>
        <line x1="410" y1="270" x2="590" y2="270" stroke-dasharray="4,2"/>
      </g>
      <!-- Divider Line -->
      <line x1="400" y1="90" x2="400" y2="400" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,4"/>
      <!-- Pencil tip creating paper damping resistance -->
      <g transform="translate(480, 180) rotate(40)">
        <polygon points="0,0 20,0 10,40" fill="#d97706"/>
        <polygon points="7,28 13,28 10,40" fill="#1c1917"/>
        <rect x="0" y="-120" width="20" height="120" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      </g>
      <text x="500" y="360" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#22c55e" text-anchor="middle">✓ Matte Paper Texture</text>
      <!-- Label -->
      <rect x="270" y="30" width="260" height="34" rx="17" fill="#0f172a" stroke="#a8a29e" stroke-width="2"/>
      <text x="400" y="52" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#e7e5e4" text-anchor="middle" letter-spacing="1">AUTHENTIC PAPER-FEEL RESISTANCE</text>
    `
  }
];

async function main() {
  console.log("Generating 9 High-Quality Product Images for Gear Catalog...");

  for (const item of products) {
    const fullSvg = `
      <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${item.color1}"/>
            <stop offset="100%" stop-color="${item.color2}"/>
          </linearGradient>
        </defs>
        <!-- Background -->
        <rect width="800" height="500" fill="url(#bg)"/>
        <!-- Soft Ambient Vignette / Spotlight -->
        <circle cx="400" cy="250" r="280" fill="${item.accent}" opacity="0.12" filter="blur(60px)"/>
        <!-- Product Art -->
        ${item.svg}
      </svg>
    `;

    const outPath = path.join(gearDir, `${item.id}.webp`);
    await sharp(Buffer.from(fullSvg))
      .webp({ quality: 90 })
      .toFile(outPath);

    console.log(`✓ Generated ${outPath}`);
  }

  console.log("\n🎉 All 9 Gear Product Images Generated Successfully!");
}

main().catch(console.error);
