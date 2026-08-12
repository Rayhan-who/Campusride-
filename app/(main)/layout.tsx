import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-4">{children}</main>
      <BottomNav />
    </>
  );
}
