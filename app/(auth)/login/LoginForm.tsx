"use client";

import { useActionState } from "react";
import { login, type AuthActionState } from "../actions";
import { Field } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

const initialState: AuthActionState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
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
        <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}
