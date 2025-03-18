import { eq } from "drizzle-orm";

import { db } from "..";
import { organization } from "../schemas/organization.schema";

/**
 * Get an organization by its ID
 *
 * @param id - The organization's ID
 * @returns The organization record or null if not found
 */
export async function getOrganizationById(id: string) {
  try {
    const [result] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, id));

    return result || null;
  } catch (error) {
    console.error("Failed to get organization by id:", error);
    throw error;
  }
}

/**
 * Get an organization by its slug
 */
export async function getOrganizationBySlug(slug: string) {
  try {
    const [result] = await db
      .select()
      .from(organization)
      .where(eq(organization.slug, slug));
    return result || null;
  } catch (error) {
    console.error("Failed to get organization by slug:", error);
    throw error;
  }
}

/**
 * Get an organization by hostname
 */
export async function getOrganizationByHostname(hostname: string) {
  const slug = hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "");
  return getOrganizationBySlug(slug);
}
