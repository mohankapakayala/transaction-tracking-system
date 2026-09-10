import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";

export function RegisterForm() {
  return (
    <form className="w-full max-w-sm">
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
          placeholder="John Smith"
        />

        <TextField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="john.smith@email.com"
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />
      </div>

      <Button type="submit" className="mt-6">
        Create Account
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
