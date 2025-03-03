import { Strain } from "@/lib/db/schema";

// Define the cannabinoid profile type
export interface CannabinoidProfile {
  thc?: string;
  cbd?: string;
  [key: string]: string | undefined;
}

// Extend the Strain type to include the properly typed cannabinoidProfile
export interface StrainWithProfiles extends Omit<Strain, "cannabinoidProfile"> {
  cannabinoidProfile?: CannabinoidProfile;
}
