"use client";

import { useState } from "react";

import { TextField } from "@/components/ui/TextField";

type PasswordFieldProps = Omit<
  React.ComponentProps<typeof TextField>,
  "type" | "trailing"
>;

/** Password input with a show/hide toggle. */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className={
            "flex size-8 items-center justify-center rounded-md text-slate-400 transition-colors " +
            "hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          }
        >
          <EyeIcon crossed={visible} />
        </button>
      }
    />
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
      focusable="false"
    >
      <path d="M2.4 12S6 5.5 12 5.5 21.6 12 21.6 12 18 18.5 12 18.5 2.4 12 2.4 12Z" />
      <circle cx="12" cy="12" r="2.9" />
      {crossed ? <path d="m4 20 16-16" /> : null}
    </svg>
  );
}
