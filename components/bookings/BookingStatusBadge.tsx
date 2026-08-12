import { cn } from "@/lib/utils/cn";
import type { BookingStatus } from "@/types/domain";

const STYLES: Record<BookingStatus, string> = {
  Confirmed: "text-success bg-success-bg",
  Pending: "text-warning bg-warning-bg",
  Cancelled: "text-danger bg-danger-bg",
  Completed: "text-text-muted bg-black/5",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
