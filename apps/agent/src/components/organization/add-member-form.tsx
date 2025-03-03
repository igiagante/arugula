"use client";

import type React from "react";

import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AddMemberForm() {
  const { organization } = useOrganization();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("basic_member");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organization || !email) return;

    setIsLoading(true);
    try {
      await organization.inviteMember({
        emailAddress: email,
        role: role as "basic_member" | "admin",
      });

      toast.success("Invitation sent", {
        description: `An invitation has been sent to ${email}`,
      });

      router.push("/members");
    } catch (error) {
      console.error("Failed to invite member:", error);
      toast.error("Failed to send invitation", {
        description:
          "There was an error sending the invitation. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!organization) {
    return (
      <div className="text-center py-10">
        <p>Please select an organization to add members.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="member@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        <Button type="submit" disabled={isLoading || !email}>
          {isLoading ? "Sending Invitation..." : "Send Invitation"}
        </Button>
      </div>
    </form>
  );
}
