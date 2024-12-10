<script setup>
  import Plausible from "plausible-tracker";
  import { onMounted, provide } from "vue";
  import LayoutFooter from "./components/layout/LayoutFooter.vue";
  import LayoutHeader from "./components/layout/LayoutHeader.vue";
  import NotificationBanner from "./components/NotificationBanner.vue";
  import { layout } from "./state";

  provide("layout", layout);

  onMounted(() => {
    const { trackEvent } = Plausible();
    const responseStart = performance.getEntriesByType("navigation")[0].responseStart;
    trackEvent("TTFB", {
      props: {
        event_category: "PageSpeed",
        event_label: responseStart,
      },
    });
  });
</script>

<template>
  <LayoutHeader />
  <!-- TODO: NotificationBanner -->
  <!-- <NotificationBanner class="mb-4" /> -->
  <main class="iati-main">
    <router-view></router-view>
  </main>
  <LayoutFooter />
</template>
