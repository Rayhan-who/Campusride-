import Link from "next/link";
import { Bus, ChevronRight } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { formatTime } from "@/lib/utils/format";
import type { ScheduleWithDetails } from "@/types/domain";

export function TodayScheduleList({ schedules }: { schedules: ScheduleWithDetails[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Today&apos;s Bus Schedule</h2>
        <Link href="/schedule" className="text-sm font-medium text-maroon">
          View all
        </Link>
      </div>

      <Card className="divide-y divide-border p-1">
        {schedules.slice(0, 5).map((schedule) => (
          <Link
            key={schedule.id}
            href={`/book/${schedule.id}`}
            className="flex items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-offwhite"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-light text-maroon">
                <Bus size={16} />
              </span>
              <div>
                <p className="text-sm font-medium text-text">{schedule.bus.bus_number}</p>
                <p className="text-xs text-text-muted">{formatTime(schedule.departure_time)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${schedule.available_seats > 0 ? "text-success" : "text-danger"}`}
              >
                {schedule.available_seats > 0
                  ? `${schedule.available_seats} seats available`
                  : "Full"}
              </span>
              <ChevronRight size={16} className="text-text-muted" />
            </div>
          </Link>
        ))}
      </Card>
    </section>
  );
}
