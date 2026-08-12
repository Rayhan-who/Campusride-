"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getMyNotifications, markAllNotificationsReadAction } from "@/lib/data/notifications";
import type { Notification } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getMyNotifications();
      if (!cancelled) setNotifications(data);
    }

    load();
    const interval = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      startTransition(async () => {
        await markAllNotificationsReadAction();
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      });
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-text transition-colors hover:bg-black/5"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-maroon" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 max-w-[90vw] rounded-2xl border border-border bg-white p-2 shadow-lg">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm font-semibold text-text">Notifications</span>
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-maroon"
            >
              View all
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-text-muted">
                No notifications yet.
              </p>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "rounded-xl px-2 py-2.5 text-sm",
                    !n.is_read && "bg-maroon-light/60",
                  )}
                >
                  <p className="text-text">{n.message}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{timeAgo(n.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
