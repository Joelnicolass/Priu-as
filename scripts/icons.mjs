// Genera los íconos PNG de la PWA renderizando HTML con Chromium.
import { chromium } from "playwright";

const html = (size, pad) => `<!doctype html><html><body style="margin:0">
<div style="width:${size}px;height:${size}px;background:#0A0A0A;display:grid;place-items:center">
  <div style="width:${size - pad * 2}px;height:${size - pad * 2}px;display:grid;place-items:center;font-family:'Bodoni 72','Didot','DejaVu Serif',Georgia,serif;font-size:${(size - pad * 2) * 0.5}px;line-height:1;color:#F4F1EC;letter-spacing:-0.06em">
    <span>P<i>K</i></span>
  </div>
</div></body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
const out = [
  ["public/icons/icon-192.png", 192, 12],
  ["public/icons/icon-512.png", 512, 32],
  ["public/icons/maskable-512.png", 512, 100],
  ["public/icons/apple-touch-icon.png", 180, 12],
  ["src/app/icon.png", 64, 4],
];
for (const [file, size, pad] of out) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html(size, pad));
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: size, height: size } });
}
await browser.close();
