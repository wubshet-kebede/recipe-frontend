<script setup>
definePageMeta({
  layout: "auth-layout",
});
import get_recipe_by_id from "@/query/recipes/get_recipe_by_id.gql";
import add_comment_for_recipe from "@/query/comment/add_comment_for_recipe.gql";
import edit_comment_for_recipe from "@/query/comment/edit_comment_for_recipe.gql";
import delete_recipe_by_pk from "@/query/recipes/delete_recipe_by_pk.gql";
import list from "~/composables/default/list";
import { jwtDecode } from "jwt-decode";
import insert_likes_for_recipe from "@/query/likes/insert_likes_for_recipe.gql";
import insert_bookmark_for_recipe from "@/query/bookmarks/insert_bookmark_for_recipe.gql";
import delete_bookmark_for_recipe from "@/query/bookmarks/delete_bookmark_for_recipe.gql";
import delete_likes_for_recipe from "@/query/likes/delete_likes_for_recipe.gql";
import upsert_ratings_for_recipe from "@/query/ratings/upsert_ratings_for_recipe.gql";
import delete_rating_for_recipe from "@/query/ratings/delete_rating_for_recipe.gql";
import { parse } from "@/use/errorParser";
import mutate_with_role from "~/composables/default/mutate_with_role";
import Notify from "@/use/notify";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { notify } = Notify();
const route = useRoute();
const router = useRouter();
const newCommentText = ref("");
const editingCommentId = ref(null);
const editingCommentText = ref("");
const recipe_id = ref(route.params.id);
console.log("the value of id is that", recipe_id.value);
const cookie = useCookie("recipe_app_token");
console.log("my cookies is that", cookie);

const currentUserId = ref(null);
const isAuthenticated = computed(() => authStore.isLoggedIn);
console.log(
  "the value fo teh user id and authenticate condition is that ",

  isAuthenticated.value
);
let userData = "";
const client = ref("anonymous");
const role = ref("public");
if (cookie.value) {
  userData = jwtDecode(cookie.value);
  currentUserId.value = userData.id;
  console.log("User Data is blocked:", userData);
  client.value = "authClient";
  role.value = "user";
}
console.log(
  "the value of look here please work for another one",
  role.value,
  currentUserId.value
);
const recipes = ref([]);
const { onResult, loading, refetch, onError } = list(get_recipe_by_id, {
  id: ref(recipe_id.value),
  role: ref(role.value),
  client: ref(client.value),
});
onResult((result) => {
  console.log("GraphQL result:", result);

  if (result?.data?.recipes.length) {
    recipes.value = result.data.recipes[0];
  } else {
    recipes.value = [];
  }
  console.log("the value of this one is that ", recipes.value);
});

const {
  mutate: addCommentMutation,
  onDone,
  onError: onCommentError,
} = mutate_with_role(add_comment_for_recipe, role.value, client);

