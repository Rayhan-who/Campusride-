"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { busRequestSchema } from "@/lib/validation/busRequest";
import type { BusRequest } from "@/types/domain";

export interface BusRequestActionState {
  error: string | null;
  success?: boolean;
}

export async function createBusRequestAction(
  _prevState: BusRequestActionState,
  formData: FormData,
): Promise<BusRequestActionState> {
  const parsed = busRequestSchema.safeParse({
    universityName: formData.get("universityName"),
    busesRequired: formData.get("busesRequired"),
    requiredDate: formData.get("requiredDate"),
    requiredTime: formData.get("requiredTime"),
    purpose: formData.get("purpose"),
    pickupLocation: formData.get("pickupLocation"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("bus_requests").insert({
    user_id: user.id,
    university_name: parsed.data.universityName,
    buses_required: parsed.data.busesRequired,
    required_date: parsed.data.requiredDate,
    required_time: parsed.data.requiredTime,
    purpose: parsed.data.purpose,
    pickup_location: parsed.data.pickupLocation,
    notes: parsed.data.notes || null,
  });

  if (error) {
    return { error: error.message };
  }

  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "bus_request_submitted",
    message: `Your bus request for ${parsed.data.universityName} was submitted and is pending review.`,
  });

  revalidatePath("/bus-requests");
  return { error: null, success: true };
}

export async function getMyBusRequests(): Promise<BusRequest[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bus_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}
