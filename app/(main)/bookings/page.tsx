import Link from "next/link";
import { getMyBookings, getMyEventBookings } from "@/lib/data/bookings";
import { BookingListItem, type UnifiedBooking } from "@/components/bookings/BookingListItem";
import { cn } from "@/lib/utils/cn";
import { todayIso } from "@/lib/data/schedules";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "past" ? "past" : "upcoming";

  const [busBookings, eventBookings] = await Promise.all([
    getMyBookings(),
    getMyEventBookings(),
  ]);

  const today = todayIso();

  const unified: UnifiedBooking[] = [
    ...busBookings.map((b): UnifiedBooking => ({
      id: b.id,
      kind: "bus",
      title: b.schedule.bus.bus_number,
      subtitle: `${b.schedule.counter.name.replace(" Counter", "")} → University`,
      date: b.travel_date,
      seats: b.seats_allocated,
      status: b.status,
      bookingCode: b.booking_code,
      detailHref: `/bookings/${b.id}`,
    })),
    ...eventBookings.map((b): UnifiedBooking => ({
      id: b.id,
      kind: "event",
      title: b.event.name,
      subtitle: b.event.destination,
      date: b.event.event_date,
      seats: b.seats_allocated,
      status: b.status,
      bookingCode: b.booking_code,
      detailHref: `/bookings/${b.id}?type=event`,
    })),
  ];

  const upcoming = unified
    .filter((b) => (b.status === "Confirmed" || b.status === "Pending") && b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = unified
    .filter((b) => !(( b.status === "Confirmed" || b.status === "Pending") && b.date >= today))
    .sort((a, b) => b.date.localeCompare(a.date));

  const list = activeTab === "upcoming" ? upcoming : past;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-text">My Bookings</h1>

      <div className="flex gap-2 rounded-full bg-black/5 p-1">
        <TabLink href="/bookings?tab=upcoming" active={activeTab === "upcoming"}>
          Upcoming ({upcoming.length})
        </TabLink>
        <TabLink href="/bookings?tab=past" active={activeTab === "past"}>
          Past ({past.length})
        </TabLink>
      </div>

      {list.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">
          {activeTab === "upcoming"
            ? "No upcoming bookings yet. Book a bus or event to see it here."
            : "No past bookings yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((booking) => (
            <BookingListItem key={`${booking.kind}-${booking.id}`} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex-1 rounded-full py-2 text-center text-sm font-medium transition-colors",
        active ? "bg-white text-maroon shadow-sm" : "text-text-muted",
      )}
    >
      {children}
    </Link>
  );
}
