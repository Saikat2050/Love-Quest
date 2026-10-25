import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const optional = new Set(["/audio/letter.wav"]);
const media = /^\/(images|audio)\//;
const source = readFileSync(join(root, "content/game.ts"), "utf8");
const referenced = new Set(
  [...source.matchAll(/["'](\/(?:images|audio)\/[^"']+)["']/g)].map((match) => match[1]),
);

const onDisk = new Set();
walk(join(root, "public/images"), join(root, "public"), onDisk);
walk(join(root, "public/audio"), join(root, "public"), onDisk);

const listedSource = readFileSync(join(root, "lib/public-media.ts"), "utf8");
const listed = new Set([...listedSource.matchAll(/"(\/(?:images|audio)\/[^"]+)"/g)].map((match) => match[1]));
const missing = [...referenced].filter((url) => media.test(url) && !optional.has(url) && !onDisk.has(url));
const extraOptional = [...referenced].filter((url) => optional.has(url) && !onDisk.has(url));
const unlisted = [...onDisk].filter((url) => !listed.has(url));
const ghosts = [...listed].filter((url) => url !== "/audio/letter.wav" && !onDisk.has(url));

console.log(`Referenced media: ${referenced.size}`);
console.log(`Public media: ${onDisk.size}`);

if (extraOptional.length > 0) {
  console.warn("Optional media not on disk (skipped at boot):");
  extraOptional.forEach((url) => console.warn(`  ${url}`));
}

if (unlisted.length > 0) {
  console.error("Public files missing from lib/public-media.ts:");
  unlisted.forEach((url) => console.error(`  ${url}`));
}

if (ghosts.length > 0) {
  console.error("lib/public-media.ts lists files that are not in public/:");
  ghosts.forEach((url) => console.error(`  ${url}`));
}

if (missing.length > 0) {
  console.error("Story references files that are not in public/:");
  missing.forEach((url) => console.error(`  ${url}`));
}

if (missing.length > 0 || unlisted.length > 0 || ghosts.length > 0) {
  process.exit(1);
}

console.log("Asset check passed. Boot will preload only files that exist on disk.");

function walk(dir, base, found) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, base, found);
      continue;
    }
    if (entry === ".gitkeep") {
      continue;
    }
    found.add(`/${relative(base, full).split("\\").join("/")}`);
  }
}
