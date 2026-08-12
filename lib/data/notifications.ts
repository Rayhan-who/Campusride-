"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Notification } from "@/types/domain";

export async function getMyNotifications(): Promise<Notification[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !data) return [];
  return data as unknown as Notification[];
}

export async function markAllNotificationsReadAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq(
    "is_read",
    false,
  );

  revalidatePath("/notifications");
  revalidatePath("/");
}
