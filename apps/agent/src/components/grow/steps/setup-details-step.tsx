import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import {
  Control,
  UseFieldArrayReturn,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import type { FormValues } from "../types";

interface SetupDetailsStepProps {
  control: Control<FormValues>;
  fieldArray: UseFieldArrayReturn<FormValues, "substrate">;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  watch: (name: string) => any;
  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
}

export function SetupDetailsStep({
  control,
  fieldArray: { append, remove },
  handleImageUpload,
  watch,
  setValue,
  getValues,
}: SetupDetailsStepProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-row gap-6">
        <FormField
          control={control}
          name="lampType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lamp Type</FormLabel>
              <FormControl>
                <Input placeholder="600W LED" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="ventilationSpeed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fan Speed</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="50"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-[120px]"
                  />
                  <span className="text-sm">%</span>
                </div>
              </FormControl>
              <FormDescription>Fan speed (0-100%)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lightIntensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Light Intensity</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="350"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-[120px]"
                  />
                  <span className="text-sm">mA</span>
                </div>
              </FormControl>
              <FormDescription>Light intensity (0-1000mA)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-4 mt-16">
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
                key={field.id}
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
                <span className="text-sm">L</span>
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
        <FormLabel>Images</FormLabel>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="size-[120px]"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Plus className="size-6" />
          </Button>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {watch("images")?.map((image: string, index: number) => (
              <div key={index} className="relative w-[120px] h-[120px]">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Grow image ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 hover:bg-destructive/10"
                  onClick={() => {
                    const currentImages = getValues("images") || [];
                    setValue(
                      "images",
                      currentImages.filter(
                        (_: string, i: number) => i !== index
                      )
                    );
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <FormDescription>Upload images of your grow setup</FormDescription>
      </div>
    </div>
  );
}
