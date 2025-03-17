import type React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset } from "@workspace/ui/components/sidebar";
import ChatContainer from "./(chat)/chat";

export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AppSidebar className="w-64 shrink-0" />

      <SidebarInset className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 pt-0 transition-all duration-300">
            {children}
          </div>

          <Separator orientation="vertical" className="h-full" />

          <ChatContainer />
        </div>
      </SidebarInset>
    </div>
  );
}
