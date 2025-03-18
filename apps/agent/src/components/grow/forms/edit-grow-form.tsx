"use client";

import type { GrowView } from "@/lib/db/queries/types/grow";
import type { Grow } from "@/lib/db/schemas";
import { GrowForm } from "./grow-form";

interface UpdateGrowFormProps {
  grow: GrowView &
    Pick<
      Grow,
      | "startDate"
      | "endDate"
      | "growingMethod"
      | "substrateComposition"
      | "potSize"
      | "indoorId"
    >;
}

export function UpdateGrowForm({ grow }: UpdateGrowFormProps) {
  console.log("grow", grow);
  return <GrowForm grow={grow} />;
}
