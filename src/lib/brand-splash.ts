import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BRAND_FILES } from "./brand-paths";

/**
 * The home page splash animates the cream full logo exactly as supplied
 * (public/brand/rare-legacy/rare-legacy-logo-cream-transparent.svg). This module
 * reads that file at build time and splits it into the parts the animation
 * reveals one after another; nothing is redrawn or retyped.
 *
 * The file holds, in order: the infinity band (one even-odd path with a
 * subpath per loop), the four gem facets, the "Rare Legacy" script, "LIFE
 * GROUP", and the two rules beside it. If a replacement logo has another
 * structure, getSplashArtwork() returns null and the home page simply shows no
 * splash.
 *
 * The only shapes made here are invisible masks: a line along the middle of
 * each loop (worked out from the band's own outline) that reveals the band as
 * if it were being drawn, and rectangles that wipe the rest in.
 */

type Box = { minX: number; minY: number; maxX: number; maxY: number };

export type SplashArtwork = {
  viewBox: string;
  /** Gradient definitions from the file, ids prefixed so they cannot clash with the page. */
  defs: string;
  band: string;
  gem: string[];
  script: string;
  wordmark: string[];
  /** Mask line through the middle of both loops, in drawing order, and its length. */
  loopPath: string;
  loopLength: number;
  loopStrokeWidth: number;
  symbolBox: Box;
  scriptBox: Box;
};

const ID_PREFIX = "rls-";

function attr(element: string, name: string) {
  return element.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

/** Bounding box of a path's points (control points included: a slight overestimate is fine). */
function pathBox(d: string): Box | null {
  const tokens = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g);
  if (!tokens) return null;
  const arity: Record<string, number> = { M: 2, L: 2, T: 2, H: 1, V: 1, Q: 4, S: 4, C: 6, A: 7, Z: 0 };
  const box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  const add = (x: number, y: number) => {
    box.minX = Math.min(box.minX, x);
    box.minY = Math.min(box.minY, y);
    box.maxX = Math.max(box.maxX, x);
    box.maxY = Math.max(box.maxY, y);
  };
  let cmd = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let i = 0;
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) {
      cmd = tokens[i];
      i += 1;
      if (cmd.toUpperCase() === "Z") {
        x = startX;
        y = startY;
        continue;
      }
    }
    const upper = cmd.toUpperCase();
    const n = arity[upper];
    if (!n) return null;
    const args = tokens.slice(i, i + n).map(Number);
    if (args.length < n || args.some(Number.isNaN)) return null;
    i += n;
    const rel = cmd !== upper;
    if (upper === "H") {
      x = rel ? x + args[0] : args[0];
    } else if (upper === "V") {
      y = rel ? y + args[0] : args[0];
    } else if (upper === "A") {
      x = rel ? x + args[5] : args[5];
      y = rel ? y + args[6] : args[6];
    } else {
      for (let k = 0; k < n; k += 2) {
        const px = rel ? x + args[k] : args[k];
        const py = rel ? y + args[k + 1] : args[k + 1];
        if (k < n - 2) add(px, py);
        else {
          x = px;
          y = py;
        }
      }
    }
    add(x, y);
    if (upper === "M") {
      startX = x;
      startY = y;
      cmd = rel ? "l" : "L";
    }
  }
  return Number.isFinite(box.minX) ? box : null;
}

/** Polygons of a path made only of M, L and Z (the band is). */
function polygons(d: string): Array<Array<[number, number]>> | null {
  if (/[^MLZ\d\s.,-]/.test(d)) return null;
  return d
    .split("M")
    .map((part) => part.replace(/Z/g, " ").trim())
    .filter(Boolean)
    .map((part) => {
      const nums = part.split(/[\sL,]+/).filter(Boolean).map(Number);
      const points: Array<[number, number]> = [];
      for (let k = 0; k + 1 < nums.length; k += 2) points.push([nums[k], nums[k + 1]]);
      return points;
    });
}

/** Distances from (cx, cy) along angle a to every crossing of the polygon's edges. */
function rayHits(poly: Array<[number, number]>, cx: number, cy: number, a: number) {
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const hits: number[] = [];
  for (let k = 0; k < poly.length; k += 1) {
    const [x1, y1] = poly[k];
    const [x2, y2] = poly[(k + 1) % poly.length];
    const ex = x2 - x1;
    const ey = y2 - y1;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - cx) * ey - (y1 - cy) * ex) / den;
    const u = ((x1 - cx) * dy - (y1 - cy) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1) hits.push(t);
  }
  return hits.sort((p, q) => p - q);
}

const STEP_DEGREES = 3;

/**
 * Middle line of one loop: rays from the loop's centre, the midpoint between
 * the band's inner and outer edge on each, from one end of the band to the
 * other (the gap is where the loop opens towards the gem).
 */
