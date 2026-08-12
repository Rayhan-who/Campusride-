import { CircleCheck } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { ButtonLink } from "@/components/shared/Button";
import { SeatCapacityBar } from "@/components/schedule/SeatCapacityBar";

export function BookingConfirmation({
  detailRows,
  bookingCode,
  seatsAllocated,
  totalSeats,
  remainingSeats,
}: {
  detailRows: { label: string; value: string }[];
  bookingCode: string;
  seatsAllocated: number;
  totalSeats: number;
  remainingSeats: number;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-maroon-light text-maroon">
        <CircleCheck size={36} />
      </span>
      <div>
        <p className="text-lg font-semibold text-maroon">Booking Confirmed</p>
        <p className="text-sm text-text-muted">CampusRide</p>
      </div>

      <Card className="w-full p-5 text-left">
        <dl className="flex flex-col gap-2 text-sm">
          {detailRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <dt className="text-text-muted">{row.label}</dt>
              <dd className="font-medium text-text">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="my-4 h-px bg-border" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Seats Allocated</span>
          <span className="text-lg font-semibold text-maroon">{seatsAllocated}</span>
        </div>

        <div className="mt-3">
          <SeatCapacityBar total={totalSeats} available={remainingSeats} />
        </div>

        <div className="mt-4 rounded-xl bg-offwhite px-3 py-2 text-center">
          <p className="text-xs text-text-muted">Booking ID</p>
          <p className="font-mono text-sm font-semibold tracking-wide text-text">{bookingCode}</p>
        </div>
      </Card>

      <div className="flex w-full flex-col gap-2.5">
        <ButtonLink href="/bookings" className="w-full">
          View My Bookings
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" className="w-full">
          Back to Home
        </ButtonLink>
      </div>
    </div>
  );
}
