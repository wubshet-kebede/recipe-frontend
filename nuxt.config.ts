// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "vue3-carousel-nuxt",
    "@nuxtjs/apollo",
    "@vee-validate/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/color-mode",
    "nuxt-headlessui",
    "nuxt-lodash",
    "@pinia/nuxt",
    "@nuxt/fonts",
  ],

  apollo: {
    autoImports: true,
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    proxyCookies: true,
    clients: {
      authClient: "./apollo/authClient.js",
      publicClient: "./apollo/publicClient.js",
      anonymous: "./apollo/anonymousClient.js",
    },
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
  headlessui: {
    prefix: "Headless",
  },
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storage: "localStorage",
    storageKey: "nuxt-color-mode",
  },
  carousel: {
    prefix: "Custom",
  },
  components: true,

  fonts: {
    families: [
      {
        name: "Roboto",
        provider: "google", // fetch from Google Fonts
        weights: [100, 300, 400, 500, 700, 900], // pick what you need
      },
    ],
    defaults: {
      preload: true,
    },
  },
});
