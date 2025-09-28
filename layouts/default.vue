<script setup>
import AppFooter from "../components/appFooter.vue";
import { Switch } from "@headlessui/vue";
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();
const router = useRouter();
const isLoggedIn = computed(() => auth.isLoggedIn);
console.log("isLoggedIn value:", isLoggedIn.value);
const openProfile = ref(false);

import fetch_user_detail from "@/query/user/fetch_user_detail.gql";
import list from "~/composables/default/list";
import { useSearchStore } from "@/stores/search";
const searchStore = useSearchStore();
const isDark = ref(false);
watch(isDark, (val) => {
  document.documentElement.classList.toggle("dark", val);
  if (localStorage) {
    localStorage.setItem("nuxt-color-mode", val ? "dark" : "light");
  }
});
onMounted(() => {
  const stored = localStorage.getItem("nuxt-color-mode");
  isDark.value = stored === "dark";
  document.documentElement.classList.toggle("dark", isDark.value);
});
console.log("isLoggedIn value:", isLoggedIn.value);
const userId = computed(() => auth.userId);
console.log("the value of user id is that", userId.value);
const client = ref("authClient");
const role = ref("user");
function handleLogout() {
  auth.logout();
  router.push("/Login");
}
function openProfileModal() {
  openProfile.value = true;
}

const openPopover = ref(false);

const users = ref({});
const { onResult, loading, refetch, onError } = list(fetch_user_detail, {
  id: userId,
  role: ref(role.value),
  client: ref(client.value),
});
onResult((result) => {
  console.log("GraphQL result:", result);

  if (result?.data?.users) {
    users.value = result.data.users[0];
  } else {
    users.value = [];
  }
  console.log("the value of this logged in user one is that ", users.value);
});
const userInitials = computed(() => {
  if (!users.profile_images) {
    const firstName = users.value.first_name;
    const lastName = users.value.last_name;
    const username = users.value.username;
    // console.log("the first name the last name the middle name is that", firstName, lastName)
    let initials = "";

    if (firstName && typeof firstName === "string" && firstName.length > 0) {
      initials += firstName.charAt(0);
    }

    if (lastName && typeof lastName === "string" && lastName.length > 0) {
      initials += lastName.charAt(0);
    }
    if (
      initials.length === 0 &&
      username &&
      typeof username === "string" &&
      username.length > 0
    ) {
      initials += username.charAt(0);
      if (username.length > 1) {
        initials += username.charAt(1);
      }
    }
    if (initials.length === 0) {
      console.log("  Computed - Initials fallback: 'U'");
      return "U";
    }

    console.log("  Computed - Generated initials:", initials.toUpperCase());
    return initials.toUpperCase();
  }
});
const items = ref([
  {
    id: "1",
    name: "Home",
    to: "/",
  },
  {
    id: "2",
    name: "About",
    to: "/About",
  },
  {
    id: "3",
    name: "Explore",
    to: "/explore",
  },
]);
const search = ref("");
const isMenuOpen = ref(false);
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

