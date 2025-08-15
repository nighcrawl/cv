// scripts/pdf.mjs
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");

// Démarre un mini serveur pour servir /dist (évite les problèmes de file:// et pathPrefix)
const port = process.env.PDF_PORT || 8787;
const server = spawn(process.platform === "win32" ? "npx.cmd" : "npx",
  ["http-server", distDir, "-p", String(port), "-s", "-c-1"],
  { stdio: "inherit" }
);

function wait(ms){return new Promise(r=>setTimeout(r,ms));}

(async () => {
  // petite attente que le serveur soit prêt
  await wait(800);

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Bloque tout ce qui n'est pas servi localement (fonts externes, GA, etc.)
  const base = `http://127.0.0.1:${port}`;
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith(base)) route.continue(); else route.abort();
  });

  await page.emulateMedia({ media: "print" });

  // Chemin base = pathPrefix (ex: "/cv/" en CI), sinon "/"
  const prefix = (process.env.ELEVENTY_PATH_PREFIX || "/").replace(/\/?$/, "/");

  const targets = [
    { url: `${base}${prefix}`, out: path.join(distDir, "cv.pdf") },
    { url: `${base}${prefix}en/`, out: path.join(distDir, "en", "cv.pdf") },
  ];

  for (const t of targets) {
    await page.goto(t.url, { waitUntil: "networkidle" });
    // Attendre les fonts
    await page.waitForFunction(() => document.fonts && document.fonts.status === "loaded");
    // Petite réserve pour le JS client s’il tourne
    await wait(150);

    await page.pdf({
      path: t.out,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "10mm", right: "10mm", bottom: "12mm", left: "10mm" },
      scale: 1
    });
    console.log(`✓ PDF -> ${t.out}`);
  }

  await browser.close();
  server.kill("SIGTERM");
})().catch(err => {
  console.error(err);
  server.kill("SIGTERM");
  process.exit(1);
});
