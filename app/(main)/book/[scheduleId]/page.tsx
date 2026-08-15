import { notFound } from "next/navigation";
import { Bus, MapPin, Clock } from "lucide-react";
import { getScheduleById, todayIso } from "@/lib/data/schedules";
import { SeatSelectStep } from "@/components/booking/SeatSelectStep";
import { Card } from "@/components/shared/Card";
import { DemoDataBadge } from "@/components/shared/DemoDataBadge";
import { formatDateFull, formatTime, routeLabel } from "@/lib/utils/format";

export default async function BookSchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ scheduleId: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { scheduleId } = await params;
  const { date } = await searchParams;
  const travelDate = date ?? todayIso();

  const schedule = await getScheduleById(scheduleId, travelDate);
  if (!schedule) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-text">Early Booking</h1>
        <p className="text-sm text-text-muted">Reserve your seat in advance.</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-light text-maroon">
            <Bus size={18} />
          </span>
          <div>
            <p className="font-semibold text-text">{schedule.bus.bus_number}</p>
            <p className="text-sm text-text-muted">{routeLabel(schedule.counter)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-text-muted">
            <MapPin size={14} /> Counter: {schedule.counter.name}
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <Clock size={14} /> Departure: {formatTime(schedule.departure_time)}
          </div>
          <div className="col-span-2 text-text-muted">Date: {formatDateFull(travelDate)}</div>
        </div>

        <div className="mt-3">
          <DemoDataBadge />
        </div>
      </Card>

      <Card className="p-5">
        <SeatSelectStep
          scheduleId={schedule.id}
          travelDate={travelDate}
          capacity={schedule.capacity}
          available={schedule.available_seats}
        />
      </Card>
    </div>
  );
}
