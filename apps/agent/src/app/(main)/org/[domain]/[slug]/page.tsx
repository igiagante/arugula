// app/org/[domain]/[slug]/page.tsx
import { getOrganizationBySlug } from "@/lib/db/queries/organizations";
import { getUserById } from "@/lib/db/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

interface OrgPageProps {
  params: Promise<{
    domain: string;
    slug: string;
  }>;
}

export default async function OrgPage({ params }: OrgPageProps) {
  const { domain, slug } = await params;

  // Get organization by slug (domain without root domain)
  const domainWithoutRoot = domain.replace(
    `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    ""
  );

  const organization = await getOrganizationBySlug(domainWithoutRoot);
  if (!organization) {
    return notFound();
  }

  // Check if user has access to this organization
  const user = await currentUser();
  if (!user) {
    return redirect(`/sign-in?redirect=${domain}/${slug}`);
  }

  // Verify user belongs to org
  const dbUser = await getUserById({ id: user.id });
  if (!dbUser || dbUser.orgId !== organization.id) {
    return redirect("/unauthorized");
  }

  // If slug is empty, show the organization dashboard
  if (slug === "") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          {organization.name} Dashboard
        </h1>
        {/* Organization dashboard content */}
      </div>
    );
  }

  // Otherwise, load specific page content for the slug
  // e.g., /acme.arugula.com/settings
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {organization.name}: {slug}
      </h1>
      {/* Page specific content */}
    </div>
  );
}
