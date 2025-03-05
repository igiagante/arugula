import { GrowStages } from "@/lib/constants";
import { Calendar, Leaf, Scale, Sprout, Sun, Thermometer } from "lucide-react";

export const PLANT_STAGES = {
  [GrowStages.seedling]: {
    color: "bg-green-100 text-green-800 hover:bg-green-100/80",
    icon: Sprout,
    label: "Seedling",
  },
  [GrowStages.vegetative]: {
    color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
    icon: Leaf,
    label: "Vegetative",
  },
  [GrowStages.flowering]: {
    color: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
    icon: Sun,
    label: "Flowering",
  },
  [GrowStages.harvested]: {
    color: "bg-amber-100 text-amber-800 hover:bg-amber-100/80",
    icon: Scale,
    label: "Harvested",
  },
  [GrowStages.curing]: {
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
    icon: Thermometer,
    label: "Curing",
  },
  [GrowStages.archived]: {
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
    icon: Calendar,
    label: "Archived",
  },
} as const;

export type PlantStage = keyof typeof PLANT_STAGES;

export const getStageBadgeColor = (stage: PlantStage | string) => {
  return (
    PLANT_STAGES[stage as PlantStage]?.color ?? PLANT_STAGES.seedling.color
  );
};

export const getStageIcon = (stage: PlantStage | string) => {
  const Icon =
    PLANT_STAGES[stage as PlantStage]?.icon ?? PLANT_STAGES.seedling.icon;
  return <Icon className="size-5" />;
};
