import { Bus, CalendarClock, MapPin, Send } from "lucide-react";
import { getSchedulesWithAvailability, todayIso } from "@/lib/data/schedules";
import { getCounters } from "@/lib/data/counters";
import { getMyBookings } from "@/lib/data/bookings";
import { Hero } from "@/components/home/Hero";
import { QuickActionCard } from "@/components/home/QuickActionCard";
import { TodayScheduleList } from "@/components/home/TodayScheduleList";
import { CountersPreview } from "@/components/home/CountersPreview";
import { EarlyBookingPromo } from "@/components/home/EarlyBookingPromo";
import { MyBookingsPreview } from "@/components/home/MyBookingsPreview";
import { ComingSoonSection } from "@/components/home/ComingSoonSection";
import { routeLabel } from "@/lib/utils/format";
import type { BookingSummary } from "@/components/bookings/BookingListItem";

export default async function HomePage() {
  const today = todayIso();

  const [schedules, counters, bookings] = await Promise.all([
    getSchedulesWithAvailability(today),
    getCounters(),
    getMyBookings(),
  ]);

  const upcoming: BookingSummary[] = bookings
    .filter((b) => (b.status === "Confirmed" || b.status === "Pending") && b.travel_date >= today)
    .sort((a, b) => a.travel_date.localeCompare(b.travel_date))
    .map((b) => ({
      id: b.id,
      title: b.schedule.bus.bus_number,
      subtitle: routeLabel(b.schedule.counter),
      date: b.travel_date,
      seats: b.seats_allocated,
      status: b.status,
      bookingCode: b.booking_code,
      detailHref: `/bookings/${b.id}`,
    }));

  return (
    <div className="flex flex-col gap-8">
      <Hero />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickActionCard href="/schedule" icon={Bus} label="Book a Bus" />
          <QuickActionCard href="/schedule" icon={CalendarClock} label="Bus Schedule" />
          <QuickActionCard href="/counters" icon={MapPin} label="Bus Counters" />
          <QuickActionCard href="/bus-requests" icon={Send} label="Bus Requests" />
        </div>
      </section>

      <TodayScheduleList schedules={schedules} />

      <CountersPreview counters={counters} />

      <EarlyBookingPromo />

      <MyBookingsPreview bookings={upcoming} />

      <ComingSoonSection counters={counters} />
    </div>
  );
}
