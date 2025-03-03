import { AddMemberForm } from "@/components/organization/add-member-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function NewMemberPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Add New Member</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Invite Member</CardTitle>
          <CardDescription>
            Add a new member to your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddMemberForm />
        </CardContent>
      </Card>
    </div>
  );
}
