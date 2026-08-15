import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;

  return (
    <Card className="p-6">
      <h1 className="mb-1 text-lg font-semibold text-text">Welcome back</h1>
      <p className="mb-6 text-sm text-text-muted">Log in to book your university bus.</p>

      {registered === "1" && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-success-bg px-3 py-2.5 text-sm text-success">
          <CircleCheck size={16} className="mt-0.5 shrink-0" />
          <span>Account created successfully. Please log in to continue.</span>
        </div>
      )}

      <LoginForm />

      <p className="mt-6 text-center text-sm text-text-muted">
        New to CampusRide?{" "}
        <Link href="/register" className="font-medium text-maroon">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
