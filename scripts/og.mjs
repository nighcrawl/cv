// scripts/og.mjs
import { chromium } from "playwright";
import { resolve } from "node:path";

const fileURL = (p) => "file://" + resolve(p);

async function shot(inputHtml, outputPng) {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630, deviceScaleFactor: 2 }
  });

  // Aucune requête réseau externe
  await page.route("**/*", route => {
    const u = route.request().url();
    if (u.startsWith("file:") || u.startsWith("data:")) return route.continue();
    return route.abort();
  });

  await page.goto(fileURL(inputHtml), { waitUntil: "load", timeout: 30000 });
  // attendre les polices si présentes (safe, non bloquant si absent)
  await page.evaluate(async () => { if (document.fonts?.ready) { await document.fonts.ready; } });
  await page.screenshot({ path: outputPng });
  await browser.close();
}

(async () => {
  await shot("dist/og/index.html", "dist/og-image.png");
  console.log("✔ dist/og-image.png");
  await shot("dist/en/og/index.html", "dist/en/og-image.png");
  console.log("✔ dist/en/og-image.png");
})();
