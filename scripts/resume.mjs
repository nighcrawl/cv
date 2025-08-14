import fs from "node:fs";
import yaml from "yaml";

const raw = fs.readFileSync("data/site.yml", "utf-8");
const site = yaml.parse(raw); // => { identity, experience, education, skills, ... }

const basics = {
  name: site.identity?.name,
  label: site.identity?.title,
  email: site.identity?.email,
  url: site.identity?.website,
  location: { city: site.identity?.location },
  profiles: (site.identity?.socials || []).map(s => ({ network: s.name, url: s.url }))
};

const work = (site.experience || []).map(x => ({
  name: x.company,
  position: x.role,
  location: x.location,
  startDate: x.start,
  endDate: x.end || "",
  highlights: x.highlights || [],
  url: x.projects?.[0]?.url || undefined
}));

const education = (site.education || []).map(e => ({
  institution: e.school,
  area: "", // optionnel
  studyType: e.degree,
  startDate: e.start,
  endDate: e.end,
  location: e.location,
  courses: e.details || []
}));

const skills = (site.skills || []).map(g => ({
  name: g.group,
  keywords: g.items || []
}));

const out = {
  "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics, work, education, skills,
  meta: { canonical: site.metadata?.source_page, lastModified: new Date().toISOString() }
};

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/resume.json", JSON.stringify(out, null, 2));
console.log("✔ dist/resume.json généré");
