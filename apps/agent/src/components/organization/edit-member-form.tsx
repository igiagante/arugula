"use client";

import type React from "react";

import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function EditMemberForm({ memberId }: { memberId: string }) {
  const { organization, memberships } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [memberName, setMemberName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (memberships?.data) {
      const member = memberships.data.find((m) => m.id === memberId);
      if (member) {
        setRole(member.role.toLowerCase());
        setMemberName(
          `${member.publicUserData?.firstName || ""} ${member.publicUserData?.lastName || ""}`
        );
      }
    }
  }, [memberships, memberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organization || !memberId) return;

    setIsLoading(true);
    try {
      await organization.updateMember({
        userId: memberId,
        role: role as "basic_member" | "admin",
      });

      toast.success("Member updated", {
        description: "The member's role has been updated successfully.",
      });

      router.push("/members");
    } catch (error) {
      console.error("Failed to update member:", error);
      toast.error("Failed to update member", {
        description:
          "There was an error updating the member. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!organization) {
    return (
      <div className="text-center py-10">
        <p>Please select an organization to edit members.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Member</Label>
        <p className="text-lg font-medium mt-1">{memberName || "Loading..."}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic_member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !role}>
          {isLoading ? "Updating..." : "Update Member"}
        </Button>
      </div>
    </form>
  );
}
