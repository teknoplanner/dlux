import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const imgPath = "/Users/dederpl/.gemini/antigravity/brain/c566b64e-ba62-40db-b01f-e7c1306bbf4c/.user_uploaded/media_1791452562931_74a8f64e.png";

const iconDefs = [
  {
    slug: "offline-pdf-editor",
    name: "Offline PDF Editor & Sign",
    left: 40,
    top: 66,
    width: 108,
    height: 108,
  },
  {
    slug: "stickman-penalty-rush",
    name: "Stickman Penalty Rush",
    left: 164,
    top: 66,
    width: 108,
    height: 108,
  },
  {
    slug: "milo-cat-adventure",
    name: "Milo Cat Adventure",
    left: 288,
    top: 66,
    width: 108,
    height: 108,
  },
  {
    slug: "monster-math-train-brain",
    name: "Monster Math Train Brain",
    left: 412,
    top: 66,
    width: 108,
    height: 108,
  },
  {
    slug: "baby-shark-abc-kids-learning",
    name: "Baby Shark ABC: Kids Learning",
    left: 536,
    top: 66,
    width: 108,
    height: 108,
  },
  {
    slug: "fruity-merge-3d-match-puzzle",
    name: "Fruit Match: Memory Puzzle",
    left: 660,
    top: 66,
    width: 108,
    height: 108,
  },
  {
    slug: "kucing-atur-duit",
    name: "Kucing Atur Duit",
    left: 784,
    top: 66,
    width: 108,
    height: 108,
  },
];

async function extractIcons() {
  console.log("Extracting real Play Store icons from uploaded screenshot...");

  for (const icon of iconDefs) {
    const dir = path.join(process.cwd(), "public", "images", "apps", icon.slug);
    fs.mkdirSync(dir, { recursive: true });

    const outPath = path.join(dir, "icon.webp");

    await sharp(imgPath)
      .extract({
        left: icon.left,
        top: icon.top,
        width: icon.width,
        height: icon.height,
      })
      .resize(512, 512, {
        kernel: sharp.kernel.lanczos3,
        fit: "cover",
      })
      .webp({ quality: 95 })
      .toFile(outPath);

    console.log(`✓ Extracted icon for ${icon.name} -> ${outPath}`);
  }

  console.log("All 7 real Google Play icons extracted successfully!");
}

extractIcons().catch(console.error);
