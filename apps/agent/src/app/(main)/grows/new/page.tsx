import { AddGrowForm } from "@/components/grow/forms/add-grow-form";
import { Suspense } from "react";

export default function GrowPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddGrowForm />
    </Suspense>
  );
}
