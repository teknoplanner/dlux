// Root layout emits lang="id"; Next 14 can't vary <html lang> per route without splitting root layouts, so fix /en/ in the static export.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

let n = 0;
for (const f of readdirSync("out/en", { recursive: true })) {
  if (!f.endsWith(".html")) continue;
  const p = join("out/en", f);
  const html = readFileSync(p, "utf8");
  const out = html.replace('<html lang="id"', '<html lang="en"');
  if (out === html) throw new Error(`no <html lang="id"> in ${p}`);
  writeFileSync(p, out);
  n++;
}
console.log(`set lang="en" on ${n} /en/ pages`);
