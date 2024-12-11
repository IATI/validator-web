<script setup>
  import useSWRV from "swrv";
  import { ref, watchEffect } from "vue";
  import { useRoute } from "vue-router";
  import placeholderImage from "../assets/images/placeholder-organization.png";
  import AppAlert from "../components/AppAlert.vue";
  import BasicAlert from "../components/BasicAlert.vue";
  import BasicCard from "../components/BasicCard.vue";
  import CaptionedLoadingSpinner from "../components/CaptionedLoadingSpinner.vue";
  import CardHeader from "../components/CardHeader.vue";
  import FileStatusInfo from "../components/FileStatusInfo.vue";
  import DocumentList from "../components/organisation/DocumentList.vue";
  import SelectInput from "../components/SelectInput.vue";
  import StyledLink from "../components/StyledLink.vue";
  import {
    documentValidationStatus,
    fetchOrganisationByName,
    fetchOrganisationDocuments,
    fetchOrganisationReports,
    getDefaultSortingCriteria,
    getDocumentCount,
    getOrganisationDocumentsURL,
    getOrganisationReportsURL,
    getOrganisationURL,
    getStatusColor,
    sortOptions,
  } from "../utils";
  import { constructCSV } from "../utils/document";

  const title = ref("Loading...");
  const route = useRoute();
  const loading = ref(true);
  const reportsLoading = ref(true);
  const selected = ref("");
  const organisation = ref(null);
  const errorMessage = ref(null);
  const downloadCSV = ref(null);

  const { data: organisationResponse, error: organisationError } = useSWRV(getOrganisationURL(route.params.name), () =>
    fetchOrganisationByName(route.params.name),
  );
  const { data: documents, error: documentsError } = useSWRV(
    () => (organisation.value && organisation.value ? getOrganisationDocumentsURL(organisation.value.org_id) : null),
    () => fetchOrganisationDocuments(organisation.value.org_id),
  );
  const { data: reports, error: reportsError } = useSWRV(
    () => (organisation.value && organisation.value ? getOrganisationReportsURL(organisation.value.org_id) : null),
    () => fetchOrganisationReports(organisation.value.org_id),
  );

  watchEffect(() => {
    if (organisationResponse.value) {
      const { data, status } = organisationResponse.value;
      if (status === 200) {
        organisation.value = data;
      }
      if (status === 404) {
        errorMessage.value = `No organisation found with name "${route.params.name}"`;
        title.value = "Organisation Not Found";
      }
    }
  });
  watchEffect(() => {
    if (organisationError && organisationError.value) {
      loading.value = false;
      console.log(organisationError.value);
    } else if (organisation.value && organisation.value) {
      title.value = organisation.value.title;
    }
  });
  watchEffect(() => {
    if (documentsError && documentsError.value) {
      loading.value = false;
      console.log(documentsError.value);
    } else if (documents && documents.value) {
      loading.value = false;
    }
  });
  watchEffect(() => {
    if (reportsError && reportsError.value) {
      console.log(reportsError.value);
    } else if (reports && reports.value) {
      reportsLoading.value = false;
    }
  });
  watchEffect(() => {
    if (documents && documents.value) {
      selected.value = getDefaultSortingCriteria(documents.value);
    }
  });
  watchEffect(() => {
    if (reports && reports.value) {
      downloadCSV.value = () => {
        const text = encodeURIComponent(constructCSV(reports.value));
        const filename = `${organisation.value.name}.csv`;
        const element = document.createElement("a");
        element.setAttribute("href", `data:text/csv;charset=utf-8,${text}`);
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      };
    }
  });
</script>

<template>
  <h1>{{ title }}</h1>
  <div>
    <AppAlert v-if="errorMessage" variant="error">
      <p>{{ errorMessage }}</p>
    </AppAlert>
    <div v-if="organisation && organisation.image_url" class="max-w-[200px]">
      <img
        :src="organisation.image_url"
        :alt="organisation.name"
        @error="(event) => (event.target.src = placeholderImage)"
      />
    </div>
    <div v-if="organisation && organisation.description">
      <h2>Description</h2>
      <p>{{ organisation.description }}</p>
    </div>
  </div>

  <CaptionedLoadingSpinner v-if="loading && !errorMessage">
    {{ !organisation ? "Loading Info ..." : "Loading Reports..." }}
  </CaptionedLoadingSpinner>

  <div v-if="!loading && !errorMessage" class="flex flex-wrap">
    <BasicCard>
      <template #header>
        <CardHeader><h3>Public Data</h3></CardHeader>
      </template>

      <h4>IATI files published in the IATI Registry</h4>
      <FileStatusInfo />

      <div class="-mx-3.5 -mb-3.5">
        <div class="flex flex-col p-3 sm:flex-row sm:justify-between">
          <div v-if="documents && documents.length" class="py-2">
            <span>{{ documents.length }} {{ documents.length === 1 ? "file" : "files" }}</span>
            <span v-for="status in documentValidationStatus(documents)" :key="status">
              | <label :class="getStatusColor(status)">{{ status }}</label> : {{ getDocumentCount(documents, status) }}
            </span>
            <span v-if="!reportsLoading">
              |
              <button @click="downloadCSV()">Download Validation Report CSV</button>
            </span>
          </div>
          <div v-if="documents && documents.length" class="flex flex-col sm:mt-0 sm:flex-row">
            <label id="documentSort" for="documentSort" class="whitespace-nowrap sm:py-2">Sort by:</label>
            <SelectInput
              id="documentSort"
              v-model="selected"
              :options="documents && documents.length ? sortOptions(documents).map((option) => option.label) : []"
              placeholder="Sort by"
              :allow-empty="false"
              :selected-label="''"
              :deselect-label="''"
              class="min-w-[300px] sm:ml-1"
            />
          </div>
        </div>
        <DocumentList
          v-if="documents && documents.length"
          :key="Math.random()"
          :documents="documents"
          :sortvariable="selected"
        >
        </DocumentList>
        <div v-else-if="documentsError || organisationError" class="m-3.5">
          <BasicAlert>
            Couldn't fetch the documents. Please try again later. If the problem persists, email support at
            <a href="mailto:support@iatistandard.org">support@iatistandard.org</a>
          </BasicAlert>
        </div>
      </div>
    </BasicCard>
  </div>
</template>
