export type Image = {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt?: Date;
};

export type PlantImage = Image;
export type StrainImage = Image;

export type CreatePlantPayload = {
  growId: string;
  strainId: string | null;
  customName: string;
  stage: string | null;
  archived: boolean;
  notes?: {
    content: string;
    images?: string[];
  } | null;
  images?: string[];
  quantity?: number;
  potSize: string | null;
  potSizeUnit: string | null;
};

export type EditPlantPayload = CreatePlantPayload & {
  id: string;
};

export type StrainOption = {
  label: string;
  value: string;
};

export type Strain = {
  id: string;
  name: string;
  description: string;
  images: StrainImage[];
};
