import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
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
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted">
          <ImageWithFallback
            imageUrl={plant.strain?.images?.[0] || ""}
            alt={plant.customName}
          />
          <Badge
            className={`absolute top-2 right-2 ${getStageBadgeColor(
              plant.stage || ""
            )}`}
          >
            {plant.stage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-base sm:text-lg truncate">
            {plant.customName}
          </h3>
          {plant.strain && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Strain: {plant.strain.name}
            </p>
          )}
          {plant.potSize && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Pot: {plant.potSize}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onView(plant)}>
          <Eye className="size-4 mr-1" />
          Details
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(plant)}>
              <Edit className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(plant)}
            >
              <Trash2 className="size-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
