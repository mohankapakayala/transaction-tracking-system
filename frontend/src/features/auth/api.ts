import { apiFetch } from "@/lib/api";

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
