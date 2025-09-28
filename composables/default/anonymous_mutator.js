import { ref } from "vue";

const clientId_ = ref("anonymous");
export default function (query, { clientId = clientId_ }) {
  const { mutate, onDone, loading, onError } = useMutation(query, () => ({
    fetchPolicy: "network-only",
    clientId: clientId.value || "anonymous",
  }));
  return {
    mutate,
    loading,
    onDone,
    onError,
  };
}
