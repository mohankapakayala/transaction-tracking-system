"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/Button";
import {
  clearSession,
  getStoredUser,
  parseUser,
  readStoredUser,
  subscribeToSession,
} from "@/features/auth/session";

export function DashboardGreeting() {
  const router = useRouter();

  // `localStorage` is unavailable while prerendering, hence the null snapshot.
  const raw = useSyncExternalStore(subscribeToSession, readStoredUser, () => null);
  const user = useMemo(() => parseUser(raw), [raw]);

  useEffect(() => {
    // Read directly rather than trusting `raw`, which is null until hydration.
    if (!getStoredUser()) router.replace("/login");
  }, [raw, router]);

  if (!user) return null;

  return (
    <>
      <h1 className="text-3xl font-semibold text-slate-900">
        Signed in as {user.username}
      </h1>
      <p className="text-slate-500">Your dashboard goes here.</p>
      <Button
        className="max-w-xs"
        onClick={() => {
          clearSession();
          router.replace("/login");
        }}
      >
        Log out
      </Button>
    </>
  );
}
