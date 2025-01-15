<script setup>
  import { ref, watch } from "vue";

  const props = defineProps({
    id: { type: String, default: "" },
    label: { type: String, default: "" },
    name: { type: String, default: "" },
    checked: { type: Boolean, default: false },
    labelClass: { type: String, default: "" },
    size: { type: String, default: "" },
    type: { type: String, default: "checkbox" },
  });
  const emit = defineEmits(["checked", "unchecked"]);
  const checked = ref(props.checked);

  watch(checked, () => {
    if (checked.value !== props.checked) {
      emit(checked.value ? "checked" : "unchecked");
    }
  });
  watch(
    () => props.checked,
    () => {
      if (checked.value !== props.checked) {
        checked.value = props.checked;
      }
    },
  );
</script>
<template>
  <div class="icheck-green" :class="props.size">
    <input :id="props.id" v-model="checked" :checked="checked" :type="props.type" :name="props.name" />
    <label :for="props.id" :class="props.labelClass">{{ props.label }}</label>
  </div>
</template>
<style>
  [class*="icheck-"] {
    min-height: 22px;
    margin-top: 6px !important;
    margin-bottom: 6px !important;
    padding-left: 0px;
  }

  .icheck-inline {
    display: inline-block;
  }

  .icheck-inline + .icheck-inline {
    margin-left: 0.75rem;
    margin-top: 6px;
  }

  [class*="icheck-"] > label {
    padding-left: 29px !important;
    min-height: 22px;
    line-height: 22px;
    display: inline-block;
    position: relative;
    vertical-align: top;
    margin-bottom: 0;
    cursor: pointer;
  }

  [class*="icheck-"] > input:first-child {
    position: absolute !important;
    opacity: 0;
    margin: 0;
  }

  [class*="icheck-"] > input:first-child:disabled {
    cursor: default;
  }

  [class*="icheck-"] > input:first-child + label::before,
  [class*="icheck-"] > input:first-child + input[type="hidden"] + label::before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 22px;
    height: 22px;
    border: 1px solid #d3cfc8;
    border-radius: 0px;
    margin-left: -29px;
    background: #fff;
  }

  [class*="icheck-"].small > input:first-child + label::before,
  [class*="icheck-"].small > input:first-child + input[type="hidden"] + label::before {
    width: 16px;
    height: 16px;
  }

  [class*="icheck-"] > input:first-child:checked + label::after,
  [class*="icheck-"] > input:first-child:checked + input[type="hidden"] + label::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 7px;
    height: 10px;
    border: solid 2px #fff;
    border-left: none;
    border-top: none;
    transform: translate(7.75px, 4.5px) rotate(45deg);
    -ms-transform: translate(7.75px, 4.5px) rotate(45deg);
  }

  [class*="icheck-"].small > input:first-child:checked + label::after,
  [class*="icheck-"].small > input:first-child:checked + input[type="hidden"] + label::after {
    width: 6px;
    height: 10px;
    left: -3px;
    top: -3px;
  }

  [class*="icheck-"] > input[type="radio"]:first-child + label::before,
  [class*="icheck-"] > input[type="radio"]:first-child + input[type="hidden"] + label::before {
    border-radius: 50%;
  }

  [class*="icheck-"] > input:first-child:not(:checked):not(:disabled):hover + label::before,
  [class*="icheck-"] > input:first-child:not(:checked):not(:disabled):hover + input[type="hidden"] + label::before {
    border-width: 2px;
  }

  [class*="icheck-"] > input:first-child:disabled + label,
  [class*="icheck-"] > input:first-child:disabled + input[type="hidden"] + label,
  [class*="icheck-"] > input:first-child:disabled + label::before,
  [class*="icheck-"] > input:first-child:disabled + input[type="hidden"] + label::before {
    pointer-events: none;
    cursor: default;
    filter: alpha(opacity=65);
    -webkit-box-shadow: none;
    box-shadow: none;
    opacity: 0.65;
  }

  .icheck-default > input:first-child:not(:checked):not(:disabled):hover + label::before,
  .icheck-default > input:first-child:not(:checked):not(:disabled):hover + input[type="hidden"] + label::before {
    border-color: #adadad;
  }

  .icheck-default > input:first-child:checked + label::before,
  .icheck-default > input:first-child:checked + input[type="hidden"] + label::before {
    background-color: #e6e6e6;
    border-color: #adadad;
  }

  .icheck-default > input:first-child:checked + label::after,
  .icheck-default > input:first-child:checked + input[type="hidden"] + label::after {
    border-bottom-color: #333;
    border-right-color: #333;
  }

  .icheck-green > input:first-child:not(:checked):not(:disabled):hover + label::before,
  .icheck-green > input:first-child:not(:checked):not(:disabled):hover + input[type="hidden"] + label::before {
    border-color: #155366;
  }

  .icheck-green > input:first-child:checked + label::before,
  .icheck-green > input:first-child:checked + input[type="hidden"] + label::before {
    background-color: #155366;
    border-color: #155366;
  }
</style>
