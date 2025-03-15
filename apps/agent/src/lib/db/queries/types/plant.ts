export type PlantWithStrain = {
  id: string;
  growId: string;
  strainId: string | null;
  customName: string;
  stage: string | null;
  archived: boolean;
  potSize: string | null;
  notes: string | null;
  images: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  strain: {
    id: string;
    name: string;
    type: string;
    cannabinoidProfile: { thc: number; cbd: number } | null;
    description: string | null;
    ratio: string | null;
    images: string[] | null;
  } | null;
};
