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
import { Skeleton } from "@workspace/ui/components/skeleton";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Droplets, Sprout, Thermometer, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { GrowImage } from "./grow-image";

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

function getStageColor(stage: string) {
  switch (stage.toLowerCase()) {
    case "vegetative":
      return "bg-emerald-500";
    case "flowering":
      return "bg-amber-500";
    case "completed":
      return "bg-blue-500";
    default:
      return "bg-neutral-500";
  }
}

function getStageBadgeVariant(stage: string) {
  switch (stage.toLowerCase()) {
    case "vegetative":
      return "secondary";
    case "flowering":
      return "secondary";
    case "completed":
      return "secondary";
    default:
      return "outline";
  }
}

function StageProgress({ value, stage }: { value: number; stage: string }) {
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={`absolute left-0 top-0 h-full ${getStageColor(stage)}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function GrowCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="relative p-0">
        <div className="relative h-48">
          <Skeleton className="absolute inset-0" />
          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
        <div className="space-y-3 rounded-lg bg-neutral-50 p-3">
          {[0, 1].map((index) => (
            <div key={index}>
              {index > 0 && <div className="my-3 h-px bg-border" />}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-8" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
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
    <Card className="flex flex-col overflow-hidden max-w-96">
      <CardHeader className="relative p-0">
        <div className="relative h-48">
          <GrowImage imageUrl={images[0] || ""} alt={name} />
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
          <StageProgress value={progress} stage={stage} />
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            {environment.light ? (
              <>
                <Zap className="size-4 text-neutral-500" />
                <span className="text-neutral-600">{environment.light}</span>
              </>
            ) : (
              <>
                <AlertCircle className="size-4 text-amber-500" />
                <span className="text-amber-600">No data</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {environment.temp ? (
              <>
                <Thermometer className="size-4 text-neutral-500" />
                <span className="text-neutral-600">{environment.temp}</span>
              </>
            ) : (
              <>
                <AlertCircle className="size-4 text-amber-500" />
                <span className="text-amber-600">No data</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {environment.humidity ? (
              <>
                <Droplets className="size-4 text-neutral-500" />
                <span className="text-neutral-600">{environment.humidity}</span>
              </>
            ) : (
              <>
                <AlertCircle className="size-4 text-amber-500" />
                <span className="text-amber-600">No data</span>
              </>
            )}
          </div>
        </div>
        <div className="space-y-3 rounded-lg bg-neutral-50 p-3">
          {strains.map((strain, index) => (
            <div key={`${strain.name}-${index}`}>
              {index > 0 && <Separator className="my-3" />}
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
                  <div>THC: {strain.thc}</div>
                  <div>CBD: {strain.cbd}</div>
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
          onClick={() => router.push(`/grows/${id}`)}
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
