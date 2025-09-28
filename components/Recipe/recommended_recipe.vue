<script setup>
import get_recommended_recipe from "@/query/recipes/get_recommended_recipe.gql";
import list from "~/composables/default/list";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "vue-router";
const cookie = useCookie("recipe_app_token");
const currentUserId = ref(null);
const client = ref("anonymous");
const role = ref("public");
const cartStore = useCartStore();
let userData = "";
if (cookie.value) {
  userData = jwtDecode(cookie.value);
  currentUserId.value = userData.id;
  console.log("User Data is blocked:", userData);
  client.value = "authClient";
  role.value = "user";
}
const { onResult, loading, refetch, onError } = list(get_recommended_recipe, {
  role: ref(role.value),
  client: ref(client.value),
});
const recipes = ref([]);
onResult((result) => {
  console.log("GraphQL result for recommende:", result);

  if (result?.data?.recipes) {
    recipes.value = result.data.recipes;
  } else {
    recipes.value = [];
  }
});
function proccedToBuy(recipe) {
  console.log("the recipe is ", recipe);
  cartStore.addToCart(recipe);
  router.push({
    name: "payment-checkout",
  });
}
</script>
<template>
  <div class="py-2">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 dark:text-secondary-lite">
      Recommended Recipes
    </h2>

    <p v-if="loading" class="text-center text-gray-600">
      Loading recommended recipes...
    </p>
    <div
      class="grid grid-cols-1 h-[50%] sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 p-4 md:mt-5"
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
          <div class="flex flex-row gap-x-2">
            <div>
              <Icon
                name="mdi:star-rate"
                class="px-2 text-2xl mt-1"
                :class="
                  recipe.ratings_aggregate?.aggregate?.avg?.rating > 0
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                "
              />
            </div>
            <div class="text-md font-normal px-2 mt-1">
              {{
                recipe.ratings_aggregate.aggregate.avg.rating?.toFixed(1) || 0
              }}
            </div>
          </div>
        </div>
        <div class="flex flex-row justify-between items-center px-6">
          <div class="flex flex-row">
            <p class="text-purple-600 font-bold">{{ recipe.price_etb }} ETB</p>
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

    <p v-if="!loading && !recipes" class="text-center text-gray-600 mt-8">
      No recommended recipes found.
    </p>
  </div>
</template>
