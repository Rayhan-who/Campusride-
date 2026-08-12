import { ButtonLink } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";

export function EarlyBookingPromo() {
  return (
    <Card className="flex flex-col items-center gap-3 p-6 text-center">
      <h2 className="text-lg font-semibold text-text">Early Booking</h2>
      <p className="max-w-xs text-sm text-text-muted">
        Reserve your seat in advance and help CampusRide plan capacity at your counter.
      </p>
      <ButtonLink href="/schedule">Book Now</ButtonLink>
    </Card>
  );
}
