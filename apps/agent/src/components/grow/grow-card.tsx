import Image from "next/image";

import { Sprout, Thermometer, Droplets, Zap } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Progress } from "@workspace/ui/components/progress";

interface Strain {
  name: string;
  count: number;
  type: string;
  thc: string;
  cbd: string;
}

interface Environment {
  light: string;
  temp: string;
  humidity: string;
}

interface GrowCardProps {
  name: string;
  stage: string;
  environment: Environment;
  strains: Strain[];
  progress: number;
  lastUpdated: string;
  image: string;
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
      return "default";
    case "flowering":
      return "secondary";
    case "completed":
      return "secondary";
    default:
      return "outline";
  }
}

export function GrowCard({
  name,
  stage,
  environment,
  strains,
  progress,
  lastUpdated,
  image,
}: GrowCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden max-w-96">
      <CardHeader className="relative p-0">
        <div className="relative h-48">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 w-full p-4">
            <CardTitle className="text-lg text-white">{name}</CardTitle>
            <p className="mt-1 text-sm text-white/80">{lastUpdated}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={getStageBadgeVariant(stage)}>{stage}</Badge>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className={`h-1.5 ${getStageColor(stage)}`}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-neutral-500" />
            <span className="text-neutral-600">{environment.light}</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="size-4 text-neutral-500" />
            <span className="text-neutral-600">{environment.temp}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="size-4 text-neutral-500" />
            <span className="text-neutral-600">{environment.humidity}</span>
          </div>
        </div>
        <div className="space-y-3 rounded-lg bg-neutral-50 p-3">
          {strains.map((strain, index) => (
            <div key={strain.name}>
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
                <div className="grid grid-cols-3 gap-2 text-xs text-neutral-600">
                  <div>{strain.type}</div>
                  <div>THC: {strain.thc}</div>
                  <div>CBD: {strain.cbd}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <Button className="flex-1" variant="outline">
          View Details
        </Button>
        <Button className="flex-1">Edit</Button>
      </CardFooter>
    </Card>
  );
}
