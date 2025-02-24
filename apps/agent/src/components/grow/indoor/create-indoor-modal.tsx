"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Slider } from "@workspace/ui/components/slider";
import { CreateIndoorFormValues, createIndoorSchema } from "../schema";
import { useAuth } from "@clerk/nextjs";
import { Indoor } from "@/lib/db/schema";
import { CreateIndoorDto } from "@/app/actions/indoors";

const dimensionUnits = [
  { label: "Ft", value: "ft" },
  { label: "Cm", value: "cm" },
] as const;

interface CreateIndoorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createIndoor: (data: CreateIndoorDto) => Promise<Indoor>;
  onSuccess: () => Promise<void>;
}

export function CreateIndoorModal({
  open,
  onOpenChange,
  createIndoor,
  onSuccess,
}: CreateIndoorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();

  const form = useForm<CreateIndoorFormValues>({
    resolver: zodResolver(createIndoorSchema),
    defaultValues: {
      unit: "ft",
      width: 4,
      length: 4,
      height: 6,
      lampFanSpeed: 50,
      lightIntensity: 500,
    },
  });

  const createIndoorPayload = (
    formData: z.infer<typeof createIndoorSchema>,
    userId: string
  ) => {
    // 1. Dimensions JSON
    const dimensions = {
      width: formData.width,
      length: formData.length,
      height: formData.height,
      unit: formData.unit,
    };

    // 2. Lighting JSON
    const lighting = {
      lampType: formData.lampType,
      ...(formData.lightIntensity !== undefined && {
        lightIntensity: formData.lightIntensity,
      }),
      ...(formData.lampFanSpeed !== undefined && {
        lampFanSpeed: formData.lampFanSpeed,
      }),
    };

    // 3. Images array (optional)
    const images =
      formData.images && formData.images.length > 0 ? formData.images : null;

    // 4. Notes
    const notes = formData.notes || null;

    // 5. Insert into DB
    const newIndoor = {
      name: formData.name,
      dimensions,
      lighting,
      images,
      notes,
      createdBy: userId,
      temperature: null,
      humidity: null,
      co2: null,
    };

    return newIndoor;
  };

  async function handleSubmit(data: CreateIndoorFormValues) {
    try {
      setIsSubmitting(true);

      if (!userId) {
        throw new Error("User not found");
      }

      const newIndoor = createIndoorPayload(data, userId);
      await createIndoor(newIndoor);

      form.reset();
      onOpenChange(false);
      await onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      form.setValue("images", [...(form.getValues("images") || []), imageUrl]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Indoor</DialogTitle>
          <DialogDescription>
            Add a new indoor growing space to your collection.
          </DialogDescription>
        </DialogHeader>
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
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dimensionUnits.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width</FormLabel>
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
                          <span className="text-sm">{form.watch("unit")}</span>
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
                      <FormLabel>Length</FormLabel>
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
                          <span className="text-sm">{form.watch("unit")}</span>
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
                      <FormLabel>Height</FormLabel>
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
                          <span className="text-sm">{form.watch("unit")}</span>
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
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {field.value ? (
                          <div className="relative aspect-video w-full max-w-[240px] overflow-hidden rounded-lg border">
                            <Image
                              src={field.value[0] || "/placeholder.svg"}
                              alt="Indoor preview"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 size-6"
                              onClick={() => form.setValue("images", [])}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="aspect-video w-full max-w-[240px]"
                            onClick={() =>
                              document.getElementById("indoor-image")?.click()
                            }
                          >
                            <ImageIcon className="mr-2 size-5" />
                            Upload Image
                          </Button>
                        )}
                        <input
                          id="indoor-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
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
      </DialogContent>
    </Dialog>
  );
}
