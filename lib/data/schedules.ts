import { createClient } from "@/lib/supabase/server";
import type { ScheduleWithDetails } from "@/types/domain";

type RawSchedule = Omit<ScheduleWithDetails, "available_seats">;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

async function withAvailability(
  schedules: RawSchedule[],
  travelDate: string,
): Promise<ScheduleWithDetails[]> {
  const supabase = await createClient();
  const scheduleIds = schedules.map((s) => s.id);

  const bookedMap = new Map<string, number>();
  if (scheduleIds.length > 0) {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("schedule_id, seats_allocated")
      .eq("travel_date", travelDate)
      .in("status", ["Confirmed", "Pending"])
      .in("schedule_id", scheduleIds);

    for (const b of bookings ?? []) {
      bookedMap.set(b.schedule_id, (bookedMap.get(b.schedule_id) ?? 0) + b.seats_allocated);
    }
  }

  return schedules.map((s) => ({
    ...s,
    available_seats: s.capacity - (bookedMap.get(s.id) ?? 0),
  }));
}

export async function getSchedulesWithAvailability(
  travelDate: string = todayIso(),
): Promise<ScheduleWithDetails[]> {
  const supabase = await createClient();
  const { data: schedules, error } = await supabase
    .from("schedules")
    .select("*, bus:buses(*), route:routes(*), counter:counters(*, university:universities(*))")
    .order("departure_time");

  if (error || !schedules) return [];

  return withAvailability(schedules, travelDate);
}

export async function getScheduleById(
  scheduleId: string,
  travelDate: string = todayIso(),
): Promise<ScheduleWithDetails | null> {
  const supabase = await createClient();
  const { data: schedule, error } = await supabase
    .from("schedules")
    .select("*, bus:buses(*), route:routes(*), counter:counters(*, university:universities(*))")
    .eq("id", scheduleId)
    .single();

  if (error || !schedule) return null;

  const [withAvail] = await withAvailability([schedule], travelDate);
  return withAvail;
}

export async function getSchedulesByCounter(
  counterId: string,
  travelDate: string = todayIso(),
): Promise<ScheduleWithDetails[]> {
  const supabase = await createClient();
  const { data: schedules, error } = await supabase
    .from("schedules")
    .select("*, bus:buses(*), route:routes(*), counter:counters(*, university:universities(*))")
    .eq("counter_id", counterId)
    .order("departure_time");

  if (error || !schedules) return [];

  return withAvailability(schedules, travelDate);
}

export { todayIso };
