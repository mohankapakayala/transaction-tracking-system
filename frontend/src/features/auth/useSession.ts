"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import {
  getStoredUser,
  parseUser,
  readStoredUser,
  subscribeToSession,
} from "@/features/auth/session";

/**
 * The signed-in user, or null. Re-renders when another tab signs in or out.
 *
 * Always null on the first render: `localStorage` is unavailable while the
 * page is prerendered, so the value only arrives after hydration.
 */
export function useSession() {
  const raw = useSyncExternalStore(subscribeToSession, readStoredUser, () => null);

  return useMemo(() => parseUser(raw), [raw]);
}

/** `useSession`, plus a redirect to `/login` once we know there is no session. */
export function useRequireSession() {
  const router = useRouter();
  const user = useSession();

  useEffect(() => {
    // Read directly rather than trusting `user`, which is null until hydration.
    if (!getStoredUser()) router.replace("/login");
  }, [user, router]);

  return user;
}
