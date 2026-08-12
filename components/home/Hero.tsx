import Link from "next/link";
import { ButtonLink } from "@/components/shared/Button";

export function Hero() {
  return (
    <section className="rounded-3xl bg-maroon px-6 py-10 text-center text-white">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Your Campus. Your Ride.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/85 sm:text-base">
        Book your university bus, check schedules, find nearby counters, and plan your journey
        with CampusRide.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href="/schedule" variant="secondary" size="lg" className="w-full sm:w-auto">
          Book a Bus
        </ButtonLink>
        <Link
          href="/schedule"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/50 px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
        >
          View Schedule
        </Link>
      </div>
    </section>
  );
}
