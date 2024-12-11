<script setup>
  import { ref, watch } from "vue";
  import AppAlert from "./AppAlert.vue";

  const props = defineProps({
    disabled: { type: Boolean, default: false },
    accept: { type: String, default: "*" },
    multiple: { type: Boolean, default: false },
  });
  const emit = defineEmits(["change"]);
  const files = ref([]);
  const errors = ref([]);
  const MAX_FILE_SIZE = 60000000; // in bytes

  const onChange = (event) => {
    errors.value = [];
    // validate file size
    Array.from(event.target.files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors.value.push(`${file.name}: file exceeds max size of 60MB`);
      }
    });
    if (!errors.value.length) {
      files.value = event.target.files;
    }
  };

  watch(files, () => {
    emit("change", files.value);
  });
</script>
<template>
  <div v-if="!files.length" class="inline-block">
    <label class="iati-button" for="file-upload">
      <slot />
    </label>
    <input
      id="file-upload"
      type="file"
      :accept="props.accept"
      :disabled="props.disabled"
      :multiple="props.multiple"
      class="hidden"
      @change="onChange"
    />
    <AppAlert v-if="errors.length" variant="warning" class="mt-4">
      <p
        v-for="error in errors"
        :key="error"
        class="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {{ error }}
      </p>
    </AppAlert>
  </div>
  <div v-else class="text-center">
    <p
      v-for="file in files"
      :key="file.name"
      class="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ file.name }}
    </p>
    <button class="iati-button" @click="files = []">Clear</button>
  </div>
</template>
