import { chromium } from "playwright";
import { resolve } from "node:path";
const file = (p) => "file://" + resolve(p);

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox","--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print" });

  await page.goto(file("dist/index.html"), { waitUntil: "load", timeout: 30000 });
  await page.pdf({ path: "dist/cv.pdf", format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log("✔ dist/cv.pdf");

  await page.goto(file("dist/en/index.html"), { waitUntil: "load", timeout: 30000 });
  await page.pdf({ path: "dist/en/cv.pdf", format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log("✔ dist/en/cv.pdf");

  await browser.close();
})();