// function handleLogout() {
//   auth.logout();
//   router.push("/Login");
// }
function userNav(val) {
  if (val == "login") {
    router.push({ path: "/login" });
  } else if (val == "signup") {
    router.push({ path: "/signup" });
  }
}
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
<template>
  <div
    v-if="isMenuOpen"
    class="fixed inset-0 bg-black bg-opacity-40 z-40"
    @click="isMenuOpen = false"
  ></div>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <ProfileDetail v-model="openProfile"> </ProfileDetail>
    <HNotification />
    <section
      class="flex justify-between dark:bg-gray-900 bg-white dark:shadow-lg dark:shadow-gray-700/40 md:shadow-lg shadow-lg lg:shadow-lg sm:shadow-lg xl:shadow-lg sticky top-0 overflow-hidden z-50 backdrop-blur-2xl"
    >
      <div
        class="flex flex-row items-center mx-2 md:mx-0 w-full gap-x-2 md:gap-x-0 justify-between"
      >
        <div
          class="md:px-2 md:py-2 md:mt-2 mt-2 mb-2 bg-white dark:bg-gray-900 flex flex-row items-center"
        >
          <NuxtLink to="/">
            <img
              width="55"
              height="55"
              alt="recipeLogo"
              src="/logo/food reccipe logo.jpg"
              class="md:px-1 md:py-2 mt-2 rounded-full object-cover"
            />
          </NuxtLink>

          <span
            class="px-3 md:py-5 py-3 font-bold md:text-2xl text-xl text-green-600"
            >FoodRecipe</span
          >
        </div>

        <div
          class="mt-2 flex-row md:flex-1 border border-gray-100 rounded-full w-1/2 md:mx-10 mb-2 dark:border-gray-800 items-center hidden md:flex bg-gray-50 hover:shadow-sm focus-within:shadow-md transition-shadow duration-200"
        >
          <input
            type="text"
            v-model="searchStore.searchQuery"
            placeholder="Search for recipes"
            class="rounded-full md:px-4 px-2 py-4 dark:text-secondary-lite dark:bg-gray-700 md:flex-1 pl-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
          />
        </div>
        <div class="flex items-center px-4 overflow-hidden mt-2 ml-3 md:hidden">
          <Switch
            v-model="isDark"
            class="relative inline-flex h-6 w-[88px] items-center rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer transition-colors"
            role="switch"
          >
            <span
              class="absolute left-3 text-sm font-bold leading-4 text-white"
              v-show="!isDark"
            >
              Light
            </span>
            <span
              class="flex w-full items-center justify-between transition-transform duration-500"
              :class="isDark ? 'translate-x-0' : 'translate-x-[62px]'"
            >
              <div class="h-full rounded-full">
                <svg
                  v-show="isDark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="h-6 fill-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <svg
                  v-show="!isDark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="h-6 fill-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </span>
            <span
              class="absolute right-4 text-sm font-bold leading-4 text-black delay-500 duration-100 ease-in-out"
              v-show="isDark"
            >
              Dark
            </span>
          </Switch>
        </div>
        <div class="md:hidden flex items-center mt-5 ml-2 mr-2 justify-end">
          <button
            type="button"
            @click="toggleMenu"
            class="items-center"
            aria-label="Toggle menu"
          >
            <span class="sr-only">Open menu</span>
            <Icon
              name="radix-icons:dropdown-menu"
              class="text-gray-500 text-3xl"
            />
          </button>
        </div>
      </div>

      <nav class="md:flex md:flex-row mt-2 hidden items-center z-100">
        <div class="flex flex-row gap-x-2 dark:text-secondary-lite">
          <ul v-for="item in items" :key="item.id" class="flex px-3">
            <NuxtLink :to="item.to">
              <li class="px-2">
                {{ item.name }}
              </li>
            </NuxtLink>
          </ul>
        </div>
        <div class="flex items-center px-4 overflow-hidden">
          <Switch
            v-model="isDark"
            class="relative inline-flex h-6 w-[88px] items-center rounded-full bg-gray-300 cursor-pointer transition-colors"
            role="switch"
          >
            <span
              class="absolute left-3 text-sm font-bold leading-4 text-white"
              v-show="!isDark"
            >
              Light
            </span>
            <span
              class="flex w-full items-center justify-between transition-transform duration-500"
              :class="isDark ? 'translate-x-0' : 'translate-x-[62px]'"
            >
              <div class="h-full rounded-full">
                <svg
                  v-show="isDark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="h-6 fill-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <svg
                  v-show="!isDark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="h-6 fill-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </span>
            <span
              class="absolute right-4 text-sm font-bold leading-4 text-black delay-500 duration-100 ease-in-out"
              v-show="isDark"
            >
              Dark
            </span>
          </Switch>
        </div>
        <div v-if="!isLoggedIn" class="flex gap-x-3 mr-2">
          <div>
            <button
              @click="userNav('login')"
              class="border py-2 px-5 cursor-pointer dark:text-secondary-lite border-purple-500 text-purple-900 font-bold text-nowrap rounded"
            >
              Log in
            </button>
          </div>
          <div>
            <button
              @click="userNav('signup')"
              class="border py-2 px-5 cursor-pointer border-purple-500 text-white font-bold text-nowrap rounded bg-purple-900"
            >
              Sign up
            </button>
          </div>
        </div>
        <div v-else class="flex gap-x-3 mr-2">
          <div>
            <button
              @click="openProfileModal"
              class="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md ring-2 ring-white cursor-pointer transform hover:scale-110 transition-transform duration-200 overflow-hidden"
            >
              <img
                v-if="users?.profile_images?.[0]?.image_url"
                :src="users.profile_images[0].image_url"
                :alt="users.first_name + ' ' + users.last_name"
                class="w-16 h-16 rounded-full object-cover"
              />
              <div
                v-else
                class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
              >
                {{ userInitials }}
              </div>
            </button>
          </div>
        </div>
      </nav>
    </section>

    <nav
      v-if="isMenuOpen"
      class="fixed top-0 right-0 bg-white z-50 h-screen w-1/2 backdrop-blur-lg"
    >
      <div class="flex flex-col space-y-2 relative">
        <!-- Close Button -->

        <div class="absolute top-4 -left-9 -mt-4">
          <button type="button" @click="isMenuOpen = false">
            <icon
              name="material-symbols:close"
              class="text-gray-500 text-3xl"
            />
          </button>
        </div>

        <!-- Navigation Content -->
        <!-- Navigation Content -->
        <div class="flex flex-col gap-y-2">
          <div v-if="isLoggedIn" class="flex flex-col gap-y-2 items-center">
            <button
              @click="
                openProfileModal();
                isMenuOpen = false;
              "
              class="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md ring-2 ring-white cursor-pointer transform hover:scale-110 transition-transform duration-200 overflow-hidden"
            >
              <img
                v-if="users?.profile_images?.[0]?.image_url"
                :src="users.profile_images[0].image_url"
                :alt="users.first_name + ' ' + users.last_name"
                class="w-16 h-16 rounded-full object-cover"
              />
              <div
                v-else
                class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
              >
                {{ userInitials }}
              </div>
            </button>
            <div class="flex flex-col items-center">
              <h1 class="text-lg font-semibold">
                {{ users.first_name }} {{ users.last_name }}
              </h1>
              <p class="text-sm text-gray-500">{{ users.email }}</p>
            </div>
          </div>
          <hr />
        </div>
        <div class="flex flex-col gap-y-1">
          <div class="flex flex-col space-y-1">
            <ul
              v-for="item in items"
              :key="item.id"
              class="flex flex-col items-center"
            >
              <NuxtLink
                :to="item.to"
                @click.native="closeMenu"
                class="py-2 text-md"
              >
                <li v-if="item.name">{{ item.name }}</li>
              </NuxtLink>
            </ul>
          </div>

          <div v-if="!isLoggedIn" class="flex flex-col gap-y-3 items-center">
            <div>
              <button
                @click="userNav('login')"
                class="border py-2 px-5 cursor-pointer border-purple-500 text-purple-900 font-bold text-nowrap rounded"
              >
                Log in
              </button>
            </div>
            <div>
              <button
                @click="userNav('signup')"
                class="border py-2 px-5 cursor-pointer border-purple-500 text-white font-bold text-nowrap rounded bg-purple-900"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
