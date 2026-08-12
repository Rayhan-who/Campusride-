import { createClient } from "@/lib/supabase/server";
import { demandLevel } from "@/lib/utils/seats";
import type { Counter, CounterDemand } from "@/types/domain";

export async function getCounters(): Promise<Counter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("counters").select("*").order("name");
  if (error || !data) return [];
  return data;
}

export async function getCounterById(counterId: string): Promise<Counter | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("counters")
    .select("*")
    .eq("id", counterId)
    .single();
  if (error || !data) return null;
  return data;
}

export async function getCounterDemand(): Promise<CounterDemand[]> {
  const supabase = await createClient();
  const counters = await getCounters();
  if (counters.length === 0) return [];

  const { data: schedules } = await supabase
    .from("schedules")
    .select("id, counter_id");

  const counterToSchedules = new Map<string, string[]>();
  for (const s of schedules ?? []) {
    const list = counterToSchedules.get(s.counter_id) ?? [];
    list.push(s.id);
    counterToSchedules.set(s.counter_id, list);
  }

  const allScheduleIds = (schedules ?? []).map((s) => s.id);
  const { data: bookings } = allScheduleIds.length
    ? await supabase
        .from("bookings")
        .select("schedule_id")
        .in("schedule_id", allScheduleIds)
        .in("status", ["Confirmed", "Pending"])
    : { data: [] as { schedule_id: string }[] };

  const scheduleBookingCounts = new Map<string, number>();
  for (const b of bookings ?? []) {
    scheduleBookingCounts.set(b.schedule_id, (scheduleBookingCounts.get(b.schedule_id) ?? 0) + 1);
  }

  return counters.map((counter) => {
    const scheduleIds = counterToSchedules.get(counter.id) ?? [];
    const earlyBookingCount = scheduleIds.reduce(
      (sum, id) => sum + (scheduleBookingCounts.get(id) ?? 0),
      0,
    );
    return {
      counter,
      earlyBookingCount,
      demandLevel: demandLevel(earlyBookingCount),
    };
  });
}
