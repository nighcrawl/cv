import { chromium } from "playwright";
import { exec } from "node:child_process";

const server = exec("npx http-server dist -p 8081 -s");
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await wait(800);
  const browser = await chromium.launch();

  // FR
  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto("http://localhost:8081/og/index.html", { waitUntil: "networkidle" });
    await page.screenshot({ path: "dist/og-image.png" });
    await page.close();
    console.log("✔ dist/og-image.png");
  }

  // EN
  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto("http://localhost:8081/en/og/index.html", { waitUntil: "networkidle" });
    await page.screenshot({ path: "dist/en/og-image.png" });
    await page.close();
    console.log("✔ dist/en/og-image.png");
  }

  await browser.close();
  server.kill();
})();
