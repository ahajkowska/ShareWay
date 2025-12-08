import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "data");
const seedPath = path.join(dataDir, "destinationSeed.json");
const outPath = path.join(dataDir, "prebakedQueriesExtra.json");

function ensureDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadSeeds() {
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Missing seed file at ${seedPath}`);
  }
  const seeds = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  if (!Array.isArray(seeds)) throw new Error("Seed file must be an array");
  return seeds;
}

function buildQueries(seed) {
  if (Array.isArray(seed.smart_queries)) {
    const list = seed.smart_queries.filter(
      (q) => typeof q === "string" && q.trim().length > 0
    );
    if (list.length) return list;
  }
  if (seed.smart_query && typeof seed.smart_query === "string")
    return [seed.smart_query];
  const base = [seed.location, seed.country].filter(Boolean).join(" ");
  const type = (seed.type || "").toLowerCase();
  const hint =
    type === "city"
      ? "city skyline sunset"
      : type === "island" || type === "beach"
      ? "tropical beach turquoise water"
      : type === "mountains"
      ? "snowy mountain landscape"
      : type === "lake"
      ? "lake reflection mountains"
      : type === "coastline"
      ? "coastline cliffs sea"
      : type === "coast"
      ? "coastline sea cliffs"
      : type === "national_park"
      ? "national park nature landscape"
      : type === "desert"
      ? "desert sand dunes sunset"
      : type === "forest"
      ? "forest trees mist"
      : "travel landscape";
  return [`${base} ${hint}`.trim()];
}

function main() {
  ensureDir();
  const seeds = loadSeeds();

  const output = {};
  for (const seed of seeds) {
    const key = [seed.location, seed.country].filter(Boolean).join(" ").trim();
    if (!key) continue;
    const queries = buildQueries(seed);
    output[key] = queries.map((q) => ({ query: q }));
  }

  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Written ${Object.keys(output).length} entries to ${outPath}`);
}

main();
