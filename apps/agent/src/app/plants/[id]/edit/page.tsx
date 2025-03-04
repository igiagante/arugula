import { PlantForm } from "@/components/plants/plant-form";

// Mock data for demo purposes
const mockPlant = {
  id: "plant1",
  customName: "Girl Scout Cookies #1",
  stage: "flowering",
  strain: "Girl Scout Cookies",
  potSize: "7.5L",
  notes:
    "This plant has been showing excellent growth in the vegetative stage. The leaves are a vibrant green color and the structure is developing well.",
  imageUrl: "/placeholder.svg?height=400&width=600",
  images: [
    {
      id: "img1",
      url: "/placeholder.svg?height=400&width=600",
      isPrimary: true,
      createdAt: "2023-04-15T10:30:00Z",
    },
    {
      id: "img2",
      url: "/placeholder.svg?height=400&width=600",
      isPrimary: false,
      createdAt: "2023-04-16T10:30:00Z",
    },
    {
      id: "img3",
      url: "/placeholder.svg?height=400&width=600",
      isPrimary: false,
      createdAt: "2023-04-17T10:30:00Z",
    },
  ],
  createdAt: "2023-04-15T10:30:00Z",
};

export default function EditPlantPage() {
  // In a real app, you would fetch the plant data based on the ID
  // For this demo, we'll use mock data

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 md:px-6">
      <PlantForm plant={mockPlant} isEditing={true} />
    </div>
  );
}
