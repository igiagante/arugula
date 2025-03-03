"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { Switch } from "@workspace/ui/components/switch";
import { Droplets, Loader2, Ruler, Scale, ThermometerIcon } from "lucide-react";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { UserPreferences, userPreferencesSchema } from "./schema";

const measurementSystems = [
  { label: "Metric", value: "metric" },
  { label: "Imperial", value: "imperial" },
] as const;

const temperatureUnits = [
  { label: "Celsius (°C)", value: "celsius" },
  { label: "Fahrenheit (°F)", value: "fahrenheit" },
] as const;

const volumeUnits = [
  { label: "Liters (L)", value: "liters" },
  { label: "Gallons (gal)", value: "gallons" },
] as const;

const distanceUnits = [
  { label: "Centimeters (cm)", value: "cm" },
  { label: "Meters (m)", value: "m" },
  { label: "Inches (in)", value: "inches" },
  { label: "Feet (ft)", value: "feet" },
] as const;

const weightUnits = [
  { label: "Grams (g)", value: "grams" },
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Ounces (oz)", value: "oz" },
  { label: "Pounds (lb)", value: "lb" },
] as const;

const defaultPreferences: UserPreferences = {
  measurements: {
    system: "metric",
    temperature: "celsius",
    volume: "liters",
    distance: "cm",
    weight: "grams",
  },
  notifications: {
    emailAlerts: true,
    pushNotifications: true,
  },
  display: {
    showMetrics: true,
    darkMode: false,
  },
};

interface UserPreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: UserPreferences) => Promise<void>;
  initialPreferences?: Partial<UserPreferences>;
  preferences: UserPreferences;
}

export function UserPreferencesModal({
  open,
  onOpenChange,
  onSubmit,
  initialPreferences = defaultPreferences,
  preferences,
}: UserPreferencesModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UserPreferences>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: preferences || initialPreferences,
  });

  // Reset form when preferences change
  React.useEffect(() => {
    if (preferences) {
      form.reset(preferences);
    }
  }, [form, preferences]);

  async function handleSubmit(data: UserPreferences) {
    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Example values for preview
  const previewValues = {
    temperature:
      form.watch("measurements.temperature") === "celsius" ? "23°C" : "73.4°F",
    volume: form.watch("measurements.volume") === "liters" ? "5L" : "1.32gal",
    distance: (() => {
      const unit = form.watch("measurements.distance");
      switch (unit) {
        case "cm":
          return "100cm";
        case "m":
          return "1m";
        case "inches":
          return "39.37in";
        case "feet":
          return "3.28ft";
        default:
          return "100cm";
      }
    })(),
    weight: form.watch("measurements.weight").startsWith("g")
      ? "500g"
      : "1.1lb",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>User Preferences</DialogTitle>
          <DialogDescription>
            Customize your growing experience. These settings will be used
            throughout the application.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 overflow-y-auto pr-1"
          >
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Measurement Settings</CardTitle>
                  <CardDescription>
                    Choose your preferred units of measurement
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="measurements.system"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Measurement System</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select measurement system" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {measurementSystems.map((system) => (
                              <SelectItem
                                key={system.value}
                                value={system.value}
                              >
                                {system.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This will set the default measurement system for all
                          values
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="measurements.temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <ThermometerIcon className="size-4" />
                            Temperature
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select temperature unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {temperatureUnits.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="measurements.volume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Droplets className="size-4" />
                            Volume
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select volume unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {volumeUnits.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="measurements.distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Ruler className="size-4" />
                            Distance
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select distance unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {distanceUnits.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="measurements.weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Scale className="size-4" />
                            Weight
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select weight unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {weightUnits.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 text-sm font-medium">Preview</h4>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Temperature:</div>
                        <div>{previewValues.temperature}</div>
                        <div>Volume:</div>
                        <div>{previewValues.volume}</div>
                        <div>Distance:</div>
                        <div>{previewValues.distance}</div>
                        <div>Weight:</div>
                        <div>{previewValues.weight}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configure how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="notifications.emailAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0">
                        <div className="space-y-1">
                          <FormLabel>Email Alerts</FormLabel>
                          <FormDescription>
                            Receive updates about your grows via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifications.pushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0">
                        <div className="space-y-1">
                          <FormLabel>Push Notifications</FormLabel>
                          <FormDescription>
                            Receive push notifications for important events
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>
                    Customize your viewing experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="display.showMetrics"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0">
                        <div className="space-y-1">
                          <FormLabel>Show Metrics</FormLabel>
                          <FormDescription>
                            Display performance metrics on your dashboard
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display.darkMode"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0">
                        <div className="space-y-1">
                          <FormLabel>Dark Mode</FormLabel>
                          <FormDescription>
                            Use dark theme throughout the application
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="sticky bottom-0 pt-2 bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Save Preferences
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
