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
  <ContentContainer class="pt-6 pb-8">
    <h3 v-if="document && organisation">
      <StyledLink :to="`/organisation/${organisation.name}`">{{ organisation.title }}</StyledLink> -
      <StyledLink :to="document.url">{{ getDocumentFileName(document) }}</StyledLink>
    </h3>
  </ContentContainer>
</template>
