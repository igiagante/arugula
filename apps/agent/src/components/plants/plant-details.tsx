import { GrowStages } from "@/lib/constants";
import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import { Droplets, Ruler, Thermometer } from "lucide-react";
import { getStageIcon } from "./plant-utils";

interface PlantDetailsProps {
  plant?: PlantWithStrain;
  getStageBadgeColor: (stage: string) => string;
}

export function PlantDetails({ plant, getStageBadgeColor }: PlantDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Current Stage */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getStageIcon(plant?.stage || "")}
            <h3 className="font-medium">
              Current Stage:{" "}
              <span className="text-primary">{plant?.stage || "Unknown"}</span>
            </h3>
          </div>
          <Badge className={getStageBadgeColor(plant?.stage || "")}>
            15 days
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>60%</span>
          </div>
          <Progress value={60} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {plant?.stage === GrowStages.vegetative
              ? "Plant is developing strong stems and foliage. Estimated 10 more days until flowering."
              : plant?.stage === GrowStages.flowering
                ? "Flowers are developing well. Watch for nutrient needs and maintain proper lighting."
                : "Current stage is progressing as expected."}
          </p>
        </div>
      </div>

      {/* Plant Vitals */}
      <div>
        <h3 className="font-medium text-sm mb-3">Plant Vitals</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <Ruler className="size-4 text-emerald-600" />
              <span className="text-xs font-medium">Height</span>
            </div>
            <span className="text-lg font-semibold">24 cm</span>
            <span className="text-xs text-muted-foreground">
              +2cm last week
            </span>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <Droplets className="size-4 text-blue-600" />
              <span className="text-xs font-medium">Last Watered</span>
            </div>
            <span className="text-lg font-semibold">2 days ago</span>
            <span className="text-xs text-muted-foreground">
              Next: Tomorrow
            </span>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <Thermometer className="size-4 text-red-600" />
              <span className="text-xs font-medium">Environment</span>
            </div>
            <span className="text-lg font-semibold">24°C / 55%</span>
            <span className="text-xs text-muted-foreground">
              Temp / Humidity
            </span>
          </div>
        </div>
      </div>

      {/* Plant Details */}
      <div>
        <h3 className="font-medium text-sm mb-3">Plant Information</h3>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <p className="font-medium">{plant?.customName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Strain:</span>
              <p className="font-medium">{plant?.strain?.name || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Pot Size:</span>
              <p className="font-medium">{plant?.potSize || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Added:</span>
              <p className="font-medium">
                {new Date(plant?.createdAt || new Date()).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Age:</span>
              <p className="font-medium">45 days</p>
            </div>
            <div>
              <span className="text-muted-foreground">Grow Medium:</span>
              <p className="font-medium">Coco coir + perlite</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="font-medium text-sm mb-2">Notes</h3>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            This plant has been showing excellent growth in the vegetative
            stage. The leaves are a vibrant green color and the structure is
            developing well. Planning to switch to flowering stage in about 1
            week.
          </p>
        </div>
      </div>
    </div>
  );
}
