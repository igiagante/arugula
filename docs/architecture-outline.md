# High-Level Outline: Database Schema, API Routes, and UI Flow

## 1. Database Schema Design

### 1.1. `users`

- **user_id** (text, Primary Key)
- **email** (string, unique)
- **password** or **auth_provider_id** (depending on your authentication approach)
- **created_at**, **updated_at**

> Stores basic user info (or references to external auth like Clerk).

### 1.2. `indoors`

- **id** (UUID, PK)
- **name** (string)
- **created_by** (FK to `users.id`)
- **created_at**, **updated_at**

> Represents each indoor environment. `created_by` indicates the owner.

### 1.3. `indoor_collaborators`

- **id** (UUID, PK)
- **indoor_id** (FK to `indoors.id`)
- **user_id** (FK to `users.id`)
- **role** (enum/string: `owner`, `editor`, `viewer`, etc.)
- **created_at**, **updated_at**

> Allows multi-user collaboration. Defines roles and permissions for each user in an indoor.

### 1.4. `plants`

- **id** (UUID, PK)
- **indoor_id** (FK to `indoors.id`)
- **name** (string)
- **strain** (string)
- **stage** (string or enum: `seedling`, `veg`, `flower`, `harvested`, etc.)
- **start_date** (date)
- **archived** (boolean)
- **created_at**, **updated_at**

> Each plant (or batch) belongs to a single indoor. `stage` indicates its current growth phase.

### 1.5. `tasks`

- **id** (UUID, PK)
- **indoor_id** (FK to `indoors.id`)
- **user_id** (FK to `users.id`) — who performed/logged the task
- **type** (string or enum: `feeding`, `pruning`, `transplant`, `measurement`, etc.)
- **notes** (text)
- **created_at**, **updated_at**

> Logs all grow actions or observations (e.g., feeding schedules, pruning details).

### 1.6. `task_plants`

- **id** (UUID, PK)
- **task_id** (FK to `tasks.id`)
- **plant_id** (FK to `plants.id`)

> Many-to-many link for tasks that apply to multiple plants.

---

## 2. API Routes

### 2.1. Indoor Routes

- **POST** `/api/indoors` — create a new indoor environment
- **GET** `/api/indoors` — list all indoor environments (where user is collaborator or owner)
- **GET** `/api/indoors/:indoorId` — retrieve details if user has access
- **PATCH** `/api/indoors/:indoorId` — update indoor details (owner/editors)
- **DELETE** `/api/indoors/:indoorId` — delete/disable if owner

#### 2.1.1. Collaborators

- **POST** `/api/indoors/:indoorId/collaborators`
- **GET** `/api/indoors/:indoorId/collaborators`
- **PATCH** `/api/indoors/:indoorId/collaborators/:collaboratorId`
- **DELETE** `/api/indoors/:indoorId/collaborators/:collaboratorId`

### 2.2. Plant Routes

- **POST** `/api/indoors/:indoorId/plants` — create new plant(s)
- **GET** `/api/indoors/:indoorId/plants` — list plants in that indoor
- **GET** `/api/plants/:plantId`
- **PATCH** `/api/plants/:plantId`
- **DELETE** `/api/plants/:plantId` (or archive)

### 2.3. Task Routes

- **POST** `/api/indoors/:indoorId/tasks` — create a task
  - body includes `type`, `notes`, `plantIds`
- **GET** `/api/indoors/:indoorId/tasks` — list all tasks for an indoor
- **GET** `/api/tasks/:taskId`
- **PATCH** `/api/tasks/:taskId`
- **DELETE** `/api/tasks/:taskId`

### 2.4. Analytics Routes

- **GET** `/api/indoors/:indoorId/analytics`
  - returns stats about tasks, stages, yields, etc.

### 2.5. (Optional) E-Commerce Routes

- **GET** `/api/products` — list/search products
- **POST** `/api/orders` — create an order
- **GET** `/api/orders/:orderId` — view order details

---

## 3. UI Flow Planning

### 3.1. Indoor Management

1. **Indoor List Page**
   - Shows all indoor environments (with Create Indoor button).
2. **Create/Edit Indoor** (Modal or Page)
   - Name, description, etc.
3. **Indoor Detail Page**
   - Displays name, list of plants, and quick stats.

### 3.2. Collaborators Flow

1. **Collaborator Management**
   - Lists existing collaborators.
   - Invite new collaborator (email/username, role).
   - Edit or remove collaborator.

### 3.3. Plants

1. **Plant List** (within an Indoor)
   - Plant cards showing name, strain, stage.
2. **Add/Edit Plant** (Modal or Page)
3. **Plant Detail Page**
   - Task history, growth timeline, notes, photos.

### 3.4. Tasks

1. **Task List** (could be in Indoor detail or separate)
2. **Create Task** Flow
   - Select task type, assign to plants, add notes/photos.
3. **Task Detail**
   - Show linked plants, who performed it, timestamp.

### 3.5. Analytics Dashboard

1. **Analytics Page** per Indoor
   - Charts (task frequency, stage durations, yield, etc.).
   - Possibly filter by time range, plant, or task type.

### 3.6. (Optional) E-Commerce

- **Shop** (product listing)
- **Cart & Checkout**
- **Order History**

### 3.7. (Optional) AI Assistant

- **Assistant Chat**
  - Query logs, tasks, suggest scheduling
  - Possibly integrate product recommendations

---

## 4. Next Steps

1. **Finalize Schema**
   - Confirm required fields, indexing, naming conventions.
2. **Implement API**
   - Choose framework (Express, Nest, tRPC, etc.) and authentication (JWT, Clerk).
3. **Build UI**
   - Wireframes for each flow (indoors, plants, tasks, analytics).
4. **Iterate & Expand**
   - Add e-commerce, AI features, or advanced analytics as future enhancements.
