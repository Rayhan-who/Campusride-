import { getUpcomingEvents } from "@/lib/data/events";
import { EventCard } from "@/components/events/EventCard";
import { DemoDataBadge } from "@/components/shared/DemoDataBadge";

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">University Events</h1>
          <p className="text-sm text-text-muted">Book transportation for upcoming events.</p>
        </div>
        <DemoDataBadge />
      </div>

      {events.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">
          No upcoming events. Make sure the database is seeded — see supabase/README.md.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
