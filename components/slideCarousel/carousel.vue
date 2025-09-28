<script setup>
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import fetch_trending_recipe from "@/query/recipes/fetch_trending_recipe.gql";
import list from "~/composables/default/list";
import { jwtDecode } from "jwt-decode";
const cookie = useCookie("recipe_app_token");
const userData = ref(null);
const client = ref("anonymous");
const role = ref("public");

// if (cookie.value) {
//   try {
//     userData.value = jwtDecode(cookie.value).metadata;
//     console.log("User Data is:", userData.value);
//     client.value = "authClient";
//     role.value = "user";
//   } catch (err) {
//     console.error("JWT decode failed", err);
//   }
// }
const recipes = ref([]);
const { onResult, loading, refetch, onError } = list(fetch_trending_recipe, {
  role: ref(role.value),
  client: ref(client.value),
});
onResult((result) => {
  console.log("GraphQL result:", result);

  if (result?.data?.trending_recipes) {
    recipes.value = result.data.trending_recipes;
  } else {
    recipes.value = [];
  }
  console.log("the vlaue of the recipes is that", recipes.value);
});
const router = useRouter();

function goToRecipeDetail(recipeId) {
  router.push({
    name: "recipe-id",
    params: { id: recipeId },
  });
}
</script>
<template>
  <div
    class="relative w-auto h-80 rounded-lg overflow-hidden shadow-md mt-8 mx-10"
  >
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-20"
    >
      <p class="text-gray-600">Loading trending recipes...</p>
    </div>

    <div
      v-else-if="error"
      class="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 text-red-700 z-20"
    >
      <p>Error loading recipes: {{ error.message }}</p>
    </div>

    <div v-else-if="recipes" class="absolute inset-0">
      <CustomCarousel
        :items-to-show="1"
        :wrap-around="true"
        class="h-full w-full"
        :mouse-drag="true"
        :touch-drag="true"
      >
        <Slide v-for="recipe in recipes" :key="recipe.id" class="h-full w-full">
          <div
            class="relative w-full h-full cursor-pointer"
            @click="goToRecipeDetail(recipe?.id)"
          >
            <div
              v-if="recipe"
              class="absolute inset-0 bg-center bg-cover rounded-3xl"
              :style="`background-image: url('${recipe?.featured_image_url}')`"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"
              ></div>
            </div>

            <div
              class="absolute inset-y-0 left-0 w-full z-10 flex flex-col justify-center pl-12 pr-4 max-w-xl text-white"
            >
              <div>
                <span class="text-orange-400 text-lg font-semibold mb-3 block"
                  >Trending now</span
                >
                <h1 class="text-4xl font-bold mb-4 leading-tight">
                  {{ recipe?.title }}
                </h1>
                <p class="text-xl font-light">By {{ recipe?.first_name }}</p>
              </div>
            </div>
          </div>
        </Slide>

        <template #addons>
          <CustomNavigation />
          <CustomPagination />
        </template>
      </CustomCarousel>
    </div>

    <div
      v-else
      class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75"
    >
      <p class="text-gray-600">No trending recipes available.</p>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  height: 100%;
}

.carousel__viewport {
  height: 100%;
}

.carousel__track {
  height: 100%;
}

.carousel__slide {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  width: 40px;
  height: 40px;
  border-radius: 50%;

  /* Visuals */
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel__prev {
  left: 20px;
}

.carousel__next {
  right: 20px;
}

.carousel__prev:hover,
.carousel__next:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.carousel__pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  z-index: 30;
}

.carousel__pagination-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.carousel__pagination-button::after {
  content: "";
  display: block;
  background-color: rgba(255, 255, 255, 0.5);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}
.carousel__pagination-button--active::after {
  background-color: white;
}
.hero-container .absolute.inset-0.bg-center.bg-cover {
  background-size: contain;
  background-color: #333;
}
</style>
