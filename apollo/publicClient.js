import { defineApolloClient } from "@nuxtjs/apollo";

export default defineApolloClient({
  httpEndpoint: process.env.VITE_RECIPE_BASICS_GRAPH_URL,
  browserHttpEndpoint: process.env.VITE_RECIPE_BASICS_GRAPH_URL,
  httpLinkOptions: {
    headers: {
      "x-hasura-role": "public",
    },
  },
  websocketsOnly: false,
  defaultOptions: {},
  inMemoryCacheOptions: {},
  tokenName: "recipe_app_token",
  tokenStorage: "cookie",
  authHeader: "Authorization",
});
