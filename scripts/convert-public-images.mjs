import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const SKIP_DIRS = new Set(["vouchers"]);
const WEBP_QUALITY = 82;

async function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, files);
      continue;
    }
    if (/\.(png|jpe?g)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const inputs = await walk(ROOT);
let converted = 0;

for (const input of inputs) {
  const output = input.replace(/\.(png|jpe?g)$/i, ".webp");
  const before = fs.statSync(input).size;
  await sharp(input)
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(output);
  const after = fs.statSync(output).size;
  converted += 1;
  console.log(
    `${path.relative(process.cwd(), input)} → ${path.relative(process.cwd(), output)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`
  );
}

console.log(`\nConverted ${converted} files to WebP.`);
