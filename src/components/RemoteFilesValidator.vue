<script setup>
  import { forkJoin } from "rxjs";
  import { ref, watch } from "vue";
  import { fetchFileFromURL } from "../utils";
  import AppAlert from "./AppAlert.vue";
  import LoadingSpinner from "./LoadingSpinner.vue";

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
  <div class="iati-card-gallery">
    <div class="iati-card">
      <p class="iati-card__title">Step 1</p>
      <label for="url">
        <p>Add a web address (URL) of your IATI XML file. You can add multiple files by separating them with "|".</p>
      </label>
      <input
        id="url"
        v-model="urls"
        type="text"
        placeholder="Enter web address"
        class="border border-solid border-iati-green p-2 pl-4 mt-auto"
      />
      <p v-if="incorrectURLs.length" class="pt-2 text-sm text-warning">
        You have one or more incorrect web addresses: "{{ incorrectURLs.join(", ") }}"
      </p>
    </div>
    <div class="iati-card" :class="{ 'pointer-events-none opacity-50': activeStep === 1 }">
      <p class="iati-card__title">Step 2</p>
      <p>Fetch the files from the web.</p>
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
      <button class="iati-button self-center mt-auto" :disabled="requestStatus !== 'draft'" @click="fetchFiles">
        Fetch
      </button>
    </div>
    <div class="iati-card" :class="{ 'pointer-events-none opacity-50': activeStep !== 3 }">
      <p class="iati-card__title">Step 3</p>
      <p>Your URLs are being validated - click below to view their progress and, when complete, reports.</p>
      <RouterLink :to="`/validate/${props.workspaceID}`" class="iati-button self-center mt-auto">
        View Progress and Reports
      </RouterLink>
    </div>
  </div>
</template>
