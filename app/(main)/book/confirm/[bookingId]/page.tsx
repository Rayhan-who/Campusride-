import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/data/bookings";
import { getScheduleById } from "@/lib/data/schedules";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { formatDateFull, formatTime, routeLabel } from "@/lib/utils/format";

export default async function BookingConfirmPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBookingById(bookingId);
  if (!booking) notFound();

  const schedule = booking.schedule;
  const freshSchedule = await getScheduleById(schedule.id, booking.travel_date);
  const remainingSeats = freshSchedule?.available_seats ?? 0;

  return (
    <div className="py-6">
      <BookingConfirmation
        bookingCode={booking.booking_code}
        seatsAllocated={booking.seats_allocated}
        totalSeats={schedule.capacity}
        remainingSeats={remainingSeats}
        detailRows={[
          { label: "Bus", value: schedule.bus.bus_number },
          { label: "Route", value: routeLabel(schedule.counter) },
          { label: "Counter", value: schedule.counter.name },
          { label: "Date", value: formatDateFull(booking.travel_date) },
          { label: "Departure", value: formatTime(schedule.departure_time) },
        ]}
      />
    </div>
  );
}
