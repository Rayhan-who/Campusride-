import Link from "next/link";
import { MapPin } from "lucide-react";
import { DhakaMapView } from "@/components/counters/DhakaMapView";
import type { Counter } from "@/types/domain";

export function CountersPreview({ counters }: { counters: Counter[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Bus Counters</h2>
        <Link href="/counters" className="text-sm font-medium text-maroon">
          View all
        </Link>
      </div>

      <DhakaMapView counters={counters} />

      <div className="mt-3 grid grid-cols-2 gap-2">
        {counters.slice(0, 4).map((counter) => (
          <Link
            key={counter.id}
            href="/counters"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium text-text transition-colors hover:border-maroon/30"
          >
            <MapPin size={13} className="shrink-0 text-maroon" />
            <span className="truncate">{counter.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
