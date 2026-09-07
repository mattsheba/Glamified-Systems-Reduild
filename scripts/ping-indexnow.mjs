/**
 * Tells IndexNow the site changed, so Bing recrawls in minutes instead of
 * whenever it next gets round to it.
 *
 * Google ignores IndexNow. Bing, DuckDuckGo, Yandex and Seznam honour it, and
 * one POST reaches all of them — api.indexnow.org fans the notification out.
 *
 * The URL list comes from the built sitemap rather than a list kept here, for
 * the same reason the sitemap comes from config: a list maintained by hand is
 * a list that silently goes stale. Build first.
 *
 *   npm run build && npm run ping:indexnow
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import site from "../site.config.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = site.seo.domain.replace(/\/$/, "");
const host = new URL(origin).host;
const key = "9fa2777a3da940ce95eb2b49966acf38";

const sitemap = join(root, "dist", "sitemap.xml");
if (!existsSync(sitemap)) {
  console.error("\n  No dist/sitemap.xml. Run `npm run build` first.\n");
  process.exit(1);
}

const urlList = [
  ...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g),
].map((m) => m[1]);

if (!urlList.length) {
  console.error("\n  sitemap.xml contains no URLs — nothing to submit.\n");
  process.exit(1);
}

/*
 * The key file has to be readable before the submission is worth making:
 * IndexNow verifies ownership by fetching it, and a 404 there means every URL
 * in the payload is rejected. Checking first turns a silent no-op into a
 * message that says what to fix.
 */
const keyLocation = `${origin}/${key}.txt`;
const keyCheck = await fetch(keyLocation).catch(() => null);
if (!keyCheck?.ok) {
  console.error(
    `\n  ${keyLocation} is not reachable (${keyCheck?.status ?? "no response"}).` +
      `\n  IndexNow verifies ownership by fetching it, so deploy before pinging.\n`
  );
  process.exit(1);
}
if ((await keyCheck.text()).trim() !== key) {
  console.error(`\n  ${keyLocation} does not contain the expected key.\n`);
  process.exit(1);
}

const response = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

/*
 * 200 and 202 both mean accepted; 202 specifically means "received, key still
 * being validated". Anything else is worth seeing in full, because IndexNow
 * puts the reason in the body rather than the status line.
 */
if (response.ok) {
  console.log(
    `\n  IndexNow accepted ${urlList.length} URL(s) for ${host} (HTTP ${response.status})\n`
  );
} else {
  console.error(
    `\n  IndexNow rejected the submission (HTTP ${response.status})\n  ${await response.text()}\n`
  );
  process.exit(1);
}
