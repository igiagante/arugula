import { Organization } from "@/lib/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import { Building2 } from "lucide-react";

export const OrganizationAvatar = ({
  org,
  className,
}: {
  org: Organization;
  className?: string;
}) => (
  <Avatar className={cn("size-4", className)}>
    <AvatarImage
      src={org.imageUrl || `https://avatar.vercel.sh/${org.id}`}
      alt={org.name}
    />
    <AvatarFallback>
      <Building2 className="size-3" />
    </AvatarFallback>
  </Avatar>
);
