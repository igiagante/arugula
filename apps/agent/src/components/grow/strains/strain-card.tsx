"use client";

import { Check, FlaskConical, Leaf, Ruler, Sun, User } from "lucide-react";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

import { Strain } from "@/lib/db/schema";
import { MockImage } from "./mock-image";
import { getTerpeneIcon } from "./terpenes-icons";

import Image from "next/image";
import { useState } from "react";

// Define the cannabinoid profile type
interface CannabinoidProfile {
  thc?: string;
  cbd?: string;
  [key: string]: string | undefined;
}

// Extend the Strain type to include the properly typed cannabinoidProfile
interface StrainWithProfiles extends Omit<Strain, "cannabinoidProfile"> {
  cannabinoidProfile?: CannabinoidProfile;
}

interface StrainCardProps {
  strain: StrainWithProfiles;
  isSelected?: boolean;
  onSelect?: (strain: StrainWithProfiles) => void;
  className?: string;
}

export function StrainCard({
  strain,
  isSelected,
  onSelect,
  className,
}: StrainCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-md hover:scale-[1.02]",
        isSelected ? "border-blue-500 bg-blue-50 shadow-lg" : "border-gray-200",

        className
      )}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect?.(strain);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(strain);
          }
        }}
        className="absolute inset-0 z-10 focus-visible:outline-none cursor-pointer"
        aria-pressed={isSelected}
      >
        <span className="sr-only">
          {isSelected ? `Deselect ${strain.name}` : `Select ${strain.name}`}
        </span>
      </div>

      <CardHeader className="relative aspect-square p-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          {strain.images?.[0] && !imageError ? (
            <Image
              src={strain.images[0]}
              alt={strain.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                "group-hover:scale-105"
              )}
              onError={() => setImageError(true)}
            />
          ) : (
            <MockImage
              _src="/api/placeholder/400/320"
              alt={strain.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                "group-hover:scale-105"
              )}
            />
          )}
        </div>

        {isSelected && (
          <div className="absolute right-3 top-3 z-20 rounded-full bg-blue-500 text-white shadow-md p-1.5 transition-all duration-300">
            <Check className="size-4" />
          </div>
        )}

        {strain.cannabinoidProfile?.thc && (
          <div className="absolute left-3 bottom-3 z-20 flex gap-2">
            <span className="bg-black/70 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm flex items-center gap-1">
              <FlaskConical className="size-3" /> THC:{" "}
              {strain.cannabinoidProfile?.thc}
            </span>
            {strain.cannabinoidProfile?.cbd && (
              <span className="bg-black/70 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm flex items-center gap-1">
                <FlaskConical className="size-3" /> CBD:{" "}
                {strain.cannabinoidProfile?.cbd}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-base leading-tight mb-1">
              {strain.name}
            </h3>
            {strain.breeder && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <User className="size-3.5" />
                {strain.breeder}
              </p>
            )}
          </div>

          {strain.ratio && (
            <div className="text-xs bg-gray-100 rounded-md px-2 py-1.5 text-gray-700 flex items-center gap-1.5">
              <Leaf className="size-3.5" />
              {strain.ratio}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {strain.indoorHeight && (
              <div className="flex items-center gap-1.5">
                <Ruler className="size-3.5" />
                <span>{strain.indoorHeight}</span>
              </div>
            )}

            {strain.indoorFlowerTime && (
              <div className="flex items-center gap-1.5">
                <Sun className="size-3.5" />
                <span>{strain.indoorFlowerTime}</span>
              </div>
            )}
          </div>

          {strain.indoorYield && (
            <div className="flex gap-1.5 text-xs text-gray-600 items-baseline">
              <div className="size-3 flex font-bold">g</div>
              <span>{strain.indoorYield}</span>
            </div>
          )}

          {strain.terpeneProfile && (
            <div className="flex items-center gap-1.5 col-span-2">
              <div className="flex gap-1">
                {strain.terpeneProfile.split(",").map((terpene, index) => (
                  <span key={index} title={terpene.trim()}>
                    {getTerpeneIcon(terpene)}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 truncate">Terpenes</span>
            </div>
          )}

          {isSelected && (
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse mx-auto" />
          )}
        </div>
      </CardContent>

      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500/25 rounded-lg pointer-events-none" />
      )}
    </Card>
  );
}
