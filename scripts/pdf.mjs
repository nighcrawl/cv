import { chromium } from "playwright";
import { exec } from "node:child_process";

const server = exec("npx http-server dist -p 8080 -s");
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await wait(800);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // FR
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  await page.pdf({ path: "dist/cv.pdf", format: "A4", printBackground: true });
  console.log("✔ dist/cv.pdf");

  // EN
  await page.goto("http://localhost:8080/en/", { waitUntil: "networkidle" });
  await page.pdf({ path: "dist/en/cv.pdf", format: "A4", printBackground: true });
  console.log("✔ dist/en/cv.pdf");

  await browser.close();
  server.kill();
})();
