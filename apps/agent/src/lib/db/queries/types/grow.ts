import type { Plant } from "@/lib/db/schema";

export type Environment = {
  light: string;
  temp: string;
  humidity: string;
};

export type GrowStrain = {
  strainId: string;
  name: string;
  type: string;
  thc: string;
  cbd: string;
  genotype: string;
  ratio: string;
  plants: number;
  plantsIds?: string[];
};

export type GrowView = {
  id: string;
  name: string;
  stage: string;
  environment: Environment;
  strains: GrowStrain[];
  plants: Plant[];
  progress: number;
  lastUpdated: Date;
  images: string[];
  yield?: string;
};

export type GrowStrainPlants = {
  strainId: string;
  strain: string;
  plants: number;
};
