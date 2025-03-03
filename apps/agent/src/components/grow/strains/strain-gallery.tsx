import { apiRequest, HttpMethods } from "@/app/api/client";
import { CreateStrainDto } from "@/app/api/dto";
import { CacheTags } from "@/app/api/tags";
import { uploadImages } from "@/app/utils/s3/s3-upload";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Check, Plus, Ruler, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createStrainSchema, StrainFormValues } from "../schema";
import { AddStrainForm } from "./add-strain-form";
import { StrainCard } from "./strain-card";
import { StrainGallerySkeleton } from "./strain-gallery-skeleton";
import { StrainWithProfiles } from "./strain-types";

export const FloweringType = {
  photoperiod: "photoperiod",
  autoflower: "autoflower",
} as const;

export type FloweringType = (typeof FloweringType)[keyof typeof FloweringType];

export const StrainType = {
  indica: "indica",
  sativa: "sativa",
  hybrid: "hybrid",
} as const;

export type StrainType = (typeof StrainType)[keyof typeof StrainType];

type SelectedStrain = {
  strainId: string;
  strain: string;
  plants: number;
};

interface StrainGalleryProps {
  onStrainsChange: (strains: SelectedStrain[]) => void;
  existingStrains?: {
    strainId: string;
    strain: string;
    plants: number;
    plantsIds?: string[];
  }[];
}

