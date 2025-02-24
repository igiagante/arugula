export type Environment = {
  light: string;
  temp: string;
  humidity: string;
};

export type GrowStrain = {
  name: string;
  count: number;
  type: string;
  thc: string;
  cbd: string;
};

export type GrowView = {
  id: string;
  name: string;
  stage: string;
  environment: Environment;
  strains: GrowStrain[];
  progress: number;
  lastUpdated: Date;
  image?: string;
  yield?: string;
};
