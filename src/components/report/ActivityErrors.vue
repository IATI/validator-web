<script setup>
  import { computed, inject, ref, watch } from "vue";
  import { getReportErrorsByIdentifier } from "../../utils";
  import AppAccordion from "../AppAccordion.vue";
  import AppPagination from "../AppPagination.vue";
  import FeedbackGroup from "./FeedbackGroup.vue";

  const props = defineProps({
    title: { type: String, default: "" },
    fileType: { type: String, default: "activity" }, // options are activity and organisation
    filterText: { type: String, default: "" },
  });

  const filterByNameOrId = (filterText, title, identifier) => {
    if (filterText && filterText.length && title.length && identifier.length) {
      return (
        title.toLowerCase().includes(filterText.toLowerCase()) ||
        identifier.toLowerCase().includes(filterText.toLowerCase())
      );
    } else {
      return !filterText;
    }
  };

  const report = inject("report");
  const data = computed(() =>
    getReportErrorsByIdentifier(report.value, "activity").filter(
      (item) => item.errors.length && item.errors.some((i) => i.errors.length), // only include items with feedback to show
    ),
  );

  const filteredData = computed(() =>
    data.value.filter((item) => filterByNameOrId(props.filterText, item.title, item.identifier)),
  );

  const page = ref(1);
  const PAGE_LIMIT = 10;
  const pageData = computed(() => {
    const min = (page.value - 1) * PAGE_LIMIT;
    const max = min + PAGE_LIMIT;
    return filteredData.value.filter((item, index) => index < max && index >= min);
  });

  watch(report, () => {
    page.value = 1;
  });

  watch(filteredData, () => {
    page.value = 1;
  });

  const onNext = () => {
    const nextPage = page.value + 1;
    const maxPages = Math.ceil(data.value.length / PAGE_LIMIT);
    if (nextPage <= maxPages) page.value = nextPage;
  };
  const onPrevious = () => {
    const previousPage = page.value - 1;
    if (previousPage >= 1) page.value = previousPage;
  };
</script>

<template>
  <AppAccordion :open="true" :header-classes="'text-white bg-iati-green px-4 py-2'">
    <template #title>
      <div class="w-full text-left">
        {{ props.title }}
      </div>
    </template>
    <template #content>
      <div class="border border-solid border-gray-200 p-4">
        <FeedbackGroup
          v-for="activity in pageData"
          :key="activity.identifier"
          :activity="activity"
          data-cy="feedback-group"
        />
        <AppPagination v-if="filteredData.length > 10" @next="onNext" @previous="onPrevious">
          <span class="text-sm">Page {{ page }} of {{ Math.ceil(filteredData.length / PAGE_LIMIT) }}</span>
        </AppPagination>
        <span v-if="!pageData.length && !filterText">There is no feedback to display</span>
        <span v-if="!pageData.length && filterText">No matching activities found</span>
      </div>
    </template>
  </AppAccordion>
</template>
