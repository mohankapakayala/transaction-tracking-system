"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { GeneralInformationForm } from "@/features/profile/components/GeneralInformationForm";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "general", label: "General Information" },
  { id: "history", label: "History & Permissions" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProfileTabs() {
  const [active, setActive] = useState<TabId>("general");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /** Left/right arrows move between tabs, as expected of a tablist. */
  function handleKeyDown(event: React.KeyboardEvent) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (step === 0) return;

    event.preventDefault();

    const index = TABS.findIndex((tab) => tab.id === active);
    const next = TABS[(index + step + TABS.length) % TABS.length];

    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Profile sections"
        onKeyDown={handleKeyDown}
        className="flex gap-8 border-b border-slate-200"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[tab.id] = node;
            }}
            type="button"
            role="tab"
            id={`${tab.id}-tab`}
            aria-selected={active === tab.id}
            aria-controls={`${tab.id}-panel`}
            // Only the active tab is in the tab order; arrows reach the rest.
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            className={cn(
              "-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              active === tab.id
                ? "border-brand text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <Panel id="general" active={active}>
          <GeneralInformationForm />
        </Panel>

        <Panel id="history" active={active}>
          <h2 className="text-xl font-semibold text-slate-900">
            History &amp; Permissions
          </h2>
          <p className="mt-2 max-w-prose text-sm text-slate-500">
            Account activity and role permissions will appear here once the
            behaviour is defined.
          </p>

          <p className="mt-6 text-sm text-slate-600">
            To change your password, go to{" "}
            <Link
              href="/change-password"
              className="font-medium text-brand hover:underline"
            >
              Change Password
            </Link>
            .
          </p>
        </Panel>
      </div>
    </>
  );
}

function Panel({
  id,
  active,
  children,
}: {
  id: TabId;
  active: TabId;
  children: React.ReactNode;
}) {
  // Unmounted rather than hidden, so the inactive panel does not fetch or hold
  // a half-typed password in memory.
  if (active !== id) return null;

  return (
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab`}>
      {children}
    </div>
  );
}
