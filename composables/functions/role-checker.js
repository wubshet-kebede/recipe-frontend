import { jwtDecode } from "jwt-decode";

export default function checkRole(role) {
  let value;
  const token = useCookie("recipe_app_token").value;
  if (token) {
    let userRolles =
      jwtDecode(token)["https://hasura.io/jwt/claims"]?.[
        "x-hasura-allowed-roles"
      ];
    console.log("userRolles", userRolles);
    console.log("role", role);
    userRolles.filter((e) => {
      if (e == role) {
        value = true;
      } else value = false;
    });
    return value;
  }
}
