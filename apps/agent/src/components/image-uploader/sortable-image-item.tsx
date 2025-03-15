import { ImageWithFallback } from "@/components/grow/image-with-fallback";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface SortableImageItemProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

export function SortableImageItem({
  url,
  index,
  onRemove,
}: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `${url}-${index}` });

  // Create a new blob URL when the component mounts
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url.startsWith("blob:")) {
      // Create a new blob URL from the existing one
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const newBlobUrl = URL.createObjectURL(blob);
          setBlobUrl(newBlobUrl);
        })
        .catch(() => {
          // If we can't fetch the blob, just use the original URL
          setBlobUrl(url);
        });

      return () => {
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
        }
      };
    }
  }, [url]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }
    onRemove(index);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="relative aspect-square rounded-lg group cursor-move"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="relative size-full">
        <ImageWithFallback
          imageUrl={blobUrl || url}
          alt={`Image ${index + 1}`}
          className="rounded-lg"
        />
      </div>
      <button
        type="button"
        onClick={handleRemove}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <XCircle size={20} />
      </button>
    </div>
  );
}
