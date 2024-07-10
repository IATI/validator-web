import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    fixturesFolder: "cypress/fixtures",
    specPattern: "cypress/integration/*.spec.js",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    supportFile: "cypress/support/index.js",
  },
});
