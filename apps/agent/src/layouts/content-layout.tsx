import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { AlignLeftIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ContentLayoutProps {
  title: string;
  children: ReactNode;
  navigation?: ReactNode;
}

export function ContentLayout({
  title,
  navigation,
  children,
}: ContentLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-background sticky top-0 z-50 border-b">
        <div className="flex h-12 items-center gap-4 px-4">
          <div
            className="flex items-center md:hidden"
            aria-label="Toggle sidebar menu"
          >
            <SidebarTrigger icon={<AlignLeftIcon className="size-5" />} />
          </div>
          <h1 className="text-lg font-medium tracking-tight">{title}</h1>
          {navigation && (
            <nav className="flex items-center" >
              {navigation}
            </nav>
          )}
        </div>
      </header>
      <div className="flex-1 p-4" role="main">
        {children}
      </div>
    </main>
  );
}
