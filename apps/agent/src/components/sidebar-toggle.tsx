import { useSidebar } from "@workspace/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { Button } from "@workspace/ui/components/button";
import { SidebarLeftIcon } from "./icons";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 md:h-fit"
        >
          <SidebarLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
}
