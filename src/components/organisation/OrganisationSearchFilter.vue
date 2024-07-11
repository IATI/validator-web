<script setup>
  import { computed, ref, watch, onMounted } from "vue";
  import SearchFilter from "../SearchFilter.vue";

  const props = defineProps({ organisations: { type: Array, default: () => [] } });
  const emit = defineEmits(["onInit", "onSearch"]);

  const searchText = ref(null);
  const organisations = computed(() =>
    searchText.value && props.organisations
      ? props.organisations.filter((org) => new RegExp(searchText.value, "gi").test(org.title))
      : props.organisations || [],
  );

  onMounted(() => emit("onInit", organisations.value));
  watch(organisations, () => emit("onSearch", organisations.value));
  const onSearch = (text) => (searchText.value = text);
</script>

<template>
  <SearchFilter placeholder="Organisation name" @on-search="onSearch" />
</template>
