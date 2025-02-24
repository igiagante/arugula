import { createGrow } from "@/app/actions/grows";
import { fetchIndoors, createIndoor } from "@/app/actions/indoors";
import { AddGrowForm } from "@/components/grow/add-grow-form";

export default function GrowPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AddGrowForm
        fetchIndoors={fetchIndoors}
        createIndoor={createIndoor}
        createGrow={createGrow}
      />
    </div>
  );
}
