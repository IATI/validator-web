<script setup>
  import { forkJoin } from 'rxjs';
  import { ref } from 'vue';
  import CardiB from '../components/CardiB.vue';
  import LinkButton from '../components/LinkButton.vue';
  import { uploadFile } from '../utils';
  import AppAlert from './AppAlert.vue';
  import FileInputButton from './FileInputButton.vue';
  import LoadingSpinner from './LoadingSpinner.vue';
  import StyledButton from './StyledButton.vue';

  const props = defineProps({ workspaceID: { type: String, default: '' } });
  const activeStep = ref(1);
  const files = ref([]);
  const requestStatus = ref(''); // 'pending' | 'draft' | 'success' | 'error' = 'draft'

  const onAddFiles = (_files) => {
    files.value = _files;
    requestStatus.value = 'draft';
    activeStep.value = files.value.length ? 2 : 1;
  };

  const parallelUpload = (files) => forkJoin(files.map((file) => uploadFile(file, props.workspaceID)));

  const uploadFiles = () => {
    const handleError = (error) => {
      console.error(error);
      requestStatus.value = 'error';
    };

    if (files.value.length) {
      requestStatus.value = 'pending';

      parallelUpload(Array.from(files.value)).subscribe({
        next: () => {
          activeStep.value = 3;
          requestStatus.value = 'success';
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
      <FileInputButton
        accept=".xml"
        :multiple="true"
        class="mx-auto mt-auto text-center text-tiny"
        @change="onAddFiles"
      >
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
          File(s) uploading failed. Check your files and try again.
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
      <StyledButton class="text-tiny uppercase" :disabled="requestStatus !== 'draft'" @click="uploadFiles">
        Upload
      </StyledButton>
    </CardiB>
    <CardiB
      heading="Step 3"
      class="w-[300px]"
      :class="{ 'pointer-events-none opacity-50': activeStep !== 3, 'border-t-iati-blue': activeStep !== 3 }"
    >
      <p class="mb-4 text-center">
        Your files are being validated - click below to view their progress and, when complete, reports.
      </p>
      <LinkButton :to="`/validate/${props.workspaceID}`" class="text-tiny"> View Progress and Reports </LinkButton>
    </CardiB>
  </div>
</template>
