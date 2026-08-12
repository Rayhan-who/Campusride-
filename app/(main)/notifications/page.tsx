import { Bell } from "lucide-react";
import { getMyNotifications } from "@/lib/data/notifications";
import { Card } from "@/components/shared/Card";
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

export default async function NotificationsPage() {
  const notifications = await getMyNotifications();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-text">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-text-muted">
          <Bell size={28} />
          <p className="text-sm">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn("p-4", !n.is_read && "border-maroon/30 bg-maroon-light/40")}
            >
              <p className="text-sm text-text">{n.message}</p>
              <p className="mt-1 text-xs text-text-muted">{timeAgo(n.created_at)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
