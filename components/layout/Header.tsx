import Link from "next/link";
import { User } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-offwhite/95 backdrop-blur supports-[backdrop-filter]:bg-offwhite/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-maroon">
          CampusRide
        </Link>
        <div className="flex items-center gap-1.5">
          <NotificationBell />
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text transition-colors hover:bg-black/5"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
