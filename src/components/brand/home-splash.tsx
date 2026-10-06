import { getSplashArtwork } from "@/lib/brand-splash";
import styles from "./home-splash.module.css";

const ELEMENT_ID = "rl-home-splash";
const STORAGE_KEY = "rl-home-splash-v1";

/**
 * Decides before the first paint whether the splash plays, so the page never
 * flashes underneath it. It plays once per browser session, never with reduced
 * motion, never for crawlers or link previews, and never when storage is
 * unavailable. A click, tap, scroll or any key (Esc included) skips it. Without
 * JavaScript the overlay stays hidden. The page itself is ordinary server HTML
 * under the overlay, so crawlers and assistive technology read it as usual.
 */
const DECIDE_SCRIPT = `(function(){var el=document.getElementById("${ELEMENT_ID}");if(!el)return;try{if(sessionStorage.getItem("${STORAGE_KEY}"))return;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(/bot|crawl|spider|slurp|preview|inspectiontool|facebookexternalhit|embedly/i.test(navigator.userAgent))return;sessionStorage.setItem("${STORAGE_KEY}","1")}catch(e){return}el.setAttribute("data-state","playing");var done=0,timer;function off(){document.removeEventListener("keydown",skip,true);el.removeEventListener("pointerdown",skip);removeEventListener("wheel",skip);removeEventListener("touchmove",skip)}function end(){if(done)return;done=1;clearTimeout(timer);off();el.setAttribute("data-state","done")}function skip(){if(done)return;off();el.setAttribute("data-state","leaving");clearTimeout(timer);timer=setTimeout(end,320)}el.addEventListener("animationend",function(e){if(e.target===el)end()});document.addEventListener("keydown",skip,true);el.addEventListener("pointerdown",skip);addEventListener("wheel",skip,{passive:true});addEventListener("touchmove",skip,{passive:true});timer=setTimeout(end,2600)})();`;

/** Soft edge of each reveal, in logo units. */
const SWEEP_FEATHER = 70;
const GLINT_WIDTH = 64;
const WIPE_FEATHER = 48;

export function HomeSplash() {
  const art = getSplashArtwork();
  if (!art) return null;

  const [vx, vy, vw, vh] = art.viewBox.split(/[\s,]+/).map(Number);
  const region = `maskUnits="userSpaceOnUse" x="${vx}" y="${vy}" width="${vw}" height="${vh}"`;
  const sym = art.symbolBox;
  const symW = sym.maxX - sym.minX;
  const symTop = sym.minY - 12;
  const symH = sym.maxY - sym.minY + 24;
  const scr = art.scriptBox;
  const scrW = scr.maxX - scr.minX;

  // Each reveal rectangle travels exactly its own width (translateX(100%) in the
  // stylesheet), so no per-logo numbers live in the CSS.
  const sweepWidth = symW + SWEEP_FEATHER;
  const glintTravel = symW + GLINT_WIDTH;
  const wipeWidth = scrW + WIPE_FEATHER;

  const svg = `<svg class="${styles.art}" viewBox="${art.viewBox}" xmlns="http://www.w3.org/2000/svg" focusable="false">
<defs>${art.defs}
<linearGradient id="rls-sweep-g" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="${(symW / sweepWidth).toFixed(3)}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="rls-glint-g" x1="0" x2="1"><stop offset="${(symW / glintTravel).toFixed(3)}" stop-color="#fff" stop-opacity="0"/><stop offset="${((symW + GLINT_WIDTH / 2) / glintTravel).toFixed(3)}" stop-color="#fff" stop-opacity="0.8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="rls-wipe-g" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="${(scrW / wipeWidth).toFixed(3)}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="rls-draw" ${region}><path class="${styles.loop}" d="${art.loopPath}" fill="none" stroke="#fff" stroke-width="${art.loopStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${art.loopLength} ${art.loopLength}" stroke-dashoffset="${art.loopLength}"/></mask>
<mask id="rls-sweep" ${region}><rect class="${styles.sweep}" x="${sym.minX - sweepWidth}" y="${symTop}" width="${sweepWidth}" height="${symH}" fill="url(#rls-sweep-g)"/></mask>
<mask id="rls-shape" ${region}><use href="#rls-band"/>${art.gem.join("")}</mask>
<mask id="rls-wipe" ${region}><rect class="${styles.wipe}" x="${scr.minX - wipeWidth}" y="${scr.minY - 8}" width="${wipeWidth}" height="${scr.maxY - scr.minY + 16}" fill="url(#rls-wipe-g)"/></mask>
</defs>
<g mask="url(#rls-draw)"><use class="${styles.dim}" href="#rls-band"/><g mask="url(#rls-sweep)">${art.band}</g></g>
<g class="${styles.gem}">${art.gem.join("")}</g>
<g mask="url(#rls-shape)"><rect class="${styles.glint}" x="${sym.minX - glintTravel}" y="${symTop}" width="${glintTravel}" height="${symH}" fill="url(#rls-glint-g)"/></g>
<g mask="url(#rls-wipe)">${art.script}</g>
<g class="${styles.word}">${art.wordmark.join("")}</g>
</svg>`;

  return (
    <>
      {/* The decision script sets data-state before React hydrates; suppressHydrationWarning covers that one attribute. */}
      <div
        aria-hidden="true"
        className={styles.splash}
        dangerouslySetInnerHTML={{ __html: svg }}
        id={ELEMENT_ID}
        suppressHydrationWarning
      />
      <script dangerouslySetInnerHTML={{ __html: DECIDE_SCRIPT }} />
    </>
  );
}
