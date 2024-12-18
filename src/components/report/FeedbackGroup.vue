<script setup>
  import copy from "copy-to-clipboard";
  import { computed, inject, ref } from "vue";
  import { useRoute } from "vue-router";
  import { getFileErrorsMessageTypeCount } from "../../utils";
  import AppAccordion from "../AppAccordion.vue";
  import AppBadge from "../AppBadge.vue";
  import AppIcon from "../AppIcon.vue";
  import FeedbackList from "./FeedbackList.vue";

  const props = defineProps({ activity: { type: Object, default: null } });
  const organisation = inject("organisation");
  const fileType = inject("fileType");
  const messages = computed(() => props.activity.errors.filter((message) => message.errors.length));
  const messageTypes = computed(() =>
    ["critical", "error", "warning", "advisory", "info", "success"]
      .map((messageType) => ({
        type: messageType,
        count: getFileErrorsMessageTypeCount(props.activity.errors, messageType),
      }))
      .filter((messageType) => messageType.count > 0),
  );

  const show = ref(false);
  const route = useRoute();

  const cleanIdentifier = (identifier) => {
    const newLineIndex = identifier.indexOf("\n");
    return newLineIndex !== -1 ? identifier.substring(0, newLineIndex) : identifier;
  };
  const getDPortalLink = (activity) => {
    const identifier = cleanIdentifier(activity);
    if (fileType.value === "organisation") {
      return `http://d-portal.org/ctrack.html?publisher=${encodeURIComponent(identifier)}`;
    } else if (organisation.value && organisation.value.iati_id) {
      return `http://d-portal.org/ctrack.html?publisher=${encodeURIComponent(
        organisation.value.iati_id,
      )}#view=act&aid=${encodeURIComponent(identifier)}`;
    }
    return "";
  };

  const copyActivityLink = (activity) => {
    const id = cleanIdentifier(activity);
    copy(`${location.origin}${route.path}?id=${window.encodeURIComponent(id)}`, {
      format: "text/plain",
    });
    show.value = true;
    setTimeout(() => {
      show.value = false;
    }, 2000);
  };
</script>
<template>
  <AppAccordion :open="false" class="mb-4" :header-classes="'bg-slate-100 px-4 py-2'">
    <template #title>
      <div class="w-full text-left">
        <div class="font-medium">
          {{ props.activity.title || "Untitled Activity" }}
          <span v-if="show" class="text-[12px]">Link copied</span>
          <AppIcon v-else icon="link-icon" class="ml-2" @click.stop="copyActivityLink(props.activity.identifier)" />
        </div>
        <div class="text-sm">
          <a
            :href="getDPortalLink(props.activity.identifier)"
            :title="`Open this ${fileType} in d-portal`"
            class="mr-2"
          >
            {{ cleanIdentifier(props.activity.identifier) }}
          </a>
          <AppBadge
            v-for="messageType in messageTypes"
            :key="messageType.type"
            :variant="messageType.type"
            class="relative top-[-2px] text-white"
          >
            {{ messageType.count }}
          </AppBadge>
        </div>
      </div>
    </template>
    <template #content>
      <div class="border border-solid border-gray-100 px-4 py-2">
        <FeedbackList v-for="(message, index) in messages" :key="index" :message="message" class="pb-2" />
        <span v-if="!messages.length">There is no feedback to display</span>
      </div>
    </template>
  </AppAccordion>
</template>
