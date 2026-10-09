import fs from "fs";

async function pingSearchEngines() {
  const host = "dluckyx.cloud";
  const key = "c4a3f81e9d9e4a3c8e4a9b5c2a1d0e8f";
  const keyLocation = `https://${host}/${key}.txt`;
  const sitemapUrl = `https://${host}/sitemap.xml`;

  console.log("=== SEO Fast Indexing & Ping Automation ===");
  console.log(`Target Domain: https://${host}`);
  console.log(`Sitemap: ${sitemapUrl}`);

  // Extract URLs from out/sitemap.xml or public
  let urls = [];
  const sitemapPath = fs.existsSync("out/sitemap.xml") ? "out/sitemap.xml" : null;

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
      `https://${host}/contact/`,
      `https://${host}/privacy/`,
      `https://${host}/terms/`,
    ];
  }

  console.log(`Discovered ${urls.length} URLs for submission.`);

  // 1. Submit to IndexNow (Bing, Yandex, Seznam, Naver)
  try {
    console.log("Submitting to IndexNow API (Bing, Yandex)...");
    const payload = {
      host,
      key,
      keyLocation,
      urlList: urls,
    };

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    console.log(`IndexNow Response status: ${res.status} (${res.statusText})`);
    if (res.status === 200 || res.status === 202) {
      console.log("SUCCESS: IndexNow accepted the URL batch for instant indexing!");
    } else {
      console.log("Notice: IndexNow returned code:", res.status);
    }
  } catch (err) {
    console.warn("Could not reach IndexNow endpoint (network may be offline or sandboxed):", err.message);
  }

  // 2. Google Sitemap Ping info
  console.log("\n--- Google Search Console Submission ---");
  console.log("Untuk mempercepat Google Search, lakukan 2 langkah berikut di Google Search Console:");
  console.log(`1. Buka https://search.google.com/search-console`);
  console.log(`2. Masukkan URL sitemap: ${sitemapUrl}`);
  console.log("3. Googlebot akan langsung menjadwalkan perayapan menyeluruh untuk seluruh 102 halaman.");
  console.log("===========================================");
}

pingSearchEngines().catch(console.error);
