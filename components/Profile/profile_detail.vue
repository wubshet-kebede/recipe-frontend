<script setup>
import { useAuthStore } from "@/stores/auth";
import fetch_user_detail from "@/query/user/fetch_user_detail.gql";
import recipe_count from "@/query/recipes/recipe_count.gql";
import bookmark_count from "@/query/bookmarks/bookmark_count.gql";
import comment_count from "@/query/comment/comment_count.gql";
import list from "~/composables/default/list";
import { useCartStore } from "@/stores/cart";
const cartStore = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const isLoggedIn = computed(() => auth.isLoggedIn);
console.log("isLoggedIn value:", isLoggedIn.value);
const userId = computed(() => auth.userId);
console.log("the value of user id is that", userId.value);
const client = ref("authClient");
const role = ref("user");

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:modelValue"]);
const openModal = computed({
  get() {
    return props.modelValue;
  },

  set(newVal) {
    emits("update:modelValue", newVal);
  },
});
const closeModal = () => {
  openModal.value = false;
};

const handleNavigationClick = () => {
  closeModal();
};
function handleLogout() {
  auth.logout();
  router.push("/Login");
}
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
const recipeCount = ref(null);
const {
  onResult: getuserRecipes,
  loading: recipeloading,
  refetch: recipeRefetch,
  onError: recipeonError,
} = list(recipe_count, {
  id: userId,
  role: ref(role.value),
  client: ref(client.value),
});
getuserRecipes((result) => {
  if (result.data && result.data.recipes_aggregate) {
    recipeCount.value = result.data.recipes_aggregate.aggregate.count;
    console.log("Total recipes:", recipeCount.value);
  } else {
    console.log("No data found");
  }
});
const bookmarkCount = ref(null);
const {
  onResult: getuserbookmarks,
  loading: bookmarkloading,
  refetch: bookmarkRefetch,
  onError: bookmarkonError,
} = list(bookmark_count, {
  id: userId,
  role: ref(role.value),
  client: ref(client.value),
});
getuserbookmarks((result) => {
  if (result.data && result.data.bookmarks_aggregate) {
    bookmarkCount.value = result.data.bookmarks_aggregate.aggregate.count;
    console.log("Total recipes:", bookmarkCount.value);
  } else {
    console.log("No data found");
  }
});
const commentCount = ref(null);
const {
  onResult: getusercomments,
  loading: commentloading,
  refetch: commentRefetch,
  onError: commentonError,
} = list(comment_count, {
  id: userId,
  role: ref(role.value),
  client: ref(client.value),
});
getusercomments((result) => {
  if (result.data && result.data.comments_aggregate) {
    commentCount.value = result.data.comments_aggregate.aggregate.count;
    console.log("Total recipes:", commentCount.value);
  } else {
    console.log("No data found");
  }
});
</script>
<template>
  <ModalsModal v-model="openModal" wrapperClass="max-w-xs">
    <template #Heading>
      <div class="flex gap-x-2">
        <button
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
        <div class="flex flex-col">
          <h1 class="text-lg font-semibold dark:text-secondary-lite">
            {{ users.first_name }} {{ users.last_name }}
          </h1>
          <p class="text-sm text-gray-500">{{ users.email }}</p>
        </div>
      </div>
      <div class="mt-4">
        <hr />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-y-2 mt-8">
        <NuxtLink
          to="/my_recipe"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 dark:hover:bg-gray-500 py-2 rounded-md gap-x-2 dark:text-secondary-lite"
        >
          <Icon name="emojione-v1:pot-of-food" class="px-2 text-lg py-2" />
          My Recipe
          <span
            v-if="recipeCount > 0"
            class="ml-1 px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full dark:text-secondary-lite"
          >
            {{ recipeCount }}
          </span>
        </NuxtLink>
        <NuxtLink
          to="/profile/edit_profile"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 dark:hover:bg-gray-500 gap-x-2 py-2 rounded-md dark:text-secondary-lite"
        >
          <Icon
            name="iconamoon:edit-bold"
            class="text-lg py-2 px-2 text-primary"
          />
          Edit Profile
        </NuxtLink>
        <NuxtLink
          to="/recipe/create_recipe"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 gap-x-2 py-2 dark:hover:bg-gray-500 rounded-md dark:text-secondary-lite"
        >
          <Icon
            name="ic:baseline-create"
            class="text-lg py-2 px-2 text-primary"
          />
          Create Recipe
        </NuxtLink>
        <!-- <NuxtLink
          to="/recipe/create_recipe"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 gap-x-2 py-2 rounded-md"
        >
          <Icon
            name="iconamoon:edit-bold"
            class="text-lg py-2 px-2 text-primary"
          />
          Edit Recipe
        </NuxtLink> -->
        <hr />
        <NuxtLink
          to="/payment/checkout"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 gap-x-2 py-2 dark:hover:bg-gray-500 rounded-md dark:text-secondary-lite"
        >
          <Icon name="raphael:cart" class="text-lg py-2 px-2 text-primary" />
          My cart
          <span
            v-if="recipeCount > 0"
            class="ml-1 px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full dark:text-secondary-lite"
          >
            {{ cartStore.cartItems.length }}
          </span>
        </NuxtLink>
        <NuxtLink
          to="/"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 dark:hover:bg-gray-500 gap-x-2 py-2 rounded-md dark:text-secondary-lite"
        >
          <Icon
            name="streamline-ultimate:cash-payment-bill-bold"
            class="text-lg py-2 px-2 text-primary dark:text-secondary-lite"
          />
          Payment Methods
        </NuxtLink>
        <hr />
        <NuxtLink
          to="/"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 dark:hover:bg-gray-500 gap-x-2 py-2 rounded-md dark:text-secondary-lite"
        >
          <Icon
            name="basil:notification-on-outline"
            class="text-lg py-2 px-2 text-primary dark:text-secondary-lite"
          />
          Notification
        </NuxtLink>
        <NuxtLink
          to="/"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 dark:hover:bg-gray-500 gap-x-2 py-2 rounded-md dark:text-secondary-lite"
        >
          <Icon
            name="mingcute:message-2-fill"
            class="text-lg py-2 px-2 text-primary dark:text-secondary-lite"
          />
          Message
        </NuxtLink>
        <hr />
        <NuxtLink
          to="/"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 dark:hover:bg-gray-500 gap-x-2 py-2 rounded-md dark:text-secondary-lite"
        >
          <Icon
            name="iconamoon:comment-light"
            class="text-lg py-2 px-2 text-primary dark:text-secondary-lite"
          />
          My Comments
          <span
            v-if="commentCount > 0"
            class="ml-1 px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full dark:text-secondary-lite"
          >
            {{ commentCount }}
          </span>
        </NuxtLink>
        <NuxtLink
          to="/bookmarked_recipe"
          @click="handleNavigationClick"
          class="text-md hover:bg-purple-100 dark:hover:bg-gray-500 gap-x-2 py-2 rounded-md dark:text-secondary-lite"
        >
          <Icon
            name="material-symbols:bookmark"
            class="text-lg px-2 py-2 text-primary dark:text-secondary-lite"
          />
          Bookmarked Recipe
          <span
            v-if="bookmarkCount > 0"
            class="ml-1 px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full dark:text-secondary-lite"
          >
            {{ bookmarkCount }}
          </span>
        </NuxtLink>
        <hr />
      </div>
      <button
        @click="
          () => {
            handleLogout();
            openModal = false;
          }
        "
        class="text-md hover:bg-purple-100 dark:hover:bg-gray-500 gap-x-2 py-2 rounded-md mt-5 w-full self-start dark:text-secondary-lite bg-purple-600"
      >
        <Icon
          name="material-symbols:logout"
          class="text-lg py-2 px-2 text-primary"
        />
        Log out
      </button>
    </template>
  </ModalsModal>
</template>
