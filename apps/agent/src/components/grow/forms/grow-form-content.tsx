import { growingMethods, growStages } from "@/lib/constants";
import { CardContent } from "@workspace/ui/components/card";
import {
  Control,
  UseFieldArrayReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { AddPlantsStep } from "../steps/add-plants-step";
import { BasicDetailsStep } from "../steps/basic-details-step";
import { SetupDetailsStep } from "../steps/setup-details-step";
import { GrowFormValues } from "./grow.schema";

interface GrowFormContentProps {
  step: number;
  control: Control<GrowFormValues>;
  fieldArray: UseFieldArrayReturn<GrowFormValues, "substrate">;
  watch: UseFormWatch<GrowFormValues>;
  setValue: UseFormSetValue<GrowFormValues>;
  existingStrains?: {
    strainId: string;
    strain: string;
    plants: number;
    plantsIds?: string[];
  }[];
}

export function GrowFormContent({
  step,
  control,
  fieldArray,
  watch,
  setValue,
  existingStrains,
}: GrowFormContentProps) {
  return (
    <CardContent>
      {step === 0 && (
        <BasicDetailsStep
          control={control}
          growStages={growStages}
          growingMethods={growingMethods}
          setValue={setValue}
        />
      )}

      {step === 1 && (
        <SetupDetailsStep
          control={control}
          fieldArray={fieldArray}
          watch={watch}
        />
      )}
      {step === 2 && (
        <AddPlantsStep
          onStrainsChange={(strains) => {
            setValue("strainPlants", strains);
          }}
          existingStrains={existingStrains}
        />
      )}
    </CardContent>
  );
}
