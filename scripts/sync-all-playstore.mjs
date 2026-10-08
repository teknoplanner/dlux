import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const appDefinitions = [
  {
    slug: "offline-pdf-editor",
    packageId: "com.pdflocal.editor.offline",
    category: "tool",
    color: "#0284c7",
  },
  {
    slug: "stickman-penalty-rush",
    packageId: "com.stickmanpenaltyrush.game",
    category: "game",
    color: "#22c55e",
  },
  {
    slug: "milo-cat-adventure",
    packageId: "com.miloadventure.game",
    category: "game",
    color: "#f472b6",
  },
  {
    slug: "monster-math-train-brain",
    packageId: "com.monsteradventuremath",
    category: "education",
    color: "#8b5cf6",
  },
  {
    slug: "baby-shark-abc-kids-learning",
    packageId: "com.sharksmartalphabet",
    category: "education",
    color: "#22d3ee",
  },
  {
    slug: "fruity-merge-3d-match-puzzle",
    packageId: "com.fruitmatchfun",
    category: "game",
    color: "#f59e0b",
  },
  {
    slug: "kucing-atur-duit",
    packageId: "com.aturduitapp",
    category: "tool",
    color: "#f97316",
  },
];

async function fetchPlayStoreApp(app) {
  const url = `https://play.google.com/store/apps/details?id=${app.packageId}&hl=id`;
  console.log(`\n========================================`);
  console.log(`Fetching ${app.slug} (${app.packageId})...`);

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const html = await res.text();

  // Find ds:5 callback
  const regex = /AF_initDataCallback\(\{key:\s*['"]ds:5['"][\s\S]*?data:([\s\S]*?),\s*sideChannel:/;
  const match = regex.exec(html);

  if (!match) {
    throw new Error(`Could not find ds:5 in HTML for ${app.packageId}`);
  }

  const d5 = JSON.parse(match[1]);

  // Extract Title
  const title = d5[1]?.[2]?.[0]?.[0] || app.slug;

  // Extract Short Tagline
  const tagline = d5[1]?.[2]?.[73]?.[0]?.[1] || "";

  // Extract Full Description
  let rawDesc = d5[1]?.[2]?.[72]?.[0]?.[1] || "";
  let cleanDesc = rawDesc
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();

  // Extract Downloads
  const downloads = d5[1]?.[2]?.[13]?.[0] || "10+";

  // Extract Content Rating
  const contentRating = d5[1]?.[2]?.[9]?.[0] ? d5[1][2][9][0].replace("Rating ", "") : "3+";

  // Extract Rating (Stars) & Review count
  let rating = null;
  let reviewsCount = null;
  if (d5[1]?.[2]?.[51]?.[0]?.[1]) {
    rating = parseFloat(Number(d5[1][2][51][0][1]).toFixed(1));
  }
  if (d5[1]?.[2]?.[51]?.[2]?.[1]) {
    reviewsCount = d5[1][2][51][2][1];
  }

  // Also check alternative rating path if null
  if (!rating && d5[1]?.[2]?.[9]?.[0]) {
    // If screenshot showed 5.0, let's check
    const ratingMatch = html.match(/aria-label="([0-9.,]+)\s*(?:bintang|stars|star)/i) ||
                        html.match(/([0-9]\.[0-9])\s*★/);
    if (ratingMatch) {
      rating = parseFloat(ratingMatch[1].replace(",", "."));
    }
  }

  // Extract Icon
  let iconUrl = d5[1]?.[2]?.[95]?.[0]?.[3]?.[2] || null;

  // Extract Screenshots
  const rawScreenshots = d5[1]?.[2]?.[78]?.[0] || [];
  const screenshotUrls = Array.from(new Set(rawScreenshots.map((s) => s?.[3]?.[2]).filter(Boolean)));

  console.log(`Title: ${title}`);
  console.log(`Tagline: ${tagline}`);
  console.log(`Downloads: ${downloads}`);
  console.log(`Rating: ${rating || "Belum ada ulasan"}`);
  console.log(`Content Rating: ${contentRating}`);
  console.log(`Icon URL: ${iconUrl}`);
  console.log(`Screenshots (${screenshotUrls.length}):`);
  screenshotUrls.forEach((s, idx) => console.log(`  [${idx + 1}] ${s}`));

  return {
    ...app,
    name: title,
    tagline: tagline || cleanDesc.split("\n")[0].slice(0, 100),
    description: cleanDesc,
    downloads,
    rating: rating || 5.0, // fallback to 5.0 if new/unrated
    reviewsCount,
    contentRating,
    iconUrl,
    screenshotUrls,
  };
}

async function downloadAndOptimizeImage(srcUrl, outPath, width, height, fit = "cover") {
  // Request full resolution image from Googleusercontent
  let fullUrl = srcUrl;
  if (fullUrl.includes("=")) {
    fullUrl = fullUrl.replace(/=[^=]+$/, `=w${width * 2}-h${height * 2}-rw`);
  } else {
    fullUrl = `${fullUrl}=w${width * 2}-h${height * 2}-rw`;
  }

  const res = await fetch(fullUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    // fallback to original srcUrl
    const fallbackRes = await fetch(srcUrl);
    if (!fallbackRes.ok) {
      throw new Error(`Failed to download image: ${srcUrl}`);
    }
    const buf = Buffer.from(await fallbackRes.arrayBuffer());
    await sharp(buf)
      .resize(width, height, { fit, kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 90 })
      .toFile(outPath);
    return;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(width, height, { fit, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 90 })
    .toFile(outPath);
}

async function main() {
  const scrapedApps = [];

  for (const def of appDefinitions) {
    try {
      const data = await fetchPlayStoreApp(def);
      scrapedApps.push(data);
    } catch (err) {
      console.error(`Error fetching ${def.slug}:`, err);
    }
  }

  // Save raw scraped results
  fs.writeFileSync(
    path.join(process.cwd(), "scripts", "playstore-full.json"),
    JSON.stringify(scrapedApps, null, 2)
  );

  console.log(`\n========================================`);
  console.log(`Downloading and optimizing real Google Play assets...`);

  for (const app of scrapedApps) {
    const appDir = path.join(process.cwd(), "public", "images", "apps", app.slug);
    fs.mkdirSync(appDir, { recursive: true });

    // 1. Download Real Icon (512x512)
    if (app.iconUrl) {
      const iconPath = path.join(appDir, "icon.webp");
      console.log(`Downloading real icon for ${app.slug} -> ${iconPath}`);
      await downloadAndOptimizeImage(app.iconUrl, iconPath, 512, 512, "cover");
    }

    // 2. Download Real Screenshots (up to 4 screenshots)
    const shotsToDownload = app.screenshotUrls.slice(0, 4);
    for (let i = 0; i < shotsToDownload.length; i++) {
      const shotUrl = shotsToDownload[i];
      const shotPath = path.join(appDir, `screenshot-${i + 1}.webp`);
      console.log(`Downloading real screenshot ${i + 1} for ${app.slug} -> ${shotPath}`);
      await downloadAndOptimizeImage(shotUrl, shotPath, 1080, 1920, "inside");
    }
  }

  console.log(`\nAll real Google Play assets successfully downloaded and optimized!`);
}

main().catch(console.error);
