<script setup>
  import { computed } from 'vue';
  import { formatDate } from '../../utils';
  import { getDocumentDatastoreAvailability, getDocumentValidationStatus } from '../../utils/document';
  const props = defineProps({ document: { type: Object, default: null }, report: { type: Object, default: null } });

  const validationStatus = computed(() => getDocumentValidationStatus({ ...props.document, report: props.report }));
  const validationStatusClass = computed(() => {
    const status = validationStatus.value.value;
    const commonClasses = 'font-bold text-2xl pt-2';
    return status !== 'normal' ? `text-${status} ${commonClasses}` : commonClasses;
  });
</script>

<template>
  <div>
    <span>IATI version: {{ props.report.iatiVersion }} | </span>
    <span>Type: {{ props.report.fileType }} | </span>
    <span>Report Generated: {{ formatDate(props.document.validation_created) }} | </span>
    <span>
      Available in Datastore: {{ getDocumentDatastoreAvailability({ ...props.document, report: props.report }) }}
    </span>
  </div>
  <div :class="validationStatusClass">{{ validationStatus.caption }}</div>
</template>
