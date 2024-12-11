<script setup>
  import useSWRV from "swrv";
  import { ref, watchEffect } from "vue";
  import ContentContainer from "../components/layout/ContentContainer.vue";
  import { fetchOrganisations, getOrganisationsURL } from "../utils";
  import OrganisationsList from "../components/organisation/OrganisationsList.vue";

  const isFetching = ref(true);

  const { data: organisations, error } = useSWRV(getOrganisationsURL(), () => fetchOrganisations());

  watchEffect(() => {
    if (error && error.value) {
      isFetching.value = false;
      console.log(error.value); // TODO: properly handle error - show error on UI
    } else if (organisations && organisations.value) {
      isFetching.value = false;
    }
  });
</script>

<template>
  <ContentContainer>
    <h1>Public Data Viewer</h1>
    <p class="mb-4">
      Search for an organisation and access the validation results on their public IATI data. The organisation list and
      the public IATI data is regularly refreshed from the IATI Registry. New organisations and IATI files will not
      immediately be visible here, but after at most a day.
    </p>
    <OrganisationsList :is-fetching="isFetching" :organisations="organisations" />
  </ContentContainer>
</template>
