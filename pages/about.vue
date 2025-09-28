<script setup>
import { ref } from "vue";
import insert_contact from "@/query/contact/insert_contact.gql";
import anonymous_mutator from "~/composables/default/anonymous_mutator";
import Notify from "@/use/notify";
const { notify } = Notify();

const { handleSubmit } = useForm({});
const role = "user";
const client = ref("anonymous");

const { mutate, loading, onDone, onError } = anonymous_mutator(insert_contact, {
  clientId: client,
});

const submit = handleSubmit(async (values) => {
  console.log("the value of the items ", values);
  let variables = {
    email: values["email"],
    name: values["name"],
    subject: values["subject"],
    message: values["message"],
  };
  console.log("the variable we sent ", variables);
  mutate({
    input: variables,
  });
});
onDone((data) => {
  console.log(
    "the value of the data i get from the rsponse looks like this one",
    data
  );
  notify({
    title: "Message Submitted!",
    description: "Message Submitted successfully!",
    cardClass: "bg-green-200 mt-14",
    icon: "line-md:confirm-circle",
    iconClass: "text-green-400",
    borderClass: "border-l-8 border-green-300 rounded-l-lg",
  });
});
</script>
<template>
  <div class="bg-gray-100 min-h-screen py-12 sm:py-16 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1
          class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-3 dark:text-secondary-lite"
        >
          Get in Touch
        </h1>
        <p class="text-lg text-gray-600 dark:text-secondary-lite">
          Have questions, feedback, or just want to say hello? We'd love to hear
          from you!
        </p>
      </div>

      <div
        class="bg-white rounded-lg dark:bg-gray-900 dark:shadow-xl dark:shadow-gray-500 shadow-xl p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        <div>
          <h2
            class="text-2xl font-bold text-gray-900 mb-6 dark:text-secondary-lite"
          >
            Send us a Message
          </h2>
          <form @submit.prevent="submit" class="space-y-6">
            <div>
              <HTextfield
                rules="required"
                name="name"
                placeholder="Name"
                class="text-gray-600 focus:border-primary duration-200"
              >
                <template #label>
                  <h1
                    class="block text-sm font-medium leading-6 text-gray-900 mb-1 duration-200 mt-5 dark:text-secondary-lite"
                  >
                    Name <span class="text-red-600">*</span>
                  </h1>
                </template>
              </HTextfield>
            </div>
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
                name="subject"
                placeholder="Subject"
                class="text-gray-600 focus:border-primary duration-200"
              >
                <template #label>
                  <h1
                    class="block text-sm font-medium leading-6 dark:text-secondary-lite text-gray-900 mb-1 duration-200 mt-5"
                  >
                    Subject <span class="text-red-600">*</span>
                  </h1>
                </template>
              </HTextfield>
            </div>
            <div>
              <HTextfield
                rules="required"
                name="message"
                placeholder="Message"
                class="text-gray-600 focus:border-primary duration-200"
              >
                <template #label>
                  <h1
                    class="block text-sm font-medium leading-6 dark:text-secondary-lite text-gray-900 mb-1 duration-200 mt-5"
                  >
                    Your message <span class="text-red-600">*</span>
                  </h1>
                </template>
              </HTextfield>
            </div>
            <button
              type="submit"
              class="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
              :disabled="loading"
            >
              <!-- <span v-if="loading" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span> -->
              <span>Send Message</span>
            </button>
          </form>
          <!-- <p
            v-if="formStatus.message"
            :class="[
              'mt-4 text-center',
              {
                'text-green-600': formStatus.type === 'success',
                'text-red-600': formStatus.type === 'error',
              },
            ]"
          >
            {{ formStatus.message }}
          </p> -->
        </div>

        <div>
          <h2
            class="text-2xl font-bold text-gray-900 mb-6 dark:text-secondary-lite"
          >
            Our Contact Details
          </h2>
          <div class="space-y-6 text-gray-700">
            <div class="flex items-center">
              <i class="fas fa-envelope text-violet-600 text-xl mr-3"></i>
              <div>
                <p class="font-medium dark:text-secondary-lite">
                  Email Address
                </p>
                <a
                  href="mailto:info@foodrecipe.com"
                  class="text-blue-600 hover:underline"
                  >info@foodrecipe.com</a
                >
              </div>
            </div>
            <div class="flex items-center">
              <i class="fas fa-phone-alt text-violet-600 text-xl mr-3"></i>
              <div>
                <p class="font-medium dark:text-secondary-lite">Phone Number</p>
                <a
                  href="tel:+251912345678"
                  class="text-blue-600 hover:underline dark:text-secondary-lite"
                  >+251 928 302 037</a
                >
              </div>
            </div>
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt text-violet-600 text-xl mr-3"></i>
              <div class="dark:text-secondary-lite">
                <p class="font-medium">Our Location</p>
                <p>Addis Ababa, Ethiopia</p>
                <p>Bole, Behind DH geda tower, Afomi Building 3rd floor</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <h3
              class="text-xl font-bold text-gray-900 mb-4 dark:text-secondary-lite"
            >
              Find us on the Map
            </h3>
            <div
              class="bg-gray-200 rounded-lg overflow-hidden"
              style="height: 250px"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.8126160094403!2d38.78343247589878!3d8.98938369107039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8567f1792317%3A0xe8fe1bef62c710ac!2sMinab%20IT%20Solutions%20PLC!5e0!3m2!1sen!2set!4v1750111442268!5m2!1sen!2set"
                width="600"
                height="450"
                style="border: 0"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
