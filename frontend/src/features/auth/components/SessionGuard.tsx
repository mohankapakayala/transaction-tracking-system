"use client";

import { useRequireSession } from "@/features/auth/useSession";

/**
 * Hides its children from anyone without a session and sends them to `/login`.
 *
 * This is a convenience, not a security boundary — every endpoint behind it is
 * protected server-side by `IsAuthenticated`.
 */
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const user = useRequireSession();

  if (!user) return null;

  return <>{children}</>;
}
