"use client";

import { apiRequest, HttpMethods } from "@/app/api/client";
import { CacheTags } from "@/app/api/tags";
import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Plant } from "@/lib/db/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditPlantSchema>({
    resolver: zodResolver(editPlantSchema),
    defaultValues: {
      customName: plant?.customName || "",
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
        customName: plant.customName || "",
        stage: plant.stage || "",
        potSize: plant.potSize ? Number(plant.potSize) : undefined,
        notes: plant.notes?.content || "",
      });
    }
  }, [plant, form]);

  const { mutateAsync: updatePlant } = useMutation({
    mutationFn: async (formData: EditPlantPayload) => {
      await apiRequest<Plant, EditPlantPayload>("/api/plants", {
        method: HttpMethods.PATCH,
        body: formData,
      });
    },
    onSuccess: (data, variables) => {
      const { growId } = variables;

      // Invalidate both cache keys to ensure the list updates
      queryClient.invalidateQueries({
        queryKey: [CacheTags.plants, growId],
      });
      queryClient.invalidateQueries({
        queryKey: [CacheTags.getPlantsByGrowId, growId],
      });

      toast.success("Plant updated successfully");
      router.push(`/grows/${growId}/plants`);
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
      const updatedPlant: EditPlantPayload = {
        ...plant,
        ...values,
        id: plant?.id || `new-${Date.now()}`,
        createdAt: plant?.createdAt?.toISOString() || new Date().toISOString(),
        growId: plant?.growId || "",
        strainId: plant?.strainId || "",
        updatedAt: new Date().toISOString(),
        archived: plant?.archived || false,
        potSize: values.potSize?.toString() || null,
        potSizeUnit: values.potSizeUnit || null,
        notes: values.notes
          ? {
              content: values.notes,
              images: plant?.notes?.images || undefined,
              createdAt:
                plant?.notes?.createdAt?.toISOString() ||
                new Date().toISOString(),
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
    />
  );
}
