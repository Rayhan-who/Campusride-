"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarClock, Ticket, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/bookings", label: "Bookings", icon: Ticket },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-3xl items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
                active ? "text-maroon" : "text-text-muted hover:text-text",
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
