import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";

interface MemberAvatarProps {
  name: string;
  initials: string;
  avatarUrl?: string;
  className?: string;
}

export const MemberAvatar = ({
  name,
  initials,
  avatarUrl,
  className,
}: MemberAvatarProps) => (
  <Avatar className={cn("size-8", className)}>
    <AvatarImage src={avatarUrl} alt={name} />
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
);
