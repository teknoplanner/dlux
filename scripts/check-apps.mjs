import fs from "node:fs";

// Baca slug aplikasi dari src/data/apps.ts
const appsContent = fs.readFileSync("src/data/apps.ts", "utf-8");
const slugMatches = [...appsContent.matchAll(/slug:\s*["']([^"']+)["']/g)];
const slugs = slugMatches.map((m) => m[1]);

if (!slugs.length) {
  console.error("Error: Tidak ada slug aplikasi ditemukan di src/data/apps.ts");
  process.exit(1);
}

const missing = slugs.filter((slug) => !fs.existsSync(`out/apps/${slug}/index.html`));

if (missing.length) {
  console.error("Halaman aplikasi hilang di out/apps/:", missing);
  process.exit(1);
}

console.log(`OK: ${slugs.length} aplikasi ter-generate.`);
