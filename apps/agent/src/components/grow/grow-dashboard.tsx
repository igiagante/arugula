import Link from "next/link";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";
import { GrowCard } from "./grow-card";
import { GrowView } from "@/lib/db/queries/types/grow";

const growsData = [
  {
    id: 1,
    name: "Spring 2026 Cycle",
    stage: "Flowering",
    environment: {
      light: "600W LED",
      temp: "75°F",
      humidity: "45%",
    },
    strains: [
      {
        name: "Blue Dream",
        count: 3,
        type: "Hybrid • 70/30",
        thc: "18-24%",
        cbd: "0.1-0.2%",
      },
      {
        name: "Wedding Cake",
        count: 2,
        type: "Indica • 80/20",
        thc: "22-25%",
        cbd: "0.1%",
      },
    ],
    progress: 65,
    lastUpdated: "2h ago",
    image:
      "https://kzmldmf02xim38b47rcg.lite.vusercontent.net/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    name: "Winter Autoflower Run",
    stage: "Vegetative",
    environment: {
      light: "400W LED",
      temp: "72°F",
      humidity: "60%",
    },
    strains: [
      {
        name: "Northern Lights Auto",
        count: 2,
        type: "Indica • 90/10",
        thc: "16-21%",
        cbd: "0.1%",
      },
      {
        name: "Critical Mass CBD",
        count: 1,
        type: "Hybrid • 50/50",
        thc: "5-8%",
        cbd: "8-12%",
      },
    ],
    progress: 30,
    lastUpdated: "4h ago",
    image:
      "https://kzmldmf02xim38b47rcg.lite.vusercontent.net/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    name: "Fall 2025 Harvest",
    stage: "Completed",
    environment: {
      light: "600W LED",
      temp: "73°F",
      humidity: "50%",
    },
    strains: [
      {
        name: "Girl Scout Cookies",
        count: 2,
        type: "Hybrid • 60/40",
        thc: "19-23%",
        cbd: "0.2%",
      },
      {
        name: "Purple Punch",
        count: 2,
        type: "Indica • 85/15",
        thc: "20-24%",
        cbd: "0.1%",
      },
    ],
    progress: 100,
    lastUpdated: "2d ago",
    yield: "16 oz",
    image:
      "https://kzmldmf02xim38b47rcg.lite.vusercontent.net/placeholder.svg?height=400&width=600",
  },
];

export async function GrowDashboardContent({ grows }: { grows: GrowView[] }) {
  const growsMixed = [...grows, ...growsData];

  return (
    <div className="flex flex-col w-full">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/60 px-6 backdrop-blur-lg">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Grow Dashboard</h1>
          <Button asChild>
            <Link href="/grow/new">New Grow</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {growsMixed.map((grow) => (
            <GrowCard
              key={grow.id}
              {...grow}
              lastUpdated={grow.lastUpdated.toLocaleString()}
              image={
                grow.image ??
                "https://kzmldmf02xim38b47rcg.lite.vusercontent.net/placeholder.svg?height=400&width=600"
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
