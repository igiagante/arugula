"use client";

import { apiRequest, HttpMethods } from "@/app/(main)/api/client";
import { CacheTags } from "@/app/(main)/api/tags";
import { AddStrainForm } from "@/components/grow/steps/strains/form/add-strain-form";
import { StrainFormValues } from "@/components/grow/steps/strains/form/add-strain.schema";
import ImageUploader from "@/components/image-uploader/image-uploader";
import { useImageUploader } from "@/hooks/use-image-uploader";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import {
  growStages,
  GrowStages,
  MEASUREMENT_UNIT_SYMBOLS,
  MeasurementUnit,
} from "@/lib/constants";
import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Path, PathValue, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  allowedStages,
  convertImagesToPlantImages,
  PLANT_STAGES,
} from "../plant-utils";
import { PlantImage, Strain, StrainOption } from "../types";
import { PlantHeaderImage } from "./plant-header-image";
import { CreatePlantSchema, EditPlantSchema } from "./plant.schema";

interface PlantDialogProps<T extends CreatePlantSchema | EditPlantSchema> {
  form: UseFormReturn<T>;
  isSubmitting: boolean;
  onSubmit: (data: T) => void;
  onClose: () => void;
  isOpen: boolean;
  plant?: PlantWithStrain;
  growId?: string;
}

