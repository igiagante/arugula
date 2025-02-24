import { getGrowsByUserId } from "@/lib/db/queries/grows";
import { GrowDashboardContent } from "@/components/grow/grow-dashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const grows = await getGrowsByUserId({ userId });

  return <GrowDashboardContent grows={grows} />;
}
