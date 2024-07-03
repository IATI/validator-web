<script setup>
  import VueMultiselect from "vue-multiselect";
</script>
<template>
  <VueMultiselect />
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
  .multiselect__option--highlight,
  .multiselect__option--highlight:after {
    background: #155366;
  }
  .multiselect__option--selected.multiselect__option--highlight {
    background: #81c3d6;
  }
  .multiselect__option--selected.multiselect__option--highlight:after {
    background: #81c3d6;
  }
  .multiselect__option--group-selected.multiselect__option--highlight {
    background: #81c3d6;
  }
</style>
