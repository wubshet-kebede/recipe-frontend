<script setup>
const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  wrapperClass: {
    type: String,
  },
  title: {
    type: String,
    default: "",
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  enabledOverflow: {
    type: Boolean,
    default: true,
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
</script>
<template>
  <ClientOnly>
    <HeadlessTransitionRoot as="template" :show="open">
      <HeadlessDialog
        as="div"
        class="relative z-[200] overflow-hidden dark:bg-gray-900"
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
          <div class="fixed inset-0 bg-opacity-20 transition-opacity" />
        </HeadlessTransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-hidden">
          <div
            class="flex min-h-full justify-end p-4 max-md:p-0 text-center sm:p-0 md:mt-16 mt-8"
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
                :class="[
                  enabledOverflow ? 'overflow-visible' : 'overflow-y-auto',
                  props.wrapperClass ? props.wrapperClass : 'sm:max-w-md',
                ]"
                tabindex="0"
                class="relative transform border border-gray-400 rounded-lg mx-5 dark:bg-gray-900 bg-white px-4 max-md:px-5 pb-4 text-left shadow-xl transition-all p-6 w-full my-8 max-md:my-8 max-md:p-6 gap-y-3 pt-16"
              >
                <div
                  class="absolute dark:bg-gray-900 w-full justify-between right-0 top-0 px-4 pt-4 flex"
                >
                  <HeadlessDialogTitle
                    as="h3"
                    class="flex-1 text-base font-semibold leading-6 z-50 dark:bg-gray-900"
                    ><slot name="Heading" />
                  </HeadlessDialogTitle>
                  <button
                    type="button"
                    class="px-1 hover:bg-gray-100 shrink-0 h-[20%] rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-100 duration-100"
                    @click="open = false"
                  >
                    <span class="sr-only">Close</span>
                    <Icon name="ion:close-outline" class="text-2xl shrink-0" />
                  </button>
                </div>
                <div
                  class="overflow-y-auto max-h-[70vh] mt-10 sm:mt-12 md:mt-2 dark:bg-gray-900"
                >
                  <slot name="content" />
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </ClientOnly>
</template>
