import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [],
  }),

  getters: {
    totalItems: (state) =>
      state.cartItems.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: (state) =>
      state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    getCartItems: (state) => state.cartItems,
  },

  actions: {
    addToCart(recipe) {
      const existingItem = this.cartItems.find(
        (item) => item.recipeId === recipe.id
      );
      const imageUrl =
        recipe.recipe_images?.[0]?.image_url || "/images/placeholder.png";

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push({
          recipeId: recipe.id,
          name: recipe.title,
          price: recipe.price_etb,
          quantity: 1,
          image_url: imageUrl,
        });
      }

      this.saveCartToLocalStorage();
    },

    removeFromCart(recipeId) {
      this.cartItems = this.cartItems.filter(
        (item) => item.recipeId !== recipeId
      );
      this.saveCartToLocalStorage();
    },

    updateQuantity(recipeId, newQuantity) {
      const item = this.cartItems.find((item) => item.recipeId === recipeId);
      if (item) {
        if (newQuantity > 0) {
          item.quantity = newQuantity;
        } else {
          this.removeFromCart(recipeId);
        }
      }
      this.saveCartToLocalStorage();
    },

    clearCart() {
      this.cartItems = [];
      localStorage.removeItem("cartItems");
    },

    loadCartFromLocalStorage() {
      if (process.client) {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
          try {
            this.cartItems = JSON.parse(storedCart);
          } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
            this.cartItems = [];
          }
        }
      }
    },

    saveCartToLocalStorage() {
      if (process.client) {
        localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      }
    },
  },
});
