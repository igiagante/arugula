"use client";

import type React from "react";

import { Button } from "@workspace/ui/components/button";
import { Camera, ImagePlus, Upload } from "lucide-react";
import { useState, type RefObject } from "react";

interface PlantImage {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

interface ImageUploaderProps {
  images: PlantImage[];
  setImages: (images: PlantImage[]) => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

export function ImageUploader({
  images,
  setImages,
  fileInputRef,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Process the files
  const handleFiles = async (files: File[]) => {
    setIsUploading(true);

    try {
      // Filter for image files
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      // In a real app, you would upload these files to your server or cloud storage
      // For this demo, we'll create object URLs
      const newImages: PlantImage[] = imageFiles.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        isPrimary: images.length === 0 && index === 0, // Make first image primary if no images exist
        createdAt: new Date().toISOString(),
      }));

      // Add the new images to the existing ones
      setImages([...images, ...newImages]);
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20 hover:border-muted-foreground/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <div className="flex flex-col items-center justify-center gap-2 cursor-pointer">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="size-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isUploading
                ? "Uploading..."
                : "Drag & drop images or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF (max 10MB each)
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          className="gap-1.5"
        >
          <ImagePlus className="size-4" />
          <span>Upload Images</span>
        </Button>

        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <Camera className="size-4" />
          <span>Take Photo</span>
        </Button>
      </div>
    </div>
  );
}
