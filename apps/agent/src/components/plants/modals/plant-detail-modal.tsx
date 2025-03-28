import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Calendar, Clock, Edit, Ruler, Star, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlantDetails } from "../plant-details";
import { PlantTimeline } from "../plant-timeline";
import { getStageBadgeColor } from "../plant-utils";
import { PlantImage } from "../types";
import { PlantHeaderImage } from "./plant-header-image";

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

interface PlantDetailModalProps {
  plant: PlantWithStrain;
  isOpen: boolean;
  onClose: () => void;
}

interface LocalImage {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
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
  const images = plant.strain?.images?.length
    ? plant.strain.images.map((url, index) => ({
        id: `image-${index}`,
        url,
        isPrimary: index === 0,
        createdAt: plant.createdAt.toString(),
      }))
    : plant.images?.map((url: string, index: number) => ({
        id: `note-image-${index}`,
        url,
        isPrimary: index === 0,
        createdAt: plant.createdAt?.toString() || plant.createdAt.toString(),
      })) || [];

  const primaryImage =
    images.find((img) => img.isPrimary)?.url || images[0]?.url;

  const handleEditPlant = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    router.push(`/plants/${plant.id}/edit`);
  };

  // Use it when selecting an image
  const handleSelectImage = (image: LocalImage) => {
    setSelectedImage({
      id: image.id,
      url: image.url,
      isPrimary: image.isPrimary,
      createdAt: new Date(image.createdAt),
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">
            Plant Details: {plant.customName}
          </DialogTitle>
          {images.length > 0 && (
            <PlantHeaderImage
              imageUrl={primaryImage}
              title={plant.customName}
              stage={plant.stage || ""}
              strain={plant.strain?.name}
              updatedAt={
                plant.updatedAt ? new Date(plant.updatedAt) : undefined
              }
              onClose={onClose}
            />
          )}

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 sm:py-4">
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
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {images.map((image: LocalImage, index) => (
                    <div
                      key={image.id}
                      className={`relative aspect-square rounded-md overflow-hidden cursor-pointer group ${
                        image.isPrimary ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <div className="relative size-full">
                        <Image
                          src={image.url || "/images/placeholder.jpg"}
                          alt={`${plant.customName} image ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
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
                  <PlantDetails
                    plant={plant}
                    getStageBadgeColor={getStageBadgeColor}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="p-4 sm:px-6 border-t bg-background">
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
          <DialogContent className="max-w-7xl p-0 overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 [&>button]:hidden">
            <DialogTitle className="sr-only">
              Plant Image: {plant.customName}
            </DialogTitle>
            <div className="relative h-[90vh] w-full">
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
