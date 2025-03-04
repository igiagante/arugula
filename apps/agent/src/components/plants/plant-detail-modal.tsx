"use client";

import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Progress } from "@workspace/ui/components/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Calendar,
  Clock,
  Droplets,
  Edit,
  Leaf,
  Ruler,
  Scale,
  Sprout,
  Star,
  Sun,
  Thermometer,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlantTimeline } from "./plant-timeline";

interface PlantImage {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

interface PlantDetailModalProps {
  plant: PlantWithStrain;
  isOpen: boolean;
  onClose: () => void;
}

export function PlantDetailModal({
  plant,
  isOpen,
  onClose,
}: PlantDetailModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedImage, setSelectedImage] = useState<PlantImage | null>(null);

  // Convert strain images to PlantImage format
  const allImages =
    plant.strain?.images?.map((url, index) => ({
      id: `image-${index}`,
      url,
      isPrimary: index === 0,
      createdAt: plant.createdAt.toString(),
    })) || [];

  const primaryImage =
    allImages.find((img) => img.isPrimary)?.url || allImages[0]?.url;

  const getStageBadgeColor = (stage: string | null) => {
    console.log("stage", stage);
    if (!stage) return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";

    switch (stage.toLowerCase()) {
      case "seedling":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "vegetative":
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

  const getStageIcon = (stage: string | null) => {
    if (!stage) return <Leaf className="size-4" />;

    switch (stage.toLowerCase()) {
      case "seedling":
        return <Sprout className="size-4" />;
      case "veg":
        return <Leaf className="size-4" />;
      case "flowering":
        return <Sun className="size-4" />;
      case "harvested":
        return <Scale className="size-4" />;
      case "curing":
        return <Thermometer className="size-4" />;
      case "archived":
        return <Calendar className="size-4" />;
      default:
        return <Leaf className="size-4" />;
    }
  };

  const handleEditPlant = () => {
    router.push(`/plants/${plant.id}/edit`);
    onClose();
  };

  // Mock data for timeline
  const timelineItems = [
    {
      id: "1",
      type: "note",
      title: "Added to grow",
      date: "2023-05-10T09:00:00Z",
      content: "Plant added to the current grow cycle",
    },
    {
      id: "2",
      type: "feeding",
      title: "Nutrient feeding",
      date: "2023-05-15T14:30:00Z",
      content: "Fed with base nutrients",
      data: {
        ph: 6.5,
        ec: 1.2,
        nutrients: "General Hydroponics Flora Series",
      },
    },
    {
      id: "3",
      type: "transplant",
      title: "Transplanted",
      date: "2023-05-20T11:15:00Z",
      content: "Transplanted from 1L to 5L pot",
      data: {
        fromSize: "1L",
        toSize: "5L",
        medium: "Coco coir + perlite",
      },
    },
    {
      id: "4",
      type: "stageChange",
      title: "Changed stage",
      date: "2023-05-25T10:00:00Z",
      content: "Moved from seedling to vegetative stage",
      data: {
        fromStage: "seedling",
        toStage: "veg",
      },
    },
    {
      id: "5",
      type: "pruning",
      title: "Pruning",
      date: "2023-06-01T16:45:00Z",
      content: "Topped main stem and removed lower growth",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
          {/* Enhanced Header */}
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="size-8 rounded-full bg-background/60 hover:bg-background/80"
              >
                <X className="size-4" />
              </Button>
            </div>

            {allImages.length > 0 && (
              <div className="relative h-40 sm:h-48 w-full">
                <Image
                  src={primaryImage || "/placeholder.svg"}
                  alt={plant.customName}
                  fill
                  className="object-cover brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {plant.customName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge
                      className={`${getStageBadgeColor(plant.stage)} border border-white/20`}
                    >
                      {plant.stage || "Unknown"}
                    </Badge>
                    {plant.strain?.name && (
                      <span className="text-xs sm:text-sm opacity-90">
                        {plant.strain.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6">
            {/* Plant Quick Stats */}
            <div className="flex flex-wrap gap-4 mb-6 mt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm">
                  Added: {new Date(plant.createdAt).toLocaleDateString()}
                </span>
              </div>
              {plant.potSize && (
                <div className="flex items-center gap-1.5">
                  <Ruler className="size-4 text-muted-foreground" />
                  <span className="text-sm">Pot: {plant.potSize}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm">Age: 45 days</span>
              </div>
            </div>

            {/* Image Grid */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {allImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative aspect-square rounded-md overflow-hidden cursor-pointer group ${
                      image.isPrimary ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`${plant.customName} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-7 rounded-full"
                        >
                          <ZoomIn className="size-4" />
                        </Button>
                      </div>
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className="bg-background/80"
                          >
                            <Star className="size-3 mr-1 fill-primary" />
                            Primary
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Tabs
              defaultValue="timeline"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="pt-4">
                <PlantTimeline items={timelineItems} />
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <div className="space-y-6">
                  {/* Current Stage */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStageIcon(plant.stage)}
                        <h3 className="font-medium">
                          Current Stage:{" "}
                          <span className="text-primary">
                            {plant.stage || "Unknown"}
                          </span>
                        </h3>
                      </div>
                      <Badge className={getStageBadgeColor(plant.stage)}>
                        15 days
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {plant.stage === "veg"
                          ? "Plant is developing strong stems and foliage. Estimated 10 more days until flowering."
                          : plant.stage === "flowering"
                            ? "Flowers are developing well. Watch for nutrient needs and maintain proper lighting."
                            : "Current stage is progressing as expected."}
                      </p>
                    </div>
                  </div>

                  {/* Plant Vitals */}
                  <div>
                    <h3 className="font-medium text-sm mb-3">Plant Vitals</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Ruler className="size-4 text-emerald-600" />
                          <span className="text-xs font-medium">Height</span>
                        </div>
                        <span className="text-lg font-semibold">24 cm</span>
                        <span className="text-xs text-muted-foreground">
                          +2cm last week
                        </span>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Droplets className="size-4 text-blue-600" />
                          <span className="text-xs font-medium">
                            Last Watered
                          </span>
                        </div>
                        <span className="text-lg font-semibold">
                          2 days ago
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Next: Tomorrow
                        </span>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Thermometer className="size-4 text-red-600" />
                          <span className="text-xs font-medium">
                            Environment
                          </span>
                        </div>
                        <span className="text-lg font-semibold">
                          24°C / 55%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Temp / Humidity
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plant Details */}
                  <div>
                    <h3 className="font-medium text-sm mb-3">
                      Plant Information
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <p className="font-medium">{plant.customName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Strain:</span>
                          <p className="font-medium">
                            {plant.strain?.name || "—"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Pot Size:
                          </span>
                          <p className="font-medium">{plant.potSize || "—"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Added:</span>
                          <p className="font-medium">
                            {new Date(plant.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Total Age:
                          </span>
                          <p className="font-medium">45 days</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Grow Medium:
                          </span>
                          <p className="font-medium">Coco coir + perlite</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="font-medium text-sm mb-2">Notes</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">
                        This plant has been showing excellent growth in the
                        vegetative stage. The leaves are a vibrant green color
                        and the structure is developing well. Planning to switch
                        to flowering stage in about 1 week.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="p-4 sm:px-6 border-t">
            <Button variant="outline" onClick={handleEditPlant}>
              <Edit className="size-4 mr-2" />
              Edit Plant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-7xl p-0 overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="relative h-[90vh]">
              <Image
                src={selectedImage.url || "/placeholder.svg"}
                alt={plant.customName}
                fill
                className="object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-background/60 hover:bg-background/80"
                onClick={() => setSelectedImage(null)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
