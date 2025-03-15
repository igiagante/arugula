"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Loader2, Ruler } from "lucide-react";
import { useForm } from "react-hook-form";

import { apiRequest, HttpMethods } from "@/app/api/client";
import type { CreateIndoorDto } from "@/app/api/dto";
import { CacheTags, createDynamicTag } from "@/app/api/tags";
import ImageUploader from "@/components/image-uploader/image-uploader";
import { useImageUploader } from "@/hooks/use-image-uploader";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { Indoor } from "@/lib/db/schemas/indoor.schema";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
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
import { Slider } from "@workspace/ui/components/slider";
import { Textarea } from "@workspace/ui/components/textarea";
import { toast } from "sonner";
import { type CreateIndoorSchema, createIndoorSchema } from "./schema";

interface IndoorFormProps {
  indoor?: Indoor;
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
}

const createIndoorPayload = (
  formData: CreateIndoorSchema,
  userId: string | null | undefined,
  organizationId: string,
  uploadedImageUrls?: string[]
): CreateIndoorDto => {
  // Convert numeric values to strings and handle optional fields
  const stringifyValue = (value: number | undefined | null): string | null =>
    value !== undefined && value !== null ? value.toString() : null;

  return {
    name: formData.name,
    length: stringifyValue(formData.length) ?? "0",
    width: stringifyValue(formData.width) ?? "0",
    height: stringifyValue(formData.height) ?? "0",
    dimensionUnit: formData.unit,
    images: uploadedImageUrls?.length ? uploadedImageUrls : null,
    notes: formData.notes || null,
    createdBy: userId || "anonymous",
    organizationId,
    temperature: null,
    humidity: null,
    co2: null,
    lamp: {
      lampType: formData.lampType || "unknown",
      lightIntensity: stringifyValue(formData.lightIntensity),
      fanSpeed: stringifyValue(formData.lampFanSpeed),
      current: stringifyValue(formData.lightIntensity), // Using same value as lightIntensity
      voltage: null,
      power: null,
    },
  };
};

export function IndoorForm({ indoor, onCancel, onSuccess }: IndoorFormProps) {
  const isEditing = !!indoor;
  const { userId } = useAuth();
  const { preferences } = useUserPreferences();
  const distanceUnit = preferences.measurements.distance;
  const queryClient = useQueryClient();
  //const { organization } = useOrganization();

  const organizationId = "516e3958-1842-4219-bf07-2a515b86df04";

  const { trackDeletedImage, processImages } = useImageUploader();

  const form = useForm<CreateIndoorSchema>({
    resolver: zodResolver(createIndoorSchema),
    defaultValues: {
      name: "",
      width: 50,
      length: 50,
      height: 70,
      lampType: "",
      lampFanSpeed: 50,
      lightIntensity: 500,
      notes: "",
      images: [],
      unit: distanceUnit,
    },
  });

  // Combined mutation for create/update
  const { mutateAsync: submitIndoor } = useMutation({
    mutationFn: async (data: CreateIndoorDto) => {
      const endpoint = isEditing
        ? `/api/indoors/${indoor?.id}`
        : "/api/indoors";
      const method = isEditing ? HttpMethods.PATCH : HttpMethods.POST;
      return await apiRequest<Indoor, CreateIndoorDto>(endpoint, {
        method,
        body: data,
      });
    },
    onSuccess: (response) => {
      // Invalidate both the general indoors list and the user-specific indoors list
      queryClient.invalidateQueries({
        queryKey: [CacheTags.indoors],
      });

      if (userId) {
        queryClient.invalidateQueries({
          queryKey: [createDynamicTag(CacheTags.indoorsByUserId, userId)],
        });
      }

      // Also invalidate the organization-specific indoors list
      queryClient.invalidateQueries({
        queryKey: [
          createDynamicTag(CacheTags.indoorsByOrganizationId, organizationId),
        ],
      });

      toast.success(
        isEditing
          ? `"${form.getValues("name")}" updated successfully`
          : `"${form.getValues("name")}" created successfully`
      );
      if (onSuccess) onSuccess(response?.id || indoor?.id || "");
    },
    onError: (error) => {
      console.error("Error submitting indoor:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "create"} "${form.getValues("name")}". Please try again.`
      );
    },
  });

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const imageToRemove = currentImages[index];

    if (typeof imageToRemove === "string") {
      trackDeletedImage(imageToRemove);
    }

    // Update the form state by removing the image at the specified index
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    form.setValue("images", updatedImages);
  };

  const { isSubmitting } = form.formState;

  async function onSubmit(data: CreateIndoorSchema) {
    try {
      if (!isEditing && !userId) {
        toast.error("User authentication required");
        return;
      }

      // Process all images (handle deletions and uploads)
      const processedImages = await processImages(data.images || []);

      // Create indoor with uploaded image URLs
      const newIndoor = createIndoorPayload(
        data,
        userId,
        organizationId,
        processedImages
      );
      await submitIndoor(newIndoor);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="4x4 Tent in Garage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-[120px_1fr_1fr_1fr]">
            <div className="flex items-center justify-center mt-2">
              <Box
                className="size-12 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Ruler className="size-4" /> Width
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="text-sm">{distanceUnit}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Ruler className="size-4" /> Length
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="text-sm">{distanceUnit}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Ruler className="size-4" /> Height
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="text-sm">{distanceUnit}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="lampType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lamp Type</FormLabel>
                <FormControl>
                  <Input placeholder="600W LED" {...field} />
                </FormControl>
                <FormDescription>
                  Specify the type and wattage of your grow light
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="lightIntensity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Light Intensity</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={1000}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="w-[100px]"
                        />
                        <span className="text-sm">mA</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Light intensity (0-1000mA)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lampFanSpeed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lamp Fan Speed</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="w-[100px]"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Fan speed percentage (0-100%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUploader
                  onImageRemove={handleRemoveImage}
                  existingImages={
                    Array.isArray(field.value)
                      ? field.value.filter((img) => typeof img === "string")
                      : []
                  }
                  onImagesChange={(images: (string | File)[]) => {
                    field.onChange(images || []);
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

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional details about this space..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional notes about ventilation, power access, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditing ? "Update Indoor" : "Create Indoor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
