import fs from "fs";
import path from "path";

const dir = "src/data/articles";
const targetFiles = [
  "offline-pdf.ts",
  "stickman-penalty.ts",
  "kucing-atur-duit.ts",
  "milo-cat.ts",
  "monster-math.ts",
  "baby-shark.ts",
  "fruity-merge.ts",
  "amazon-buyer-guides.ts",
];

for (const file of targetFiles) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Regex to match each article block having slug: "..." and coverImage: "..."
  // We want to replace coverImage: "..." with coverImage: `/images/blog/${slug}.webp`
  
  // Find all slug and coverImage pairs
  const articleBlocks = content.split(/(?=\{\s*slug:\s*["'])/);
  
  const updatedBlocks = articleBlocks.map((block) => {
    const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);
    if (!slugMatch) return block;
    const slug = slugMatch[1];
    const newCover = `/images/blog/${slug}.webp`;
    
    // Replace coverImage
    return block.replace(/coverImage:\s*["'][^"']+["']/, `coverImage: "${newCover}"`);
  });

  const newContent = updatedBlocks.join("");
  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`Updated coverImage in ${file}`);
}
