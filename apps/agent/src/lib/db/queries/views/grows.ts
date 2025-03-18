import type { Grow, Indoor, Lamp, Plant, Strain } from "@/lib/db/schemas";
import type { GrowStrain, GrowView } from "../types/grow";

export function createGrowView(
  growData: {
    grow: Grow;
    indoor: Indoor | null;
    plant: Plant | null;
    strain: Strain | null;
    lamp: Lamp | null;
  }[]
): GrowView | null {
  if (!growData.length) {
    return null;
  }

  const firstRow = growData[0]!;

  // Group plants by strain and count them
  const strainCounts = growData.reduce(
    (acc, row) => {
      if (!row.strain?.id?.toString()) return acc;
      const strainId = row.strain.id.toString();
      acc[strainId] = (acc[strainId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    ...firstRow.grow,
    stage: firstRow.grow.stage || "unknown", // Add default stage if missing
    indoor: firstRow.indoor || {
      id: "",
      name: "",
      orgId: "",
      height: null,
      width: null,
      length: null,
      dimensionUnit: "cm",
      temperature: null,
      humidity: null,
      co2: null,
      images: [],
      notes: null,
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    environment: {
      light: firstRow.lamp?.lampType ?? "",
      temp: firstRow.indoor?.temperature ?? "",
      humidity: firstRow.indoor?.humidity ?? "",
    },

    plants: growData
      .filter((row): row is typeof row & { plant: Plant } => row.plant !== null)
      .map((row) => row.plant),
    progress: Number(firstRow.grow.progress) || 0,
    lastUpdated: firstRow.grow.updatedAt,
    images: firstRow.grow.images || [],
    strains: Object.entries(
      growData.reduce(
        (acc, row) => {
          if (!row.strain?.id?.toString()) return acc;
          const strainId = row.strain.id.toString();
          if (acc[strainId]) return acc;

          // Parse cannabinoid profile if it exists
          const profile = row.strain.cannabinoidProfile as unknown as Record<
            string,
            string
          >;

          const thcValue = profile?.thc ?? "Unknown";
          const cbdValue = profile?.cbd ?? "Unknown";

          acc[strainId] = {
            strainId: row.strain.id.toString(),
            name: row.strain.name.toString(),
            plants: strainCounts[strainId] || 0,
            type: row.strain.type.toString(),
            genotype: row.strain.genotype?.toString() || "Unknown",
            ratio: row.strain.ratio?.toString() || "Unknown",
            thc: thcValue,
            cbd: cbdValue,
          };
          return acc;
        },
        {} as Record<string, GrowStrain>
      )
    ).map(([_, strain]) => strain),
  };
}
