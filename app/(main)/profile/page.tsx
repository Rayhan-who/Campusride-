import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Building2, Phone, ChevronRight, LogOut } from "lucide-react";
import { getProfile, getBookingCounts } from "@/lib/data/profile";
import { logout } from "@/app/(auth)/actions";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStatCard } from "@/components/profile/ProfileStatCard";
import { Card } from "@/components/shared/Card";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const counts = await getBookingCounts();

  return (
    <div className="flex flex-col gap-5">
      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-2 gap-3">
        <ProfileStatCard label="Total Bookings" value={counts.total} />
        <ProfileStatCard label="Upcoming Bookings" value={counts.upcoming} />
      </div>

      <Card className="p-1">
        <InfoRow icon={<Mail size={16} />} label="University Email" value={profile.university_email} />
        <InfoRow icon={<Building2 size={16} />} label="Department" value={profile.department || "—"} />
        <InfoRow icon={<Phone size={16} />} label="Phone" value={profile.phone || "—"} last />
      </Card>

      <Card className="p-1">
        <NavRow href="/profile/edit" label="Edit Profile" />
        <NavRow href="/profile/password" label="Change Password" last />
      </Card>

      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-danger/30 bg-white px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger-bg"
        >
          <LogOut size={16} /> Logout
        </button>
      </form>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-3 py-3 ${!last ? "border-b border-border" : ""}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-offwhite text-maroon">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="truncate text-sm font-medium text-text">{value}</p>
      </div>
    </div>
  );
}

function NavRow({ href, label, last }: { href: string; label: string; last?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-3.5 text-sm font-medium text-text transition-colors hover:bg-offwhite ${!last ? "border-b border-border" : ""}`}
    >
      {label}
      <ChevronRight size={16} className="text-text-muted" />
    </Link>
  );
}
