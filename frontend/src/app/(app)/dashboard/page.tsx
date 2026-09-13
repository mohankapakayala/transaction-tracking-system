import type { Metadata } from "next";

import { DashboardGreeting } from "@/features/auth/components/DashboardGreeting";

export const metadata: Metadata = {
  title: "Dashboard | TMS",
};

/** Placeholder landing page so the login flow has somewhere to go. */
export default function DashboardPage() {
  return <DashboardGreeting />;
}
