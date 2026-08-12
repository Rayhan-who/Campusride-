export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-offwhite px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-semibold tracking-tight text-maroon">
            CampusRide
          </span>
          <p className="mt-1 text-sm text-text-muted">Your campus. Your ride.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
