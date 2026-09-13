"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { LogoutIcon, UserIcon } from "@/components/common/icons";
import { Logo } from "@/components/common/Logo";
import { NAV_ITEMS, type NavItem } from "@/components/layout/navigation";
import { signOut } from "@/features/auth/signOut";
import { cn } from "@/lib/cn";

const ROW =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

type AppSidebarProps = {
  /** Called after a navigation choice, so the mobile drawer can close itself. */
  onNavigate?: () => void;
};

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <nav
      aria-label="Main"
      className="flex h-full w-64 shrink-0 flex-col bg-navy px-4 py-6 text-white"
    >
      <Link href="/dashboard" onClick={onNavigate} className="px-2">
        <Logo />
      </Link>

      <ul className="mt-8 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <NavRow item={item} pathname={pathname} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>

      {/* Account actions sit at the bottom, away from the section links. */}
      <ul className="mt-auto flex flex-col gap-1 pt-8">
        <li>
          <NavRow
            item={{ label: "Profile", icon: UserIcon, href: "/profile" }}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        </li>
        <li>
          <button
            type="button"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              await signOut();
              router.replace("/login");
            }}
            className={cn(
              ROW,
              "text-white/70 hover:bg-navy-soft hover:text-white",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              "disabled:opacity-60",
            )}
          >
            <LogoutIcon />
            {signingOut ? "Logging out…" : "Logout"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

function NavRow({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  // Sections without a screen yet stay visible but inert, so the shell matches
  // the product's shape without pretending the pages exist.
  if (!item.href) {
    return (
      <span
        aria-disabled
        title="Not available yet"
        className={cn(ROW, "cursor-not-allowed text-white/35")}
      >
        <Icon />
        {item.label}
      </span>
    );
  }

  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        ROW,
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        active
          ? "bg-brand text-white"
          : "text-white/70 hover:bg-navy-soft hover:text-white",
      )}
    >
      <Icon />
      {item.label}
    </Link>
  );
}
