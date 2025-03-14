"use client";

import { apiRequest, HttpMethods } from "@/app/api/client";
import { CacheTags, createDynamicTag } from "@/app/api/tags";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Plant } from "@/lib/db/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { convertImagesToPlantImages } from "../plant-utils";
import { EditPlantPayload } from "../types";
import { editPlantSchema, EditPlantSchema } from "./add-plant.schema";
import { PlantDialog } from "./plant-dialog";

interface PlantEditModalProps {
  plant: PlantWithStrain;
  isOpen: boolean;
  onClose: () => void;
}

export function PlantEditModal({
  plant,
  isOpen,
  onClose,
}: PlantEditModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { preferences } = useUserPreferences();
  const volumeUnit = preferences?.measurements?.volume;
  const form = useForm<EditPlantSchema>({
    resolver: zodResolver(editPlantSchema),
    defaultValues: {
      id: plant?.id || "",
      customName: plant?.customName || "",
      strainId: plant?.strainId || "",
      stage: plant?.stage || "",
      potSize: plant?.potSize ? Number(plant.potSize) : undefined,
      notes: plant?.notes?.content || "",
      images: convertImagesToPlantImages(plant?.notes?.images || []),
    },
  });

  // Reset form when plant changes
  useEffect(() => {
    if (plant) {
      form.reset({
        id: plant.id,
        customName: plant.customName || "",
        strainId: plant.strainId || "",
        stage: plant.stage || "",
        potSize: plant.potSize ? Number(plant.potSize) : 1,
        potSizeUnit: volumeUnit,
        notes: plant.notes?.content || "",
      });
    }
  }, [plant, form, volumeUnit]);

  const { mutateAsync: updatePlant } = useMutation({
    mutationFn: async (formData: EditPlantPayload) => {
      await apiRequest<Plant, EditPlantPayload>(`/api/plants/${plant.id}`, {
        method: HttpMethods.PATCH,
        body: formData,
      });
    },
    onSuccess: (data, variables) => {
      const { growId } = variables;

      // Match the exact query key used in dashboard-plants.tsx
      queryClient.invalidateQueries({
        queryKey: [createDynamicTag(CacheTags.getPlantsByGrowId, growId)],
      });

      toast.success("Plant updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to update plant", {
        description: error.message,
      });
    },
  });

  // Handle form submission
  const onSubmit = async (values: EditPlantSchema) => {
    setIsSubmitting(true);

    try {
      const { notes: _notes, ...restPlant } = plant;
      const { notes, ...restValues } = values;

      const updatedPlant: EditPlantPayload = {
        ...restPlant,
        ...restValues,
        id: plant?.id || `new-${Date.now()}`,
        growId: plant.growId,
        strainId: plant?.strainId || "",
        customName: values.customName || plant.customName,
        stage: values.stage || plant.stage || "seedling",
        archived: plant?.archived || false,
        potSize: values.potSize?.toString() || "1",
        potSizeUnit: "L",
        notes: notes
          ? {
              content: notes,
              images: values.images || [],
            }
          : null,
      };

      await updatePlant(updatedPlant);
      onClose();
    } catch (error) {
      console.error("Error saving plant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PlantDialog<EditPlantSchema>
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      onClose={onClose}
      isOpen={isOpen}
      isEditing={true}
      plant={plant}
    />
  );
}
