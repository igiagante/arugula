import { Button } from "@workspace/ui/components/button";
import { CardFooter } from "@workspace/ui/components/card";
import { ChevronRight, Loader2 } from "lucide-react";

interface GrowFormFooterProps {
  step: number;
  stepsLength: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onPrev: () => void;
  onNext: () => void;
  submitLabel?: string;
}

export function GrowFormFooter({
  step,
  stepsLength,
  isSubmitting,
  onCancel,
  onPrev,
  onNext,
  submitLabel = "Save Grow",
}: GrowFormFooterProps) {
  return (
    <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
      <div className="flex w-full gap-2 sm:w-auto">
        <Button
          type="button"
          variant="outline"
          className="flex-1 sm:flex-none"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none hidden md:inline-flex"
            onClick={onPrev}
          >
            Previous
          </Button>
        )}
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        {step < stepsLength - 1 ? (
          <Button
            className="flex-1 sm:flex-none"
            onClick={(e) => {
              e.preventDefault();
              onNext();
            }}
          >
            Next
            <ChevronRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            className="flex-1 sm:flex-none"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {submitLabel}
          </Button>
        )}
      </div>
    </CardFooter>
  );
}
