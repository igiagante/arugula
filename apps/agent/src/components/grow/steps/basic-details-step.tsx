"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

import { Input } from "@workspace/ui/components/input";

import type { Indoor } from "@/lib/db/schema";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { CreateIndoorModal } from "../indoor/create-indoor-modal";

import { apiRequest } from "@/app/api/client";
import { CacheTags } from "@/app/api/tags";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { GrowFormValues } from "../schema";

interface BasicDetailsStepProps {
  control: Control<GrowFormValues>;
  growStages: readonly { label: string; value: string }[];
  growingMethods: readonly { label: string; value: string }[];
  setValue: UseFormSetValue<GrowFormValues>;
}

export function BasicDetailsStep({
  control,
  growStages,
  growingMethods,
  setValue,
}: BasicDetailsStepProps) {
  const [createIndoorOpen, setCreateIndoorOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const {
    data: indoors,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [CacheTags.indoors],
    queryFn: async () => {
      return await apiRequest<Indoor[]>("/api/indoors");
    },
  });

  const handleCreateIndoorSuccess = async (id: string) => {
    await refetch();
    // Set the newly created indoor as the selected value
    setValue("indoorId", id, {
      shouldValidate: false, // Change this to false to prevent validation
    });
    setCreateIndoorOpen(false);
  };

  if (error) {
    toast.error("Error loading indoor spaces", {
      description: error.message,
    });
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <FormField
            control={control}
            name="indoorId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Indoor Space</FormLabel>
                <div className="flex items-center gap-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an indoor space" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          Loading indoor spaces...
                        </div>
                      ) : indoors?.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No indoor spaces found
                        </div>
                      ) : (
                        indoors?.map((indoor) => (
                          <SelectItem key={indoor.id} value={indoor.id}>
                            {indoor.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setCreateIndoorOpen(true)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <CreateIndoorModal
          open={createIndoorOpen}
          onOpenChange={setCreateIndoorOpen}
          onSuccess={handleCreateIndoorSuccess}
        />
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grow Name</FormLabel>
              <FormControl>
                <Input placeholder="Spring 2026 Cycle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {growStages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="growingMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Growing Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {growingMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal h-9",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          field.value.toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setStartDateOpen(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expected End Date</FormLabel>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal h-9",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          field.value.toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setEndDateOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
