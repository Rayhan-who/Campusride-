"use client";

import { useActionState } from "react";
import { changePasswordAction, type ProfileActionState } from "@/lib/data/profile";
import { Field } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

const initialState: ProfileActionState = { error: null };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        id="password"
        name="password"
        label="New password"
        type="password"
        placeholder="At least 8 characters"
        required
      />
      <Field
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        placeholder="Re-enter new password"
        required
      />

      {state.error && (
        <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
