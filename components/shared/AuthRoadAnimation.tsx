import { Bus, GraduationCap } from "lucide-react";

const BUSES = [
  { duration: "14s", delay: "0s", size: 26, top: "62%" },
  { duration: "18s", delay: "-6s", size: 20, top: "78%" },
  { duration: "22s", delay: "-13s", size: 22, top: "70%" },
];

const CAPS = [
  { left: "12%", top: "18%", delay: "0s" },
  { left: "82%", top: "14%", delay: "-1.5s" },
  { left: "88%", top: "40%", delay: "-3s" },
  { left: "6%", top: "42%", delay: "-2s" },
];

export function AuthRoadAnimation() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {CAPS.map((cap, i) => (
        <GraduationCap
          key={i}
          className="animate-float-slow absolute text-maroon/10"
          style={{ left: cap.left, top: cap.top, animationDelay: cap.delay }}
          size={32}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-maroon-light/40 to-transparent">
        <div className="absolute inset-x-0 bottom-6 h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-border-strong)_0_16px,transparent_16px_32px)]" />
        {BUSES.map((bus, i) => (
          <Bus
            key={i}
            className="animate-drive absolute text-maroon/25"
            style={{
              top: bus.top,
              animationDuration: bus.duration,
              animationDelay: bus.delay,
            }}
            size={bus.size}
          />
        ))}
      </div>
    </div>
  );
}
