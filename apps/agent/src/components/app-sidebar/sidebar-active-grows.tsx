"use client";

import { apiRequest } from "@/app/api/client";
import { CacheTags } from "@/app/api/tags";
import { GrowView } from "@/lib/db/queries/types/grow";
import { useQuery } from "@tanstack/react-query";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@workspace/ui/components/sidebar";
import { ChevronDown, Sprout } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function SidebarActiveGrows() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: grows, isLoading } = useQuery({
    queryKey: [CacheTags.grows],
    queryFn: async () => {
      return await apiRequest<GrowView[]>("/api/grows");
    },
  });

  if (grows === null) {
    toast.error("Error loading grows", {
      description: "An error occurred while loading grows",
    });
    return null;
  }

  console.log("grows", grows);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setIsOpen(!isOpen)}
        className="group"
        data-state={isOpen ? "open" : "closed"}
      >
        <Sprout />
        <span>Active Grows</span>
        <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:-rotate-180" />
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
            grows?.map((grow) => (
              <SidebarMenuItem key={grow.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/grows/${grow.id}/plants`}>
                    <span>{grow.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
