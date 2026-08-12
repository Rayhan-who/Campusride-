import type { DemandLevel } from "@/types/domain";

export function bookedPercent(total: number, available: number): number {
  if (total <= 0) return 0;
  const booked = total - available;
  return Math.min(100, Math.max(0, Math.round((booked / total) * 100)));
}

export function demandLevel(earlyBookingCount: number): DemandLevel {
  if (earlyBookingCount >= 30) return "Very High";
  if (earlyBookingCount >= 15) return "High";
  if (earlyBookingCount >= 5) return "Medium";
  return "Low";
}

export const DEMAND_COLORS: Record<DemandLevel, string> = {
  Low: "text-success bg-success-bg",
  Medium: "text-warning bg-warning-bg",
  High: "text-maroon bg-maroon-light",
  "Very High": "text-danger bg-danger-bg",
};
