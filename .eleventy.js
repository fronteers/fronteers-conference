import { DateTime } from "luxon";
import Image from "@11ty/eleventy-img";
import htmlPrettify from "html-prettify";

const now = String(Date.now());

export default function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(true);

  eleventyConfig.addWatchTarget("./_includes/");
  eleventyConfig.addWatchTarget("./_partials/");
  eleventyConfig.addWatchTarget("./css/");
  eleventyConfig.addWatchTarget("./scripts/");

  eleventyConfig.addPassthroughCopy({
    "./static/": "./static/",
    "./static/favicon/favicon.ico": "./favicon.ico",
    "./static/*.html": "./",
    "./css/": "./css/",
    "./img/": "./img/",
    "./fonts/": "./fonts/",
    "./scripts/": "./scripts/",
  });

  async function makeOptimizedImage(
    src,
    alt = "",
    sizes = "100vw",
    loading = "eager",
    widths = [100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1600, 2000, 3000],
    formats = ["avif", "jpeg"],
    classes = ["--generated"]
  ) {
    let metadata;

    if (!src.startsWith("https://") && !src.startsWith("http://")) {
      src = `./${src}`;
    } else {
      console.debug(`[img] optimize remote: ${src}`);
    }

    if (src.startsWith(".//")) {
      src = src.replace(".//", "./");
    }

    try {
      metadata = await Image(src, {
        widths,
        formats,
        outputDir: "./_site/img/generated/",
        urlPath: "/img/generated/",
      });
    } catch (err) {
      console.error(err.message);
      return "";
    }

    const allData = metadata[formats[0]];
    const data = allData[allData.length - 1];

    const orientation =
      data.width > data.height
        ? "landscape"
        : Math.abs(data.width - data.height) < 5
          ? "square"
          : "portrait";

    const imageAttributes = {
      alt,
      sizes,
      loading,
      decoding: loading === "eager" ? "sync" : "async",
      fetchpriority: loading === "eager" ? "high" : "auto",
      class: classes.concat([`--${orientation}`]).join(" "),
    };

    let html = "";

    try {
      html = Image.generateHTML(metadata, imageAttributes);
    } catch (err) {
      console.error(err.message);
    }

    return `${html}`;
  }

  async function makeThumbnail(
    src,
    alt = "",
    sizes = "100vw",
    loading = "lazy",
    widths = [600],
    formats = ["avif", "jpeg"]
  ) {
    return makeOptimizedImage(src, alt, sizes, loading, widths, formats);
  }

  // Image plugin
  eleventyConfig.addNunjucksAsyncShortcode("image", makeOptimizedImage);

  eleventyConfig.addShortcode("thumbnail", makeThumbnail);
  eleventyConfig.addShortcode("photoGrid", async function (photos) {
    let html = "<ol data-component='photo-grid' class='photo-grid'>";

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const imageHtml = await makeOptimizedImage(
        photo.url,
        "",
        "33vw",
        i > 9 ? "lazy" : "eager",
        [357 * 2]
      );

      const orientation = imageHtml.includes("--landscape")
        ? "--landscape"
        : imageHtml.includes("--portrait")
          ? "--portrait"
          : imageHtml.includes("--square")
            ? "--square"
            : "";

      html += `<li class="photo ${orientation}"><a href="${photo.url}">${imageHtml}</a></li>`;
    }

    html += "</ol>";

    return html;
  });

  eleventyConfig.addShortcode("version", function () {
    return now;
  });

  function sortByAlphabet(values) {
    return values
      .filter(() => true)
      .sort((a, b) => a.url.localeCompare(b.url, "en", { numeric: true }));
  }

  eleventyConfig.addFilter("sortByAlphabet", sortByAlphabet);

  function sortByOrder(values) {
    return values
      .filter(() => true)
      .sort((a, b) => a.data.order - b.data.order);
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

  eleventyConfig.addTransform("html_prettify", function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      return htmlPrettify(content);
    }

    return content;
  });

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "./_input",
      includes: "./../_includes",
      data: "./../_data",
      output: "./_site",
    },
  };
}
