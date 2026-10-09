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
if (!fs.existsSync(queueDir)) {
  fs.mkdirSync(queueDir, { recursive: true });
}

// Load mlbbArticles
const mlbbMod = loadTs("src/data/articles/mlbb.ts");
const allMlbb = mlbbMod.mlbbArticles || [];

const firstArticle = allMlbb[0];
const queuedMlbb = allMlbb.slice(1);

console.log(`MLBB Total: ${allMlbb.length}, Keeping: 1, Queued: ${queuedMlbb.length}`);

// Save queued mlbb
fs.writeFileSync(
  path.join(queueDir, "mlbb-queue.ts"),
  `import { ArticleItem } from "../types";\n\nexport const mlbbQueueArticles: ArticleItem[] = ${JSON.stringify(queuedMlbb, null, 2)};\n`
);

// Move other files to queue
const otherFiles = [
  { from: "src/data/articles/free-fire.ts", to: "src/data/articles/queue/freefire-queue.ts", exportName: "freefireQueueArticles" },
  { from: "src/data/articles/roblox.ts", to: "src/data/articles/queue/roblox-queue.ts", exportName: "robloxQueueArticles" },
  { from: "src/data/articles/minecraft.ts", to: "src/data/articles/queue/minecraft-queue.ts", exportName: "minecraftQueueArticles" },
  { from: "src/data/articles/genshin-eafc.ts", to: "src/data/articles/queue/genshineafc-queue.ts", exportName: "genshineafcQueueArticles" },
];

for (const item of otherFiles) {
  if (fs.existsSync(item.from)) {
    const mod = loadTs(item.from);
    const list = Object.values(mod).find((val) => Array.isArray(val)) || [];
    fs.writeFileSync(
      item.to,
      `import { ArticleItem } from "../types";\n\nexport const ${item.exportName}: ArticleItem[] = ${JSON.stringify(list, null, 2)};\n`
    );
    fs.unlinkSync(item.from);
    console.log(`Moved ${item.from} -> ${item.to} (${list.length} articles)`);
  }
}

// Remove old mlbb.ts
if (fs.existsSync("src/data/articles/mlbb.ts")) {
  fs.unlinkSync("src/data/articles/mlbb.ts");
}

// Create index.ts inside queue for reference
fs.writeFileSync(
  path.join(queueDir, "index.ts"),
  `import { mlbbQueueArticles } from "./mlbb-queue";
import { freefireQueueArticles } from "./freefire-queue";
import { robloxQueueArticles } from "./roblox-queue";
import { minecraftQueueArticles } from "./minecraft-queue";
import { genshineafcQueueArticles } from "./genshineafc-queue";

export const queuedArticles = [
  ...mlbbQueueArticles,
  ...freefireQueueArticles,
  ...robloxQueueArticles,
  ...minecraftQueueArticles,
  ...genshineafcQueueArticles,
];
`
);

console.log("Migration complete!");
