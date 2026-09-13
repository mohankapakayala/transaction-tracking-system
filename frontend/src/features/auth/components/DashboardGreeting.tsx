"use client";

import { useSession } from "@/features/auth/useSession";

export function DashboardGreeting() {
  // The surrounding layout already guards the route and redirects; this only
  // needs the user, which is null until hydration.
  const user = useSession();

  if (!user) return null;

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900">
        Signed in as {user.username}
      </h1>
      <p className="mt-1 text-slate-500">Your dashboard goes here.</p>
    </>
  );
}
