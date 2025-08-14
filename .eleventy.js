import YAML from "yaml";

export default function(eleventyConfig) {
  eleventyConfig.addDataExtension("yml",  c => YAML.parse(c));
  eleventyConfig.addDataExtension("yaml", c => YAML.parse(c));
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});

  eleventyConfig.addFilter("fmtDate", (str) => !str ? "Aujourd'hui" : str.replace(/-/g, "·"));

  return {
    dir: { input: "templates", includes: "partials", data: "../data", output: "dist" },
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/", // ex: "/cv/"
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}