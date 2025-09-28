import { jwtDecode } from "jwt-decode";

const cookie = useCookie("recipe_app_token");
let userData = "";

if (cookie.value) {
  userData = jwtDecode(cookie.value).metadata;
  console.log("User Data:", userData);
}

const role_ = userData?.roles?.includes("user") ? "user" : "anonymous";

const client_ = ref("default");

export default function (query, role = role_, client = client_) {
  const { mutate, onDone, loading, onError } = useMutation(query, () => ({
    fetchPolicy: "network-only",
    clientId: client.value,
    context: {
      headers: {
        "x-hasura-role": role,
      },
    },
  }));
  return {
    mutate,
    loading,
    onDone,
    onError,
  };
}
