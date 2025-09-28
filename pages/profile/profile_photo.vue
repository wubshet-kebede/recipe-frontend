<script setup>
definePageMeta({
  layout: "auth-layout",
});

import { useForm, useField } from "vee-validate";
import { jwtDecode } from "jwt-decode";
import upload_profile_picture from "@/query/profile/upload_profile_picture.gql";
import fetch_profile_photo from "@/query/user/fetch_profile_photo.gql";
import list from "~/composables/default/list";
import mutate_with_role from "~/composables/default/mutate_with_role";
import fetch_user_detail from "@/query/user/fetch_user_detail.gql";
import Notify from "@/use/notify";
import insert_profile_picture from "@/query/profile/insert_profile_picture.gql";
import { parse } from "@/use/errorParser";
const { notify } = Notify();
const route = useRoute();

const isActive = (path) => route.path === path;

const { handleSubmit, resetForm, setFieldValue } = useForm({});
const token = useCookie("recipe_app_token").value;
let userData = jwtDecode(token);
const userID = userData.id;
console.log("the value of id is", userID);
const role = "user";
const client = ref("authClient");
const images = ref({});
const {
  loading: fileUploadLoading,
  mutate: FileUpload,
  onDone: onFileUploadDone,
  onError: onFileUploadError,
} = mutate_with_role(upload_profile_picture, role, client);
onFileUploadDone(({ data }) => {
  console.log("Uploaded files:", data);
  if (data?.uploadProfilePicture) {
    images.value.profile_images = data.uploadProfilePicture.profilePictureUrl;
  }
  console.log("the images is ", images.value);
  notify({
    title: "Profile uploaded",
    description: "Successfully uploaded your profile",
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
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
  if (!uploadedFiles || uploadedFiles.length === 0) return;
  console.log("first file:", uploadedFiles?.[0]);
  const uploadedFile = uploadedFiles[0];
  const f = { base64: uploadedFile };

  console.log("Uploading files:", f);
  console.log("Mutation to call:", FileUpload);
  console.log("Variables:", {
    input: {
      file: f,
      folder: "uploads",
    },
  });

  FileUpload({
    input: {
      file: f,
      folder: "uploads/profile_pics",
    },
  });
};
const {
  mutate,
  onDone,
  onError: onProfileError,
} = mutate_with_role(insert_profile_picture, role, client);

const handleCreate = handleSubmit(async (values) => {
  const variables = {
    image_url: images.value.profile_images,
    user_id: userID,
  };
  console.log("the mutation we sent ", variables);
  mutate({
    objects: variables,
  });
});
onDone((data) => {
  console.log("the response looks like", data);
  notify({
    title: "Profile created!",
    description: "Successfully created your profile",
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
});
onProfileError((err) => {
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
const files = ref(null);
const profileImage = ref(null);
const { onResult, loading, refetch, onError } = list(fetch_profile_photo, {
  id: ref(userID),
  role: ref(role),
  client: ref(client.value),
});
onResult((result) => {
  console.log("GraphQL result to fetch the profile photo:", result);

  const user = result?.data?.users?.[0];
  if (user?.profile_images?.length > 0) {
    profileImage.value = user.profile_images[0].image_url;
  } else {
    profileImage.value = null;
  }
  files.value = [profileImage.value.image_url];
  console.log("User profile image:", profileImage.value);
});
const users = ref({});
const {
  onResult: userDetailResult,
  loading: userDataLoading,
  refetch: userRefetch,
  onError: onUserError,
} = list(fetch_user_detail, {
  id: ref(userID),
  role: ref(role),
  client: ref(client.value),
});
userDetailResult(({ data }) => {
  console.log("Result:", data);
  users.value = data.users[0];
  console.log("the value of users is that", users.value);
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
</script>
<template>
  <div
    class="grid grid-cols-[30%_70%] border border-gray-900 w-[1000px] mx-auto mt-10"
  >
    <div class="flex flex-col gap-y-2 border border-gray-900">
      <div class="flex flex-col gap-y-2 items-center mt-5">
        <div
          class="w-40 h-40 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md ring-2 ring-white cursor-pointer transform hover:scale-110 transition-transform duration-200 overflow-hidden"
        >
          <img
            v-if="users?.profile_images?.[0]?.image_url"
            :src="users.profile_images[0].image_url"
            :alt="users.first_name + ' ' + users.last_name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
          >
            {{ userInitials }}
          </div>
        </div>
        <p class="text-gray-700">
          {{ users.first_name }} {{ users.middle_name }}
        </p>
        <div class="flex flex-col mt-5 w-full px-2 gap-y-3">
          <NuxtLink
            to="/profile"
            :class="[
              'text-md rounded px-2 py-2 hover:bg-purple-100',
              isActive('/profile') ? 'bg-purple-200 font-normal' : '',
            ]"
          >
            view profile
          </NuxtLink>
          <NuxtLink
            to="/profile/edit_profile"
            :class="[
              'text-md rounded px-2 py-2 hover:bg-purple-100',
              isActive('/profile/edit_profile')
                ? 'bg-purple-200 font-normal'
                : '',
            ]"
          >
            Profile
          </NuxtLink>
          <NuxtLink
            to="/profile/profile_photo"
            :class="[
              'text-md rounded px-2 py-2 hover:bg-purple-100',
              isActive('/profile/profile_photo')
                ? 'bg-purple-200 font-normal'
                : '',
            ]"
          >
            Photo
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="flex flex-col mt-3 w-full gap-y-5">
      <div class="flex flex-col gap-y-3 items-center">
        <p class="text-xl font-bold text-gray-900">Photo</p>
        <p class="text-sm text-gray-500">
          Add a nice photo of yourself for your profile.
        </p>
      </div>
      <hr class="w-full" />
      <form @submit.prevent="handleCreate">
        <div class="w-[80%] mx-auto mt-5">
          <HFileUpload
            fileType="image"
            rules="required"
            text="Select a file"
            :limit="1"
            accept="image/*"
            @onFileChange="handleFileUpload"
            :fileSize="10"
            v-model="files"
          ></HFileUpload>
        </div>
        <div class="flex flex-col mt-3 w-[20%] mb-10 mx-auto">
          <button type="submit" class="bg-primary px-5 py-2 rounded">
            Create Profile
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
