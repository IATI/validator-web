<script setup>
  import { formatDate } from '../../utils';
  import { getDocumentDatastoreAvailability } from '../../utils/document';
  const props = defineProps({ document: { type: Object, default: null }, report: { type: Object, default: null } });
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
</template>
