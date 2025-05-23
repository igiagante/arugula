import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Droplets, Sprout, Thermometer, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getStageBadgeColor,
  getStageBadgeVariant,
} from "../plants/plant-utils";
import { ImageWithFallback } from "./image-with-fallback";

interface Strain {
  name: string;
  count: number;
  type: string;
  thc: string;
  cbd: string;
  genotype: string;
  ratio: string;
}

interface Environment {
  light: string;
  temp: string;
  humidity: string;
}

interface GrowCardProps {
  id: string;
  name: string;
  stage: string;
  environment: Environment;
  strains: Strain[];
  progress: number;
  lastUpdated: string;
  images: string[];
  yield?: string;
}

function StageProgress({ value, stage }: { value: number; stage: string }) {
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={`absolute left-0 top-0 h-full ${getStageBadgeColor(stage)}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function GrowCard({
  id,
  name,
  stage,
  environment,
  strains,
  progress,
  lastUpdated,
  images,
}: GrowCardProps) {
  const router = useRouter();
  return (
    <Card className="flex flex-col overflow-hidden sm:max-w-96 lg:min-w-80 max-h-[680px]">
      <CardHeader className="relative p-0">
        <div className="relative h-48">
          <ImageWithFallback
            imageUrl={images[0] || ""}
            alt={name}
            className="rounded-b-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 w-full p-4">
            <CardTitle className="text-lg text-white">{name}</CardTitle>
            <p className="mt-1 text-sm text-white/80">
              {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={getStageBadgeVariant(stage)}>{stage}</Badge>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="flex my-2">
            <StageProgress value={progress} stage={stage} />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 text-sm">
          <div className="col-span-6 flex items-center gap-1 overflow-hidden">
            {environment.light ? (
              <>
                <Zap className="size-4 shrink-0 text-neutral-500" />
                <span className="text-neutral-600 truncate whitespace-nowrap">
                  {environment.light}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="size-4 shrink-0 text-amber-500" />
                <span className="text-amber-600">No data</span>
              </>
            )}
          </div>
          <div className="col-span-3 flex items-center justify-center">
            {environment.temp ? (
              <div className="flex items-center gap-1">
                <Thermometer className="size-4 shrink-0 text-neutral-500" />
                <span className="text-neutral-600">{environment.temp}</span>
              </div>
            ) : (
              <>
                <AlertCircle className="size-4 shrink-0 text-amber-500" />
                <span className="text-amber-600">No data</span>
              </>
            )}
          </div>
          <div className="col-span-3 flex items-center justify-center">
            {environment.humidity ? (
              <div className="flex items-center gap-1">
                <Droplets className="size-4 shrink-0 text-neutral-500" />
                <span className="text-neutral-600">{environment.humidity}</span>
              </div>
            ) : (
              <>
                <AlertCircle className="size-4 shrink-0 text-amber-500" />
                <span className="text-amber-600">No data</span>
              </>
            )}
          </div>
        </div>
        <div className="space-y-3 rounded-lg bg-neutral-50 p-3 max-h-[280px] overflow-y-auto">
          {strains.map((strain, index) => (
            <div key={`${strain.name}-${index}`}>
              {index > 0 && <Separator className="my-2 bg-neutral-200" />}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sprout className="size-4 text-emerald-600" />
                    <span className="font-medium">{strain.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    x{strain.count}
                  </Badge>
                </div>
                <div className="text-xs text-neutral-600">{strain.ratio}</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                  <div>
                    THC:{" "}
                    {!isNaN(Number(strain.thc)) ? `${strain.thc}%` : strain.thc}
                  </div>
                  <div>
                    CBD:{" "}
                    {!isNaN(Number(strain.cbd)) ? `${strain.cbd}%` : strain.cbd}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => router.push(`/grows/${id}/plants`)}
        >
          View Details
        </Button>
        <Button
          className="flex-1"
          onClick={() => router.push(`/grows/${id}/edit`)}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
