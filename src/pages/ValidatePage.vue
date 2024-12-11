<script setup>
  import Cookies from "js-cookie";
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import CaptionedLoadingSpinner from "../components/CaptionedLoadingSpinner.vue";
  import CheckBox from "../components/CheckBox.vue";
  import IconChevron from "../components/IconChevron.vue";
  import LocalFilesValidator from "../components/LocalFilesValidator.vue";
  import RemoteFilesValidator from "../components/RemoteFilesValidator.vue";

  const route = useRoute();
  const workspaceID = computed(() => {
    if (route.query.tempWorkspaceID) return route.query.tempWorkspaceID;

    if (Cookies.get("adhocsession")) {
      return Cookies.get("adhocsession");
    }

    const tempWorkspaceID = Date.now().toString(36) + Math.random().toString(36).substr(2);
    Cookies.set("adhocsession", tempWorkspaceID);

    return tempWorkspaceID;
  });
  const fileSource = ref("");

  onMounted(() => {
    if (workspaceID.value && (!Cookies.get("adhocsession") || Cookies.get("adhocsession") !== workspaceID.value)) {
      Cookies.set("adhocsession", workspaceID.value);
    }
    fileSource.value = "upload";
  });
</script>

<template>
  <h1>Check Data</h1>
  <div v-if="route.query.tempWorkspaceID && workspaceID">
    <RouterLink :to="`/validate/${workspaceID}`">
      <IconChevron class="mr-2" />
      <span>Return to your workspace</span>
    </RouterLink>
  </div>
  <p>Upload your IATI file and receive validation feedback.</p>
  <fieldset class="border-none">
    <legend class="invisible">Upload options</legend>
    <CheckBox
      id="upload"
      label="I have a file(s) to upload"
      name="fileSource"
      type="radio"
      :checked="fileSource === 'upload'"
      @checked="fileSource = 'upload'"
    />
    <CheckBox
      id="remote"
      type="radio"
      label="I have a URL to a remote file(s)"
      name="fileSource"
      :checked="fileSource === 'remote'"
      @checked="fileSource = 'remote'"
    />
  </fieldset>
  <CaptionedLoadingSpinner v-if="!fileSource">Loading</CaptionedLoadingSpinner>
  <LocalFilesValidator v-if="fileSource === 'upload'" :workspace-i-d="workspaceID" />
  <RemoteFilesValidator v-if="fileSource === 'remote'" :workspace-i-d="workspaceID" />
</template>