const addComment = async (commentText) => {
  if (!isAuthenticated.value) {
    notify({
      title: "Loggen In First!",
      description: "Please Login first to add comment",
      cardClass: "bg-green-200 mt-14",
      icon: "line-md:confirm-circle",
      iconClass: "text-green-400",
      borderClass: "border-l-8 border-green-300 rounded-l-lg",
    });
    router.push("/login");
    return;
  }
  if (commentText.trim()) {
    try {
      await addCommentMutation({
        recipe_id: recipe_id.value,
        user_id: currentUserId.value,
        comment_text: commentText.trim(),
      });
    } catch (e) {
      console.error("Error adding comment:", e);
      toast.error("Failed to add comment. Please try again.");
    }
  }
};
onDone((data) => {
  console.log("the value of data is like this one ", data);
  notify({
    title: "Comment Added!",
    description: "Comment Added Scuccessfully!",
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
  newCommentText.value = "";
  refetch();
});
onCommentError((error) => {
  console.log("the error is ", error);
  let title = "Failed to add Recipe comment!";
  let message = error.message;
  errorNotify(title, message);
});

const {
  mutate: editCommentMutation,
  onDone: onEditDone,
  onError: onEditCommentError,
} = mutate_with_role(edit_comment_for_recipe, role.value, client);

const startEditComment = (comment) => {
  if (!isAuthenticated.value || comment.user_id !== currentUserId.value) {
    notify({
      title: "Editing Failed",
      description:
        "You can't edit the other comment, you can only edit your own comment!",
      cardClass: "bg-red-200 mt-14",
      icon: "line-md:cross-circle",
      iconClass: "text-red-400",
      borderClass: "border-l-8 border-red-300 rounded-l-lg",
    });
    return;
  }
  editingCommentId.value = comment.id;
  editingCommentText.value = comment.content;
};
const saveEditComment = async () => {
  if (!editingCommentId.value || !editingCommentText.value.trim()) {
    notify({
      title: "Empty",
      description: "Commnet can't be empty",
      cardClass: "bg-red-200 mt-14",
      icon: "line-md:cross-circle",
      iconClass: "text-red-400",
      borderClass: "border-l-8 border-red-300 rounded-l-lg",
    });
    return;
  }

  try {
    await editCommentMutation({
      id: editingCommentId.value,
      comment_text: editingCommentText.value.trim(),
    });
  } catch (e) {
    console.error("Error updating comment:", e);
    toast.error("Failed to update comment. You are not allowed to do this!");
  }
};
onEditDone((data) => {
  console.log("the value of data is like this one ", data);
  notify({
    title: "Comment Edited!",
    description: "Comment Edited Scuccessfully!",
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
  cancelEditComment();
  refetch();
});

const cancelEditComment = () => {
  editingCommentId.value = null;
  editingCommentText.value = "";
};
const isRecipeOwner = ref("false");
const isLiked = ref("false");
const isBookmarked = ref("false");
const userRating = ref(null);
watch([recipes, isAuthenticated, currentUserId], () => {
  console.log(
    "check here is there equal or not ",
    recipes.value,
    currentUserId.value
  );
  if (
    isAuthenticated.value &&
    recipes.value &&
    recipes.value.user?.id === currentUserId.value
  ) {
    isRecipeOwner.value = true;
  } else {
    isRecipeOwner.value = false;
  }
  if (isAuthenticated.value && recipes.value && recipes.value.likes?.length) {
    isLiked.value = recipes.value.likes.some(
      (like) => like.user_id === currentUserId.value
    );
  } else {
    isLiked.value = false;
  }
  if (
    isAuthenticated.value &&
    recipes.value &&
    recipes.value.bookmarks?.length
  ) {
    isBookmarked.value = recipes.value.bookmarks.some(
      (bookmark) => bookmark.user_id === currentUserId.value
    );
  } else {
    isBookmarked.value = false;
  }
  if (isAuthenticated.value && recipes.value && recipes.value.ratings?.length) {
    const userRatingObj = recipes.value.ratings.find(
      (r) => r.user_id === currentUserId.value
    );
    userRating.value = userRatingObj?.rating ?? null;
  } else {
    userRating.value = null;
  }
});

console.log("the owner will be announced", isRecipeOwner.value);
const {
  mutate: deleteRecipe,
  onDone: onDeleteDone,
  onError: onDeleteError,
} = mutate_with_role(delete_recipe_by_pk, role.value, client);

const showConfirmDialog = ref(false);

const confirmApprove = async () => {
  try {
    await deleteRecipe({ id: recipes.value.id });
  } catch (error) {
    console.error(error);
  } finally {
    showConfirmDialog.value = false;
  }
};
onDeleteDone((data) => {
  console.log("the value of the delete is", data);
  notify({
    title: "Recipe Deleted!",
    description: "Recipe deleted Scuccessfully!",
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
  router.push("/");
});
onDeleteError((error) => {
  console.log("the error is ", error);
  let title = "Failed to Delete Recipe!";
  let message = error.message;
  errorNotify(title, message);
});

function editRecipe() {
  router.push({
    name: "recipe-edit_recipe-id",
    params: { id: recipes.value.id },
  });
}
// const isLiked = computed(() => {
//   return recipe.value?.user_likes?.some(
//     (like) => like.user_id === currentUserId.value
//   );
// });
const likeLoading = ref(false);
const {
  mutate: insertLike,
  onDone: onLikeDone,
  onError: onLikeError,
  loading: isInsertLoading,
} = mutate_with_role(insert_likes_for_recipe, role.value, client);

const {
  mutate: deleteLike,
  onDone: onDeleteLikeDone,
  onError: onDeleteLikeError,
  loading: isDeleteLoading,
} = mutate_with_role(delete_likes_for_recipe, role.value, client);

const toggleLike = () => {
  if (!isAuthenticated.value) {
    notify({
      title: "Login!",
      description: "Please login to like the recipes!",
      cardClass: "bg-red-200 mt-14",
      icon: "line-md:cross-circle",
      iconClass: "text-red-400",
      borderClass: "border-l-8 border-red-300 rounded-l-lg",
    });
    router.push("/login");
    return;
  }

  if (likeLoading.value || isInsertLoading.value || isDeleteLoading.value)
    return;

  likeLoading.value = true;
  const wasLiked = isLiked.value;

  if (wasLiked) {
    const existingLikeId = recipes.value?.likes?.[0]?.id;
    if (existingLikeId) {
      deleteLike({ id: existingLikeId });

      onDeleteLikeDone(() => {
        likeLoading.value = false;
        refetch();
      });

      onDeleteLikeError((error) => {
        likeLoading.value = false;
        console.log("the error is ", error);
        let title = "Failed to Delete like!";
        let message = error.message;
        errorNotify(title, message);
      });
    } else {
      likeLoading.value = false;
    }
  } else {
    insertLike({
      recipe_id: recipe_id.value,
      user_id: currentUserId.value,
    });

    onLikeDone(() => {
      likeLoading.value = false;
      refetch();
    });

    onLikeError((error) => {
      likeLoading.value = false;
      console.log("the error is ", error);
      let title = "Failed to like recipe!";
      let message = error.message;
      errorNotify(title, message);
    });
  }
};
const {
  mutate: insertBookmark,
  onDone: onBookmarkDone,
  onError: onBookmarkError,
  loading: isBookmarkLoading,
} = mutate_with_role(insert_bookmark_for_recipe, role.value, client);
const {
  mutate: deleteBookmark,
  onDone: onDeleteBookmarkDone,
  onError: onDeleteBookmarkError,
  loading: isDeleteBookmarkLoading,
} = mutate_with_role(delete_bookmark_for_recipe, role.value, client);

const toggleBookmark = async () => {
  if (!isAuthenticated.value) {
    notify({
      title: "Login!",
      description: "Please login to bookmark the recipes!",
      cardClass: "bg-red-200 mt-14",
      icon: "line-md:cross-circle",
      iconClass: "text-red-400",
      borderClass: "border-l-8 border-red-300 rounded-l-lg",
    });
    router.push("/login");
    return;
  }

  const wasBookmarked = isBookmarked.value;

  if (wasBookmarked) {
    const existingBookmarkId = recipes.value?.bookmarks?.[0]?.id;
    if (existingBookmarkId) {
      await deleteBookmark({ id: existingBookmarkId });
      onDeleteBookmarkDone(() => {});
      await refetch();
      onDeleteBookmarkError((error) => {
        console.log("the error is ", error);
        let title = "Failed to Delete like!";
        let message = error.message;
        errorNotify(title, message);
      });
    }
  } else {
    await insertBookmark({
      recipe_id: recipe_id.value,
      user_id: currentUserId.value,
    });
    onBookmarkDone(() => {});
    await refetch();
    onBookmarkError((error) => {
      likeLoading.value = false;
      console.log("the error is ", error);
      let title = "Failed to like recipe!";
      let message = error.message;
      errorNotify(title, message);
    });
  }
};

const {
  mutate: upsertRating,
  onDone: onRatingDone,
  onError: onRatingkError,
  loading: isRatingLoading,
} = mutate_with_role(upsert_ratings_for_recipe, role.value, client);
const {
  mutate: deleteRating,
  onDone: onDeleteRatingDone,
  onError: onDeleteRatingError,
  loading: isDeleteRatingLoading,
} = mutate_with_role(delete_rating_for_recipe, role.value, client);

const setRating = async (rating) => {
  if (!isAuthenticated.value) {
    notify({
      title: "Login!",
      description: "Please login to bookmark the recipes!",
      cardClass: "bg-red-200 mt-14",
      icon: "line-md:cross-circle",
      iconClass: "text-red-400",
      borderClass: "border-l-8 border-red-300 rounded-l-lg",
    });
    router.push("/login");
    return;
  }

  // Basic validation
  if (rating < 1 || rating > 5) {
    notify({
      title: "Invalid!",
      description: "Invalid rating value",
      cardClass: "bg-red-200 mt-14",
      icon: "line-md:cross-circle",
      iconClass: "text-red-400",
      borderClass: "border-l-8 border-red-300 rounded-l-lg",
    });
    return;
  }

  const previousUserRating = userRating.value;

  const handleRefetch = () => {
    refetch();
  };

  const handleError = (error, action = "set") => {
    console.error(`Failed to ${action} rating:`, error);
    userRating.value = previousUserRating;
    notify({
      title: "Error!",
      description: `Failed to ${action} rating. Please try again.`,
      cardClass: "bg-red-200 mt-14",
      icon: "line-md:cross-circle",
      iconClass: "text-red-400",
      borderClass: "border-l-8 border-red-300 rounded-l-lg",
    });
  };

  if (previousUserRating === rating) {
    // Delete rating
    onDeleteRatingDone(handleRefetch);
    onDeleteRatingError((error) => handleError(error, "delete"));

    await deleteRating({
      id: recipes.value.ratings.find((r) => r.user_id === currentUserId.value)
        .id,
    });
  } else {
    // Upsert rating
    onRatingDone(handleRefetch);
    onRatingkError((error) => handleError(error, "set"));

    await upsertRating({
      recipe_id: recipe_id.value,
      user_id: currentUserId.value,
      rating: rating,
    });
  }
};

const errorNotify = (title, description) => {
  notify({
    title: title,
    description: description,
    cardClass: "bg-red-200 mt-14",
    icon: "line-md:cross-circle",
    iconClass: "text-red-400",
    borderClass: "border-l-8 border-red-300 rounded-l-lg",
  });
};
const showShareModal = ref(false);
</script>

<template>
  <div class="container mx-auto p-6 my-8 dark:bg-gray-900">
    <div v-if="!recipes" class="text-center text-gray-600">
      Loading recipe details...
    </div>

    <div
      v-else
      class="bg-white rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
    >
      <div
        class="flex flex-col-reverse md:flex-row justify-between items-center mb-6"
      >
        <h1 class="text-4xl font-bold text-gray-800 dark:text-secondary-lite">
          {{ recipes.title }}
        </h1>
        <div
          class="flex gap-x-5 self-end -mr-4 md:mr-0 -mt-4 md:mt-0 mb-2"
          v-if="isRecipeOwner"
        >
          <button
            @click="editRecipe"
            class="bg-green-500 dark:bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Edit
          </button>
          <button
            @click="showConfirmDialog = true"
            class="bg-green-500 dark:bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Delete
          </button>
          <ModalsConfirmation
            v-model="showConfirmDialog"
            @confirm="confirmApprove"
            icon="mdi:trash-can-outline"
            icon-class="text-red-600"
            title="Delete Recipe!"
            description="Are you sure you want to Delete this Recipe?"
            confirmButton="Delete"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div class="md:col-span-1">
          <div
            v-if="recipes.recipe_images && recipes.recipe_images.length > 0"
            class="grid grid-cols-4 gap-2"
          >
            <template v-for="img in recipes.recipe_images">
              <img
                :src="img.image_url"
                class="w-full aspect-square object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
              />
            </template>
          </div>
        </div>

        <div class="md:col-span-1 space-y-4 dark:text-secondary-lite">
          <p class="text-gray-700 text-lg dark:text-secondary-lite">
            {{ recipes.description }}
          </p>
          <div class="flex items-center text-gray-600 dark:text-secondary-lite">
            <Icon name="subway:time-1" class="w-5 h-5 mr-2" />
            <span
              >Preparation Time:
              {{ recipes.preparation_time_minutes }} minutes</span
            >
          </div>
          <div class="flex items-center text-gray-600 dark:text-secondary-lite">
            <Icon name="bx:category-alt" class="w-5 h-5 mr-2" />
            <span>Category: {{ recipes.category?.name }}</span>
          </div>

          <div class="flex items-center text-gray-600 dark:text-secondary-lite">
            <Icon name="mdi:people" class="w-5 h-5 mr-2" />

            <span>Created by: {{ recipes.user?.first_name }}</span>
            <span class="px-2">{{ recipes.user?.middle_name }}</span>
          </div>

          <div
            class="flex flex-wrap items-center space-x-6 py-4 border-t border-b border-gray-200 gap-y-3"
          >
            <button
              @click="toggleLike"
              :disabled="likeLoading"
              class="flex items-center transition-colors px-2"
              :class="{
                'text-red-500': isLiked,
                'text-gray-600 dark:text-secondary-lite': !isLiked,
                'opacity-50 cursor-not-allowed': likeLoading,
              }"
            >
              <Icon
                v-if="isLiked"
                name="icon-park-solid:like"
                class="text-2xl"
              />

              <Icon v-else name="icon-park-outline:like" class="text-2xl" />

              <span class="ml-1"
                >{{
                  recipes.likes_aggregate?.aggregate?.count || 0
                }}
                Likes</span
              >
            </button>
            <button
              @click="toggleBookmark"
              class="flex items-center text-gray-600 hover:text-yellow-500 transition-colors dark:text-secondary-lite"
              :class="{ 'text-yellow-500 dark:text-yellow-500': isBookmarked }"
            >
              <Icon
                name="material-symbols:bookmark-sharp"
                class="text-2xl px-3"
              />
              <span>Bookmark</span>
            </button>
            <div class="flex items-center space-x-1">
              <span class="mr-2 text-gray-600 dark:text-secondary-lite"
                >Rate:</span
              >
              <button
                v-for="star in 5"
                :key="star"
                @click="setRating(star)"
                class="hover:text-yellow-500 transition-colors"
                :class="
                  star <= userRating ? 'text-yellow-500' : 'text-gray-500'
                "
              >
                <Icon name="mdi:star-rate" class="text-2xl" />
              </button>
              <span class="ml-2 text-sm text-gray-500 dark:text-secondary-lite"
                >({{
                  recipes.ratings_aggregate?.aggregate?.avg?.rating
                    ? recipes.ratings_aggregate.aggregate.avg.rating.toFixed(1)
                    : "0"
                }})</span
              >
            </div>
            <button
              v-if="isRecipeOwner"
              @click="showShareModal = true"
              class="flex items-center text-gray-600 hover:text-purple-500 transition-colors gap-x-2 dark:text-secondary-lite"
            >
              <Icon name="rivet-icons:share" class="text-2xl px-2" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div class="mb-8 dark:text-secondary-lite">
        <h3
          class="text-2xl font-bold text-gray-800 mb-4 dark:text-secondary-lite"
        >
          Ingredients
        </h3>
        <ul
          class="list-disc list-inside text-gray-700 text-lg space-y-2 dark:text-secondary-lite"
        >
          <li v-for="(item, index) in recipes.ingredients" :key="index">
            {{ item.quantity }}
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="mb-8">
        <h3
          class="text-2xl font-bold text-gray-800 mb-4 dark:text-secondary-lite"
        >
          Instructions
        </h3>
        <ol
          class="list-decimal list-inside text-gray-700 text-lg space-y-3 dark:text-secondary-lite"
        >
          <li v-for="(step, index) in recipes.steps" :key="index">
            {{ step.instruction }}
          </li>
        </ol>
      </div>

      <div>
        <h3
          class="dark:text-secondary-lite text-2xl font-bold text-gray-800 mb-4 dark:bg-gray-900"
        >
          Comments ({{ recipes.comments?.length || 0 }})
        </h3>
        <div class="flex flex-col md:grid md:grid-cols-2 mb-6">
          <div
            v-for="comment in recipes.comments"
            :key="comment.id"
            class="bg-gray-50 p-4 rounded-md shadow-sm dark:bg-gray-800"
          >
            <div v-if="editingCommentId === comment.id">
              <p class="font-semibold text-gray-800 dark:text-secondary-lite">
                {{ comment.user?.username }}
                <span
                  class="text-gray-500 text-sm font-normal ml-2 dark:text-secondary-lite"
                  >{{ new Date(comment.created_at).toLocaleDateString() }}</span
                >
              </p>
              <textarea
                v-model="editingCommentText"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3 mt-2"
                placeholder="Edit your comment..."
              ></textarea>
              <div class="flex space-x-2 dark:bg-gray-900">
                <button
                  @click="saveEditComment"
                  class="bg-primary text-white px-4 py-2 rounded-md dark:bg-gray-900 hover:bg-primaryDark transition-colors text-sm"
                >
                  Save
                </button>
                <button
                  @click="cancelEditComment"
                  class="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div v-else>
              <p class="font-semibold text-gray-800 dark:text-secondary-lite">
                {{ comment.user?.username }}
                <span
                  class="text-gray-500 text-sm font-normal ml-2 dark:text-secondary-lite"
                  >{{ new Date(comment.created_at).toLocaleDateString() }}</span
                >
              </p>
              <p class="text-gray-700 mt-1 dark:text-secondary-lite">
                {{ comment.content }}
              </p>
              <button
                v-if="isAuthenticated && comment.user_id === currentUserId"
                @click="startEditComment(comment)"
                class="mt-2 text-blue-500 hover:underline text-sm dark:text-gray-100"
              >
                Edit
              </button>
            </div>
          </div>
          <p
            v-if="!recipes.comments || recipes.comments.length === 0"
            class="text-gray-500 text-center dark:text-secondary-lite"
          >
            No comments yet. Be the first to comment!
          </p>
        </div>

        <div v-if="isAuthenticated">
          <h4
            class="text-xl font-semibold text-gray-800 mb-3 dark:text-secondary-lite"
          >
            Add Your Comment
          </h4>
          <textarea
            v-model="newCommentText"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
            placeholder="Write your comment here..."
          ></textarea>
          <button
            @click="
              addComment(newCommentText);
              newCommentText = '';
            "
            class="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Post Comment
          </button>
        </div>

        <p v-else class="text-center text-gray-600 mt-6">
          <NuxtLink to="/login" class="text-green-600 hover:underline"
            >Login</NuxtLink
          >
          to leave a comment.
        </p>
      </div>
    </div>
  </div>
  <ShareRecipeShare
    v-model="showShareModal"
    :recipe-id="recipes.id"
    :recipe-title="recipes.title"
    :recipe-description="recipes.description"
    @close="showShareModal = false"
  />
</template>
