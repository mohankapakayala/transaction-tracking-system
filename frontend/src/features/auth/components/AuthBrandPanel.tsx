import { BankingIllustration } from "@/components/common/BankingIllustration";
import { Logo } from "@/components/common/Logo";

type AuthBrandPanelProps = {
  title: string;
  description: string;
};

/** Blue marketing panel shown beside the auth forms on large screens. */
export function AuthBrandPanel({ title, description }: AuthBrandPanelProps) {
  return (
    <div className="relative hidden overflow-hidden bg-linear-to-br from-brand-ink via-brand-deep to-brand p-10 lg:flex lg:flex-col">
      {/* Soft background shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-16 size-72 rounded-full bg-white/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-16 size-80 rounded-full bg-white/5"
      />

      <div className="relative">
        <Logo />
        <h2 className="mt-16 text-4xl font-bold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-4 max-w-xs text-lg leading-7 text-brand-soft">
          {description}
        </p>
      </div>

      <BankingIllustration className="relative mt-auto" />
    </div>
  );
}
