"use client";

import type React from "react";
import { useState } from "react";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicDetailsStep } from "./steps/basic-details-step";
import { SetupDetailsStep } from "./steps/setup-details-step";
import { growFormSchema, GrowFormValues } from "./schema";
import { growingMethods, growStages, steps } from "./constants";

const defaultValues: Partial<GrowFormValues> = {
  substrate: [
    { material: "Soil", percentage: 70 },
    { material: "Perlite", percentage: 20 },
    { material: "Coco", percentage: 10 },
  ],
  potSize: 7.5,
  images: [],
};

export function AddGrowForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);

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

  async function onSubmit(data: GrowFormValues) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const currentImages = form.getValues("images") || [];
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      form.setValue("images", [...currentImages, ...newImages]);
    }
  };

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
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="container max-w-2xl p-4 md:py-10  md:px-0">
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
              <span>{steps[step]?.title}</span>
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
                />
              )}

              {step === 1 && (
                <SetupDetailsStep
                  control={form.control}
                  fieldArray={fieldArray}
                  handleImageUpload={handleImageUpload}
                  watch={form.watch}
                  setValue={form.setValue}
                  getValues={form.getValues}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <div className="flex w-full gap-2 sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  asChild
                >
                  <Link href="/">Cancel</Link>
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
                  <Button className="flex-1 sm:flex-none" onClick={next}>
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
                    Save Grow
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
