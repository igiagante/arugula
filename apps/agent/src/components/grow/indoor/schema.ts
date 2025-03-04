import { FileSchema } from "@/schemas/common.schema";
import { z } from "zod";

export const createIndoorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  width: z.number().min(0.1, "Width must be greater than 0.1"),
  length: z.number().min(0.1, "Length must be greater than 0.1"),
  height: z.number().min(0.1, "Height must be greater than 0.1"),
  unit: z.string().min(1, "Unit is required"),
  lampType: z.string().min(1, "Lamp type is required"),
  lightIntensity: z.number().min(0).max(1000).optional(),
  lampFanSpeed: z.number().min(0).max(100).optional(),
  // Update this line to accept an array of strings or File objects
  images: z.array(z.union([z.string(), FileSchema])).optional(),
  notes: z.string().optional(),
});

export type CreateIndoorFormValues = z.infer<typeof createIndoorSchema>;
