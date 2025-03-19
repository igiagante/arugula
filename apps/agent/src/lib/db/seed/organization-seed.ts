import { organization } from "../schemas";
import { DrizzleClient } from "../types";

export async function seedOrganizations(db: DrizzleClient) {
  // TODO: Remove this after testing
  const orgId = "org_2uOqFo24uWJy85kVPANcdfqbdmX";

  const [seededOrg] = await db
    .insert(organization)
    .values({
      id: orgId,
      name: "Arugula Test Org",
      slug: "arugula-test",
      domain: "arugula.com",
    })
    .returning();

  return { organizations: [seededOrg] };
}
