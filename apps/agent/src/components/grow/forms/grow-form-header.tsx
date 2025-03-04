import { Button } from "@workspace/ui/components/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { ChevronLeft } from "lucide-react";

interface GrowFormHeaderProps {
  step: number;
  steps: readonly {
    readonly title: string;
    readonly description: string;
    readonly fields?: readonly string[];
  }[];
  onPrev?: () => void;
  showBackButton?: boolean;
}

export function GrowFormHeader({
  step,
  steps,
  onPrev,
  showBackButton = true,
}: GrowFormHeaderProps) {
  return (
    <CardHeader>
      <div className="space-y-2">
        <CardTitle className="flex items-center gap-2">
          {showBackButton && step > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 md:hidden"
              onClick={onPrev}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <span>{steps[step]?.title}</span>
        </CardTitle>
        <CardDescription>{steps[step]?.description}</CardDescription>
      </div>
      <div className="mt-4 space-y-1">
        <Progress value={((step + 1) / steps.length) * 100} className="h-1" />
        <p className="text-xs text-muted-foreground text-right">
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </CardHeader>
  );
}
