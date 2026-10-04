import { BRAND_FILES } from "./brand-paths";
import dimensions from "./brand-dimensions.json";

/**
 * Single place for every Rare Legacy logo file the site uses.
 *
 * The artwork lives in public/brand/rare-legacy/ exactly as supplied. To change
 * the logo, replace those files (keep the file names) and run
 * `npm run brand:assets`, which regenerates the favicons, app icons, share
 * image and brand-dimensions.json. No code change is needed.
 */
export { BRAND_DIR, BRAND_FILES, LEGACY_BRAND_REDIRECTS } from "./brand-paths";

export const SHARE_IMAGE = {
  url: BRAND_FILES.shareImage,
  width: 1200,
  height: 630,
} as const;

/** Intrinsic proportions of the artwork, read from the SVG viewBoxes by the asset script. */
export const BRAND_DIMENSIONS = dimensions as {
  logo: { width: number; height: number };
  symbol: { width: number; height: number };
};
