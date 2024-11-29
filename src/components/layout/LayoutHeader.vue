<template>
  <header class="iati-header">
    <div class="iati-header__section iati-header__section--first">
      <div class="iati-header__container">
        <a href="https://iatistandard.org/" aria-label="Go to IATI homepage">
          <img class="iati-header__logo" alt="" src="../../assets/svg/logo-colour.svg" />
        </a>
        <nav class="iati-header__general-nav">
          <ul class="iati-piped-list">
            <li>
              <a href="https://iatistandard.org/en/about/">About IATI</a>
            </li>
            <li>
              <a href="https://iatistandard.org/en/using-data/">Use Data</a>
            </li>
            <li>
              <a href="https://iatistandard.org/en/guidance/publishing-data/">Publish Data</a>
            </li>
            <li>
              <a href="https://iatistandard.org/guidance/get-support/">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="iati-header__section iati-header__section--last iati-brand-background">
      <div class="iati-header__container iati-brand-background__content">
        <div class="iati-header__actions">
          <div class="iati-country-switcher">
            <label for="iati-country-switcher" class="iati-country-switcher__label">Choose your language</label>
            <select id="iati-country-switcher" class="iati-country-switcher__control">
              <option>English</option>
            </select>
          </div>
          <a href="https://docs.validator.iatistandard.org" class="iati-button iati-button--light hide--mobile-nav">
            <span>Help Docs</span>
            <img class="iati-button__icon" alt="" src="../../assets/icons/info.svg" />
          </a>
          <button class="iati-menu-toggle iati-menu-toggle--open js-iati-menu-toggle-open">
            <span class="iati-menu-toggle__label">Menu</span>
          </button>
        </div>
        <div class="iati-header-title">
          <p class="iati-header-title__eyebrow">IATI Tools</p>
          <p class="iati-header-title__heading">IATI Validator</p>
        </div>
        <div class="iati-header__nav">
          <nav>
            <ul class="iati-tool-nav">
              <li><router-link to="/" class="iati-tool-nav-link">Home</router-link></li>
              <li><router-link to="/validate" class="iati-tool-nav-link">Check Data</router-link></li>
              <li><router-link to="/organisations" class="iati-tool-nav-link">Public Data Viewer</router-link></li>
              <li>
                <a
                  href="https://developer.iatistandard.org/api-details#api=iati-validator-v2"
                  class="iati-tool-nav-link"
                >
                  Public API
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>
