"use client";

import { useOrganization } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MembersList() {
  const { organization, memberships } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const router = useRouter();

  const handleRemoveMember = async () => {
    if (!memberToRemove || !organization) return;

    setIsLoading(true);
    try {
      await organization.removeMember(memberToRemove);
      router.refresh();
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setIsLoading(false);
      setMemberToRemove(null);
    }
  };

  if (!organization || !memberships) {
    return (
      <div className="text-center py-10">
        <p>Please select an organization to view members.</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.data?.map((membership) => (
            <TableRow key={membership.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full overflow-hidden bg-muted">
                    {membership.publicUserData?.imageUrl ? (
                      <Image
                        src={
                          membership.publicUserData.imageUrl ||
                          "/placeholder.svg"
                        }
                        alt={membership.publicUserData.firstName || "Member"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-primary/10 text-primary">
                        {(
                          membership.publicUserData?.firstName?.[0] || ""
                        ).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p>
                      {membership.publicUserData?.firstName}{" "}
                      {membership.publicUserData?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {membership.publicUserData?.identifier}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize">
                  {membership.role.toLowerCase()}
                </span>
              </TableCell>
              <TableCell>
                {new Date(membership.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/members/${membership.id}`}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setMemberToRemove(membership.id)}
                    >
                      <Trash className="mr-2 size-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the organization?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Removing..." : "Remove Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
