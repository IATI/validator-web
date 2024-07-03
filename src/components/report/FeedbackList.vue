<script setup>
  import { getFeedbackCategoryLabel } from "../../utils";
  import AppBadge from "../AppBadge.vue";
  import CenteredLoadingSpinner from "../CenteredLoadingSpinner.vue";
  import FeedbackItem from "./FeedbackItem.vue";

  const props = defineProps({ message: { type: Object, default: null } });
</script>

<template>
  <CenteredLoadingSpinner v-if="!props.message" />
  <div v-else>
    <AppBadge class="text-white">{{ getFeedbackCategoryLabel(props.message.category) }}</AppBadge>
    <FeedbackItem v-for="(item, index) in props.message.errors" :key="`${index}-${item.id}`" :item="item" />
  </div>
</template>
