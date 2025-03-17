import { EditGrowContent } from "@/components/grow/edit-grow-content";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGrowPage({ params }: PageProps) {
  const { id } = await params;
  return <EditGrowContent growId={id} />;
}
