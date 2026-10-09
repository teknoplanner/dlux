import fs from "fs";
import path from "path";
import ts from "typescript";

function loadTs(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const m = { exports: {} };
  const fn = new Function("module", "exports", "require", result.outputText);
  fn(m, m.exports, () => ({}));
  return m.exports;
}

const queueDir = "src/data/articles/queue";
const publishedFile = "src/data/articles/published-gaming.ts";

const queueFiles = [
  { file: "mlbb-queue.ts", varName: "mlbbQueueArticles" },
  { file: "freefire-queue.ts", varName: "freefireQueueArticles" },
  { file: "roblox-queue.ts", varName: "robloxQueueArticles" },
  { file: "minecraft-queue.ts", varName: "minecraftQueueArticles" },
  { file: "genshin-queue.ts", varName: "genshinQueueArticles" },
  { file: "eafc-queue.ts", varName: "eafcQueueArticles" },
  { file: "battleroyale-queue.ts", varName: "battleroyaleQueueArticles" },
  { file: "gear-queue.ts", varName: "gearQueueArticles" },
  { file: "kidstech-queue.ts", varName: "kidstechQueueArticles" },
  { file: "productivity-queue.ts", varName: "productivityQueueArticles" },
];

async function main() {
  const now = new Date();
  console.log(`Checking article queue at: ${now.toISOString()} (${now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB)`);

  // Load currently published articles
  let currentPublished = [];
  if (fs.existsSync(publishedFile)) {
    const mod = loadTs(publishedFile);
    currentPublished = mod.publishedGamingArticles || [];
  }

  const newlyPublished = [];
  let totalRemaining = 0;

  for (const qf of queueFiles) {
    const filePath = path.join(queueDir, qf.file);
    if (!fs.existsSync(filePath)) continue;

    const mod = loadTs(filePath);
    const queueList = mod[qf.varName] || [];

    const remaining = [];
    for (const art of queueList) {
      const pubDate = new Date(art.publishedDate);
      if (pubDate.getTime() <= now.getTime()) {
        newlyPublished.push(art);
      } else {
        remaining.push(art);
      }
    }

    totalRemaining += remaining.length;

    // Overwrite queue file with remaining articles
    const newContent = `import { ArticleItem } from "../types";\n\nexport const ${qf.varName}: ArticleItem[] = ${JSON.stringify(remaining, null, 2)};\n`;
    fs.writeFileSync(filePath, newContent);
  }

  if (newlyPublished.length > 0) {
    console.log(`\nFound ${newlyPublished.length} articles due for release!`);
    for (const art of newlyPublished) {
      console.log(`  - [${art.category.toUpperCase()}] ${art.title} (${art.publishedDate})`);
    }

    // Append newly published to current published
    currentPublished.push(...newlyPublished);

    // Save published file
    const pubContent = `import { ArticleItem } from "./types";\n\nexport const publishedGamingArticles: ArticleItem[] = ${JSON.stringify(currentPublished, null, 2)};\n`;
    fs.writeFileSync(publishedFile, pubContent);
    console.log(`\nUpdated ${publishedFile} (Total published: ${currentPublished.length})`);
  } else {
    console.log("No articles due for publishing at this moment.");
  }

  console.log(`Total articles remaining in queue: ${totalRemaining}`);
}

main().catch(console.error);
