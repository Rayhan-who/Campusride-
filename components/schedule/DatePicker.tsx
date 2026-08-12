"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";

export function DatePicker({ date }: { date: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const { min, max } = useMemo(() => {
    const now = new Date();
    return {
      min: now.toISOString().slice(0, 10),
      max: new Date(now.getTime() + 30 * 86400000).toISOString().slice(0, 10),
    };
  }, []);

  return (
    <label className="flex items-center gap-2 rounded-full border border-border-strong bg-white px-3.5 py-2 text-sm text-text">
      <CalendarDays size={16} className="text-maroon" />
      <input
        type="date"
        value={date}
        min={min}
        max={max}
        onChange={handleChange}
        className="bg-transparent outline-none"
      />
    </label>
  );
}
