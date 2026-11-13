// Lets `node --test` load the app's TypeScript as Next does: "@/..." means src/..., and imports may leave off ".ts".
// Node strips the types itself; nothing here is bundled into the site.
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";

const src = new URL("../src/", import.meta.url);

registerHooks({
  resolve(specifier, context, nextResolve) {
    let target = specifier.startsWith("@/") ? new URL(specifier.slice(2), src).href : specifier;
    const local = target.startsWith("file:") || target.startsWith(".");
    if (local && !/\.(m|c)?(j|t)sx?$/.test(target)) {
      const base = new URL(target, context.parentURL);
      const found = [".ts", ".tsx", "/index.ts"].map((ext) => new URL(base.href + ext)).find((url) => existsSync(url));
      if (found) target = found.href;
    }
    return nextResolve(target, context);
  },
});
