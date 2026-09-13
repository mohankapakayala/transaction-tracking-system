"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { changePassword } from "@/features/auth/api";
import { SessionExpiredError } from "@/features/auth/client";
import { saveSession } from "@/features/auth/session";

/** Just the fields — the surrounding heading belongs to whoever renders it. */
export function ChangePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Read the fields before awaiting: `currentTarget` is null afterwards.
    const form = event.currentTarget;
    const fields = new FormData(form);

    setError(null);
    setDone(false);
    setSubmitting(true);

    try {
      const result = await changePassword({
        current_password: String(fields.get("currentPassword") ?? ""),
        new_password: String(fields.get("newPassword") ?? ""),
        confirm_password: String(fields.get("confirmPassword") ?? ""),
      });

      // Every other refresh token was just revoked, including this device's.
      // Storing the replacement pair is what keeps the user signed in here.
      saveSession(result);

      form.reset();
      setDone(true);
    } catch (cause) {
      if (cause instanceof SessionExpiredError) {
        router.replace("/login");
        return;
      }

      setError(
        cause instanceof Error
          ? cause.message
          : "Could not change your password. Please retry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-5">
        <PasswordField
          id="currentPassword"
          name="currentPassword"
          label="Current Password"
          autoComplete="current-password"
          required
          placeholder="Enter your current password"
        />

        <PasswordField
          id="newPassword"
          name="newPassword"
          label="New Password"
          autoComplete="new-password"
          required
          placeholder="Create a new password"
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          autoComplete="new-password"
          required
          placeholder="Re-enter your new password"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {done ? (
        <p
          role="status"
          className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          Your password has been changed.
        </p>
      ) : null}

      <Button
        type="submit"
        className="mt-6 disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Saving…" : "Change Password"}
      </Button>
    </form>
  );
}
