"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card } from "@workspace/ui/components/card";

import { apiRequest, HttpMethods } from "@/app/api/client";
import type { UpdateGrowDto } from "@/app/api/dto";
import { CacheTags } from "@/app/api/tags";
import type { GrowView } from "@/lib/db/queries/types/grow";
import type { Grow } from "@/lib/db/schemas";
import { uploadImages } from "@/lib/s3/s3-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "@workspace/ui/components/form";
import { parseAsInteger, useQueryState } from "nuqs";
import { useFieldArray, useForm } from "react-hook-form";

import { steps } from "@/lib/constants";
import { GrowFormContent } from "./grow-form-content";
import { GrowFormFooter } from "./grow-form-footer";
import { GrowFormHeader } from "./grow-form-header";
import { growFormSchema, type GrowFormValues } from "./grow.schema";

interface UpdateGrowFormProps {
  grow: GrowView &
    Pick<
      Grow,
      | "startDate"
      | "endDate"
      | "growingMethod"
      | "substrateComposition"
      | "potSize"
      | "indoorId"
    >;
}

export function UpdateGrowForm({ grow }: UpdateGrowFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));

  // Add this useEffect to reset step on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      setStep(0);
    }
  }, [setStep]);

  // Initialize form with existing grow data
  const form = useForm<GrowFormValues>({
    resolver: zodResolver(growFormSchema),
    defaultValues: {
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
        : [
            { material: "Soil", percentage: 40 },
            { material: "Perlite", percentage: 20 },
            { material: "Turba", percentage: 20 },
            { material: "Humus", percentage: 20 },
          ],
      potSize: Number(grow.potSize) || 1,
      images: grow.images || [],
      indoorId: grow.indoorId,
      strainPlants: grow.strains.map((strain) => ({
        strainId: strain.strainId,
        plants: strain.plants,
        plantsIds: strain.plantsIds,
      })),
    },
    mode: "onChange",
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "substrate",
  });

  const { isSubmitting } = form.formState;

  const { mutateAsync: updateGrow } = useMutation({
    mutationFn: async (updatedGrow: UpdateGrowDto) => {
      return await apiRequest<GrowView, UpdateGrowDto>(
        `/api/grows/${grow.id}`,
        {
          method: HttpMethods.PATCH,
          body: updatedGrow,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheTags.grows] });
    },
  });

  async function onSubmit(data: GrowFormValues) {
    try {
      // Handle image uploads
      let uploadedImageUrls: string[] = [];
      if (data.images) {
        const newImages = data.images.filter((img) => img instanceof File);
        if (newImages.length > 0) {
          const newUploadedUrls = await uploadImages(newImages);
          uploadedImageUrls = [
            ...data.images.filter((img) => typeof img === "string"),
            ...newUploadedUrls,
          ];
        } else {
          uploadedImageUrls = data.images as string[];
        }
      }

      const { substrate, ...restData } = data;
      const growDto: UpdateGrowDto = {
        ...restData,
        startDate:
          data.startDate instanceof Date
            ? data.startDate
            : new Date(data.startDate),
        endDate: data.endDate
          ? data.endDate instanceof Date
            ? data.endDate
            : new Date(data.endDate)
          : undefined,
        images: uploadedImageUrls,
        potSize: String(data.potSize),
        substrateComposition: substrate.reduce(
          (acc, item) => ({
            ...acc,
            [item.material]: item.percentage,
          }),
          {}
        ),
        strainPlants: data.strainPlants || [],
      };

      await updateGrow(growDto);
      router.push("/grows");
    } catch (error) {
      console.error(error);
    }
  }

  // Check if the current step is valid
  const isCurrentStepValid = async () => {
    const fields = steps[step]?.fields;
    if (!fields) return false;
    const result = await form.trigger(fields as any);
    return result;
  };

  const next = async () => {
    const isValid = await isCurrentStepValid();
    if (isValid) {
      setStep(Math.min(step + 1, steps.length - 1));
    }
  };

  const prev = () => {
    setStep(Math.max(step - 1, 0));
  };

  const footerProps = {
    step,
    stepsLength: steps.length,
    isSubmitting,
    onCancel: () => router.back(),
    onPrev: prev,
    onNext: next,
    submitLabel: "Update Grow",
  };

  return (
    <div className="container max-w-3xl p-4 md:py-10 md:px-0">
      <Card>
        <GrowFormHeader step={step} steps={steps} onPrev={prev} />
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
              existingStrains={grow.strains.map((strain) => ({
                strainId: strain.strainId,
                strain: strain.name,
                plants: strain.plants,
                plantsIds: strain.plantsIds,
              }))}
            />
            <GrowFormFooter {...footerProps} />
          </form>
        </Form>
      </Card>
    </div>
  );
}
