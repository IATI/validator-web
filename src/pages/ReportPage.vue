<script setup>
  import useSWRV from 'swrv';
  import { ref, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { setPageTitle } from '../state';
  import { getDocumentURL, fetchDocumentByID } from '../utils';

  const layout = setPageTitle('Loading...');
  const route = useRoute();
  const loading = ref(true);

  const { data: document, error: documentError } = useSWRV(getDocumentURL(route.params.id), () =>
    fetchDocumentByID(route.params.id)
  );

  watchEffect(() => {
    if (documentError && documentError.value) {
      loading.value = false;
      console.log(documentError.value);
    } else if (document && document.value) {
      console.log(document.value);
      layout.title = document.value.url;
    }
  });
</script>

<template>
  <ContentContainer class="pt-6 pb-8"> Report Goes Here </ContentContainer>
</template>
