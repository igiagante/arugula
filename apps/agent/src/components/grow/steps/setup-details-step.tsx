import { Plus, X } from "lucide-react";

import type { Control, UseFieldArrayReturn } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import ImageUploader from "@/components/image-uploader/image-uploader";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { CreateGrowSchema } from "../forms/grow.schema";

interface SetupDetailsStepProps {
  control: Control<CreateGrowSchema>;
  fieldArray: UseFieldArrayReturn<CreateGrowSchema, "substrate">;
  watch: (name: string) => any;
  onImageRemove?: (index: number) => void;
}

export function SetupDetailsStep({
  control,
  fieldArray: { append, remove },
  watch,
  onImageRemove,
}: SetupDetailsStepProps) {
  const { preferences } = useUserPreferences();
  const volumeUnit = preferences.measurements.volume;

  return (
    <div
      className="space-y-8"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
    >
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <FormLabel>Substrate Composition</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ material: "", percentage: 0 })}
          >
            <Plus className="mr-2 size-4" />
            Add Material
          </Button>
        </div>
        <div className="space-y-4">
          {watch("substrate")?.map(
            (
              field: { id: string; material: string; percentage: number },
              index: number
            ) => (
              <div
                key={`${field.material}-${index}`}
                className="grid grid-cols-[1fr_120px_40px] gap-4"
              >
                <FormField
                  control={control}
                  name={`substrate.${index}.material`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Input placeholder="Material name" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`substrate.${index}.percentage`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                          <span className="text-sm">%</span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            )
          )}
        </div>
        <FormDescription>The total percentage must equal 100%</FormDescription>
      </div>
      <FormField
        control={control}
        name="potSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pot Size</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-[120px]"
                />
                <span className="text-sm">{volumeUnit}</span>
              </div>
            </FormControl>
            <FormDescription>
              Default pot size used for each plant
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-4">
        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUploader
                  existingImages={
                    Array.isArray(field.value)
                      ? field.value.filter((img) => typeof img === "string")
                      : []
                  }
                  onImagesChange={(images: (string | File)[]) => {
                    field.onChange(images || []);
                  }}
                  onImageRemove={(index: number) => {
                    if (onImageRemove) {
                      onImageRemove(index);
                    } else {
                      const currentImages = Array.isArray(field.value)
                        ? field.value
                        : [];
                      const newImages = [...currentImages];
                      newImages.splice(index, 1);
                      field.onChange(newImages);
                    }
                  }}
                  maxImages={5}
                />
              </FormControl>
              <FormDescription>
                Upload an image of your indoor space (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
