import { defineApolloClient } from "@nuxtjs/apollo";

export default defineApolloClient({
  httpEndpoint: process.env.VITE_RECIPE_BASICS_GRAPH_URL,
  browserHttpEndpoint: process.env.VITE_RECIPE_BASICS_GRAPH_URL,
  httpLinkOptions: {},
  websocketsOnly: false,
  defaultOptions: {},
  inMemoryCacheOptions: {},

  // authType: "Bearer",
});
