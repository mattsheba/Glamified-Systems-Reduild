/**
 * Checks that every configured installer actually exists in the bucket.
 *
 * Deliberately NOT part of `npm run build`: it needs the network, and a build
 * that fails on a hotel wifi is a worse problem than the one it prevents. Run
 * it before a release, and after uploading a new installer.
 *
 * The failure it exists to catch is real. The first time these buttons were
 * wired up, two of the three files had not been uploaded and one had a .exe
 * extension in config against a .zip in the bucket. Nothing in the type system
 * or the config validator can see that, because the truth is on another host.
 */

import site from "../site.config.js";

const base = site.downloads?.baseUrl;

// Installers and user guides are the same problem: a filename in config that
// may or may not exist in the bucket. Check both.
const targets = [];
for (const product of site.products ?? []) {
  if (product.download) {
    targets.push({ name: product.name, file: product.download.file, kind: "installer" });
  }
  if (product.guide) {
    targets.push({ name: product.name, file: product.guide.file, kind: "guide" });
  }
}

if (!base || base === "PLACEHOLDER") {
  console.log("\n  downloads.baseUrl is not set. Nothing to check.\n");
  process.exit(0);
}

if (!targets.length) {
  console.log("\n  No products have a download configured. Nothing to check.\n");
  process.exit(0);
}

const host = base.replace(/\/+$/, "");
let failed = 0;

console.log("");

for (const target of targets) {
  const url = `${host}/${target.file}`;
  let line;

  try {
    // HEAD, so a 119MB installer is not pulled down on every check.
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });

    if (res.ok) {
      const bytes = Number(res.headers.get("content-length") ?? 0);
      // Cloudflare reports decimal MB; the button quotes binary. Show both so a
      // mismatch against config is obvious rather than alarming.
      const mib = bytes ? ` ${(bytes / 1048576).toFixed(0)} MB` : "";
      const type = res.headers.get("content-type") ?? "";
      line = `  ok    ${target.name} ${target.kind}${mib}  ${type}`;
    } else {
      failed++;
      line =
        `  FAIL  ${target.name} ${target.kind}: HTTP ${res.status} for ${target.file}\n` +
        `        ${url}`;
    }
  } catch (error) {
    failed++;
    line = `  FAIL  ${target.name} ${target.kind}: ${error.message}\n        ${url}`;
  }

  console.log(line);
}

console.log("");

if (failed) {
  console.error(
    `  ${failed} link(s) broken. Upload the file, or comment the block out so\n` +
      `  the page stops advertising it.\n`
  );
  process.exit(1);
}

console.log(`  downloads OK — ${targets.length} file(s) reachable\n`);
