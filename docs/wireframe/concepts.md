# Wireframes & UI Components for the Unified Grow Dashboard

## Wireframe Concepts

Imagine the dashboard as a single-page view that provides an at-a-glance summary of all active grow cycles. Here’s a rough sketch of how it might be organized:

+---------------------------------------------------+
| Top Navigation |
| [Logo] Dashboard New Grow Orders Profile |
+---------------------------------------------------+
| Grow Dashboard |
+---------------------------------------------------+
| Grow Card #1: |
| ┌─────────────────────────────────────────────┐ |
| │ Grow Name: "Spring 2026 Cycle" │ |
| │ Stage: Vegetative │ |
| │ Indoor: "4x4 Tent in Garage" │ |
| │ Plants: 5 (2 flowering, 3 veg) │ |
| │ Yield (if available): 350g per plant │ |
| │ [View Details] [Edit] [Archive] │ |
| └─────────────────────────────────────────────┘ |
| |
| Grow Card #2: |
| ┌─────────────────────────────────────────────┐ |
| │ Grow Name: "Summer 2026 Cycle" │ |
| │ Stage: Flowering │ |
| │ Indoor: "4x4 Tent in Garage" │ |
| │ Plants: 6 (3 flowering, 3 veg) │ |
| │ Yield: 400g per plant │ |
| │ [View Details] [Edit] [Archive] │ |
| └─────────────────────────────────────────────┘ |
+---------------------------------------------------+

## Detailed Grow Detail View (upon clicking "View Details")

+---------------------------------------------------+
| Grow Detail: "Spring 2026 Cycle" |
+---------------------------------------------------+
| Indoor Environment |
| - Name: 4x4 Tent in Garage |
| - Lighting: 600W LED |
| - Ventilation: Inline fan + filter |
| - Recommended Conditions: {temp: 20-26C, ...} |
+---------------------------------------------------+
| Plants |
| [Plant Card] "My Test Plant #1" - Seedling |
| [Plant Card] "My Test Plant #2" - Vegetative |
| ... |
+---------------------------------------------------+
| Recent Tasks |
| - Feeding: pH:6.2, EC:1.8, 3.0L |
| - Pruning: Removed 10cm of growth |
| ... |
+---------------------------------------------------+
| Analytics Summary |
| - Total Plants: 5 |
| - Average Yield: 350g/plant |
| - Cost of Nutrients: $XX |
+---------------------------------------------------+
| Actions: [Add Plant] [Log Task] [View Full Analytics] |
+---------------------------------------------------+

---

# UI Components & Code

Based on these wireframes, you might break down the dashboard into several components:

1. **Navigation Component:**  
   Contains the top navigation bar and sidebar with minimal options.

2. **GrowCard Component:**  
   Displays summary information for each grow cycle, including indoor details, plant counts, yield, and quick action buttons.

3. **GrowDashboard Component:**  
   The main container that fetches the list of grows and renders GrowCard components.

4. **GrowDetail Component:**  
   Displays detailed information about a selected grow, including indoor environment details, plant list, tasks, and analytics.

Below is an example using React (with TypeScript and, for instance, React Query for data fetching).

---

## Example: GrowCard Component

```tsx
// components/GrowCard.tsx
import React from "react";
import { Grow } from "@/lib/db/schemas"; // Adjust path to your type

interface GrowCardProps {
  grow: Grow;
  onViewDetails: (growId: string) => void;
  onEdit: (growId: string) => void;
  onArchive: (growId: string) => void;
}

const GrowCard: React.FC<GrowCardProps> = ({
  grow,
  onViewDetails,
  onEdit,
  onArchive,
}) => {
  return (
    <div className="grow-card border p-4 rounded shadow-sm">
      <h3 className="text-xl font-semibold">{grow.name || "Unnamed Grow"}</h3>
      <p>Stage: {grow.stage}</p>
      <p>Indoor: {grow.indoorName || "Unknown"}</p>
      <p>
        Plants: {grow.plantCount ?? 0}{" "}
        {grow.plantCount && grow.plantCount > 0
          ? `(e.g., ${grow.yieldPerPlant}g/plant)`
          : ""}
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onViewDetails(grow.id)}
          className="btn btn-primary"
        >
          View Details
        </button>
        <button onClick={() => onEdit(grow.id)} className="btn btn-secondary">
          Edit
        </button>
        <button onClick={() => onArchive(grow.id)} className="btn btn-warning">
          Archive
        </button>
      </div>
    </div>
  );
};

export default GrowCard;
```
