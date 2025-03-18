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
import { CreateGrowSchema } from "./grow.schema";

interface GrowFormContentProps {
  growId?: string;
  step: number;
  control: Control<CreateGrowSchema>;
  fieldArray: UseFieldArrayReturn<CreateGrowSchema, "substrate">;
  watch: UseFormWatch<CreateGrowSchema>;
  setValue: UseFormSetValue<CreateGrowSchema>;
  existingStrains?: {
    strainId: string;
    strain: string;
    plants: number;
    plantsIds?: string[];
  }[];
  onImageRemove?: (index: number) => void;
}

export function GrowFormContent({
  growId,
  step,
  control,
  fieldArray,
  watch,
  setValue,
  existingStrains,
  onImageRemove,
}: GrowFormContentProps) {
  return (
    <CardContent>
      {step === 0 && (
        <BasicDetailsStep
          control={control}
          growStages={growStages}
          growingMethods={growingMethods}
          setValue={setValue}
          growId={growId}
        />
      )}

      {step === 1 && (
        <SetupDetailsStep
          control={control}
          fieldArray={fieldArray}
          watch={watch}
          onImageRemove={onImageRemove}
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
