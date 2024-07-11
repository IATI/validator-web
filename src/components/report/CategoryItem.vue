<script setup>
  import { ref, watch } from "vue";
  import CheckBox from "../CheckBox.vue";

  const props = defineProps({ category: { type: Object, default: null } });
  const emit = defineEmits(["select"]);
  const checked = ref(true);

  watch(
    () => props.category,
    () => {
      checked.value = props.category ? props.category.show : checked.value;
    },
  );

  const onToggleCategory = () => {
    checked.value = !checked.value;
    emit("select", { ...props.category, show: checked.value });
  };
</script>
<template>
  <div>
    <CheckBox
      :id="props.category.id"
      :label="`${props.category.name} (${props.category.count})`"
      :name="props.category.name"
      :checked="checked"
      @checked="onToggleCategory"
      @unchecked="onToggleCategory"
    />
  </div>
</template>
