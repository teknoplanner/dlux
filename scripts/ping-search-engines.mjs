import fs from "fs";

async function pingSearchEngines() {
  const host = "dluckyx.cloud";
  const key = "c4a3f81e9d9e4a3c8e4a9b5c2a1d0e8f";
  const keyLocation = `https://${host}/${key}.txt`;
  const sitemapUrl = `https://${host}/sitemap.xml`;

  console.log("=== SEO Fast Indexing & Ping Automation (IndexNow) ===");
  console.log(`Target Domain: https://${host}`);
  console.log(`IndexNow Key: ${key}`);
  console.log(`Key Location: ${keyLocation}`);
  console.log(`Sitemap: ${sitemapUrl}`);

  // Extract URLs from out/sitemap.xml or public/sitemap.xml
  let urls = [];
  const sitemapPath = fs.existsSync("out/sitemap.xml")
    ? "out/sitemap.xml"
    : fs.existsSync("public/sitemap.xml")
    ? "public/sitemap.xml"
    : null;

  if (sitemapPath) {
    const xml = fs.readFileSync(sitemapPath, "utf-8");
    const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
    urls = locMatches.map((m) => m[1]);
  }

  if (urls.length === 0) {
    // Fallback baseline URLs if sitemap file not yet generated
    urls = [
      `https://${host}/`,
      `https://${host}/blog/`,
      `https://${host}/en/blog/`,
      `https://${host}/gear/`,
      `https://${host}/en/gear/`,
      `https://${host}/contact/`,
      `https://${host}/privacy/`,
      `https://${host}/terms/`,
    ];
  }

  console.log(`Discovered ${urls.length} URLs for submission.`);

  // 1. Submit to IndexNow API (Bing, Yandex, Seznam, Naver)
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  let indexNowSuccess = false;
  for (const endpoint of endpoints) {
    try {
      console.log(`Submitting to IndexNow API (${endpoint})...`);
      const payload = {
        host,
        key,
        keyLocation,
        urlList: urls,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });

      console.log(`IndexNow Response status: ${res.status} (${res.statusText})`);
      if (res.status === 200 || res.status === 202) {
        console.log(`SUCCESS: IndexNow endpoint (${endpoint}) accepted all ${urls.length} URLs for instant indexing!`);
        indexNowSuccess = true;
        break;
      } else {
        console.log(`Notice: ${endpoint} returned code: ${res.status}`);
      }
    } catch (err) {
      console.warn(`Could not reach ${endpoint} (network may be offline or sandboxed):`, err.message);
    }
  }

  if (!indexNowSuccess) {
    console.log("Catatan: Ping IndexNow otomatis berjalan di GitHub Actions saat deploy website.");
  }

  // 2. Google Search Console Submission info
  console.log("\n--- Google Search Console Submission ---");
  console.log("Untuk mempercepat perayapan Google Search:");
  console.log(`1. Buka https://search.google.com/search-console`);
  console.log(`2. Submit URL sitemap: ${sitemapUrl}`);
  console.log(`3. Googlebot akan langsung merayapi seluruh ${urls.length} halaman.`);
  console.log("===========================================");
}

pingSearchEngines().catch(console.error);
