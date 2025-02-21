# User Stories - Indoor Grow Tracking App

This document outlines the core user stories for an indoor cannabis grow tracking application, focusing on multi-user collaboration, task logging, analytics, and optional advanced features.

---

## 1. Indoor Setup

**User Story**

> As a user, I want to **create and configure an indoor environment**, so that I can track and manage the details of my grow space.

**Acceptance Criteria**

- I can **create** a new indoor environment with details (e.g. name, lighting system, ventilation).
- I can **edit** or **delete** an existing indoor environment.
- I can **view a list** of all indoor environments to which I have access.

**Additional Considerations**

- **Multi-user collaboration**:
  - The owner of an indoor environment can invite or assign **collaborators**.
  - Collaborators may have roles/permissions (e.g., owner, editor, read-only).
  - Collaborators can view and create/edit tasks for that indoor environment.

---

## 2. Add Plants to an Indoor

**User Story**

> As a user, I want to **add plants** to an indoor environment, so that I can track each plant’s growth stage and related data.

**Acceptance Criteria**

- I can **select** which indoor environment the new plant(s) belong to.
- I can **enter plant details** (strain, start date, notes, growth stage).
- I can **view** a list of plants in each indoor environment, each showing its current stage.
- I can **edit** or **archive** a plant when it’s harvested or no longer active.

**Additional Considerations**

- Option to track plants **individually** or in **batches**.
- Growth stage changes might be **manual** or **tied** to specific tasks (e.g., “Switch to Flowering Stage” task).

---

## 3. Task Logging (Observations & Actions)

**User Story**

> As a user (or collaborator), I want to **log tasks** like feeding, pruning, or transplanting for one or more plants, so we have a clear history of all grow actions.

**Acceptance Criteria**

1. I can **select a task type** (feeding, pruning, transplant, measurement, etc.) from a predefined list or create a custom type.
2. I can **select one or more plants** within the indoor environment.
3. I can **attach notes** (e.g., nutrient brand, dosage, observations).
4. I can **optionally attach photos** or supporting documents.
5. The task is saved with a **timestamp** and is linked to each selected plant.

**Additional Considerations**

- **Multi-user** scenario: tasks display who performed the action.
- Could incorporate **notifications** (e.g., “John logged a feeding in Indoor A”).

---

## 4. Analytics & Insights

**User Story**

> As a user, I want to **view analytics** about my indoor environment(s) and tasks, so that I can spot trends and optimize my grow.

**Acceptance Criteria**

- A **dashboard** showing summaries or trends (frequency of tasks, time in each growth stage, yield metrics, etc.).
- A **task summary** (e.g., number of feedings per week, total transplants, etc.).
- **Growth stage timeline** to see how long plants spent in each stage.
- (Optional) **Yield tracking** if yield data is recorded at harvest.

**Additional Considerations**

- Compare current grow cycle to previous ones for historical insights.
- Potential for advanced analytics if integrated with external data or future AI features.

---

## 5. E-Commerce Integration (Optional)

**User Story**

> As a user, I want to **discover and purchase** grow-related products directly within the app (seeds, nutrients, equipment), so that I can conveniently manage supplies.

**Acceptance Criteria**

- A **product catalog** is available, displaying relevant products.
- I can **add items to a cart** and proceed to checkout (or be redirected to an external store).
- I can **view purchase history** and reorder frequently used items.

**Additional Considerations**

- **Affiliate partnerships** with seed banks or grow supply brands.
- Could tie into **AI suggestions** based on user data (see below).

---

## 6. AI Assistant Integration (Optional)

**User Story**

> As a user, I want an **AI assistant** that can analyze my logged data and provide real-time advice (e.g., adjusting feed schedules), so I can make better decisions at each stage.

**Acceptance Criteria**

- **Conversational interface**: Users can ask questions about plant health, feeding schedules, etc.
- The AI can **reference grow logs** and tasks to offer context-specific suggestions.
- (Optional) The AI can **auto-generate tasks** (e.g., “Schedule next feeding in 2 days”) if the user confirms.

**Additional Considerations**

- Potential integration with the **e-commerce** module for product recommendations.
- For multi-user environments, the AI could help coordinate tasks among collaborators.

---

## 7. Multi-User Collaboration Emphasis

**User Story**

> As the owner of an indoor environment, I want to **invite other users** to collaborate, so they can help manage the grow by logging tasks and viewing analytics.

**Acceptance Criteria**

- **Invite system**: I can invite users via email or username.
- **Roles/permissions**:
  - **Owner**: Full control, can add/remove collaborators.
  - **Editor**: Can create/edit tasks, plants, and view analytics.
  - (Optional) **Viewer**: Can only view data and analytics.
- **Collaboration** features: tasks indicate which user performed them; collaboration logs or activity feeds.

**Additional Considerations**

- Clear indication of **who** performed or modified each task.
- **Notifications** for key events (e.g., new collaborator added, stage changes).

---

## Summary

1. **Indoor Setup**: Create & manage indoor environments (now multi-user capable).
2. **Add Plants**: Track individual or batch plants within each indoor.
3. **Task Logging**: Record feeding, pruning, transplanting, etc., with optional photos/notes.
4. **Analytics**: Provide dashboards and insights into task frequency, growth stages, yields, etc.
5. **E-Commerce** (optional): Offer a product catalog, checkout flow, and purchasing history.
6. **AI Assistant** (optional): Provide context-aware recommendations and potentially automate task creation.
7. **Multi-User Collaboration**: Enable multiple users to work on the same indoor with assigned roles and responsibilities.

Use these stories to guide **database schema design**, **API endpoints**, and **UI/UX workflows**. Once the core features are in place, integrating advanced modules like e-commerce or AI can further enhance the user experience.
