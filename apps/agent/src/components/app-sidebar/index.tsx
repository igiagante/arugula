import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { ComponentProps } from "react";
import { SidebarLeftIcon } from "../icons";
import { ChatsHistory } from "./chats-history";
import { Navigation } from "./navigation";
import { NewChatButton } from "./new-chat-button";
import { UserIndicator } from "./user-indicator";
import { CalendarDays, Home, Leaf, Package, Sprout } from "lucide-react";

export async function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className="gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="size-6 text-emerald-600" />
            <span className="font-semibold">GrowTracker</span>
          </Link>
        </SidebarMenu>
        <SidebarMenu className="gap-2">
          <Link href="/" passHref>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="New Chat">
                <NewChatButton />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Navigation />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
      <SidebarContent className="mt-2">
        <SidebarMenu className="flex flex-col gap-2 px-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/grows">
                <Sprout />
                <span>Active Grows</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/calendar">
                <CalendarDays />
                <span>Calendar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/store">
                <Package />
                <span>Store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <ChatsHistory />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="hidden items-center justify-center group-data-[collapsible=icon]:block">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Toggle Sidebar" asChild>
              <SidebarTrigger icon={<SidebarLeftIcon />} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <UserIndicator />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
