
import { chromium } from "playwright";
import { exec } from "node:child_process";

const server = exec("npx http-server dist -p 8080 -s");
function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

(async () => {
  await wait(800);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8080", { waitUntil: "networkidle" });
  await page.pdf({ path: "dist/cv.pdf", format: "A4", printBackground: true });
  await browser.close();
  server.kill();
  console.log("✔ PDF généré: dist/cv.pdf");
})();
