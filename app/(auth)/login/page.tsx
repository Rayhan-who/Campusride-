"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthActionState } from "../actions";
import { Field } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";

const initialState: AuthActionState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <Card className="p-6">
      <h1 className="mb-1 text-lg font-semibold text-text">Welcome back</h1>
      <p className="mb-6 text-sm text-text-muted">
        Log in to book your university bus.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <Field
          id="universityEmail"
          name="universityEmail"
          label="University email"
          type="email"
          placeholder="you@university.edu"
          required
        />
        <Field
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />

        {state.error && (
          <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
          {pending ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        New to CampusRide?{" "}
        <Link href="/register" className="font-medium text-maroon">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
