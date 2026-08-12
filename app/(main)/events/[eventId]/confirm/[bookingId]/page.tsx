import { notFound } from "next/navigation";
import { getEventBookingById } from "@/lib/data/bookings";
import { getEventById } from "@/lib/data/events";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { formatDate, formatTime } from "@/lib/utils/format";

export default async function EventBookingConfirmPage({
  params,
}: {
  params: Promise<{ eventId: string; bookingId: string }>;
}) {
  const { eventId, bookingId } = await params;
  const booking = await getEventBookingById(bookingId);
  if (!booking || booking.event_id !== eventId) notFound();

  const event = booking.event;
  const freshEvent = await getEventById(event.id);
  const remainingSeats = freshEvent?.available_seats ?? 0;

  return (
    <div className="py-6">
      <BookingConfirmation
        bookingCode={booking.booking_code}
        seatsAllocated={booking.seats_allocated}
        totalSeats={event.total_seats}
        remainingSeats={remainingSeats}
        detailRows={[
          { label: "Event", value: event.name },
          { label: "Date", value: formatDate(event.event_date) },
          { label: "Destination", value: event.destination },
          ...(event.departure_time
            ? [{ label: "Departure", value: formatTime(event.departure_time) }]
            : []),
          ...(event.return_time
            ? [{ label: "Return", value: formatTime(event.return_time) }]
            : []),
          { label: "Status", value: booking.status },
        ]}
      />
    </div>
  );
}
