// Define type maps for measurement units
export const SystemUnits = {
  metric: "metric",
  imperial: "imperial",
} as const;

export type SystemUnits = (typeof SystemUnits)[keyof typeof SystemUnits];

export const VolumeUnits = {
  liters: "liters",
  gallons: "gallons",
} as const;

export type VolumeUnits = (typeof VolumeUnits)[keyof typeof VolumeUnits];

export const TemperatureUnits = {
  celsius: "celsius",
  fahrenheit: "fahrenheit",
} as const;

export type TemperatureUnits =
  (typeof TemperatureUnits)[keyof typeof TemperatureUnits];

export const DistanceUnits = {
  cm: "cm",
  m: "m",
  inches: "inches",
  feet: "feet",
} as const;

export type DistanceUnits = (typeof DistanceUnits)[keyof typeof DistanceUnits];

export const WeightUnits = {
  grams: "grams",
  kg: "kg",
  oz: "oz",
  lb: "lb",
} as const;

export type WeightUnits = (typeof WeightUnits)[keyof typeof WeightUnits];

export const MeasurementUnits = {
  cm: "cm",
  m: "m",
  inches: "inches",
  feet: "feet",
  liters: "liters",
  gallons: "gallons",
  celsius: "celsius",
  fahrenheit: "fahrenheit",
  grams: "grams",
  kg: "kg",
  oz: "oz",
  lb: "lb",
} as const;

export type MeasurementUnits =
  (typeof MeasurementUnits)[keyof typeof MeasurementUnits];

/**
 * Type for measurement preferences
 */
export type MeasurementPreferences = {
  system: SystemUnits;
  volume: VolumeUnits;
  temperature: TemperatureUnits;
  distance: DistanceUnits;
  weight: WeightUnits;
};

/**
 * Type for notification preferences
 */
export type NotificationPreferences = {
  emailAlerts: boolean;
  pushNotifications: boolean;
};

/**
 * Type for display preferences
 */
export type DisplayPreferences = {
  showMetrics: boolean;
  darkMode: boolean;
};

/**
 * Type for default preferences used in the hook
 */
export type DefaultPreferences = {
  measurements: MeasurementPreferences;
  notifications: NotificationPreferences;
  display: DisplayPreferences;
};
