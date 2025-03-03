import { OrganizationContent } from "@/components/organization/organization-content";

export default async function OrganizationProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params to satisfy Next.js requirements
  const { id } = await params;

  return <OrganizationContent orgId={id} />;
}
