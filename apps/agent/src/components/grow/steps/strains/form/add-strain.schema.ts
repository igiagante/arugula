import {
  FloweringType,
  StrainType,
} from "@/components/grow/steps/strains/types";
import { FileSchema } from "@/schemas/common.schema";
import { z } from "zod";

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
