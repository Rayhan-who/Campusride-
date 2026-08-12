import { getSchedulesWithAvailability, todayIso } from "@/lib/data/schedules";
import { BusScheduleCard } from "@/components/schedule/BusScheduleCard";
import { DatePicker } from "@/components/schedule/DatePicker";
import { DemoDataBadge } from "@/components/shared/DemoDataBadge";
import { formatDateFull } from "@/lib/utils/format";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const travelDate = date ?? todayIso();
  const schedules = await getSchedulesWithAvailability(travelDate);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text">Bus Schedule</h1>
          <p className="text-sm text-text-muted">{formatDateFull(travelDate)}</p>
        </div>
        <DatePicker date={travelDate} />
      </div>

      <DemoDataBadge />

      {schedules.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">
          No schedules found. Make sure the database is seeded — see supabase/README.md.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {schedules.map((schedule) => (
            <BusScheduleCard key={schedule.id} schedule={schedule} travelDate={travelDate} />
          ))}
        </div>
      )}
    </div>
  );
}
