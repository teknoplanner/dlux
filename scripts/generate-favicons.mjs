import fs from "fs";
import path from "path";
import sharp from "sharp";

const BRAND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1122" />
      <stop offset="50%" stop-color="#040813" />
      <stop offset="100%" stop-color="#010206" />
    </linearGradient>

    <!-- Outer Border Glow -->
    <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#10b981" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.8" />
    </linearGradient>

    <!-- Central Ambient Glow -->
    <radialGradient id="bloom" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.7" />
      <stop offset="45%" stop-color="#06b6d4" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Emerald Beam Gradients -->
    <linearGradient id="emeraldLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6ee7b7" />
      <stop offset="35%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="emeraldDark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="40%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>

    <!-- Cyan Beam Gradients -->
    <linearGradient id="cyanLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#67e8f9" />
      <stop offset="35%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="cyanDark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="40%" stop-color="#0891b2" />
      <stop offset="100%" stop-color="#0e7490" />
    </linearGradient>

    <!-- Core Star Gradient -->
    <linearGradient id="gemStar" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#f0fdf4" />
      <stop offset="65%" stop-color="#a7f3d0" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- Container -->
  <rect width="512" height="512" rx="118" fill="url(#bg)" />
  <rect x="12" y="12" width="488" height="488" rx="106" fill="none" stroke="url(#border)" stroke-width="5" />

  <!-- Ambient Glow -->
  <circle cx="256" cy="256" r="200" fill="url(#bloom)" />

  <g transform="translate(256, 256)" filter="url(#glow)">
    
    <!-- UNDER BEAM (Cyan, at +45 deg, split for center bridge) -->
    <g transform="rotate(45)" filter="url(#shadow)">
      <!-- Left Wing -->
      <path d="M -175 -48 L -70 -48 L -70 0 L -175 0 Z" fill="url(#cyanLight)" />
      <path d="M -175 0 L -70 0 L -70 48 L -175 48 Z" fill="url(#cyanDark)" />
      <path d="M -175 -48 L -220 0 L -175 48 Z" fill="url(#cyanLight)" />

      <!-- Right Wing -->
      <path d="M 70 -48 L 175 -48 L 175 0 L 70 0 Z" fill="url(#cyanLight)" />
      <path d="M 70 0 L 175 0 L 175 48 L 70 48 Z" fill="url(#cyanDark)" />
      <path d="M 175 -48 L 220 0 L 175 48 Z" fill="url(#cyanLight)" />

      <!-- Inner accent glow lines -->
      <line x1="-170" y1="0" x2="-75" y2="0" stroke="#a5f3fc" stroke-width="3" stroke-linecap="round" opacity="0.85" />
      <line x1="75" y1="0" x2="170" y2="0" stroke="#a5f3fc" stroke-width="3" stroke-linecap="round" opacity="0.85" />
    </g>

    <!-- OVER BEAM (Emerald, at -45 deg, continuous with highlight spine) -->
    <g transform="rotate(-45)" filter="url(#shadow)">
      <path d="M -175 -48 L 175 -48 L 175 0 L -175 0 Z" fill="url(#emeraldLight)" />
      <path d="M -175 0 L 175 0 L 175 48 L -175 48 Z" fill="url(#emeraldDark)" />
      <!-- Outer Angled Cuts -->
      <path d="M -175 -48 L -220 0 L -175 48 Z" fill="url(#emeraldLight)" />
      <path d="M 175 -48 L 220 0 L 175 48 Z" fill="url(#emeraldLight)" />
      <!-- Spine highlight -->
      <line x1="-165" y1="0" x2="165" y2="0" stroke="#a7f3d0" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
    </g>

    <!-- CENTERPIECE: The Lucky Diamond Star Nexus -->
    <g filter="url(#shadow)">
      <rect x="-62" y="-62" width="124" height="124" rx="26" transform="rotate(45)" fill="#020610" stroke="#34d399" stroke-width="4.5" />
      
      <!-- 4-Leaf Lucky Clover Star (Diamond Curvature) -->
      <path d="M 0 -64 Q 0 0 64 0 Q 0 0 0 64 Q 0 0 -64 0 Q 0 0 0 -64 Z" fill="url(#gemStar)" />
      
      <!-- Intense Bright Core -->
      <circle cx="0" cy="0" r="12" fill="#ffffff" />
    </g>
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve("public");
  const imagesDir = path.resolve("public/images");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 1. Save SVG sources
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), BRAND_SVG);
  fs.writeFileSync(path.join(imagesDir, "logo.svg"), BRAND_SVG);
  console.log("Saved favicon.svg and images/logo.svg");

  const svgBuffer = Buffer.from(BRAND_SVG);

  // 2. Generate 512x512 base PNG
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "icon-512.png"), png512);
  fs.writeFileSync(path.join(imagesDir, "logo.png"), png512);
  console.log("Saved icon-512.png and images/logo.png");

  // 3. Generate 192x192 PNG
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, "icon-192.png"));
  console.log("Saved icon-192.png");

  // 4. Generate 180x180 Apple Touch Icon
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("Saved apple-touch-icon.png");

  // 5. Generate 32x32 icon.png
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, "icon.png"));
  console.log("Saved icon.png");

  // 6. Generate multi-resolution favicon.ico (16x16, 32x32, 48x48)
  const b16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const b32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const b48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  const icoSizes = [
    { width: 16, height: 16, buffer: b16 },
    { width: 32, height: 32, buffer: b32 },
    { width: 48, height: 48, buffer: b48 },
  ];

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(icoSizes.length, 4); // Count

  let offset = 6 + 16 * icoSizes.length;
  const dirEntries = [];
  for (const item of icoSizes) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width, 0);
    entry.writeUInt8(item.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // Image size
    entry.writeUInt32LE(offset, 12); // Offset
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...icoSizes.map((p) => p.buffer)]);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
  console.log("Saved favicon.ico with 16, 32, 48 resolutions");

  // Clean up any test files
  const testFiles = [
    "test-logo.png",
    "test-logo-a.png",
    "test-logo-b.png",
    "test-logo-c.png",
    "test-logo-d.png",
    "test-logo-e.png",
    "test-logo-f.png",
    "test-logo-g.png",
    "test-logo-h.png",
    "test-favicon-32.png",
    "test-favicon-h-32.png",
    "test.ico",
  ];
  for (const f of testFiles) {
    const p = path.join(publicDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  console.log("Cleaned up temporary test files.");
}

main().catch(console.error);
