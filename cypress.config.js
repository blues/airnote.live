const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5555",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
