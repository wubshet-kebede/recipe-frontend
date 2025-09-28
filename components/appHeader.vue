<script setup>
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();
const router = useRouter();
const isLoggedIn = computed(() => auth.isLoggedIn);
console.log("isLoggedIn value:", isLoggedIn.value);
const openProfile = ref(false);
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
  {
    id: "4",
    icon: "mdi:cart-outline",
    to: "/",
  },
  {
    id: "5",
    icon: "gg:profile",
    to: "/",
  },
]);
const search = ref("");
const isMenuOpen = ref(false);
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function handleLogout() {
  auth.logout();
  router.push("/Login");
}
function useVar() {
  console.log("the function is called ");
  openProfile.value = true;
}
</script>
<template>
  <ModalsProfile v-model="openProfile" />
  <section
    class="flex justify-between bg-white md:shadow-lg shadow-lg lg:shadow-lg sm:shadow-lg xl:shadow-lg sticky top-0 overflow-hidden z-50 backdrop-blur-2xl"
  >
    <div
      class="flex flex-row items-center mx-2 md:mx-0 w-full gap-x-2 md:gap-x-0 justify-between"
    >
      <div
        class="md:px-2 md:py-2 md:mt-2 mt-2 bg-white flex flex-row items-center"
      >
        <NuxtLink to="/">
          <img
            width="55"
            height="55"
            alt="recipeLogo"
            src="/logo/recipeLogo.png"
            class="md:px-1 md:py-2 mt-2"
          />
        </NuxtLink>

        <span
          class="px-3 md:py-5 py-3 font-bold md:text-2xl text-xl text-green-600"
          >FoodRecipe</span
        >
      </div>
      <div
        class="mt- flex-row md:flex-1 border border-gray-400 rounded-full w-1/2 md:mx-10 mb-2 items-center hidden md:flex"
      >
        <!-- <button @click="performSearch">
          <icon
            name="iconamoon:search-fill"
            class="text-lg md:text-2xl text-gray-500 md:px-10 md:py-2 mt-4 mr-20 md:mr-0"
          />
        </button> -->
        <input
          type="text"
          v-model="search"
          placeholder="Search for recipes"
          class="focus:outline-none rounded-full md:px-2 px-1 md:pl-10 md:flex-1 pl-2"
        />
        <!-- <button @click="performSearch">
          <icon
            name="iconamoon:search-fill"
            class="text-lg md:text-2xl text-gray-500 md:px-10 md:py-2 mt-4 mr-20 md:mr-0"
          />
        </button> -->
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

    <nav class="md:flex md:flex-row mt-8 hidden">
      <ul v-for="item in items" :key="item.id" class="flex px-3">
        <NuxtLink :to="item.to">
          <li v-if="item.name" class="px-2">
            {{ item.name }}
          </li>
          <li v-else class="px-2">
            <div v-if="item.id === '4'">
              <Icon :name="item.icon" class="text-2xl font-bold" />
            </div>
            <div v-else class="group relative flex flex-col">
              <Icon :name="item.icon" class="text-2xl font-bold" />
              <ul
                v-if="!isLoggedIn"
                class="absolute top-full flex flex-row -left-16 -ml-16 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <li>
                  <NuxtLink
                    to="/login"
                    class="block py-1 px-4 hover:bg-gray-100 rounded-md font-bold hover:text-green-300"
                    >Login</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    to="/signup"
                    class="block py-1 px-4 hover:bg-gray-100 rounded-md font-bold hover:text-green-300"
                    >Signup</NuxtLink
                  >
                </li>
              </ul>
              <ul
                v-else
                class="absolute top-full flex flex-row -left-16 -ml-16 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <li>
                  <button
                    @click="useVar"
                    class="block py-1 px-4 hover:bg-gray-100 rounded-md font-bold hover:text-green-300"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    @click="handleLogout"
                    class="w-full text-left block py-1 px-4 hover:bg-gray-100 rounded-md font-bold hover:text-green-300"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </NuxtLink>
      </ul>
    </nav>
  </section>
  <nav
    v-if="isMenuOpen"
    class="fixed top-0 right-0 bg-white z-50 h-screen w-1/2 backdrop-blur-lg"
  >
    <div class="flex flex-col space-y-10 relative">
      <!-- Close Button -->

      <div class="absolute top-4 -left-9 -mt-4">
        <button type="button" @click="isMenuOpen = false">
          <icon name="material-symbols:close" class="text-gray-500 text-3xl" />
        </button>
      </div>

      <!-- Navigation Content -->
      <div class="flex flex-col space-y-1">
        <ul
          v-for="item in items"
          :key="item.id"
          class="flex flex-col items-center"
        >
          <NuxtLink :to="item.to" class="py-2 text-md">
            <li v-if="item.name">{{ item.name }}</li>
            <li v-else>
              <icon :name="item.icon" class="text-2xl font-bold" />
            </li>
          </NuxtLink>
        </ul>
      </div>
    </div>
  </nav>
</template>
