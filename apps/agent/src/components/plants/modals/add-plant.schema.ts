import { GrowStages } from "@/lib/constants";
import { FileSchema } from "@/schemas/common.schema";
import { z } from "zod";

export const createPlantSchema = z.object({
  customName: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  images: z.array(z.union([z.string(), FileSchema])).optional(),
  strainId: z.string().min(1, { message: "Please select or create a strain." }),
  stage: z.string().default(GrowStages.seedling),
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1." })
    .default(1),
  notes: z.string().optional(),
  potSize: z.number().optional(),
  potSizeUnit: z.string().optional(),
});

export type CreatePlantSchema = z.infer<typeof createPlantSchema>;

export const editPlantSchema = createPlantSchema.extend({
  id: z.string().min(1, { message: "Plant ID is required" }),
});

export type EditPlantSchema = z.infer<typeof editPlantSchema>;
