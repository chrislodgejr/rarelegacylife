import { basename, extname, join } from "node:path";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const [, , stackedLightSource, flyerSource, horizontalDarkSource, stackedDarkSource] = process.argv;

if (!stackedLightSource || !horizontalDarkSource || !stackedDarkSource) {
  console.error(
    "Usage: node scripts/prepare-logo-assets.mjs <black-stacked-logo> <flyer-original> <white-horizontal-logo> <white-stacked-logo>",
  );
  process.exit(1);
}

const publicDir = join(process.cwd(), "public");
const brandDir = join(publicDir, "brand");
const originalsDir = join(brandDir, "originals");
const appDir = join(process.cwd(), "src", "app");

const transparentPaddingRatio = 0.055;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function sampleBackground(data, width, height) {
  const sampleSize = Math.max(12, Math.floor(Math.min(width, height) * 0.025));
  const points = [
    [0, 0],
    [width - sampleSize, 0],
    [0, height - sampleSize],
    [width - sampleSize, height - sampleSize],
  ];
  const totals = [0, 0, 0];
  let count = 0;

  for (const [startX, startY] of points) {
    for (let y = startY; y < startY + sampleSize; y += 1) {
      for (let x = startX; x < startX + sampleSize; x += 1) {
        const index = (y * width + x) * 4;
        totals[0] += data[index];
        totals[1] += data[index + 1];
        totals[2] += data[index + 2];
        count += 1;
      }
    }
  }

  return totals.map((value) => Math.round(value / count));
}

function removeFlatBackground(data, width, height, options = {}) {
  const background = options.background ?? sampleBackground(data, width, height);
  const clearThreshold = options.clearThreshold ?? 18;
  const keepThreshold = options.keepThreshold ?? 96;
  const output = Buffer.from(data);
  const bounds = {
    minX: width,
    minY: height,
    maxX: -1,
    maxY: -1,
  };

  for (let index = 0; index < output.length; index += 4) {
    const currentAlpha = output[index + 3];
    if (currentAlpha === 0) {
      continue;
    }

    const observed = [output[index], output[index + 1], output[index + 2]];
    const distance = colorDistance(observed, background);
    const alphaFactor = clamp((distance - clearThreshold) / (keepThreshold - clearThreshold), 0, 1);
    const finalAlpha = Math.round(currentAlpha * alphaFactor);

    if (finalAlpha <= 2) {
      output[index + 3] = 0;
      continue;
    }

    if (alphaFactor < 0.99) {
      output[index] = clamp(Math.round((observed[0] - background[0] * (1 - alphaFactor)) / alphaFactor), 0, 255);
      output[index + 1] = clamp(Math.round((observed[1] - background[1] * (1 - alphaFactor)) / alphaFactor), 0, 255);
      output[index + 2] = clamp(Math.round((observed[2] - background[2] * (1 - alphaFactor)) / alphaFactor), 0, 255);
    }

    output[index + 3] = finalAlpha;

    const pixel = index / 4;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    bounds.minX = Math.min(bounds.minX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.maxY = Math.max(bounds.maxY, y);
  }

  return { data: output, bounds, background };
}

function findAlphaBounds(data, width, height, threshold = 8) {
  const bounds = {
    minX: width,
    minY: height,
    maxX: -1,
    maxY: -1,
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > threshold) {
        bounds.minX = Math.min(bounds.minX, x);
        bounds.minY = Math.min(bounds.minY, y);
        bounds.maxX = Math.max(bounds.maxX, x);
        bounds.maxY = Math.max(bounds.maxY, y);
      }
    }
  }

  return bounds;
}

function applyPadding(bounds, width, height, ratio = transparentPaddingRatio) {
  if (bounds.maxX < bounds.minX || bounds.maxY < bounds.minY) {
    return { left: 0, top: 0, width, height };
  }

  const contentWidth = bounds.maxX - bounds.minX + 1;
  const contentHeight = bounds.maxY - bounds.minY + 1;
  const padX = Math.round(contentWidth * ratio);
  const padY = Math.round(contentHeight * ratio);
  const left = Math.max(0, bounds.minX - padX);
  const top = Math.max(0, bounds.minY - padY);
  const right = Math.min(width - 1, bounds.maxX + padX);
  const bottom = Math.min(height - 1, bounds.maxY + padY);

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

async function makeTransparentLogo(source, destination, options = {}) {
  const image = sharp(source).rotate().ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const result = removeFlatBackground(data, info.width, info.height, options);
  const crop = applyPadding(result.bounds, info.width, info.height, options.paddingRatio);
  const output = await sharp(result.data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .extract(crop)
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true });

  await writeFile(destination, output.data);

  return {
    file: destination.replace(`${process.cwd()}/`, ""),
    width: output.info.width,
    height: output.info.height,
    sampledBackground: result.background,
  };
}

