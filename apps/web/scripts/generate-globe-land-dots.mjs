#!/usr/bin/env node
/**
 * Generates `public/globe-land-dots.json` — the precomputed land sampling used by
 * `src/components/3d/globe-scene.tsx` (<LandDots />).
 *
 * Why precomputed?
 *   - The hero used to fetch a 2.7 MB Natural Earth geojson from raw.githubusercontent.com,
 *     rasterize it in a <canvas> and build an InstancedMesh at *runtime*. With the old
 *     `step = 0.12` that produced ~1.47M instances (~94 MB of matrices) which either took
 *     seconds or threw an allocation error that the empty catch swallowed -> the globe
 *     rendered as an empty sphere (i.e. "the globe didn't show").
 *   - Sampling once at build time keeps the runtime to a single small fetch + one
 *     InstancedMesh allocation, with no CORS / rate-limit / offline dependency.
 *
 * Output format: flat array of quantized integer pairs (longitude * 10, latitude * 10),
 * i.e. 0.1 degree precision, e.g. [904, 238, 904, 239, ...].
 *
 * Regenerate after changing SAMPLE_STEP (dot density) or the upstream land data:
 *   pnpm --filter web generate:globe-dots
 * Dot size / colour / opacity live in globe-scene.tsx and do not need regeneration.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { geoEquirectangular, geoPath } from "d3-geo";

const LAND_URL =
  process.env.LAND_GEOJSON_URL ??
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/50m/physical/ne_50m_land.json";

/** Grid spacing in degrees. 0.9 -> ~26k dots (solid-looking continents, affordable on low-end GPUs). */
const SAMPLE_STEP = 0.9;
/** Raster resolution used for point-in-polygon lookups (2:1 equirectangular). */
const RASTER_W = 2048;
const RASTER_H = 1024;

const OUT_FILE = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "globe-land-dots.json",
);

const res = await fetch(LAND_URL);
if (!res.ok) throw new Error(`Failed to fetch land geojson: ${res.status}`);
const land = await res.json();

const projection = geoEquirectangular().fitSize([RASTER_W, RASTER_H], { type: "Sphere" });
const path = geoPath(projection)(land);
if (!path) throw new Error("geoPath produced no path data");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${RASTER_W}" height="${RASTER_H}"><rect width="${RASTER_W}" height="${RASTER_H}" fill="#000"/><path d="${path}" fill="#fff"/></svg>`;
const { data, info } = await sharp(Buffer.from(svg))
  // Single channel: below we index the buffer as one byte per pixel.
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
if (info.channels !== 1) throw new Error(`Expected 1 channel, got ${info.channels}`);
const w = info.width;
const h = info.height;

function isOnLand(lng, lat) {
  const rawX = Math.round(((lng + 180) / 360) * w) % w;
  const x = ((rawX % w) + w) % w;
  const y = Math.max(0, Math.min(h - 1, Math.round(((90 - lat) / 180) * h)));
  return data[y * w + x] > 128;
}

const flat = [];
for (let lat = -90; lat <= 90; lat += SAMPLE_STEP) {
  const cosLat = Math.cos(Math.abs(lat) * (Math.PI / 180));
  // Widen the longitude step near the poles so dots stay evenly spaced on the sphere.
  const lngStep = cosLat > 0.01 ? SAMPLE_STEP / Math.max(0.3, cosLat) : 360;
  for (let lng = -180; lng < 180; lng += lngStep) {
    if (isOnLand(lng, lat)) {
      flat.push(Math.round(lng * 10), Math.round(lat * 10));
    }
  }
}

await mkdir(dirname(OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, `${JSON.stringify(flat)}\n`);

const kb = (Buffer.byteLength(JSON.stringify(flat)) / 1024).toFixed(0);
console.log(`Wrote ${flat.length / 2} land dots (${kb} KB) -> ${OUT_FILE}`);
