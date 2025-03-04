"use client";

import { apiRequest } from "@/app/api/client";
import { CacheTags, createDynamicTag } from "@/app/api/tags";
import { GridViewPlants } from "@/components/plants/grid-view-plants";
import { ListViewPlants } from "@/components/plants/list-view-plants";
import { PlantDetailModal } from "@/components/plants/plant-detail-modal";
import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { PlusCircle, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PlantEditModal } from "./edit-plant-modal";
import { PlantCardSkeleton } from "./plant-card-skeleton";

export function PlantDashboard() {
  const { id: growId } = useParams<{ id: string }>();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState<any | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: [createDynamicTag(CacheTags.getPlantsByGrowId, growId as string)],
    queryFn: async () => {
      if (!growId) throw new Error("Grow ID is required");
      return await apiRequest<PlantWithStrain[]>(`/api/grows/${growId}/plants`);
    },
  });

  console.log("data", data);

  // Filter plants based on search query and stage filter
  const filteredPlants =
    data?.filter((plant) => {
      const matchesSearch =
        plant.customName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plant.strain &&
          plant.strain.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStage = stageFilter === "all" || plant.stage === stageFilter;

      return matchesSearch && matchesStage;
    }) || [];

  const handleViewPlantDetails = (plant: any) => {
    setSelectedPlant(plant);
    setIsDetailModalOpen(true);
  };

  const handleAddNewPlant = () => {
    setPlantToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEditPlant = (plant: any) => {
    setPlantToEdit(plant);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleSavePlant = (updatedPlant: any, images: any[]) => {
    console.log("Saving plant:", updatedPlant, images);
    // In a real app, you would update the plant in your data store
    // For now, we'll just close the modal
  };

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <PlantCardSkeleton key={index} />
          ))}
      </div>
    );
  }

  if (error) {
    toast.error("Error loading grows", {
      description: error.message,
    });
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Plants
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all plants in your current grow
          </p>
        </div>
        <Button onClick={handleAddNewPlant} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 size-4" />
          Add New Plant
        </Button>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plants..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="seedling">Seedling</SelectItem>
              <SelectItem value="veg">Vegetative</SelectItem>
              <SelectItem value="flowering">Flowering</SelectItem>
              <SelectItem value="harvested">Harvested</SelectItem>
              <SelectItem value="curing">Curing</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Tabs
            defaultValue={viewMode}
            onValueChange={(value) => setViewMode(value as "grid" | "list")}
          >
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredPlants.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No plants found</p>
          <Button variant="link" onClick={handleAddNewPlant}>
            Add your first plant
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <GridViewPlants
          plants={filteredPlants}
          onViewDetails={handleViewPlantDetails}
          onEditPlant={handleEditPlant}
        />
      ) : (
        <ListViewPlants
          plants={filteredPlants}
          onViewDetails={handleViewPlantDetails}
          onEditPlant={handleEditPlant}
        />
      )}

      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      <PlantEditModal
        plant={plantToEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePlant}
      />
    </div>
  );
}
