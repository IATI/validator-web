<script setup>
  import { cloneDeep } from 'lodash';
  import useSWRV from 'swrv';
  import { computed, provide, ref, watch, watchEffect } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    fetchGuidanceLinks,
    getDocumentReportCategories,
    getDocumentReportSeverities,
    getGuidanceLinksURL,
  } from '../../utils';
  import SearchFilter from '../SearchFilter.vue';
  import StyledButton from '../StyledButton.vue';
  import ActivityErrors from './ActivityErrors.vue';
  import CategoryItem from './CategoryItem.vue';
  import FileErrors from './FileErrors.vue';
  import SeverityItem from './SeverityItem.vue';

  const props = defineProps({ document: { type: Object, default: null }, report: { type: Object, default: null } });
  const route = useRoute();
  const router = useRouter();

  const { data: guidanceLinks } = useSWRV(
    () => (props.report && props.report.iatiVersion ? getGuidanceLinksURL(props.report.iatiVersion) : null),
    () => fetchGuidanceLinks(props.report.iatiVersion)
  );
  provide('guidanceLinks', guidanceLinks);
  const activeSeverity = ref(null);
  const activeCategory = ref(null);
  const categories = computed(() => {
    const _categories =
      !categories.value || !activeCategory.value ? getDocumentReportCategories(props.report) : categories.value;
    return _categories.map((category) => {
      if (activeCategory.value && category.id === activeCategory.value.id) {
        category.show = activeCategory.value.show;
      }

      return category;
    });
  });
  const severities = computed(() => {
    const _severities =
      !severities.value || !activeSeverity.value ? getDocumentReportSeverities(props.report) : severities.value;

    return _severities.map((severity) => {
      if (activeSeverity.value && severity.id === activeSeverity.value.id) {
        severity = activeSeverity.value;
      } else if (!activeSeverity.value) {
        severity.show = true;
        severity.types = severity.types.map((type) => {
          type.show = true;

          return type;
        });
      }

      return severity;
    });
  });
  const hasMessages = computed(() => {
    if (!props.report) return false;

    const { summary } = props.report;
    return Object.keys(summary).some((item) => summary[item] > 0);
  });
  const filteredReport = ref(props.report);
  const fileType = ref(null);
  const fileErrorsTitle = ref('');
  const activityErrorsTitle = ref('');
  const searchText = ref(route.query.id);

  provide('fileType', fileType);
  provide('report', filteredReport);

  watch(
    () => route.query.id,
    () => (searchText.value = route.query.id)
  );
  watchEffect(() => {
    if (props.report) {
      if (props.report.fileType === 'iati-activities') {
        fileType.value = 'activity';
        fileErrorsTitle.value = 'Activity file feedback';
        activityErrorsTitle.value = 'Feedback per activity';
      }
      if (props.report.fileType === 'iati-organisations') {
        fileType.value = 'organisation';
        fileErrorsTitle.value = 'Organisation file feedback';
        activityErrorsTitle.value = 'Organisation feedback';
      }

      if (!props.report.fileType === 'iati-activities' && !props.report.fileType === 'iati-organisations') {
        fileType.value = null;
        fileErrorsTitle.value = 'Not an IATI file';
        activityErrorsTitle.value = '';
      }
    } else {
      fileType.value = null;
      fileErrorsTitle.value = 'Not an IATI file';
      activityErrorsTitle.value = '';
    }
  });

  // watch and filter report by category and severity
  watch([categories, severities], () => {
    const report = cloneDeep(props.report);
    report.errors.forEach((activity) => {
      // filter report by category
      activity.errors = activity.errors.filter((feedback) =>
        categories.value.some((c) => c.show === true && c.id === feedback.category)
      );
      // filter report by severity
      activity.errors.forEach((item) => {
        item.errors = item.errors.filter(
          (feedback) =>
            severities.value.some((sev) => sev.slug === feedback.severity) && // filter by severity
            severities.value.some((t) => t.types.some((m) => m.show === true && m.id === feedback.id)) // filter by severity message type
        );
      });
    });
    filteredReport.value = report;
  });

  const onFilterBySeverity = (severity) => {
    activeSeverity.value = severity;
  };
  const onFilterByCategory = (category) => {
    activeCategory.value = category;
  };
  const onFilter = (item) => {
    searchText.value = item;
  };
  const onClearFilters = () => {
    activeCategory.value = null;
    activeSeverity.value = null;
    if (searchText.value) {
      searchText.value = null;
      router.push(route.path);
    }
  };

  const hasHiddenCategories = (categories) => categories && categories.some((category) => !category.show);
  const hasHiddenSeverities = (severities) => {
    if (severities) {
      return severities.some((severity) => severity.types.some((type) => !type.show));
    }

    return true;
  };

  const hasActiveFilter = () =>
    hasHiddenCategories(categories.value) || hasHiddenSeverities(severities.value) || !!searchText.value;
</script>

<template>
  <div class="-mx-3.5 flex flex-wrap">
    <div v-if="hasMessages" class="relative flex shrink grow flex-col sm:w-full md:basis-1/3">
      <div class="sticky top-0 m-2.5">
        <h3 class="text-xl font-bold">Search and filter</h3>
        <div class="bg-slate-300">
          <div class="px-4 py-2">
            <SearchFilter
              placeholder="Search activity title and identifier..."
              :search-text="searchText"
              class="mb-4 mt-2 !w-full"
              input-classes="!py-2 border-iati-blue text-base w-full"
              :show-button="false"
              @on-search="onFilter"
            />
            <h4 class="text-base font-bold">View by message type</h4>
            <div class="text-sm text-slate-700">Click to show or hide individual message types</div>
          </div>
          <SeverityItem
            v-for="severity in severities"
            :key="severity.id"
            :severity="severity"
            @select="onFilterBySeverity"
          />
          <div class="px-4 pt-2">
            <h4 class="text-base font-bold">View by category</h4>
          </div>
          <div class="px-4 py-2">
            <CategoryItem
              v-for="category in categories"
              :key="category.id"
              :category="category"
              @select="onFilterByCategory"
            />
          </div>
          <div v-if="hasActiveFilter()" class="px-4 pt-2 pb-4">
            <StyledButton class="w-full" @click="onClearFilters">Clear Filters</StyledButton>
          </div>
        </div>
      </div>
    </div>
    <div class="flex shrink grow flex-col" :class="hasMessages ? 'sm:w-full  md:basis-2/3' : 'w-full'">
      <div class="m-2.5">
        <h3 class="text-xl font-bold">Feedback</h3>
        <FileErrors
          v-if="props.report"
          :file-type="fileType"
          :title="fileErrorsTitle"
          :guidance-links="guidanceLinks"
        />
        <ActivityErrors
          v-if="filteredReport"
          :title="activityErrorsTitle"
          :file-type="fileType"
          :filter-text="searchText"
        />
      </div>
    </div>
  </div>
</template>

<style>
  .iati-accordion > button > svg {
    color: #ffffff;
  }
</style>
