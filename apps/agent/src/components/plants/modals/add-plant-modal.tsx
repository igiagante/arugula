"use client";

import { apiRequest, HttpMethods } from "@/app/api/client";
import { CacheTags, createDynamicTag } from "@/app/api/tags";
import { GrowStages } from "@/lib/constants";
import { Plant } from "@/lib/db/schemas/plant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreatePlantPayload } from "../types";
import { createPlantSchema, CreatePlantSchema } from "./add-plant.schema";
import { PlantDialog } from "./plant-dialog";

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStage?: string;
  growId: string;
}

export function AddPlantModal({
  isOpen,
  onClose,
  defaultStage = GrowStages.seedling,
  growId,
}: AddPlantModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreatePlantSchema>({
    resolver: zodResolver(createPlantSchema),
    defaultValues: {
      customName: "",
      strainId: "",
      stage: defaultStage,
      quantity: 1,
      notes: null,
      images: null,
    },
  });

  const { mutateAsync: createPlant, isPending } = useMutation({
    mutationFn: async (submitData: CreatePlantPayload) => {
      return apiRequest<Plant, CreatePlantPayload>("/api/plants", {
        method: HttpMethods.POST,
        body: submitData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [createDynamicTag(CacheTags.getPlantsByGrowId, growId)],
      });
      toast.success("Plant created successfully");
      router.push(`/grows/${growId}/plants`);
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to create plants", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (data: CreatePlantSchema) => {
    createPlant({
      customName: data.customName,
      strainId: data.strainId || null,
      stage: data.stage || null,
      notes: data.notes || null,
      images: data.images || [],
      quantity: data.quantity || 1,
      potSize: data.potSize?.toString() || null,
      potSizeUnit: "L",
      growId,
      archived: false,
    });
  };

  return (
    <PlantDialog<CreatePlantSchema>
      form={form}
      isSubmitting={isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
      isOpen={isOpen}
      growId={growId}
    />
  );
}
