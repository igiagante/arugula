import { Button } from "@workspace/ui/components/button";

import ImageUploader from "@/components/image-uploader/image-uploader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FloweringType, StrainType } from "../types";
import { StrainFormValues } from "./add-strain.schema";

interface AddStrainFormProps {
  onSubmit: (data: StrainFormValues) => void;
  form: UseFormReturn<StrainFormValues>;
  onCancel: () => void;
}

export function AddStrainForm({
  form,
  onCancel,
  onSubmit,
}: AddStrainFormProps) {
  return (
    <div className="mb-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-8 border-b pb-2">
        Add New Strain
      </h2>

      <Form {...form}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Strain name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Strain Name*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. White Widow"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breeder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Breeder
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Sensi Seeds"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="genotype"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-700">
                  Genotype
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. OG Kush x Durban Poison"
                    className="px-2 py-1.5 text-sm"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <FormField
              control={form.control}
              name="cannabinoidProfile.thc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    THC %
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 20%"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cannabinoidProfile.cbd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    CBD %
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 0.1%"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ratio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Ratio
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Indica 70%"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <FormField
                control={form.control}
                name="sativaPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sativa %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          // Optionally auto-calculate indica
                          form.setValue(
                            "indicaPercentage",
                            100 - Number(e.target.value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="indicaPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indica %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          // Optionally auto-calculate sativa
                          form.setValue(
                            "sativaPercentage",
                            100 - Number(e.target.value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="indoorHeight"
              rules={{ required: "Height is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Height*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 100-150cm"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indoorYield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Yield
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 450-550g/m²"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terpeneProfile"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Terpene Profile
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Myrcene, Limonene, Pinene"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indoorFlowerTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Flowering Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g. 9-10 weeks"
                      className="px-2 py-1.5 text-sm"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormDescription className="text-xs text-gray-500">
                    Format: &quot;8-9 weeks&quot; or &quot;10 weeks&quot;
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floweringType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Flowering Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="px-2 py-1.5 text-sm">
                        <SelectValue placeholder="Select flowering type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(FloweringType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-700">
                    Strain Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="px-2 py-1.5 text-sm">
                        <SelectValue placeholder="Select strain type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(StrainType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload Section */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    existingImages={
                      Array.isArray(field.value)
                        ? field.value.filter((img) => typeof img === "string")
                        : []
                    }
                    onImagesChange={(images: (string | File)[]) => {
                      field.onChange((images || []) as File[]);
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

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="min-w-[100px] flex items-center justify-center"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Add Strain
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
