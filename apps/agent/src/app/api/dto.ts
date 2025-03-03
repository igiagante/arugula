import type {
  Indoor,
  Lamp,
  Plant,
  Product,
  Strain,
  Task,
} from "@/lib/db/schema";
export interface CreateGrowDto {
  organizationId: string;
  indoorId: string;
  name: string;
  stage: string;
  startDate: Date;
  endDate?: Date;
  substrateComposition?: Record<string, number>;
  images: string[];
  potSize: string;
  potSizeUnit: string;
  growingMethod?: string;
  notes?: string;
  progress?: string;
  archived?: boolean;
  strainPlants: {
    strainId: string;
    strain: string;
    plants: number;
  }[];
}

export interface UpdateGrowDto {
  name?: string;
  stage?: string;
  startDate?: Date;
  endDate?: Date;
  growingMethod?: string;
  substrateComposition?: Record<string, number>;
  potSize?: string;
  images?: string[];
  strainPlants?: {
    strainId: string;
    strain: string;
    plants: number;
  }[];
}

export type CreateIndoorDto = Omit<Indoor, "id" | "createdAt" | "updatedAt"> & {
  lamp: Omit<Lamp, "id" | "indoorId" | "createdAt" | "updatedAt">;
};

export type UpdateIndoorDto = Partial<CreateIndoorDto>;

export type CreateLampDto = Omit<Lamp, "id" | "createdAt" | "updatedAt">;
export type UpdateLampDto = Partial<CreateLampDto>;

export type CreatePlantDto = Omit<Plant, "id" | "createdAt" | "updatedAt">;
export type UpdatePlantDto = Partial<CreatePlantDto>;

export type CreateProductDto = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductDto = Partial<CreateProductDto>;

export type CreateTaskDto = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskDto = Partial<CreateTaskDto>;

export type CreateStrainDto = Omit<Strain, "id" | "createdAt" | "updatedAt">;
export type UpdateStrainDto = Partial<CreateStrainDto>;