export function PlantDialog<T extends CreatePlantSchema | EditPlantSchema>({
  form,
  isSubmitting,
  onSubmit,
  onClose,
  isOpen,
  plant,
  growId,
}: PlantDialogProps<T>) {
  const isEditing = !!plant?.id;
  const [images, setImages] = useState<PlantImage[]>([]);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { preferences } = useUserPreferences();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && plant) {
        // Set each field individually
        form.reset({
          id: plant.id,
          customName: plant.customName,
          strainId: plant.strainId || "",
          stage: plant.stage || GrowStages.seedling,
          potSize: plant.potSize ? Number(plant.potSize) : 1,
          notes: plant.notes || "",
          images: convertImagesToPlantImages(plant.images || []),
        } as unknown as T);
        setImages(convertImagesToPlantImages(plant.images || []));
      } else {
        // Reset to default values for CreatePlantSchema
        form.reset({
          customName: "",
          strainId: "",
          stage: GrowStages.seedling,
          quantity: 1,
          potSize: 1,
          notes: "",
          images: [],
        } as unknown as T);
        setImages([]);
      }
    }
  }, [isOpen, form, isEditing, plant]);

  const { data: strains } = useQuery<Strain[]>({
    queryKey: [CacheTags.strains],
    queryFn: async () => {
      return await apiRequest("/api/strains");
    },
  });

  const strainOptions: StrainOption[] =
    strains?.map((strain) => ({
      value: strain.id,
      label: strain.name,
    })) || [];

  const handleAddNewStrain = async (data: StrainFormValues) => {
    try {
      const response = await apiRequest<Strain, StrainFormValues>(
        "/api/strains",
        {
          method: HttpMethods.POST,
          body: data,
        }
      );

      form.setValue(
        "strainId" as Path<T>,
        response.id as PathValue<T, Path<T>>
      );
      setIsAddStrainModalOpen(false);
      setOpen(false);
      // Invalidate and refetch strains
      await queryClient.invalidateQueries({ queryKey: [CacheTags.strains] });
    } catch (error) {
      console.error("Error creating strain:", error);
    }
  };

  const {
    isUploadingImages: customIsUploadingImages,
    trackDeletedImage,
    resetDeletedImages,
    processImages,
  } = useImageUploader();

  const handleImageRemove = async (index: number) => {
    const imageToRemove = form.getValues("images" as Path<T>)[index];
    if (typeof imageToRemove === "string") {
      trackDeletedImage(imageToRemove);
    }
    // Remove from form
    const currentImages = form.getValues("images" as Path<T>) as (
      | string
      | File
    )[];
    currentImages.splice(index, 1);
    form.setValue("images" as Path<T>, currentImages as PathValue<T, Path<T>>);
  };

  const handleSubmit = async (values: T) => {
    try {
      // Process all images (handle deletions and uploads)
      const processedImages = await processImages(values.images || []);

      // Update the values with processed images
      const updatedValues = {
        ...values,
        images: processedImages,
        // Include growId when creating a new plant (not editing)
        ...(growId && !isEditing ? { growId } : {}),
      };

      // Call the parent's onSubmit with updated values
      await onSubmit(updatedValues as unknown as T);

      // Reset tracking after successful submission
      resetDeletedImages();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save. Please try again.");
    }
  };

  const volumeUnit = preferences?.measurements?.volume;

  const [newStrainValue, setNewStrainValue] = useState("");
  const [isAddStrainModalOpen, setIsAddStrainModalOpen] = useState(false);
  const addStrainForm = useForm<StrainFormValues>();

  const coverImage = images.find((img) => img.isPrimary) || images[0];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="w-[calc(100vw-32px)] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden"
          aria-describedby="plant-form-description"
        >
          <DialogTitle className="sr-only">
            {isEditing ? "Edit Plant" : "Add New Plant"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Form to {isEditing ? "edit an existing" : "add a new"} plant to your
            grow
          </DialogDescription>
          <PlantHeaderImage
            imageUrl={coverImage?.url}
            title={isEditing ? "Edit Plant" : "Add New Plant"}
            onClose={onClose}
          />

          <div className="p-4 sm:p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {isEditing && (
                  <FormField
                    control={form.control}
                    name={"id" as Path<T>}
                    render={({ field }) => <input type="hidden" {...field} />}
                  />
                )}

                <FormField
                  control={form.control}
                  name={"customName" as Path<T>}
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

                {!isEditing && (
                  <div className="grid grid-cols-12 gap-6">
                    <FormField
                      control={form.control}
                      name={"strainId" as Path<T>}
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-12 md:col-span-4 mt-2.5">
                          <FormLabel>Strain*</FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? strainOptions.find(
                                        (strain: StrainOption) =>
                                          strain.value === field.value
                                      )?.label
                                    : "Select strain..."}
                                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search strain..."
                                  value={newStrainValue}
                                  onValueChange={setNewStrainValue}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    <div className="px-2 py-3">
                                      <p>No strain found.</p>
                                      {newStrainValue && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="mt-2 w-full gap-1"
                                          onClick={() =>
                                            setIsAddStrainModalOpen(true)
                                          }
                                        >
                                          <Plus className="size-3.5" />
                                          Add new strain
                                        </Button>
                                      )}
                                    </div>
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {strainOptions.map((strain) => (
                                      <CommandItem
                                        value={strain.value}
                                        key={strain.value}
                                        onSelect={() => {
                                          form.setValue(
                                            "strainId" as Path<T>,
                                            strain.value as PathValue<
                                              T,
                                              Path<T>
                                            >
                                          );
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 size-4",
                                            strain.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {strain.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={"stage" as Path<T>}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-4">
                          <FormLabel>Stage</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {growStages
                                .filter((stage) =>
                                  allowedStages.includes(
                                    stage.value as (typeof allowedStages)[number]
                                  )
                                )
                                .map((stage) => {
                                  const Icon = PLANT_STAGES[stage.value]?.icon;
                                  return (
                                    <SelectItem
                                      key={stage.value}
                                      value={stage.value}
                                    >
                                      <div className="flex items-center gap-2">
                                        {Icon && <Icon className="size-4" />}
                                        <span>{stage.label}</span>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={"potSize" as Path<T>}
                      render={({ field }) => (
                        <FormItem className="col-span-6 md:col-span-2">
                          <FormLabel>Pot Size</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={0.1}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <span className="flex items-center text-sm text-muted-foreground">
                              {volumeUnit
                                ? MEASUREMENT_UNIT_SYMBOLS[
                                    volumeUnit as MeasurementUnit
                                  ]
                                : "L"}
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={"quantity" as Path<T>}
                      render={({ field }) => (
                        <FormItem className="col-span-4 md:col-span-2">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name={"notes" as Path<T>}
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

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium">Plant Images</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload images of your plant. The primary image will be
                      displayed as the cover.
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name={"images" as Path<T>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <ImageUploader
                          existingImages={images.map((img) => img.url)}
                          onImagesChange={(newImages: (string | File)[]) => {
                            field.onChange(newImages);
                            setImages(
                              newImages.map((img, index) => ({
                                id: `temp-${index}`,
                                url:
                                  typeof img === "string"
                                    ? img
                                    : URL.createObjectURL(img),
                                isPrimary: false,
                              }))
                            );
                          }}
                          onImageRemove={handleImageRemove}
                          maxImages={5}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between p-4 border-t bg-background">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || customIsUploadingImages}
                  >
                    <Save className="mr-2 size-4" />
                    {customIsUploadingImages
                      ? "Uploading Images..."
                      : isSubmitting
                        ? "Saving..."
                        : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Strain modal */}
      <Dialog
        open={isAddStrainModalOpen}
        onOpenChange={setIsAddStrainModalOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Add New Strain</DialogTitle>
          <AddStrainForm
            form={addStrainForm}
            onSubmit={handleAddNewStrain}
            onCancel={() => setIsAddStrainModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
