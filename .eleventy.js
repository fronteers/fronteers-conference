const now = String(Date.now());
const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const htmlPrettify = require("html-prettify");

module.exports = function(eleventyConfig) {
  eleventyConfig.setUseGitIgnore(true);

  eleventyConfig.addWatchTarget("./(_partials|css)/");

  eleventyConfig.addPassthroughCopy({
    "./static/": "./static/",
    "./static/favicon/favicon.ico": "./favicon.ico",
    "./static/*.html": "./",
    "./css/": "./css/",
    "./img/": "./img/",
    "./fonts/": "./fonts/",
  });

  // Image plugin
  eleventyConfig.addShortcode("image", async function(src, alt = "", sizes = "100%", loading = "eager") {
    let metadata;
    try {
      metadata = await Image(`.${src}`, {
        widths: [100, 200, 300, 400, 500, 600, 800, 1000],
        formats: ["avif", "jpeg"],
      });
    } catch (err) {
      console.error(err.message);
      return "";
    }

    let imageAttributes = {
      alt,
      sizes,
      loading,
      decoding: loading === "eager" ? "sync" : "async",
      fetchpriority: loading === "eager" ? "high" : "auto",
    };

    const html = Image.generateHTML(metadata, imageAttributes);

    return `${html}`;
  });

  eleventyConfig.addShortcode("version", function() {
    return now;
  });

  function sortByAlphabet(values) {
    return values.filter(() => true).sort((a, b) => a.url.localeCompare(b.url, 'en', { numeric: true }));
  }

  eleventyConfig.addFilter("sortByAlphabet", sortByAlphabet);

  function sortByOrder(values) {
    return values.filter(() => true).sort((a, b) => a.data.order - b.data.order);
  }

  eleventyConfig.addFilter("sortByOrder", sortByOrder);

  eleventyConfig.addFilter("json_encode", (data) => {
    return JSON.stringify(data);
  });

  eleventyConfig.addFilter("date_format", (dateIso) => {
    return DateTime.fromISO(dateIso)
      .setLocale("en-US")
      .toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
  });

  /*
  eleventyConfig.addTransform("html_prettify", function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      return htmlPrettify(content);
    }

    return content;
  });
   */


  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "./_input",
      includes: "./../_includes",
      data: "./../_data",
      output: "./_site",
    },
  };
};
