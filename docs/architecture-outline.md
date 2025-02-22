# High-Level Outline: Database Schema, API Routes, and UI Flow

Current schema is quite comprehensive and covers the main areas of functionality for the application, including:

- **User Management**  
  (with external authentication like Clerk)

- **Indoor & Collaboration**  
  (managing physical spaces and multi-user access)

- **Grow Cycles**  
  (tracking multiple cycles per indoor, with overall stage, dates, and archive status)

- **Strain Library**  
  (a master list of standardized genetic and growth data)

- **Plant Management**  
  (linking plants to grows and optionally overriding grow stage, plus notes)

- **Task Management**  
  (with TaskType metadata, detailed tasks stored via JSON fields, and linking tasks to plants)

- **Product & E-Commerce Integration**  
  (tracking products used in tasks and linking them for cost/usage analysis)

- **Sensor Readings**  
  (optional for capturing environmental data)

## 1. Database Schema Design

### 1.1. User

- **user_id** (text, Primary Key)
- **email** (string, unique)
- **password** or **auth_provider_id** (depending on your authentication approach)
- **created_at**, **updated_at**

> Stores basic user info (or references to external auth like Clerk).

### 1.2. Indoor

- **id** (UUID, Primary Key)
- **name** (string)
- **created_by** (FK to User.user_id)
- **created_at**, **updated_at**

> Represents each physical grow space. The `created_by` field indicates the owner.

### 1.3. IndoorCollaborator

- **id** (UUID, Primary Key)
- **indoor_id** (FK to Indoor.id)
- **user_id** (FK to User.user_id)
- **role** (enum/string: owner, editor, viewer, etc.)
- **created_at**, **updated_at**

> Allows multi-user collaboration, defining roles and permissions for each user in an Indoor.

### 1.4. Grow

- **id** (UUID, Primary Key)
- **indoor_id** (FK to Indoor.id)
- **name** (string)
- **stage** (string; overall stage for the grow, e.g., vegetative, flowering)
- **start_date** (date)
- **end_date** (date)
- **archived** (boolean)
- **created_at**, **updated_at**

> Each grow cycle takes place in a specific Indoor and has its own timeline and overall stage.

### 1.5. Strain

- **id** (UUID, Primary Key)
- **name** (string)
- **breeder** (string)
- **genotype** (string)
- **ratio** (string; e.g., "70% Indica / 30% Sativa")
- **flowering_type** (string; e.g., photoperiod or auto)
- **indoor_veg_time** (string; e.g., "3-4 weeks")
- **indoor_flower_time** (string; e.g., "9 weeks")
- **indoor_yield** (string; e.g., "500 g/m²")
- **outdoor_height** (string; e.g., "1.5-1.7 m")
- **outdoor_yield** (string; e.g., "500+ g/plant")
- **harvest_month_outdoor** (string; e.g., "Mid-October")
- **cannabinoid_profile** (jsonb; e.g., {THC: "29%", CBD: "low"})
- **terpene_profile** (jsonb; e.g., {dominant: ["Myrcene", "Limonene"]})
- **resistance** (jsonb; e.g., {mold: "high", pests: "medium"})
- **optimal_conditions** (jsonb; e.g., {temp: "22-27C", humidity: "40-50%"})
- **difficulty** (string; e.g., Moderate)
- **awards** (string)
- **description** (string)
- **created_at**, **updated_at**

> A master library of strain data for standardized genetic and cultivation information. User-specific Plants reference a Strain.

### 1.6. Plant

- **id** (UUID, Primary Key)
- **grow_id** (FK to Grow.id)
- **strain_id** (FK to Strain.id)
- **custom_name** (string)
- **stage** (string; optional override; if null, defaults to Grow.stage)
- **start_date** (date)
- **archived** (boolean)
- **notes** (text)
- **created_at**, **updated_at**

> Represents actual user plants in a grow. Each Plant inherits the overall stage from its Grow unless explicitly overridden, and references a Strain for lineage.

### 1.7. PlantNote

