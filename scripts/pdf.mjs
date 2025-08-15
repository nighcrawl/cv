import { chromium } from "playwright";
import { exec } from "node:child_process";

const PORT = process.env.PDF_PORT || 8080;
const serve = exec(`npx http-server dist -p ${PORT} -s -c-1`); // -c-1 = no cache
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function makePdf(path, url) {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();

  // Bloque tout ce qui n’est pas local → évite les hangs “network idle”
  await page.route("**/*", route => {
    const u = route.request().url();
    if (u.startsWith(`http://localhost:${PORT}`) || u.startsWith("data:") || u.startsWith("file:"))
      return route.continue();
    return route.abort();
  });

  await page.emulateMedia({ media: "print" });
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  // petit sélecteur de sanity pour être sûr que le DOM est là
  await page.waitForSelector("h1", { timeout: 5000 }).catch(() => {});
  await page.pdf({
    path,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true
  });
  await browser.close();
}

(async () => {
  try {
    await wait(1000); // warm-up serveur
    await makePdf("dist/cv.pdf", `http://localhost:${PORT}/`);
    console.log("✔ dist/cv.pdf");
    await makePdf("dist/en/cv.pdf", `http://localhost:${PORT}/en/`);
    console.log("✔ dist/en/cv.pdf");
  } finally {
    serve.kill("SIGTERM");
  }
})();
