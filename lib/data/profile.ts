"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { changePasswordSchema, editProfileSchema } from "@/lib/validation/auth";
import type { Profile } from "@/types/domain";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error || !data) return null;
  return data;
}

export async function getBookingCounts(): Promise<{ total: number; upcoming: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { total: 0, upcoming: 0 };

  const today = new Date().toISOString().slice(0, 10);

  const { count: total } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: upcoming } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("travel_date", today)
    .in("status", ["Confirmed", "Pending"]);

  return { total: total ?? 0, upcoming: upcoming ?? 0 };
}

export interface ProfileActionState {
  error: string | null;
  success?: boolean;
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = editProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    department: formData.get("department"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      department: parsed.data.department,
      phone: parsed.data.phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  redirect("/profile");
}

export async function changePasswordAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = changePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) return { error: error.message };

  redirect("/profile");
}
