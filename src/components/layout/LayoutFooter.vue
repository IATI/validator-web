<script setup>
  import { computed, reactive, ref, watch } from "vue";
  import { ENVIRONMENT, getDefaultServicesAPIOptions, buildServicesEndpoint } from "../../utils";
  import { version } from "../../../package.json";
  import LanguageSwitcher from "../LanguageSwitcher.vue";

  const releases = reactive({ services: {}, web: { version }, api: {} });
  const year = computed(() => new Date().getFullYear());
  const showVersions = ref(false);

  const gitHubURL = "https://github.com/IATI";
  const getReleaseURL = (path, version) => {
    return ENVIRONMENT === "production" ? `${gitHubURL}${path}/releases/tag/v${version}` : `${gitHubURL}${path}`;
  };

  watch(releases, () => {
    showVersions.value = releases.services.version && releases.web.version && releases.api.version;
    if (showVersions.value) {
      releases.services.url = getReleaseURL("/validator-services", releases.services.version);
      releases.web.url = getReleaseURL("/validator-web", releases.web.version);
      releases.api.url = getReleaseURL("/js-validator-api", releases.api.version);
    }
  });

  const fetchRelease = async (url) => {
    const response = await window.fetch(url, getDefaultServicesAPIOptions());
    if (response.status === 200) {
      return await response.text();
    }
  };

  const fetchReleases = async () => {
    releases.services.version = await fetchRelease(buildServicesEndpoint("/pub/version"));
    releases.api.version = await fetchRelease(buildServicesEndpoint("/pub/validator-version"));
  };

  fetchReleases();
</script>

<template>
  <footer class="iati-footer iati-brand-background">
    <div class="iati-brand-background__content">
      <div class="iati-footer__section">
        <div class="iati-footer__container">
          <div class="iati-footer-block">
            <h2 class="iati-footer-block__title">Additional Information</h2>
            <div class="iati-footer-block__content iati-footer-block__content--columns">
              <div>
                <p>Part of the IATI Unified Platform.</p>
                <p>
                  Code licensed under
                  <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU AGPL</a>.
                </p>
                <p>
                  Documentation licensed under
                  <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
                </p>
              </div>
              <div v-if="showVersions">
                <p>
                  <a :href="releases.web.url">Web v{{ releases.web.version }}</a>
                </p>
                <p>
                  <a :href="releases.services.url">Services v{{ releases.services.version }}</a>
                </p>
                <p>
                  <a :href="releases.api.url">API v{{ releases.api.version }}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="iati-footer__section iati-footer__section--last">
        <div class="iati-footer__container">
          <nav>
            <ul class="iati-piped-list iati-footer__legal-nav">
              <li><a href="https://iatistandard.org/en/privacy-policy/">Privacy Policy</a></li>
              <li>
                &copy; Copyright {{ year }} United Nations Development Programme, on behalf of the IATI Secretariat.
              </li>
            </ul>
          </nav>
          <LanguageSwitcher />
          <div class="iati-footer__social">
            <a href="https://www.linkedin.com/company/international-aid-transparency-initiative/" aria-label="LinkedIn">
              <i class="iati-icon iati-icon--linkedin"></i>
            </a>
            <a href="https://x.com/IATI_aid" aria-label="X">
              <i class="iati-icon iati-icon--x"></i>
            </a>
            <a href="https://www.youtube.com/channel/UCAVH1gcgJXElsj8ENC-bDQQ" aria-label="YouTube">
              <i class="iati-icon iati-icon--youtube"></i>
            </a>
            <a href="https://www.facebook.com/IATIaid/" aria-label="Facebook">
              <i class="iati-icon iati-icon--facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
