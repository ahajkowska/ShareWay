module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/frontend/lib/destinationImageCatalog.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import type { TripAccentPreset } from "@/lib/types/trip";
// import { getPrebakedQueries } from "@/lib/prebakedQueries";
// type LearnedDestination = {
//   queries: string[];
//   imageUrl: string;
// };
// const tokenDictionary: Record<string, string> = {
//   polska: "Poland",
//   niemcy: "Germany",
//   hiszpania: "Spain",
//   francja: "France",
//   wlochy: "Italy",
//   wloch: "Italy",
//   chorwacja: "Croatia",
//   czechy: "Czech Republic",
//   norwegia: "Norway",
//   islandia: "Iceland",
//   maroko: "Morocco",
//   indonezja: "Indonesia",
//   "stany zjednoczone": "USA",
//   usa: "USA",
//   "nowy jork": "New York",
//   berlin: "Berlin",
//   barcelona: "Barcelona",
//   "hiszpania barcelona": "Barcelona",
//   paryz: "Paris",
//   paryzu: "Paris",
//   praga: "Prague",
//   pragi: "Prague",
//   sopot: "Sopot",
//   gdansk: "Gdansk",
//   baltyk: "Baltic sea",
//   "morze baltyckie": "Baltic sea",
//   zakopane: "Zakopane",
//   tatry: "Tatra Mountains",
//   stolowe: "Table Mountains",
//   alpy: "Alps",
//   zermatt: "Zermatt",
//   bali: "Bali",
//   merzouga: "Merzouga",
//   sahara: "Sahara desert",
//   podlasie: "Podlasie",
//   mazury: "Masurian lakes",
//   mazur: "Masurian lakes",
//   adriatyk: "Adriatic sea",
//   nyc: "New York",
//   santorini: "Santorini",
//   grecja: "Greece",
//   greece: "Greece",
//   toskania: "Tuscany",
//   tuscany: "Tuscany",
//   lisbon: "Lisbon",
//   lisbona: "Lisbon",
//   porto: "Porto",
//   warszawa: "Warsaw",
//   warsaw: "Warsaw",
//   krakow: "Krakow",
//   krakowa: "Krakow",
//   wroclaw: "Wroclaw",
//   wrocław: "Wroclaw",
//   malta: "Malta",
//   tenerife: "Tenerife",
//   kanary: "Canary Islands",
//   madeira: "Madeira",
//   bieszczady: "Bieszczady Mountains",
//   split: "Split",
//   plazowanie: "beach",
//   "plazowanie.": "beach",
//   "plazowanie,": "beach",
//   plaze: "beaches",
//   plaza: "beach",
//   plaz: "beach",
//   morze: "sea",
//   "surf camp": "surf camp",
//   surf: "surf",
//   surfing: "surfing",
// };
// const learnedDestinations = new Map<string, LearnedDestination>();
// export function normalizeToAsciiLower(text: string) {
//   return text
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .toLowerCase();
// }
// function normalizeKey(text: string) {
//   return normalizeToAsciiLower(text).trim();
// }
// function escapeRegex(value: string) {
//   return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }
// export function translateToEnglishTokens(destination: string) {
//   const normalized = normalizeToAsciiLower(destination);
//   if (!normalized) return "";
//   let translated = normalized;
//   for (const [token, replacement] of Object.entries(tokenDictionary)) {
//     translated = translated.replace(
//       new RegExp(`\\b${escapeRegex(token)}\\b`, "g"),
//       replacement
//     );
//   }
//   return translated.replace(/\s+/g, " ").trim();
// }
// export type LocationDetails = {
//   city: string;
//   country: string;
//   englishCity: string;
//   englishCountry: string;
//   combined: string;
//   englishCombined: string;
//   normalized: string;
// };
// export function getLocationDetails(destination: string): LocationDetails {
//   const normalized = normalizeToAsciiLower(destination || "");
//   const segments = destination
//     .split(",")
//     .map((segment) => segment.trim())
//     .filter(Boolean);
//   const city = segments[0] || "";
//   const country = segments.slice(1).join(" ").trim();
//   const englishCity = city ? translateToEnglishTokens(city) : "";
//   const englishCountry = country ? translateToEnglishTokens(country) : "";
//   const combined = [city, country].filter(Boolean).join(" ").trim();
//   const englishCombined = [englishCity, englishCountry]
//     .filter(Boolean)
//     .join(" ")
//     .trim();
//   return {
//     city,
//     country,
//     englishCity,
//     englishCountry,
//     combined,
//     englishCombined,
//     normalized,
//   };
// }
// function buildLocationPriorityQueries(
//   location: LocationDetails,
//   presetHints: string[]
// ) {
//   const queries: string[] = [];
//   const {
//     city,
//     country,
//     englishCity,
//     englishCountry,
//     combined,
//     englishCombined,
//   } = location;
//   const addQuery = (value?: string) => {
//     if (value) queries.push(value.trim());
//   };
//   addQuery(englishCombined);
//   if (
//     englishCountry &&
//     englishCity &&
//     `${englishCountry} ${englishCity}`.trim() !== englishCombined
//   ) {
//     addQuery(`${englishCountry} ${englishCity}`);
//   }
//   addQuery(combined);
//   if (country && city) addQuery(`${country} ${city}`);
//   addQuery(englishCity && country ? `${englishCity} ${country}` : "");
//   addQuery(englishCountry && city ? `${englishCountry} ${city}` : "");
//   const firstHint = presetHints[0];
//   if (firstHint) {
//     [englishCity, city].forEach((value) => {
//       if (value) addQuery(`${value} ${firstHint}`);
//     });
//     [englishCountry, country].forEach((value) => {
//       if (value) addQuery(`${value} ${firstHint}`);
//     });
//   }
//   [englishCity, englishCountry, city, country].forEach(addQuery);
//   const landscapeHints = ["landscape", "scenic view", "aerial view", "sunrise", "sunset"];
//   landscapeHints.forEach((hint) => {
//     [englishCity, city, englishCountry, country]
//       .filter(Boolean)
//       .forEach((value) => addQuery(`${value} ${hint}`));
//   });
//   return queries.filter(Boolean);
// }
// export function buildDestinationQueries(
//   destination: string,
//   preset: TripAccentPreset = "neutral"
// ) {
//   const translated = translateToEnglishTokens(destination || "");
//   const locationDetails = getLocationDetails(destination);
//   const parts = translated
//     .split(",")
//     .map((p) => p.trim())
//     .filter(Boolean);
//   const primary = parts[0] || translated || destination.trim() || "";
//   const secondary = parts.length > 1 ? parts[1] : "";
//   const extraFromPrebaked = getPrebakedQueries(destination);
//   const learned = learnedDestinations.get(normalizeKey(destination));
//   const extraFromLearned = learned?.queries ?? [];
//   const presetHints =
//     preset === "mountains"
//       ? ["mountains", "landscape", "ridge", "alps"]
//       : preset === "beach" || preset === "tropical"
//       ? ["beach", "sea", "coast", "sunset"]
//       : preset === "city"
//       ? ["city", "skyline", "old town"]
//       : preset === "lake"
//       ? ["lake", "lakes", "water", "sunset"]
//       : preset === "winter"
//       ? ["winter", "snow", "alps"]
//       : preset === "countryside"
//       ? ["countryside", "fields", "village"]
//       : preset === "desert"
//       ? ["desert", "sand"]
//       : preset === "adventure"
//       ? ["outdoor", "adventure"]
//       : [];
//   const locationQueries = buildLocationPriorityQueries(
//     locationDetails,
//     presetHints
//   );
//   const contextual: string[] = [];
//   if (primary && secondary) {
//     contextual.push(`${primary} ${secondary}`);
//     contextual.push(`${primary} ${secondary} ${presetHints[0] ?? ""}`.trim());
//   }
//   const descriptiveCombos = [
//     `${primary} ${secondary} sunset`.trim(),
//     `${primary} ${secondary} aerial view`.trim(),
//     `${primary} old town night`.trim(),
//     `${primary} skyline night lights`.trim(),
//     `${primary} coastline turquoise water`.trim(),
//   ];
//   const baseQueries = [
//     primary,
//     `${primary} travel`,
//     `${primary} landscape`,
//     `${primary} nature`,
//     `${primary} best view`,
//   ];
//   const withPresetHints = presetHints.map((hint) => `${primary} ${hint}`);
//   const all = [
//     ...locationQueries,
//     ...extraFromPrebaked,
//     ...extraFromLearned,
//     ...contextual,
//     ...descriptiveCombos,
//     ...baseQueries,
//     ...withPresetHints,
//   ];
//   return Array.from(new Set(all.filter((v) => v && v.trim().length > 0)));
// }
// export function learnDestination(
//   destination: string,
//   queries: string[],
//   imageUrl: string
// ) {
//   if (!destination || !imageUrl) return;
//   const key = normalizeKey(destination);
//   if (!key || learnedDestinations.has(key)) return;
//   learnedDestinations.set(key, { queries, imageUrl });
// }
__turbopack_context__.s([]);
}),
"[project]/frontend/app/api/destination-image/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/destinationImageCatalog.ts [app-route] (ecmascript)");
;
;
const dynamic = "force-dynamic";
const revalidate = 0;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";
const DISABLE_PEXELS = process.env.DISABLE_PEXELS === "1" || process.env.DISABLE_PEXELS === "true";
const EMBEDDING_RERANKER_URL = process.env.EMBEDDING_RERANKER_URL?.trim() || "";
const memoryCache = new Map();
const validPresets = [
    "mountains",
    "beach",
    "city",
    "neutral",
    "desert",
    "tropical",
    "winter",
    "lake",
    "countryside",
    "adventure"
];
async function GET(req) {
    const { searchParams } = new URL(req.url);
    const reset = searchParams.get("reset");
    const stable = searchParams.get("stable") === "1" || searchParams.get("stable") === "true";
    if (reset === "1" || reset === "true") {
        memoryCache.clear();
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            cleared: true
        }, {
            status: 200
        });
    }
    const qRaw = searchParams.get("q") || "";
    const presetParam = searchParams.get("preset");
    const preset = isTripAccentPreset(presetParam) ? presetParam : "neutral";
    const queries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildDestinationQueries"])(qRaw, preset);
    const cacheKey = queries[0] || qRaw || preset;
    const cached = memoryCache.get(cacheKey);
    if (cached && cached.urls.length) {
        const nextIndex = stable ? cached.index : cached.urls.length > 1 ? (cached.index + 1) % cached.urls.length : cached.index;
        if (!stable) {
            cached.index = nextIndex;
            memoryCache.set(cacheKey, cached);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: cached.urls[Math.min(nextIndex || 0, cached.urls.length - 1)],
            source: cached.source || "memory-cache"
        }, {
            status: 200
        });
    }
    // If we already know the image for this destination, reuse it and avoid any fetch.
    if (DISABLE_PEXELS || !PEXELS_API_KEY.trim()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Image retrieval disabled or missing PEXELS_API_KEY"
        }, {
            status: 503
        });
    }
    let pexelsResult = null;
    let usedQuery = null;
    let source = null;
    for (const query of queries){
        const tokens = buildScoringTokens(qRaw, query, preset);
        const result = await fetchPexelsCandidates(query, tokens, qRaw);
        if (result.length) {
            pexelsResult = result;
            usedQuery = query;
            source = "pexels-primary";
            break;
        }
    }
    // Broaden the search to similar/related images if exact destination returns nothing.
    if (!pexelsResult) {
        for (const query of buildFallbackPexelsQueries(qRaw, preset, queries)){
            const tokens = buildScoringTokens(qRaw, query, preset);
            const result = await fetchPexelsCandidates(query, tokens, qRaw);
            if (result.length) {
                pexelsResult = result;
                usedQuery = query;
                source = "pexels-fallback";
                break;
            }
        }
    }
    if (pexelsResult?.length) {
        const unique = Array.from(new Set(pexelsResult));
        const picked = unique[0];
        memoryCache.set(cacheKey, {
            urls: unique,
            index: 0,
            source: source ?? "pexels"
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["learnDestination"])(qRaw, usedQuery ? [
            usedQuery
        ] : queries, picked);
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: picked,
            source: source ?? "pexels"
        }, {
            status: 200
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "No image found from Pexels"
    }, {
        status: 404
    });
}
function isTripAccentPreset(value) {
    return value !== null && validPresets.includes(value);
}
async function fetchPexelsCandidates(query, tokens, prompt) {
    if (!PEXELS_API_KEY || !query.trim()) return [];
    const searchParams = new URLSearchParams({
        query,
        per_page: "30",
        orientation: "landscape",
        page: "1"
    });
    const res = await fetch(`https://api.pexels.com/v1/search?${searchParams.toString()}`, {
        headers: {
            Authorization: PEXELS_API_KEY
        },
        cache: "no-store"
    }).catch(()=>null);
    if (!res || !res.ok) return [];
    const data = await res.json();
    const list = data?.photos ?? [];
    if (!list.length) return [];
    const rerankedTop = await pickByEmbedding(list, prompt);
    const tokenSorted = sortByTokens(list, tokens);
    const ordered = rerankedTop ? [
        rerankedTop,
        ...tokenSorted.filter((p)=>p !== rerankedTop)
    ] : tokenSorted;
    return ordered.slice(0, 12).map((photo)=>photo.src?.landscape || photo.src?.large2x || "").filter(Boolean);
}
function buildScoringTokens(destination, query, preset) {
    const translated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["translateToEnglishTokens"])(destination || "");
    const destWords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeToAsciiLower"])(translated).split(/\s|,/).filter(Boolean);
    const queryWords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeToAsciiLower"])(query).split(/\s|,/).filter(Boolean);
    const presetHints = preset === "mountains" ? [
        "mountains",
        "landscape"
    ] : preset === "beach" || preset === "tropical" ? [
        "beach",
        "sea",
        "coast"
    ] : preset === "city" ? [
        "city",
        "skyline"
    ] : preset === "lake" ? [
        "lake",
        "water"
    ] : preset === "winter" ? [
        "winter",
        "snow"
    ] : preset === "countryside" ? [
        "countryside",
        "fields",
        "village"
    ] : preset === "desert" ? [
        "desert",
        "sand"
    ] : preset === "adventure" ? [
        "outdoor",
        "adventure"
    ] : [];
    return Array.from(new Set([
        ...destWords,
        ...queryWords,
        ...presetHints
    ].filter(Boolean)));
}
function buildFallbackPexelsQueries(destination, preset, exclude = []) {
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLocationDetails"])(destination);
    const { city, country, englishCity, englishCountry, combined, englishCombined, normalized } = location;
    const genericByPreset = {
        mountains: [
            "mountain landscape sunrise",
            "alpine mountains view"
        ],
        beach: [
            "tropical beach sunset",
            "coastline turquoise water"
        ],
        city: [
            "modern city skyline night",
            "historic city old town"
        ],
        neutral: [
            "beautiful travel landscape",
            "travel destination aerial"
        ],
        desert: [
            "desert sand dunes sunset"
        ],
        tropical: [
            "tropical island beach aerial"
        ],
        winter: [
            "snowy mountain landscape winter"
        ],
        lake: [
            "lake with mountains reflection"
        ],
        countryside: [
            "countryside fields sunrise"
        ],
        adventure: [
            "hiking trail mountain adventure"
        ]
    };
    const presetFallbacks = genericByPreset[preset] ?? genericByPreset.neutral;
    const presetHints = preset === "mountains" ? [
        "mountains",
        "ridge"
    ] : preset === "beach" || preset === "tropical" ? [
        "beach",
        "sea",
        "coast"
    ] : preset === "city" ? [
        "city skyline",
        "old town"
    ] : preset === "lake" ? [
        "lake",
        "water"
    ] : preset === "winter" ? [
        "winter",
        "snow"
    ] : preset === "countryside" ? [
        "countryside",
        "fields"
    ] : preset === "desert" ? [
        "desert",
        "dunes"
    ] : preset === "adventure" ? [
        "outdoor",
        "adventure"
    ] : [
        "travel"
    ];
    const joinSegments = (a, b)=>a && b ? `${a} ${b}`.trim() : "";
    const withDestination = [
        englishCombined,
        combined,
        joinSegments(city, country),
        joinSegments(country, city),
        joinSegments(englishCity, englishCountry),
        joinSegments(englishCountry, englishCity),
        city ? `${city} ${presetHints[0] ?? ""}`.trim() : "",
        englishCity ? `${englishCity} ${presetHints[0] ?? ""}`.trim() : "",
        city ? `${city} scenic view` : "",
        englishCity ? `${englishCity} scenic view` : ""
    ].filter(Boolean);
    const withCountryHints = [
        country ? `${country} ${presetHints[0] ?? ""}`.trim() : "",
        englishCountry ? `${englishCountry} ${presetHints[0] ?? ""}`.trim() : "",
        country ? `${country} scenic view` : "",
        englishCountry ? `${englishCountry} scenic view` : ""
    ].filter(Boolean);
    const baseCombined = englishCombined || combined || normalized || joinSegments(city, country);
    const withCombinedHints = baseCombined ? [
        `${baseCombined} ${presetHints[0] ?? ""}`.trim(),
        `${baseCombined} ${presetHints.join(" ")}`.trim(),
        `${baseCombined} travel`,
        `${baseCombined} landscape`,
        `${baseCombined} aerial view`
    ] : [];
    const withSingles = [
        englishCity,
        englishCountry,
        city,
        country
    ].filter(Boolean);
    const all = [
        ...withDestination,
        ...withCombinedHints,
        ...withSingles,
        ...withCountryHints,
        ...presetFallbacks,
        "travel destination landscape"
    ];
    const excludeSet = new Set(exclude.map((q)=>q.toLowerCase().trim()));
    return Array.from(new Set(all.map((q)=>q.trim()).filter((q)=>q && !excludeSet.has(q.toLowerCase()))));
}
function pickBestByTokens(photos, tokens = []) {
    if (!photos.length) return null;
    const fallback = photos[Math.floor(Math.random() * Math.max(photos.length, 1))] || null;
    const scored = photos.map((photo)=>{
        const alt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeToAsciiLower"])(photo.alt || "");
        let score = 0;
        for (const token of tokens){
            if (token && alt.includes(token)) score += 3;
        }
        score += alt.length * 0.01;
        return {
            photo,
            score
        };
    }).sort((a, b)=>b.score - a.score);
    const best = scored[0];
    if (!best || best.score === 0) return fallback;
    return best.photo;
}
function sortByTokens(photos, tokens = []) {
    return photos.map((photo)=>{
        const alt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$destinationImageCatalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeToAsciiLower"])(photo.alt || "");
        let score = 0;
        for (const token of tokens){
            if (token && alt.includes(token)) score += 3;
        }
        score += alt.length * 0.01;
        return {
            photo,
            score
        };
    }).sort((a, b)=>b.score - a.score).map((p)=>p.photo);
}
async function pickByEmbedding(photos, prompt) {
    if (!EMBEDDING_RERANKER_URL) return null;
    const candidates = photos.map((photo, index)=>({
            index,
            url: photo.src?.landscape || photo.src?.large2x || "",
            alt: photo.alt || ""
        })).filter((c)=>!!c.url);
    if (!candidates.length) return null;
    try {
        const res = await fetch(EMBEDDING_RERANKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
                candidates
            }),
            cache: "no-store"
        });
        if (!res.ok) return null;
        const data = await res.json();
        const idx = (data.indices && data.indices[0]) ?? (Array.isArray(data.scores) ? data.scores.map((s, i)=>({
                s,
                i
            })).sort((a, b)=>(b.s ?? 0) - (a.s ?? 0))[0]?.i : null);
        if (idx == null || idx < 0 || idx >= photos.length) return null;
        return photos[idx];
    } catch  {
        return null;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__79e4de66._.js.map