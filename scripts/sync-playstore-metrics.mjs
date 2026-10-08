import fs from "node:fs";
import path from "node:path";

const appsFilePath = path.join(process.cwd(), "src", "data", "apps.ts");
const appsFileContent = fs.readFileSync(appsFilePath, "utf8");

// Parse existing apps from apps.ts
const appsMatch = appsFileContent.match(/export const apps: AppItem\[\] = (\[[\s\S]*?\]);\s*$/);
if (!appsMatch) {
  console.error("Could not find apps array in src/data/apps.ts");
  process.exit(1);
}

const currentApps = JSON.parse(appsMatch[1]);

async function fetchPlayStoreStats(packageId) {
  const url = `https://play.google.com/store/apps/details?id=${packageId}&hl=en`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      console.warn(`[WARN] Failed to fetch ${packageId}: HTTP ${res.status}`);
      return null;
    }

    const html = await res.text();

    // Extract Rating: e.g. "5.0star" or "aria-label=\"Rated 5.0 stars out of five stars\""
    let rating = null;
    const ratingMatch = html.match(/aria-label="Rated ([0-9.]+) stars out of five stars"/i) ||
                        html.match(/<div class="TT92bc">([0-9.]+)<\/div>/);
    if (ratingMatch) {
      rating = parseFloat(ratingMatch[1]);
    }

    // Extract Reviews Count: e.g. "10 reviews" or "10 ulasan"
    let reviewsCount = null;
    const reviewMatch = html.match(/([0-9,]+)\s+reviews/i) ||
                        html.match(/([0-9,]+)\s+ulasan/i);
    if (reviewMatch) {
      reviewsCount = parseInt(reviewMatch[1].replace(/,/g, ""), 10);
    }

    // Extract Downloads: e.g. "500+ Downloads" or "10+ Downloads"
    let downloads = null;
    const dlMatch = html.match(/<div class="ClM7O">([0-9KkMm+]+)<\/div><div class="g1rdde">Downloads<\/div>/i) ||
                    html.match(/([0-9]+[KMkm]?\+)\s+Downloads/i) ||
                    html.match(/([0-9]+[KMkm]?\+)\s+unduhan/i);
    if (dlMatch) {
      downloads = dlMatch[1];
    }

    return { rating, reviewsCount, downloads };
  } catch (err) {
    console.error(`[ERROR] Fetch error for ${packageId}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("==================================================");
  console.log("Syncing Live Metrics from Google Play Store...");
  console.log("==================================================");

  let updatedCount = 0;

  for (const app of currentApps) {
    console.log(`Checking ${app.name} (${app.packageId})...`);
    const stats = await fetchPlayStoreStats(app.packageId);

    if (stats) {
      if (stats.rating !== null && stats.rating !== undefined) {
        if (app.rating !== stats.rating) {
          console.log(`  ★ Rating changed: ${app.rating} -> ${stats.rating}`);
          app.rating = stats.rating;
          updatedCount++;
        }
      }
      if (stats.reviewsCount !== null && stats.reviewsCount !== undefined) {
        if (app.reviewsCount !== stats.reviewsCount) {
          console.log(`  💬 Reviews changed: ${app.reviewsCount} -> ${stats.reviewsCount}`);
          app.reviewsCount = stats.reviewsCount;
          updatedCount++;
        }
      }
      if (stats.downloads) {
        if (app.downloads !== stats.downloads) {
          console.log(`  📥 Downloads changed: ${app.downloads} -> ${stats.downloads}`);
          app.downloads = stats.downloads;
          updatedCount++;
        }
      }
      console.log(`  Current: ${app.rating || "N/A"} ★ | ${app.reviewsCount || 0} reviews | ${app.downloads} downloads`);
    }

    // Small courteous pause
    await new Promise((r) => setTimeout(r, 600));
  }

  // Update apps.ts file
  const newAppsJson = JSON.stringify(currentApps, null, 2);
  const updatedFileContent = appsFileContent.replace(
    /export const apps: AppItem\[\] = \[[\s\S]*?\];\s*$/,
    `export const apps: AppItem[] = ${newAppsJson};\n`
  );

  fs.writeFileSync(appsFilePath, updatedFileContent, "utf8");

  console.log("==================================================");
  console.log(`Sync complete! Changes written to src/data/apps.ts`);
  console.log("==================================================");
}

main();
