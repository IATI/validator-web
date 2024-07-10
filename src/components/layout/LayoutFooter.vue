<script setup>
  import { computed, reactive, ref, watch } from "vue";
  import { ENVIRONMENT, getDefaultServicesAPIOptions, buildServicesEndpoint } from "../../utils";
  import { version } from "../../../package.json";

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
  <footer class="block bg-iati-green">
    <div class="flex w-full flex-col justify-between px-4 py-10 lg:mx-auto lg:max-w-[1140px] lg:flex-row lg:px-2">
      <div class="flex flex-col items-center p-2 lg:items-start">
        <a href="https://iatistandard.org" class="h-20 w-80 bg-logo-white bg-contain bg-no-repeat text-transparent">
          IATI Logo</a
        >
      </div>
      <div class="flex flex-col p-2">
        <h2 class="text-lg font-bold uppercase text-white">Useful links</h2>
        <ul class="mt-0 mb-2 list-none pl-0 text-center text-white lg:text-left">
          <li>
            <a href="https://iatistandard.org/en/contact/" class="underline">Contact</a>
          </li>
          <li>
            <a href="https://iatistandard.org/en/privacy-policy/" class="underline">Privacy policy</a>
          </li>
        </ul>
      </div>
      <div class="flex flex-col p-2 lg:flex-row">
        <div class="text-center text-white">
          <p class="m-0 text-sm">Part of the <b>IATI Unified Platform</b></p>
          <p class="m-0 text-sm">
            Code licensed under the
            <a class="underline" href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU AGPL</a>.
          </p>
          <p class="m-0 text-sm">
            Documentation licensed under
            <a class="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 3.0</a>.
          </p>
          <br />
          <p v-if="showVersions">
            <a class="underline" :href="releases.web.url">Web v{{ releases.web.version }}</a> |
            <a class="underline" :href="releases.services.url">Services v{{ releases.services.version }}</a>
            |
            <a class="underline" :href="releases.api.url">API v{{ releases.api.version }}</a>
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-iati-accent px-6 py-4">
      <div class="flex w-full flex-col justify-between lg:mx-auto lg:max-w-[1140px] lg:flex-row">
        <p class="lg-pb-0 float-left inline-block pb-4 text-white">Copyright IATI {{ year }}. All rights reserved</p>
        <div class="float-right text-transparent">
          <a href="https://twitter.com/IATI_aid" class="inline-block h-9 w-9 bg-twitter"> Twitter </a>
          <a
            href="https://www.youtube.com/channel/UCAVH1gcgJXElsj8ENC-bDQQ"
            class="ml-2.5 inline-block h-9 w-9 bg-youtube"
          >
            Youtube
          </a>
          <a
            href="https://www.linkedin.com/company/international-aid-transparency-initiative/"
            class="ml-2.5 inline-block h-9 w-9 bg-linkedin"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
