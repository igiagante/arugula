"use client";

import { apiRequest, HttpMethods } from "@/app/api/client";
import { CacheTags, createDynamicTag } from "@/app/api/tags";
import { GridViewPlants } from "@/components/plants/views/grid-view-plants";
import { ListViewPlants } from "@/components/plants/views/list-view-plants";
import { GrowStages, ViewModes, viewModes } from "@/lib/constants";
import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { PlantCardSkeleton } from "../skeletons/plant-card-skeleton";
import { AddPlantModal } from "./modals/add-plant-modal";
import { PlantEditModal } from "./modals/edit-plant-modal";
import { PlantDetailModal } from "./modals/plant-detail-modal";

export function PlantDashboard() {
  const { id: growId } = useParams<{ id: string }>();

  const [viewMode, setViewMode] = useState<ViewModes>(viewModes.grid);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedPlant, setSelectedPlant] = useState<PlantWithStrain | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editPlant, setEditPlant] = useState<PlantWithStrain | null>(null);

  const queryClient = useQueryClient();

  const { data: grow } = useQuery({
    queryKey: [createDynamicTag(CacheTags.growById, growId as string)],
    queryFn: async () => {
      if (!growId) {
        throw new Error("Grow ID is required");
      }
      return await apiRequest<{ name: string }>(`/api/grows/${growId}`);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: [createDynamicTag(CacheTags.getPlantsByGrowId, growId as string)],
    queryFn: async () => {
      if (!growId) {
        throw new Error("Grow ID is required");
      }
      return await apiRequest<PlantWithStrain[]>(`/api/grows/${growId}/plants`);
    },
  });

  const { mutate: deletePlant } = useMutation({
    mutationFn: async (plantId: string) => {
      await apiRequest(`/api/plants/${plantId}`, {
        method: HttpMethods.DELETE,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          createDynamicTag(CacheTags.getPlantsByGrowId, growId as string),
        ],
      });
      toast.success("Plant deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete plant", {
        description: error.message,
      });
    },
  });

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

  const handleViewPlantDetails = (plant: PlantWithStrain) => {
    setSelectedPlant(plant);
    setIsDetailModalOpen(true);
  };

  const handleAddNewPlant = () => {
    setSelectedPlant(null);
    setIsEditModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleEditPlant = (plant: PlantWithStrain) => {
    setEditPlant(plant);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleDeletePlant = (plant: PlantWithStrain) => {
    deletePlant(plant.id);
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
    toast.error("Error loading plants", {
      description: error.message,
    });
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {grow?.name || "Your Plants"}
          </h1>
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
              <SelectItem value={GrowStages.seedling}>Seedling</SelectItem>
              <SelectItem value={GrowStages.vegetative}>Vegetative</SelectItem>
              <SelectItem value={GrowStages.flowering}>Flowering</SelectItem>
              <SelectItem value={GrowStages.harvested}>Harvested</SelectItem>
              <SelectItem value={GrowStages.curing}>Curing</SelectItem>
              <SelectItem value={GrowStages.archived}>Archived</SelectItem>
            </SelectContent>
          </Select>

          <Tabs
            defaultValue={viewMode}
            onValueChange={(value) => setViewMode(value as ViewModes)}
          >
            <TabsList>
              <TabsTrigger value={viewModes.grid}>Grid</TabsTrigger>
              <TabsTrigger value={viewModes.list}>List</TabsTrigger>
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
      ) : viewMode === viewModes.grid ? (
        <GridViewPlants
          plants={filteredPlants}
          onViewDetails={handleViewPlantDetails}
          onEditPlant={handleEditPlant}
          onDeletePlant={handleDeletePlant}
        />
      ) : (
        <ListViewPlants
          plants={filteredPlants}
          onViewDetails={handleViewPlantDetails}
          onEditPlant={handleEditPlant}
          onDeletePlant={handleDeletePlant}
        />
      )}

      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      {editPlant && (
        <PlantEditModal
          plant={editPlant}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <AddPlantModal
        growId={growId as string}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
