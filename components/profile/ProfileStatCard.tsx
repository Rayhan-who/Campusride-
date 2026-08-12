import { Card } from "@/components/shared/Card";

export function ProfileStatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="flex flex-col items-center gap-1 p-4">
      <span className="text-2xl font-semibold text-maroon">{value}</span>
      <span className="text-xs text-text-muted">{label}</span>
    </Card>
  );
}
