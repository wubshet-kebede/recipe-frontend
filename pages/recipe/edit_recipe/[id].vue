<script setup>
import get_recipe_by_id from "@/query/recipes/get_recipe_by_id.gql";
import update_recipe from "@/query/recipes/update_recipe.gql";
import list from "~/composables/default/list";
import recipe_image_upload from "@/query/recipes/recipe_image_uploads.gql";
import mutate_with_role from "~/composables/default/mutate_with_role";
import { useAuthStore } from "@/stores/auth";
import { jwtDecode } from "jwt-decode";
import fetch_category from "@/query/category/fetch_category.gql";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { parse } from "@/use/errorParser";
import Notify from "@/use/notify";
import { useForm, useField } from "vee-validate";
const { handleSubmit, resetForm, setFieldValue } = useForm({});

const { notify } = Notify();

const authStore = useAuthStore();
const route = useRoute();
const recipe_id = ref(route.params.id);

const cookie = useCookie("recipe_app_token");

const currentUserId = ref(null);
const role = ref("public");
const client = ref("anonymous");

if (cookie.value) {
  const userData = jwtDecode(cookie.value);
  currentUserId.value = userData.id;
  client.value = "authClient";
  role.value = "user";
}
const categories = ref([]);

const {
  loading: categoryLoading,
  onResult: onCategory,
  onError: onCategoryError,
} = list(fetch_category, role, client);
onCategory(({ data }) => {
  console.log("Result:", data);
  categories.value = data.categories;
  console.log(categories.value);
});
// Form
const form = ref({
  title: "",
  description: "",
  preparationtime: 0, // matches your template
  price: 0, // matches your template
  category: "", // matches your HListSearchSelect v-model
});

const ingredients = ref([{ name: "", quantity: "" }]);
const steps = ref([{ instruction: "" }]);
const files = ref([]);
// Add/remove helpers
const addMore = () => ingredients.value.push({ name: "", quantity: "" });
const remove = (index) => ingredients.value.splice(index, 1);
const addStep = () => steps.value.push({ instruction: "" });
const removeStep = (index) => steps.value.splice(index, 1);

// Fetch recipe
const { onResult, loading, refetch, onError } = list(get_recipe_by_id, {
  id: recipe_id,
  role,
  client,
});

onResult((result) => {
  const recipe = result?.data?.recipes?.[0];
  if (!recipe) return;

  // Populate form
  form.value.title = recipe.title || "";
  form.value.description = recipe.description || "";
  form.value.preparationtime = recipe.preparation_time_minutes || 0;
  form.value.price = recipe.price_etb || 0;
  form.value.category = recipe.category;

  // Ingredients
  if (recipe.ingredients?.length) {
    ingredients.value = recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity,
    }));
  }

  // Steps
  if (recipe.steps?.length) {
    steps.value = recipe.steps.map((s) => ({ instruction: s.instruction }));
  }

  // Images
  if (recipe.recipe_images?.length) {
    files.value = recipe.recipe_images.map((img) => ({
      name: img.filename || "Uploaded Image",
      size: 0,
      type: "image/*",
      dataUrl: img.image_url,
      is_featured: img.is_featured,
    }));
  }
  console.log("the value of file is ", files.value);
});
// watchEffect(() => {
//   // Use a guard to ensure both pieces of data exist before trying to match.
//   if (recipeCategoryId.value && categories.value.length) {
//     const match = categories.value.find((c) => c.id === recipeCategoryId.value);
//     if (match) {
//       // THIS IS THE FIX: Set the form's category with the correct object reference.
//       form.value.category = match;
//       console.log("Category has been successfully set:", match);
//     }
//   }
// });

