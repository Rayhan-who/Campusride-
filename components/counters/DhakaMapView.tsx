"use client";

import { MapPin, School } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Counter } from "@/types/domain";

const UNIVERSITY_POSITION = { x: 50, y: 82 };

export function DhakaMapView({
  counters,
  selectedId = null,
  onSelect,
}: {
  counters: Counter[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-[#f3efe6]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-64 w-full sm:h-80"
        aria-hidden
      >
        <rect width="100" height="100" fill="#f3efe6" />
        {/* stylized river */}
        <path
          d="M -5 40 C 20 45, 30 60, 20 75 C 12 86, 0 90, -5 92"
          stroke="#cfe0dd"
          strokeWidth="6"
          fill="none"
        />
        {/* stylized roads */}
        <path d="M 50 0 V 100" stroke="#e2dccf" strokeWidth="1.5" />
        <path d="M 0 55 H 100" stroke="#e2dccf" strokeWidth="1.5" />
        <path d="M 10 5 L 90 95" stroke="#e6e0d3" strokeWidth="1" />
        <path d="M 90 5 L 10 95" stroke="#e6e0d3" strokeWidth="1" />
        {/* soft area blobs */}
        <circle cx="52" cy="10" r="12" fill="#eae5d8" />
        <circle cx="34" cy="27" r="12" fill="#eae5d8" />
        <circle cx="24" cy="46" r="11" fill="#eae5d8" />
        <circle cx="37" cy="56" r="11" fill="#eae5d8" />
        <circle cx="66" cy="58" r="12" fill="#eae5d8" />
      </svg>

      {/* area labels */}
      <MapLabel x={52} y={4} label="Uttara" />
      <MapLabel x={30} y={19} label="Mirpur" />
      <MapLabel x={16} y={40} label="Mohammadpur" />
      <MapLabel x={33} y={50} label="Dhanmondi" />
      <MapLabel x={70} y={52} label="Motijheel" />

      {/* university marker */}
      <div
        className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
        style={{ left: `${UNIVERSITY_POSITION.x}%`, top: `${UNIVERSITY_POSITION.y}%` }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-white shadow">
          <School size={16} />
        </span>
        <span className="mt-0.5 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-maroon shadow-sm">
          University
        </span>
      </div>

      {counters.map((counter) => {
        const active = counter.id === selectedId;
        return (
          <button
            key={counter.id}
            onClick={() => onSelect?.(counter.id)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-full",
              onSelect ? "cursor-pointer" : "cursor-default",
            )}
            style={{ left: `${counter.map_x}%`, top: `${counter.map_y}%` }}
            aria-label={counter.name}
          >
            <MapPin
              size={active ? 30 : 24}
              className={cn(
                "drop-shadow transition-all",
                active ? "fill-maroon text-maroon-dark" : "fill-white text-maroon",
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}

      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-[11px] text-text-muted">
        Illustrative map for reference only — not to scale
      </p>
    </div>
  );
}

function MapLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <span
      className="absolute -translate-x-1/2 text-[10px] font-medium tracking-wide text-text-muted uppercase"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {label}
    </span>
  );
}
