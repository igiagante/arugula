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

import type { Indoor } from "@/lib/db/schemas/indoor.schema";
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
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";

import { apiRequest } from "@/app/(main)/api/client";
import { CacheTags, createDynamicTag } from "@/app/(main)/api/tags";
import { useOrganization } from "@clerk/nextjs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CreateGrowSchema } from "../forms/grow.schema";
import { CreateIndoorModal } from "../indoor/create-indoor-modal";

interface BasicDetailsStepProps {
  growId?: string;
  control: Control<CreateGrowSchema>;
  growStages: readonly { label: string; value: string }[];
  growingMethods: readonly { label: string; value: string }[];
  setValue: UseFormSetValue<CreateGrowSchema>;
}

export function BasicDetailsStep({
  growId,
  control,
  growStages,
  growingMethods,
  setValue,
}: BasicDetailsStepProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [isCreateIndoorModalOpen, setIsCreateIndoorModalOpen] = useState(false);

  const { organization } = useOrganization();

  const queryResult: UseQueryResult<Indoor[]> = useQuery({
    queryKey: [
      CacheTags.indoors,
      createDynamicTag(
        CacheTags.availableIndoorsByOrganizationId,
        organization?.id || ""
      ),
      growId,
    ],
    queryFn: async () => {
      let url = `/api/indoors`;
      if (growId) {
        url += `?growId=${growId}`;
      }

      console.log("Request URL:", url);

      const response = (await apiRequest<Indoor[]>(url)) || [];

      try {
        const formValues = (control as any)._formValues;
        const currentIndoorId = formValues?.indoorId;

        console.log("currentIndoorId", currentIndoorId);
        console.log("response", response);

        if (
          Array.isArray(response) &&
          response.length > 0 &&
          !currentIndoorId
        ) {
          setValue("indoorId", response[0]?.id || "");
        }
      } catch (e) {
        console.error("Failed to initialize indoorId:", e);
      }

      return response;
    },
  });

  const indoors = queryResult.data || [];
  const refetch = queryResult.refetch;

  console.log("growId value:", growId);
  console.log("Type of growId:", typeof growId);
  console.log("Is truthy?", Boolean(growId));

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
                    onValueChange={(value) => {
                      if (value === "create-new") {
                        setIsCreateIndoorModalOpen(true);
                        setTimeout(() => field.onChange(field.value), 0);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an indoor space" />
                    </SelectTrigger>
                    <SelectContent>
                      {indoors.length > 0 ? (
                        indoors.map((indoor) => (
                          <SelectItem key={indoor.id} value={indoor.id}>
                            {indoor.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem
                          value="no-indoors"
                          disabled
                          className="text-muted-foreground"
                        >
                          No indoor spaces found
                        </SelectItem>
                      )}
                      <SelectItem
                        value="create-new"
                        className="text-primary font-medium"
                      >
                        + Create new indoor space
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormItem>
            )}
          />
        </div>
        <CreateIndoorModal
          open={isCreateIndoorModalOpen}
          onOpenChange={setIsCreateIndoorModalOpen}
          onSuccess={(id: string) => {
            setValue("indoorId", id);
            refetch();
          }}
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
