import { z } from "zod";

export const growFormSchema = z.object({
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
  potSize: z.number().min(0.1, "Pot size must be greater than 0.1L"),
  growingMethod: z.string().min(1, "Growing method is required"),
  images: z.array(z.string()).optional(),
});

export type GrowFormValues = z.infer<typeof growFormSchema>;

export const createIndoorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  width: z.number().min(0.1, "Width must be greater than 0.1"),
  length: z.number().min(0.1, "Length must be greater than 0.1"),
  height: z.number().min(0.1, "Height must be greater than 0.1"),
  unit: z.string().min(1, "Unit is required"),
  lampType: z.string().min(1, "Lamp type is required"),
  lightIntensity: z.number().min(0).max(1000).optional(),
  lampFanSpeed: z.number().min(0).max(100).optional(),
  images: z.array(z.string()).optional(), // if storing multiple
  notes: z.string().optional(),
});

export type CreateIndoorFormValues = z.infer<typeof createIndoorSchema>;
