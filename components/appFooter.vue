<template>
  <footer
    class="bg-gray-100 py-8 px-6 text-gray-600 text-sm border-t border-gray-200 dark:border-gray-500 mt-auto dark:bg-gray-900"
  >
    <div
      class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
    >
      <div>
        <NuxtLink
          to="/"
          class="text-green-600 font-bold md:text-2xl text-lg mb-4 block"
          >Food Recipe</NuxtLink
        >
        <p class="dark:text-secondary-lite">
          Food Recipe is a recipe website with a mission to make your cooking
          journey easy and delightful. Discover new recipes, share your
          creations, and connect with other food lovers.
        </p>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-around sm:justify-center gap-8 md:gap-x-16 dark:text-secondary-lite"
      >
        <div class="min-w-[20px]">
          <h3 class="font-semibold text-gray-800 mb-3 dark:text-secondary-lite">
            Company
          </h3>
          <ul>
            <li class="mb-1">
              <NuxtLink to="/about" class="hover:text-blue-600"
                >About Us</NuxtLink
              >
            </li>
            <li class="mb-1">
              <NuxtLink to="/contact" class="hover:text-blue-600"
                >Contact</NuxtLink
              >
            </li>
            <li class="mb-1">
              <NuxtLink to="/careers" class="hover:text-blue-600"
                >Careers</NuxtLink
              >
            </li>
          </ul>
        </div>
        <div class="min-w-[120px] dark:text-secondary-lite">
          <h3
            class="font-semibold text-gray-800 mb-3 class dark:text-secondary-lite"
          >
            Resources
          </h3>
          <ul>
            <li class="mb-1">
              <NuxtLink to="/blog" class="hover:text-blue-600">Blog</NuxtLink>
            </li>
            <li class="mb-1">
              <NuxtLink to="/faq" class="hover:text-blue-600">FAQ</NuxtLink>
            </li>
            <li class="mb-1">
              <NuxtLink to="/terms" class="hover:text-blue-600"
                >Terms of Service</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="text-left md:text-right dark:text-secondary-lite">
        <h3 class="font-semibold text-gray-800 mb-3 dark:text-secondary-lite">
          Stay Updated
        </h3>
        <p class="mb-3">
          Subscribe to our newsletter for delicious recipes and cooking tips!
        </p>

        <!-- Newsletter Subscription Form -->
        <form
          @submit.prevent="newsletterStore.subscribe()"
          class="flex flex-col sm:flex-row w-full max-w-sm md:max-w-md mx-auto md:mx-0"
        >
          <input
            type="email"
            placeholder="Your email address"
            class="w-full sm:flex-grow px-4 py-2 h-11 border dark:bg-gray-900 dark:border-gray-800 border-gray-300 sm:rounded-l-md rounded-md sm:rounded-r-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2 sm:mb-0"
          />
          <button
            type="submit"
            class="w-full sm:w-auto bg-green-600 text-white px-5 py-2 h-11 rounded-md sm:rounded-l-none sm:rounded-r-md transition-colors duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Subscribe
          </button>
        </form>
        <!--<span
              v-if="newsletterStore.isLoading"
              class="flex items-center justify-center"
            >
              <svg
                class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Subscribing...
            </span>
            <span v-else> Subscribe </span>-->

        <!-- Feedback Messages.......<p
          v-if="newsletterStore.isSuccess"
          class="mt-2 text-sm text-green-600 font-semibold transition-opacity duration-300"
        >
          {{ newsletterStore.message }}
        </p>
        <p
          v-else-if="newsletterStore.error"
          class="mt-2 text-sm text-red-600 font-semibold transition-opacity duration-300"
        >
          {{ newsletterStore.error }}
        </p> -->
      </div>
    </div>
    <div
      class="text-center mt-8 pt-4 border-t dark:border-gray-500 border-gray-200 text-gray-500"
    >
      &copy; {{ new Date().getFullYear() }} Food Recipe. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
//import { useNewsletterStore } from "~/stores/newsletter";
// import { watch } from 'vue';

//const newsletterStore = useNewsletterStore();

//  Auto-reset success/error messages after a delay
// watch(() => newsletterStore.isSuccess, (newVal) => {
//   if (newVal) {
//     setTimeout(() => newsletterStore.resetState(), 5000);
//   }
// });
// watch(() => newsletterStore.error, (newVal) => {
//   if (newVal) {
//     setTimeout(() => newsletterStore.resetState(), 5000);
//   }
// });
</script>
