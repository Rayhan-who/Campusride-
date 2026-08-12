import { getCounterDemand } from "@/lib/data/counters";
import { getSchedulesByCounter, todayIso } from "@/lib/data/schedules";
import { CountersExplorer } from "@/components/counters/CountersExplorer";
import { DemoDataBadge } from "@/components/shared/DemoDataBadge";

export default async function CountersPage() {
  const travelDate = todayIso();
  const demand = await getCounterDemand();

  const entries = await Promise.all(
    demand.map(async ({ counter, demandLevel, earlyBookingCount }) => {
      const schedules = await getSchedulesByCounter(counter.id, travelDate);
      const nextSchedule =
        schedules.find((s) => s.available_seats > 0) ?? schedules[0] ?? null;
      return { counter, demandLevel, demandCount: earlyBookingCount, nextSchedule };
    }),
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">Bus Counters</h1>
        <DemoDataBadge />
      </div>
      <p className="-mt-3 text-sm text-text-muted">
        Tap a pin or a counter to see the next bus and available seats.
      </p>

      {entries.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">
          No counters found. Make sure the database is seeded — see supabase/README.md.
        </p>
      ) : (
        <CountersExplorer entries={entries} travelDate={travelDate} />
      )}
    </div>
  );
}
