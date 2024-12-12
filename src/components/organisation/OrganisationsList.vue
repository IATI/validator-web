<script setup>
  import { computed, ref } from "vue";
  import CaptionedLoadingSpinner from "../CaptionedLoadingSpinner.vue";
  import OrganisationSearchFilter from "./OrganisationSearchFilter.vue";
  import OrganisationAlphabetNavigator from "./OrganisationAlphabetNavigator.vue";

  const props = defineProps({
    isFetching: { type: Boolean, default: false },
    organisations: { type: Array, default: () => [] },
  });

  const organisations = ref(props.organisations || []);
  const anchors = computed(() =>
    organisations.value.reduce((items, curr) => {
      const firstChar = curr.title.split("")[0].toLowerCase();
      return isNaN(Number(firstChar)) && !items.map((item) => item.anchor).includes(firstChar)
        ? items.concat({ anchor: firstChar, name: curr.name })
        : items;
    }, []),
  );

  const getAnchor = (id) => anchors.value.find((item) => item.name === id);
  const isAnchored = (id) => !!getAnchor(id);

  const onFilter = (results) => (organisations.value = results);
</script>

<template>
  <div v-if="props.isFetching" class="mb-4 flex h-full flex-col">
    <CaptionedLoadingSpinner>Loading Organisations...</CaptionedLoadingSpinner>
  </div>
  <div v-else class="mb-4">
    <OrganisationSearchFilter :organisations="props.organisations" @on-search="onFilter" @on-init.once="onFilter" />
    <OrganisationAlphabetNavigator />
    <div id="org-count" class="py-4 sm:pt-0">
      Found <b>{{ organisations.length }}</b> organisations.
    </div>
    <hr class="mb-2" />
    <span :id="123"></span>
    <div v-for="organisation in organisations" :key="organisation.name" class="p-2">
      <span v-if="isAnchored(organisation.name)" :id="getAnchor(organisation.name).anchor"></span>
      <RouterLink :to="`/organisation/${organisation.name}`">{{ organisation.title }}</RouterLink>
    </div>
  </div>
</template>
