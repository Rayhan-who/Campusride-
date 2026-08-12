import { createClient } from "@/lib/supabase/server";
import type { EventItem, EventWithAvailability } from "@/types/domain";

async function withAvailability(events: EventItem[]): Promise<EventWithAvailability[]> {
  const supabase = await createClient();
  const eventIds = events.map((e) => e.id);

  const bookedMap = new Map<string, number>();
  if (eventIds.length > 0) {
    const { data: bookings } = await supabase
      .from("event_bookings")
      .select("event_id, seats_allocated")
      .in("event_id", eventIds)
      .in("status", ["Confirmed", "Pending"]);

    for (const b of bookings ?? []) {
      bookedMap.set(b.event_id, (bookedMap.get(b.event_id) ?? 0) + b.seats_allocated);
    }
  }

  return events.map((e) => ({
    ...e,
    available_seats: e.total_seats - (bookedMap.get(e.id) ?? 0),
  }));
}

export async function getUpcomingEvents(): Promise<EventWithAvailability[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", today)
    .order("event_date");

  if (error || !data) return [];
  return withAvailability(data);
}

export async function getEventById(eventId: string): Promise<EventWithAvailability | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single();
  if (error || !data) return null;
  const [withAvail] = await withAvailability([data]);
  return withAvail;
}
