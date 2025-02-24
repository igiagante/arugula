export const growingMethods = [
  { label: "Soil", value: "soil" },
  { label: "Hydroponic", value: "hydroponic" },
  { label: "Coco", value: "coco" },
] as const;

export const growStages = [
  { label: "Seedling", value: "seedling" },
  { label: "Vegetative", value: "vegetative" },
  { label: "Flowering", value: "flowering" },
] as const;

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
] as const;
