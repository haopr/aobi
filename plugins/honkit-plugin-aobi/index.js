const { before, after } = require("./transform");

module.exports = {
  website: {
    assets: "./assets",
    js: ["plugin.js"],
    css: ["plugin.css"],
  },
  hooks: {
    "page:before": function pageBefore(page) {
      page.content = before(page.content);
      return page;
    },
    page: function pageAfter(page) {
      page.content = after(page.content);
      return page;
    },
  },
};
