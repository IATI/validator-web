# Summary

| Product          | Validator Web Frontend                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Description      | Vue.js app website for the IATI Validator.                                                                                     |
| Website          | [https://validator.iatistandard.org/](https://validator.iatistandard.org)                                                      |
| Related          | [js-validator-api](https://github.com/IATI/js-validator-api), [validator-services](https://github.com/IATI/validator-services) |
| Documentation    | [https://developer.iatistandard.org/](https://developer.iatistandard.org/)                                                     |
| Technical Issues | https://github.com/IATI/validator-web/issues                                                                                   |
| Support          | https://iatistandard.org/en/guidance/get-support/                                                                              |

# Vue Template

## Getting Started

- From GitHub click "Use this template"

### Package install

To install:

`npm install`

### Running local dev server

To run a development server using (`./envs/.env.development` vars):

`npm start`

To run a development server using (`./envs/.env.production` vars):

`npm run dev:production`

### Building for Deployment

To make a production build using (`./envs/.env.development` vars):

`npm run build:development`

To make a production build using (`./envs/.env.production` vars):

`npm run build:production`

To serve a production build locally for testing:

`npm run serve`

## Testing

### Open Cypress UI

`npm run cy:open`

### Run Cypress Tests from Command Line

`npm run cy:run`

You can run an individual test specification with the following:

`npx --no-install cypress run --config-file cypress.config.local.js --spec path/to/spec.js`

## Linting and Formatting

ESLint and Prettier are employed for linting and formatting. Implemented following this guide:
https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/

It's recommended you install the following VSCode Extensions:

- [ESLint](https://open-vsx.org/extension/dbaeumer/vscode-eslint) VSCode extension.
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### Manual Lint w/ ESLint

`npm run lint`

### Manual Format w/ Prettier

`npm run format`

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
