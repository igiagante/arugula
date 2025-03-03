import { user } from "../schema";
import { DrizzleClient } from "../types";

export async function seedUsers(db: DrizzleClient) {
  const userId = "user_2tMsS1D6OD8KYB9GQxWHo6as1IX";
  const email = "igiagante@gmail.com";
  const imageUrl = "https://i.pravatar.cc/150?img=1";

  const [seededUser] = await db
    .insert(user)
    .values({
      id: userId,
      email,
      firstName: "Nachito",
      lastName: "Giagante",
      imageUrl,
      preferences: {
        measurements: {
          system: "metric",
          temperature: "celsius",
          volume: "liters",
          distance: "cm",
          weight: "grams",
        },
        notifications: {
          emailAlerts: true,
          pushNotifications: true,
        },
        display: {
          showMetrics: true,
          darkMode: false,
        },
      },
    })
    .returning();

  const userIdTwo = "user_2toSFUOtLvHrM1wGncdGc316shm";
  const emailTwo = "nachitogiagante@gmail.com";
  const imageUrlTwo = "https://i.pravatar.cc/150?img=1";

  const [seededUserTwo] = await db
    .insert(user)
    .values({
      id: userIdTwo,
      email: emailTwo,
      firstName: "Nachito",
      lastName: "Giagante",
      imageUrl: imageUrlTwo || "",
      preferences: {
        measurements: {
          system: "metric",
          temperature: "celsius",
          volume: "liters",
          distance: "cm",
          weight: "grams",
        },
        notifications: {
          emailAlerts: true,
          pushNotifications: true,
        },
        display: {
          showMetrics: true,
          darkMode: false,
        },
      },
    })
    .returning();

  return { users: [seededUser, seededUserTwo] };
}
