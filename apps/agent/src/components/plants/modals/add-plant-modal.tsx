"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
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
import { Textarea } from "@workspace/ui/components/textarea";
import { Plus, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImageGallery } from "../plant-image-gallery";
import { ImageUploader } from "../plant-image-uploader";

import { ImageWithFallback } from "@/components/grow/image-with-fallback";
import { growStages } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { PLANT_STAGES } from "../plant-utils";

// Define the form schema
const addPlantFormSchema = z.object({
  customName: z
    .string()
    .min(2, { message: "Plant name must be at least 2 characters." }),
  strain: z.string().min(1, { message: "Please select or create a strain." }),
  stage: z.string().default("veg"), // Default to veg stage
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1." })
    .default(1),
  notes: z.string().optional(),
});

// Mock strains data
const mockStrains = [
  { value: "girl-scout-cookies", label: "Girl Scout Cookies" },
  { value: "northern-lights", label: "Northern Lights" },
  { value: "blue-dream", label: "Blue Dream" },
  { value: "og-kush", label: "OG Kush" },
  { value: "sour-diesel", label: "Sour Diesel" },
  { value: "white-widow", label: "White Widow" },
  { value: "purple-haze", label: "Purple Haze" },
  { value: "ak-47", label: "AK-47" },
  { value: "jack-herer", label: "Jack Herer" },
  { value: "durban-poison", label: "Durban Poison" },
];

interface PlantImage {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (plantData: any, images: PlantImage[]) => void;
  defaultStage?: string;
}

export function AddPlantModal({
  isOpen,
  onClose,
  onSave,
  defaultStage = "veg",
}: AddPlantModalProps) {
  const [images, setImages] = useState<PlantImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [strains, setStrains] = useState(mockStrains);
  const [open, setOpen] = useState(false);
  const [newStrainValue, setNewStrainValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // Initialize form with defaults
  const form = useForm<z.infer<typeof addPlantFormSchema>>({
    resolver: zodResolver(addPlantFormSchema),
    defaultValues: {
      customName: "",
      strain: "",
      stage: defaultStage,
      quantity: 1,
      notes: "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        customName: "",
        strain: "",
        stage: defaultStage,
        quantity: 1,
        notes: "",
      });
      setImages([]);
    }
  }, [isOpen, form, defaultStage]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof addPlantFormSchema>) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would save the plant data and upload images
      console.log("Form values:", values);
      console.log("Images:", images);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call onSave callback with form data and images
      if (onSave) {
        onSave(values, images);
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error saving plant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to create a new strain
  const createNewStrain = () => {
    if (!newStrainValue.trim()) return;

    const value = newStrainValue.toLowerCase().replace(/\s+/g, "-");
    const newStrain = { value, label: newStrainValue.trim() };

    setStrains((prev) => [...prev, newStrain]);
    form.setValue("strain", value);
    setNewStrainValue("");
    setOpen(false);
  };

  // Get cover image (primary image or first image)
  const coverImage = images.find((img) => img.isPrimary) || images[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        {/* Cover Image Area */}
        <div className="relative">
          <div className="relative h-40 sm:h-48 w-full bg-muted">
            <ImageWithFallback
              imageUrl={coverImage?.url || ""}
              alt="Plant cover image"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white">
              <h2 className="text-xl sm:text-2xl font-bold">Add New Plant</h2>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <div className="grid grid-cols-12 gap-4">
                <FormField
                  control={form.control}
                  name="strain"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-12 md:col-span-6 mt-2.5">
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
                                ? strains.find(
                                    (strain) => strain.value === field.value
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
                                      onClick={createNewStrain}
                                    >
                                      <Plus className="size-3.5" />
                                      Create &ldquo;{newStrainValue}&rdquo;
                                    </Button>
                                  )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {strains.map((strain) => (
                                  <CommandItem
                                    value={strain.label}
                                    key={strain.value}
                                    onSelect={() => {
                                      form.setValue("strain", strain.value);
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
                  name="stage"
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
                          {growStages.map((stage) => {
                            const Icon = PLANT_STAGES[stage.value]?.icon;
                            return (
                              <SelectItem key={stage.value} value={stage.value}>
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
                  name="quantity"
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

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium">Plant Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload images of your plant. The primary image will be
                    displayed as the cover.
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
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Click on an image to set it as primary. The primary image
                      will be displayed as the cover.
                    </p>
                    <ImageGallery images={images} setImages={setImages} />
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 size-4" />
                  {isSubmitting ? "Saving..." : "Add Plant"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
