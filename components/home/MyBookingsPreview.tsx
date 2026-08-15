import Link from "next/link";
import { BookingListItem, type BookingSummary } from "@/components/bookings/BookingListItem";
import { ButtonLink } from "@/components/shared/Button";

export function MyBookingsPreview({ bookings }: { bookings: BookingSummary[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">My Bookings</h2>
        <Link href="/bookings" className="text-sm font-medium text-maroon">
          View all
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong p-6 text-center">
          <p className="text-sm text-text-muted">You have no upcoming bookings yet.</p>
          <ButtonLink href="/schedule" className="mt-3">
            Book a Bus
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.slice(0, 2).map((booking) => (
            <BookingListItem key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  );
}
