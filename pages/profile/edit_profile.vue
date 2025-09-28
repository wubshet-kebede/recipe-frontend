<script setup>
definePageMeta({
  layout: "auth-layout",
});
import fetch_user_detail from "@/query/user/fetch_user_detail.gql";
import update_user_info from "@/query/user/update_user_info.gql";
import { jwtDecode } from "jwt-decode";
import list from "~/composables/default/list";
import mutate_with_role from "~/composables/default/mutate_with_role";

import Notify from "@/use/notify";
const { notify } = Notify();
const role = ref("user");
const client = ref("authClient");
const users = ref({});
const cookie = useCookie("recipe_app_token");
import { useForm } from "vee-validate";
const { handleSubmit } = useForm({
  initialValues: {
    user_name: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
  },
});
const currentUserId = ref(null);
let userData = "";
if (cookie.value) {
  userData = jwtDecode(cookie.value);
  currentUserId.value = userData.id;
  console.log("User Data is blocked:", userData);
  client.value = "authClient";
  role.value = "user";
}
const form = ref({
  user_name: "",
  first_name: "",
  middle_name: "",
  last_name: " ",
  phone_number: "",
});
const { onResult, loading, refetch, onError } = list(fetch_user_detail, {
  id: ref(currentUserId.value),
  role: ref(role.value),
  client: ref(client.value),
});
onResult(({ data }) => {
  console.log("Result:", data);
  users.value = data.users[0];
  console.log("the value of users is that", users.value);
});
watch(
  users,
  (user) => {
    if (!user) return;

    console.log("Watcher: recipe updated. New recipe:", user);
    form.value.user_name = user.username || "";
    form.value.first_name = user.first_name || "";
    form.value.middle_name = user.middle_name || "";
    form.value.last_name = user.last_name || 0;
    form.value.phone_number = user.phone_number || "";
  },
  { immediate: true }
);
const {
  mutate: updateUser,
  onDone,
  onError: onuserError,
} = mutate_with_role(update_user_info, role.value, client);
const submit = handleSubmit(async (values) => {
  console.log("the value of the items ", values);
  let variables = {
    username: values["user_name"],
    first_name: values["first_name"],
    middle_name: values["middle_name"],
    last_name: values["last_name"],
    phone_number: values["phone_number"],
  };
  console.log("the value of muattion we sent to update", variables);
  updateUser({
    id: currentUserId.value,
    object: variables,
  });
});
onDone((data) => {
  console.log("the value of ", data);
  notify({
    title: "Updated",
    description: "SUccessfully updated your profile",
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
});
onuserError((error) => {
  console.log("the value of error", error);
  notify({
    title: "Failed!",
    description: "Failed to edit your profile",
    cardClass: "bg-red-200 mt-14",
    icon: "line-md:cross-circle",
    iconClass: "text-red-400",
    borderClass: "border-l-8 border-red-300 rounded-l-lg",
  });
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
          <NuxtLink class="hover:bg-purple-100 text-md rounded px-2 py-2">
            view profile
          </NuxtLink>
          <NuxtLink class="hover:bg-purple-100 text-md rounded px-2 py-2">
            Profile
          </NuxtLink>
          <NuxtLink
            to="/profile/profile_photo"
            class="hover:bg-purple-100 text-md rounded px-2 py-2"
          >
            Photo
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="flex flex-col mt-3 w-full">
      <div class="flex flex-col gap-y-3 items-center">
        <p class="text-xl font-bold text-gray-900">Public profile</p>
        <p class="text-sm text-gray-500">add information about your self</p>
      </div>
      <hr class="mt-2 w-full" />
      <form @submit.prevent="submit">
        <div class="w-[80%] mx-auto">
          <HTextfield
            rules="required"
            v-model="form.user_name"
            name="user_name"
            placeholder="UserName"
            class="text-gray-600 focus:border-primary duration-200"
          >
            <template #label>
              <h1
                class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 mt-5"
              >
                User name
              </h1>
            </template>
          </HTextfield>
          <HTextfield
            rules="required"
            name="first_name"
            v-model="form.first_name"
            placeholder="FirstName"
            class="text-gray-600 focus:border-primary duration-200"
          >
            <template #label>
              <h1
                class="block text-sm font-medium leading-6 text-gray-900 mb-1 mt-5 duration-200"
              >
                First Name
              </h1>
            </template>
          </HTextfield>
          <HTextfield
            rules="required"
            name="middle_name"
            v-model="form.middle_name"
            placeholder="MiddleName"
            class="text-gray-600 focus:border-primary duration-200"
          >
            <template #label>
              <h1
                class="block text-sm font-medium leading-6 text-gray-900 mb-1 mt-5 duration-200"
              >
                Middle Name
              </h1>
            </template>
          </HTextfield>
          <HTextfield
            rules="required"
            name="last_name"
            v-model="form.last_name"
            placeholder="LastName"
            class="text-gray-600 focus:border-primary duration-200"
          >
            <template #label>
              <h1
                class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 mt-5"
              >
                Last Name
              </h1>
            </template>
          </HTextfield>
          <HTextfield
            rules="required|ethiopian_phone_number"
            name="phone_number"
            placeholder="PhoneNumber"
            v-model="form.phone_number"
            class="text-gray-600 focus:border-primary duration-200"
          >
            <template #label>
              <h1
                class="block text-sm font-medium leading-6 text-gray-900 mb-1duration-200 mt-5"
              >
                Phone Number
              </h1>
            </template>
          </HTextfield>
        </div>
        <div class="mt-5 justify-end flex">
          <button
            :disabled="loading"
            type="submit"
            class="bg-green-600 px-3 py-2 shadow-md rounded-lg mr-16 mb-5"
          >
            Edit profile
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
