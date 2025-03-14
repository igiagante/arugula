"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Trash2,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PlantImage } from "./types";

interface ImageGalleryProps {
  images: PlantImage[];
  setImages: (images: PlantImage[]) => void;
}

export function ImageGallery({ images, setImages }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<PlantImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<PlantImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Set an image as primary
  const setPrimaryImage = (imageId: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    setImages(updatedImages);
  };

  // Delete an image
  const deleteImage = () => {
    if (imageToDelete) {
      const updatedImages = images.filter((img) => img.id !== imageToDelete.id);

      // If we deleted the primary image, set a new primary
      if (imageToDelete.isPrimary && updatedImages.length > 0) {
        const firstImage = updatedImages[0];
        if (firstImage) {
          firstImage.isPrimary = true;
        }
      }

      setImages(updatedImages);
      setImageToDelete(null);
    }
  };

  // Open lightbox for an image
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Navigate through lightbox
  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card
            key={image.id}
            className={`overflow-hidden group relative ${image.isPrimary ? "ring-2 ring-primary" : ""}`}
          >
            <CardContent className="p-0">
              <div
                className="relative h-40 w-full cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt="Plant image"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-7 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(index);
                      }}
                    >
                      <ZoomIn className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-card">
                <Button
                  variant={image.isPrimary ? "default" : "ghost"}
                  size="sm"
                  className={`h-8 px-2 ${image.isPrimary ? "" : "opacity-50 hover:opacity-100"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrimaryImage(image.id);
                  }}
                >
                  <Star
                    className={`size-4 mr-1 ${image.isPrimary ? "fill-primary-foreground" : ""}`}
                  />
                  {image.isPrimary ? "Primary" : "Set Primary"}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive opacity-50 hover:opacity-100 hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageToDelete(image);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
          <DialogTitle className="sr-only">Image Gallery</DialogTitle>
          <div className="relative h-[80vh] w-full">
            {images.length > 0 && lightboxIndex < images.length && (
              <Image
                src={images[lightboxIndex]?.url || "/placeholder.svg"}
                alt="Plant image"
                fill
                className="object-contain"
              />
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/50 hover:bg-background/80"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="size-4" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                  onClick={() => navigateLightbox("prev")}
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                  onClick={() => navigateLightbox("next")}
                >
                  <ChevronRight className="size-6" />
                </Button>
              </>
            )}
          </div>

          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">
                {lightboxIndex + 1} of {images.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {images.length > 0 &&
                  lightboxIndex < images.length &&
                  images[lightboxIndex]?.createdAt &&
                  new Date(
                    images[lightboxIndex].createdAt
                  ).toLocaleDateString()}
              </p>
            </div>

            {images.length > 0 && lightboxIndex < images.length && (
              <div className="flex gap-2">
                <Button
                  variant={
                    images[lightboxIndex]?.isPrimary ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setPrimaryImage(images[lightboxIndex]?.id || "")
                  }
                >
                  <Star
                    className={`size-4 mr-1 ${images[lightboxIndex]?.isPrimary ? "fill-primary-foreground" : ""}`}
                  />
                  {images[lightboxIndex]?.isPrimary
                    ? "Primary Image"
                    : "Set as Primary"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    const image = images[lightboxIndex];
                    if (image) {
                      setImageToDelete(image);
                      setLightboxOpen(false);
                    }
                  }}
                >
                  <Trash2 className="size-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={(open) => !open && setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
              {imageToDelete?.isPrimary && (
                <p className="mt-2 text-destructive font-medium">
                  This is your primary image. If deleted, another image will be
                  set as primary.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteImage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
