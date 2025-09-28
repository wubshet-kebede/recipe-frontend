import { useTimeoutFn } from "@vueuse/core";
import { computed, ref } from "vue";

const store = ref({
  notification: { state: false },
});
export default function ({ timeout = 5000 } = {}) {
  const { start, stop } = useTimeoutFn(() => {
    store.value.notification = { state: false };
  }, timeout);

  // stop();

  const notify = ({
    title = "",
    description = "",
    icon = undefined,
    iconClass = "",
    titleClass = "",
    borderClass = "",
    closeButtonClass = "",
    descriptionClass = "",
    cardClass = "",
    image = "",
  } = {}) => {
    store.value.notification = {
      state: true,
      title,
      description,
      icon,
      iconClass,
      titleClass,
      borderClass,
      descriptionClass,
      closeButtonClass,
      cardClass,
      image,
    };
    start();
  };
  const dismiss = () => {
    store.value.notification = { state: false };
  };

  return {
    notify,
    dismiss,
    notification: computed(() => store.value.notification),
  };
}
