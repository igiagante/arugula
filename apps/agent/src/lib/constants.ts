export const viewModes = {
  grid: "grid",
  list: "list",
} as const;

export type ViewModes = (typeof viewModes)[keyof typeof viewModes];

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

export const MEASUREMENT_UNIT_SYMBOLS = {
  // Volume
  liters: "L",
  gallons: "gal",

  // Temperature
  celsius: "°C",
  fahrenheit: "°F",

  // Distance
  cm: "cm",
  inches: "in",

  // Weight
  grams: "g",
  ounces: "oz",
} as const;

// Type for the measurement units
export type MeasurementUnit = keyof typeof MEASUREMENT_UNIT_SYMBOLS;
