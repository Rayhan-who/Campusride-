import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { getBookingById, getEventBookingById } from "@/lib/data/bookings";
import { Card } from "@/components/shared/Card";
import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import { CancelBookingButton } from "@/components/bookings/CancelBookingButton";
import { formatDateFull, formatTime } from "@/lib/utils/format";
import { todayIso } from "@/lib/data/schedules";

export default async function BookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { bookingId } = await params;
  const { type } = await searchParams;
  const isEvent = type === "event";
  const today = todayIso();

  if (isEvent) {
    const booking = await getEventBookingById(bookingId);
    if (!booking) notFound();
    const cancellable =
      (booking.status === "Confirmed" || booking.status === "Pending") &&
      booking.event.event_date >= today;

    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text">{booking.event.name}</h1>
          <BookingStatusBadge status={booking.status} />
        </div>

        <Card className="p-5">
          <dl className="flex flex-col gap-3 text-sm">
            <Row icon={<CalendarDays size={14} />} label="Date" value={formatDateFull(booking.event.event_date)} />
            <Row icon={<MapPin size={14} />} label="Destination" value={booking.event.destination} />
            {booking.event.departure_time && (
              <Row icon={<Clock size={14} />} label="Departure" value={formatTime(booking.event.departure_time)} />
            )}
            {booking.event.return_time && (
              <Row icon={<Clock size={14} />} label="Return" value={formatTime(booking.event.return_time)} />
            )}
            <Row label="Seats Allocated" value={String(booking.seats_allocated)} />
            <Row label="Booking ID" value={booking.booking_code} mono />
          </dl>
        </Card>

        {cancellable && <CancelBookingButton bookingId={booking.id} kind="event" />}
      </div>
    );
  }

  const booking = await getBookingById(bookingId);
  if (!booking) notFound();
  const schedule = booking.schedule;
  const cancellable =
    (booking.status === "Confirmed" || booking.status === "Pending") &&
    booking.travel_date >= today;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">{schedule.bus.bus_number}</h1>
        <BookingStatusBadge status={booking.status} />
      </div>

      <Card className="p-5">
        <dl className="flex flex-col gap-3 text-sm">
          <Row
            label="Route"
            value={`${schedule.counter.name.replace(" Counter", "")} → University`}
          />
          <Row icon={<MapPin size={14} />} label="Counter" value={schedule.counter.name} />
          <Row icon={<CalendarDays size={14} />} label="Date" value={formatDateFull(booking.travel_date)} />
          <Row icon={<Clock size={14} />} label="Departure" value={formatTime(schedule.departure_time)} />
          <Row label="Seats Allocated" value={String(booking.seats_allocated)} />
          <Row label="Booking ID" value={booking.booking_code} mono />
        </dl>
      </Card>

      {cancellable && <CancelBookingButton bookingId={booking.id} kind="bus" />}
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  mono,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-text-muted">
        {icon}
        {label}
      </span>
      <span className={mono ? "font-mono font-medium text-text" : "font-medium text-text"}>
        {value}
      </span>
    </div>
  );
}
