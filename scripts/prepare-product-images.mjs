/**
 * Prepare the GlamifiedHR captures for the web.
 *
 *   node scripts/prepare-product-images.mjs <folder of shot-NN.png>
 *
 * Reads numbered captures of the running application and writes right-sized
 * WebP into public/images/product/, which is where site.config.js points. Run
 * it when a screen is recaptured; the output is committed.
 *
 * The numbering is the order the screens were captured in. Re-capture the whole
 * set rather than one screen where the sidebar or the window size has changed —
 * a tour of twenty screens is only convincing while they all match.
 *
 * `trimBottom` removes a strip of Windows desktop or taskbar caught in the
 * capture. Everything else is left exactly as the application rendered it.
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(SITE, 'package.json'));
const sharp = require('sharp');

const SRC = process.argv[2];
const OUT = path.join(SITE, 'public/images/product');

if (!SRC || !existsSync(SRC)) {
  console.error(
    '  usage: node scripts/prepare-product-images.mjs <folder containing shot-01.png ...>'
  );
  process.exit(1);
}

/** [source shot, output name, options] — order follows the product tour. */
const SHOTS = [
  ['05', 'dashboard'],
  ['04', 'employees'],
  ['08', 'departments'],
  ['09', 'leave'],
  ['10', 'attendance', { trimBottom: 24 }],
  ['07', 'deductions'],
  ['11', 'payroll-runs'],
  ['13', 'payroll-run', { trimBottom: 28 }],
  ['17', 'terminal-benefits'],
  ['18', 'napsa-return'],
  ['19', 'paye-return'],
  ['20', 'nhima-return'],
  ['21', 'reports-payroll'],
  ['22', 'reports-statutory'],
  ['23', 'data-export', { trimBottom: 40 }],
  ['24', 'settings-company'],
  ['25', 'settings-paye-bands'],
  ['26', 'settings-overtime'],
  ['27', 'settings-holidays'],
  ['02', 'sign-in'],
];

const WIDTH = 1200;

mkdirSync(OUT, { recursive: true });

let total = 0;
for (const [shot, name, opts = {}] of SHOTS) {
  const src = path.join(SRC, `shot-${shot}.png`);
  const dest = path.join(OUT, `${name}.webp`);

  let pipeline = sharp(src);
  const meta = await pipeline.metadata();

  if (opts.trimBottom) {
    pipeline = pipeline.extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: meta.height - opts.trimBottom,
    });
  }

  const info = await pipeline
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);

  total += statSync(dest).size;
  console.log(
    `${name.padEnd(22)} ${String(meta.width).padStart(4)}x${meta.height}` +
      ` -> ${info.width}x${info.height}  ${(statSync(dest).size / 1024).toFixed(0)} KB`
  );
}

console.log(`\n${SHOTS.length} images, ${(total / 1024).toFixed(0)} KB total`);
