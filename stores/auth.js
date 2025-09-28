import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    loggedInUser: (state) => state.user,
    authToken: (state) => state.token,
    decodedToken: (state) => {
      if (state.token) {
        try {
          return jwtDecode(state.token);
        } catch (error) {
          console.error("Failed to decode token:", error);
          return null;
        }
      }
      return null;
    },
    userId: (state) => {
      const decoded = state.decodedToken;
      if (!decoded) return null;

      return (
        decoded.user_id ||
        decoded["https://hasura.io/jwt/claims"]?.["x-hasura-user-id"] ||
        null
      );
    },
  },

  actions: {
    login(userData, token) {
      this.user = userData;
      this.token = token;

      // also set cookie for Apollo
      useCookie("recipe_app_token", {
        maxAge: 60 * 60 * 24 * 30, // 30 days
      }).value = token;
    },
    logout() {
      this.user = null;
      this.token = null;

      // clear cookie for Apollo
      const cookie = useCookie("recipe_app_token");
      cookie.value = null;
    },
    initialize() {
      const cookie = useCookie("recipe_app_token");
      if (cookie.value) {
        this.token = cookie.value;
      }
    },
  },

  persist: true,
});
