"use client";

import { apiRequest, HttpMethods } from "@/app/(main)/api/client";
import { CacheTags } from "@/app/(main)/api/tags";
import {
  DefaultPreferences,
  DistanceUnits,
  SystemUnits,
  TemperatureUnits,
  VolumeUnits,
  WeightUnits,
} from "@/components/user/user-preferences.types";
import {
  UserPreferences,
  userPreferencesSchema,
} from "@/schemas/user-preferences.schema";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { z } from "zod";

/**
 * Hook to manage user preferences
 * @returns User preferences data and mutation functions
 */
export const useUserPreferences = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  // Define default preferences
  const defaultPreferences: DefaultPreferences = {
    measurements: {
      system: SystemUnits.metric,
      volume: VolumeUnits.liters,
      temperature: TemperatureUnits.celsius,
      distance: DistanceUnits.cm,
      weight: WeightUnits.kg,
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

  /**
   * Converts string boolean values to actual booleans
   * @param value The value to convert
   * @param defaultValue The default value if conversion fails
   * @returns A boolean value
   */
  const parseBooleanValue = (
    value: unknown,
    defaultValue: boolean = false
  ): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return defaultValue;
  };

  /**
   * Fetches user preferences from the API
   */
  const { data: rawPreferences, ...queryRest } = useQuery({
    queryKey: [CacheTags.userPreferences, userId],
    queryFn: async () => {
      if (!userId) {
        return defaultPreferences;
      }

      try {
        const url = `/api/users/${userId}/preferences`;
        const response = await apiRequest<UserPreferences, null>(url, {
          method: HttpMethods.GET,
        });

        return response || defaultPreferences;
      } catch (error) {
        return defaultPreferences;
      }
    },
    enabled: !!userId,
    placeholderData: defaultPreferences,
    refetchOnMount: true,
  });

  /**
   * Transforms raw preferences to schema-compliant structure
   */
  const preferences = useMemo(() => {
    const raw = rawPreferences || defaultPreferences;

    // Map raw preferences to schema structure with proper type handling
    const mappedPreferences = {
      notifications: {
        emailAlerts: parseBooleanValue(
          raw.notifications?.emailAlerts,
          defaultPreferences.notifications.emailAlerts
        ),
        pushNotifications: parseBooleanValue(
          raw.notifications?.pushNotifications,
          defaultPreferences.notifications.pushNotifications
        ),
      },
      measurements: {
        system:
          raw.measurements?.system || defaultPreferences.measurements.system,
        volume:
          raw.measurements?.volume || defaultPreferences.measurements.volume,
        temperature:
          raw.measurements?.temperature ||
          defaultPreferences.measurements.temperature,
        distance:
          raw.measurements?.distance ||
          defaultPreferences.measurements.distance,
        weight:
          raw.measurements?.weight || defaultPreferences.measurements.weight,
      },
      display: {
        showMetrics: parseBooleanValue(
          raw.display?.showMetrics,
          defaultPreferences.display.showMetrics
        ),
        darkMode: parseBooleanValue(
          raw.display?.darkMode,
          defaultPreferences.display.darkMode
        ),
      },
    };

    try {
      // Validate against schema
      return userPreferencesSchema.parse(mappedPreferences);
    } catch (error) {
      // Return mapped preferences even if validation fails
      return mappedPreferences;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawPreferences]);

  /**
   * Converts preferences object to API-friendly format
   * @param data Validated preferences data
   * @returns Record of string key-value pairs for API submission
   */
  const convertPreferencesToApiFormat = (
    data: z.infer<typeof userPreferencesSchema>
  ): Record<string, string | boolean> => {
    return {
      // Measurement preferences
      volume: data.measurements.volume,
      temperature: data.measurements.temperature,
      distance: data.measurements.distance,
      weight: data.measurements.weight,

      // Notification preferences
      emailAlerts: data.notifications.emailAlerts,
      pushNotifications: data.notifications.pushNotifications,

      // Display preferences
      showMetrics: data.display.showMetrics,
      darkMode: data.display.darkMode,
    };
  };

  /**
   * Mutation to update user preferences
   */
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: z.infer<typeof userPreferencesSchema>) => {
      if (!userId) throw new Error("User not authenticated");

      const validatedData = userPreferencesSchema.parse(data);
      const apiData = convertPreferencesToApiFormat(validatedData);

      try {
        const result = await apiRequest<UserPreferences, any>(
          `/api/users/${userId}/preferences`,
          {
            method: HttpMethods.PATCH,
            body: apiData,
          }
        );
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheTags.userPreferences, userId],
      });
    },
  });

  const updatePreferences = async (
    data: z.infer<typeof userPreferencesSchema>
  ) => {
    return new Promise<void>((resolve, reject) => {
      updatePreferencesMutation.mutate(data, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return {
    preferences,
    rawPreferences: rawPreferences || defaultPreferences,
    updatePreferences,
    isUpdating: updatePreferencesMutation.isPending,
    updateError: updatePreferencesMutation.error,
    ...queryRest,
  };
};
