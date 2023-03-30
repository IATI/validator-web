<script setup>
  import { computed } from 'vue';
  import { getDocumentValidationStatus, constructCSV } from '../../utils/document';
  const props = defineProps({ document: { type: Object, default: null }, report: { type: Object, default: null } });

  const validationStatus = computed(() => getDocumentValidationStatus({ ...props.document, report: props.report }));
  const validationStatusClass = computed(() => {
    const status = validationStatus.value.value;
    const commonClasses = 'font-bold text-2xl pt-2';
    return status !== 'normal' ? `text-${status} ${commonClasses}` : commonClasses;
  });
  const downloadCSV = () => {
    const text = encodeURIComponent(
      constructCSV([
        {
          registry_name: props.document.name,
          document_url: props.document.url,
          valid: props.document.valid,
          report: props.report,
        },
      ])
    );
    const filename = `${props.document.name}.csv`;
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=utf-8,${text}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
</script>

<template>
  <div>
    <span>IATI version: {{ props.report.iatiVersion }}</span>
    <span> | Type: {{ props.report.fileType }}</span>
    <span> | <button class="underline" @click="downloadCSV()">Download CSV</button></span>
  </div>
  <div :class="validationStatusClass">{{ validationStatus.caption }}</div>
</template>
