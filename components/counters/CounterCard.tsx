import { MapPin, Bus } from "lucide-react";
import { ButtonLink } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { DemandBadge } from "./DemandBadge";
import { formatTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Counter, DemandLevel, ScheduleWithDetails } from "@/types/domain";

export function CounterCard({
  counter,
  demandLevel,
  demandCount,
  nextSchedule,
  travelDate,
  active,
  onClick,
}: {
  counter: Counter;
  demandLevel: DemandLevel;
  demandCount: number;
  nextSchedule: ScheduleWithDetails | null;
  travelDate: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer p-4 transition-colors",
        active ? "border-maroon ring-1 ring-maroon" : "hover:border-border-strong",
      )}
      onClickCapture={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-text">{counter.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
            <MapPin size={12} /> {counter.pickup_location}
          </p>
        </div>
        <DemandBadge level={demandLevel} count={demandCount} />
      </div>

      {nextSchedule ? (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-offwhite px-3 py-2 text-sm">
          <span className="flex items-center gap-1.5 text-text">
            <Bus size={14} className="text-maroon" /> {nextSchedule.bus.bus_number} ·{" "}
            {formatTime(nextSchedule.departure_time)}
          </span>
          <span
            className={cn(
              "font-medium",
              nextSchedule.available_seats > 0 ? "text-success" : "text-danger",
            )}
          >
            {nextSchedule.available_seats > 0
              ? `${nextSchedule.available_seats} seats left`
              : "Full"}
          </span>
        </div>
      ) : (
        <p className="mt-3 text-sm text-text-muted">No scheduled buses from this counter yet.</p>
      )}

      {nextSchedule && nextSchedule.available_seats > 0 && (
        <ButtonLink
          href={`/book/${nextSchedule.id}?date=${travelDate}`}
          size="md"
          className="mt-3 w-full"
        >
          Book Now
        </ButtonLink>
      )}
    </Card>
  );
}
