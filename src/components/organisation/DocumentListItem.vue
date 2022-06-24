<script setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    getDocumentDatastoreAvailability,
    getDocumentDownloadStatus,
    getDocumentFileName,
    getDocumentValidationStatus,
    hasProperLink,
  } from '../../utils/document';
  import { formatDate } from '../../utils';

  const props = defineProps({ document: { type: Object, default: () => {} } });
  const router = useRouter();

  const fileName = computed(() => getDocumentFileName(props.document) || 'No filename available');
  const validationDate = computed(() => formatDate(props.document.validation_created));
  const validationStatus = computed(() => getDocumentValidationStatus(props.document));
  const validationStatusClass = computed(() => {
    const status = validationStatus.value.value;
    return status !== 'normal' ? `text-${status} font-bold` : 'font-bold';
  });
  const datastoreAvailability = computed(() => getDocumentDatastoreAvailability(props.document));

  const onClick = () => {
    if (props.document.validation && props.document.hash) {
      router.push(`/report/${props.document.id}`); // TODO: change to more friendly URL
    }
  };

  const textClasses =
    'overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal text-tiny';
</script>

<template>
  <div
    class="flex cursor-pointer flex-col gap-0 border-t border-solid border-gray-300 odd:bg-white even:bg-slate-100 hover:bg-gray-200 sm:grid sm:grid-cols-5 sm:border-0"
    @click="onClick"
  >
    <div class="py-2 pb-2 first:pl-3.5" :class="textClasses">
      <p class="text-base font-bold sm:hidden">File Name</p>
      <a v-if="hasProperLink(props.document)" :url="props.document.url" class="hover:underline">{{ fileName }}</a>
      <span v-else>{{ fileName }}</span>
    </div>
    <div class="pl-3.5 pt-0 pb-2 sm:py-2" :class="textClasses">
      <p class="text-base font-bold sm:hidden">Identified in Registry</p>
      <span>{{ formatDate(props.document.modified || props.document.first_seen) }}</span>
    </div>
    <div class="pt-0 pb-2 pl-3.5 sm:py-2" :class="textClasses">
      <p class="text-base font-bold sm:hidden">Validated</p>
      <span v-if="validationDate">{{ validationDate }}</span>
      <span v-else>{{ getDocumentDownloadStatus(props.document) }}</span>
    </div>
    <div class="pt-0 pb-2 pl-3.5 sm:py-2" :class="textClasses">
      <span class="pr-2 text-base font-bold sm:hidden">Validation Status:</span>
      <span :class="validationStatusClass" class="text-base">{{ validationStatus.caption }}</span>
    </div>
    <div class="pt-0 pb-2 pl-3.5 sm:py-2" :class="textClasses">
      <p class="text-base font-bold sm:hidden">Availability in Datastore</p>
      {{ datastoreAvailability }}
    </div>
  </div>
</template>
