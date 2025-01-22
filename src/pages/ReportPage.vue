<script setup>
  import useSWRV from "swrv";
  import { provide, ref, watch, watchEffect } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import AppAlert from "../components/AppAlert.vue";
  import CaptionedLoadingSpinner from "../components/CaptionedLoadingSpinner.vue";
  import FileStatusInfo from "../components/FileStatusInfo.vue";
  import IconChevron from "../components/IconChevron.vue";
  import DocumentInfo from "../components/report/DocumentInfo.vue";
  import DocumentReport from "../components/report/DocumentReport.vue";
  import ReportDocumentStatus from "../components/report/ReportDocumentStatus.vue";
  import {
    fetchDocument,
    fetchOrganisationByID,
    fetchValidationReport,
    getDocumentFileName,
    getDocumentURL,
    getOrganisationURL,
    validationReportURL,
    fetchTempWorkspace,
    getDocumentValidationStatus,
  } from "../utils";

  const router = useRouter();
  const route = useRoute();
  const loading = ref(true);
  const isTestFile = route.query.isTestFile;
  const errors = ref([]);
  const dataset = ref(null);
  const document = ref(null);
  const workSpaceData = ref([]);

  const { data: documentResponse, error: documentError } = useSWRV(
    !isTestFile ? getDocumentURL(route.params?.name) : null,
    () => fetchDocument(route.params.name),
  );
  const headerClassNames = "hidden border-0 border-b border-solid border-gray-300 p-2.5 font-bold sm:block";

  const { data: organisation, error: organisationError } = useSWRV(
    () => document.value && getOrganisationURL(document.value.publisher, "id"),
    () => fetchOrganisationByID(document.value.publisher),
  );
  const { data: datasetResponse, error: datasetError } = useSWRV(
    () =>
      !isTestFile
        ? document.value && validationReportURL(route.params.name, "name")
        : validationReportURL(route.params.name, "id"),
    () => fetchValidationReport(route.params.name, isTestFile),
  );
  provide("organisation", organisation);

  watch(documentResponse, () => {
    if (documentResponse.value) {
      const { data, status, lookupKey } = documentResponse.value;
      if (status === 200) {
        document.value = data;
        if (lookupKey === "id") {
          router.push(`/report/${data.name}`);
        }
        loading.value = !dataset.value;
      }
      if (status === 404 && !isTestFile) {
        const message = `There is no report with name "${route.params.name}"`;
        const sourceError = errors.value.find((error) => error.source === "document");
        if (sourceError) {
          sourceError.value = message;
        } else {
          errors.value = errors.value.concat({ source: "document", message });
        }
        loading.value = false;
      }
    }
  });

  watch(dataset, () => {
    if (dataset.value) {
      fetchTempWorkspace(dataset.value.session_id)
        .then((data) => {
          for (const element of data) {
            const datasetStatus = getDocumentValidationStatus(element);
            element.class = `text-${datasetStatus.value}`;
            element.status = datasetStatus.caption;
          }
          workSpaceData.value = data;
        })
        .catch((error) => window.console.error("Failed to load iati data", error));
    }
  });

  watchEffect(() => {
    if (documentError.value) {
      loading.value = !dataset.value;
      console.log("Document Error: ", documentError.value);
    } else if (organisationError.value) {
      loading.value = !(dataset.value && document.value);
      console.log("Organisation Error: ", organisationError.value);
    } else if (document.value && organisation.value) {
      loading.value = !dataset.value;
    }
    if (datasetError.value) {
      loading.value = !document.value;
      console.log("Data Set Error: ", datasetError.value);
    }
  });
  watchEffect(() => {
    if (datasetResponse.value) {
      const { data, status } = datasetResponse.value;
      if (status === 200) {
        dataset.value = data;
        loading.value = false;
      }
      if (status === 404) {
        const message = "This file does not have a validation report";
        const reportError = errors.value.find((error) => error.source === "report");
        if (reportError) {
          reportError.value = message;
        } else {
          errors.value = errors.value.concat({ source: "report", message });
        }
        loading.value = false;
      }
    }
  });
</script>

<template>
  <RouterLink v-if="isTestFile && dataset" :to="`/validate/${dataset.session_id}`" class="flex">
    <IconChevron class="mr-2" />
    <span>Return to your workspace</span>
  </RouterLink>
  <h1>File Validation Report</h1>
  <div v-if="organisation || document || dataset">
    <h2 class="text-xl">
      <template v-if="organisation">
        <RouterLink :to="`/organisation/${organisation.name}`">{{ organisation.title }}</RouterLink>
        -
      </template>
      <a v-if="document" :href="document.url">{{ getDocumentFileName(document) }}</a>
      <div v-if="dataset && isTestFile">{{ dataset.filename }}</div>
    </h2>
    <DocumentInfo v-if="dataset && dataset.report" :document="document" :report="dataset.report" />
    <CaptionedLoadingSpinner v-if="(!dataset || !dataset.report) && !errors.length">
      Loading Report ...
    </CaptionedLoadingSpinner>
    <div class="grid-cols grid border border-solid border-gray-300">
      <div v-if="!isTestFile" class="grid grid-cols-5 gap-0 bg-white">
        <div class="first:pl-3.5" :class="headerClassNames">File Name</div>
        <div :class="headerClassNames">Identified in Registry</div>
        <div :class="headerClassNames">Validated</div>
        <div :class="headerClassNames">Validation Status</div>
        <div :class="headerClassNames">Available in IATI Datastore</div>
      </div>
      <div v-else class="grid grid-cols-4 gap-0 bg-white">
        <div class="first:pl-3.5" :class="headerClassNames">File Name</div>
        <div :class="headerClassNames">Uploaded</div>
        <div :class="headerClassNames">Validated</div>
        <div :class="headerClassNames">Validation Status</div>
      </div>
      <ReportDocumentStatus
        v-if="dataset && dataset.report"
        :document="document"
        :dataset="dataset"
        :workspacedata="workSpaceData"
      />
    </div>
  </div>

  <CaptionedLoadingSpinner v-if="loading && !errors.length">
    {{ !organisation ? "Loading Document Info ..." : "Loading Report ..." }}
  </CaptionedLoadingSpinner>

  <AppAlert v-if="errors.length" variant="error">
    <p v-for="error in errors" :key="error.source">{{ error.message }}</p>
    <ul>
      <li>
        <a @click="router.back()">Go back to the previous page</a>
      </li>
      <li>
        <RouterLink to="/">Go to homepage</RouterLink>
      </li>
    </ul>
  </AppAlert>

  <FileStatusInfo v-if="!loading && !errors.length" />
  <CaptionedLoadingSpinner v-if="!dataset && !errors.length">Loading Report ...</CaptionedLoadingSpinner>
  <DocumentReport v-if="(dataset && document) || dataset" :document="document" :report="dataset.report" />
</template>
