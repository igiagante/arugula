import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isPublicRoute = (path: string) => {
  return (
    path.startsWith("/sign-in") || path.startsWith("/sign-up") || path === "/"
  );
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isPublicRoute(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session.userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