function findLogoMarkCut(data, width, height) {
  const rowCounts = [];
  const inkThreshold = Math.max(6, Math.floor(width * 0.012));

  for (let y = 0; y < height; y += 1) {
    let count = 0;
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        count += 1;
      }
    }
    rowCounts.push(count);
  }

  const occupiedRows = rowCounts
    .map((count, y) => ({ count, y }))
    .filter(({ count }) => count > inkThreshold)
    .map(({ y }) => y);

  if (!occupiedRows.length) {
    return Math.floor(height * 0.72);
  }

  const minY = occupiedRows[0];
  const maxY = occupiedRows[occupiedRows.length - 1];
  const gaps = [];
  let start = null;

  for (let y = minY; y <= maxY; y += 1) {
    if (rowCounts[y] <= inkThreshold) {
      start ??= y;
    } else if (start !== null) {
      gaps.push({ start, end: y - 1, size: y - start });
      start = null;
    }
  }

  if (start !== null) {
    gaps.push({ start, end: maxY, size: maxY - start + 1 });
  }

  const eligibleGaps = gaps.filter(
    (gap) => gap.size > height * 0.018 && gap.start > height * 0.35 && gap.start < height * 0.86,
  );
  const bestGap = eligibleGaps.sort((a, b) => b.size - a.size)[0];

  return bestGap ? bestGap.start : Math.floor(height * 0.72);
}

async function makeIconFromLogo(source, destination) {
  const image = sharp(source).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const cutY = findLogoMarkCut(data, info.width, info.height);
  const topCrop = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .extract({ left: 0, top: 0, width: info.width, height: cutY })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bounds = findAlphaBounds(topCrop.data, topCrop.info.width, topCrop.info.height);
  const crop = applyPadding(bounds, topCrop.info.width, topCrop.info.height, 0.08);
  const output = await sharp(topCrop.data, {
    raw: {
      width: topCrop.info.width,
      height: topCrop.info.height,
      channels: 4,
    },
  })
    .extract(crop)
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true });

  await writeFile(destination, output.data);

  return {
    file: destination.replace(`${process.cwd()}/`, ""),
    width: output.info.width,
    height: output.info.height,
  };
}

async function makeFavicon(source, destination) {
  await sharp(source)
    .ensureAlpha()
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(destination);

  const metadata = await sharp(destination).metadata();
  return {
    file: destination.replace(`${process.cwd()}/`, ""),
    width: metadata.width,
    height: metadata.height,
  };
}

async function makeIcoFromPng(source, destination) {
  const pngBuffer = await sharp(source)
    .ensureAlpha()
    .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const header = Buffer.alloc(22);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(64, 6);
  header.writeUInt8(64, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(pngBuffer.length, 14);
  header.writeUInt32LE(22, 18);

  await writeFile(destination, Buffer.concat([header, pngBuffer]));

  return {
    file: destination.replace(`${process.cwd()}/`, ""),
    width: 64,
    height: 64,
  };
}

async function copyOriginal(source, label) {
  if (!source) {
    return null;
  }

  const extension = extname(source) || ".png";
  const destination = join(originalsDir, `${label}${extension.toLowerCase()}`);
  await copyFile(source, destination);
  return destination.replace(`${process.cwd()}/`, "");
}

await mkdir(originalsDir, { recursive: true });

const originals = {
  stackedLight: await copyOriginal(stackedLightSource, "logo-stacked-light-source"),
  recruitingFlyer: await copyOriginal(flyerSource, "recruiting-flyer-source"),
  horizontalDark: await copyOriginal(horizontalDarkSource, "logo-horizontal-dark-source"),
  stackedDark: await copyOriginal(stackedDarkSource, "logo-stacked-dark-source"),
};

const generated = {
  logoLightStacked: await makeTransparentLogo(stackedLightSource, join(brandDir, "logo-light-stacked.png"), {
    clearThreshold: 18,
    keepThreshold: 92,
  }),
  logoDarkHorizontal: await makeTransparentLogo(horizontalDarkSource, join(brandDir, "logo-dark-horizontal.png"), {
    clearThreshold: 16,
    keepThreshold: 82,
  }),
  logoDarkStacked: await makeTransparentLogo(stackedDarkSource, join(brandDir, "logo-dark-stacked.png"), {
    clearThreshold: 16,
    keepThreshold: 82,
  }),
};

generated.iconLight = await makeIconFromLogo(join(brandDir, "logo-light-stacked.png"), join(brandDir, "icon-light.png"));
generated.iconDark = await makeIconFromLogo(join(brandDir, "logo-dark-stacked.png"), join(brandDir, "icon-dark.png"));
generated.favicon = await makeFavicon(join(brandDir, "icon-light.png"), join(publicDir, "favicon.png"));
generated.appleTouchIcon = await makeFavicon(join(brandDir, "icon-light.png"), join(publicDir, "apple-touch-icon.png"));
generated.appIcon = await makeFavicon(join(brandDir, "icon-light.png"), join(appDir, "icon.png"));
generated.appAppleIcon = await makeFavicon(join(brandDir, "icon-light.png"), join(appDir, "apple-icon.png"));
generated.appFaviconIco = await makeIcoFromPng(join(brandDir, "icon-light.png"), join(appDir, "favicon.ico"));

const manifest = {
  generatedAt: new Date().toISOString(),
  notes: [
    "Transparent logo assets generated from supplied Rare Legacy Life source files.",
    "The recruiting flyer source is preserved for reference but is not used as a site logo.",
    "Use dark variants on black or rich-black backgrounds and light variants on white/off-white backgrounds.",
  ],
  originals,
  generated,
};

await writeFile(join(brandDir, "logo-assets.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Prepared Rare Legacy Life logo assets in ${brandDir}`);
for (const asset of Object.values(generated)) {
  console.log(`${basename(asset.file)} ${asset.width}x${asset.height}`);
}