export function StrainGallery({
  onStrainsChange,
  existingStrains,
}: StrainGalleryProps) {
  const [selectedStrains, setSelectedStrains] = useState<StrainWithProfiles[]>(
    []
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [strainCounts, setStrainCounts] = useState<Record<string, number>>({});
  const router = useRouter();

  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: [CacheTags.strains],
    queryFn: async () => {
      return await apiRequest<StrainWithProfiles[]>("/api/strains");
    },
  });

  // Initialize selected strains and counts from existing data
  useEffect(() => {
    if (existingStrains && data) {
      // Reset selected strains and counts - don't initialize with existing strains
      setSelectedStrains([]);
      setStrainCounts({});
    }
  }, [existingStrains, data]);

  const { mutateAsync: createStrain } = useMutation({
    mutationFn: async (newStrain: CreateStrainDto) => {
      return await apiRequest<StrainWithProfiles, CreateStrainDto>(
        "/api/strains",
        {
          method: HttpMethods.POST,
          body: newStrain,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheTags.strains] });
    },
  });

  const strainForm = useForm<StrainFormValues>({
    resolver: zodResolver(createStrainSchema),
    defaultValues: {
      name: "1024",
      breeder: "MedicalSeeds",
      genotype: "Top secret",
      ratio: "70% Sativa / 30% Indica",
      sativaPercentage: 50,
      indicaPercentage: 50,
      floweringType: FloweringType.photoperiod,
      type: StrainType.hybrid,
      cannabinoidProfile: { thc: "alto", cbd: "bajo" },

      indoorVegTime: "4 weeks",
      indoorFlowerTime: "11-13 weeks",
      indoorYield: "500 g/m²",
      indoorHeight: "100-120 cm",
      outdoorHeight: "3 m",
      outdoorYield: "600 g/plant",
      terpeneProfile: "Myrcene, Limonene, Caryophyllene",
      awards: "Multiple Cannabis Cup Awards",
      description:
        "A potent strain known for its strong effects and high yields, ideal for experienced growers.",
    },
    mode: "onChange",
  });

  const mapSelectedStrains = (
    strains: StrainWithProfiles[],
    counts: Record<string, number>
  ): SelectedStrain[] => {
    return strains.map((strain) => ({
      strainId: strain.id,
      strain: strain.name,
      plants: counts[strain.id] || 1,
    }));
  };

  const handleSelectStrain = (strain: StrainWithProfiles) => {
    setSelectedStrains((prev) => {
      const isAlreadySelected = prev.some((p) => p.id === strain.id);
      const newCounts = { ...strainCounts };
      const newStrains = isAlreadySelected
        ? prev.filter((p) => p.id !== strain.id)
        : [...prev, strain];

      if (isAlreadySelected) {
        delete newCounts[strain.id];
      } else {
        newCounts[strain.id] = 1;
      }

      setStrainCounts(newCounts);
      onStrainsChange(mapSelectedStrains(newStrains, newCounts));
      return newStrains;
    });
  };

  const handleStrainCountChange = (strainId: string, count: number) => {
    const safeCount = Math.max(1, count);
    setStrainCounts((prev) => {
      const newCounts = { ...prev, [strainId]: safeCount };
      onStrainsChange(mapSelectedStrains(selectedStrains, newCounts));
      return newCounts;
    });
  };

  async function onSubmit(data: StrainFormValues) {
    try {
      if (!userId) {
        throw new Error("User not found");
      }

      // Add a type assertion to tell TypeScript that images can be mixed types
      const fileObjects = ((data.images || []) as (string | File)[]).filter(
        (img): img is File => typeof img === "object" && img instanceof File
      );

      // Upload images
      let uploadedImageUrls: string[] = [];
      if (fileObjects.length > 0) {
        uploadedImageUrls = await uploadImages(fileObjects);
      }

      const strainDto: CreateStrainDto = {
        ...data,
        images: uploadedImageUrls || [],
        cannabinoidProfile: data.cannabinoidProfile || {},
        terpeneProfile: data.terpeneProfile || "",
        indoorVegTime: data.indoorVegTime || "",
        indoorFlowerTime: data.indoorFlowerTime || "",
        indoorYield: data.indoorYield || "",
        indoorHeight: data.indoorHeight || "",
        outdoorHeight: data.outdoorHeight || "",
        outdoorYield: data.outdoorYield || "",
        awards: data.awards || "",
        description: data.description || "",
      };

      await createStrain(strainDto);
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) {
    return <StrainGallerySkeleton />;
  }

  if (error) {
    toast.error("Error loading grows", {
      description: error.message,
    });
    return null;
  }

  return (
    <div className="p-2 max-w-full mx-auto">
      <div className="flex justify-end">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 rounded-md shadow-md transition-all duration-300 mb-4 ${
            showAddForm
              ? "bg-gray-700 hover:bg-gray-700 text-white"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
          aria-label={
            showAddForm ? "Close add strain form" : "Open add strain form"
          }
        >
          <span className="font-medium">
            {showAddForm ? "Cancel" : "Add Strain"}
          </span>
          <div
            className={`transform transition-transform duration-300 ${showAddForm ? "rotate-45" : ""}`}
          >
            <Plus className={`size-5 ${showAddForm ? "" : "animate-pulse"}`} />
          </div>
        </Button>
      </div>

      {showAddForm && (
        <AddStrainForm
          form={strainForm}
          onCancel={() => setShowAddForm(false)}
          onSubmit={onSubmit}
        />
      )}

      <div className="flex flex-nowrap overflow-x-auto gap-4 p-4">
        {(data || []).map((strain) => (
          <div className="flex-none w-64" key={strain.id}>
            <StrainCard
              strain={strain}
              isSelected={selectedStrains.some((p) => p.id === strain.id)}
              onSelect={handleSelectStrain}
            />
          </div>
        ))}
      </div>

      {selectedStrains.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-4">
              Selected Strains ({selectedStrains.length})
            </h3>

            <div className="flex overflow-x-auto gap-3 pb-2">
              {selectedStrains.map((strain) => (
                <div
                  key={strain.id}
                  className="flex-none w-48 bg-white p-2 rounded border border-gray-200 relative"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Check className="size-3 text-green-500" />
                    <span className="font-medium text-sm truncate">
                      {strain.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Ruler className="size-3" />
                      <span>{strain.indoorHeight}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sun className="size-3" />
                      <span>{strain.indoorFlowerTime}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 text-xs text-gray-600 items-baseline">
                    <div className="size-3 flex font-bold">g</div>
                    <span>{strain.indoorYield}</span>
                  </div>
                  <div className="absolute right-2 bottom-2 z-20 flex items-center bg-gray-100 border border-gray-200 rounded-md shadow-sm text-xs">
                    <button
                      className="px-1.5 py-0.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none rounded-l-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStrainCountChange(
                          strain.id,
                          Math.max(1, (strainCounts[strain.id] || 1) - 1)
                        );
                      }}
                      disabled={(strainCounts[strain.id] || 1) <= 1}
                      type="button"
                    >
                      -
                    </button>
                    <span className="px-1.5 min-w-[20px] text-center font-medium border-x border-gray-200">
                      {strainCounts[strain.id] || 1}
                    </span>
                    <button
                      className="px-1.5 py-0.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none rounded-r-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStrainCountChange(
                          strain.id,
                          (strainCounts[strain.id] || 1) + 1
                        );
                      }}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedStrains.length === 0 && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 border-dashed rounded-lg text-center">
          <p className="text-gray-500">
            No strains selected yet. Click on cards above to select strains.
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
        <p className="font-medium text-blue-800 mb-1">Grow Summary</p>
        <div className="text-xs space-y-2 text-blue-700">
          <p>
            Total plants to add:{" "}
            {Object.values(strainCounts).reduce((sum, count) => sum + count, 0)}
          </p>
          <p>Total strains to add: {selectedStrains.length}</p>
        </div>
      </div>

      {existingStrains && existingStrains.length > 0 && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md space-y-2">
          <p className="text-amber-800 text-sm">
            This grow has{" "}
            {existingStrains.reduce((sum, strain) => sum + strain.plants, 0)}{" "}
            existing plants. To remove plants, please visit the{" "}
            <button
              onClick={() => router.push("./plants")}
              className="text-amber-900 font-medium underline hover:text-amber-700"
            >
              plants section
            </button>
            .
          </p>
          <div className="flex flex-wrap gap-2">
            {existingStrains.map((existingStrain) => {
              const strain = data?.find(
                (s) => s.id === existingStrain.strainId
              );
              if (!strain) return null;
              return (
                <div
                  key={strain.id}
                  className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded-full flex items-center gap-1.5"
                >
                  <span className="font-medium">{strain.name}</span>
                  <span className="bg-amber-200 px-1.5 py-0.5 rounded-full">
                    {existingStrain.plants}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
