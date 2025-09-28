import useNotify from "@/use/notify";
import checkRole from "~/composables/functions/role-checker";
export default defineNuxtPlugin((nuxtApp) => {
  const { notify } = useNotify();
  nuxtApp.hook("apollo:error", (error) => {
    const operationContext = error.operation?.getContext();

    const value = checkRole(operationContext.role);
    if (error.graphQLErrors?.length) {
      if (
        error.graphQLErrors[0]?.message == "Could not verify JWT: JWTExpired"
      ) {
        notify({
          title: "Session Expired!",
          description: "Session Expired, Please try to signin again!",
          cardClass: "bg-green-100 mt-14",
          icon: "simple-line-icons:check",
          iconClass: "text-green-400",
          borderClass: "border-l-8 border-green-300 rounded-l-lg",
        });
        return navigateTo("/");
      } else if (
        error.graphQLErrors[0]?.message == "internal error" &&
        error.graphQLErrors[0]?.extensions?.internal?.response?.body?.message ==
          "Message: bad user credentials, Locations: []"
      ) {
        return navigateTo("/");
      } else {
        if (value)
          notify({
            title: "Query Failed!",
            description: error.graphQLErrors[0]?.message.toUpperCase(),
            cardClass: "bg-red-100 mt-14",
            icon: "simple-line-icons:check",
            iconClass: "text-red-400",
            borderClass: "border-l-8 border-red-300 rounded-l-lg",
          });
      }
    } else if (error.networkError) {
      console.log("error.networkError", error);

      notify({
        title: "Network Error!",
        description: `${error.networkError.message} "${error.operation.operationName}"`,
        cardClass: "bg-red-100 mt-14",
        icon: "ph:network-slash-thin",
        iconClass: "text-red-400",
        borderClass: "border-l-8 border-red-300 rounded-l-lg",
      });
    }

    // Handle different error cases
  });
});
