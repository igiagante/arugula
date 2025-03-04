import { z } from "zod";

export const userPreferencesSchema = z.object({
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

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
