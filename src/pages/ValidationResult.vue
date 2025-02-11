<script setup>
  import copy from "copy-to-clipboard";
  import Cookies from "js-cookie";
  import { timer } from "rxjs";
  import { onBeforeUnmount, onMounted, ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import CaptionedLoadingSpinner from "../components/CaptionedLoadingSpinner.vue";
  import FileStatusInfo from "../components/FileStatusInfo.vue";
  import LoadingSpinner from "../components/LoadingSpinner.vue";
  import AppAlert from "../components/AppAlert.vue";
  import { fetchTempWorkspace, formatDate, getDocumentValidationStatus } from "../utils";

  const route = useRoute();
  const router = useRouter();
  const workspaceID = route.params.tempWorkspaceID;
  const baseURL = window.location.origin;
  const workspaceData = ref([]);
  const subscribeTimer = ref();
  const addressCopied = ref(false);
  const loading = ref(true);
  const workSpaceDataError = ref("");

  onMounted(() => {
    subscribeTimer.value = timer(100, 2500).subscribe(() => loadData());
  });

  onBeforeUnmount(() => {
    subscribeTimer?.value.unsubscribe();
  });

  watch(workspaceData, () => {
    // check that workspace valition returned data
    if (!workspaceData.value.length) {
      return;
    }
    // check that all returned data has a report
    for (const idd of workspaceData.value) {
      if (idd.report === null) {
        return;
      }
    }
    loading.value = false;
    subscribeTimer?.value.unsubscribe();
  });

  const loadData = () => {
    fetchTempWorkspace(workspaceID)
      .then((data) => {
        for (const element of data) {
          const datasetStatus = getDocumentValidationStatus(element);
          element.class = `text-${datasetStatus.value}`;
          element.status = datasetStatus.caption;
        }

        workspaceData.value = data;
      })
      .catch((error) => {
        window.console.error("Failed to load iati data", error);
        workSpaceDataError.value = "Failed to load iati data please try again later";
      });
  };

  const copyToClipboard = (text) => {
    copy(text);
    addressCopied.value = true;
    setTimeout(() => (addressCopied.value = false), 3000);
  };

  const onAddMoreFiles = () => {
    router.push({ path: "/validate/", query: { tempWorkspaceID: workspaceID } });
  };

  const onClearWorkspace = () => {
    if (
      !window.confirm("Are you sure you want to clear all files from your workspace and return to the upload page?")
    ) {
      return;
    }

    Cookies.remove("adhocsession");
    router.push("/validate");
  };

  const onClickRow = (dataset) => {
    if (dataset.valid !== null) {
      router.push({ path: `/report/${dataset.guid}/`, query: { isTestFile: true } });
    }
  };

  const headerClassNames = "hidden border-0 border-b border-solid border-gray-300 p-2.5 font-bold sm:block";
  const textClasses =
    "overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal text-tiny";
</script>

<template>
  <h1>Validation Results</h1>
  <p>
    Your personal workspace is
    <RouterLink :to="route.path">{{ `${baseURL}${route.fullPath}` }}</RouterLink>
    <button class="ml-4 iati-button" :outline="true" @click="copyToClipboard(`${baseURL}${route.fullPath}`)">
      {{ addressCopied ? "Copied to clipboard" : "Copy the address" }}
    </button>
  </p>
  <FileStatusInfo />
  <CaptionedLoadingSpinner v-if="!workspaceData.length && !workSpaceDataError">Loading</CaptionedLoadingSpinner>

  <AppAlert v-if="workSpaceDataError" variant="error">
    {{ workSpaceDataError }}
  </AppAlert>
  <div v-if="workspaceData.length" class="grid grid-cols-1 border border-solid border-gray-300">
    <div class="sticky top-0 grid grid-cols-4 gap-0 bg-white">
      <div class="first:pl-3.5" :class="headerClassNames">File Name</div>
      <div :class="headerClassNames">Uploaded</div>
      <div :class="headerClassNames">Validated</div>
      <div :class="headerClassNames">Validation Status</div>
    </div>

    <div
      v-for="item in workspaceData"
      :key="item.filename"
      class="doc-list-item flex cursor-pointer flex-col gap-0 border-t border-solid border-gray-300 odd:bg-white even:bg-slate-100 hover:bg-gray-200 sm:grid sm:grid-cols-4 sm:border-0"
      @click="onClickRow(item)"
    >
      <div class="py-2 pb-2 first:pl-3.5" :class="textClasses">
        <p class="text-base font-bold sm:hidden">File Name</p>
        <span>{{ item.filename }}</span>
      </div>
      <div class="pb-2 pl-3.5 pt-0 sm:py-2" :class="textClasses">
        <p class="text-base font-bold sm:hidden">Uploaded</p>
        <span>{{ formatDate(item.created) }}<LoadingSpinner v-if="loading && !item.created" class="h-6 w-6" /></span>
      </div>
      <div class="pb-2 pl-3.5 pt-0 sm:py-2" :class="textClasses">
        <p class="text-base font-bold sm:hidden">Validated</p>
        <span>
          {{ formatDate(item.validated) }}
          <LoadingSpinner v-if="loading && !item.validated" class="h-6 w-6" />
        </span>
      </div>
      <div class="pb-2 pl-3.5 pt-0 sm:py-2" :class="textClasses">
        <span class="pr-2 text-base font-bold sm:hidden">Validation Status:</span>
        <span :class="item.class" class="text-base font-bold">
          {{ item.status }}
          <LoadingSpinner v-if="loading && !item.status" class="h-6 w-6" />
        </span>
      </div>
    </div>
  </div>

  <div v-if="workspaceData.length" class="flex gap-2 mt-2">
    <button class="iati-button" @click="onAddMoreFiles">Add more files</button>
    <button class="iati-button" @click="onClearWorkspace">Clear workspace</button>
  </div>
</template>
