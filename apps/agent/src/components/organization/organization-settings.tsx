"use client";

import type React from "react";

import { deleteOrganization, updateOrganization } from "@/lib/api";
import type { OrganizationDetails } from "@/lib/types";
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
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { useState } from "react";

interface OrganizationSettingsProps {
  organization: OrganizationDetails;
  onOrganizationUpdated: (organization: OrganizationDetails) => void;
}

export function OrganizationSettings({
  organization,
  onOrganizationUpdated,
}: OrganizationSettingsProps) {
  const [formData, setFormData] = useState({
    name: organization.name,
    subdomain: organization.subdomain,
    description: organization.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const updatedOrg = await updateOrganization(organization.id, formData);
      onOrganizationUpdated(updatedOrg);
    } catch (err) {
      console.error("Failed to update organization:", err);
      setError("Failed to update organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrganization = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteOrganization(organization.id);
      // Redirect to organizations list or handle as needed
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to delete organization:", err);
      setError("Failed to delete organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
            <CardDescription>Update your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex items-center">
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) =>
                    setFormData({ ...formData, subdomain: e.target.value })
                  }
                  required
                />
                <span className="ml-2 text-muted-foreground">.example.com</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  Delete Organization
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the organization and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteOrganization}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
