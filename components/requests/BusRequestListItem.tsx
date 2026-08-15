import { Bus, CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { formatDate, formatTime } from "@/lib/utils/format";
import type { BusRequest } from "@/types/domain";

export function BusRequestListItem({ request }: { request: BusRequest }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-text">{request.university_name}</p>
          <p className="mt-0.5 text-xs text-text-muted">{request.purpose}</p>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <Bus size={12} /> {request.buses_required} bus{request.buses_required > 1 ? "es" : ""}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays size={12} /> {formatDate(request.required_date)},{" "}
          {formatTime(request.required_time)}
        </span>
        <span className="col-span-2 flex items-center gap-1.5">
          <MapPin size={12} /> {request.pickup_location}
        </span>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Request ID: <span className="font-mono text-text">{request.request_code}</span>
      </p>
    </Card>
  );
}
