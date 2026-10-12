import fs from "fs";
import path from "path";

const FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function run() {
  const fontsDir = path.resolve("public/fonts");
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }

  console.log("Fetching font stylesheet...");
  const res = await fetch(FONT_CSS_URL, {
    headers: { "User-Agent": USER_AGENT }
  });
  const css = await res.text();

  // Parse font blocks
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;
  let count = 0;
  let customCss = "";

  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    // Check if it is latin
    const isLatin = block.includes("unicode-range") ? block.includes("U+0000-00FF") : true;
    if (!isLatin) continue;

    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/);
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);

    if (familyMatch && weightMatch && urlMatch) {
      const family = familyMatch[1].trim();
      const weight = weightMatch[1].trim();
      const url = urlMatch[1].trim();
      const safeName = `${family.toLowerCase().replace(/\s+/g, "-")}-${weight}.woff2`;
      const filePath = path.join(fontsDir, safeName);

      console.log(`Downloading ${family} (${weight}) -> ${safeName}...`);
      const fontRes = await fetch(url);
      const buffer = Buffer.from(await fontRes.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved ${safeName} (${(buffer.length / 1024).toFixed(1)} KB)`);

      customCss += `@font-face {\n  font-family: '${family}';\n  font-style: normal;\n  font-weight: ${weight};\n  font-display: swap;\n  src: url('/fonts/${safeName}') format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n\n`;
      count++;
    }
  }

  fs.writeFileSync(path.join(fontsDir, "fonts.css"), customCss);
  console.log(`Done! Downloaded ${count} fonts and generated public/fonts/fonts.css`);
}

run().catch(console.error);
