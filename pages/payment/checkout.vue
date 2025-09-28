<script setup>
import chapa_payment from "@/query/payment/chapa_payment.gql";
import mutate_with_role from "~/composables/default/mutate_with_role";
import { useCartStore } from "@/stores/cart";

const role = "user";
const client = ref("authClient");
const {
  mutate: initiatePayment,
  onDone,
  onError,
} = mutate_with_role(chapa_payment, role, client);
const cartStore = useCartStore();
const payNow = () => {
  const recipeItems = cartStore?.cartItems.map((item) => ({
    recipeId: item.recipeId,
    quantity: item.quantity,
  }));

  initiatePayment({
    input: {
      recipeItems,
      amount: cartStore.totalPrice,
      currency: "ETB",
      returnUrl: "http://localhost:3000/payment/success",
    },
  });
};
onDone(({ data }) => {
  const url = data.initiate_chapa_payment.checkoutUrl;
  window.location.href = url;
});

onError((err) => {
  console.error("Payment failed:", err);
});
</script>
<template>
  <div class="bg-gray-100 min-h-screen py-10 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-8 sm:mb-12">
        Shopping Cart
      </h1>

      <div class="flex flex-col lg:flex-row gap-x-10 gap-y-2">
        <div class="flex-1 lg:pr-8">
          <h2
            class="text-xl font-bold text-gray-800 mb-6 dark:text-secondary-lite"
          >
            {{ cartStore.cartItems.length }} Recipe<span
              v-if="cartStore.cartItems.length !== 1"
              >s</span
            >
            in Cart
          </h2>
          <div class="w-full h-px bg-gray-300 mb-3"></div>

          <div
            v-if="cartStore.cartItems.length === 0"
            class="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <p
              class="text-lg font-medium text-gray-700 mb-4 dark:text-secondary-lite"
            >
              Your cart is empty.
            </p>
            <NuxtLink
              to="/"
              class="text-blue-600 font-semibold hover:underline inline-block dark:text-secondary-lite"
              >Start shopping!</NuxtLink
            >
          </div>

          <div v-else class="flex flex-col">
            <div
              v-for="(item, idx) in cartStore.cartItems"
              :key="item.recipeId"
              class="flex items-start dark:bg-gray-900 bg-white hover:shadow-md dark:shadow-md dark:shadow-gray-500 transition-shadow duration-200 p-4 md:p-6 gap-6"
            >
              <img
                :src="item.image_url || '/img/default-recipe-thumbnail.png'"
                class="w-32 h-20 object-cover rounded-md flex-shrink-0 border border-gray-100 bg-gray-50"
                alt="Recipe thumbnail"
              />
              <div class="flex-1 min-w-0 gap-y-5">
                <h3
                  class="font-semibold text-md text-gray-900 line-clamp-2 mb-1 text-nowrap"
                >
                  {{ item.name }}
                </h3>

                <div class="flex items-center gap-3 mb-2 mt-3">
                  <button
                    @click="
                      cartStore.updateQuantity(item.recipeId, item.quantity - 1)
                    "
                    :disabled="item.quantity <= 1"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-primaryLite text-gray-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    <Icon
                      name="fluent:text-indent-decrease-ltr-90-24-filled"
                      class="text-xl"
                    />
                  </button>
                  <span
                    class="w-8 text-center font-medium dark:text-secondary-lite"
                    >{{ item.quantity }}</span
                  >
                  <button
                    @click="
                      cartStore.updateQuantity(item.recipeId, item.quantity + 1)
                    "
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-primaryLite text-gray-700 font-bold text-lg hover:bg-gray-200 transition-colors"
                  >
                    <Icon name="gridicons:add-outline" class="text-xl" />
                  </button>
                </div>

                <div
                  class="flex items-center justify-between -ml-10 md:ml-0 mt-5"
                >
                  <div
                    class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium"
                  >
                    <button
                      @click="cartStore.removeFromCart(item.recipeId)"
                      class="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <span
                    class="text-sm text-gray-900 dark:text-secondary-lite ml-4 flex items-center gap-x-2 text-nowrap"
                  >
                    ETB
                    {{
                      (item.price * item.quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                    <Icon
                      name="noto:money-with-wings"
                      class="text-xl text-purple-300 px-3"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-96 flex-shrink-0 md:mt-14">
          <div
            class="bg-white p-8 sticky lg:top-24 border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
          >
            <div
              class="flex items-center justify-between text-xl font-bold mb-6 pb-4 border-b dark:border-gray-700 border-gray-200"
            >
              <span class="dark:text-secondary-lite">Total:</span>
              <span class="text-3xl text-red-700 font-extrabold"
                >ETB
                {{
                  cartStore.totalPrice?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}</span
              >
            </div>

            <button
              class="w-full bg-green-700 text-white text-lg font-bold py-3 rounded-md shadow-md hover:bg-purple-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mb-3"
              @click="payNow"
              :disabled="loadingPayment || cartStore.cartItems.length === 0"
            >
              <span
                v-if="loadingPayment"
                class="flex items-center justify-center"
              >
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
                Processing Payment...
              </span>
              <span v-else>Proceed to Payment</span>
            </button>

            <p
              v-if="paymentError"
              class="text-red-500 text-sm mt-4 text-center"
            >
              {{ paymentError }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
