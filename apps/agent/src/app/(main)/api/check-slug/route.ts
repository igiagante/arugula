import { getOrganizationByDomain } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

// Reserved slugs that cannot be used by organizations
const RESERVED_SLUGS = [
  "api",
  "admin",
  "app",
  "billing",
  "dashboard",
  "home",
  "login",
  "sign-in",
  "sign-up",
  "signup",
  "signin",
  "auth",
  "www",
  "mail",
  "email",
  "blog",
  "status",
  "support",
  "help",
  "documentation",
  "docs",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required" },
      { status: 400 }
    );
  }

  // Check if the slug format is valid
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { available: false, error: "Invalid slug format" },
      { status: 200 }
    );
  }

  // Check if it's a reserved slug
  if (RESERVED_SLUGS.includes(slug)) {
    return NextResponse.json(
      { available: false, error: "This is a reserved name" },
      { status: 200 }
    );
  }

  // Check if the slug already exists in the database
  const existingOrg = await getOrganizationByDomain({ domain: slug });

  return NextResponse.json({ available: !existingOrg }, { status: 200 });
}
