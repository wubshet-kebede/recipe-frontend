<script setup>
import { parseInt } from "lodash";

const emit = defineEmits(["update:modelValue", "onFileChange"]);
// TODO: customize component to handle file type

const props = defineProps({
  accept: {
    type: String,
    default: "image/*",
  },
  limit: { type: Number, default: 1 },
  text: { type: String },
  fileType: { type: String },
  fileSize: { type: Number, default: 10 },
  thumbnail: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const input = ref(null);

const rawFiles = ref([]);

const dataUrls = ref([]);
const selectedForChange = ref(false);

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const open = () => {
  input.value.click();
};
const add = () => {
  input.value.click();
};

const change = () => {
  selectedForChange.value = true;
  input.value.click();
};

const drop = (event) => {
  rawFiles.value = [];
  select({ target: { files: event.dataTransfer.files } });
};

const files = computed(() => {
  const fs = [];
  for (let i = 0; i < rawFiles.value.length; i++) {
    fs.push({
      name: rawFiles.value[i].name,
      size: formatBytes(rawFiles.value[i].size),
      type: rawFiles.value[i].type,
      dataUrl: dataUrls.value[i],
    });
  }
  return fs;
});

const readFile = (file) => {
  return new Promise(function (resolve, reject) {
    const fr = new FileReader();

    fr.onload = function () {
      resolve(fr.result);
    };

    fr.onerror = function () {
      reject(fr);
    };

    fr.readAsDataURL(file);
  });
};

const deleteFiles = () => {
  dataUrls.value = [];
  rawFiles.value = [];
  emit("update:modelValue", undefined);
};

const fileIsOverSizeLimit = ref(false);
const fileIsValidType = ref(true);

const select = async (event) => {
  const rf = event.target.files || [];
  if (selectedForChange.value) {
    rawFiles.value = [];
  }
  for (let j = 0; j < rf.length; j++) {
    if (props.accept) {
      if (props.accept == "application/pdf") {
        if (!rf[j].type.length || !props.accept.includes(rf[j].type)) {
          fileIsValidType.value = false;
          selectedForChange.value = false;
          break;
        } else {
          fileIsValidType.value = true;
        }
      } else {
        if (
          !rf[j].type.length ||
          !props.accept.includes(rf[j].type.split("/")[0])
        ) {
          fileIsValidType.value = false;
          selectedForChange.value = false;
          break;
        } else {
          fileIsValidType.value = true;
        }
      }
    }
    if (j <= props.limit - 1) {
      if (
        parseFloat(rf[j].size) > parseInt(1000000 * parseInt(props.fileSize))
      ) {
        fileIsOverSizeLimit.value = true;
        selectedForChange.value = false;
        break;
      } else {
        rawFiles.value.push(rf[j]);
        fileIsOverSizeLimit.value = false;
      }
    } else {
      break;
    }
  }

  if (!fileIsOverSizeLimit.value && fileIsValidType.value) {
    const readers = [];
    for (let i = 0; i < rawFiles.value.length; i++) {
      readers.push(readFile(rawFiles.value[i]));
    }
    dataUrls.value = await Promise.all(readers);
    emit("update:modelValue", dataUrls.value);
    emit("onFileChange", dataUrls.value);
    selectedForChange.value = false;
  } else {
    dataUrls.value = [];
    rawFiles.value = [];
    emit("update:modelValue", undefined);
    selectedForChange.value = false;
  }
};
</script>
<template>
  <div class="w-full">
    <input
      ref="input"
      type="file"
      class="hidden"
      :accept="props.accept"
      @change="select"
      :multiple="limit > 1"
    />
    <HDragAndDrop>
      <template #default="{ drag, hover }">
        <div
          class="flex w-full border-dashed border-2 border-light-blue-500 rounded-lg text-center py-10"
          :class="{ 'shadow-xl': hover }"
          @drop.prevent="drop"
        >
          <div class="m-auto" v-if="!drag && files.length == 0">
            <div class="flex justify-center">
              <Icon
                name="heroicons:photo"
                v-if="props.fileType == 'image'"
                class="text-xl text-secondary"
              />
              <Icon
                name="heroicons:document-text"
                v-else-if="props.fileType == 'pdf'"
                class="text-xl text-secondary"
              />
            </div>
            <div
              v-if="props.fileType == 'image'"
              class="text-secondary dark:text-secondary-lite"
            >
              Upload an image or drag and drop
            </div>
            <div v-else class="text-secondary">
              Upload a file or drag and drop
            </div>
            <div
              class="text-md font-thin font-body text-secondary dark:text-secondary-lite"
            >
              <span v-if="props.fileType == 'image'"> PNG, JPG, GIF </span>
              <span v-if="props.fileType == 'pdf'">
                pdf
                <span v-if="props.fileSize">
                  Up to {{ props.fileSize }}MB
                </span>
              </span>
            </div>
            <div
              v-if="props.fileType == 'image'"
              class="text-md font-thin font-body text-secondary dark:text-secondary-lite"
            >
              up to {{ props.limit }} files each less than
              {{
                Math.floor(parseInt(props.fileSize) / parseInt(props.limit))
              }}MB
            </div>
            <div class="text-secondary">Or</div>
            <div class="flex justify-center">
              <button
                type="button"
                @click="open"
                class="text-white bg-primary focus:outline-none focus:ring-0 font-medium rounded-md font-body text-sm px-6 py-3 flex justify-between"
                :class="disabled ? 'bg-secondary-2 cursor-not-allowed' : ''"
              >
                <Icon
                  name="heroicons:arrow-up-tray-solid"
                  class="mr-2 text-2xl"
                />
                {{ props.text || "Upload a file" }}
              </button>
            </div>
            <div class="text-md font-thin">
              {{ props.fileTypes }}
            </div>
          </div>
          <div v-else-if="drag" class="m-auto font-bold text-primary">
            Release now
          </div>
          <div class="m-auto" v-else-if="thumbnail && files.length > 0">
            <img :src="files[0].dataUrl" class="h-56 object-contain" alt="" />
          </div>
          <div v-else class="m-auto">
            <div
              class="shadow-lg py-2 px-4 rounded-lg text-sm font-bold text-hahu-gray"
              v-for="(file, index) in files"
              :key="index"
            >
              <div
                v-if="file.type.includes('image') && files.length == 1"
                class="h-[100px]"
              >
                <img :src="file.dataUrl" alt="" class="h-full" />
              </div>
              <div v-else>
                {{ file.name }}
                <span class="text-xs">({{ file.size }})</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!fileIsValidType || fileIsOverSizeLimit">
          <p
            v-if="!fileIsValidType"
            class="flex text-sm text-red-500 font-body items-center justify-center mt-2"
          >
            file is not valid file type! Please upload
            {{ props.fileType }} types
          </p>
          <p
            v-else-if="fileIsOverSizeLimit"
            class="flex text-sm text-red-500 font-body items-center justify-center mt-2"
          >
            file is too big! please upload a file less than
            {{ props.fileSize }} MB
          </p>
        </div>
      </template>
    </HDragAndDrop>
    <div class="w-4/5 mx-auto" v-if="files.length">
      <div
        class="w-full flex flex-row justify-between md:justify-center items-center pt-5"
      >
        <button
          v-if="rawFiles.length === 1"
          type="button"
          @click="change"
          class="text-white bg-primary items-center focus:outline-none focus:ring-0 font-medium rounded-sm md:rounded-md font-body text-sm px-2 md:px-3 py-1 md:py-1.5 flex justify-between mr-3 md:mr-8"
        >
          <Icon name="heroicons:arrow-path-20-solid" class="mr-2 w-3 h-3" />
          Change
        </button>
        <button
          type="button"
          @click="open"
          :disabled="rawFiles.length >= parseInt(limit) ? true : false"
          class="text-white bg-primary items-center focus:outline-none focus:ring-0 font-medium rounded-md font-body text-sm px-2 md:px-3 py-1 md:py-1.5 flex justify-between mr-3 md:mr-8"
          :class="rawFiles.length >= 2 ? 'bg-secondary-4 text-secondary' : ''"
        >
          <Icon name="lucide:plus" class="mr-2 w-3 h-3" />
          Add
        </button>
        <button
          type="button"
          @click="deleteFiles"
          class="text-white bg-red-600 items-center focus:outline-none focus:ring-0 font-medium rounded-md font-body text-sm px-2 md:px-3 py-1 md:py-1.5 flex justify-between"
        >
          <Icon name="gg:trash" class="mr-2 w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
