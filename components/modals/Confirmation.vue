<script setup>
const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: "ph:seal-check-fill",
  },
  iconWrapperClass: {
    type: String,
    default:
      "mx-auto flex h-12 w-12 flex-shrink-0 items-center text-primary justify-center rounded-full bg-primary/10 sm:mx-0 sm:h-10 sm:w-10",
  },
  iconClass: {
    type: String,
    default: "h-8 w-8 text-green-600",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  confirmButton: {
    type: String,
    default: "Confirm",
  },
  loading: {
    type: [Boolean, String],
    default: false,
  },
  confirmButtonClass: {
    type: String,
    default:
      "flex gap-x-1 items-center w-full justify-center rounded-md bg-primary/80 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary sm:ml-3 sm:w-auto",
  },
  mainInterfaceClass: {
    type: String,
    default: "",
  },
  headerClass: {
    type: String,
    default: "",
  },
  descriptionClass: {
    type: String,
    default: "",
  },
});

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});

function emitConfirmation() {
  emits("confirm");
}
</script>
<template>
  <ClientOnly>
    <HeadlessTransitionRoot as="template" :show="open">
      <HeadlessDialog
        as="div"
        class="relative z-[200]"
        @close="autoClose ? (open = false) : ''"
      >
        <HeadlessTransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-20 transition-opacity"
          />
        </HeadlessTransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <HeadlessTransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-lg sm:p-6"
                :class="mainInterfaceClass"
              >
                <div class="absolute right-2 top-2 sm:top-4 sm:right-4">
                  <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-offset-1"
                    @click="open = false"
                  >
                    <span class="sr-only">Close</span>
                    <Icon
                      name="ion:close-outline"
                      width="25"
                      height="25"
                      class="h-6 w-6"
                    />
                  </button>
                </div>

                <div class="flex items-center gap-3">
                  <div :class="iconWrapperClass">
                    <Icon
                      :name="icon"
                      :class="iconClass"
                      width="35"
                      height="35"
                      aria-hidden="true"
                    />
                  </div>
                  <HeadlessDialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    :class="headerClass"
                  >
                    {{ title }}
                  </HeadlessDialogTitle>
                </div>

                <div class="mt-3">
                  <p
                    class="text-sm text-gray-500 break-words"
                    v-html="description"
                    :class="descriptionClass"
                  />
                </div>

                <div class="mt-5 flex justify-between gap-3 sm:mt-4">
                  <button
                    type="button"
                    class="px-3 py-2 rounded-md bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    @click="open = false"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    class="px-4 py-2 rounded-md text-white disabled:bg-gray-300"
                    :class="confirmButtonClass"
                    :disabled="loading"
                    @click="emitConfirmation"
                  >
                    <Icon
                      name="svg-spinners:ring-resize"
                      class="shrink-0 text-2xl mr-2"
                      v-if="loading"
                    />
                    {{ confirmButton }}
                  </button>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </ClientOnly>
</template>
