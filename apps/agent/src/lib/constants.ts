export const growingMethods = [
  { label: "Soil", value: "soil" },
  { label: "Hydroponic", value: "hydroponic" },
  { label: "Coco", value: "coco" },
] as const;

export const growStages = [
  { label: "Seedling", value: "seedling" },
  { label: "Vegetative", value: "vegetative" },
  { label: "Flowering", value: "flowering" },
  { label: "Harvested", value: "harvested" },
  { label: "Curing", value: "curing" },
  { label: "Archived", value: "archived" },
] as const;

export const GrowStages = {
  seedling: "seedling",
  vegetative: "vegetative",
  flowering: "flowering",
  growing: "growing",
  harvested: "harvested",
  curing: "curing",
  archived: "archived",
} as const;

export type GrowStages = (typeof GrowStages)[keyof typeof GrowStages];

export const growMethods = [
  { label: "Soil", value: "soil" },
  { label: "Hydroponic", value: "hydroponic" },
  { label: "Coco", value: "coco" },
] as const;

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
  {
    title: "Strain Selection",
    description:
      "Click on any strain card to select it. You can select multiple strains.",
    fields: ["strains"],
  },
] as const;
