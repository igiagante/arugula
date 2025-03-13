import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
