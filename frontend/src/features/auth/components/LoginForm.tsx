"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { login } from "@/features/auth/api";
import { saveSession } from "@/features/auth/session";

export function LoginForm() {
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
      const result = await login({
        username: String(fields.get("identifier") ?? "").trim(),
        password: String(fields.get("password") ?? ""),
      });

      saveSession(result);
      router.push("/dashboard");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Login failed. Please retry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit} noValidate>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
        Login
      </h1>
      <p className="mt-2 text-base text-slate-500">
        Enter your credentials to access your account.
      </p>

      <div className="mt-9 flex flex-col gap-5">
        <TextField
          id="identifier"
          name="identifier"
          label="Username"
          type="text"
          autoComplete="username"
          required
          placeholder="Enter your username"
        />

        <div>
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
          />
          <div className="mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
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
        {submitting ? "Signing in…" : "Login"}
      </Button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-brand hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
