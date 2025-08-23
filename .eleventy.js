import YAML from "yaml";

export default function(eleventyConfig) {
  eleventyConfig.addDataExtension("yml",  c => YAML.parse(c));
  eleventyConfig.addDataExtension("yaml", c => YAML.parse(c));

  // --- helpers internes
  const toDate = (v) => {
    if (!v) return null;
    const s = String(v);
    if (/^\d{4}-\d{2}$/.test(s)) return new Date(`${s}-01`);      // "YYYY-MM" -> 1er du mois
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s);         // "YYYY-MM-DD"
    return new Date(s);
  };

  // dateFmt: "déc. 2018", "sept. 2008", etc. (locale par défaut: fr)
  const dateFmt = (value, locale = "fr", style = "shortMonthYear") => {
    const map = {
      shortMonthYear: { month: "short", year: "numeric" },
      longMonthYear:  { month: "long",  year: "numeric" },
      dayMonthYear:   { day: "2-digit", month: "short", year: "numeric" }
    };
    const dt = toDate(value);
    if (!dt || isNaN(dt)) return "";
    return new Intl.DateTimeFormat(locale, map[style] || map.shortMonthYear).format(dt);
  };

  // dateOr: si null -> libellé (ex: "En poste")
  const dateOr = (value, fallback, locale = "fr", style = "shortMonthYear") =>
    value ? dateFmt(value, locale, style) : fallback;

  // dateAttr: pour tes data-* (force YYYY-MM-DD)
  const dateAttr = (value) => {
    if (!value) return "";
    const s = String(value);
    if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const d = toDate(value);
    if (isNaN(d)) return "";
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  };

  // relativeMonths: "6 ans 3 mois" entre start et end/aujourd'hui
  const relativeMonths = (start, end = null, locale = "fr") => {
    const s = toDate(start), e = end ? toDate(end) : new Date();
    if (!s || isNaN(s) || !e || isNaN(e)) return "";
    let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    const years = Math.floor(months / 12);
    months = months % 12;
    const L = locale.startsWith("fr");
    const parts = [];
    if (years) parts.push(`${years} ${L ? (years>1?"ans":"an") : (years>1?"years":"year")}`);
    if (months) parts.push(`${months} ${L ? "mois" : (months>1?"months":"month")}`);
    return parts.join(" ");
  };

  const sortByDateDesc = (items = []) => {
    const FUTURE = new Date(9999, 0, 1);
    return [...items].sort((a, b) => {
      const aEnd = a.end ? toDate(a.end) : FUTURE;
      const bEnd = b.end ? toDate(b.end) : FUTURE;

      if (bEnd - aEnd !== 0) return bEnd - aEnd; // fin la plus récente d'abord

      const aStart = a.start ? toDate(a.start) : new Date(0);
      const bStart = b.start ? toDate(b.start) : new Date(0);

      return bStart - aStart; // sinon début le plus récent d'abords
    })
  }

  // Enregistre les filtres Nunjucks
  eleventyConfig.addFilter("dateFmt", dateFmt);
  eleventyConfig.addFilter("dateOr", dateOr);
  eleventyConfig.addFilter("dateAttr", dateAttr);
  eleventyConfig.addFilter("relativeMonths", relativeMonths);
  eleventyConfig.addFilter("sortByDateDesc", sortByDateDesc);

  // au lieu de copier tout le dossier assets
  eleventyConfig.addPassthroughCopy({ "src/assets/css/main.css": "assets/css/main.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });



  return {
    dir: { input: "templates", includes: "partials", data: "../data", output: "dist" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/"
  };
}
