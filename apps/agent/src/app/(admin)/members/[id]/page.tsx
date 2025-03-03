import { EditMemberForm } from "@/components/organization/edit-member-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Member</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Member Details</CardTitle>
          <CardDescription>Update member information</CardDescription>
        </CardHeader>
        <CardContent>
          <EditMemberForm memberId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
