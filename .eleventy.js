const now = String(Date.now());
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    eleventyConfig.setUseGitIgnore(true);

    eleventyConfig.addWatchTarget("./_input/");
    eleventyConfig.addWatchTarget("./_includes/");
    eleventyConfig.addWatchTarget("./_partials/");
    eleventyConfig.addWatchTarget("./css/");

    eleventyConfig.addPassthroughCopy({
        "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
        "./css/": "./css/",
        "./js/": "./js/",
        "./img/": "./img/",
        "./fonts/": "./fonts/",
        "./documents/": "./documents/",
    });

    eleventyConfig.addShortcode("version", function () {
        return now;
    });

    eleventyConfig.addFilter("json_encode", (data) => {
        return JSON.stringify(data);
    });

    eleventyConfig.addFilter("number_format", (data) => {
        return new Intl.NumberFormat("en-US").format(data);
    });

    eleventyConfig.addFilter("date_format", (dateIso) => {
        return DateTime.fromISO(dateIso)
            .setLocale("en-US")
            .toLocaleString(DateTime.DATE_FULL);
    });

    eleventyConfig.addCollection("pages", (collection) => {
        return collection
            .getFilteredByGlob("./_input/*.md")
            .sort((a, b) =>
                parseInt(a.fileSlug, 10) > parseInt(b.fileSlug, 10) ? 1 : -1
            );
    });

    return {
        dir: {
            input: "./_input",
            includes: "./../_includes",
            data: "./../_data",
            output: "./_site",
        },
    };
};
