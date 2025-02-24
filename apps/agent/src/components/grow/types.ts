import { z } from "zod";

export const formSchema = z.object({
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
  images: z.array(z.string()).optional(),
  hasAdjustableVentilation: z.boolean().default(false),
  ventilationSpeed: z.number().min(0).max(100).optional(),
  hasAdjustableLight: z.boolean().default(false),
  lightIntensity: z.number().min(0).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const steps = [
  {
    title: "Basic Details",
    description: "Enter the basic information about your grow.",
    fields: ["name", "stage", "startDate", "endDate", "growingMethod"],
  },
  {
    title: "Setup Details",
    description: "Configure your grow setup and environment.",
    fields: ["lampType", "substrate", "potSize", "images"],
  },
] as const;

export const defaultValues: Partial<FormValues> = {
  substrate: [
    { material: "Soil", percentage: 70 },
    { material: "Perlite", percentage: 20 },
    { material: "Coco", percentage: 10 },
  ],
  potSize: 7.5,
  images: [],
};
