import { deleteImageFromS3 } from "@/lib/s3/s3-delete";
import { uploadImageToS3 } from "@/lib/s3/s3-upload";
import { useState } from "react";
import { toast } from "sonner";

interface UseImageUploaderOptions {
  onUploadComplete?: (urls: string[]) => void;
  onDeleteComplete?: () => void;
}

export function useImageUploader(options?: UseImageUploaderOptions) {
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  /**
   * Clean image paths by removing API prefixes (internal function)
   */
  const cleanImagePath = (imagePath: string): string => {
    if (typeof imagePath === "string" && imagePath.startsWith("/api/images/")) {
      return imagePath.replace("/api/images/", "");
    }
    return imagePath;
  };

  /**
   * Track images that need to be deleted
   */
  const trackDeletedImage = (imageUrl: string) => {
    // Clean the path before tracking for deletion
    const cleanedUrl = cleanImagePath(imageUrl);
    setDeletedImages((prev) => [...prev, cleanedUrl]);
  };

  /**
   * Reset the deleted images tracking
   */
  const resetDeletedImages = () => {
    setDeletedImages([]);
  };

  /**
   * Handle the image upload process
   */
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];

    setIsUploadingImages(true);
    try {
      // Upload each file individually and collect the URLs
      const uploadPromises = files.map((file) => uploadImageToS3(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      options?.onUploadComplete?.(uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images. Please try again.");
      return [];
    } finally {
      setIsUploadingImages(false);
    }
  };

  /**
   * Handle deletion of images from S3
   */
  const handleDeleteImages = async () => {
    const s3ImagesToDelete = deletedImages.filter(
      (imageUrl) =>
        imageUrl.includes(".s3.") || imageUrl.startsWith("https://s3.")
    );

    if (s3ImagesToDelete.length > 0) {
      try {
        await Promise.all(
          s3ImagesToDelete.map((imageUrl) => deleteImageFromS3(imageUrl))
        );
        options?.onDeleteComplete?.();
      } catch (error) {
        console.error("Error deleting images:", error);
        toast.error("Failed to delete some images.");
      }
    }
  };

  /**
   * Process all image operations (both deletions and uploads)
   */
  const processImages = async (imageFiles: (File | string)[]) => {
    // Handle deletions first
    await handleDeleteImages();

    // Clean any API paths from existing image URLs
    const cleanedImageFiles = imageFiles.map((img) =>
      typeof img === "string" ? cleanImagePath(img) : img
    );

    // Then handle uploads for new files
    const fileObjects = cleanedImageFiles.filter(
      (img): img is File => img instanceof File
    );

    const uploadedImageUrls = await uploadImages(fileObjects);

    // Return all image URLs (existing strings + newly uploaded)
    const existingUrls = cleanedImageFiles.filter(
      (img): img is string => typeof img === "string"
    );

    return [...existingUrls, ...uploadedImageUrls];
  };

  return {
    isUploadingImages,
    deletedImages,
    trackDeletedImage,
    resetDeletedImages,
    uploadImages,
    handleDeleteImages,
    processImages,
  };
}
