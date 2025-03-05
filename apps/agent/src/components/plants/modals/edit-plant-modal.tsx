"use client";

import { growingMethods, GrowStages } from "@/lib/constants";
import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Leaf,
  Save,
  Scale,
  Sprout,
  Sun,
  Thermometer,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImageGallery } from "../plant-image-gallery";
import { ImageUploader } from "../plant-image-uploader";
import { getStageBadgeColor, getStageIcon } from "../plant-utils";

// Define the form schema
const plantFormSchema = z.object({
  customName: z.string().min(2, {
    message: "Plant name must be at least 2 characters.",
  }),
  stage: z.string({
    required_error: "Please select a growth stage.",
  }),
  growingMethod: z.string({
    required_error: "Please select a growing method.",
  }),
  strain: z.string().optional(),
  potSize: z.string().optional(),
  notes: z.string().optional(),
});

interface PlantImage {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

interface PlantEditModalProps {
  plant?: PlantWithStrain;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (plant: PlantWithStrain, images: PlantImage[]) => void;
}

const convertStrainImagesToPlantImages = (
  plant?: PlantWithStrain
): PlantImage[] => {
  return (
    plant?.strain?.images?.map((url, index) => ({
      id: `image-${index}`,
      url,
      isPrimary: index === 0,
      createdAt: plant.createdAt.toString(),
    })) || []
  );
};

export function PlantEditModal({
  plant,
  isOpen,
  onClose,
  onSave,
}: PlantEditModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [images, setImages] = useState<PlantImage[]>(
    convertStrainImagesToPlantImages(plant)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewStage, setPreviewStage] = useState<GrowStages>(
    (plant?.stage as GrowStages) || GrowStages.seedling
  );
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const isEditing = !!plant?.id;

  // Initialize the form with existing plant data if editing
  const form = useForm<z.infer<typeof plantFormSchema>>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      customName: plant?.customName || "",
      stage: plant?.stage || "",
      strain: plant?.strain?.name || "",
      potSize: plant?.potSize || "",
      notes: plant?.notes || "",
    },
  });

  // Reset form when plant changes
  useEffect(() => {
    if (plant) {
      form.reset({
        customName: plant.customName || "",
        stage: plant.stage || "",
        strain: plant.strain?.name || "",
        potSize: plant.potSize || "",
        notes: plant.notes || "",
      });
      setImages(convertStrainImagesToPlantImages(plant));
      setPreviewStage(plant.stage as GrowStages);
    }
  }, [plant, form]);

  // Update preview stage when form stage changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "stage" && value.stage) {
        setPreviewStage(value.stage as GrowStages);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof plantFormSchema>) => {
    setIsSubmitting(true);

    try {
      // Create updated plant object
      const updatedPlant: PlantWithStrain = {
        ...plant,
        ...values,
        id: plant?.id || `new-${Date.now()}`,
        createdAt: plant?.createdAt || new Date(),
        growId: plant?.growId || "",
        strainId: plant?.strainId || "",
        updatedAt: new Date(),
        archived: plant?.archived || false,
        potSize: values.potSize || null,
        notes: values.notes || null,
        strain: {
          id: plant?.strain?.id || "",
          name: values.strain || "",
          type: plant?.strain?.type || "",
          cannabinoidProfile: plant?.strain?.cannabinoidProfile || null,
          description: plant?.strain?.description || null,
          ratio: plant?.strain?.ratio || null,
          images: plant?.strain?.images || null,
        },
      };

      // In a real app, you would upload the images and save the plant data
      console.log("Form values:", values);
      console.log("Images:", images);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call onSave callback if provided
      if (onSave) {
        onSave(updatedPlant, images);
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error saving plant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert strain images to PlantImage format
  const allImages = convertStrainImagesToPlantImages(plant);
  const primaryImage =
    allImages.find((img) => img.isPrimary)?.url || allImages[0]?.url;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        {/* Enhanced Header */}
        <div className="relative">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 p-4">
            {isEditing ? `Edit ${plant?.customName}` : "Add New Plant"}
          </h2>

          {/* Preview Card */}
          <div className="bg-background rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`rounded-full p-2 ${getStageBadgeColor(previewStage)}`}
              >
                {getStageIcon(previewStage)}
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {form.watch("customName") || "New Plant"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStageBadgeColor(previewStage)}>
                    {previewStage}
                  </Badge>
                  {form.watch("strain") && (
                    <span className="text-sm text-muted-foreground">
                      {form.watch("strain")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {allImages.length > 0 && (
          <div className="relative h-40 sm:h-48 w-full">
            <Image
              src={primaryImage || "/placeholder.svg"}
              alt={plant?.customName || ""}
              fill
              className="object-cover brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white">
              <h2 className="text-xl sm:text-2xl font-bold">
                {plant?.customName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge
                  className={`${getStageBadgeColor(plant?.stage || "")} border border-white/20`}
                >
                  {plant?.stage || "Unknown"}
                </Badge>
                {plant?.strain?.name && (
                  <span className="text-xs sm:text-sm opacity-90">
                    {plant?.strain.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs sm:text-sm opacity-90">
                  Updated{" "}
                  {formatDistanceToNow(
                    new Date(plant?.updatedAt || new Date()),
                    { addSuffix: true }
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 sm:p-6">
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Plant Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="customName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plant Name*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Girl Scout Cookies #1"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A unique name to identify your plant
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Growth Stage*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a growth stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={GrowStages.seedling}>
                                <div className="flex items-center gap-2">
                                  <Sprout className="size-4" />
                                  <span>Seedling</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={GrowStages.vegetative}>
                                <div className="flex items-center gap-2">
                                  <Leaf className="size-4" />
                                  <span>Vegetative</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={GrowStages.growing}>
                                <div className="flex items-center gap-2">
                                  <Sun className="size-4" />
                                  <span>Growing</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={GrowStages.harvested}>
                                <div className="flex items-center gap-2">
                                  <Scale className="size-4" />
                                  <span>Harvested</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={GrowStages.curing}>
                                <div className="flex items-center gap-2">
                                  <Thermometer className="size-4" />
                                  <span>Curing</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={GrowStages.archived}>
                                <div className="flex items-center gap-2">
                                  <Calendar className="size-4" />
                                  <span>Archived</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The current growth stage of your plant
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="growingMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Growing Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {growingMethods.map((method) => (
                                <SelectItem
                                  key={method.value}
                                  value={method.value}
                                >
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional notes about your plant..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="images" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium">Plant Images</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload images of your plant. The primary image will be
                        displayed on the plant card.
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <ImageUploader
                        images={images}
                        setImages={setImages}
                        fileInputRef={fileInputRef}
                      />
                    </div>

                    {images.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium">Image Gallery</h4>
                          <Badge variant="outline" className="text-xs">
                            {images.length}{" "}
                            {images.length === 1 ? "image" : "images"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                          Click on an image to set it as primary. The primary
                          image will be displayed on the plant card.
                        </p>
                        <ImageGallery images={images} setImages={setImages} />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
        <DialogFooter className="p-4 sm:px-6 border-t">
          <div className="flex justify-between w-full">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Save className="mr-2 size-4" />
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Plant"
                  : "Save Plant"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
