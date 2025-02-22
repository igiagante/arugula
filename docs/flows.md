# Putting It All Together

1. **Indoor**

   - Represents the physical grow space (tent, room, greenhouse).
   - Can have collaborators if multiple users manage the same space.

2. **Grow**

   - Each grow cycle takes place in a specific indoor.
   - Stores start/end dates and an archived flag when finished.
   - Holds the overall stage of the grow (e.g., vegetative, flowering).

3. **Strain**

   - A library of breed/genetic data (THC%, flowering time, breeder info, etc.).
   - User-specific plants reference a strain for standardized lineage information.

4. **Plant**

   - Actual user plants in a given grow.
   - References a strain for lineage info and a grow for time-bound context.
   - Can be archived (e.g., after harvest).
   - Optionally, detailed per-plant notes or images can be stored in a separate PlantNote table.

5. **TaskType**

   - A reference table listing each task category (e.g., "feeding", "harvest") with metadata such as an icon and required fields.

6. **Task**

   - A unified table for actions or observations (feeding, transplant, measurement, etc.).
   - References a TaskType via taskTypeId.
   - Stores additional details (as JSON) for specialized data (e.g., pH, EC) and includes an images (JSON) field for photos.

7. **TaskPlant**

   - A many-to-many join table that allows a single task (e.g., feeding) to apply to multiple plants.
   - Captures data such as the quantity used and the usage cost for each product involved in the task.

8. **Product**

   - A master library of products (e.g., nutrients, pesticides, supplements).
   - Contains key details like name, brand, category, default cost, and description.
   - Enables analysis of product usage and supports e-commerce integrations.

9. **TaskProduct**

   - A join table linking a task to one or more products.
   - Records how much of each product was used (quantity, unit) and the cost associated with its usage.
   - Helps track overall product consumption and spending per grow cycle.

10. **SensorReading** (Optional)
    - Captures environmental data (temperature, humidity, etc.) for an indoor if IoT devices are integrated.

---

## Example Lifecycle

1. User creates an Indoor record (e.g., "4x4 Tent in Garage").
2. User starts a Grow in that Indoor (e.g., "Spring 2026 Cycle").
3. User adds multiple Plants to the Grow, each referencing a Strain and optionally assigning custom names.
4. User logs Tasks (such as feeding or measurement) using the relevant TaskType, attaching details (e.g., pH, EC, total liters) and images.
5. Tasks are linked to the affected Plants via the TaskPlant join table.
6. For tasks involving products (like a feeding), the user selects one or more Products from the master library; usage details (quantity, unit, cost) are recorded in TaskProduct.
7. (Optional) SensorReadings are collected if IoT devices are present.
8. Once the grow finishes, the Grow is archived.
9. The user can then start a new Grow in the same Indoor in the following season.

This design provides a flexible, scalable structure:

- Multiple grow cycles per Indoor.
- A strain library with standardized genetic data.
- Task metadata stored in TaskType, while Tasks handle specialized details and images.
- TaskPlant enables bulk actions across multiple plants.
- Product and TaskProduct enable detailed tracking of product usage, supporting cost analysis and e-commerce opportunities.
- Everything ties neatly into the user’s environment and timeline.
