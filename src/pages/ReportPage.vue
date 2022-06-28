<script setup>
  import useSWRV from 'swrv';
  import { ref, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { setPageTitle } from '../state';
  import {
    getDocumentFileName,
    getDocumentURL,
    fetchDocumentByID,
    fetchValidationReport,
    getOrganisationURL,
    fetchOrganisationByID,
    validationReportURL,
  } from '../utils';
  import ContentContainer from '../components/layout/ContentContainer.vue';
  import StyledLink from '../components/StyledLink.vue';
  import BasicCard from '../components/BasicCard.vue';
  import FileStatusInfo from '../components/FileStatusInfo.vue';
  import CaptionedLoadingSpinner from '../components/CaptionedLoadingSpinner.vue';
  import DocumentInfo from '../components/report/DocumentInfo.vue';
  import DocumentReport from '../components/report/DocumentReport.vue';

  setPageTitle('File validation report');
  const route = useRoute();
  const loading = ref(true);

  const { data: document, error: documentError } = useSWRV(getDocumentURL(route.params.id), () =>
    fetchDocumentByID(route.params.id)
  );
  const { data: organisation, error: organisationError } = useSWRV(
    () => (document && document.value ? getOrganisationURL(document.value.publisher, 'id') : null),
    () => fetchOrganisationByID(document.value.publisher)
  );
  const { data: dataset, error: datasetError } = useSWRV(
    () => validationReportURL(route.params.id, 'id'),
    () => fetchValidationReport(route.params.id)
  );

  watchEffect(() => {
    if (documentError.value) {
      loading.value = false;
      console.log('Document Error: ', documentError.value);
    } else if (organisationError.value) {
      loading.value = false;
      console.log('Organisation Error: ', organisationError.value);
    } else if (document.value && organisation.value) {
      loading.value = false;
    }
    if (datasetError.value) {
      console.log('Data Set Error: ', datasetError.value);
    }
  });
</script>

<template>
  <ContentContainer class="pt-0 pb-8">
    <CaptionedLoadingSpinner v-if="!organisation || !document" class="pb-3">
      Loading Document Info ...
    </CaptionedLoadingSpinner>
    <div v-else>
      <h3 class="text-lg">
        <StyledLink :to="`/organisation/${organisation.name}`" class="underline">{{ organisation.title }}</StyledLink> -
        <StyledLink :to="document.url" :external="true" class="underline">
          {{ getDocumentFileName(document) }}
        </StyledLink>
      </h3>
      <CaptionedLoadingSpinner v-if="!dataset" class="py-3"> Loading Report ... </CaptionedLoadingSpinner>
      <DocumentInfo v-else :document="document" :report="dataset.report" />
    </div>

    <div class="-mx-3.5 flex flex-wrap">
      <BasicCard>
        <FileStatusInfo />
      </BasicCard>
    </div>

    <CaptionedLoadingSpinner v-if="!dataset" class="py-3"> Loading Report ... </CaptionedLoadingSpinner>
    <DocumentReport v-else :document="document" :report="dataset.report" />
  </ContentContainer>
</template>
