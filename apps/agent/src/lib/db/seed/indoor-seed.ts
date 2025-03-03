import crypto from "crypto";
import { indoor, lamp, organization } from "../schema";
import { DrizzleClient } from "../types";

export async function seedIndoors(db: DrizzleClient, userId: string) {
  // Create an organization
  const [seededOrg] = await db
    .insert(organization)
    .values({
      id: crypto.randomUUID(),
      name: "Test Organization",
      domain: "test-org.example.com",
      slug: "test-organization",
    })
    .returning();

  // Create an indoor
  const [seededIndoor] = await db
    .insert(indoor)
    .values({
      name: "Test Indoor",
      width: "50",
      length: "50",
      height: "70",
      dimensionUnit: "cm",
      temperature: "23",
      humidity: "50",
      co2: "800",
      images: ["https://example.com/photo1.jpg"],
      notes: "This is a test indoor setup with high-quality LED lighting.",
      createdBy: userId,
    })
    .returning();

  if (!seededIndoor) {
    throw new Error("Failed to insert indoor");
  }

  const lampData = {
    indoorId: seededIndoor.id,
    lampType: "600W LED",
    lightIntensity: "350",
    fanSpeed: "50",
    current: "2.5",
    voltage: "220",
    power: "600",
  };
  // Add lamp for the indoor
  await db.insert(lamp).values(lampData);

  // Create an indoor
  const [seededIndoor2] = await db
    .insert(indoor)
    .values({
      name: "Test Indoor 2",
      width: "50",
      length: "50",
      height: "70",
      dimensionUnit: "cm",
      temperature: "23",
      humidity: "50",
      co2: "800",
      images: ["https://example.com/photo1.jpg"],
      notes: "This is a test indoor setup with high-quality LED lighting.",
      createdBy: userId,
    })
    .returning();

  if (!seededIndoor2) {
    throw new Error("Failed to insert indoor");
  }

  const lampData2 = {
    indoorId: seededIndoor2.id,
    lampType: "400W COB LED",
    lightIntensity: "350",
    fanSpeed: "50",
    current: "2.5",
    voltage: "220",
    power: "400",
  };

  // Add lamp for the indoor
  await db.insert(lamp).values(lampData2);

  return {
    indoors: [seededIndoor.id, seededIndoor2.id],
    organization: seededOrg,
  };
}
