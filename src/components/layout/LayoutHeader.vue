<script setup>
  import Logo from "../AppLogo.vue";
  import LanguageSwitcher from "../LanguageSwitcher.vue";
  import GeneralNav from "./GeneralNav.vue";
  import MobileNav from "./MobileNav.vue";
  import ToolNav from "./ToolNav.vue";

  const generalNavItems = [
    {
      text: "About IATI",
      link: "https://iatistandard.org/en/about/",
      external: true,
    },
    {
      text: "Use Data",
      link: "https://iatistandard.org/en/using-data/",
      external: true,
    },
    {
      text: "Publish Data",
      link: "https://iatistandard.org/en/guidance/publishing-data/",
      external: true,
    },
    {
      text: "Contact",
      link: "https://iatistandard.org/guidance/get-support/",
      external: true,
    },
  ];
  const toolNavItems = [
    {
      text: "Home",
      link: "/",
    },
    {
      text: "Check Data",
      link: "/validate",
    },
    {
      text: "Public Data Viewer",
      link: "/organisations",
    },
    {
      text: "Public API",
      link: "https://developer.iatistandard.org/api-details#api=iati-validator-v2",
      external: true,
    },
  ];
</script>

<template>
  <MobileNav :general-nav-items="generalNavItems" :tool-nav-items="toolNavItems" />
  <header class="iati-header">
    <div class="iati-header__section iati-header__section--first">
      <div class="iati-header__container">
        <Logo />
        <GeneralNav :items="generalNavItems" />
      </div>
    </div>
    <div class="iati-header__section iati-header__section--last iati-brand-background">
      <div class="iati-header__container iati-brand-background__content">
        <div class="iati-header__actions">
          <LanguageSwitcher />
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
        <ToolNav :items="toolNavItems" />
      </div>
    </div>
  </header>
</template>
