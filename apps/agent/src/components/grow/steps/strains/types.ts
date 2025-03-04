import { Strain } from "@/lib/db/schemas/strain.schema";

// Define the cannabinoid profile type
export interface CannabinoidProfile {
  thc?: string;
  cbd?: string;
  [key: string]: string | undefined;
}

// Extend the Strain type to include the properly typed cannabinoidProfile
export interface StrainWithProfiles extends Omit<Strain, "cannabinoidProfile"> {
  cannabinoidProfile?: CannabinoidProfile;
}

export const FloweringType = {
  photoperiod: "photoperiod",
  autoflower: "autoflower",
} as const;

export type FloweringType = (typeof FloweringType)[keyof typeof FloweringType];

export const StrainType = {
  indica: "indica",
  sativa: "sativa",
  hybrid: "hybrid",
} as const;

export type StrainType = (typeof StrainType)[keyof typeof StrainType];

export type SelectedStrain = {
  strainId: string;
  strain: string;
  plants: number;
};
