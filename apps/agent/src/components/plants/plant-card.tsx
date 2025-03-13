import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../grow/image-with-fallback";
import { getStageBadgeColor } from "./plant-utils";

interface PlantCardProps {
  plant: PlantWithStrain;
  onView: (plant: PlantWithStrain) => void;
  onEdit: (plant: PlantWithStrain) => void;
  onDelete: (plant: PlantWithStrain) => void;
}

export function PlantCard({ plant, onView, onEdit, onDelete }: PlantCardProps) {
  return (
    <Card
      onClick={() => onView(plant)}
      className={cn(
        "overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-lg hover:-translate-y-0.5",
        "active:translate-y-0 active:shadow-md"
      )}
    >
      <CardHeader className="p-0">
        <div className="relative h-48">
          <ImageWithFallback
            imageUrl={
              plant.strain?.images?.[0] || plant.notes?.images?.[0] || ""
            }
            alt={plant.customName}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
          <div className="absolute top-2 right-2">
            <Badge
              className={`${getStageBadgeColor(plant.stage || "")} border border-white/20`}
            >
              {plant.stage || "Unknown"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors duration-300">
            {plant.customName}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-2" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(plant);
                }}
              >
                <Edit className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(plant);
                }}
              >
                <Trash2 className="size-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {plant.strain?.ratio && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{plant.strain.ratio}</span>
          </div>
        )}

        {(plant.strain?.cannabinoidProfile?.thc ||
          plant.strain?.cannabinoidProfile?.cbd) && (
          <div className="flex items-center gap-4 text-sm">
            {plant.strain?.cannabinoidProfile?.thc && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  THC:
                </span>
                <span>
                  {!isNaN(Number(plant.strain.cannabinoidProfile.thc))
                    ? `${plant.strain.cannabinoidProfile.thc}%`
                    : plant.strain.cannabinoidProfile.thc}
                </span>
              </div>
            )}
            {plant.strain?.cannabinoidProfile?.cbd && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  CBD:
                </span>
                <span>
                  {!isNaN(Number(plant.strain.cannabinoidProfile.cbd))
                    ? `${plant.strain.cannabinoidProfile.cbd}%`
                    : plant.strain.cannabinoidProfile.cbd}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
