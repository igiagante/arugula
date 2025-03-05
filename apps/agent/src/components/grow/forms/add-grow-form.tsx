"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card } from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";

import { apiRequest, HttpMethods } from "@/app/api/client";
import type { CreateGrowDto } from "@/app/api/dto";
import { CacheTags } from "@/app/api/tags";
import { steps } from "@/lib/constants";
import type { Grow } from "@/lib/db/schemas";
import { uploadImages } from "@/lib/s3/s3-upload";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { useFieldArray, useForm } from "react-hook-form";
import { GrowFormContent } from "./grow-form-content";
import { GrowFormFooter } from "./grow-form-footer";
import { GrowFormHeader } from "./grow-form-header";
import { growFormSchema, GrowFormValues } from "./grow.schema";

const defaultValues: Partial<GrowFormValues> = {
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

export function AddGrowForm() {
  const router = useRouter();
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));

  // Add this useEffect to reset step on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      setStep(0);
    }
  }, [setStep]);

  const form = useForm<GrowFormValues>({
    resolver: zodResolver(growFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "substrate",
  });

  const { isSubmitting } = form.formState;

  const { mutateAsync: createGrow } = useMutation({
    mutationFn: async (newGrow: CreateGrowDto) => {
      return await apiRequest<Grow, CreateGrowDto>("/api/grows", {
        method: HttpMethods.POST,
        body: newGrow,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheTags.grows] });
    },
  });

  async function onSubmit(data: GrowFormValues) {
    try {
      if (!userId) {
        throw new Error("User not found");
      }

      // Upload images first if there are any
      let uploadedImageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        uploadedImageUrls = await uploadImages(data.images);
      }

      const { substrate, ...restData } = data;
      const growDto: CreateGrowDto = {
        ...restData,
        organizationId: "516e3958-1842-4219-bf07-2a515b86df04", // TODO: get organization id from clerk
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        images: uploadedImageUrls || [],
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

      await createGrow(growDto);
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
    onCancel: () => router.push("/grows"),
    onPrev: prev,
    onNext: next,
  };

  return (
    <div className="container max-w-3xl p-4 md:py-10  md:px-0">
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
            />
            <GrowFormFooter {...footerProps} />
          </form>
        </Form>
      </Card>
    </div>
  );
}
