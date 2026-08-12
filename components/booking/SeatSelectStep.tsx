"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { SeatCapacityBar } from "@/components/schedule/SeatCapacityBar";
import { createBusBookingAction } from "@/lib/data/bookings";

const MAX_SEATS_PER_BOOKING = 4;

export function SeatSelectStep({
  scheduleId,
  travelDate,
  capacity,
  available,
}: {
  scheduleId: string;
  travelDate: string;
  capacity: number;
  available: number;
}) {
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const maxSelectable = Math.max(0, Math.min(available, MAX_SEATS_PER_BOOKING));

  function adjust(delta: number) {
    setSeats((s) => Math.min(maxSelectable, Math.max(1, s + delta)));
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await createBusBookingAction(scheduleId, travelDate, seats);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/book/confirm/${result.bookingId}`);
    });
  }

  if (available <= 0) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger-bg p-4 text-sm text-danger">
        This bus is fully booked for the selected date. Please choose another schedule.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-medium text-text">Number of seats</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => adjust(-1)}
            disabled={seats <= 1}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text disabled:opacity-40"
            aria-label="Decrease seats"
          >
            <Minus size={18} />
          </button>
          <span className="w-8 text-center text-xl font-semibold text-text">{seats}</span>
          <button
            onClick={() => adjust(1)}
            disabled={seats >= maxSelectable}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text disabled:opacity-40"
            aria-label="Increase seats"
          >
            <Plus size={18} />
          </button>
          <span className="text-xs text-text-muted">
            Max {MAX_SEATS_PER_BOOKING} per booking
          </span>
        </div>
      </div>

      <SeatCapacityBar total={capacity} available={available} />

      {error && (
        <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <Button size="lg" disabled={pending} onClick={confirm} className="w-full">
        {pending ? "Confirming..." : "Confirm Booking"}
      </Button>
    </div>
  );
}
