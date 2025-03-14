"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { apiRequest, HttpMethods } from "@/app/api/client";
import { CacheTags, createDynamicTag } from "@/app/api/tags";
import { GrowStages } from "@/lib/constants";
import { Plant } from "@/lib/db/schemas/plant.schema";
import { uploadImages } from "@/lib/s3/s3-upload";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useUserPreferences } from "@/hooks/use-user-preferences";
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
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { preferences } = useUserPreferences();

  // Initialize form with defaults
  const form = useForm<CreatePlantSchema>({
    resolver: zodResolver(createPlantSchema),
    defaultValues: {
      customName: "",
      strainId: "",
      stage: defaultStage,
      quantity: 1,
      notes: "",
    },
  });

  const { mutateAsync: createPlant } = useMutation({
    mutationFn: async (formData: CreatePlantPayload) => {
      await apiRequest<
        CreatePlantPayload,
        Omit<
          Plant,
          "id" | "archived" | "createdAt" | "updatedAt" | "harvestedAt"
        >
      >("/api/plants", {
        method: HttpMethods.POST,
        body: formData,
      });
    },
    onSuccess: (data, variables) => {
      const { growId } = variables;

      // Invalidate cache using the same key as the dashboard query
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

  // Handle form submission
  const onSubmit = async (data: CreatePlantSchema) => {
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("User not found");
      }

      // Add a type assertion to tell TypeScript that images can be mixed types
      const fileObjects = ((data.images || []) as (string | File)[]).filter(
        (img): img is File => typeof img === "object" && img instanceof File
      );

      // Upload images
      let uploadedImageUrls: string[] = [];
      if (fileObjects.length > 0) {
        uploadedImageUrls = await uploadImages(fileObjects);
      }

      await createPlant({
        growId,
        ...data,
        potSize: data.potSize?.toString() || null,
        potSizeUnit: preferences.measurements.volume,
        archived: false,
        notes: data.notes
          ? {
              content: data.notes,
              images: uploadedImageUrls,
            }
          : null,
      });
    } catch (error) {
      console.error("Error saving plant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PlantDialog<CreatePlantSchema>
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      onClose={onClose}
      isOpen={isOpen}
    />
  );
}
