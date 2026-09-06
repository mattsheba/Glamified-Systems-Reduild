/**
 * Variant regression check (AC-2), run in isolation.
 *
 * Proves a second industry still builds from config alone. This is the check
 * that caught the `never[]` type-inference bug and the missing service slugs,
 * so it is worth keeping.
 *
 * The important part is WHERE it builds. The obvious way to run it is to copy
 * the variant over site.config.js and rebuild, but that puts lodge content into
 * dist/ for the length of the build, and anything serving dist/ (a preview
 * server, a browser tab) shows a hospitality site until the real build lands.
 *
 * So this builds into a throwaway directory instead. dist/ is never written,
 * never touched, and never briefly wrong.
 *
 *   npm run verify:variant                       # default: lodge
 *   npm run verify:variant -- variants/x.js      # any variant
 */

import { copyFileSync, existsSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const live = join(root, "site.config.js");
const backup = join(root, "site.config.backup.tmp.js");
// Relative, and run through a shell: on Windows `npx` is a .cmd, which
// execFileSync cannot launch directly.
const OUT = ".variant-check";
const outDir = join(root, OUT);

const variant = resolve(root, process.argv[2] ?? "variants/lodge.config.js");

if (!existsSync(variant)) {
  console.error(`  variant not found: ${variant}`);
  process.exit(1);
}

let swapped = false;

try {
  copyFileSync(live, backup);
  copyFileSync(variant, live);
  swapped = true;

  execSync(`npx astro build --outDir ${OUT}`, {
    cwd: root,
    stdio: "pipe",
    shell: true,
  });

  console.log(`  variant OK — ${variant.split(/[\\/]/).pop()} builds from config alone`);
} catch (error) {
  console.error(`\n  variant FAILED — ${variant.split(/[\\/]/).pop()}\n`);
  const out = error.stdout?.toString() ?? "";
  const err = error.stderr?.toString() ?? "";
  console.error((out + err).split("\n").slice(-30).join("\n"));
  process.exitCode = 1;
} finally {
  // Restore first, always. A crash here would otherwise leave the live site
  // running on a variant config.
  if (swapped && existsSync(backup)) {
    copyFileSync(backup, live);
    rmSync(backup, { force: true });
  }
  rmSync(outDir, { recursive: true, force: true });
}
