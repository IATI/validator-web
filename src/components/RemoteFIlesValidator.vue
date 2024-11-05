<script setup>
  import { forkJoin } from "rxjs";
  import { ref, watch } from "vue";
  import CardiB from "../components/CardiB.vue";
  import LinkButton from "../components/LinkButton.vue";
  import { fetchFileFromURL } from "../utils";
  import AppAlert from "./AppAlert.vue";
  import LoadingSpinner from "./LoadingSpinner.vue";
  import StyledButton from "./StyledButton.vue";

  const props = defineProps({ workspaceID: { type: String, default: "" } });
  const activeStep = ref(1);
  const requestStatus = ref(""); // 'pending' | 'draft' | 'success' | 'error' = 'draft'
  const includeGenericErrorMessage = ref(true);
  const requestErrorMessage = ref("");
  const urls = ref("");
  const incorrectURLs = ref([]);

  watch(urls, () => {
    if (urls.value) {
      activeStep.value = 2;
      requestStatus.value = "draft";
    } else if (activeStep.value !== 1) {
      activeStep.value = 1;
      requestStatus.value = "";
    }

    if (incorrectURLs.value.length) {
      incorrectURLs.value = [];
    }
  });

  const validateURL = (value) =>
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      value,
    );

  const parallelUpload = (fileUrls) => forkJoin(fileUrls.map((url) => fetchFileFromURL(url, props.workspaceID)));

  const fetchFiles = () => {
    const serializedURLs = urls.value.split("|").map((url) => url.trim());
    const correctURLs = [];
    serializedURLs.forEach((u) => {
      if (validateURL(u)) {
        correctURLs.push(u);
      } else {
        incorrectURLs.value.push(u);
      }
    });
    if (correctURLs.length && !incorrectURLs.value.length) {
      const handleError = (error) => {
        requestStatus.value = "error";
        if (error && error.message) {
          requestErrorMessage.value = error.message;
          if (error.cause.status === 503) {
            includeGenericErrorMessage.value = false;
          }
        } else {
          console.log(`Error received from IATI Validator Services: ${error}`);
        }
      };

      requestStatus.value = "pending";
      parallelUpload(correctURLs).subscribe({
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
      <label for="url" class="mb-4 text-center">
        Add a web address (URL) of your IATI XML file. You can add multiple files by seperating them with |
      </label>
      <input
        id="url"
        v-model="urls"
        type="text"
        placeholder="Enter web address"
        class="mt-2 border border-solid border-iati-green p-2 pl-4"
      />
      <p v-if="incorrectURLs.length" class="pt-2 text-sm text-warning">
        You have one or more incorrect web addresses: "{{ incorrectURLs.join(", ") }}"
      </p>
    </CardiB>
    <CardiB
      heading="Step 2"
      class="w-[300px]"
      :class="{ 'pointer-events-none opacity-50': activeStep === 1, 'border-t-iati-blue': activeStep !== 2 }"
    >
      <p class="mb-4 text-center">Fetch the files from the web.</p>
      <div v-if="requestStatus && requestStatus !== 'draft'" class="mb-3 text-sm">
        <AppAlert v-if="requestStatus === 'error'" variant="error">
          <template v-if="includeGenericErrorMessage">
            File(s) uploading failed. Check your files and try again.<br />
          </template>
          {{ requestErrorMessage }}
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
      <StyledButton class="text-tiny uppercase" :disabled="requestStatus !== 'draft'" @click="fetchFiles">
        Fetch
      </StyledButton>
    </CardiB>
    <CardiB
      heading="Step 3"
      class="w-[300px]"
      :class="{ 'pointer-events-none opacity-50': activeStep !== 3, 'border-t-iati-blue': activeStep !== 3 }"
    >
      <p class="mb-4 text-center">
        Your URLs are being validated - click below to view their progress and, when complete, reports.
      </p>
      <LinkButton :to="`/validate/${props.workspaceID}`" class="text-tiny"> View Progress and Reports </LinkButton>
    </CardiB>
  </div>
</template>
