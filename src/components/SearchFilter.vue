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
  const emit = defineEmits(["onSearch", "onLoseFocus"]);
  const search = ref(props.searchText);

  const onLoseFocus = () => {
    emit("onLoseFocus");
  };

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
  <div class="iati-search-bar">
    <input
      id="search"
      v-model="search"
      :class="props.inputClasses"
      class="flex-1 p-4 border border-solid border-slate-200"
      :placeholder="props.placeholder"
      autofocus
      @blur="onLoseFocus"
    />
    <!-- TODO: Button -->
    <button
      v-if="props.showButton"
      class="relative mt-4 inline w-full border-0 bg-iati-blue p-3 text-base uppercase sm:mt-0 sm:w-[150px]"
      @click="onSearch"
    >
      {{ props.buttonCaption }}
    </button>
    <label id="search" for="search" class="hidden">Search</label>
  </div>
</template>
