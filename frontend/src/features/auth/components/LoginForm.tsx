import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function LoginForm() {
  return (
    <form className="w-full max-w-sm">
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
          label="Email or Username"
          type="text"
          autoComplete="username"
          placeholder="Enter @example.com"
        />

        <div>
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
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

      <Button type="submit" className="mt-6">
        Login
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
