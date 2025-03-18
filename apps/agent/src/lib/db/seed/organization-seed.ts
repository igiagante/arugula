import { organization } from "../schemas";
import { DrizzleClient } from "../types";

export async function seedOrganizations(db: DrizzleClient) {
  const [seededOrg] = await db
    .insert(organization)
    .values({
      id: "org_2tMsS1D6OD8KYB9GQxWHo6as1IX",
      name: "Arugula Test Org",
      slug: "arugula-test",
      domain: "arugula.com",
    })
    .returning();

  return { organizations: [seededOrg] };
}
