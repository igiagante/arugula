import { Badge } from "@workspace/ui/components/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRightLeft,
  Beaker,
  Calendar,
  Droplets,
  FileText,
  FlaskRoundIcon as Flask,
  Leaf,
  Scissors,
  Zap,
} from "lucide-react";
import Image from "next/image";

interface TimelineItem {
  id: string;
  type: string;
  title: string;
  date: string;
  content: string;
  data?: any;
  imageUrl?: string;
}

interface PlantTimelineProps {
  items: TimelineItem[];
}

export function PlantTimeline({ items }: PlantTimelineProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feeding":
        return <Droplets className="size-5" />;
      case "note":
        return <FileText className="size-5" />;
      case "pruning":
        return <Scissors className="size-5" />;
      case "transplant":
        return <ArrowRightLeft className="size-5" />;
      case "stageChange":
        return <Leaf className="size-5" />;
      default:
        return <Calendar className="size-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feeding":
        return "bg-blue-100 text-blue-800";
      case "note":
        return "bg-gray-100 text-gray-800";
      case "pruning":
        return "bg-purple-100 text-purple-800";
      case "transplant":
        return "bg-amber-100 text-amber-800";
      case "stageChange":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      formatted: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      relative: formatDistanceToNow(date, { addSuffix: true }),
    };
  };

  const getDataIcon = (key: string) => {
    switch (key) {
      case "ph":
        return <Flask className="size-3.5 text-blue-600 shrink-0" />;
      case "ec":
        return <Zap className="size-3.5 text-amber-600 shrink-0" />;
      case "nutrients":
        return <Beaker className="size-3.5 text-green-600 shrink-0" />;
      case "fromSize":
      case "toSize":
        return <ArrowRightLeft className="size-3.5 text-purple-600 shrink-0" />;
      case "medium":
        return <Leaf className="size-3.5 text-emerald-600 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No timeline entries yet
        </div>
      ) : (
        items.map((item, index) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full p-1.5 sm:p-2 ${getTypeColor(item.type)}`}
              >
                {getTypeIcon(item.type)}
              </div>
              {index < items.length - 1 && (
                <div className="w-px h-full bg-border mt-2" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="font-medium text-sm sm:text-base">
                  {item.title}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-help">
                        {formatDate(item.date).relative}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatDate(item.date).formatted}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {item.content}
              </p>

              {item.data && (
                <div className="bg-muted p-2 rounded-md text-xs">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(item.data).map(([key, value]) => (
                        <tr key={key}>
                          <td className="py-0.5">
                            <div className="flex items-center gap-1">
                              {getDataIcon(key)}
                              <span className="font-medium capitalize">
                                {key}:
                              </span>
                            </div>
                          </td>
                          <td className="text-right py-0.5">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {item.imageUrl && (
                <div className="relative h-32 sm:h-40 w-full rounded-md overflow-hidden mt-2">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
