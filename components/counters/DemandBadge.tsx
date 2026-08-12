import { DEMAND_COLORS } from "@/lib/utils/seats";
import { cn } from "@/lib/utils/cn";
import type { DemandLevel } from "@/types/domain";

export function DemandBadge({
  level,
  count,
}: {
  level: DemandLevel;
  count: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        DEMAND_COLORS[level],
      )}
    >
      {level} demand
      <span className="opacity-70">· {count} early bookings</span>
    </span>
  );
}
