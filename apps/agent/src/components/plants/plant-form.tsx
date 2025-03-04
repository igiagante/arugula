"use client";

import { ImageGallery } from "@/components/plants/plant-image-gallery";
import { ImageUploader } from "@/components/plants/plant-image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
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
import {
  ArrowLeft,
  Calendar,
  Leaf,
  Ruler,
  Save,
  Scale,
  Sprout,
  Sun,
  Thermometer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the form schema
const plantFormSchema = z.object({
  customName: z.string().min(2, {
    message: "Plant name must be at least 2 characters.",
  }),
  stage: z.string({
    required_error: "Please select a growth stage.",
  }),
  strain: z.string().optional(),
  potSize: z.string().optional(),
  medium: z.string().optional(),
  notes: z.string().optional(),
});

// Define the plant type
interface Plant {
  id?: string;
  customName: string;
  stage: string;
  strain?: string;
  potSize?: string;
  medium?: string;
  notes?: string;
  imageUrl?: string;
  images?: PlantImage[];
  createdAt?: string;
}

interface PlantImage {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

interface PlantFormProps {
  plant?: Plant;
  isEditing?: boolean;
}

export function PlantForm({ plant, isEditing = false }: PlantFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [images, setImages] = useState<PlantImage[]>(plant?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewStage, setPreviewStage] = useState(plant?.stage || "seedling");
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // Initialize the form with existing plant data if editing
  const form = useForm<z.infer<typeof plantFormSchema>>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      customName: plant?.customName || "",
      stage: plant?.stage || "",
      strain: plant?.strain || "",
      potSize: plant?.potSize || "",
      medium: plant?.medium || "",
      notes: plant?.notes || "",
    },
  });

  // Update preview stage when form stage changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "stage" && value.stage) {
        setPreviewStage(value.stage as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof plantFormSchema>) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would upload the images and save the plant data
      console.log("Form values:", values);
      console.log("Images:", images);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect back to plants list
      router.push("/plants");
    } catch (error) {
      console.error("Error saving plant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle going back
  const handleBack = () => {
    router.back();
  };

  const getStageBadgeColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "seedling":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "veg":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80";
      case "flowering":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "harvested":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80";
      case "curing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "seedling":
        return <Sprout className="size-5" />;
      case "veg":
        return <Leaf className="size-5" />;
      case "flowering":
        return <Sun className="size-5" />;
      case "harvested":
        return <Scale className="size-5" />;
      case "curing":
        return <Thermometer className="size-5" />;
      case "archived":
        return <Calendar className="size-5" />;
      default:
        return <Leaf className="size-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="size-8"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? `Edit ${plant?.customName}` : "Add New Plant"}
        </h1>
      </div>

      {/* Preview Card */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`rounded-full p-2 ${getStageBadgeColor(previewStage)}`}
          >
            {getStageIcon(previewStage)}
          </div>
          <div>
            <h2 className="font-medium text-lg">
              {form.watch("customName") || "New Plant"}
            </h2>
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

        <div className="flex flex-wrap gap-3 text-sm">
          {form.watch("potSize") && (
            <div className="flex items-center gap-1.5">
              <Ruler className="size-4 text-muted-foreground" />
              <span>Pot: {form.watch("potSize")}</span>
            </div>
          )}
          {form.watch("medium") && (
            <div className="flex items-center gap-1.5">
              <Leaf className="size-4 text-muted-foreground" />
              <span>Medium: {form.watch("medium")}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-muted-foreground" />
            <span>Added: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <SelectItem value="seedling">
                            <div className="flex items-center gap-2">
                              <Sprout className="size-4" />
                              <span>Seedling</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="veg">
                            <div className="flex items-center gap-2">
                              <Leaf className="size-4" />
                              <span>Vegetative</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="flowering">
                            <div className="flex items-center gap-2">
                              <Sun className="size-4" />
                              <span>Flowering</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="harvested">
                            <div className="flex items-center gap-2">
                              <Scale className="size-4" />
                              <span>Harvested</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="curing">
                            <div className="flex items-center gap-2">
                              <Thermometer className="size-4" />
                              <span>Curing</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="archived">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="strain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strain</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Northern Lights" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="potSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pot Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5L" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Growing Medium</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Coco coir" {...field} />
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

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <ImageUploader
                      images={[]}
                      setImages={() => {}}
                      fileInputRef={fileInputRef}
                    />
                  </CardContent>
                </Card>

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
                      Click on an image to set it as primary. The primary image
                      will be displayed on the plant card.
                    </p>
                    <ImageGallery images={images} setImages={setImages} />
                  </div>
                )}
              </div>
            </TabsContent>

            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 size-4" />
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Plant"
                    : "Save Plant"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
