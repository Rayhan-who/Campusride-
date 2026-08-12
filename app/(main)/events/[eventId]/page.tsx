import { notFound } from "next/navigation";
import { MapPin, CalendarDays, Clock } from "lucide-react";
import { getEventById } from "@/lib/data/events";
import { EventSeatSelect } from "@/components/events/EventSeatSelect";
import { Card } from "@/components/shared/Card";
import { DemoDataBadge } from "@/components/shared/DemoDataBadge";
import { formatDate, formatTime } from "@/lib/utils/format";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-text">{event.name}</h1>
        {event.description && <p className="text-sm text-text-muted">{event.description}</p>}
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-text-muted">
            <CalendarDays size={14} /> {formatDate(event.event_date)}
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <MapPin size={14} /> {event.destination}
          </div>
          {event.departure_time && (
            <div className="flex items-center gap-1.5 text-text-muted">
              <Clock size={14} /> Departs {formatTime(event.departure_time)}
            </div>
          )}
          {event.return_time && (
            <div className="flex items-center gap-1.5 text-text-muted">
              <Clock size={14} /> Returns {formatTime(event.return_time)}
            </div>
          )}
        </div>
        <div className="mt-3">
          <DemoDataBadge />
        </div>
      </Card>

      <Card className="p-5">
        <EventSeatSelect
          eventId={event.id}
          totalSeats={event.total_seats}
          available={event.available_seats}
        />
      </Card>
    </div>
  );
}
