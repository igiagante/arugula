import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, XCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cleanImageUrl = useMemo(() => {
    try {
      if (!url) return "";
      if (url.startsWith("http")) return url;
      if (url.startsWith("blob:")) return url;
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
