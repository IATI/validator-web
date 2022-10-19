<script setup>
  import { computed, inject, ref } from 'vue';
  import { getFileErrorsMessageTypeCount } from '../../utils';
  import AppAccordion from '../AppAccordion.vue';
  import AppBadge from '../AppBadge.vue';
  import StyledLink from '../StyledLink.vue';
  import FeedbackList from './FeedbackList.vue';
  import StyledIcon from '../StyledIcon.vue';

  const props = defineProps({ activity: { type: Object, default: null } });
  const organisation = inject('organisation');
  const fileType = inject('fileType');
  const messages = computed(() => props.activity.errors.filter((message) => message.errors.length));
  const messageTypes = computed(() =>
    ['critical', 'error', 'warning', 'info', 'success']
      .map((messageType) => ({
        type: messageType,
        count: getFileErrorsMessageTypeCount(props.activity.errors, messageType),
      }))
      .filter((messageType) => messageType.count > 0)
  );

  let copy = ref(false);
  const copyActivityLink = () => {
    copy.value = true;
    setTimeout(() => {
      copy.value = false;
    }, 3000);
  };

  const cleanIdentifier = (identifier) => {
    const newLineIndex = identifier.indexOf('\n');
    return newLineIndex !== -1 ? identifier.substring(0, newLineIndex) : identifier;
  };
  const getDPortalLink = (activity) => {
    const identifier = cleanIdentifier(activity);
    if (fileType.value === 'organisation') {
      return `http://d-portal.org/ctrack.html?publisher=${encodeURIComponent(identifier)}`;
    } else if (organisation.value && organisation.value.iati_id) {
      return `http://d-portal.org/ctrack.html?publisher=${encodeURIComponent(
        organisation.value.iati_id
      )}#view=act&aid=${encodeURIComponent(identifier)}`;
    }
    return '';
  };
</script>
<template>
  <AppAccordion :open="false" class="mb-4">
    <template #title>
      <div class="w-full bg-slate-100 px-4 py-2 text-left">
        <div class="group font-medium">
          {{ props.activity.title || 'Untitled Activity' }}
          <span
            id="copyIcon"
            class="invisible group-hover:visible"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Tooltip on top"
          >
            <StyledIcon :icon="copy ? 'fa-solid fa-check' : 'fa-regular fa-copy'" @click="copyActivityLink" />
          </span>
        </div>
        <div class="text-sm">
          <StyledLink
            :to="getDPortalLink(props.activity.identifier)"
            :external="true"
            :title="`Open this ${fileType} in d-portal`"
            class="mr-2"
          >
            {{ cleanIdentifier(props.activity.identifier) }}
          </StyledLink>
          <AppBadge
            v-for="messageType in messageTypes"
            :key="messageType.type"
            :variant="messageType.type"
            class="relative top-[-2px]"
          >
            {{ messageType.count }}
          </AppBadge>
        </div>
      </div>
    </template>
    <template #content>
      <div class="border border-gray-100 px-4 py-2">
        <FeedbackList v-for="(message, index) in messages" :key="index" :message="message" class="pb-2" />
        <span v-if="!messages.length">There is no feedback to display</span>
      </div>
    </template>
  </AppAccordion>
</template>
