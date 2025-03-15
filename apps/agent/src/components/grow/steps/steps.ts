export const growSteps = [
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
    fields: ["strainPlants"],
  },
] as const;
