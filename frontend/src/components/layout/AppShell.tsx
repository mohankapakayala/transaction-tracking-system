"use client";

import { useEffect, useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/common/icons";
import { Logo } from "@/components/common/Logo";
import { AppSidebar } from "@/components/layout/AppSidebar";

/**
 * Sidebar-and-content frame for the signed-in screens.
 *
 * The sidebar is permanent from `lg` up and a drawer below it, where a fixed
 * 16rem column would leave nothing for the page itself.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [drawerOpen]);

  return (
    // The navy on the row fills the strip below the sticky sidebar when the
    // page is taller than the viewport.
    <div className="flex flex-1 font-sans lg:bg-navy">
      <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <AppSidebar />
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/50"
          />
          <div className="relative h-full">
            <AppSidebar onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-6 rounded-lg p-1.5 text-white/70 hover:bg-navy-soft hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 bg-navy px-4 py-3 text-white lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-label="Open navigation"
            className="rounded-lg p-1.5 hover:bg-navy-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MenuIcon />
          </button>
          <Logo className="[&_span]:text-xl [&_svg]:size-7" />
        </header>

        <main className="flex-1 bg-slate-100 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
