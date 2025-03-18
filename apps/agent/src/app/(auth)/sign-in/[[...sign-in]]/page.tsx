"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
          elements: {
            rootBox: "mx-auto",
            card: "bg-white",
          },
        }}
      />
    </div>
  );
}
