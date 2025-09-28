export function parse(err) {
  if (err instanceof Error) {
    return {
      type: "error",
      description: err.message,
    };
  }
  // Fallback for other non-Error types
  return {
    type: "error",
    description: "An unexpected error occurred.",
  };
}
