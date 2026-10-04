// Regenerates every file derived from the Rare Legacy logo artwork.
//
// Source of truth: public/brand/rare-legacy/ holds the logo files exactly as
// supplied (symbol and full logo, black and cream, SVG and PNG). To change the
// logo, replace those files with new ones of the same names and run:
//
//   npm run brand:assets
//
// Outputs: favicons, app icons, the 1200x630 share image, and
// src/lib/brand-dimensions.json (the artwork proportions the site reads).
// Uses sharp, which Next.js already installs; no extra dependency.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = join(root, "public", "brand", "rare-legacy");
const publicDir = join(root, "public");
const brandDir = join(publicDir, "brand");
const appDir = join(root, "src", "app");

const CREAM = "#F3EEE2";
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const sources = {
  logoBlack: join(sourceDir, "rare-legacy-logo-black-transparent.svg"),
  logoCream: join(sourceDir, "rare-legacy-logo-cream-transparent.svg"),
  symbolBlack: join(sourceDir, "rare-legacy-symbol-black-transparent.svg"),
  symbolCream: join(sourceDir, "rare-legacy-symbol-cream-transparent.svg"),
};

function relative(file) {
  return file.replace(`${root}/`, "");
}

async function readViewBox(file) {
  const svg = await readFile(file, "utf8");
  const match = svg.match(/viewBox="\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
  if (!match) {
    throw new Error(`${relative(file)} has no viewBox`);
  }
  return { width: Number(match[3]), height: Number(match[4]) };
}

// Renders an SVG to a PNG buffer of the given width, keeping its proportions.
async function renderSvg(file, width) {
  const svg = await readFile(file);
  const { width: intrinsicWidth } = await sharp(svg).metadata();
  // Rasterise well above the target size, then downsample, so small icons stay crisp.
  const density = Math.min(2400, Math.max(72, Math.ceil((72 * width * 4) / intrinsicWidth)));
  return sharp(svg, { density }).resize({ width, kernel: "lanczos3" }).png().toBuffer();
}

// Centres artwork on a square (or any) canvas. The symbol is wide, so it is
// fitted by width and keeps its proportions; it is never squashed.
async function compose({ file, canvasWidth, canvasHeight = canvasWidth, artWidth, background }) {
  const art = await renderSvg(file, Math.round(artWidth));
  const meta = await sharp(art).metadata();
  return sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: background ?? TRANSPARENT,
    },
  })
    .composite([
      {
        input: art,
        left: Math.round((canvasWidth - meta.width) / 2),
        top: Math.round((canvasHeight - meta.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function writePng(file, buffer) {
  await writeFile(file, buffer);
  const { width, height } = await sharp(buffer).metadata();
  return { file: relative(file), width, height };
}

// Writes a .ico holding PNG images (supported by every current browser).
async function writeIco(file, pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + pngs.length * 16;
  for (const { size, buffer } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
    entries.push(entry);
  }
  await writeFile(file, Buffer.concat([header, ...entries, ...pngs.map(({ buffer }) => buffer)]));
  return { file: relative(file), sizes: pngs.map(({ size }) => `${size}x${size}`) };
}

const dimensions = {
  logo: await readViewBox(sources.logoBlack),
  symbol: await readViewBox(sources.symbolBlack),
};

const generated = [];

// Browser favicons: black symbol on a transparent background.
const faviconSizes = [16, 32, 48];
const faviconPngs = [];
for (const size of faviconSizes) {
  faviconPngs.push({
    size,
    buffer: await compose({ file: sources.symbolBlack, canvasWidth: size, artWidth: size * 0.96 }),
  });
}
generated.push(await writeIco(join(appDir, "favicon.ico"), faviconPngs));

const transparentIcon = await compose({ file: sources.symbolBlack, canvasWidth: 512, artWidth: 512 * 0.92 });
generated.push(await writePng(join(appDir, "icon.png"), transparentIcon));
generated.push(await writePng(join(publicDir, "favicon.png"), transparentIcon));

// Apple touch icons need a solid background (iOS fills transparency with black).
const appleIcon = await compose({
  file: sources.symbolBlack,
  canvasWidth: 180,
  artWidth: 180 * 0.74,
  background: CREAM,
});
generated.push(await writePng(join(appDir, "apple-icon.png"), appleIcon));
generated.push(await writePng(join(publicDir, "apple-touch-icon.png"), appleIcon));

// Installed-app (manifest) icons on cream. The maskable one keeps the symbol
// inside the central safe zone so Android's circle/squircle masks never clip it.
for (const size of [192, 512]) {
  generated.push(
    await writePng(
      join(brandDir, `app-icon-${size}.png`),
      await compose({ file: sources.symbolBlack, canvasWidth: size, artWidth: size * 0.74, background: CREAM }),
    ),
  );
}
generated.push(
  await writePng(
    join(brandDir, "app-icon-maskable-512.png"),
    await compose({ file: sources.symbolBlack, canvasWidth: 512, artWidth: 512 * 0.62, background: CREAM }),
  ),
);

// Share image for Open Graph / Twitter / JSON-LD: the full black logo on cream.
const shareWidth = 1200;
const shareHeight = 630;
const shareLogoWidth = Math.min(shareWidth * 0.64, ((shareHeight * 0.74) / dimensions.logo.height) * dimensions.logo.width);
generated.push(
  await writePng(
    join(brandDir, "rare-legacy-share.png"),
    await compose({
      file: sources.logoBlack,
      canvasWidth: shareWidth,
      canvasHeight: shareHeight,
      artWidth: shareLogoWidth,
      background: CREAM,
    }),
  ),
);

await writeFile(join(root, "src", "lib", "brand-dimensions.json"), `${JSON.stringify(dimensions, null, 2)}\n`);

console.log(`Logo proportions: full logo ${dimensions.logo.width}x${dimensions.logo.height}, symbol ${dimensions.symbol.width}x${dimensions.symbol.height}`);
for (const asset of generated) {
  console.log(`${asset.file} ${asset.sizes ? asset.sizes.join(", ") : `${asset.width}x${asset.height}`}`);
}
