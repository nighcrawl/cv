// scripts/validate.mjs
import fs from "node:fs";
import yaml from "yaml";
import { z } from "zod";

const siteSchema = z.object({
  identity: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string().optional(),
    email: z.string().optional(),
    website: z.string().url().optional(),
    socials: z.array(z.object({ name: z.string(), url: z.string().url() })).optional()
  }),
  skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })).optional(),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(),                 // "YYYY-MM" ou "YYYY-MM-DD"
    end: z.string().nullable().optional(),
    location: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    projects: z.array(z.object({ name: z.string(), url: z.string().url() })).optional(),
    url: z.string().url().optional()
  })).optional(),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    start: z.string(),
    end: z.string(),
    location: z.string().optional(),
    details: z.array(z.string()).optional(),
    url: z.string().url().optional()
  })).optional(),
  extras: z.array(z.object({
    date: z.string().optional(),
    title: z.string(),
    collaborators: z.array(z.string()).optional(),
    links: z.array(z.object({ name: z.string(), url: z.string().url() })).optional()
  })).optional()
});

const i18nSchema = z.object({
  labels: z.object({
    skills: z.string(),
    experience: z.string(),
    education: z.string(),
    extras: z.string(),
    pdf: z.string(),
    json: z.string(),
    switchTo: z.string()
  })
});

function loadYml(path) {
  if (!fs.existsSync(path)) throw new Error(`fichier manquant: ${path}`);
  const raw = fs.readFileSync(path, "utf8");
  return yaml.parse(raw);
}

const ALL = ["fr", "en"].filter(lang => fs.existsSync(`data/${lang}/site.yml`));
if (ALL.length === 0) {
  console.error("✖ Aucun fichier data/<lang>/site.yml trouvé (attendu: fr et/ou en).");
  process.exit(1);
}

let ok = true;
for (const lang of ALL) {
  try {
    siteSchema.parse(loadYml(`data/${lang}/site.yml`));
    console.log(`✔ data/${lang}/site.yml valide`);
  } catch (e) {
    ok = false;
    console.error(`✖ data/${lang}/site.yml invalide: ${e.message}`);
  }
  try {
    i18nSchema.parse(loadYml(`data/i18n/${lang}.yml`));
    console.log(`✔ data/i18n/${lang}.yml valide`);
  } catch (e) {
    ok = false;
    console.error(`✖ data/i18n/${lang}.yml invalide: ${e.message}`);
  }
}

if (!ok) process.exit(1);
console.log("✔ Toutes les données FR/EN sont valides");
