<script setup>
import {
  ChevronDownIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  ingredients: {
    type: [Array, Object, String],
    default: () => [],
  },
  categories: {
    type: [Array, Object, String],
    default: () => [],
  },
  users: {
    type: [Array, Object, String],
    default: () => [],
  },
  searchRecipe: String,
  selectedCategory: {
    type: String,
    default: null,
  },
  selectedUser: {
    type: String,
    default: null,
  },
  maxPreparationTime: {
    type: [Number, null],
    default: null,
  },
  selectedIngredients: {
    type: Array,
    default: () => [],
  },
});
console.log(
  "the value of the props is that ",
  props.ingredients,
  props.categories,
  props.users
);
const emit = defineEmits([
  "update:searchRecipe",
  "update:selectedCategory",
  "update:selectedCreator",
  "update:maxPreparationTime",
  "update:selectedIngredients",
]);
const isIngredientsOpen = ref(true);
const isCreatorsOpen = ref(true);
const isCategoriesOpen = ref(true);
const isPreparationTimeOpen = ref(true);

const ingredientSearchInput = ref("");
const userSearchInput = ref("");
const filteredIngredients = computed(() => {
  const searchIngredientLower = ingredientSearchInput.value.toLowerCase();
  return props.ingredients.filter(
    (ingredient) =>
      ingredient &&
      typeof ingredient.name === "string" &&
      ingredient.name.toLowerCase().includes(searchIngredientLower)
  );
});
const filteredCreators = computed(() => {
  const searchUserLower = userSearchInput.value.toLowerCase();
  return props.users.filter(
    (creator) =>
      creator &&
      typeof creator.first_name === "string" &&
      creator.first_name.toLowerCase().includes(searchUserLower)
  );
});
const getCreatorNameById = (id) => {
  const users = props.users.find((c) => c.id === id);
  return users ? users.first_name : "Unknown Creator";
};
const getCategoryNameById = (id) => {
  const category = props.categories.find((c) => c.id === id);
  return category ? category.name : "Unknown Category";
};
const toggleIngredient = (ingredient) => {
  const index = props.selectedIngredients.findIndex(
    (i) => i.id === ingredient.id
  );
  let newSelectedIngredients = [...props.selectedIngredients];

  if (index === -1) {
    newSelectedIngredients.push(ingredient);
  } else {
    newSelectedIngredients.splice(index, 1);
  }
  emit("update:selectedIngredients", newSelectedIngredients);
};
const removeIngredient = (id) => {
  const newSelectedIngredients = props.selectedIngredients.filter(
    (i) => i.id !== id
  );
  emit("update:selectedIngredients", newSelectedIngredients);
};
const toggleCategory = (id) => {
  if (props.selectedCategory === id) {
    emit("update:selectedCategory", null);
  } else {
    emit("update:selectedCategory", id);
  }
};
const removeCategory = () => {
  emit("update:selectedCategory", null);
};
const toggleCreator = (id) => {
  if (props.selectedUser === id) {
    emit("update:selectedCreator", null);
  } else {
    emit("update:selectedCreator", id);
  }
};
const removeCreator = () => {
  emit("update:selectedCreator", null);
};

const handleMaxPreparationTimeChange = (event) => {
  emit(
    "update:maxPreparationTime",
    event.target.value === "0" ? null : Number(event.target.value)
  );
};

