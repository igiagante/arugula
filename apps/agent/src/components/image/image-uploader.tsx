"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, XCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type SortableImageItemProps = {
  url: string;
  index: number;
  onRemove: (index: number) => void;
};

// Sortable image item component
function SortableImageItem({ url, index, onRemove }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `${url}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Clean and validate the URL
  const cleanImageUrl = useMemo(() => {
    try {
      if (!url) return "";

      // If it's already a valid URL, return it as is
      if (url.startsWith("http")) {
        return url;
      }

      // If it's a blob URL, return it as is
      if (url.startsWith("blob:")) {
        return url;
      }

      // If it's just a key, construct the S3 URL
      return `/api/s3/get-view-url?key=${encodeURIComponent(url)}`;
    } catch (error) {
      console.error("Error processing image URL:", error);
      return "";
    }
  }, [url]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-square group"
    >
      <div className="relative size-full rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={cleanImageUrl}
          alt={`Preview ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove image"
        >
          <XCircle size={20} />
        </button>
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={20} />
        </div>
      </div>
    </div>
  );
}

type ImageUploaderProps = {
  maxImages?: number;
  existingImages?: string[];
  onImagesChange: (images: (File | string)[]) => void;
  className?: string;
};

// Main component
export default function ImageUploader({
  maxImages = 10,
  existingImages = [],
  onImagesChange,
  className = "",
}: ImageUploaderProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([...existingImages]);
  const [files, setFiles] = useState<(File | string)[]>([...existingImages]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handles the end of a drag operation to reorder images
   * @param event The drag end event containing active and over elements
   */
  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find indices from the ids
      const activeId = active.id.toString();
      const overId = over.id.toString();
      const activeIndex = previewUrls.findIndex(
        (url, i) => `${url}-${i}` === activeId
      );
      const overIndex = previewUrls.findIndex(
        (url, i) => `${url}-${i}` === overId
      );

      // Reorder the arrays
      const newPreviewUrls = arrayMove(previewUrls, activeIndex, overIndex);
      const newFiles = arrayMove(files, activeIndex, overIndex);

      setPreviewUrls(newPreviewUrls);
      setFiles(newFiles);
      onImagesChange(newFiles);
    }
  };

  /**
   * Handles file selection from the file input
   * @param e The change event from the file input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files?.length) return;

    const selectedFiles = Array.from(e.target.files);
    const totalImages = files.length + selectedFiles.length;

    if (totalImages > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    // Create URLs for preview
    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    // Update state
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    setFiles([...files, ...selectedFiles]);

    // Notify parent component
    onImagesChange([...files, ...selectedFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Removes an image from the uploader
   * @param index The index of the image to remove
   */
  const handleRemoveImage = (index: number): void => {
    // If it's a File object with a preview URL, revoke the object URL to prevent memory leaks
    if (
      files[index] !== undefined &&
      typeof files[index] !== "string" &&
      previewUrls[index] &&
      previewUrls[index].startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    // Remove from arrays
    const newFiles = [...files];
    newFiles.splice(index, 1);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);

    // Update state
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);

    // Notify parent component
    onImagesChange(newFiles);
  };

  /**
   * Handles files dropped into the drop zone
   * @param e The drop event
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer.files?.length) return;

    // Get all dropped files without any filtering first
    const allDroppedFiles = Array.from(e.dataTransfer.files);

    // Then filter for images
    const droppedFiles = allDroppedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    console.log("Image files after filtering:", droppedFiles.length);

    if (!droppedFiles.length) {
      alert("Please drop image files only.");
      return;
    }

    const totalImages = files.length + droppedFiles.length;

    if (totalImages > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    // Create URLs for preview
    const newPreviewUrls = droppedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    // Update state
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    setFiles([...files, ...droppedFiles]);

    // Notify parent component
    onImagesChange([...files, ...droppedFiles]);
  };

  return (
    <div
      className={`space-y-4 ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleDrop}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={previewUrls.map((url, i) => `${url}-${i}`)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Sortable Preview images */}
            {previewUrls.map((url, index) => (
              <SortableImageItem
                key={`${url}-${index}`}
                url={url}
                index={index}
                onRemove={handleRemoveImage}
              />
            ))}

            {/* Upload button (not sortable) */}
            {files.length < maxImages && (
              <div
                className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="size-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Add Image</span>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*"
      />

      <p className="text-xs text-gray-500">
        {files.length} of {maxImages} images • Drag to reorder • Drag and drop
        or click to upload
      </p>
    </div>
  );
}
