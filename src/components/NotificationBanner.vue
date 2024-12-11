<template>
  <div v-if="showBanner" class="flex flex-col items-center justify-center bg-yellow-200" @click="toggleTooltip">
    <p class="font-bold">
      New Features Launched - 15 November 2022 -
      <a href="https://iatistandard.org/en/news/easier-checks-for-data-errors-with-improved-iati-validator/">
        Announcement
      </a>
      - <a href="https://github.com/IATI/validator-web/releases/tag/v2.5.0">v2.5.0</a>
    </p>
  </div>
</template>

<script>
  export default {
    name: "NotificationBanner",
    computed: {
      showBanner() {
        return import.meta.env.VUE_ENV_SHOW_MAINTENANCE_BANNER === "true";
        // return true;
      },
    },
  };
</script>
