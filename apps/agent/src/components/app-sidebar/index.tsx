import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { CalendarDays, Leaf, Package, Sprout } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { SidebarLeftIcon } from "../icons";
import { OrganizationSidebar } from "../organization/organization-sidebar";
import { ChatsHistory } from "./chats-history";
import { SideBarAdmin } from "./side-bar-admin";
import { UserMenuItem } from "./user-menu-item";

export async function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4">
        <SidebarMenu className="gap-2 mb-2">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="size-6 text-emerald-600 shrink-0 flex items-center justify-center" />
            <span className="font-semibold group-data-[collapsible=icon]:hidden">
              GrowTracker
            </span>
          </Link>
        </SidebarMenu>
        <SidebarMenu className="gap-2">
          <OrganizationSidebar />
        </SidebarMenu>
        <SidebarMenu className="gap-2">
          <SideBarAdmin />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarMenu className="flex flex-col gap-2 px-2">
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
        </SidebarGroup>
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
        <UserMenuItem />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
