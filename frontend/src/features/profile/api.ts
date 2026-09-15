import { authFetch } from "@/features/auth/client";

export type Profile = {
  full_name: string;
  /** Identifies the account, so it is read-only here. */
  username: string;
  email: string;
  work_phone: string;
};

export type ProfileUpdate = Pick<Profile, "full_name" | "email" | "work_phone">;

/** The signed-in user's own profile — the account comes from the token. */
export function getProfile() {
  return authFetch<Profile>("/auth/profile/");
}

export function updateProfile(payload: ProfileUpdate) {
  return authFetch<Profile>("/auth/profile/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
