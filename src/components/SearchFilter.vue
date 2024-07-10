<script setup>
  import { ref, watch } from "vue";
  import { debounce } from "../utils";

  const props = defineProps({
    buttonCaption: { type: String, default: "Search" },
    placeholder: { type: String, default: "" },
    searchText: { type: String, default: "" },
    showButton: { type: Boolean, default: true },
    inputClasses: { type: String, default: "" },
  });
  const emit = defineEmits(["onSearch"]);
  const search = ref(props.searchText);

  watch(
    () => props.searchText,
    () => {
      if (search.value !== props.searchText) {
        search.value = props.searchText;
      }
    },
  );

  watch(search, () => {
    debounce(() => emit("onSearch", search.value.trim()), 250)();
  });
  const onSearch = () => emit("onSearch", search.value.trim());
</script>

<template>
  <div class="flex w-full flex-row flex-wrap justify-around sm:w-[500px]">
    <input
      id="search"
      v-model="search"
      class="m-0 w-full border px-4 py-3 text-lg focus-visible:outline-none sm:w-[350px]"
      :class="props.inputClasses"
      :placeholder="props.placeholder"
      autofocus
    />
    <button
      v-if="props.showButton"
      class="relative mt-4 inline w-full border-0 bg-iati-blue p-3 text-base uppercase sm:mt-0 sm:w-[150px]"
      @click="onSearch"
    >
      {{ props.buttonCaption }}
    </button>
    <label id="search" for="search" class="invisible">Search</label>
  </div>
</template>
