import { MapPin, CalendarDays, Clock } from "lucide-react";
import { ButtonLink } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { SeatCapacityBar } from "@/components/schedule/SeatCapacityBar";
import { formatDate, formatTime } from "@/lib/utils/format";
import type { EventWithAvailability } from "@/types/domain";

export function EventCard({ event }: { event: EventWithAvailability }) {
  const full = event.available_seats <= 0;

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold text-text">{event.name}</h3>
      {event.description && (
        <p className="mt-1 text-sm text-text-muted">{event.description}</p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-text-muted">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} /> {formatDate(event.event_date)}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} /> {event.destination}
        </div>
        {event.departure_time && (
          <div className="flex items-center gap-1.5">
            <Clock size={14} /> Departs {formatTime(event.departure_time)}
          </div>
        )}
        {event.return_time && (
          <div className="flex items-center gap-1.5">
            <Clock size={14} /> Returns {formatTime(event.return_time)}
          </div>
        )}
      </div>

      <div className="mt-4">
        <SeatCapacityBar total={event.total_seats} available={event.available_seats} />
      </div>

      {full ? (
        <span className="mt-4 flex w-full items-center justify-center rounded-full border border-border-strong bg-white px-4 py-2.5 text-sm font-medium text-text-muted">
          Fully Booked
        </span>
      ) : (
        <ButtonLink href={`/events/${event.id}`} className="mt-4 w-full">
          Book Event Bus
        </ButtonLink>
      )}
    </Card>
  );
}
