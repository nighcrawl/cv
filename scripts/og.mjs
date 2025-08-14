import { chromium } from "playwright";
import { exec } from "node:child_process";

const server = exec("npx http-server dist -p 8081 -s");
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await wait(800);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto("http://localhost:8081/og/index.html", { waitUntil: "networkidle" });
  await page.screenshot({ path: "dist/og-image.png" });
  await browser.close();
  server.kill();
  console.log("✔ dist/og-image.png générée");
})();
