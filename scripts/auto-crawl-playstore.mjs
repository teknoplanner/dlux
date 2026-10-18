import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import sharp from "sharp";

const DEVELOPER_PAGE_URL = "https://play.google.com/store/apps/dev?id=5090788794635737630&hl=en";
const APPS_FILE_PATH = path.join(process.cwd(), "src", "data", "apps.ts");
const PLAYSTORE_JSON_PATH = path.join(process.cwd(), "scripts", "playstore-full.json");

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const ACCENT_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Purple / Violet
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#f97316", // Orange
];

function cleanText(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[—–]/g, " - ")
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .trim();
}

function generateSlug(title, packageId) {
  // If packageId ends with a specific name like com.soundfx.studio -> soundfx-studio
  const pkgParts = packageId.split(".");
  const lastParts = pkgParts.slice(-2).join("-").replace(/[^a-z0-9-]/gi, "");

  const titleSlug = title
    .toLowerCase()
    .split(/[-–—:|]/)[0] // Take before separator e.g. "SoundFX Studio"
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30)
    .replace(/-+$/, "");

  if (titleSlug && titleSlug.length >= 3) {
    return titleSlug;
  }
  return lastParts.toLowerCase();
}

function detectCategory(genre) {
  const g = (Array.isArray(genre) ? JSON.stringify(genre) : String(genre || "")).toUpperCase();
  if (
    g.includes("GAME") ||
    g.includes("ARCADE") ||
    g.includes("ACTION") ||
    g.includes("PUZZLE") ||
    g.includes("SPORTS") ||
    g.includes("ADVENTURE") ||
    g.includes("SIMULATION")
  ) {
    return "game";
  }
  if (g.includes("EDUCATION") || g.includes("KIDS") || g.includes("FAMILY")) {
    return "education";
  }
  return "tool";
}

function extractFeaturesAndTags(name, description, category) {
  const lines = description.split("\n").map((l) => l.trim()).filter(Boolean);
  const bulletCandidates = [];

  for (const line of lines) {
    if (/^(key\s+features|features|highlight):?$/i.test(line.replace(/^[^\w]+/g, "").trim())) {
      continue;
    }
    // lines that start with emoji, bullet point, dash, number, checkmark
    if (/^[•\-*✅🌟🚀✨🎙️🔍⚡⚙️📁🔒🖋️📝📑🗜️🖼️💧📄\d+.]\s*/.test(line)) {
      const cleaned = cleanText(line.replace(/^[•\-*✅🌟🚀✨🎙️🔍⚡⚙️📁🔒🖋️📝📑🗜️🖼️💧📄\d+.]\s*/, ""));
      if (
        cleaned.length > 15 &&
        cleaned.length < 120 &&
        !bulletCandidates.includes(cleaned) &&
        !/features:?$/i.test(cleaned)
      ) {
        bulletCandidates.push(cleaned);
      }
    }
  }

  // Fallback if no bullet points found in description
  const defaultFeatures = [
    `Lightning-fast and user-friendly experience designed for Android devices`,
    `100% on-device private processing with zero personal data tracking`,
    `Seamless offline accessibility without requiring persistent internet connection`,
    `Regular updates with continuous performance enhancements`,
  ];

  const features = bulletCandidates.length >= 3 ? bulletCandidates.slice(0, 4) : defaultFeatures;

  const tagCandidates = new Set();
  name.split(/[\s\-–—:]+/).forEach((w) => {
    const cleanW = w.replace(/[^a-zA-Z]/g, "");
    if (cleanW.length >= 3 && !["and", "the", "for", "with", "app"].includes(cleanW.toLowerCase())) {
      tagCandidates.add(cleanW);
    }
  });

  if (category === "tool") tagCandidates.add("Productivity");
  if (category === "game") tagCandidates.add("Arcade");
  if (category === "education") tagCandidates.add("Learning");
  tagCandidates.add("Offline");

  const tags = Array.from(tagCandidates).slice(0, 5);

  return { features, tags };
}