- **id** (UUID, Primary Key)
- **plant_id** (FK to Plant.id)
- **content** (text)
- **images** (jsonb; array of image objects with URL and caption)
- **created_at**, **updated_at**

> Stores detailed per-plant notes and images.

### 1.8. TaskType

- **id** (text, Primary Key; e.g., "feeding", "harvest")
- **label** (string; human-readable label)
- **icon** (string; icon name or URL)
- **schema** (jsonb; definition of required fields for this task type)
- **created_at**, **updated_at**

> A reference table listing each task category with metadata used to build dynamic forms on the frontend.

### 1.9. Task

- **id** (UUID, Primary Key)
- **task_type_id** (FK to TaskType.id)
- **grow_id** (FK to Grow.id)
- **user_id** (FK to User.user_id)
- **notes** (text)
- **details** (jsonb; stores specialized data such as pH, EC, total liters, etc.)
- **images** (jsonb; array of image objects)
- **created_at**, **updated_at**

> A unified table for logging grow actions or observations (e.g., feeding, transplant, measurement). It references a TaskType and stores additional specialized details.

### 1.10. TaskPlant

- **id** (UUID, Primary Key)
- **task_id** (FK to Task.id)
- **plant_id** (FK to Plant.id)

> A many-to-many join table linking Tasks to multiple Plants affected by that task.

### 1.11. Product

- **id** (UUID, Primary Key)
- **name** (string)
- **brand** (string)
- **category** (string; e.g., nutrient, pesticide, supplement)
- **default_cost** (numeric; default price)
- **description** (text)
- **product_url** (string; link to store or product page)
- **extra_data** (jsonb; any additional data such as dosage)
- **created_at**, **updated_at**

> A master library of products used in grows, supporting product usage analysis and e-commerce integration.

### 1.12. TaskProduct

- **id** (UUID, Primary Key)
- **task_id** (FK to Task.id)
- **product_id** (FK to Product.id)
- **quantity** (numeric; amount used)
- **unit** (string; e.g., L, ml, g)
- **usage_cost** (numeric; cost associated with the usage)
- **created_at**, **updated_at**

> A join table linking a Task to one or more Products, recording how much of each product was used and its associated cost.

### 1.13. SensorReading (Optional)

- **id** (UUID, Primary Key)
- **indoor_id** (FK to Indoor.id)
- **recorded_at** (timestamp)
- **data** (jsonb; stores environmental data, e.g., {temperature: 25.3, humidity: 50, co2: 800, pH: 6.2})

> Captures environmental sensor data for an Indoor, if integrated.

---

## 2. API Routes

### 2.1. Indoor Routes

- **POST** `/api/indoors` — Create a new Indoor.
- **GET** `/api/indoors` — List all Indoors (where user is collaborator or owner).
- **GET** `/api/indoors/:indoorId` — Retrieve details of an Indoor (if the user has access).
- **PATCH** `/api/indoors/:indoorId` — Update Indoor details (for owner/editors).
- **DELETE** `/api/indoors/:indoorId` — Delete or disable an Indoor (for owner).

#### 2.1.1. Collaborator Routes

- **POST** `/api/indoors/:indoorId/collaborators` — Add a collaborator.
- **GET** `/api/indoors/:indoorId/collaborators` — List collaborators.
- **PATCH** `/api/indoors/:indoorId/collaborators/:collaboratorId` — Update collaborator role.
- **DELETE** `/api/indoors/:indoorId/collaborators/:collaboratorId` — Remove a collaborator.

### 2.2. Grow Routes

- **POST** `/api/indoors/:indoorId/grows` — Start a new Grow in an Indoor.
- **GET** `/api/indoors/:indoorId/grows` — List all Grows in an Indoor.
- **GET** `/api/grows/:growId` — Retrieve details of a specific Grow.
- **PATCH** `/api/grows/:growId` — Update Grow details.
- **DELETE** `/api/grows/:growId` — Archive or delete a Grow.

### 2.3. Plant Routes

