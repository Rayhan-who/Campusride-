import Link from "next/link";
import { Bus } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { formatDate } from "@/lib/utils/format";
import type { BookingStatus } from "@/types/domain";

export interface BookingSummary {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  seats: number;
  status: BookingStatus;
  bookingCode: string;
  detailHref: string;
}

export function BookingListItem({ booking }: { booking: BookingSummary }) {
  return (
    <Link href={booking.detailHref}>
      <Card className="flex items-center gap-3 p-4 transition-colors hover:border-border-strong">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon-light text-maroon">
          <Bus size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-text">{booking.title}</p>
          <p className="truncate text-sm text-text-muted">{booking.subtitle}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {formatDate(booking.date)} · {booking.seats} seat{booking.seats > 1 ? "s" : ""}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </Card>
    </Link>
  );
}
