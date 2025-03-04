"use client";

import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeletePlantDialog } from "./delete-plant-dialog";
import { PlantCard } from "./plant-card";

interface GridViewPlantsProps {
  plants: PlantWithStrain[];
  onViewDetails: (plant: PlantWithStrain) => void;
  onEditPlant: (plant: PlantWithStrain) => void;
}

export function GridViewPlants({
  plants,
  onViewDetails,
  onEditPlant,
}: GridViewPlantsProps) {
  const router = useRouter();
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
    // Here you would call your API to delete the plant
    console.log(`Deleting plant: ${plantToDelete?.id}`);
    setPlantToDelete(null);
  };

  console.log(plants);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