- **POST** `/api/grows/:growId/plants` — Add new Plant(s) to a Grow.
- **GET** `/api/grows/:growId/plants` — List Plants in a Grow.
- **GET** `/api/plants/:plantId` — Retrieve details of a specific Plant.
- **PATCH** `/api/plants/:plantId` — Update Plant details.
- **DELETE** `/api/plants/:plantId` — Delete or archive a Plant.

### 2.4. Task Routes

- **POST** `/api/grows/:growId/tasks` — Create a new Task.
  - Body includes `task_type_id`, `notes`, `details`, `plantIds`, etc.
- **GET** `/api/grows/:growId/tasks` — List all Tasks for a Grow.
- **GET** `/api/tasks/:taskId` — Retrieve Task details.
- **PATCH** `/api/tasks/:taskId` — Update Task details.
- **DELETE** `/api/tasks/:taskId` — Delete a Task.

### 2.5. Product and Order Routes (Optional E-Commerce)

- **GET** `/api/products` — List or search Products.
- **POST** `/api/orders` — Create a new Order.
- **GET** `/api/orders/:orderId` — Retrieve Order details.

### 2.6. Analytics Routes

- **GET** `/api/indoors/:indoorId/analytics` — Retrieve stats about tasks, yields, product usage, etc.

---

## 3. UI Flow Planning

### 3.1. Indoor Management

1. **Indoor List Page**
   - Displays all Indoors (with a Create Indoor button).
2. **Create/Edit Indoor Page or Modal**
   - Form for Indoor details.
3. **Indoor Detail Page**
   - Shows Indoor info, associated Grow cycles, and quick stats.

### 3.2. Collaborator Management

1. **Collaborator Management Section**
   - Lists current collaborators.
   - Option to invite new collaborators (by email or username, with role selection).

### 3.3. Grow Management

1. **Grow List Page** (within an Indoor)
   - Displays existing Grow cycles.
2. **Create/Edit Grow Page**
   - Form for starting a new Grow, setting start date, stage, etc.
3. **Grow Detail Page**
   - Shows overall Grow info, stage, and linked Plants.

### 3.4. Plant Management

1. **Plant List Page** (within a Grow)
   - Displays Plant cards with custom names, strain info, and stage.
2. **Add/Edit Plant Page**
   - Form for adding or updating Plant details.
3. **Plant Detail Page**
   - Shows Plant info, growth timeline, and associated PlantNotes.

### 3.5. Task Management

1. **Task List Page** (within a Grow or Indoor)
   - Lists Tasks chronologically.
2. **Create Task Flow**
   - User selects a TaskType, and the UI dynamically builds a form based on TaskType.schema.
   - Allows selection of one or more Plants.
   - Supports attaching details (e.g., pH, EC, total liters) and images.
3. **Task Detail Page**
   - Displays Task info, linked Plants (via TaskPlant), and any product usage (via TaskProduct).

### 3.6. Product & E-Commerce Flow (Optional)

1. **Product Catalog Page**
   - Lists Products from the master library.
2. **Task Product Integration**
   - In the Create Task flow (e.g., for feeding), users select Products and specify quantity, unit, and cost.
3. **Order & Checkout Pages**
   - Manage orders if integrating direct purchasing.

### 3.7. Analytics Dashboard

1. **Analytics Page** (per Indoor or Grow)
   - Visualizes charts for task frequency, yield, product usage, cost analysis, etc.
   - Filters by time range, Grow cycle, or TaskType.

### 3.8. AI Assistant

- **Assistant Chat Interface**
  - Users can query logs, schedule tasks, or receive product recommendations based on their data.

---

## 4. Next Steps

1. **Finalize Schema**
   - Confirm required fields, enforce indexing and naming conventions.
2. **Implement API**
   - Build Next.js API routes as outlined.
3. **Build UI**
   - Develop wireframes and UI components for each flow (Indoor, Grow, Plant, Task, Analytics).
4. **Iterate & Expand**
   - Add e-commerce, AI features, or advanced analytics as future enhancements.
