
import fs from "node:fs";
import yaml from "yaml";
import { z } from "zod";

const schema = z.object({
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
    start: z.string(),
    end: z.string().nullable().optional(),
    location: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    projects: z.array(z.object({ name: z.string(), url: z.string().url() })).optional()
  })).optional(),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    start: z.string(),
    end: z.string(),
    location: z.string().optional(),
    details: z.array(z.string()).optional()
  })).optional(),
  extras: z.array(z.object({
    date: z.string().optional(),
    title: z.string(),
    collaborators: z.array(z.string()).optional(),
    links: z.array(z.object({ name: z.string(), url: z.string().url() })).optional()
  })).optional()
});

const raw = fs.readFileSync("data/site.yml", "utf-8");
const data = yaml.parse(raw);
schema.parse(data);
console.log("✔ Données valides");
