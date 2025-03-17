"use client";

import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import { DeletePlantDialog } from "../delete-plant-dialog";
import { PlantCard } from "../plant-card";

interface GridViewPlantsProps {
  plants: PlantWithStrain[];
  onViewDetails: (plant: PlantWithStrain) => void;
  onEditPlant: (plant: PlantWithStrain) => void;
  onDeletePlant: (plant: PlantWithStrain) => void;
}

export function GridViewPlants({
  plants,
  onViewDetails,
  onEditPlant,
  onDeletePlant,
}: GridViewPlantsProps) {
  const { open: isSidebarOpen } = useSidebar();
  const [plantToDelete, setPlantToDelete] = useState<PlantWithStrain | null>(
    null
  );

  const handleEditPlant = (plant: PlantWithStrain) => {
    onEditPlant(plant);
  };

  const handleDeletePlant = (plant: PlantWithStrain) => {
    setPlantToDelete(plant);
  };

  const confirmDelete = () => {
    if (plantToDelete) {
      onDeletePlant(plantToDelete);
      setPlantToDelete(null);
    }
  };

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          isSidebarOpen
            ? "xl:grid-cols-3 2xl:grid-cols-4"
            : "xl:grid-cols-4 2xl:grid-cols-6"
        )}
      >
        {plants.map((plant) => (
          <PlantCard
            key={`${plant.id}-${plant.customName}`}
            plant={plant}
            onView={onViewDetails}
            onEdit={handleEditPlant}
            onDelete={handleDeletePlant}
          />
        ))}
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
