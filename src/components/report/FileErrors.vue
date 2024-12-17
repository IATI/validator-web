<script setup>
  import { computed, inject } from "vue";
  import { getFileErrorsMessageTypeCount, getReportErrorsByIdentifier } from "../../utils";
  import AppAccordion from "../AppAccordion.vue";
  import AppAlert from "../AppAlert.vue";
  import AppBadge from "../AppBadge.vue";
  import FeedbackList from "./FeedbackList.vue";

  const props = defineProps({
    title: { type: String, default: "" },
    fileType: { type: String, default: "activity" }, // options are activity and organisation
  });
  const report = inject("report");
  const messages = computed(() => getReportErrorsByIdentifier(report.value).filter((item) => item.errors.length)); // only include items with feedback to show

  const messageTypes = ["critical", "error", "warning", "advisory", "info", "success"]
    .map((messageType) => ({ type: messageType, count: getFileErrorsMessageTypeCount(messages.value, messageType) }))
    .filter((messageType) => messageType.count > 0);
</script>

<template>
  <AppAccordion
    v-if="(report && report.summary.critical === 0) || messages.length"
    :open="true"
    class="iati-accordion mb-4"
  >
    <template #title>
      <div class="flex w-full items-center bg-iati-green px-4 py-2 text-left text-white">
        <span class="mr-2">{{ props.title }}</span>
        <AppBadge v-for="messageType in messageTypes" :key="messageType.type" :variant="messageType.type">
          {{ messageType.count }}
        </AppBadge>
      </div>
    </template>
    <template #content>
      <div class="border border-solid border-gray-200 p-4">
        <AppAlert v-if="!messages.length" variant="success">
          <span>
            Congratulations! This IATI {{ props.fileType }} file has successfully passed IATI XML schema validation!
          </span>
        </AppAlert>
        <FeedbackList v-for="(message, index) in messages" v-else :key="index" :message="message" />
      </div>
    </template>
  </AppAccordion>
</template>
