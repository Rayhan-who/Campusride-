"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { cancelBookingAction } from "@/lib/data/bookings";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelBookingAction(bookingId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <div className="flex flex-col gap-2">
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button variant="danger" className="w-full" onClick={() => setConfirming(true)}>
          Cancel Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-text-muted">Are you sure you want to cancel this booking?</p>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setConfirming(false)}
          disabled={pending}
        >
          Keep Booking
        </Button>
        <Button variant="danger" className="flex-1" onClick={handleCancel} disabled={pending}>
          {pending ? "Cancelling..." : "Yes, Cancel"}
        </Button>
      </div>
    </div>
  );
}
