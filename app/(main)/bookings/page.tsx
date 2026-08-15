import Link from "next/link";
import { getMyBookings } from "@/lib/data/bookings";
import { BookingListItem, type BookingSummary } from "@/components/bookings/BookingListItem";
import { routeLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { todayIso } from "@/lib/data/schedules";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "past" ? "past" : "upcoming";

  const bookings = await getMyBookings();
  const today = todayIso();

  const summaries: BookingSummary[] = bookings.map((b) => ({
    id: b.id,
    title: b.schedule.bus.bus_number,
    subtitle: routeLabel(b.schedule.counter),
    date: b.travel_date,
    seats: b.seats_allocated,
    status: b.status,
    bookingCode: b.booking_code,
    detailHref: `/bookings/${b.id}`,
  }));

  const upcoming = summaries
    .filter((b) => (b.status === "Confirmed" || b.status === "Pending") && b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = summaries
    .filter((b) => !((b.status === "Confirmed" || b.status === "Pending") && b.date >= today))
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
            ? "No upcoming bookings yet. Book a bus to see it here."
            : "No past bookings yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((booking) => (
            <BookingListItem key={booking.id} booking={booking} />
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
