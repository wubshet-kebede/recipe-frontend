<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  recipeId: {
    type: [String, Number],
    required: true,
  },
  recipeTitle: {
    type: String,
    required: true,
  },
  recipeDescription: {
    type: String,
    default: "Check out this amazing recipe!",
  },
});

const emit = defineEmits(["update:modelValue"]);

const copiedSuccess = ref(false);

const appBaseUrl = ref(
  typeof window !== "undefined"
    ? window.location.origin
    : "https://your-food-recipe-app.com"
);

const fullRecipeUrl = computed(() => {
  return `${appBaseUrl.value}/recipes/${props.recipeId}`;
});

const copyLink = () => {
  const el = document.createElement("textarea");
  el.value = fullRecipeUrl.value;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  try {
    document.execCommand("copy");
    copiedSuccess.value = true;
    setTimeout(() => (copiedSuccess.value = false), 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  } finally {
    document.body.removeChild(el);
  }
};

const encodedRecipeTitle = computed(() =>
  encodeURIComponent(props.recipeTitle)
);
const encodedRecipeDescription = computed(() =>
  encodeURIComponent(props.recipeDescription)
);
const encodedFullRecipeUrl = computed(() =>
  encodeURIComponent(fullRecipeUrl.value)
);

const facebookShareUrl = computed(
  () =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodedFullRecipeUrl.value}&quote=${encodedRecipeTitle.value}`
);

const twitterShareUrl = computed(
  () =>
    `https://twitter.com/intent/tweet?text=${encodedRecipeTitle.value}&url=${encodedFullRecipeUrl.value}&hashtags=foodrecipe,cooking`
);

const whatsAppShareUrl = computed(
  () =>
    `https://api.whatsapp.com/send?text=${encodedRecipeTitle.value}%20-%20${encodedRecipeDescription.value}%20${encodedFullRecipeUrl.value}`
);

const emailShareUrl = computed(
  () =>
    `mailto:?subject=${encodedRecipeTitle.value}&body=${encodedRecipeDescription.value}%0A%0A${encodedFullRecipeUrl.value}`
);

const enableNativeShare = computed(
  () => typeof navigator !== "undefined" && navigator.share
);
// web share Api
const shareNative = async () => {
  // check the browser support it
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.recipeTitle,
        text: props.recipeDescription,
        url: fullRecipeUrl.value,
      });
      console.log("Recipe shared successfully with native API");
    } catch (error) {
      console.error("Error sharing with native API:", error);
    }
  } else {
    console.warn("Web Share API not supported in this browser.");
  }
};

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-white dark:bg-gray-50/5 bg-opacity-60 flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-sm w-full mx-auto p-6 relative"
    >
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <Icon name="material-symbols:close-rounded" class="text-2xl" />
      </button>

      <h2
        class="text-2xl dark:text-secondary-lite font-bold text-gray-800 mb-4 text-center"
      >
        Share Your Recipe
      </h2>
      <p class="text-center text-gray-600 dark:text-secondary-lite mb-6">
        Spread the joy of cooking!
      </p>
      <div class="mb-4">
        <label
          for="recipe-link"
          class="block text-sm font-semibold text-gray-700 mb-2 dark:text-secondary-lite"
          >Link to share:</label
        >
        <div class="flex items-center space-x-2">
          <input
            id="recipe-link"
            type="text"
            readonly
            :value="fullRecipeUrl"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 truncate"
          />
          <button
            @click="copyLink"
            class="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center"
          >
            <font-awesome-icon
              v-if="!copiedSuccess"
              :icon="['fas', 'copy']"
              class="w-5 h-5 mr-1"
            />
            <font-awesome-icon
              v-else
              :icon="['fas', 'check']"
              class="w-5 h-5 mr-1 text-green-300"
            />
            {{ copiedSuccess ? "Copied!" : "Copy" }}
          </button>
        </div>
      </div>
      <div class="flex justify-center space-x-4 mb-4">
        <a
          :href="facebookShareUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="share-icon text-primary rounded-full p-3 transition-colors flex items-center justify-center"
          aria-label="Share on Facebook"
        >
          <Icon name="logos:facebook" class="text-2xl" />
        </a>
        <a
          :href="twitterShareUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="share-icon text-primary rounded-full p-3 transition-colors flex items-center justify-center"
          aria-label="Share on X (Twitter)"
        >
          <Icon name="mdi:twitter" class="text-2xl" />
        </a>
        <a
          :href="whatsAppShareUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="share-icon text-green-500 rounded-full p-3 transition-colors flex items-center justify-center"
          aria-label="Share on WhatsApp"
        >
          <Icon name="ic:baseline-whatsapp" class="text-2xl" />
        </a>
        <a
          v-if="enableNativeShare"
          @click="shareNative"
          class="share-icon bg-gray-500 hover:bg-gray-600 text-white rounded-full p-3 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Share via native dialog"
        >
          <!-- !!! UPDATED: Font Awesome Share Icon !!! -->
          <font-awesome-icon :icon="['fas', 'share-nodes']" class="w-6 h-6" />
        </a>
      </div>

      <!-- Email Sharing -->
      <div class="text-center">
        <a
          :href="emailShareUrl"
          class="text-primary hover:underline transition-colors"
          aria-label="Share via Email"
        >
          Or share via Email
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-icon {
  width: 48px;
  height: 48px;
  font-size: 24px;
}
.share-icon svg {
  width: 100%;
  height: 100%;
}
</style>
