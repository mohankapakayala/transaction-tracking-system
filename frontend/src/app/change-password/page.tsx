import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/common/Logo";
import { AuthBrandPanel } from "@/features/auth/components/AuthBrandPanel";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { SessionGuard } from "@/features/auth/components/SessionGuard";

export const metadata: Metadata = {
  title: "Change Password | TMS",
  description: "Update the password on your TMS account.",
};

export default function ChangePasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-100 p-4 font-sans sm:p-8">
      {/* This page sits outside the `(app)` shell, so it carries its own guard. */}
      <SessionGuard>
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl lg:min-h-[620px] lg:grid-cols-2">
          <AuthBrandPanel
            title="Keep Your Account Safe"
            description="Update your password regularly to protect your finances."
          />

          <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
            <Logo tone="dark" className="mb-10 self-start lg:hidden" />

            <div className="w-full max-w-sm">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                Change Password
              </h1>
              <p className="mt-2 text-base text-slate-500">
                Choose a new password. This signs you out on your other devices.
              </p>

              <div className="mt-9">
                <ChangePasswordForm />
              </div>

              <p className="mt-6 text-center text-sm text-slate-600">
                <Link
                  href="/dashboard"
                  className="font-medium text-brand hover:underline"
                >
                  Back to dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </SessionGuard>
    </main>
  );
}
