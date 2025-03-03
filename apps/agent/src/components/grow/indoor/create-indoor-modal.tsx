"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Loader2, Ruler } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { apiRequest, HttpMethods } from "@/app/api/client";
import type { CreateIndoorDto } from "@/app/api/dto";
import { CacheTags } from "@/app/api/tags";
import { uploadImages } from "@/app/utils/s3/s3-upload";
import ImageUploader from "@/components/image/image-uploader";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import type { Indoor } from "@/lib/db/schema";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
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
import { type CreateIndoorFormValues, createIndoorSchema } from "../schema";

interface CreateIndoorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (id: string) => void;
}

export function CreateIndoorModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateIndoorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { preferences } = useUserPreferences();
  const distanceUnit = preferences.measurements.distance;

  const { mutateAsync: createIndoor } = useMutation({
    mutationFn: async (newIndoor: CreateIndoorDto) => {
      return await apiRequest<Indoor, CreateIndoorDto>("/api/indoors", {
        method: HttpMethods.POST,
        body: newIndoor,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the indoors list
      queryClient.invalidateQueries({ queryKey: [CacheTags.indoors] });
    },
  });

  const form = useForm<CreateIndoorFormValues>({
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

  const createIndoorPayload = (
    formData: z.infer<typeof createIndoorSchema>,
    userId: string,
    uploadedImageUrls?: string[]
  ) => {
    const images =
      uploadedImageUrls && uploadedImageUrls.length > 0
        ? uploadedImageUrls
        : null;

    const notes = formData.notes || null;

    const newIndoor: CreateIndoorDto = {
      name: formData.name,
      length: formData.length.toString(),
      width: formData.width.toString(),
      height: formData.height.toString(),
      dimensionUnit: formData.unit,
      images,
      notes,
      createdBy: userId,
      temperature: null,
      humidity: null,
      co2: null,
      lamp: {
        lampType: formData.lampType || "unknown",
        lightIntensity: formData.lightIntensity?.toString() || "",
        fanSpeed: formData.lampFanSpeed?.toString() || "",
        current: formData.lightIntensity?.toString() || "",
        voltage: null,
        power: null,
      },
    };

    return newIndoor;
  };

  async function handleSubmit(data: CreateIndoorFormValues) {
    try {
      setIsSubmitting(true);

      if (!userId) {
        throw new Error("User not found");
      }

      // Upload images first if there are any
      let uploadedImageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        uploadedImageUrls = await uploadImages(data.images);
      }

      // Create indoor with uploaded image URLs
      const newIndoor = createIndoorPayload(data, userId, uploadedImageUrls);
      const indoorCreated = await createIndoor(newIndoor);

      form.reset();
      onOpenChange(false);
      await onSuccess(indoorCreated.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Create New Indoor</DialogTitle>
          <DialogDescription>
            Add a new indoor growing space to your collection.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
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
                        <FormDescription>
                          Light intensity (0-1000mA)
                        </FormDescription>
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
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
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
                        existingImages={
                          Array.isArray(field.value)
                            ? field.value.filter(
                                (img) => typeof img === "string"
                              )
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Create Indoor
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
