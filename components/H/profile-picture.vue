<script setup>
import VuePictureCropper, { cropper } from "vue-picture-cropper";

const emits = defineEmits(["update:modelValue", "selectImage"]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const files = ref([]);
const showCropModal = ref(false);
const pic = ref("");
const openModal = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});
const result = reactive({
  dataURL: "",
  blobURL: "",
});

watch(files, async (newFile, oldFile) => {
  if (newFile && newFile.length) {
    // Update the picture
    pic.value = newFile;
    // Show the modal
    showCropModal.value = true;
    // Clean file
    files.value = [];
  }
});

/**
 * Get cropping results
 */
async function getResult() {
  if (!cropper) return;
  const base64 = cropper.getDataURL();
  //   const blob = await cropper.getBlob()
  //   if (!blob) return
  //   const file = await cropper.getFile({
  //     fileName: locales.fileName,
  //   })

  result.dataURL = base64;
  //   result.blobURL = URL.createObjectURL(blob)
  showCropModal.value = false;
  emits("selectImage", result.dataURL);
  emits("update:modelValue", false);
}
/**
 * Clear the crop box
 */
function clear() {
  if (!cropper) return;
  cropper.clear();
}
/**
 * Reset the default cropping area
 */
function reset() {
  if (!cropper) return;
  cropper.reset();
}
/**
 * The ready event passed to Cropper.js
 */
function ready() {}

const closeDialog = () => {
  files.value = [];
  clear();
  showCropModal.value = false;
  emits("update:modelValue", false);
};

const save = () => {
  emits("selectImage", files.value);
  emits("update:modelValue", false);
};
</script>

<template>
  <ModalsModal
    v-model="openModal"
    :autoClose="false"
    :enabledOverflow="true"
    wrapperClass="max-w-xl"
  >
    <template #Heading>
      <div
        class="text-lg font-body mb-2 text-black font-medium capitalize flex items-center gap-x-2"
      >
        <Icon name="gg:profile" class="text-2xl" />
        <h1>Profile</h1>
      </div>
    </template>
    <template #content>
      <div class="px-8 2xl:pt-8 pt-4 w-full flex flex-col gap-y-3 bg-white">
        <div class="flex flex-col gap-y-12">
          <div v-if="!showCropModal" class="">
            <HFileUpload
              fileType="image"
              text="Upload an image"
              :limit="1"
              accept="image/*"
              :fileSize="10"
              v-model="files"
            ></HFileUpload>
          </div>
          <!-- The component imported from `vue-picture-cropper` plugin -->
          <div v-else>
            <VuePictureCropper
              :boxStyle="{
                backgroundColor: '#f8f8f8',
                margin: 'auto',
              }"
              :img="pic"
              :options="{
                viewMode: 1,
                dragMode: 'crop',
                aspectRatio: 1 / 1,
              }"
              @ready="ready"
            />
          </div>
        </div>
        <div class="flex justify-center items-center">
          <div class="p-2">
            <Icon
              name="iconamoon:close-light"
              v-if="!showCropModal"
              @click="closeDialog"
              class="w-10 cursor-pointer hover:bg-primarySb-lite-2 p-2 rounded-md"
            />
            <div v-else class="flex gap-x-3 items-center hover:bg-none">
              <div
                @click="getResult"
                class="reactiveButton hover:!bg-primarySb-lite-2 cursor-pointer"
              >
                Crop
              </div>
              <div
                @click="clear"
                class="reactiveButton !bg-secondary-6/70 cursor-pointer"
              >
                Clear
              </div>
              <div
                @click="reset"
                class="reactiveButton !bg-secondary-6/70 cursor-pointer"
              >
                Reset
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalsModal>
</template>

<style></style>
