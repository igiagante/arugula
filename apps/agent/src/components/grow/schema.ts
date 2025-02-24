import { z } from "zod";

export const growFormSchema = z.object({
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
  lampType: z.string().min(1, "Lamp type is required"),
  hasAdjustableVentilation: z.boolean().default(false),
  ventilationSpeed: z.number().min(0).max(100).optional(),
  hasAdjustableLight: z.boolean().default(false),
  lightIntensity: z.number().min(0).max(1000).optional(),
  images: z.array(z.string()).optional(),
});

export type GrowFormValues = z.infer<typeof growFormSchema>;
