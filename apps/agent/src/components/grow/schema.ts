import { VolumeUnits } from "@/app/types/user/preferences";
import { z } from "zod";
import { FloweringType, StrainType } from "./strains/strain-gallery";

// Create a type that works in both browser and server environments
const FileSchema =
  typeof File !== "undefined"
    ? z.instanceof(File)
    : z.any().refine(() => false, {
        message: "Files can only be uploaded in the browser",
      });

const growStrainPlantsSchema = z.object({
  strainId: z.string().min(1, "Strain is required"),
  strain: z.string().min(1, "Strain name is required"),
  plants: z.number().min(1, "Quantity is required"),
  plantsIds: z.array(z.string()).optional(),
});

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
  potSize: z.number().min(0.1, "Pot size must be greater than 0.1"),
  potSizeUnit: z.string().default(VolumeUnits.liters),
  growingMethod: z.string().min(1, "Growing method is required"),
  images: z.array(z.union([z.string(), FileSchema])).optional(),
  strainPlants: z.array(growStrainPlantsSchema).optional(),
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
  // Update this line to accept an array of strings or File objects
  images: z.array(z.union([z.string(), FileSchema])).optional(),
  notes: z.string().optional(),
});

export type CreateIndoorFormValues = z.infer<typeof createIndoorSchema>;

export const createStrainSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    breeder: z.string().min(2, "Breeder name must be at least 2 characters"),
    genotype: z.string(),
    ratio: z.string(),
    floweringType: z.enum(
      [FloweringType.photoperiod, FloweringType.autoflower],
      {
        errorMap: () => ({ message: "Please select a valid flowering type" }),
      }
    ),
    type: z.enum([StrainType.indica, StrainType.sativa, StrainType.hybrid], {
      errorMap: () => ({ message: "Please select a valid strain type" }),
    }),
    cannabinoidProfile: z
      .object({
        thc: z.string().optional(),
        cbd: z.string().optional(),
      })
      .optional(),
    indoorVegTime: z.string().optional(),
    indoorFlowerTime: z.string().optional(),
    indoorYield: z.string().optional(),
    indoorHeight: z.string().optional(),
    outdoorHeight: z.string().optional(),
    outdoorYield: z.string().optional(),
    terpeneProfile: z.string().optional(),
    awards: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.union([z.string(), FileSchema])).optional(),
    sativaPercentage: z
      .number()
      .min(0)
      .max(100)
      .describe("Percentage of Sativa"),
    indicaPercentage: z
      .number()
      .min(0)
      .max(100)
      .describe("Percentage of Indica"),
  })
  .refine(
    (data) => {
      return data.sativaPercentage + data.indicaPercentage === 100;
    },
    {
      message: "Sativa and Indica percentages must add up to 100%",
      path: ["indicaPercentage"], // This specifies which field the error is attached to
    }
  );

export type StrainFormValues = z.infer<typeof createStrainSchema>;
