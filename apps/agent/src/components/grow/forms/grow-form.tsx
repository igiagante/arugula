"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card } from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";

import { apiRequest, HttpMethods } from "@/app/api/client";
import { CacheTags } from "@/app/api/tags";
import { useImageUploader } from "@/hooks/use-image-uploader";
import type { GrowView } from "@/lib/db/queries/types/grow";
import type { Grow } from "@/lib/db/schemas";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { growSteps } from "../steps/steps";
import { GrowFormContent } from "./grow-form-content";
import { GrowFormFooter } from "./grow-form-footer";
import { GrowFormHeader } from "./grow-form-header";
import {
  createGrowSchema,
  editGrowSchema,
  type CreateGrowSchema,
  type EditGrowSchema,
} from "./grow.schema";

// Default values for new grows
const defaultValues: Partial<CreateGrowSchema> = {
  strainPlants: [],
  name: "",
  stage: "seedling",
  startDate: new Date(),
  endDate: undefined,
  growingMethod: "soil",
  substrate: [
    { material: "Soil", percentage: 40 },
    { material: "Perlite", percentage: 20 },
    { material: "Turba", percentage: 20 },
    { material: "Humus", percentage: 20 },
  ],
  potSize: 1,
  images: [],
};

interface GrowFormProps {
  grow?: GrowView &
    Pick<
      Grow,
      | "startDate"
      | "endDate"
      | "growingMethod"
      | "substrateComposition"
      | "potSize"
      | "indoorId"
    >;
  onSuccess?: () => void;
}

/**
 * Initializes form values based on whether we're editing an existing grow or creating a new one
 */
function initializeFormValues(grow?: GrowFormProps["grow"]): CreateGrowSchema {
  if (!grow) return defaultValues as CreateGrowSchema;

  return {
    name: grow.name,
    stage: grow.stage,
    startDate: new Date(grow.startDate || new Date()),
    endDate: grow.endDate ? new Date(grow.endDate) : undefined,
    growingMethod: grow.growingMethod || "soil",
    substrate: grow.substrateComposition
      ? Object.entries(grow.substrateComposition).map(
          ([material, percentage]) => ({
            material,
            percentage: Number(percentage),
          })
        )
      : defaultValues.substrate,
    potSize: Number(grow.potSize) || 1,
    images: grow.images || [],
    indoorId: grow.indoorId,
    strainPlants: grow.strains.map((strain) => ({
      strainId: strain.strainId,
      strain: strain.name,
      plants: strain.plants,
      plantsIds: strain.plantsIds,
    })),
    ...(grow.id ? { id: grow.id } : {}),
  } as CreateGrowSchema;
}

/**
 * Prepares form data for submission to the API
 */
function prepareSubmissionData(
  data: CreateGrowSchema,
  processedImages: string[],
  isEditing: boolean
): CreateGrowSchema | EditGrowSchema {
  return {
    ...data,
    startDate:
      data.startDate instanceof Date
        ? data.startDate
        : new Date(data.startDate),
    endDate: data.endDate
      ? data.endDate instanceof Date
        ? data.endDate
        : new Date(data.endDate)
      : undefined,
    images: processedImages,
    potSize: Number(data.potSize),
    ...(isEditing
      ? {}
      : { organizationId: "516e3958-1842-4219-bf07-2a515b86df04" }),
  };
}

export function GrowForm({ grow, onSuccess }: GrowFormProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!grow;
  const { trackDeletedImage, resetDeletedImages, processImages } =
    useImageUploader();
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));

  // Reset step on page load
  useEffect(() => {
    if (typeof window !== "undefined") setStep(0);
  }, [setStep]);

  // Initialize form with existing grow data or defaults
  const form = useForm<CreateGrowSchema>({
    resolver: zodResolver(isEditing ? editGrowSchema : createGrowSchema),
    defaultValues: initializeFormValues(grow),
    mode: "onChange",
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "substrate",
  });

  const { isSubmitting } = form.formState;

  // Combined mutation for create/update
  const { mutateAsync: submitGrow } = useMutation({
    mutationFn: async (data: CreateGrowSchema | EditGrowSchema) => {
      const endpoint = isEditing ? `/api/grows/${grow?.id}` : "/api/grows";
      const method = isEditing ? HttpMethods.PATCH : HttpMethods.POST;
      return await apiRequest(endpoint, { method, body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheTags.grows] });
      toast.success(
        isEditing
          ? `"${form.getValues("name")}" updated successfully`
          : `"${form.getValues("name")}" created successfully`
      );
      if (onSuccess) onSuccess();
      else router.push("/grows");
    },
    onError: (error) => {
      console.error("Error submitting grow:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "create"} "${form.getValues("name")}". Please try again.`
      );
    },
  });

  async function onSubmit(data: CreateGrowSchema) {
    try {
      if (!isEditing && !userId) throw new Error("User not found");

      // Process all images (handle deletions and uploads)
      const processedImages = await processImages(data.images || []);

      // Prepare data for submission using the schema types directly
      const growData = prepareSubmissionData(data, processedImages, isEditing);

      await submitGrow(growData);
      resetDeletedImages();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save. Please try again.");
    }
  }

  // Handle image removal
  const handleImageRemove = (index: number) => {
    const images = form.getValues("images") || [];
    if (typeof images[index] === "string")
      trackDeletedImage(images[index] as string);

    // Remove from form
    const currentImages = [...images] as (string | File)[];
    currentImages.splice(index, 1);
    form.setValue("images", currentImages);
  };

  // Check if the current step is valid
  const isCurrentStepValid = async () => {
    const fields = growSteps[step]?.fields;
    if (!fields) return false;
    return await form.trigger(fields as any);
  };

  const next = async () => {
    if (await isCurrentStepValid())
      setStep(Math.min(step + 1, growSteps.length - 1));
  };

  const prev = () => setStep(Math.max(step - 1, 0));

  const footerProps = {
    step,
    stepsLength: growSteps.length,
    isSubmitting,
    onCancel: () => router.push("/grows"),
    onPrev: prev,
    onNext: next,
    submitLabel: isEditing ? "Update Grow" : "Create Grow",
  };

  return (
    <div className="container max-w-3xl p-4 md:py-10 md:px-0">
      <Card>
        <GrowFormHeader step={step} steps={growSteps} onPrev={prev} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <GrowFormContent
              step={step}
              control={form.control}
              fieldArray={fieldArray}
              watch={form.watch}
              setValue={form.setValue}
              existingStrains={grow?.strains.map((strain) => ({
                strainId: strain.strainId,
                strain: strain.name,
                plants: strain.plants,
                plantsIds: strain.plantsIds,
              }))}
              onImageRemove={handleImageRemove}
            />
            <GrowFormFooter {...footerProps} />
          </form>
        </Form>
      </Card>
    </div>
  );
}
