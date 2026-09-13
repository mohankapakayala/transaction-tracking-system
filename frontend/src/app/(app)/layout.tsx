import { AppShell } from "@/components/layout/AppShell";
import { SessionGuard } from "@/features/auth/components/SessionGuard";

/**
 * Frame shared by every signed-in screen. The group keeps the URLs flat —
 * `/dashboard`, `/profile` — while leaving the auth screens outside the shell.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SessionGuard>
      <AppShell>{children}</AppShell>
    </SessionGuard>
  );
}
