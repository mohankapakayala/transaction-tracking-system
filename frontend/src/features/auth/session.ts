import type { AuthUser } from "@/features/auth/api";

const ACCESS_TOKEN_KEY = "tms.accessToken";
const REFRESH_TOKEN_KEY = "tms.refreshToken";
const USER_KEY = "tms.user";

type Session = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export function saveSession({ access, refresh, user }: Session) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Raw JSON for the signed-in user, or null. Stable enough for `useSyncExternalStore`. */
export function readStoredUser() {
  return localStorage.getItem(USER_KEY);
}

export function parseUser(raw: string | null): AuthUser | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  return parseUser(readStoredUser());
}

/** Notifies subscribers when another tab logs in or out. */
export function subscribeToSession(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
