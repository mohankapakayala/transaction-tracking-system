import { apiFetch } from "@/lib/api";
import { authFetch } from "@/features/auth/client";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
};

/** Shape returned by `LoginView` in the `login_register` app. */
export type LoginResponse = {
  message: string;
  user: AuthUser;
  access: string;
  refresh: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export function login(credentials: LoginCredentials) {
  return apiFetch<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export type RegisterPayload = {
  full_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
};

export function register(payload: RegisterPayload) {
  return apiFetch<LoginResponse>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Revokes the refresh token server-side so it cannot be replayed. */
export function logout(refresh: string) {
  return authFetch<{ message: string }>("/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
}

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

/**
 * Changing the password ends every other session, so the backend answers with
 * a fresh pair for this one. Store it or the next request will 401.
 */
export function changePassword(payload: ChangePasswordPayload) {
  return authFetch<LoginResponse>("/auth/change-password/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
