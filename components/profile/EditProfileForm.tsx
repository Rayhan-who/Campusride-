"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileActionState } from "@/lib/data/profile";
import { Field, SelectField } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { DEPARTMENTS } from "@/lib/validation/auth";
import type { Profile } from "@/types/domain";

const initialState: ProfileActionState = { error: null };

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field id="fullName" name="fullName" label="Full name" defaultValue={profile.full_name} required />
      <SelectField
        id="department"
        name="department"
        label="Department"
        defaultValue={profile.department ?? ""}
        required
      >
        <option value="" disabled>
          Select department
        </option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </SelectField>
      <Field id="phone" name="phone" label="Phone number" type="tel" defaultValue={profile.phone ?? ""} required />

      {state.error && (
        <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
