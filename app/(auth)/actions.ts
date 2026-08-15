"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validation/auth";

export interface AuthActionState {
  error: string | null;
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    universityEmail: formData.get("universityEmail"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.universityEmail,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect("/");
}

export async function register(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    studentId: formData.get("studentId"),
    universityEmail: formData.get("universityEmail"),
    department: formData.get("department"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.universityEmail,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        student_id: parsed.data.studentId,
        department: parsed.data.department,
        phone: parsed.data.phone,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  // Signing up (with email confirmation disabled) also starts a session —
  // sign it back out so the student has to log in manually, per the intended flow.
  await supabase.auth.signOut();
  redirect("/login?registered=1");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
