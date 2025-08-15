// scripts/pdf.mjs
import { spawn } from "node:child_process";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  // --- Servez dist/ sous le pathPrefix (ex: /cv/) pour que les URLs absolues résolvent correctement ---
  const rawPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";
  const prefix = (rawPrefix.startsWith("/") ? rawPrefix : `/${rawPrefix}`).replace(/\/?$/, "/");

  let serveRoot = distDir;
  let tmpRoot = null;

  if (prefix !== "/") {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "cv-serve-"));
    const sub = path.join(tmpRoot, prefix.replace(/^\/|\/$/g, "")); // ex: /tmp/.../cv
    await fs.mkdir(sub, { recursive: true });
    await fs.cp(distDir, sub, { recursive: true });
    serveRoot = tmpRoot;
  }

  const port = Number(process.env.PDF_PORT || 8787);
  const server = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["http-server", serveRoot, "-p", String(port), "-s", "-c-1"],
    { stdio: "inherit" }
  );

  // petite attente pour que le serveur écoute
  await wait(800);

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Bloque toute requête externe (GA, Google Fonts, etc.)
  const base = `http://127.0.0.1:${port}`;
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith(base)) route.continue(); else route.abort();
  });

  await page.emulateMedia({ media: "print" });

  const targets = [
    { url: `${base}${prefix}`,    out: path.join(distDir, "cv.pdf") },
    { url: `${base}${prefix}en/`, out: path.join(distDir, "en", "cv.pdf") },
  ];

  for (const t of targets) {
    // s'assure que le dossier de sortie existe
    await fs.mkdir(path.dirname(t.out), { recursive: true });

    await page.goto(t.url, { waitUntil: "networkidle" });

    // attendre le chargement des fonts (si supporté)
    try {
      await page.waitForFunction(() => document.fonts && document.fonts.status === "loaded", { timeout: 3000 });
    } catch {
      // pas bloquant
    }

    // petite marge pour le JS client éventuel
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

  // nettoyage éventuel
  if (tmpRoot) {
    try { await fs.rm(tmpRoot, { recursive: true, force: true }); } catch {}
  }
})().catch(async (err) => {
  console.error(err);
  process.exitCode = 1;
});
