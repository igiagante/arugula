"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";
import { Progress } from "@workspace/ui/components/progress";

import { apiRequest, HttpMethods } from "@/app/api/client";
import type { UpdateGrowDto } from "@/app/api/dto";
import { CacheTags } from "@/app/api/tags";
import { uploadImages } from "@/app/utils/s3/s3-upload";
import type { GrowView } from "@/lib/db/queries/types/grow";
import type { Grow } from "@/lib/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { useFieldArray, useForm } from "react-hook-form";
import { growingMethods, growStages, steps } from "./constants";
import { growFormSchema, type GrowFormValues } from "./schema";
import { BasicDetailsStep } from "./steps/basic-details-step";
import { SetupDetailsStep } from "./steps/setup-details-step";
import { StrainGallery } from "./strains/strain-gallery";

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
    console.log("data", data);
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

  return (
    <div className="container max-w-3xl p-4 md:py-10 md:px-0">
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              {step > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 md:hidden"
                  onClick={prev}
                >
                  <ChevronLeft className="size-4" />
                  <span className="sr-only">Back</span>
                </Button>
              )}
              <span>Update {grow.name}</span>
            </CardTitle>
            <CardDescription>{steps[step]?.description}</CardDescription>
          </div>
          <div className="mt-4 space-y-1">
            <Progress
              value={((step + 1) / steps.length) * 100}
              className="h-1"
            />
            <p className="text-xs text-muted-foreground text-right">
              Step {step + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <CardContent>
              {step === 0 && (
                <BasicDetailsStep
                  control={form.control}
                  growStages={growStages}
                  growingMethods={growingMethods}
                  setValue={form.setValue}
                />
              )}

              {step === 1 && (
                <SetupDetailsStep
                  control={form.control}
                  fieldArray={fieldArray}
                  watch={form.watch}
                />
              )}
              {step === 2 && (
                <StrainGallery
                  onStrainsChange={(strains) => {
                    form.setValue("strainPlants", strains);
                  }}
                  existingStrains={grow.strains.map((strain) => ({
                    strainId: strain.strainId,
                    strain: strain.name,
                    plants: strain.plants,
                    plantsIds: strain.plantsIds,
                  }))}
                />
              )}
            </CardContent>

            <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <div className="flex w-full gap-2 sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 sm:flex-none hidden md:inline-flex"
                    onClick={prev}
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                {step < steps.length - 1 ? (
                  <Button
                    className="flex-1 sm:flex-none"
                    onClick={(e) => {
                      e.preventDefault();
                      next();
                    }}
                  >
                    Next
                    <ChevronRight className="ml-2 size-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 sm:flex-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Update Grow
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
