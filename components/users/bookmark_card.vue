<script setup>
import get_bookmarked_recipe from "@/query/bookmarks/get_bookmarked_recipe.gql";
import { jwtDecode } from "jwt-decode";
import list from "~/composables/default/list";
import mutate_with_role from "~/composables/default/mutate_with_role";
import Notify from "@/use/notify";
const { notify } = Notify();
const role = ref("user");
const client = ref("authClient");
const users = ref({});
const cookie = useCookie("recipe_app_token");
const currentUserId = ref(null);
let userData = "";
if (cookie.value) {
  userData = jwtDecode(cookie.value);
  currentUserId.value = userData.id;
  console.log("User Data is blocked:", userData);
  client.value = "authClient";
  role.value = "user";
}
const recipes = ref([]);
const { onResult, loading, refetch, onError } = list(get_bookmarked_recipe, {
  id: ref(currentUserId.value),
  role: ref(role.value),
  client: ref(client.value),
});
onResult((result) => {
  console.log("GraphQL result:", result);

  if (result?.data?.bookmarks) {
    recipes.value = result.data.bookmarks.map((b) => b.recipe);
  } else {
    recipes.value = [];
  }
});
</script>
<template>
  <div
    class="flex flex-col lg:flex-row gap-8 w-full mt-8 container mx-auto px-4 sm:px-6 lg:px-8"
  >
    <!-- <aside
      class="w-full lg:w-[300px] p-4 bg-white rounded-lg shadow-md h-fit shrink-0 mb-8 lg:mb-0 mt-16"
    >
      <SideBar
        :ingredients="ingredients"
        :categories="categories"
        :users="users"
        v-model:searchRecipe="searchRecipe"
        v-model:selectedCategory="selectedCategory"
        v-model:selectedUser="selectedUser"
        v-model:maxPreparationTime="maxPreparationTime"
        v-model:selectedIngredients="selectedIngredients"
      />
    </aside> -->

    <div
      class="grid grid-cols-1 h-[50%] sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 p-4 mt-10"
    >
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="flex flex-col bg-white rounded-lg shadow-md p-4 gap-y-5"
      >
        <div class="w-full relative">
          <NuxtLink :to="{ name: 'recipe-id', params: { id: recipe.id } }">
            <img
              alt="Recipe image"
              height="25"
              width="25"
              :src="recipe.recipe_images[0].image_url"
              class="w-full h-80 object-cover rounded-lg"
            />
            <div class="absolute top-2 right-2 flex space-x-2">
              <button
                @click.stop.prevent="toggleBookmark"
                class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                :class="{ 'text-blue-600': isBookmarked }"
              >
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
                  ></path>
                </svg>
              </button>
            </div>
          </NuxtLink>
        </div>
        <div class="px-6 flex flex-col gap-y-2">
          <h1
            class="text-xl font-bold text-gray-800 mb-2 truncate group-hover:text-red-600 transition-colors"
          >
            {{ recipe.title }}
          </h1>
          <p class="text-sm line-clamp-3">{{ recipe.description }}</p>
        </div>
        <div class="flex px-6 justify-between items-center">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">
              {{ recipe.preparation_time_minutes }} mins
            </span>
            <span class="text-gray-300">|</span>
          </div>
          <div class="gap-x-2">
            <icon
              name="streamline-ultimate-color:rating-star"
              class="px-2 text-sm"
            />
            <span class="text-md font-bold px-2">5.0</span>
          </div>
        </div>
        <div class="flex flex-row justify-between items-center px-6">
          <div class="flex flex-row">
            <p class="text-purple-600">{{ recipe.price_etb }}</p>
          </div>
          <div class="flex flex-row items-center">
            <button
              @click="proccedToBuy(recipe)"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition-duration-300"
            >
              <span class="">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
