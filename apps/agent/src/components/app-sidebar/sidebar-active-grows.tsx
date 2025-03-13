"use client";

import { apiRequest } from "@/app/api/client";
import { CacheTags } from "@/app/api/tags";
import { useIsMobile } from "@/hooks/use-mobile";
import { GrowView } from "@/lib/db/queries/types/grow";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { ChevronDown, Sprout } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function SidebarActiveGrows() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { data: grows, isLoading } = useQuery({
    queryKey: [CacheTags.grows],
    queryFn: async () => {
      return await apiRequest<GrowView[]>("/api/grows");
    },
  });

  const { setOpen } = useSidebar();

  const handleClick = (e: React.MouseEvent) => {
    // For mobile, close the sidebar
    if (isMobile) {
      setOpen(false);
    } else {
      // For desktop, toggle the dropdown
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  if (grows === null) {
    toast.error("Error loading grows", {
      description: "An error occurred while loading grows",
    });
    return null;
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleClick}
        className="group justify-start group-data-[collapsible=icon]:justify-center"
        data-state={isOpen ? "open" : "closed"}
      >
        <Link href="/grows" onClick={handleClick}>
          <Sprout className="shrink-0 stroke-[1.5px]" />
        </Link>
        <span className="group-data-[collapsible=icon]:hidden">
          Active Grows
        </span>
        <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:-rotate-180 group-data-[collapsible=icon]:hidden" />
      </SidebarMenuButton>
      {isOpen && (
        <SidebarMenuSub>
          {isLoading ? (
            <SidebarMenuItem>
              <span className="px-2 py-1.5 text-sm text-muted-foreground">
                Loading Grows...
              </span>
            </SidebarMenuItem>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/grows"
                    className="flex items-center gap-2"
                    onClick={handleClick}
                  >
                    <span>All Grows</span>
                    {grows?.length && grows.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {grows.length}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {grows?.map((grow) => (
                <SidebarMenuItem key={grow.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/grows/${grow.id}/plants`}
                      onClick={() => {
                        if (isMobile) {
                          setOpen(false);
                        }
                      }}
                    >
                      <span>{grow.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          )}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
