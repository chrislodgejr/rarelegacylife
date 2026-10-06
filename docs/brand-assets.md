# Rare Legacy Life Brand Assets

The October 2026 brand: an infinity symbol with a shaded gem at its centre, "Rare Legacy" in script, and "LIFE GROUP" between two rules. The colours are warm blacks and creams; there is no gold.

## Source files

`public/brand/rare-legacy/` holds the logo files exactly as supplied. Every on-page logo, icon and share image comes from this folder.

| File | Use |
| --- | --- |
| `rare-legacy-logo-black-transparent.svg` / `.png` | Full logo for light backgrounds. The PNG is the JSON-LD `logo`. |
| `rare-legacy-logo-cream-transparent.svg` / `.png` | Full logo for dark backgrounds (header, footer, sign-in, CRM sidebar). |
| `rare-legacy-logo-black-on-cream.svg` / `.png` | Full logo on a cream panel, for documents and partners. |
| `rare-legacy-logo-cream-on-black.svg` / `.png` | Full logo on a black panel, for documents and partners. |
| `rare-legacy-symbol-black-transparent.svg` / `.png` | Symbol only, for light backgrounds. Source of the favicons and app icons. |
| `rare-legacy-symbol-cream-transparent.svg` / `.png` | Symbol only, for dark backgrounds. |

The symbol is wider than it is tall (248 × 108). Size it by height and let the width follow; never squash it.

`src/lib/brand.ts` lists these paths in one place. `src/components/brand/logo.tsx` (`BrandLogo`) maps them to lockups:

- `horizontal` (header) and `stacked` (footer, sign-in, splash, CRM): the full logo.
- `icon`: the symbol.
- `variant="dark"` means a dark background (cream artwork); `variant="light"` means a light background (black artwork).

## Generated files

Run `npm run brand:assets` (`scripts/prepare-logo-assets.mjs`, using the `sharp` package that Next.js already installs) to rebuild:

- `src/app/favicon.ico`: 16, 32 and 48 px, black symbol on a cream (#F3EEE2) rounded tile, so it shows on dark browser tabs too.
- `src/app/icon.png` and `public/favicon.png`: 512 px, the same cream tile.
- `src/app/apple-icon.png` and `public/apple-touch-icon.png`: 180 px, black symbol on cream (#F3EEE2).
- `public/brand/app-icon-192.png`, `app-icon-512.png`: manifest icons, black symbol on cream.
- `public/brand/app-icon-maskable-512.png`: manifest maskable icon, symbol inside the safe zone.
- `public/brand/rare-legacy-share.png`: 1200 × 630 share image (Open Graph, Twitter, JSON-LD `image`), full black logo on cream.
- `src/lib/brand-dimensions.json`: the artwork proportions, read from the SVG viewBoxes.

## Changing the logo

1. Replace the files in `public/brand/rare-legacy/` with new ones of the same names.
2. Run `npm run brand:assets`.
3. Commit the replaced and regenerated files. No code change is needed.

## Old logo URLs

The old PNGs were removed. Their URLs redirect (307, set in `next.config.ts` from `LEGACY_BRAND_REDIRECTS` in `src/lib/brand.ts`) to the new artwork, so emails already sent keep showing a logo:

- `/brand/logo-dark-horizontal.png` and `/brand/logo-dark-stacked.png` → cream full logo PNG
- `/brand/logo-light-stacked.png` → black full logo PNG
- `/brand/icon-dark.png` → cream symbol PNG
- `/brand/icon-light.png` → black symbol PNG

`public/brand/originals/` still holds the retired logo's source files and the recruiting flyer, for reference only. Nothing on the site uses them.

## Colours

Defined in `src/app/globals.css` and available as Tailwind colours (`text-brand-cream-300`, `bg-brand-black-950` and so on):

| Token | Hex |
| --- | --- |
| `--brand-black-950` | #0C0B09 |
| `--brand-black-900` | #14120E |
| `--brand-black-800` | #1E1B16 |
| `--brand-black-700` | #2E2A22 |
| `--brand-black-500` | #5A5345 |
| `--brand-cream-600` | #A39A82 |
| `--brand-cream-500` | #C9C0A8 |
| `--brand-cream-300` | #E6DEC9 |
| `--brand-cream-100` | #F3EEE2 |
| `--brand-cream-50` | #FFFDF6 |

Use creams for accents on dark backgrounds and `--brand-black-500` for accent text on light backgrounds. The older `--*-gold` tokens and `.gold-*` classes keep their names but now carry these colours. Form focus and selection states use the same system: warm black (`brand-black-500`, #5A5345) for focus borders, checked option cards (on `brand-cream-100`) and checkboxes on light backgrounds, and cream (`brand-cream-300`) for focus on dark backgrounds. No gold is left.
