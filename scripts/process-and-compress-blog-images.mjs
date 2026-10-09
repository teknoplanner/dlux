import fs from "fs";
import path from "path";
import sharp from "sharp";

const brainDir = "/Users/dederpl/.gemini/antigravity/brain/d97026f0-0c1b-40a4-951f-66c97e0dfd19";
const outDir = "public/images/blog";

const masterImages = {
  mobile_gaming_gear: path.join(brainDir, "mobile_gaming_gear_1791560524124.jpg"),
  kids_learning_tablet: path.join(brainDir, "kids_learning_tablet_1791560571262.jpg"),
  stylus_paper_screen: path.join(brainDir, "stylus_paper_screen_1791560596151.jpg"),
  offline_pdf_security: path.join(brainDir, "offline_pdf_security_1791560620494.jpg"),
  penalty_shootout_action: path.join(brainDir, "penalty_shootout_action_1791560644639.jpg"),
  cat_money_tracker: path.join(brainDir, "cat_money_tracker_1791560665020.jpg"),
  milo_cat_platformer: path.join(brainDir, "milo_cat_platformer_1791560691663.jpg"),
  monster_math_adventure: path.join(brainDir, "monster_math_adventure_1791560716644.jpg"),
  baby_shark_alphabet: path.join(brainDir, "baby_shark_alphabet_1791560739677.jpg"),
  fruity_merge_watermelon: path.join(brainDir, "fruity_merge_watermelon_1791560761459.jpg"),
};

// Map each file to its master image
const fileToMaster = {
  "offline-pdf.ts": "offline_pdf_security",
  "stickman-penalty.ts": "penalty_shootout_action",
  "kucing-atur-duit.ts": "cat_money_tracker",
  "milo-cat.ts": "milo_cat_platformer",
  "monster-math.ts": "monster_math_adventure",
  "baby-shark.ts": "baby_shark_alphabet",
  "fruity-merge.ts": "fruity_merge_watermelon",
};

// Specific slug overrides for amazon buyer guides
const slugToMaster = {
  "aksesoris-mobile-gaming-terbaik-2026-controller-cooler-finger-sleeves-earbuds": "mobile_gaming_gear",
  "tablet-edukasi-anak-stylus-pen-casing-tahan-banting-terbaik-2026": "kids_learning_tablet",
  "stylus-pen-presisi-pelindung-layar-tekstur-kertas-edit-pdf-android": "stylus_paper_screen",
};

async function compressImage(srcPath, destPath) {
  await sharp(srcPath)
    .resize(1200, 675, { fit: "cover" })
    .webp({ quality: 80, effort: 6 })
    .toFile(destPath);
  
  const stats = fs.statSync(destPath);
  return (stats.size / 1024).toFixed(1) + " KB";
}

async function main() {
  const dir = "src/data/articles";
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".ts") && f !== "types.ts" && f !== "index.ts" && f !== "published-gaming.ts");

  let count = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const slugMatches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)];

    for (const match of slugMatches) {
      const slug = match[1];
      const masterKey = slugToMaster[slug] || fileToMaster[file];
      if (!masterKey || !masterImages[masterKey]) {
        console.warn(`No master image for slug: ${slug} in ${file}`);
        continue;
      }

      const src = masterImages[masterKey];
      const dest = path.join(outDir, `${slug}.webp`);
      const sizeStr = await compressImage(src, dest);
      console.log(`✅ Compressed [${masterKey}] -> ${slug}.webp (${sizeStr})`);
      count++;
    }
  }

  console.log(`\n🎉 Processed and compressed ${count} article header images!`);
}

main().catch(console.error);
