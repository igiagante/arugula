import { Button } from "@workspace/ui/components/button";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/60 px-6 backdrop-blur-lg">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Grow Dashboard</h1>
          <Button asChild>
            <Link href="/grows/new">New Grow</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-6 sm:p-8 sm:pt-6">{children}</main>
    </div>
  );
}
