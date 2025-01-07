<script setup>
  import { computed, inject } from "vue";
  import AppAlert from "../AppAlert.vue";
  import { GUIDANCE_LINK_URL, containsQuotedTrailingWhitespace } from "../../utils";

  const props = defineProps({ item: { type: Object, default: null } });
  const guidanceLinks = inject("guidanceLinks");
  const report = inject("report");

  const version = computed(() => report.value.iatiVersion.replace(".", ""));
  const isGuidanceAvailable = computed(
    () => guidanceLinks.value && guidanceLinks.value.version && props.item.id in guidanceLinks.value.content,
  );
  const guidanceLink = computed(() => {
    if (isGuidanceAvailable.value) {
      const { id } = props.item;
      const { content } = guidanceLinks.value;
      if ("url" in content[id]) {
        return content[id].url;
      }
      if ("path" in content[id]) {
        return `${GUIDANCE_LINK_URL}/${version.value}/${content[id].path}`;
      }
    }

    return "";
  });
  const codelistLink = computed(() =>
    "codelist" in props.item ? `${GUIDANCE_LINK_URL}/${version.value}/codelists/${props.item.codelist}` : "",
  );
</script>

<template>
  <AppAlert class="mt-2" :variant="props.item.severity">
    <div>
      <span class="float-right">
        <span class="font-bold">{{ props.item.id }}</span>
        <a v-if="isGuidanceAvailable" :href="guidanceLink" title="Open guidance in a new window">(see guidance)</a>
        <a v-if="codelistLink" :href="codelistLink" title="Open guidance in a new window">(see guidance)</a>
      </span>
      <span>{{ props.item.message }}</span>
      <ul
        v-if="props.item.context.length > 1 || (props.item.context.length && props.item.context[0].text !== '')"
        class="list-disc pl-10"
      >
        <li v-for="(context, index) of props.item.context" :key="index" class="iati-code bg-white pl-2">
          <span v-if="containsQuotedTrailingWhitespace(context.text)">
            {{ context.text }}
            <p class="text-error">An empty space was added to the attribute</p>
          </span>
          <span v-else>{{ context.text }}</span>
        </li>
      </ul>
    </div>
  </AppAlert>
</template>
