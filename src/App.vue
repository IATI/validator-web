<script setup>
  import Plausible from "plausible-tracker";
  import { onMounted } from "vue";
  import LayoutFooter from "./components/layout/LayoutFooter.vue";
  import LayoutHeader from "./components/layout/LayoutHeader.vue";
  import NotificationBanner from "./components/NotificationBanner.vue";

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
  <NotificationBanner class="mb-4" />
  <div class="flex-1">
    <router-view></router-view>
  </div>
  <LayoutFooter />
</template>
