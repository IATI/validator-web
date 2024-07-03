import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://dev-validator.iatistandard.org",
    fixturesFolder: "cypress/fixtures",
    specPattern: "cypress/integration/*.spec.js",
    screenshotOnRunFailure: false,
    video: false,
    supportFile: "cypress/support/index.js",
  },
});
