import { z } from "zod";

const preferencesSchema = z.object({
  measurements: z.object({
    system: z.enum(["metric", "imperial"]),
    temperature: z.enum(["celsius", "fahrenheit"]),
    volume: z.enum(["liters", "gallons"]),
    distance: z.enum(["cm", "m", "inches", "feet"]),
    weight: z.enum(["grams", "kg", "oz", "lb"]),
  }),
  notifications: z.object({
    emailAlerts: z.boolean(),
    pushNotifications: z.boolean(),
  }),
  display: z.object({
    showMetrics: z.boolean(),
    darkMode: z.boolean(),
  }),
});

export type PreferencesValues = z.infer<typeof preferencesSchema>;
