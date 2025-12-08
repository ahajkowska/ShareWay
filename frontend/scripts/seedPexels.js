import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const queriesPath = path.join(dataDir, "prebakedQueries.json");
const queriesExtraPath = path.join(dataDir, "prebakedQueriesExtra.json");
const imagesPath = path.join(dataDir, "prebakedImages.json");

const images = fs.existsSync(imagesPath)
  ? JSON.parse(fs.readFileSync(imagesPath, "utf8"))
  : {};

for (const file of [queriesPath, queriesExtraPath, imagesPath]) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "{}");
  }
}

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const OUT_PATH = path.join(process.cwd(), "data", "prebakedImages.json");
const TARGET_PER_DEST = Number(process.env.SEED_TARGET_PER_DEST || 5);
const PER_PAGE = 40;
const DELAY_MS = Number(process.env.SEED_DELAY_MS || 0);
const FORCE_DEST_QUERY =
  process.env.SEED_FORCE_DEST_QUERY !== "0" &&
  process.env.SEED_FORCE_DEST_QUERY !== "false" &&
  process.env.SEED_MODE !== "prompt";

function normalize(text) {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const onlyList = (process.env.SEED_ONLY || "")
  .split(",")
  .map((v) => normalize(v))
  .filter(Boolean);
const onlySet = new Set(onlyList);
const resumeFrom = normalize(process.env.SEED_RESUME_FROM || "");
let resumeGate = resumeFrom ? false : true;

if (!PEXELS_API_KEY) {
  console.error("Missing PEXELS_API_KEY env var.");
  process.exit(1);
}

function loadQueries() {
  const files = [queriesPath, queriesExtraPath];
  const merged = new Map();

  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const [dest, prompts] of Object.entries(data)) {
      if (!Array.isArray(prompts)) continue;
      const current = merged.get(dest) ?? [];
      merged.set(dest, current.concat(prompts));
    }
  }

  const allKeys = new Set([...merged.keys(), ...Object.keys(images || {})]);

  const result = new Map();
  for (const dest of allKeys) {
    const prompts = merged.get(dest) ?? [];
    const effective =
      FORCE_DEST_QUERY || prompts.length === 0 ? [{ query: dest }] : prompts;
    result.set(dest, effective);
  }

  return Object.fromEntries(result.entries());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPhotos(query) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url.toString(), {
    headers: { Authorization: PEXELS_API_KEY },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pexels error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return (data.photos || [])
    .map((p) => p?.src?.landscape || p?.src?.large2x || null)
    .filter(Boolean);
}

async function seed() {
  const queries = loadQueries();
  const result = { ...images };
  const entries = Object.entries(queries);

  for (const [dest, prompts] of entries) {
    if (!resumeGate) {
      if (normalize(dest) === resumeFrom) {
        resumeGate = true;
      } else {
        continue;
      }
    }

    if (onlySet.size && !onlySet.has(normalize(dest))) {
      continue;
    }

    const need = TARGET_PER_DEST;
    const pool = new Set(result[dest] || []);

    for (const item of prompts) {
      const query =
        typeof item === "string"
          ? item
          : item && typeof item === "object" && "query" in item
          ? item.query
          : null;

      if (!query) continue;
      if (pool.size >= need) break;
      try {
        const photos = await fetchPhotos(query);
        photos.forEach((url) => {
          if (pool.size < need) {
            pool.add(url);
          }
        });
        if (DELAY_MS > 0) await sleep(DELAY_MS);
      } catch (err) {
        console.error(`Failed for ${dest} / ${item.query}:`, err.message);
      }
    }

    if (pool.size) {
      result[dest] = Array.from(pool);
      console.log(`${dest}: ${pool.size} photos`);
    } else {
      console.warn(`${dest}: no photos found`);
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
  console.log(`Saved to ${OUT_PATH}`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
