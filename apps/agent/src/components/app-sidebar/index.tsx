import { auth } from "@clerk/nextjs/server";
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
import { Package, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { SidebarLeftIcon } from "../icons";
import { OrganizationSidebar } from "../organization/organization-sidebar";
import { ChatsHistory } from "./chats-history";
import { SideBarAdmin } from "./side-bar-admin";
import { SidebarActiveGrows } from "./sidebar-active-grows";
import { UserMenuItem } from "./user-menu-item";

export async function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const { orgId } = await auth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mt-2">
        <SidebarMenu className="gap-2 mb-2">
          <Link
            href="/"
            className="flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center gap-2 px-2"
          >
            <Image
              src="/cannabis-icon.svg"
              alt="Cannabis Icon"
              width={24}
              height={24}
              className="text-emerald-600 shrink-0 "
            />
            <span className="font-semibold group-data-[collapsible=icon]:hidden">
              Leaf Legacy
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
          <SidebarMenu className="flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
            <SidebarActiveGrows />
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar">
                  <Package />
                  <span>Store</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`/organizations/${orgId}`}>
                  <Settings />
                  <span>Settings</span>
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
