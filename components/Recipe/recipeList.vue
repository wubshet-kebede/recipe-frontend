<script setup>
import SideBar from "../Side/SideBar.vue";
import fetch_recipe from "@/query/recipes/fetch_recipe.gql";
import list from "~/composables/default/list";
import user_bookmarked_recipe from "@/query/bookmarks/user_bookmarked_recipe.gql";
import { jwtDecode } from "jwt-decode";
import Notify from "@/use/notify";
import { parse } from "@/use/errorParser";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();
const cookie = useCookie("recipe_app_token");

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isLoggedIn);
const { notify } = Notify();
const router = useRouter();
console.log("my cookies is that", cookie);
let userData = "";
const client = ref("anonymous");
const searchRecipe = ref("");
const selectedCategory = ref(null);
const selectedUser = ref(null);
const maxPreparationTime = ref(null);
const selectedIngredients = ref([]);
const cartStore = useCartStore();
console.log("teh value of the stored cart is that", cartStore.getCartItems);
const where = computed(() => {
  const w = {};
  if (searchStore.searchQuery) {
    w._or = [
      { title: { _ilike: `%${searchStore.searchQuery}%` } },
      { description: { _ilike: `%${searchStore.searchQuery}%` } },
    ];
  }
  if (searchRecipe.value) {
    w._or = [
      { title: { _ilike: `%${searchRecipe.value}%` } },
      { description: { _ilike: `%${searchRecipe.value}%` } },
    ];
  }
  if (selectedCategory.value) w.category_id = { _eq: selectedCategory.value };
  if (selectedUser.value) w.user_id = { _eq: selectedUser.value };
  if (maxPreparationTime.value != null) {
    w.preparation_time_minutes = { _lte: maxPreparationTime.value };
  }
  if (selectedIngredients.value?.length) {
    w.ingredients = {
      id: {
        _in: selectedIngredients.value.map((i) => i.id),
      },
    };
  }

  return w;
});
const currentUserId = ref(null);
watch(searchRecipe, (val) => {
  console.log("Search value updated:", val);
});

const role = ref("public");
if (cookie.value) {
  userData = jwtDecode(cookie.value);
  currentUserId.value = userData.id;
  console.log("User Data is blocked:", userData);
  client.value = "authClient";
  role.value = "user";
}
console.log(
  "the value of the role here is this one but why it doesn't work for another one",
  role.value
);
const recipes = ref([]);
const { onResult, loading, refetch, onError } = list(fetch_recipe, {
  role: ref(role.value),
  client: ref(client.value),
  filter: where,
});
onResult((result) => {
  console.log("GraphQL result:", result);

  if (result?.data?.recipes) {
    recipes.value = result.data.recipes;
  } else {
    recipes.value = [];
  }
});
console.log("the value is like this one ", recipes.value);
const ingredients = computed(() => {
  return recipes.value.flatMap((recipe) => recipe.ingredients || []);
});

const categories = computed(() => {
  return recipes.value.map((recipe) => recipe.category).filter(Boolean);
});

const users = computed(() => {
  return recipes.value.map((recipe) => recipe.user).filter(Boolean);
});
console.log(
  "the value i extract is liek this please see it carefully",
  ingredients.value,
  categories.value,
  users.value
);
onError((error) => {
  console.log(error);
  const parsed = parse(error);
  if (parsed && parsed.type) {
    if (parsed.type == "error" && parsed.description) {
      notify({
        title: "Error",
        description: `${parsed.description}`,
        cardClass: "bg-red-100 mt-14",
        icon: "bx:error-alt",
        iconClass: "text-red-600",
        borderClass: "border-l-8 border-red-600 rounded-l-lg",
      });
    }
  }
});
function proccedToBuy(recipe) {
  if (!isAuthenticated.value) {
    notify({
      title: "Loggen In First!",
      description: "Please Login first to buy recipes",
      cardClass: "bg-green-200 mt-14",
      icon: "line-md:confirm-circle",
      iconClass: "text-green-400",
      borderClass: "border-l-8 border-green-300 rounded-l-lg",
    });
    router.push("/login");
    return;
  }
  console.log("the recipe is ", recipe);
  cartStore.addToCart(recipe);
  router.push({
    name: "payment-checkout",
  });
}
const isBookmarked = ref("false");
const {
  onResult: bookmarkedRecipe,
  bookmarkloading,
  bookmarkrefetch,
  onbookmarkError,
} = list(user_bookmarked_recipe, {
  id: ref(currentUserId.value),
  role: ref(role.value),
  client: ref(client.value),
});
bookmarkedRecipe((result) => {
  console.log("GraphQL result bookmark bro:", result);

  if (result.data?.bookmarks) {
    isBookmarked.value = result.data.bookmarks.some(
      (b) => b.user_id === currentUserId.value
    );
  }
});
</script>
<template>
  <div
    class="flex flex-col lg:flex-row gap-8 w-full mt-8 container mx-auto px-4 sm:px-6 lg:px-8"
  >
    <aside
      class="w-full lg:w-[300px] p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md h-fit shrink-0 mb-8 lg:mb-0 md:mt-16"
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
    </aside>
    <div class="flex flex-col gap-y-5">
      <div class="flex flex-col gap-y-2">
        <div
          class="grid grid-cols-1 h-[50%] sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 p-4 md:mt-10 dark:bg-gray-900"
        >
          <div
            v-for="recipe in recipes"
            :key="recipe.id"
            class="flex flex-col bg-white rounded-lg shadow-md p-4 gap-y-5 dark:bg-gray-900 dark:shadow-lg dark:shadow-gray-700/40"
          >
            <div class="w-full relative">
              <NuxtLink :to="{ name: 'recipe-id', params: { id: recipe.id } }">
                <div
                  v-if="recipe.recipe_images && recipe.recipe_images.length > 0"
                >
                  <img
                    alt="Recipe image"
                    height="25"
                    width="25"
                    :src="recipe.recipe_images[0].image_url"
                    class="w-full h-80 object-cover rounded-lg"
                  />
                </div>
                <div class="absolute top-2 right-2 flex space-x-2">
                  <!-- {{ isBookmarked }} -->
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
            <div class="px-6 flex flex-col gap-y-2 dark:text-secondary-lite">
              <h1
                class="text-xl font-bold text-gray-800 mb-2 truncate group-hover:text-red-600 transition-colors dark:text-secondary-lite"
              >
                {{ recipe.title }}
              </h1>
              <p class="text-sm line-clamp-3">{{ recipe.description }}</p>
            </div>
            <div class="flex px-6 justify-between items-center">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 dark:text-secondary-lite">
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
                <div
                  class="text-md font-normal px-2 mt-1 dark:text-secondary-lite"
                >
                  {{
                    recipe.ratings_aggregate.aggregate.avg.rating?.toFixed(1) ||
                    0
                  }}
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-between items-center px-6">
              <div class="flex flex-row">
                <p class="text-purple-600 font-bold">
                  {{ recipe.price_etb }} ETB
                </p>
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
      <RecipeRecommendedRecipe />
    </div>
  </div>
</template>
