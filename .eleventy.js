import YAML from "yaml";

export default function(eleventyConfig) {
  // ↓ autorise .yml / .yaml comme fichiers de data globaux
  eleventyConfig.addDataExtension("yml",  contents => YAML.parse(contents));
  eleventyConfig.addDataExtension("yaml", contents => YAML.parse(contents));

  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
  eleventyConfig.addFilter("fmtDate", (str) => {
    if (!str) return "Aujourd'hui";
    return str.replace(/-/g, "·");
  });

  return {
    dir: { input: "templates", includes: "partials", data: "../data", output: "dist" },
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/", // ex: "/cv/"
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
