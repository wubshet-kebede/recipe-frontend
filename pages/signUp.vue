<script setup>
import signup_user from "@/query/auth/signup_user.gql";
import Notify from "@/use/notify";
import anonymous_mutator from "~/composables/default/anonymous_mutator";
const { notify } = Notify();
const { handleSubmit } = useForm({});
const items = ref({});
console.log("the value of the items ", items.value);

const client = ref("anonymous");
const { mutate, loading, onDone, onError } = anonymous_mutator(signup_user, {
  clientId: client,
});

const submit = handleSubmit(async (values) => {
  let variables = {
    username: values["user_name"],
    email: values["email"],
    phone_number: values["phone_number"],
    password_hash: values["password"],
    first_name: values["first_name"],
    last_name: values["last_name"],
    middle_name: values["middle_name"],
  };
  mutate({
    input: variables,
  });
});
onDone((result) => {
  console.log("Mutation successful!", result.data);
  let title = "Signup successful! Please log in.";
  let description =
    "Your account has been created successfully. You can now log in with your credentials.";
  successNotify(title, description);
  console.log("refetch");
});
onError((error) => {
  console.error("Mutation error:", error);
  let title = "Signup failed!";
  let description = error.messsage;
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
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Sign Up</h2>

      <!-- <div
        v-if="signupSuccessMessage"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <strong class="font-bold">Success!</strong>
        <span class="block sm:inline">{{ signupSuccessMessage }}</span>
      </div> -->
      <form @submit.prevent="submit">
        <div>
          <div class="gap-y-10">
            <HTextfield
              rules="required"
              name="user_name"
              placeholder="UserName"
              class="text-gray-600 focus:border-primary duration-200"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 mt-5"
                >
                  User name <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
          <div>
            <HTextfield
              rules="required"
              name="first_name"
              placeholder="FirstName"
              class="text-gray-600 focus:border-primary duration-200"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1 mt-5 duration-200"
                >
                  First Name <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
          <div>
            <HTextfield
              rules="required"
              name="middle_name"
              placeholder="MiddleName"
              class="text-gray-600 focus:border-primary duration-200"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1 mt-5 duration-200"
                >
                  Middle Name <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
          <div>
            <HTextfield
              rules="required"
              name="last_name"
              placeholder="LastName"
              class="text-gray-600 focus:border-primary duration-200"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 mt-5"
                >
                  Last Name <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
          <div>
            <HTextfield
              rules="required|ethiopian_phone_number"
              name="phone_number"
              placeholder="PhoneNumber"
              class="text-gray-600 focus:border-primary duration-200"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1duration-200 mt-5"
                >
                  Phone Number<span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
          <div>
            <HTextfield
              rules="required|email"
              name="email"
              placeholder="Email"
              class="focus:border-primary duration-200"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 mt-5"
                >
                  Email address <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
          <div>
            <HTextfield
              rules="required"
              trailingIcon="mdi:eye-outline"
              type="password"
              name="password"
              placeholder="Password"
              class="text-gray-600 focus:border-primary dark:bg-gray-500 duration-200"
            >
              <template #label>
                <h1
                  class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 mt-5"
                >
                  Password <span class="text-red-600">*</span>
                </h1>
              </template>
            </HTextfield>
          </div>
        </div>

        <div class="mt-5">
          <button
            :disabled="loading"
            type="submit"
            class="bg-green-600 px-3 py-2 shadow-md rounded-md w-full"
          >
            <Icon
              name="svg-spinners:ring-resize"
              class="text-2xl text-gray-300"
              v-if="loading"
            />
            Sign Up
          </button>
          <div class="mt-3">
            <NuxtLink
              to="/auth/login"
              class="inline-block align-baseline font-bold text-sm text-black-500 hover:text-blue-800"
            >
              Already have an account? Login
            </NuxtLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
