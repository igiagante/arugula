import { User } from "@clerk/nextjs/server";

interface MappedUser {
  name: string;
  initials: string;
  avatar: string;
}

export function mapClerkUser(
  user: User,
  fallbackName = "Unknown User"
): MappedUser {
  const metadata = user.publicMetadata as {
    firstName?: string;
    lastName?: string;
  };

  const firstName = metadata.firstName || "";
  const lastName = metadata.lastName || "";
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || fallbackName;
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  const avatar = user.imageUrl || "";

  return {
    name: fullName,
    initials,
    avatar,
  };
}
