"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { register } from "@/features/auth/api";
import { saveSession } from "@/features/auth/session";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Read the fields before awaiting: `currentTarget` is null afterwards.
    const fields = new FormData(event.currentTarget);

    setError(null);
    setSubmitting(true);

    try {
      const result = await register({
        full_name: String(fields.get("fullName") ?? "").trim(),
        username: String(fields.get("username") ?? "").trim(),
        email: String(fields.get("email") ?? "").trim(),
        password: String(fields.get("password") ?? ""),
        confirm_password: String(fields.get("confirmPassword") ?? ""),
      });

      saveSession(result);
      router.push("/dashboard");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Registration failed. Please retry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit} noValidate>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
        Register
      </h1>
      <p className="mt-2 text-base text-slate-500">
        Join us for free and create your account.
      </p>

      <div className="mt-9 flex flex-col gap-5">
        <TextField
          id="fullName"
          name="fullName"
          label="Full Name"
          type="text"
          autoComplete="name"
          required
          placeholder="John Smith"
        />

        <TextField
          id="username"
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          required
          placeholder="johnsmith"
        />

        <TextField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          required
          placeholder="john.smith@email.com"
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          required
          placeholder="Create a password"
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          required
          placeholder="Re-enter your password"
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

      <Button
        type="submit"
        className="mt-6 disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Creating account…" : "Create Account"}
      </Button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
