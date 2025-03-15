import { VolumeUnits } from "@/components/user/user-preferences.types";
import { FileSchema } from "@/schemas/common.schema";
import { z } from "zod";

// Define a schema for strain plants
const growStrainPlantsSchema = z.object({
  strainId: z.string().min(1, "Strain is required"),
  strain: z.string().min(1, "Strain name is required"),
  plants: z.number().min(1, "Quantity is required"),
  plantsIds: z.array(z.string()).optional(),
});

export const createGrowSchema = z.object({
  indoorId: z.string().min(1, "Indoor space is required"),
  name: z.string().min(1, "Name is required"),
  stage: z.string().min(1, "Stage is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  substrate: z
    .array(
      z.object({
        material: z.string().min(1, "Material is required"),
        percentage: z.number().min(0).max(100),
      })
    )
    .refine((items) => {
      const total = items.reduce((acc, item) => acc + item.percentage, 0);
      return total === 100;
    }, "Substrate composition must total 100%"),
  potSize: z.number().min(0.1, "Pot size must be greater than 0.1"),
  potSizeUnit: z.string().default(VolumeUnits.liters),
  growingMethod: z.string().min(1, "Growing method is required"),
  images: z.array(z.union([z.string(), FileSchema])).optional(),
  strainPlants: z.array(growStrainPlantsSchema).default([]),
});

export type CreateGrowSchema = z.infer<typeof createGrowSchema>;

export const editGrowSchema = createGrowSchema.extend({
  id: z.string().min(1, { message: "Grow ID is required" }),
});

export type EditGrowSchema = z.infer<typeof editGrowSchema>;
