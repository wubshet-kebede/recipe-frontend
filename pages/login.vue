<script setup>
import login_user from "@/query/auth/login_user.gql";
import mutate_with_role from "~/composables/default/mutate_with_role";
import { useAuthStore } from "@/stores/auth";
import Notify from "@/use/notify";

import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import anonymous_mutator from "~/composables/default/anonymous_mutator";

const auth = useAuthStore();
const router = useRouter();
const { onLogin, onLogout } = useApollo();
const { notify } = Notify();

const { handleSubmit } = useForm({});
const role = "user";
const client = ref("anonymous");
const { mutate, loading, onDone, onError } = anonymous_mutator(login_user, {
  clientId: client,
});
const submit = handleSubmit(async (values) => {
  console.log("the value of the items ", values);
  let variables = {
    email: values["email"],
    password: values["password"],
  };
  mutate({
    input: variables,
  });
});
onDone(({ data }) => {
  const token = data.login.token;

  const user = {
    username: data?.login?.username,
    email: data?.login?.email,
    firstName: data?.login?.first_name,
  };
  if (!token) {
    console.error("No token returned from login");
    return;
  }

  // Apollo persists the JWT in cookie
  onLogin(token);

  // Save user info in Pinia (reactive)

  auth.login(user, token);
  console.log("JWT stored in Pinia:", auth.token);
  console.log("User stored in Pinia:", auth.user);

  let title = "Login successful!";
  let description = "You have successfully logged in to your account.";
  successNotify(title, description);
  router.push("/authenticated_user");
});

onError((error) => {
  console.error("Mutation error:", error);

  let title = "Login failed!";
  let description = "Invalid credentials";

  const graphQLError = error?.graphQLErrors?.[0];
  const internalError = graphQLError?.extensions?.internal?.error;

  if (internalError) {
    const match = internalError.match(/"(.+?)\\n"/);
    if (match && match[1]) description = match[1];
  }

  // Show friendly notification
  errorNotify(title, description);
});

const successNotify = (title, description) => {
  notify({
    title: title,
    description: description,
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
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
</script>
<template>
  <div class="flex-1 bg-repeat">
    <div
      class="min-h-screen max-w-[50%] max-md:max-w-[80%] max-md:w-full mx-auto 2xl:max-w-[30%] flex flex-col justify-center items-center"
    >
      <div class="flex flex-col gap-y-3 w- my-10">
        <Icon
          name="emojione-monotone:waving-hand"
          class="text-7xl text-gray-600 mb-8 dark:text-secondary-lite"
        />
        <h1
          class="text-gray-600 text-3xl font-semibold mb-5 dark:text-secondary-lite"
        >
          Welcome Back to RecipeHub
        </h1>
        <p class="text-gray-500 dark:text-secondary-lite">
          Discover, cook, and share your favorite recipes with our community of
          food lovers. Log in to unlock personalized meal plans, saved recipes,
          and more.
        </p>
      </div>
      <form @submit.prevent="submit" class="w-full space-y-6">
        <div>
          <HTextfield
            rules="required|email"
            name="email"
            placeholder="Email"
            leading-icon="mdi:email-outline"
            leadingIconClass="border-r-[1px] border-red-500 "
            iconLeadingClass="pl-14"
            class="text-gray-300 focus:border-primary duration-200"
          >
            <template #label>
              <h1
                class="block text-sm dark:text-secondary-lite font-medium leading-6 text-gray-900 mb-1 duration-200"
              >
                Email address <span class="text-red-600">*</span>
              </h1>
            </template>
          </HTextfield>
        </div>

        <div>
          <HTextfield
            rules="required"
            leading-icon="majesticons:key-line"
            trailingIcon="mdi:eye-outline"
            type="password"
            name="password"
            placeholder="Password"
            leadingIconClass="border-r-[1px] border-gray-300"
            iconLeadingClass="pl-14"
            class="text-gray-600 focus:border-primary duration-200"
          >
            <template #label>
              <h1
                class="block dark:text-secondary-lite text-sm font-medium leading-6 text-gray-900 mb-1 duration-200"
              >
                Password <span class="text-red-600">*</span>
              </h1>
            </template>
          </HTextfield>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary duration-200 cursor-pointer"
            />
            <label
              for="remember-me"
              class="ml-3 block text-sm leading-6 text-gray-900 cursor-pointer duration-200 dark:text-secondary-lite"
              >Remember me</label
            >
          </div>

          <div class="text-sm leading-6">
            <a
              href="#"
              class="font-semibold text-purple-500 hover:text-primaryDark duration-200"
              >Forgot password?</a
            >
          </div>
        </div>

        <div>
          <button
            :disabled="loading"
            type="submit"
            class="flex gap-x-2 w-full justify-center disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md bg-purple-600 px-3 py-2 font-semibold leading-6 text-white shadow-sm hover:bg-primaryDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 duration-200 hover:shadow-full"
          >
            <Icon
              name="svg-spinners:ring-resize"
              class="text-2xl text-gray-300"
              v-if="loading"
            />
            Log in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
