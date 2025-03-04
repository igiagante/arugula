import { eq } from "drizzle-orm";
import { db } from "../index";
import { User, user } from "../schemas";

/**
 * GET a User by ID.
 */
export async function getUserById({ id }: { id: string }) {
  try {
    const users = await db.select().from(user).where(eq(user.id, id));
    return users[0];
  } catch (error) {
    console.error("Failed to get user by id from database");
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

/**
 * UPDATE a User.
 */
export async function updateUser({
  userId,
  data,
}: {
  userId: string;
  data: Partial<User>;
}) {
  try {
    const [updatedUser] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, userId))
      .returning();
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}
