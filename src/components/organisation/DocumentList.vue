<script setup>
  import { getSortDirection, getSortValue, sortDocuments, sortOptions } from "../../utils";
  import DocumentListItem from "./DocumentListItem.vue";

  const headerClassNames = "hidden border-0 border-y border-solid border-gray-300 p-2.5 font-bold sm:block";
  const props = defineProps({
    documents: { type: Object, default: () => {} },
    sortvariable: { type: String, default: "" },
  });
</script>

<template>
  <div class="grid grid-cols-1">
    <div class="sticky top-0 grid grid-cols-5 gap-0 bg-white">
      <div class="first:pl-3.5" :class="headerClassNames">File Name</div>
      <div :class="headerClassNames">Identified in Registry</div>
      <div :class="headerClassNames">Validated</div>
      <div :class="headerClassNames">Validation Status</div>
      <div :class="headerClassNames">Available in IATI Datastore</div>
    </div>
    <DocumentListItem
      v-for="document in sortDocuments(
        props.documents,
        getSortValue(props.sortvariable, sortOptions(props.documents)),
        getSortDirection(props.sortvariable, sortOptions(props.documents)),
      )"
      :key="document.id"
      class="doc-list-item"
      :document="document"
    />
  </div>
</template>
