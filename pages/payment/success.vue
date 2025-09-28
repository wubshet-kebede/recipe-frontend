<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useCartStore } from "@/stores/cart";
import Notify from "@/use/notify";
import { decode } from "html-entities"; // <-- import decode

const route = useRoute();
const router = useRouter();
const { notify } = Notify();

// Cart store
const cartStore = useCartStore();

// State for display
const status = ref("");
const orderId = ref("");
const txRef = ref("");
const message = ref("");

onMounted(() => {
  const rawQuery = decode(window.location.search);
  const params = new URLSearchParams(rawQuery);

  status.value =
    params.get("status") === "success"
      ? "completed"
      : params.get("status") || "unknown";
  orderId.value = params.get("order_id") || "";
  txRef.value = params.get("tx_ref") || params.get("trx_ref") || "";
  message.value = params.get("message") || "";

  if (status.value === "completed") {
    cartStore.clearCart();
    notify({
      title: "Payment Success!",
      description: message.value || "Your payment was successful.",
      cardClass: "bg-green-200 mt-5",
      icon: "line-md:confirm-circle",
      iconClass: "text-green-400",
      borderClass: "border-l-8 border-green-300 rounded-l-lg",
    });
  } else if (status.value === "failed") {
    notify({
      title: "Payment Failed",
      description: message.value || "Your payment could not be completed.",
      cardClass: "bg-red-100 mt-5",
      icon: "bx:error-alt",
      iconClass: "text-red-600",
      borderClass: "border-l-8 border-red-600 rounded-l-lg",
    });
  } else {
    notify({
      title: "Payment Status Unknown",
      description: message.value || "Please check your order history.",
      cardClass: "bg-yellow-100 mt-5",
      icon: "bx:info-circle",
      iconClass: "text-yellow-600",
      borderClass: "border-l-8 border-yellow-400 rounded-l-lg",
    });
  }
});
</script>

<template>
  <div class="max-w-2xl mx-auto mt-10 text-center">
    <h1 class="text-2xl font-bold mb-5 dark:text-secondary-lite">
      Payment Status
    </h1>
    <p class="mb-2 dark:text-secondary-lite">
      Status: <strong>{{ status }}</strong>
    </p>
    <p class="mb-2 dark:text-secondary-lite">Order ID: {{ orderId }}</p>
    <p class="mb-2 dark:text-secondary-lite">Transaction Ref: {{ txRef }}</p>
    <p class="mb-4 dark:text-secondary-lite">{{ message }}</p>
    <button
      @click="router.push('/')"
      class="bg-primary text-white px-4 py-2 rounded"
    >
      Back to Recipes
    </button>
  </div>
</template>
