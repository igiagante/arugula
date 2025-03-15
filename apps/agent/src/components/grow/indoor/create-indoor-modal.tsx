"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { IndoorForm } from "./indoor-form";

interface CreateIndoorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (id: string) => void;
}

export function CreateIndoorModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateIndoorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Create New Indoor</DialogTitle>
          <DialogDescription>
            Add a new indoor growing space to your collection.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1">
          <IndoorForm
            onCancel={() => onOpenChange(false)}
            onSuccess={(id) => {
              onOpenChange(false);
              onSuccess(id);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
