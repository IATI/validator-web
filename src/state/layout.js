import { inject, onBeforeUnmount, reactive } from "vue";

export const layout = reactive({ title: "" });
export const setPageTitle = (title) => {
  const _layout = inject("layout");
  _layout.title = title;

  onBeforeUnmount(() => (_layout.title = ""));

  return _layout;
};
