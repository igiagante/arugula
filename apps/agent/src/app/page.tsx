import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    redirect("/grows");
  } else {
    redirect("/sign-in");
  }

  // This won't be reached due to the redirects above
  return null;
}
