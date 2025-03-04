"use client";

import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeletePlantDialog } from "./delete-plant-dialog";

export interface Plant {
  id: string;
  customName: string;
  stage: string;
  strain?: string;
  potSize?: string;
  imageUrl?: string;
  createdAt: string;
}

interface ListViewPlantsProps {
  plants: PlantWithStrain[];
  onViewDetails: (plant: PlantWithStrain) => void;
  onEditPlant: (plant: PlantWithStrain) => void;
}

export function ListViewPlants({
  plants,
  onViewDetails,
  onEditPlant,
}: ListViewPlantsProps) {
  const router = useRouter();
  const [plantToDelete, setPlantToDelete] = useState<PlantWithStrain | null>(
    null
  );

  const getStageBadgeColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "seedling":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "veg":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80";
      case "flowering":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "harvested":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80";
      case "curing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const handleDeletePlant = (plant: PlantWithStrain) => {
    setPlantToDelete(plant);
  };

  const confirmDelete = () => {
    // Here you would call your API to delete the plant
    console.log(`Deleting plant: ${plantToDelete?.id}`);
    setPlantToDelete(null);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plant Name</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="hidden sm:table-cell">Strain</TableHead>
              <TableHead className="hidden sm:table-cell">Pot Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.map((plant) => (
              <TableRow key={plant.id}>
                <TableCell className="font-medium">
                  {plant.customName}
                  <div className="sm:hidden text-xs text-muted-foreground mt-1">
                    {plant.strain && <span>Strain: {plant.strain.name}</span>}
                    {plant.potSize && (
                      <span className="ml-2">Pot: {plant.potSize}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStageBadgeColor(plant.stage || "")}>
                    {plant.stage}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {plant.strain?.name || "—"}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {plant.potSize || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(plant)}
                    >
                      <Eye className="size-4 sm:mr-1" />
                      <span className="hidden sm:inline">Details</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPlant(plant)}
                    >
                      <Edit className="size-4 sm:mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeletePlant(plant)}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeletePlantDialog
        plantName={plantToDelete?.customName}
        isOpen={!!plantToDelete}
        onOpenChange={(open) => !open && setPlantToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
