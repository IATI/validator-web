<script setup>
  import { forkJoin } from "rxjs";
  import { ref } from "vue";
  import CardiB from "../components/CardiB.vue";
  import { uploadFile } from "../utils";
  import AppAlert from "./AppAlert.vue";
  import FileInputButton from "./FileInputButton.vue";
  import LoadingSpinner from "./LoadingSpinner.vue";

  const props = defineProps({ workspaceID: { type: String, default: "" } });
  const activeStep = ref(1);
  const files = ref([]);
  const requestStatus = ref(""); // 'pending' | 'draft' | 'success' | 'error' = 'draft'
  const uploadErrorMessage = ref("");

  const onAddFiles = (_files) => {
    files.value = _files;
    requestStatus.value = "draft";
    activeStep.value = files.value.length ? 2 : 1;
  };

  const parallelUpload = (files) => forkJoin(files.map((file) => uploadFile(file, props.workspaceID)));

  const uploadFiles = () => {
    const handleError = (error) => {
      if (typeof error === "object" && typeof error.message === "string") {
        try {
          const errorResponse = JSON.parse(error.message);
          uploadErrorMessage.value = errorResponse.message;
        } catch (err) {
          console.error(err);
        }
      }
      requestStatus.value = "error";
    };

    if (files.value.length) {
      requestStatus.value = "pending";

      parallelUpload(Array.from(files.value)).subscribe({
        next: () => {
          activeStep.value = 3;
          requestStatus.value = "success";
        },
        error: handleError,
      });
    }
  };
</script>
<template>
  <div class="-m-2.5 flex flex-wrap pt-4">
    <CardiB heading="Step 1" class="w-[300px]" :class="{ 'border-t-iati-blue': activeStep !== 1 }">
      <p class="mb-4 text-center">Select your IATI files. You can select multiple files at the same time.</p>
      <FileInputButton class="self-center mt-auto" accept=".xml" :multiple="true" @change="onAddFiles">
        Browse
      </FileInputButton>
    </CardiB>
    <CardiB
      heading="Step 2"
      class="w-[300px]"
      :class="{ 'pointer-events-none opacity-50': activeStep === 1, 'border-t-iati-blue': activeStep !== 2 }"
    >
      <p class="mb-4 text-center">Upload your IATI files and start validation.</p>
      <div v-if="requestStatus && requestStatus !== 'draft'" class="mb-3 text-sm">
        <AppAlert v-if="requestStatus === 'error'" variant="error">
          <template v-if="uploadErrorMessage === ''">
            File(s) uploading failed. Check your files and try again.
          </template>
          <template v-else>
            {{ uploadErrorMessage }}
          </template>
        </AppAlert>
        <AppAlert v-else-if="requestStatus === 'success'" variant="success">
          File(s) have been uploaded successfully
        </AppAlert>
        <AppAlert v-else variant="default">
          <div class="flex flex-col items-center">
            <LoadingSpinner class="w-8" />
          </div>
          <div class="text-center">
            Your files are uploading now. Large files could be uploading for more than few minutes.
          </div>
        </AppAlert>
      </div>
      <button class="iati-button self-center mt-auto" :disabled="requestStatus !== 'draft'" @click="uploadFiles">
        Upload
      </button>
    </CardiB>
    <CardiB
      heading="Step 3"
      class="w-[300px]"
      :class="{ 'pointer-events-none opacity-50': activeStep !== 3, 'border-t-iati-blue': activeStep !== 3 }"
    >
      <p class="mb-4 text-center">
        Your files are being validated - click below to view their progress and, when complete, reports.
      </p>
      <RouterLink :to="`/validate/${props.workspaceID}`" class="iati-button self-center mt-auto">
        View Progress and Reports
      </RouterLink>
    </CardiB>
  </div>
</template>
