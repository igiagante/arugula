import { PlantWithStrain } from "@/lib/db/queries/types/plant";
import { Calendar, Clock, Droplet, Info, Leaf, Ruler } from "lucide-react";

export default function PlantDetails({ plant }: { plant: PlantWithStrain }) {
  return (
    <div className="max-w-3xl mx-auto rounded-lg overflow-hidden shadow-md bg-white">
      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Info className="size-5 mr-2 text-green-600" />
          Plant Details
        </h2>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Name</div>
              <div className="font-semibold text-gray-800">
                {plant.customName}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Stage</div>
              <div className="font-semibold text-green-600">{plant.stage}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Strain</div>
              <div className="font-semibold text-gray-800">
                {plant.strain?.name}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Pot Size</div>
              <div className="font-semibold text-gray-800">{plant.potSize}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Added</div>
              <div className="font-semibold text-gray-800 flex items-center">
                <Calendar className="size-4 mr-1 text-green-600" />
                {new Date(plant.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Leaf className="size-5 mr-2 text-green-600" />
          Growth Statistics
        </h2>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">
                Days in current stage
              </div>
              <div className="font-semibold text-gray-800 flex items-center">
                <Clock className="size-4 mr-1 text-green-600" />
                15
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Total age</div>
              <div className="font-semibold text-gray-800">45 days</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Height</div>
              <div className="font-semibold text-gray-800 flex items-center">
                <Ruler className="size-4 mr-1 text-green-600" />
                24 cm
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Last watered</div>
              <div className="font-semibold text-gray-800 flex items-center">
                <Droplet className="size-4 mr-1 text-blue-500" />2 days ago
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Notes</h2>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-gray-700">
            This plant has been showing excellent growth in the vegetative
            stage. The leaves are a vibrant green color and the structure is
            developing well. Planning to switch to flowering stage in about 1
            week.
          </p>
        </div>

        {/* Visual Growth Indicator */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Growth Progress</span>
            <span>45 days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
