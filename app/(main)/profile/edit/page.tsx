import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/profile";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { Card } from "@/components/shared/Card";

export default async function EditProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-text">Edit Profile</h1>
      <Card className="p-5">
        <EditProfileForm profile={profile} />
      </Card>
    </div>
  );
}
