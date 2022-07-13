<script setup>
  import CheckBox from '../CheckBox.vue';

  const props = defineProps({ category: { type: Object, default: null } });

  const onFilter = (category, checked = false) => {
    console.log(checked ? 'Checked:' : 'Unchecked:', category);
  };
</script>
<template>
  <div>
    <CheckBox
      :id="props.category.id"
      :label="`${props.category.count} x ${props.category.name}`"
      :name="props.category.name"
      :checked="true"
      @checked="onFilter(props.category.name, true)"
      @unchecked="onFilter(props.category.name)"
    />
  </div>
</template>
