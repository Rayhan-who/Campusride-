import { Bus, CalendarClock, MapPin, GraduationCap } from "lucide-react";
import { getSchedulesWithAvailability, todayIso } from "@/lib/data/schedules";
import { getCounters } from "@/lib/data/counters";
import { getMyBookings, getMyEventBookings } from "@/lib/data/bookings";
import { Hero } from "@/components/home/Hero";
import { QuickActionCard } from "@/components/home/QuickActionCard";
import { TodayScheduleList } from "@/components/home/TodayScheduleList";
import { CountersPreview } from "@/components/home/CountersPreview";
import { EarlyBookingPromo } from "@/components/home/EarlyBookingPromo";
import { MyBookingsPreview } from "@/components/home/MyBookingsPreview";
import { ComingSoonSection } from "@/components/home/ComingSoonSection";
import type { UnifiedBooking } from "@/components/bookings/BookingListItem";

export default async function HomePage() {
  const today = todayIso();

  const [schedules, counters, busBookings, eventBookings] = await Promise.all([
    getSchedulesWithAvailability(today),
    getCounters(),
    getMyBookings(),
    getMyEventBookings(),
  ]);

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
  ]
    .filter((b) => (b.status === "Confirmed" || b.status === "Pending") && b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="flex flex-col gap-8">
      <Hero />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickActionCard href="/schedule" icon={Bus} label="Book a Bus" />
          <QuickActionCard href="/schedule" icon={CalendarClock} label="Bus Schedule" />
          <QuickActionCard href="/counters" icon={MapPin} label="Bus Counters" />
          <QuickActionCard href="/events" icon={GraduationCap} label="University Events" />
        </div>
      </section>

      <TodayScheduleList schedules={schedules} />

      <CountersPreview counters={counters} />

      <EarlyBookingPromo />

      <MyBookingsPreview bookings={unified} />

      <ComingSoonSection counters={counters} />
    </div>
  );
}
