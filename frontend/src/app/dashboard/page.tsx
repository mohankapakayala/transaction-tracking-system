import type { Metadata } from "next";

import { DashboardGreeting } from "@/features/auth/components/DashboardGreeting";

export const metadata: Metadata = {
  title: "Dashboard | TMS",
};

/** Placeholder landing page so the login flow has somewhere to go. */
export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-100 p-8 font-sans">
      <DashboardGreeting />
    </main>
  );
}
