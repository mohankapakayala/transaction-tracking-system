import type { Metadata } from "next";

import { Logo } from "@/components/common/Logo";
import { AuthBrandPanel } from "@/features/auth/components/AuthBrandPanel";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register | TMS",
  description: "Create your TMS account to start managing your finances.",
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-100 p-4 font-sans sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl lg:min-h-[620px] lg:grid-cols-2">
        <AuthBrandPanel
          title="Create Your Account"
          description="Join us and start managing your financial portfolio."
        />

        <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
          <Logo tone="dark" className="mb-10 self-start lg:hidden" />
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
