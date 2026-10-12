import fs from "fs";
import path from "path";
import sharp from "sharp";

async function optimizeFolder(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await optimizeFolder(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".webp") || entry.name.endsWith(".png"))) {
      const stats = fs.statSync(fullPath);
      const originalSize = stats.size;

      // Only optimize if > 30KB
      if (originalSize > 30 * 1024) {
        try {
          const image = sharp(fullPath);
          const meta = await image.metadata();

          let pipeline = sharp(fullPath);
          if (entry.name.startsWith("screenshot") && meta.width && meta.width > 720) {
            pipeline = pipeline.resize({ width: 720, withoutEnlargement: true });
          } else if (entry.name.startsWith("icon") && meta.width && meta.width > 256) {
            pipeline = pipeline.resize({ width: 256, withoutEnlargement: true });
          }

          const buffer = await pipeline
            .webp({ quality: 80, effort: 6 })
            .toBuffer();

          if (buffer.length < originalSize) {
            fs.writeFileSync(fullPath, buffer);
            console.log(
              `Optimized ${path.relative("public", fullPath)}: ${(originalSize / 1024).toFixed(1)} KB -> ${(buffer.length / 1024).toFixed(1)} KB (-${(((originalSize - buffer.length) / originalSize) * 100).toFixed(0)}%)`
            );
          }
        } catch (err) {
          console.warn(`Could not optimize ${fullPath}:`, err.message);
        }
      }
    }
  }
}

async function main() {
  console.log("Optimizing app images in public/images/apps...");
  await optimizeFolder(path.resolve("public/images/apps"));
  console.log("Done optimizing images!");
}

main();
