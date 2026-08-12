import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export function ComingSoonCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="flex flex-col gap-2 p-4 opacity-90">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-text-muted">
          <Icon size={18} />
        </span>
        <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-text-muted">
          Coming Soon
        </span>
      </div>
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="text-xs text-text-muted">{description}</p>
    </Card>
  );
}
