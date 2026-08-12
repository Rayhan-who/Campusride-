import { bookedPercent } from "@/lib/utils/seats";
import { cn } from "@/lib/utils/cn";

export function SeatCapacityBar({
  total,
  available,
  className,
}: {
  total: number;
  available: number;
  className?: string;
}) {
  const percent = bookedPercent(total, available);
  const full = available <= 0;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className={cn("h-full rounded-full", full ? "bg-danger" : "bg-maroon")}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={cn("font-medium", full ? "text-danger" : "text-success")}>
          {full ? "Full" : `${available} of ${total} seats available`}
        </span>
      </div>
    </div>
  );
}
