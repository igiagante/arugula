"use client";

import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Droplets,
  Edit,
  Eye,
  Leaf,
  Moon,
  MoreVertical,
  Scale,
  Sun,
  Thermometer,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface ListViewPlantsProps {
  plants: PlantWithStrain[];
  onViewDetails: (plant: PlantWithStrain) => void;
  onEditPlant: (plant: PlantWithStrain) => void;
  onDeletePlant: (plant: PlantWithStrain) => void;
}

export function ListViewPlants({
  plants,
  onViewDetails,
  onEditPlant,
  onDeletePlant,
}: ListViewPlantsProps) {
  const [plantToDelete, setPlantToDelete] = useState<PlantWithStrain | null>(
    null
  );

  // Map the existing stages to simplified categories
  const getSimplifiedStage = (
    stage: string
  ): { label: string; value: string } => {
    switch (stage.toLowerCase()) {
      case "seedling":
      case "vegetative":
      case "flowering":
        return { label: "Growing", value: "growing" };
      case "harvested":
        return { label: "Harvested", value: "harvested" };
      case "curing":
      case "archived":
        return { label: "Curing", value: "curing" };
      default:
        return { label: "Growing", value: "growing" };
    }
  };

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case "growing":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80";
      case "harvested":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80";
      case "curing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "growing":
        return <Leaf className="size-3.5 mr-1.5" />;
      case "harvested":
        return <Scale className="size-3.5 mr-1.5" />;
      case "curing":
        return <Thermometer className="size-3.5 mr-1.5" />;
      default:
        return <Leaf className="size-3.5 mr-1.5" />;
    }
  };

  // Generate sativa/indica ratio based on plant id
  const getStrainRatio = (
    plant: PlantWithStrain
  ): { sativa: number; indica: number } => {
    const hash = plant.id.charCodeAt(plant.id.length - 1);
    // Generate a number between 0-100 for sativa percentage
    const sativa = hash % 101;
    const indica = 100 - sativa;
    return { sativa, indica };
  };

  // Generate cannabinoid levels based on plant id
  const getCannabinoidLevels = (
    plant: PlantWithStrain
  ): { thc: number; cbd: number } => {
    const hash = plant.id.charCodeAt(plant.id.length - 1);
    const thc = 10 + (hash % 15); // Random THC between 10-25%
    const cbd = 1 + (hash % 10); // Random CBD between 1-11%
    return { thc, cbd };
  };

  // Generate mock growth progress data
  const getGrowthProgress = (
    plant: PlantWithStrain
  ): { currentDay: number; totalDays: number } => {
    // Use the plant id to generate consistent but random-looking data
    const hash = plant.id.charCodeAt(plant.id.length - 1);

    // Only generate progress for plants in the growing stage
    if (getSimplifiedStage(plant.stage || "").value !== "growing") {
      return { currentDay: 0, totalDays: 0 };
    }

    // Total days based on stage (seedling: ~14 days, veg: ~28 days, flowering: ~56 days)
    let totalDays = 28; // Default to veg cycle
    if (plant.stage === "seedling") totalDays = 14;
    if (plant.stage === "flowering") totalDays = 56;

    // Current day is a percentage of total days based on hash
    const progressPercentage = (hash % 101) / 100;
    const currentDay = Math.round(progressPercentage * totalDays);

    return { currentDay, totalDays };
  };

  // Render cannabinoid strength indicators
  const renderStrengthIndicator = (value: number, max = 30) => {
    // Calculate how many filled dots to show (out of 5)
    const strengthPercentage = value / max;
    const filledDots = Math.round(strengthPercentage * 5);

    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`size-1.5 rounded-full ${i < filledDots ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
    );
  };

  // Render enhanced stage badge with progress for growing plants
  const renderStageBadge = (plant: PlantWithStrain) => {
    const simplifiedStage = getSimplifiedStage(plant.stage || "");
    const badgeColor = getStageBadgeColor(simplifiedStage.value);
    const stageIcon = getStageIcon(simplifiedStage.value);

    // If it's not a growing plant, render a simple badge
    if (simplifiedStage.value !== "growing") {
      return (
        <Badge className={`${badgeColor} flex items-center px-2 py-1`}>
          {stageIcon}
          {simplifiedStage.label}
        </Badge>
      );
    }

    // For growing plants, render an enhanced badge with progress
    const growthProgress = getGrowthProgress(plant);
    const percentage = Math.round(
      (growthProgress.currentDay / growthProgress.totalDays) * 100
    );

    return (
      <div className="flex flex-col gap-1">
        <Badge className={`${badgeColor} flex items-center px-2 py-1`}>
          {stageIcon}
          {simplifiedStage.label}
        </Badge>
        <div className="flex items-center gap-1.5 pl-1">
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full animate-pulse"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {growthProgress.currentDay}/{growthProgress.totalDays}d
          </span>
        </div>
      </div>
    );
  };

  const handleDeletePlant = (plant: PlantWithStrain) => {
    setPlantToDelete(plant);
  };

  const confirmDelete = () => {
    if (plantToDelete) {
      onDeletePlant(plantToDelete);
      setPlantToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-sm">
                Plant Name
              </TableHead>
              <TableHead className="font-semibold text-sm">Stage</TableHead>
              <TableHead className="font-semibold text-sm hidden sm:table-cell">
                Strain
              </TableHead>
              <TableHead className="font-semibold text-sm hidden md:table-cell">
                Ratio
              </TableHead>
              <TableHead className="font-semibold text-sm hidden lg:table-cell">
                Cannabinoids
              </TableHead>
              <TableHead className="text-right font-semibold text-sm w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.map((plant) => {
              const ratio = getStrainRatio(plant);
              const cannabinoids = getCannabinoidLevels(plant);

              return (
                <TableRow key={plant.id} className="hover:bg-muted/30">
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-base font-medium">
                        {plant.customName}
                      </span>
                      <div className="sm:hidden text-xs text-muted-foreground mt-1 space-y-1">
                        {plant.strain && <div>{plant.strain.name}</div>}
                        <div className="flex items-center gap-1.5">
                          <Sun className="size-3.5 text-emerald-600" />
                          {ratio.sativa}%
                          <span className="text-muted-foreground">/</span>
                          <Moon className="size-3.5 text-purple-600" />
                          {ratio.indica}%
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {renderStageBadge(plant)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-3 font-normal">
                    {plant.strain?.name || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-600 font-normal">
                        {ratio.sativa}% Sativa
                      </span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-purple-600 font-normal">
                        {ratio.indica}% Indica
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <Zap className="size-3.5 text-amber-500" />
                        <span className="text-xs font-normal w-8">THC</span>
                        {renderStrengthIndicator(cannabinoids.thc)}
                        <span className="text-xs ml-1.5">
                          {cannabinoids.thc}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Droplets className="size-3.5 text-blue-500" />
                        <span className="text-xs font-normal w-8">CBD</span>
                        {renderStrengthIndicator(cannabinoids.cbd, 15)}
                        <span className="text-xs ml-1.5">
                          {cannabinoids.cbd}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <div className="flex justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewDetails(plant)}
                              className="size-8 rounded-full hover:bg-muted"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEditPlant(plant)}
                              className="size-8 rounded-full hover:bg-muted"
                            >
                              <Edit className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Plant</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full hover:bg-muted"
                          >
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeletePlant(plant)}
                          >
                            <Trash2 className="size-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!plantToDelete}
        onOpenChange={(open) => !open && setPlantToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {plantToDelete?.customName} from your
              grow. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
