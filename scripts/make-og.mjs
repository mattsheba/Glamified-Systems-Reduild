/**
 * Social share card for glamifiedsystems.com.
 *
 * The site shipped with a placeholder OG image, so every WhatsApp share of it
 * showed a dashed box reading "PLACEHOLDER" — on a site whose primary call to
 * action is WhatsApp.
 *
 * 1200x630, composed from assets already in the repository: the product
 * lockup, the dashboard capture, and type set in SVG.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(SITE, 'package.json'));
const sharp = require('sharp');

const W = 1200;
const H = 630;
const INK = '#0f1725'; // the mark's own navy
const ACCENT = '#4FB3D4'; // accent lightened for a dark ground

// Lockup, on its own white tile so the dark mark reads on the dark ground.
const lockup = await sharp(path.join(SITE, 'public/images/product/glamifiedhr-lockup.webp'))
  .resize({ height: 132 })
  .toBuffer();
const lockupMeta = await sharp(lockup).metadata();

const tile = await sharp({
  create: {
    width: lockupMeta.width + 56,
    height: lockupMeta.height + 44,
    channels: 4,
    background: '#ffffff',
  },
})
  .composite([{ input: lockup, left: 28, top: 22 }])
  .png()
  .toBuffer();

// The dashboard, bled off the right edge so it reads as a real screen rather
// than a floating thumbnail.
const shot = await sharp(path.join(SITE, 'public/images/product/dashboard.webp'))
  .resize({ width: 780 })
  .toBuffer();
const shotMeta = await sharp(shot).metadata();

const text = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>
    .h { font-family: "Segoe UI Semibold","Segoe UI",Arial,sans-serif; font-size: 52px; font-weight: 700; fill: #ffffff; }
    .s { font-family: "Segoe UI","Segoe UI",Arial,sans-serif; font-size: 27px; fill: #c9d4e2; }
    .k { font-family: "Segoe UI Semibold","Segoe UI",Arial,sans-serif; font-size: 23px; font-weight: 700; fill: ${ACCENT}; letter-spacing: 2px; }
  </style>
  <text class="h" x="72" y="322">Payroll that follows</text>
  <text class="h" x="72" y="384">Zambian law</text>
  <text class="s" x="72" y="444">PAYE, NAPSA and NHIMA, calculated.</text>
  <text class="s" x="72" y="484">Statutory returns, ready to file.</text>
  <text class="k" x="72" y="546">RUNS OFFLINE &#183; 30-DAY FREE TRIAL</text>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 4, background: INK } })
  .composite([
    // Screenshot first, dimmed by the panel over it, so the type stays legible.
    { input: shot, left: W - 560, top: Math.round((H - shotMeta.height) / 2) },
    {
      input: {
        create: { width: W, height: H, channels: 4, background: 'rgba(15,23,37,0.72)' },
      },
      left: 0,
      top: 0,
    },
    { input: tile, left: 72, top: 78 },
    { input: text, left: 0, top: 0 },
    // Accent rule along the foot, the same gesture the header uses.
    {
      input: {
        create: { width: W, height: 8, channels: 4, background: '#006C90' },
      },
      left: 0,
      top: H - 8,
    },
  ])
  .png()
  .toFile(path.join(SITE, 'public/images/brand/og-glamifiedhr.png'));

const out = await sharp(path.join(SITE, 'public/images/brand/og-glamifiedhr.png')).metadata();
console.log(`og ${out.width}x${out.height}`);
