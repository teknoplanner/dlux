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
  const baseUrl = "https://dluckyx.cloud";
  const nowIso = new Date().toISOString();

  // 1. Load apps
  const appsMod = loadTs("src/data/apps.ts");
  const appsList = appsMod.apps || [];

  // 2. Load articles
  const articlesDir = "src/data/articles";
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  
  let allArticles = [];
  for (const file of files) {
    const mod = loadTs(path.join(articlesDir, file));
    const list = Object.values(mod).find((val) => Array.isArray(val));
    if (list) {
      allArticles.push(...list);
    }
  }

  // Sort articles by publishedDate desc
  allArticles.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  const urls = [];

  // Helper function to create URL XML entry
  function addUrl(loc, lastmod, changefreq, priority, alts = []) {
    let xml = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>`;
    if (alts && alts.length > 0) {
      for (const alt of alts) {
        xml += `\n    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`;
      }
    }
    xml += `\n  </url>`;
    urls.push(xml);
  }

  // Static Routes
  addUrl(`${baseUrl}/`, nowIso, "daily", "1.0");

  addUrl(`${baseUrl}/blog/`, nowIso, "daily", "0.8", [
    { lang: "id", href: `${baseUrl}/blog/` },
    { lang: "en", href: `${baseUrl}/en/blog/` },
  ]);

  addUrl(`${baseUrl}/en/blog/`, nowIso, "daily", "0.8", [
    { lang: "en", href: `${baseUrl}/en/blog/` },
    { lang: "id", href: `${baseUrl}/blog/` },
  ]);

  addUrl(`${baseUrl}/gear/`, nowIso, "weekly", "0.8", [
    { lang: "id", href: `${baseUrl}/gear/` },
    { lang: "en", href: `${baseUrl}/en/gear/` },
  ]);

  addUrl(`${baseUrl}/en/gear/`, nowIso, "weekly", "0.8", [
    { lang: "en", href: `${baseUrl}/en/gear/` },
    { lang: "id", href: `${baseUrl}/gear/` },
  ]);

  addUrl(`${baseUrl}/hardware/`, nowIso, "weekly", "0.7", [
    { lang: "id", href: `${baseUrl}/hardware/` },
    { lang: "en", href: `${baseUrl}/en/hardware/` },
  ]);

  addUrl(`${baseUrl}/en/hardware/`, nowIso, "weekly", "0.7", [
    { lang: "en", href: `${baseUrl}/en/hardware/` },
    { lang: "id", href: `${baseUrl}/hardware/` },
  ]);

  addUrl(`${baseUrl}/privacy/`, nowIso, "monthly", "0.7");
  addUrl(`${baseUrl}/contact/`, nowIso, "monthly", "0.7");
  addUrl(`${baseUrl}/terms/`, nowIso, "monthly", "0.7");

  // App Routes
  for (const app of appsList) {
    addUrl(`${baseUrl}/apps/${app.slug}/`, nowIso, "weekly", "0.9");
  }

  // Indonesian Blog Articles
  for (const art of allArticles) {
    const artDate = new Date(art.publishedDate).toISOString();
    const slugEn = art.slugEn || art.slug;
    addUrl(`${baseUrl}/blog/${art.slug}/`, artDate, "weekly", "0.8", [
      { lang: "id", href: `${baseUrl}/blog/${art.slug}/` },
      { lang: "en", href: `${baseUrl}/en/blog/${slugEn}/` },
    ]);
  }

  // English Blog Articles
  for (const art of allArticles) {
    const artDate = new Date(art.publishedDate).toISOString();
    const slugEn = art.slugEn || art.slug;
    addUrl(`${baseUrl}/en/blog/${slugEn}/`, artDate, "weekly", "0.8", [
      { lang: "en", href: `${baseUrl}/en/blog/${slugEn}/` },
      { lang: "id", href: `${baseUrl}/blog/${art.slug}/` },
    ]);
  }

  // Privacy Policy Routes
  for (const app of appsList) {
    addUrl(`${baseUrl}/privacy/${app.slug}/`, nowIso, "monthly", "0.6");
  }

  // Terms of Service Routes
  for (const app of appsList) {
    addUrl(`${baseUrl}/terms/${app.slug}/`, nowIso, "monthly", "0.6");
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

  fs.writeFileSync("public/sitemap.xml", sitemapXml);
  console.log(`Generated public/sitemap.xml with ${urls.length} URLs.`);
} catch (err) {
  console.error("Error generating sitemap:", err);
  process.exit(1);
}
