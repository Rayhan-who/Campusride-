import { cn } from "@/lib/utils/cn";
import type { RequestStatus } from "@/types/domain";

const STYLES: Record<RequestStatus, string> = {
  Pending: "text-warning bg-warning-bg",
  Approved: "text-success bg-success-bg",
  Rejected: "text-danger bg-danger-bg",
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
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