onError((err) => console.error("Failed to fetch recipe:", err));
const images = ref({});
const {
  loading: recipeUpdateLoading,
  mutate: RecipeUpdate,
  onDone: onRecipeUpdateDone,
  onError: onRecipeUpdateError,
} = mutate_with_role(update_recipe, role.value, client);
const {
  loading: fileUploadLoading,
  mutate: FileUpload,
  onDone: onFileUploadDone,
  onError: onFileUploadError,
} = mutate_with_role(recipe_image_upload, role.value, client);
// onFileUploadDone(({ data }) => {
//   console.log("Uploaded files:", data);
//   if (data?.uploadFiles?.urls?.length > 0) {
//     images.value.recipe_images = data.uploadFiles.urls.map((url, index) => ({
//       image_url: url,
//       is_featured: false,
//       image_order: index + 1,
//     }));
//   }
//    files.value = [...files.value,  images.value.recipe_images];
//   console.log("the images is ", images.value);
// });
onFileUploadDone(({ data }) => {
  console.log("Uploaded files:", data);
  if (data?.uploadFiles?.urls?.length > 0) {
    const uploadedImages = data.uploadFiles.urls.map((url, index) => ({
      dataUrl: url, // for preview
      is_featured: false,
      image_order: files.value.length + index + 1,
    }));

    // Merge with previous files
    files.value = [...files.value, ...uploadedImages];
  }

  console.log("All images now:", files.value);
});
onFileUploadError((err) => {
  console.log("the value of teh error ", err);
  const parsed = parse(err);
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

const handleFileUpload = (uploadedFiles) => {
  if (!uploadedFiles || uploadedFiles.length === 0) return; // <-- early exit

  const f = uploadedFiles.map((file) => ({ base64: file }));

  if (f.length === 0) return; // <-- extra safety
  console.log("Uploading files:", f);
  console.log("Mutation to call:", FileUpload);
  console.log("Variables:", {
    input: {
      files: f,
      folder: "uploads",
    },
  });

  FileUpload({
    input: {
      files: f,
      folder: "uploads",
    },
  });
};
const handleEdit = handleSubmit(async (values) => {
  await RecipeUpdate({
    recipe_id: recipe_id.value,
    title: values.title,
    description: values.description,
    price: values.price,
    preparation_time: values.preparationtime,
    category_id: form.value.category?.id,

    ingredients: values.ingredients.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity,
      recipe_id: recipe_id.value,
    })),
    steps: values.steps.map((step, index) => ({
      step_number: index + 1,
      instruction: step.instruction,
      recipe_id: recipe_id.value,
    })),
    images: files.value.map((img, index) => ({
      image_url: img.dataUrl,
      is_featured: img.is_featured || false,
      image_order: index + 1,
      recipe_id: recipe_id.value,
    })),
  });
  console.log("the mutation I sent:", {
    recipe_id: recipe_id.value,
    title: values.title,
    description: values.description,
    price: values.price,
    preparation_time: values.preparationtime,
    category_id: form.value.category?.id,
    ingredients: values.ingredients,
    steps: values.steps,
    images: files.value,
  });
});

