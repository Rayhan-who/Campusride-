"use client";

import { useState } from "react";
import { DhakaMapView } from "./DhakaMapView";
import { CounterCard } from "./CounterCard";
import type { Counter, DemandLevel, ScheduleWithDetails } from "@/types/domain";

interface CounterEntry {
  counter: Counter;
  demandLevel: DemandLevel;
  demandCount: number;
  nextSchedule: ScheduleWithDetails | null;
}

export function CountersExplorer({
  entries,
  travelDate,
}: {
  entries: CounterEntry[];
  travelDate: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(entries[0]?.counter.id ?? null);

  return (
    <div className="flex flex-col gap-4">
      <DhakaMapView
        counters={entries.map((e) => e.counter)}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div className="flex flex-col gap-3">
        {entries.map(({ counter, demandLevel, demandCount, nextSchedule }) => (
          <CounterCard
            key={counter.id}
            counter={counter}
            demandLevel={demandLevel}
            demandCount={demandCount}
            nextSchedule={nextSchedule}
            travelDate={travelDate}
            active={counter.id === selectedId}
            onClick={() => setSelectedId(counter.id)}
          />
        ))}
      </div>
    </div>
  );
}
