import { api } from "./api.js";

export async function loginWithGoogle(idToken) {
  return api.post("/auth/google", { idToken });
}

export async function fetchCurrentUser() {
  return api.get("/auth/me");
}

export async function logout() {
  await api.post("/auth/logout");
}
