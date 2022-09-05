<script setup>
  import { computed } from 'vue';
  import { getDocumentReportCategories, getDocumentReportSeverities, getReportErrorsByIdentifier } from '../../utils';
  import SeverityItem from './SeverityItem.vue';
  import CategoryItem from './CategoryItem.vue';
  import FileErrors from './FileErrors.vue';

  const props = defineProps({ document: { type: Object, default: null }, report: { type: Object, default: null } });

  const categories = computed(() => getDocumentReportCategories(props.report));
  const severities = computed(() => getDocumentReportSeverities(props.report));
</script>

<template>
  <div class="-mx-3.5 flex flex-wrap">
    <div class="shrink-0 grow-0 basis-1/3">
      <div class="m-2.5">
        <h3 class="text-xl font-bold">Filters</h3>
        <div class="bg-slate-300">
          <div class="px-4 py-2">
            <h4 class="text-base font-bold">View by message type</h4>
            <div class="text-sm text-slate-700">Click to show or hide individual message types</div>
          </div>
          <SeverityItem v-for="severity in severities" :key="severity.id" :severity="severity" />
          <div class="px-4 pt-2">
            <h4 class="text-base font-bold">View by category</h4>
          </div>
          <div class="px-4 py-2">
            <CategoryItem v-for="category in categories" :key="category.id" :category="category" />
          </div>
        </div>
      </div>
    </div>
    <div class="shrink-0 grow-0 basis-2/3">
      <div class="m-2.5">
        <h3 class="text-xl font-bold">Feedback</h3>
        <FileErrors :errors="getReportErrorsByIdentifier(props.report)" />
      </div>
    </div>
  </div>
</template>