async function downloadAndOptimizeImage(srcUrl, outPath, width, height, fit = "cover") {
  let fullUrl = srcUrl;
  if (fullUrl.includes("=")) {
    fullUrl = fullUrl.replace(/=[^=]+$/, `=w${width * 2}-h${height * 2}-rw`);
  } else {
    fullUrl = `${fullUrl}=w${width * 2}-h${height * 2}-rw`;
  }

  let res;
  try {
    res = await fetch(fullUrl, {
      headers: { "User-Agent": USER_AGENT },
    });
  } catch (err) {
    res = null;
  }

  if (!res || !res.ok) {
    res = await fetch(srcUrl, { headers: { "User-Agent": USER_AGENT } });
  }

  if (!res.ok) {
    throw new Error(`Failed to download ${srcUrl}: HTTP ${res.status}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(width, height, { fit, kernel: sharp.kernel.lanczos3, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(outPath);
}

async function fetchPlayStoreApp(packageId) {
  const url = `https://play.google.com/store/apps/details?id=${packageId}&hl=en`;
  console.log(`  Fetching Play Store details for ${packageId}...`);

  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const html = await res.text();

  const regex = /AF_initDataCallback\(\{key:\s*['"]ds:5['"][\s\S]*?data:([\s\S]*?),\s*sideChannel:/;
  const match = regex.exec(html);

  if (!match) {
    throw new Error(`Could not find ds:5 in HTML for ${packageId}`);
  }

  const d5 = JSON.parse(match[1]);

  const title = d5[1]?.[2]?.[0]?.[0] || packageId;
  const tagline = d5[1]?.[2]?.[73]?.[0]?.[1] || "";
  let rawDesc = d5[1]?.[2]?.[72]?.[0]?.[1] || "";
  let cleanDesc = rawDesc
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();

  const downloads = d5[1]?.[2]?.[13]?.[0] || "10+";
  const contentRating = d5[1]?.[2]?.[9]?.[0]
    ? d5[1][2][9][0].replace(/^Rated (?:for )?/i, "").replace("Rating ", "").trim()
    : "3+";

  let rating = null;
  let reviewsCount = null;
  if (d5[1]?.[2]?.[51]?.[0]?.[1]) {
    rating = parseFloat(Number(d5[1][2][51][0][1]).toFixed(1));
  }
  if (d5[1]?.[2]?.[51]?.[2]?.[1]) {
    reviewsCount = d5[1][2][51][2][1];
  }

  // Genre / Category
  const genre = d5[1]?.[2]?.[79]?.[0]?.[0] || "TOOLS";

  // Icon
  const iconUrl = d5[1]?.[2]?.[95]?.[0]?.[3]?.[2] || null;

  // Screenshots
  const rawScreenshots = d5[1]?.[2]?.[78]?.[0] || [];
  const screenshotUrls = Array.from(
    new Set(rawScreenshots.map((s) => s?.[3]?.[2]).filter(Boolean))
  );

  return {
    packageId,
    name: cleanText(title),
    tagline: cleanText(tagline || cleanDesc.split("\n")[0].slice(0, 120)),
    description: cleanDesc,
    downloads,
    contentRating,
    rating: rating || 5.0,
    reviewsCount,
    genre,
    iconUrl,
    screenshotUrls,
    playUrl: `https://play.google.com/store/apps/details?id=${packageId}`,
  };
}

async function discoverDeveloperPackages() {
  console.log(`\n[1/4] Discovering apps from developer page: ${DEVELOPER_PAGE_URL}...`);
  try {
    const res = await fetch(DEVELOPER_PAGE_URL, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      console.warn(`[WARN] Developer page fetch returned HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const matches = [...html.matchAll(/\/store\/apps\/details\?id=([a-zA-Z0-9._]+)/g)].map(
      (m) => m[1]
    );

    const uniquePackages = Array.from(new Set(matches));
    console.log(`  Found ${uniquePackages.length} package IDs on developer page:`, uniquePackages);
    return uniquePackages;
  } catch (err) {
    console.error("[ERROR] Failed to discover apps from developer page:", err.message);
    return [];
  }
}

async function main() {
  console.log("===============================================================");
  console.log("  D Lucky X - Google Play Store Auto-Crawler Job");
  console.log("===============================================================");

  // Read current apps from apps.ts
  const appsFileContent = fs.readFileSync(APPS_FILE_PATH, "utf8");
  const appsMatch = appsFileContent.match(/export const apps: AppItem\[\] = (\[[\s\S]*?\]);\s*$/);
  if (!appsMatch) {
    console.error("Could not find apps array in src/data/apps.ts");
    process.exit(1);
  }

  const currentApps = JSON.parse(appsMatch[1]);
  const existingPkgMap = new Map();
  for (const app of currentApps) {
    existingPkgMap.set(app.packageId, app);
  }

  // 1. Discover packages on Play Store developer profile
  const discoveredPkgIds = await discoverDeveloperPackages();

  // Combine discovered packages with all existing packages to make sure none get dropped
  const allTargetPackages = Array.from(
    new Set([...discoveredPkgIds, ...currentApps.map((a) => a.packageId)])
  );

  console.log(`\n[2/4] Total unique applications to process: ${allTargetPackages.length}`);

  let addedCount = 0;
  let updatedCount = 0;
  const scrapedAppsData = [];

  for (let i = 0; i < allTargetPackages.length; i++) {
    const packageId = allTargetPackages[i];
    console.log(`\n--- [${i + 1}/${allTargetPackages.length}] Processing ${packageId} ---`);

    try {
      const details = await fetchPlayStoreApp(packageId);
      scrapedAppsData.push(details);

      let appEntry = existingPkgMap.get(packageId);

      if (!appEntry) {
        // --- NEW APP DETECTED ---
        console.log(`  🎉 NEW APPLICATION DETECTED: "${details.name}" (${packageId})`);
        const slug = generateSlug(details.name, packageId);
        const category = detectCategory(details.genre);
        const { features, tags } = extractFeaturesAndTags(
          details.name,
          details.description,
          category
        );
        const color = ACCENT_COLORS[currentApps.length % ACCENT_COLORS.length];

        const appDir = path.join(process.cwd(), "public", "images", "apps", slug);
        fs.mkdirSync(appDir, { recursive: true });

        // Download Icon
        const iconRelPath = `/images/apps/${slug}/icon.webp`;
        if (details.iconUrl) {
          const iconFullPath = path.join(appDir, "icon.webp");
          console.log(`  Downloading real icon -> ${iconRelPath}`);
          await downloadAndOptimizeImage(details.iconUrl, iconFullPath, 512, 512, "cover");
        }

        // Download Screenshots (up to 4)
        const screenshots = [];
        const shotsToDownload = details.screenshotUrls.slice(0, 4);
        for (let sIdx = 0; sIdx < shotsToDownload.length; sIdx++) {
          const shotUrl = shotsToDownload[sIdx];
          const shotRelPath = `/images/apps/${slug}/screenshot-${sIdx + 1}.webp`;
          const shotFullPath = path.join(appDir, `screenshot-${sIdx + 1}.webp`);
          console.log(`  Downloading screenshot ${sIdx + 1} -> ${shotRelPath}`);
          await downloadAndOptimizeImage(shotUrl, shotFullPath, 1080, 1920, "inside");
          screenshots.push(shotRelPath);
        }

        appEntry = {
          slug,
          name: details.name,
          packageId,
          tagline: details.tagline,
          description: details.description,
          category,
          tags,
          features,
          icon: iconRelPath,
          screenshots,
          rating: details.rating,
          reviewsCount: details.reviewsCount,
          downloads: details.downloads,
          contentRating: details.contentRating,
          hasAds: false,
          playUrl: details.playUrl,
          color,
        };

        currentApps.push(appEntry);
        existingPkgMap.set(packageId, appEntry);
        addedCount++;
      } else {
        // --- EXISTING APP UPDATE METRICS ---
        let changed = false;
        if (details.rating && appEntry.rating !== details.rating) {
          console.log(`  ★ Rating changed: ${appEntry.rating} -> ${details.rating}`);
          appEntry.rating = details.rating;
          changed = true;
        }
        if (details.reviewsCount !== undefined && appEntry.reviewsCount !== details.reviewsCount) {
          console.log(`  💬 Reviews changed: ${appEntry.reviewsCount} -> ${details.reviewsCount}`);
          appEntry.reviewsCount = details.reviewsCount;
          changed = true;
        }
        if (details.downloads && appEntry.downloads !== details.downloads) {
          console.log(`  📥 Downloads changed: ${appEntry.downloads} -> ${details.downloads}`);
          appEntry.downloads = details.downloads;
          changed = true;
        }

        // Check if icons or screenshots are missing on disk
        const appDir = path.join(process.cwd(), "public", "images", "apps", appEntry.slug);
        const iconFullPath = path.join(appDir, "icon.webp");
        if (!fs.existsSync(iconFullPath) && details.iconUrl) {
          fs.mkdirSync(appDir, { recursive: true });
          console.log(`  Re-downloading missing icon -> ${iconFullPath}`);
          await downloadAndOptimizeImage(details.iconUrl, iconFullPath, 512, 512, "cover");
          changed = true;
        }

        if (changed) {
          updatedCount++;
        }
      }
    } catch (err) {
      console.error(`  [ERROR] Failed processing ${packageId}:`, err.message);
    }

    // Friendly delay
    await new Promise((r) => setTimeout(r, 600));
  }

  // 3. Save raw scraped data to scripts/playstore-full.json
  console.log(`\n[3/4] Saving scraped metadata to ${PLAYSTORE_JSON_PATH}...`);
  fs.writeFileSync(PLAYSTORE_JSON_PATH, JSON.stringify(scrapedAppsData, null, 2), "utf8");

  // 4. Update src/data/apps.ts
  console.log(`\n[4/4] Updating ${APPS_FILE_PATH}...`);
  const newAppsJson = JSON.stringify(currentApps, null, 2);
  const updatedFileContent = appsFileContent.replace(
    /export const apps: AppItem\[\] = \[[\s\S]*?\];\s*$/,
    `export const apps: AppItem[] = ${newAppsJson};\n`
  );

  fs.writeFileSync(APPS_FILE_PATH, updatedFileContent, "utf8");

  console.log("\n===============================================================");
  console.log(`Auto-Crawl Summary:`);
  console.log(`  - Newly Published Apps Added: ${addedCount}`);
  console.log(`  - Existing Apps Updated:      ${updatedCount}`);
  console.log(`  - Total Active Apps:          ${currentApps.length}`);
  console.log("===============================================================");

  if (addedCount > 0 || updatedCount > 0) {
    console.log("Regenerating sitemap & RSS feed...");
    try {
      execSync("node scripts/generate-rss.mjs", { stdio: "inherit" });
      execSync("node scripts/generate-sitemap.mjs", { stdio: "inherit" });
    } catch (e) {
      console.warn("Could not regenerate rss/sitemap:", e.message);
    }
  }

  console.log("Auto-crawl job completed successfully!\n");
}

main().catch((err) => {
  console.error("FATAL ERROR in auto-crawl script:", err);
  process.exit(1);
});
