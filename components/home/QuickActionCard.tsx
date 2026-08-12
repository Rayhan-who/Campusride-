import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function QuickActionCard({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-4 text-center shadow-sm shadow-black/[0.03] transition-colors hover:border-maroon/30 hover:bg-maroon-light/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-light text-maroon">
        <Icon size={22} />
      </span>
      <span className="text-sm font-medium text-text">{label}</span>
    </Link>
  );
}