function loopCentreLine(poly: Array<[number, number]>) {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const samples: Array<{ point: [number, number]; thickness: number } | null> = [];
  for (let deg = 0; deg < 360; deg += STEP_DEGREES) {
    const a = (deg * Math.PI) / 180;
    const hits = rayHits(poly, cx, cy, a);
    if (hits.length < 2) {
      samples.push(null);
      continue;
    }
    const r = (hits[0] + hits[1]) / 2;
    samples.push({ point: [cx + r * Math.cos(a), cy + r * Math.sin(a)], thickness: hits[1] - hits[0] });
  }
  // Start just after the longest run of empty samples (the opening), go once round.
  let bestStart = -1;
  let bestLength = 0;
  for (let k = 0; k < samples.length; k += 1) {
    if (samples[k] !== null || samples[(k - 1 + samples.length) % samples.length] === null) continue;
    // k is the first empty sample of a run; measure the run.
    let len = 0;
    while (len < samples.length && samples[(k + len) % samples.length] === null) len += 1;
    if (len > bestLength) {
      bestLength = len;
      bestStart = k;
    }
  }
  if (bestStart < 0) return null;
  const ordered = [];
  for (let k = 0; k < samples.length; k += 1) {
    const sample = samples[(bestStart + bestLength + k) % samples.length];
    if (sample) ordered.push(sample);
  }
  return { cx, points: ordered.map((s) => s.point), maxThickness: Math.max(...ordered.map((s) => s.thickness)) };
}

const round = (n: number) => Math.round(n * 10) / 10;

let cached: SplashArtwork | null | undefined;

export function getSplashArtwork(): SplashArtwork | null {
  if (cached !== undefined) return cached;
  cached = null;
  try {
    const svg = readFileSync(join(process.cwd(), "public", BRAND_FILES.logoCreamSvg), "utf8");
    const viewBox = svg.match(/<svg\b[^>]*\sviewBox="([^"]+)"/)?.[1];
    const defs = svg.match(/<defs>([\s\S]*?)<\/defs>/)?.[1] ?? "";
    const paths = [...svg.matchAll(/<path\b[^>]*\/>/g)].map((m) => m[0]);
    const rects = [...svg.matchAll(/<rect\b[^>]*\/>/g)].map((m) => m[0]);
    if (!viewBox || paths.length !== 7 || rects.length !== 2 || /<(script|image|text|use|foreignObject)\b/i.test(svg)) {
      throw new Error("unexpected structure");
    }
    const prefixIds = (markup: string) =>
      markup.replace(/\sid="([^"]+)"/g, ` id="${ID_PREFIX}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${ID_PREFIX}$1)`);

    const [bandPath, gem1, gem2, gem3, gem4, scriptPath, wordPath] = paths;
    const loops = polygons(attr(bandPath, "d") ?? "");
    if (!loops || loops.length !== 2) throw new Error("band is not two loops");
    const lines = loops.map(loopCentreLine);
    if (lines.some((line) => !line || line.points.length < 20)) throw new Error("loop centre line not found");
    const [left, right] = [...lines].sort((a, b) => a!.cx - b!.cx) as Array<NonNullable<ReturnType<typeof loopCentreLine>>>;

    const gemBoxes = [gem1, gem2, gem3, gem4].map((p) => pathBox(attr(p, "d") ?? ""));
    if (gemBoxes.some((b) => !b)) throw new Error("gem not readable");
    const gemBox = gemBoxes.reduce((acc, b) => ({
      minX: Math.min(acc!.minX, b!.minX),
      minY: Math.min(acc!.minY, b!.minY),
      maxX: Math.max(acc!.maxX, b!.maxX),
      maxY: Math.max(acc!.maxY, b!.maxY),
    }))!;
    const centre: [number, number] = [(gemBox.minX + gemBox.maxX) / 2, (gemBox.minY + gemBox.maxY) / 2];

    // Drawing order of a figure eight: round the left loop one way, through the
    // gem, round the right loop the other way, back to the gem.
    const route: Array<[number, number]> = [centre, ...left.points, centre, ...[...right.points].reverse(), centre];
    let loopLength = 0;
    for (let k = 1; k < route.length; k += 1) {
      loopLength += Math.hypot(route[k][0] - route[k - 1][0], route[k][1] - route[k - 1][1]);
    }
    const loopPath = `M${route.map(([px, py]) => `${round(px)} ${round(py)}`).join("L")}`;

    const bandBox = pathBox(attr(bandPath, "d") ?? "");
    const scriptBox = pathBox(attr(scriptPath, "d") ?? "");
    if (!bandBox || !scriptBox) throw new Error("boxes not readable");
    const symbolBox = {
      minX: Math.min(bandBox.minX, gemBox.minX),
      minY: Math.min(bandBox.minY, gemBox.minY),
      maxX: Math.max(bandBox.maxX, gemBox.maxX),
      maxY: Math.max(bandBox.maxY, gemBox.maxY),
    };

    cached = {
      viewBox,
      defs: prefixIds(defs),
      band: bandPath.replace("<path", `<path id="${ID_PREFIX}band"`),
      gem: [gem1, gem2, gem3, gem4],
      script: scriptPath,
      wordmark: [prefixIds(wordPath), ...rects.map(prefixIds)],
      loopPath,
      loopLength: Math.ceil(loopLength),
      loopStrokeWidth: Math.ceil(Math.max(left.maxThickness, right.maxThickness) * 1.3 + 4),
      symbolBox,
      scriptBox,
    };
  } catch (error) {
    console.warn(`Home splash disabled: ${BRAND_FILES.logoCreamSvg} could not be split (${(error as Error).message}).`);
    cached = null;
  }
  return cached;
}
