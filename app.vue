<script setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();

cartStore.loadCartFromLocalStorage();
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
