import { Strain } from "@/lib/db/schema";

export const mockStrains: Strain[] = [
  {
    id: "1",
    name: "Northern Lights",
    type: "indica",
    genotype: "Afghani x Thai",
    breeder: "Sensi Seeds",
    floweringType: "photoperiod",
    ratio: "Indica 90% / Sativa 10%",

    indoorVegTime: "3-4 weeks",
    indoorFlowerTime: "7-8 weeks",
    indoorYield: "400-500g/m²",
    indoorHeight: "80-130cm",
    outdoorHeight: "80-130cm",
    outdoorYield: "450g/plant",

    cannabinoidProfile: { thc: "18%", cbd: "0.1%" },
    terpeneProfile: "Myrcene, Pinene",

    awards: "Cannabis Cup Winner",
    description:
      "A legendary indica known for its resinous buds and relaxing effects.",
    images: [],
  },
  {
    id: "2",
    name: "White Widow",
    type: "hybrid",
    genotype: "Brazilian Sativa x South Indian Indica",
    breeder: "Green House Seeds",
    floweringType: "photoperiod",
    ratio: "60% Indica / 40% Sativa",

    indoorVegTime: "4-5 weeks",
    indoorFlowerTime: "8-9 weeks",
    indoorYield: "450-550g/m²",
    indoorHeight: "60-100cm",
    outdoorHeight: "60-100cm",
    outdoorYield: "500g/plant",

    cannabinoidProfile: { thc: "20%", cbd: "0.2%" },
    terpeneProfile: "Caryophyllene, Limonene",

    awards: "High Times Cannabis Cup",
    description: "Famous for its white crystal resin and powerful effects.",
    images: [],
  },
  {
    id: "3",
    name: "Blue Dream",
    type: "sativa",
    genotype: "Blueberry x Haze",
    breeder: "DJ Short",
    floweringType: "photoperiod",
    ratio: "30% Indica / 70% Sativa",

    indoorVegTime: "4-5 weeks",
    indoorFlowerTime: "9-10 weeks",
    indoorYield: "500-600g/m²",
    indoorHeight: "120-180cm",
    outdoorHeight: "120-180cm",
    outdoorYield: "600g/plant",

    cannabinoidProfile: { thc: "17%", cbd: "0.5%" },
    terpeneProfile: "Myrcene, Pinene, Linalool",

    awards: "Multiple Cannabis Cups",
    description:
      "A sativa-dominant hybrid with sweet berry aroma and balanced effects.",
    images: [],
  },
  {
    id: "4",
    name: "Girl Scout Cookies",
    type: "hybrid",
    genotype: "OG Kush x Durban Poison",
    breeder: "Cookie Fam",
    floweringType: "photoperiod",
    ratio: "60% Indica / 40% Sativa",

    indoorVegTime: "3-4 weeks",
    indoorFlowerTime: "9-10 weeks",
    indoorYield: "400-450g/m²",
    indoorHeight: "80-110cm",
    outdoorHeight: "80-110cm",
    outdoorYield: "450g/plant",

    cannabinoidProfile: { thc: "28%", cbd: "0.1%" },
    terpeneProfile: "Caryophyllene, Limonene, Humulene",

    awards: "Multiple Cannabis Cup Winner",
    description:
      "Known for its sweet and earthy aroma with powerful euphoric effects.",
    images: [],
  },
  {
    id: "5",
    name: "Purple Haze",
    type: "sativa",
    genotype: "Purple Thai x Haze",
    breeder: "Seedsman",
    floweringType: "photoperiod",
    ratio: "Sativa 85% / Indica 15%",

    indoorVegTime: "4-5 weeks",
    indoorFlowerTime: "8-9 weeks",
    indoorYield: "450-550g/m²",
    indoorHeight: "150-200cm",
    outdoorHeight: "150-200cm",
    outdoorYield: "550g/plant",

    cannabinoidProfile: { thc: "20%", cbd: "0.1%" },
    terpeneProfile: "Terpinolene, Myrcene, Ocimene",

    awards: "Legendary Status",
    description:
      "A classic sativa made famous by Jimi Hendrix, known for its creative effects.",
    images: [],
  },
];
