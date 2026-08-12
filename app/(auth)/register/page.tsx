"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, type AuthActionState } from "../actions";
import { Field, SelectField } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { DEPARTMENTS } from "@/lib/validation/auth";

const initialState: AuthActionState = { error: null };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <Card className="p-6">
      <h1 className="mb-1 text-lg font-semibold text-text">Create your account</h1>
      <p className="mb-6 text-sm text-text-muted">
        Register with your student details to start booking.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <Field id="fullName" name="fullName" label="Full name" placeholder="Ayesha Rahman" required />
        <Field id="studentId" name="studentId" label="Student ID" placeholder="20221-01-234" required />
        <Field
          id="universityEmail"
          name="universityEmail"
          label="University email"
          type="email"
          placeholder="you@university.edu"
          required
        />
        <SelectField id="department" name="department" label="Department" defaultValue="" required>
          <option value="" disabled>
            Select department
          </option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </SelectField>
        <Field id="phone" name="phone" label="Phone number" type="tel" placeholder="01XXXXXXXXX" required />
        <Field
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          required
        />

        {state.error && (
          <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
          {pending ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-maroon">
          Log in
        </Link>
      </p>
    </Card>
  );
}