onRecipeUpdateDone((result) => {
  notify({
    title: "Edited",
    description: "Your recipe successfully edited!",
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
  console.log("Update result:", result);
  refetch();
});

onRecipeUpdateError((error) => {
  console.error("Update error:", error);
  const description = error?.message || "An unexpected error occurred";
  notify({
    title: "Failed to edit!",
    description: description,
    cardClass: "bg-red-200 mt-14",
    icon: "line-md:cross-circle",
    iconClass: "text-red-400",
    borderClass: "border-l-8 border-red-300 rounded-l-lg",
  });
});
const setThumbnail = (index) => {
  files.value = files.value.map((img, i) => ({
    ...img,
    is_featured: i === index,
  }));
};
</script>

<template>
  <div class="container mx-auto p-6 my-8">
    <h1
      class="text-4xl font-bold text-center text-gray-700 mb-8 dark:text-secondary-lite"
    >
      Edit Recipe
    </h1>

    <div
      class="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-200 dark:bg-gray-900"
    >
      <form @submit.prevent="handleEdit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <HTextfield
              name="title"
              type="text"
              id="title"
              v-model="form.title"
              class="w-full px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 dark:text-secondary-lite"
                >
                  Recipe Title <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>

          <div class="mb-4">
            <HListSearchSelect
              name="category"
              v-model="form.category"
              :selected="form.category?.id"
              :items="categories"
              :loading="categoryLoading"
              placeholder="Select or search category"
              searchPlaceholder="Search categories"
              class="w-full"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 dark:text-secondary-lite text-gray-900 mb-1 duration-200"
                >
                  Category <span class="text-red-600">*</span>
                </h1>
              </template>
            </HListSearchSelect>
          </div>
          <div>
            <HTextfield
              name="preparationtime"
              type="number"
              id="preparation_time_in_minutes"
              v-model="form.preparationtime"
              class="w-full px-4 py-2 focus:ring-blue-500 focus:border-blue"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 dark:text-secondary-lite"
                >
                  Preparation Time (minutes) <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
          <div>
            <HTextfield
              name="price"
              type="number"
              id="price"
              v-model="form.price"
              class="w-full px-4 py-2"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 dark:text-secondary-lite text-gray-900 mb-1 duration-2000"
                >
                  Price in etb <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
        </div>
        <div class="mt-2">
          <HTextfield
            name="description"
            as="textarea"
            id="description"
            rows="4"
            v-model="form.description"
          >
            <template #label>
              <h1
                class="block text-sm font-medium leading-6 text-gray-900 dark:text-secondary-lite mb-1 duration-200"
              >
                Description <span class="text-red-600">*</span>
              </h1>
            </template>
          </HTextfield>
        </div>

        <div class="flex flex-col gap-y-2 mt-2">
          <!-- Scrollable container -->
          <h1
            class="block text-sm font-medium leading-6 text-gray-900 mb-1 dark:text-secondary-lite"
          >
            Instruction Steps <span class="text-red-600">*</span>
          </h1>
          <div
            class="flex flex-col gap-y-3 overflow-y-auto scrollable-steps"
            :style="{ maxHeight: steps.length > 3 ? '300px' : 'auto' }"
          >
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex items-end space-x-3 mb-3"
            >
              <div class="flex-grow">
                <HTextfield
                  :label="`Step ${index + 1}`"
                  as="textarea"
                  rows="2"
                  :name="`steps[${index}].instruction`"
                  :id="`step-instruction-${index}`"
                  v-model="steps[index].instruction"
                  :rules="'required'"
                  placeholder="Describe the step..."
                >
                  <!-- <template #label>
                    <h1
                      class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200"
                    >
                      Instruction Steps <span class="text-red-600">*</span>
                    </h1>
                  </template> -->
                </HTextfield>
              </div>

              <!-- Remove button -->
              <button
                v-if="steps.length > 1"
                type="button"
                @click="removeStep(index)"
                class="rounded-md hover:bg-primaryLite self-center mt-4"
              >
                <Icon
                  name="material-symbols:delete-outline-rounded"
                  class="text-red-500 text-2xl"
                />
              </button>
            </div>
          </div>

          <button
            type="button"
            @click="addStep"
            class="mt-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-[15%]"
          >
            Add Step
          </button>
        </div>

        <div class="grid grid-cols-2 gap-x-2 mt-2">
          <div class="flex flex-col gap-y-5">
            <div
              class="flex flex-col gap-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollable-steps"
              :style="{ maxHeight: ingredients.length > 3 ? '300px' : 'auto' }"
            >
              <div
                v-for="(ingredient, index) in ingredients"
                :key="index"
                class="flex items-end space-x-3 mb-3 mt-2"
              >
                <!-- Name -->
                <HTextfield
                  label="Name"
                  :name="`ingredients[${index}].name`"
                  :id="`ingredient-name-${index}`"
                  v-model="ingredients[index].name"
                  :rules="'required'"
                  placeholder="Enter ingredient name"
                >
                  <template #label>
                    <h1
                      class="block text-sm font-medium leading-6 dark:text-secondary-lite text-gray-900 mb-1 duration-200"
                    >
                      Ingredient <span class="text-red-600">*</span>
                    </h1>
                  </template>
                </HTextfield>

                <!-- Quantity -->
                <HTextfield
                  label="Quantity"
                  type="text"
                  :name="`ingredients[${index}].quantity`"
                  :id="`ingredient-quantity-${index}`"
                  v-model="ingredients[index].quantity"
                  :rules="'required'"
                  placeholder="0"
                >
                  <template #label>
                    <h1
                      class="block text-sm font-medium leading-6 text-gray-900 dark:text-secondary-lite mb-1 duration-200"
                    >
                      Quantity <span class="text-red-600">*</span>
                    </h1>
                  </template>
                </HTextfield>

                <!-- Remove button -->
                <button
                  v-if="ingredients.length > 1"
                  type="button"
                  @click="remove(index)"
                  class="rounded-md hover:bg-primaryLite self-center mt-4"
                >
                  <Icon
                    name="material-symbols:delete-outline-rounded"
                    class="text-red-500 text-2xl"
                  />
                </button>
              </div>

              <!-- Add ingredient -->
            </div>
            <button
              type="button"
              @click="addMore"
              class="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-[35%] text-nowrap"
            >
              Add Ingredient
            </button>
          </div>

          <div class="mt-3 flex flex-col gap-y-2 ml-5">
            <HFileUpload
              fileType="image"
              rules="required"
              text="Select a file"
              :limit="5"
              accept="image/*"
              :thumbnail="true"
              @onFileChange="handleFileUpload"
              :fileSize="10"
              v-model="files"
            ></HFileUpload>
          </div>
          <div class="mt-1 flex flex-wrap gap-4">
            <p class="font-bold text-primary">
              Please select one image for Thumbnail !
            </p>
            <div
              v-for="(img, index) in files"
              :key="index"
              class="relative cursor-pointer border rounded-lg p-1"
              :class="img.is_featured ? 'border-blue-500' : 'border-gray-300'"
              @click="setThumbnail(index)"
            >
              <img
                :src="img.dataUrl"
                alt="Uploaded image"
                class="w-32 h-32 object-cover rounded"
              />
              <span
                v-if="img.is_featured"
                class="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded"
              >
                Thumbnail
              </span>
            </div>
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-green-600 text-white text-xl py-3 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-5"
        >
          Edit Recipe
        </button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.scrollable-steps::-webkit-scrollbar {
  width: 6px;
}

.scrollable-steps::-webkit-scrollbar-track {
  background: #e5e5e5;
}

.scrollable-steps::-webkit-scrollbar-thumb {
  background-color: #a3a3a3;
  border-radius: 3px;
}
</style>
