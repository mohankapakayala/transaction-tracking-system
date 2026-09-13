import type { Metadata } from "next";

import { UserIcon } from "@/components/common/icons";
import { ProfileTabs } from "@/features/profile/components/ProfileTabs";

export const metadata: Metadata = {
  title: "Profile | TMS",
  description: "Your name, contact details and security settings.",
};

export default function ProfilePage() {
  return (
    <>
      <h1 className="flex items-center gap-2.5 text-2xl font-semibold text-slate-900">
        <UserIcon className="size-6 text-slate-500" />
        Profile
      </h1>

      <div className="mt-6">
        <ProfileTabs />
      </div>
    </>
  );
}
