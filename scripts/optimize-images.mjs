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

      try {
        const image = sharp(fullPath);
        const meta = await image.metadata();

        let pipeline = sharp(fullPath);
        let shouldProcess = false;

        if (entry.name.startsWith("screenshot")) {
          if (meta.width && meta.width > 580) {
            pipeline = pipeline.resize({ width: 580, withoutEnlargement: true });
            shouldProcess = true;
          } else if (originalSize > 50 * 1024) {
            shouldProcess = true;
          }
        } else if (entry.name.startsWith("icon")) {
          if (meta.width && meta.width > 128) {
            pipeline = pipeline.resize({ width: 128, height: 128, fit: "cover" });
            shouldProcess = true;
          } else if (originalSize > 15 * 1024) {
            shouldProcess = true;
          }
        }

        if (shouldProcess) {
          const buffer = await pipeline
            .webp({ quality: 75, effort: 6 })
            .toBuffer();

          if (buffer.length < originalSize) {
            fs.writeFileSync(fullPath, buffer);
            console.log(
              `Optimized ${path.relative("public", fullPath)}: ${(originalSize / 1024).toFixed(1)} KB -> ${(buffer.length / 1024).toFixed(1)} KB (-${(((originalSize - buffer.length) / originalSize) * 100).toFixed(0)}%)`
            );
          }
        }
      } catch (err) {
        console.warn(`Could not optimize ${fullPath}:`, err.message);
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
