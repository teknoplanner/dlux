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
  fn(m, m.exports, (id) => {
    if (id.startsWith("@/data/apps")) return loadTs("src/data/apps.ts");
    if (id.startsWith("./")) {
      const dir = path.dirname(filePath);
      const target = path.join(dir, id.endsWith(".ts") ? id : `${id}.ts`);
      return loadTs(target);
    }
    return {};
  });
  return m.exports;
}

try {
  const articlesDir = "src/data/articles";
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
  
  let allArticles = [];
  for (const file of files) {
    const mod = loadTs(path.join(articlesDir, file));
    const list = Object.values(mod).find((val) => Array.isArray(val));
    if (list) {
      allArticles.push(...list);
    }
  }

  // Sort by publishedDate desc
  allArticles.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  const baseUrl = "https://dluckyx.cloud";
  const now = new Date().toUTCString();

  const itemsXml = allArticles
    .map((art) => {
      const pubDate = new Date(art.publishedDate).toUTCString();
      const safeTitle = (art.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const safeDesc = (art.metaDescription || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const url = `${baseUrl}/blog/${art.slug}/`;

      return `    <item>
      <title>${safeTitle}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${safeDesc}</description>
      <author>developer@dluckyx.cloud (${art.author || "D Lucky X Team"})</author>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>D Lucky X | Android Games &amp; Apps Studio Blog</title>
    <link>${baseUrl}/</link>
    <description>Kumpulan panduan teknis, tips privasi Android, pembelajaran edukasi anak, dan strategi game offline dari D Lucky X.</description>
    <language>id</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  fs.writeFileSync("public/feed.xml", rssFeed);
  console.log(`Generated public/feed.xml with ${allArticles.length} articles.`);
} catch (err) {
  console.error("Error generating RSS feed:", err);
  process.exit(1);
}
