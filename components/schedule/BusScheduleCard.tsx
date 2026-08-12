import { Bus, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { SeatCapacityBar } from "./SeatCapacityBar";
import { formatTime } from "@/lib/utils/format";
import type { ScheduleWithDetails } from "@/types/domain";

export function BusScheduleCard({
  schedule,
  travelDate,
}: {
  schedule: ScheduleWithDetails;
  travelDate: string;
}) {
  const full = schedule.available_seats <= 0;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon-light text-maroon">
              <Bus size={16} />
            </span>
            <span className="text-sm font-semibold text-text">{schedule.bus.bus_number}</span>
          </div>
          <p className="mt-2 text-base font-medium text-text">
            {schedule.counter.name.replace(" Counter", "")} → University
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
            <MapPin size={12} /> Counter: {schedule.counter.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Departure</p>
          <p className="text-sm font-semibold text-text">{formatTime(schedule.departure_time)}</p>
          <p className="mt-1.5 text-xs text-text-muted">Arrival (est.)</p>
          <p className="text-sm font-medium text-text">{formatTime(schedule.arrival_time)}</p>
        </div>
      </div>

      <div className="mt-4">
        <SeatCapacityBar total={schedule.capacity} available={schedule.available_seats} />
      </div>

      {full ? (
        <span className="mt-4 flex w-full items-center justify-center rounded-full border border-border-strong bg-white px-4 py-2.5 text-sm font-medium text-text-muted">
          Fully Booked
        </span>
      ) : (
        <ButtonLink href={`/book/${schedule.id}?date=${travelDate}`} className="mt-4 w-full">
          Book Now
        </ButtonLink>
      )}
    </Card>
  );
}
