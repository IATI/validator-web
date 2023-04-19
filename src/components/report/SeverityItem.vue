<script setup>
  import { computed, ref, watch } from 'vue';
  import AppAccordion from '../AppAccordion.vue';
  import AppBadge from '../AppBadge.vue';
  import CheckBox from '../CheckBox.vue';

  const props = defineProps({ severity: { type: Object, default: null } });
  const emit = defineEmits(['select']);
  const label = computed(() => {
    if (props.severity) {
      const { name, types } = props.severity;
      return `${name}: ${types.length} ${types.length == 1 ? 'type' : 'types'}`;
    }

    return '';
  });
  const setErrorTypesVisibility = (visible) =>
    props.severity.types.map((_type) => {
      _type.show = visible;

      return _type;
    });
  const selectAll = ref(true);
  const errorTypes = ref(setErrorTypesVisibility(selectAll.value));
  const selectionMessage = computed(() => {
    const visibleErrorTypes = errorTypes.value.filter((type) => type.show);

    return visibleErrorTypes.length !== errorTypes.value.length
      ? `${visibleErrorTypes.length} of ${errorTypes.value.length} messages selected`
      : '';
  });
  const bgClass = {
    'bg-success': props.severity.id === 'success',
    'bg-warning': props.severity.id === 'warning',
    'bg-error': props.severity.id === 'error',
    'bg-critical': props.severity.id === 'critical',
  };

  watch(
    () => props.severity,
    () => {
      if (props.severity) {
        selectAll.value = props.severity.show;
        errorTypes.value = props.severity.types;
      }
    }
  );
  watch(selectAll, () => {
    errorTypes.value = setErrorTypesVisibility(selectAll.value);
    emit('select', { ...props.severity, types: errorTypes.value, show: selectAll.value });
  });

  const onToggleSeverity = () => {
    selectAll.value = !selectAll.value;
  };
  const onToggleType = (errorType) => {
    errorTypes.value = errorTypes.value.map((_type) => {
      _type.show = _type.id == errorType ? !_type.show : _type.show;

      return _type;
    });
    // update select all if all types are selected or all types are not selected
    const visibleErrorTypes = errorTypes.value.filter((type) => type.show);
    if (visibleErrorTypes.length) {
      if (visibleErrorTypes.length === errorTypes.value.length) {
        selectAll.value = true;

        return;
      }
    } else if (selectAll.value) {
      selectAll.value = false;

      return;
    }
    emit('select', { ...props.severity, types: errorTypes.value });
  };
</script>
<template>
  <AppAccordion class="iati-accordion">
    <template #title>
      <div :class="bgClass" class="inline-block w-full px-4 py-2 text-left text-white">
        <CheckBox
          :id="props.severity.name"
          :label="label"
          :name="props.severity.name"
          :checked="selectAll"
          class="inline"
          @checked="onToggleSeverity"
          @unchecked="onToggleSeverity"
        />
        <AppBadge v-if="selectionMessage" class="ml-4 bg-white font-normal" :class="`text-${props.severity.id}`">
          {{ selectionMessage }}
        </AppBadge>
      </div>
    </template>
    <template #content>
      <div class="border border-gray-200 bg-gray-100 px-4">
        <div class="py-2 text-sm text-slate-700">{{ props.severity.description }}</div>
        <CheckBox
          v-for="errorType in errorTypes"
          :id="errorType.id"
          :key="errorType.id"
          :label="`${errorType.text} (${errorType.count})`"
          :name="errorType.id"
          :checked="errorType.show"
          :label-class="'text-sm'"
          @checked="onToggleType(errorType.id)"
          @unchecked="onToggleType(errorType.id)"
        />
      </div>
    </template>
  </AppAccordion>
</template>
