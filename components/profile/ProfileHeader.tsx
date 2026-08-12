import { User } from "lucide-react";
import type { Profile } from "@/types/domain";

export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-maroon-light text-maroon">
        <User size={36} />
      </span>
      <div>
        <p className="text-lg font-semibold text-text">{profile.full_name}</p>
        <p className="text-sm text-text-muted">{profile.student_id}</p>
      </div>
    </div>
  );
}
