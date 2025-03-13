import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/sign-in*", "/sign-up*"];

const isPublic = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x.replace("*", ".*")}$`))
  );
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isPublic(req.nextUrl.pathname)) {
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
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
