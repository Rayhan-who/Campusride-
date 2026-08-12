import {
  MapPinned,
  CreditCard,
  QrCode,
  Wallet,
  Timer,
  BellRing,
  Satellite,
  TrendingUp,
  Shuffle,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { Card } from "@/components/shared/Card";
import { ComingSoonCard } from "@/components/shared/ComingSoonCard";
import { DhakaMapView } from "@/components/counters/DhakaMapView";
import type { Counter } from "@/types/domain";

const OTHER_FEATURES = [
  { icon: QrCode, title: "QR-Code Boarding", description: "Scan to board your bus." },
  { icon: Wallet, title: "Digital Bus Pass", description: "A pass, right in the app." },
  { icon: Timer, title: "Real-Time ETA", description: "Know exactly when it arrives." },
  { icon: BellRing, title: "Push Notifications", description: "Alerts outside the app." },
  { icon: Satellite, title: "GPS Tracking", description: "Precise live bus location." },
  { icon: TrendingUp, title: "Smart Demand Prediction", description: "Forecast busy routes." },
  { icon: Shuffle, title: "Automatic Bus Allocation", description: "Smarter capacity planning." },
  { icon: ShieldAlert, title: "Emergency Reporting", description: "Report issues on the go." },
  { icon: Wrench, title: "Bus Maintenance Info", description: "Service status at a glance." },
];

export function ComingSoonSection({ counters }: { counters: Counter[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-text">Coming Soon</h2>

      <Card className="mb-4 overflow-hidden p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-text-muted">
              <MapPinned size={18} />
            </span>
            <p className="text-sm font-semibold text-text">Live Bus Tracking</p>
          </div>
          <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-text-muted">
            Coming Soon
          </span>
        </div>
        <p className="mt-2 text-xs text-text-muted">
          Track your university bus in real time and see its estimated arrival at your counter.
        </p>
        <div className="pointer-events-none mt-3 opacity-60 blur-[1px]">
          <DhakaMapView counters={counters} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ComingSoonCard
          icon={CreditCard}
          title="Online Payment"
          description="Secure online payment for university transportation will be available in a future version."
        />
        {OTHER_FEATURES.map((feature) => (
          <ComingSoonCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
