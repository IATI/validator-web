<script setup>
  import useSWRV from 'swrv';
  import { ref, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { setPageTitle } from '../state';
  import {
    getDocumentFileName,
    getDocumentURL,
    fetchDocumentByID,
    getOrganisationURL,
    fetchOrganisationByID,
  } from '../utils';
  import ContentContainer from '../components/layout/ContentContainer.vue';
  import StyledLink from '../components/StyledLink.vue';
  import BasicCard from '../components/BasicCard.vue';
  import FileStatusInfo from '../components/FileStatusInfo.vue';

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

  watchEffect(() => {
    if (documentError && documentError.value) {
      loading.value = false;
      console.log('Document Error: ', documentError.value);
    } else if (organisationError && organisationError.value) {
      loading.value = false;
      console.log('Organisation Error: ', organisationError.value);
    } else if (document && document.value && organisation && organisation.value) {
      loading.value = false;
    }
  });
</script>

<template>
  <ContentContainer class="pt-0 pb-8">
    <h3 v-if="document && organisation">
      <StyledLink :to="`/organisation/${organisation.name}`">{{ organisation.title }}</StyledLink> -
      <StyledLink :to="document.url" :external="true">{{ getDocumentFileName(document) }}</StyledLink>
    </h3>

    <div class="-mx-3.5 flex flex-wrap">
      <BasicCard>
        <FileStatusInfo />
      </BasicCard>
    </div>
  </ContentContainer>
</template>
