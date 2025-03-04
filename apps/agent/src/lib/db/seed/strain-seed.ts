import { uploadImageToS3ForSeed } from "@/lib/s3/s3-upload";
import { mapImages } from "@/lib/utils";
import fs, { readFileSync } from "fs";
import path from "path";
import postgres from "postgres";
import { strain } from "../schemas";
import { DrizzleClient } from "../types";

export async function seedStrains(db: DrizzleClient) {
  // Connect to the database
  const client = postgres(process.env.POSTGRES_URL!);

  try {
    // Upload sample images to S3 and get their keys
    const imagePath = path.join(
      process.cwd(),
      "src/lib/db/seed/images/1024.jpg"
    );

    // Check if file exists before trying to read it
    if (!fs.existsSync(imagePath)) {
      console.error(`Image file not found at: ${imagePath}`);
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const imageBuffer = readFileSync(imagePath);
    const imageFile = {
      buffer: imageBuffer,
      name: "1024.jpg",
      type: "image/jpeg",
    };

    const imagePath2 = path.join(
      process.cwd(),
      "src/lib/db/seed/images/gsc.jpg"
    );

    // Check if file exists before trying to read it
    if (!fs.existsSync(imagePath2)) {
      console.error(`Image file not found at: ${imagePath2}`);
      throw new Error(`Image file not found: ${imagePath2}`);
    }

    const imageBuffer2 = readFileSync(imagePath2);
    const imageFile2 = {
      buffer: imageBuffer2,
      name: "gsc.jpg",
      type: "image/jpeg",
    };

    // Upload images and get S3 keys
    const _1024_image = await uploadImageToS3ForSeed(imageFile);
    const _gsc_image = await uploadImageToS3ForSeed(imageFile2);

    const strain1024 = {
      name: "1024",
      type: "Hybrid",
      breeder: "MedicalSeeds",
      genotype: "Northern Lights x White Widow",
      floweringType: "photoperiod",
      ratio: "60% Indica / 40% Sativa",
      indoorVegTime: "4 weeks",
      indoorFlowerTime: "8 weeks",
      indoorYield: "500 g/m²",
      indoorHeight: "100-120 cm",
      outdoorHeight: "1.7 m",
      outdoorYield: "600 g/plant",
      cannabinoidProfile: { thc: "28%", cbd: "low" },
      terpeneProfile: "Myrcene, Limonene, Caryophyllene",
      awards: "Multiple Cannabis Cup Awards",
      description:
        "A potent strain known for its strong effects and high yields, ideal for experienced growers.",
      images: [_1024_image], // Store the S3 key
    };

    const strainGSC = {
      name: "Girl Scout Cookies",
      type: "Hybrid",
      breeder: "Cookie Fam",
      genotype: "OG Kush x Durban Poison",
      floweringType: "photoperiod",
      ratio: "40% Indica / 60% Sativa",
      indoorVegTime: "3-4 weeks",
      indoorFlowerTime: "9-10 weeks",
      indoorYield: "450 g/m²",
      indoorHeight: "90-110 cm",
      outdoorHeight: "1.8 m",
      outdoorYield: "550 g/plant",
      cannabinoidProfile: { thc: "25%", cbd: "0.2%" },
      terpeneProfile: "Caryophyllene, Limonene, Linalool",
      awards: "Multiple High Times Cannabis Cup Winner",
      description:
        "Famous for its sweet and earthy aroma, GSC delivers both full-body relaxation and cerebral euphoria.",
      images: [_gsc_image], // Store the S3 key
    };

    // Map the S3 keys to signed URLs for the returned strains
    const mappedStrain1024 = await mapImages({
      ...strain1024,
      images: strain1024.images || [],
    });
    const mappedStrainGSC = await mapImages({
      ...strainGSC,
      images: strainGSC.images || [],
    });

    // Store S3 keys in the database
    const [strain1024DB, strainGSCDB] = await db
      .insert(strain)
      .values([mappedStrain1024, mappedStrainGSC])
      .returning();

    return {
      strainIds: {
        strain1024Id: strain1024DB?.id,
        strainGscId: strainGSCDB?.id,
      },
    };
  } catch (error) {
    console.error("Error seeding strains:", error);
    // Return empty strain IDs to allow the seeding process to continue
    return {
      strainIds: {
        strain1024Id: undefined,
        strainGscId: undefined,
      },
    };
  } finally {
    await client.end();
  }
}
