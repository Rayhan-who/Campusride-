import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { Card } from "@/components/shared/Card";

export default function ChangePasswordPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-text">Change Password</h1>
      <Card className="p-5">
        <ChangePasswordForm />
      </Card>
    </div>
  );
}
