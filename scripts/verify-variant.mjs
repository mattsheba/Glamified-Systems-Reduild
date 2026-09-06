/**
 * Variant regression check (AC-2), run in isolation.
 *
 * Proves a second industry still builds from config alone. This is the check
 * that caught the `never[]` type-inference bug and the missing service slugs,
 * so it is worth keeping.
 *
 * It builds into a throwaway directory, so dist/ is never written, never
 * touched, and never briefly wrong.
 *
 * IT NO LONGER TOUCHES site.config.js. The earlier version copied the variant
 * over the live config and copied it back in a `finally`. That survives an
 * exception but not process death: a libuv abort on Windows killed the process
 * outright, `finally` never ran, and the live config was lost with no backup
 * and no commit. Config now resolves through a Vite alias set by
 * VARIANT_CONFIG (see astro.config.mjs), so a crash at any point can destroy
 * nothing — there is nothing to put back.
 *
 *   npm run verify:variant                       # default: lodge
 *   npm run verify:variant -- variants/x.js      # any variant
 */

import { existsSync, rmSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = ".variant-check";
const outDir = join(root, OUT);
const live = join(root, "site.config.js");

const variant = resolve(root, process.argv[2] ?? "variants/lodge.config.js");

if (!existsSync(variant)) {
  console.error(`  variant not found: ${variant}`);
  process.exit(1);
}

/*
 * Belt and braces. If an older build of this script ever left a swapped config
 * behind, say so loudly rather than quietly verifying the wrong thing. A live
 * config the size of a variant is the signature of that failure.
 */
const stale = join(root, "site.config.backup.tmp.js");
if (existsSync(stale)) {
  console.error(
    `\n  A stale ${relative(root, stale)} is present. That means an earlier\n` +
      `  run died mid-swap and site.config.js may be a VARIANT, not yours.\n` +
      `  Check it before building, then delete the backup.\n`
  );
  process.exit(1);
}

if (existsSync(live) && statSync(live).size < 8000) {
  console.error(
    `\n  site.config.js is only ${statSync(live).size} bytes. That is variant-sized,\n` +
      `  not site-sized. Refusing to run in case it is a leftover swap.\n`
  );
  process.exit(1);
}

try {
  execSync(`npx astro build --outDir ${OUT}`, {
    cwd: root,
    stdio: "pipe",
    shell: true,
    // The only thing that changes. No file is written, so nothing can be lost.
    env: { ...process.env, VARIANT_CONFIG: relative(root, variant) },
  });

  console.log(
    `  variant OK — ${variant.split(/[\\/]/).pop()} builds from config alone`
  );
} catch (error) {
  console.error(`\n  variant FAILED — ${variant.split(/[\\/]/).pop()}\n`);
  const out = error.stdout?.toString() ?? "";
  const err = error.stderr?.toString() ?? "";
  console.error((out + err).split("\n").slice(-30).join("\n"));
  process.exitCode = 1;
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
