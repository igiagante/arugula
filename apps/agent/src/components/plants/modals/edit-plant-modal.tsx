"use client";

import { apiRequest, HttpMethods } from "@/app/(main)/api/client";
import { CacheTags, createDynamicTag } from "@/app/(main)/api/tags";
import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Plant } from "@/lib/db/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { convertImagesToPlantImages } from "../plant-utils";
import { EditPlantPayload } from "../types";
import { PlantDialog } from "./plant-dialog";
import { editPlantSchema, EditPlantSchema } from "./plant.schema";

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

  console.log("plant", plant);

  const form = useForm<EditPlantSchema>({
    resolver: zodResolver(editPlantSchema),
    defaultValues: {
      id: plant.id,
      customName: plant.customName || "",
      strainId: plant.strainId || "",
      stage: plant.stage || "",
      potSize: plant.potSize ? Number(plant.potSize) : undefined,
      notes: plant.notes || null,
      images: convertImagesToPlantImages(plant.images || []),
    },
  });

  const { mutateAsync: updatePlant, isPending } = useMutation({
    mutationFn: async (data: EditPlantSchema) => {
      const payload: EditPlantPayload = {
        ...data,
        growId: plant.growId,
        archived: plant.archived,
        strainId: data.strainId || null,
        stage: data.stage || null,
        potSize: data.potSize?.toString() || null,
        potSizeUnit: "L",
        images: Array.isArray(data.images) ? data.images : [],
      };

      return apiRequest<Plant, EditPlantPayload>(`/api/plants/${plant.id}`, {
        method: HttpMethods.PATCH,
        body: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [createDynamicTag(CacheTags.getPlantsByGrowId, plant.growId)],
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

  return (
    <PlantDialog
      form={form}
      isSubmitting={isPending}
      onSubmit={updatePlant}
      onClose={onClose}
      isOpen={isOpen}
      plant={plant}
    />
  );
}
