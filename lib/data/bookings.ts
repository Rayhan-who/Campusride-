"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BookingWithSchedule } from "@/types/domain";

export interface BookingActionResult {
  error: string | null;
  bookingId?: string;
}

export async function createBusBookingAction(
  scheduleId: string,
  travelDate: string,
  seats: number,
): Promise<BookingActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_bus_booking", {
    p_schedule_id: scheduleId,
    p_travel_date: travelDate,
    p_seats: seats,
  });

  if (error || !data) {
    return { error: error?.message ?? "Could not complete booking." };
  }

  revalidatePath("/schedule");
  revalidatePath("/counters");
  revalidatePath("/bookings");
  revalidatePath("/");
  return { error: null, bookingId: data.id };
}

export async function cancelBookingAction(bookingId: string): Promise<BookingActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_booking", { p_booking_id: bookingId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/schedule");
  revalidatePath("/counters");
  revalidatePath("/bookings");
  revalidatePath("/");
  return { error: null };
}

export async function getMyBookings(): Promise<BookingWithSchedule[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, schedule:schedules(*, bus:buses(*), route:routes(*), counter:counters(*, university:universities(*)))",
    )
    .eq("user_id", user.id)
    .order("travel_date", { ascending: false });

  if (error || !data) return [];
  return data as unknown as BookingWithSchedule[];
}

export async function getBookingById(bookingId: string): Promise<BookingWithSchedule | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, schedule:schedules(*, bus:buses(*), route:routes(*), counter:counters(*, university:universities(*)))",
    )
    .eq("id", bookingId)
    .single();

  if (error || !data) return null;
  return data as unknown as BookingWithSchedule;
}