const clearAllFilters = () => {
  emit("update:searchTerm", "");
  emit("update:selectedCategory", null);
  emit("update:selectedCreator", null);
  emit("update:maxPreparationTime", null);
  emit("update:selectedIngredients", []);
};
</script>
<template>
  <div
    class="w-full bg-white rounded-lg shadow-md p-4 dark:bg-gray-900 dark:shadow-md dark:shadow-gray-700/40"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-secondary-lite">
        Filters
      </h2>
      <button
        @click="clearAllFilters"
        class="text-sm text-blue-600 hover:text-blue-800"
      >
        Clear all
      </button>
    </div>

    <div class="mb-4 space-y-2">
      <div v-if="props.searchTerm" class="flex flex-wrap gap-2">
        <div
          class="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm dark:text-secondary-lite"
        >
          Search: "{{ props.searchTerm }}"
          <button
            @click="emit('update:searchTerm', '')"
            class="ml-1 text-gray-600 hover:text-gray-800"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="props.selectedCategory" class="flex flex-wrap gap-2">
        <div
          class="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm"
        >
          {{ getCategoryNameById(props.selectedCategory) }}
          <button
            @click="removeCategory"
            class="ml-1 text-yellow-600 hover:text-yellow-800"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="props.selectedCreator" class="flex flex-wrap gap-2">
        <div
          class="flex items-center bg-green-100 dark:bg-primaryLite text-green-800 px-2 py-1 rounded-full text-sm"
        >
          {{ getCreatorNameById(props.selectedCreator) }}
          <button
            @click="removeCreator"
            class="ml-1 text-green-600 hover:text-green-800"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        v-if="props.maxPreparationTime !== null"
        class="flex flex-wrap gap-2"
      >
        <div
          class="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
        >
          Max Time: {{ props.maxPreparationTime }} min
          <button
            @click="emit('update:maxPreparationTime', null)"
            class="ml-1 text-purple-600 hover:text-purple-800"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        v-if="props.selectedIngredients.length > 0"
        class="flex flex-wrap gap-2"
      >
        <div
          v-for="ingredient in props.selectedIngredients"
          :key="ingredient.id"
          class="flex items-center bg-blue-100 text-purple-800 px-2 py-1 rounded-full text-sm"
        >
          {{ ingredient.name }}
          <button
            @click="removeIngredient(ingredient.id)"
            class="ml-1 text-blue-600 hover:text-purple-800"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="relative">
        <input
          type="text"
          :value="props.searchRecipe"
          @input="emit('update:searchRecipe', $event.target.value)"
          placeholder="Search recipes..."
          class="w-full pl-8 pr-4 py-2 border dark:text-secondary-lite border-gray-300 dark:bg-gray-900 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <MagnifyingGlassIcon
          class="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
        />
      </div>
    </div>

    <div class="mb-6">
      <button
        @click="isCategoriesOpen = !isCategoriesOpen"
        class="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
      >
        <span class="dark:text-secondary-lite">Category</span>
        <ChevronDownIcon
          class="w-5 h-5 transition-transform"
          :class="{ 'transform rotate-180': isCategoriesOpen }"
        />
      </button>
      <div v-show="isCategoriesOpen" class="space-y-3 max-h-48 overflow-y-auto">
        <div
          v-for="category in props.categories"
          :key="category.id"
          @click="toggleCategory(category.id)"
          class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
          :class="{
            'bg-yellow-50 dark:bg-gray-400':
              props.selectedCategory === category.id,
          }"
        >
          <input
            type="checkbox"
            :checked="props.selectedCategory === category.id"
            class="mr-2 dark:bg-gray-900 dark:border-gray-600"
            @click.stop
          />
          <span class="text-sm text-gray-700 dark:text-secondary-lite">{{
            category.name
          }}</span>
        </div>
        <p
          v-if="props.categories.length === 0"
          class="text-sm text-gray-500 dark:text-secondary-lite"
        >
          No categories available.
        </p>
      </div>
    </div>

    <div class="mb-6">
      <button
        @click="isCreatorsOpen = !isCreatorsOpen"
        class="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
      >
        <span class="dark:text-secondary-lite">Creator</span>
        <ChevronDownIcon
          class="w-5 h-5 transition-transform"
          :class="{ 'transform rotate-180': isCreatorsOpen }"
        />
      </button>

      <div v-show="isCreatorsOpen" class="space-y-3">
        <div class="relative">
          <input
            v-model="userSearchInput"
            type="text"
            placeholder="Search creators..."
            class="w-full pl-8 pr-4 py-2 border dark:text-secondary-lite dark:bg-gray-900 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-purple-500"
          />
          <MagnifyingGlassIcon
            class="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
          />
        </div>

        <div class="max-h-48 overflow-y-auto">
          <div
            v-for="user in filteredCreators"
            :key="user.id"
            @click="toggleCreator(user.id)"
            class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-lg cursor-pointer"
            :class="{
              'bg-green-50': props.selectedUser === user.id,
            }"
          >
            <input
              type="checkbox"
              :checked="props.selectedUser === user.id"
              class="mr-2 dark:bg-gray-900 dark:border-gray-600"
              @click.stop
            />
            <span class="text-sm text-gray-700 dark:text-secondary-lite">{{
              user.first_name
            }}</span>
          </div>
          <p
            v-if="filteredCreators.length === 0"
            class="text-sm text-gray-500 dark:text-secondary-lite"
          >
            No creators found.
          </p>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <button
        @click="isIngredientsOpen = !isIngredientsOpen"
        class="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
      >
        <span class="dark:text-secondary-lite">Ingredients</span>
        <ChevronDownIcon
          class="w-5 h-5 transition-transform"
          :class="{ 'transform rotate-180': isIngredientsOpen }"
        />
      </button>

      <div v-show="isIngredientsOpen" class="space-y-3">
        <div class="relative">
          <input
            v-model="ingredientSearchInput"
            type="text"
            placeholder="Search ingredients..."
            class="w-full pl-8 pr-4 py-2 border dark:bg-gray-900 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <MagnifyingGlassIcon
            class="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
          />
        </div>

        <div class="max-h-48 overflow-y-auto">
          <div
            v-for="ingredient in filteredIngredients"
            :key="ingredient.id || ingredient.name"
            @click="toggleIngredient(ingredient)"
            class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-lg cursor-pointer"
            :class="{
              'bg-blue-50 dark:bg-gray-500': props.selectedIngredients.some(
                (i) => i.id === ingredient.id
              ),
            }"
          >
            <input
              type="checkbox"
              :checked="
                props.selectedIngredients.some((i) => i.id === ingredient.id)
              "
              class="mr-2 dark:bg-gray-900 dark:border-gray-600"
              @click.stop
            />
            <span class="text-sm text-gray-700 dark:text-secondary-lite">{{
              ingredient.name
            }}</span>
          </div>
          <p
            v-if="filteredIngredients.length === 0"
            class="text-sm text-gray-500 dark:text-secondary-lite"
          >
            No ingredients found.
          </p>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <button
        @click="isPreparationTimeOpen = !isPreparationTimeOpen"
        class="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
      >
        <span class="dark:text-secondary-lite">Max Preparation Time</span>
        <ChevronDownIcon
          class="w-5 h-5 transition-transform"
          :class="{ 'transform rotate-180': isPreparationTimeOpen }"
        />
      </button>
      <div v-show="isPreparationTimeOpen" class="space-y-3">
        <input
          type="range"
          min="0"
          max="180"
          step="5"
          :value="props.maxPreparationTime || 0"
          @input="handleMaxPreparationTimeChange"
          class="w-full h-2 dark:border-gray-600 dark:text-secondary-lite bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
        />
        <div
          class="flex justify-between text-sm text-gray-600 dark:text-secondary-lite"
        >
          <span>0 min</span>
          <span>{{ props.maxPreparationTime || 0 }} min</span>
          <span>180+ min</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #edf2f7;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #edf2f7;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}
</style>
