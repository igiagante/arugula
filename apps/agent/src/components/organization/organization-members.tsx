"use client";

import { addMember, removeMember, resendInvite, updateMember } from "@/lib/api";
import type { Member } from "@/lib/types";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
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
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Mail, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { useState } from "react";

interface OrganizationMembersProps {
  organizationId: string;
  members: Member[];
  onMembersChange: (members: Member[]) => void;
}

export function OrganizationMembers({
  organizationId,
  members,
  onMembersChange,
}: OrganizationMembersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    role: "member",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const newMember = await addMember(organizationId, newMemberData);
      onMembersChange([...members, newMember]);
      setIsAddDialogOpen(false);
      setNewMemberData({ name: "", email: "", role: "member" });
    } catch (err) {
      console.error("Failed to add member:", err);
      setError("Failed to add member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    try {
      setIsLoading(true);
      setError(null);

      const updatedMember = await updateMember(
        organizationId,
        selectedMember.id,
        { role: selectedMember.role }
      );

      onMembersChange(
        members.map((m) => (m.id === updatedMember.id ? updatedMember : m))
      );

      setIsEditDialogOpen(false);
      setSelectedMember(null);
    } catch (err) {
      console.error("Failed to update member:", err);
      setError("Failed to update member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      setIsLoading(true);
      setError(null);

      await removeMember(organizationId, selectedMember.id);
      onMembersChange(members.filter((m) => m.id !== selectedMember.id));

      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
    } catch (err) {
      console.error("Failed to remove member:", err);
      setError("Failed to remove member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvite = async (memberId: string) => {
    try {
      setError(null);
      await resendInvite(organizationId, memberId);
      // Show success message or update UI as needed
    } catch (err) {
      console.error("Failed to resend invite:", err);
      setError("Failed to resend invite. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 size-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>
            Manage members and their roles within this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                  >
                    {searchQuery
                      ? "No members found"
                      : "No members in this organization"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.role === "admin" ? "default" : "outline"
                        }
                      >
                        {member.role === "admin" ? "Admin" : "Member"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.status === "pending" ? (
                        <div className="flex items-center">
                          <Badge variant="secondary">Pending</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 size-6"
                            onClick={() => handleResendInvite(member.id)}
                            title="Resend Invite"
                          >
                            <Mail className="size-3" />
                          </Button>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Active
                        </Badge>
                      )}
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Invite a new member to join this organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newMemberData.name}
                onChange={(e) =>
                  setNewMemberData({ ...newMemberData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newMemberData.email}
                onChange={(e) =>
                  setNewMemberData({ ...newMemberData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newMemberData.role}
                onValueChange={(value) =>
                  setNewMemberData({ ...newMemberData, role: value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={selectedMember?.role}
                onValueChange={(value) =>
                  setSelectedMember((prev) =>
                    prev ? { ...prev, role: value } : null
                  )
                }
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from this
              organization? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Removing..." : "Remove Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
