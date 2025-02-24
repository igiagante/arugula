# Project Roadmap & Milestones

This document outlines the overall plan and milestones for our cannabis grow tracking and conversational e-commerce application. The approach combines a solid data layer with both traditional UI and AI-driven conversational interfaces for various aspects of the grow lifecycle and purchasing process.

---

## 1. Data Layer Overview

Our data layer covers the main entities and relationships needed for the application:

- **User Management**

  - External authentication via Clerk.
  - The User table stores basic user info (e.g., user_id, email).

- **Indoor & Collaboration**

  - **Indoor:** Represents the physical grow space (tent, room, greenhouse) with details (name, location, dimensions, lighting, ventilation, recommended conditions).
  - **IndoorCollaborator:** Enables multi-user access with defined roles (owner, editor, viewer).

- **Grow Cycles**

  - **Grow:** Each grow cycle takes place within an Indoor.
  - Includes fields like name, stage, startDate, endDate, and additional setup details (substrate composition, pot size, growing method).
  - Now includes a `userId` for direct association with a User.

- **Strain Library**

  - **Strain:** A master list of standardized genetic and growth data (e.g., name, breeder, genotype, ratio, floweringType, yields, cannabinoid profile, terpene profile, etc.).
  - Example: The "1024" strain from MedicalSeeds.

- **Plant Management**

  - **Plant:** Actual user plants in a Grow, referencing a Strain for lineage and a Grow for context.
  - Contains fields like customName, stage (with an optional override at the plant level), startDate, notes, and optionally potSize.

- **Task Management**

  - **TaskType:** Defines task categories (e.g., feeding, transplant) along with metadata (label, icon, schema for required fields).
  - **Task:** Logs actions or observations (e.g., feeding, pruning, measurements) with details (stored as JSON) and images.
  - **TaskPlant:** Many-to-many join linking tasks to multiple plants.
  - **TaskProduct:** (For product usage) Links tasks to products with usage details (quantity, unit, cost).

- **Product & E-Commerce Integration**

  - **Product:** Master catalog of products (nutrients, pesticides, supplements) with key details (name, brand, category, default cost, description, URL, extra data).
  - Designed to support both internal analytics and a conversational mini store experience.

- **Sensor Readings** (Optional)
  - **SensorReading:** Captures environmental data (temperature, humidity, CO2, pH) for an Indoor.

---

## 2. Milestones & Next Steps

### Milestone 1: Data Layer Completion

- Finalize database schema for all core entities: Indoor, Grow, Plant, Strain, Task, TaskType, TaskPlant, Product, TaskProduct, SensorReading.
- Implement queries, API routes, and client-side actions for each entity.
- Seed the database with sample data.

### Milestone 2: Standard UI for Setup

- **UI Components:**  
  Develop traditional forms for initial data entry:
  - Create and manage Indoor records.
  - Start a new Grow cycle (with additional setup fields like substrate composition, pot size, growing method).
  - Add Plants to a Grow, selecting from the Strain library.
- **Data Validation:**  
  Ensure proper field validation and consistency during setup.

### Milestone 3: AI Assistant for In-Progress Tasks

- **Conversational Workflow:**  
  Implement an AI assistant that assists with daily operations during a grow.
  - Use voice (or text) commands to log recurring tasks such as feeding, pruning, and transplanting.
  - Parse user input to extract necessary task details (e.g., pH, EC, total liters) and log tasks automatically.
- **Integration:**  
  Connect the AI assistant to your data layer so it can reference real grow data for recommendations.

### Milestone 4: Conversational Mini Store for Harvest Sales

- **Conversational Purchasing Flow:**  
  Build a chat-based mini store where users can purchase harvested cannabis.
  - The AI agent receives natural language queries (e.g., “I'd like to buy some pot not too strong, preferably indica, with a good smell and I have $50 to spend.”).
  - The agent retrieves relevant products, lists available options, and guides the user through selection, adding to cart, and checkout.
- **Order Management:**  
  Create the necessary backend structure for orders, payment, and delivery (to be implemented further as the project matures).

### Milestone 5: Conversational Experience for Grow Supplies

- **Expand the Conversational UI:**  
  Allow the AI assistant to help users purchase grow supplies (e.g., nutrients, equipment) with minimal friction.
  - Query product catalogs based on user input (e.g., budget, tent size, growing method).
  - Guide the user through product selection, cart management, and checkout.

### Milestone 6: Post-Grow Analysis & Recommendations

- **Analytics & Insights:**  
  After one or several grow cycles are completed, the AI assistant analyzes historical data (yield, task frequency, product usage, sensor readings) and provides recommendations.
  - Offer personalized suggestions for future grows.
- **Dashboard Integration:**  
  Optionally, build a dashboard to visualize analytics data for deeper insights.

---

## 3. Overall Strategy

1. **Start with Standard UI for Setup:**  
   Ensure all core data is entered reliably via forms, minimizing errors and ambiguities.

2. **Leverage AI Assistant for Routine Operations:**  
   Use voice or conversational interfaces for day-to-day tasks during the grow. This reduces friction for repetitive actions (e.g., feeding, pruning).

3. **Conversational E-Commerce:**  
   Develop a chat-based mini store experience for both harvest sales and grow supplies to provide a frictionless purchasing process.

4. **Iterate and Enhance:**  
   Use initial user feedback to refine AI interactions, improve data accuracy, and expand features (e.g., advanced analytics, personalized recommendations).

---

## 4. Conclusion

This roadmap provides a balanced approach that combines a robust, structured data layer with a modern, conversational user experience. By following these milestones, you'll deliver:

- A reliable foundation for managing grows with standard UI.
- An AI assistant that enhances routine operations through voice or chat.
- A conversational mini store for both harvested product sales and grow supplies.
- Data-driven insights that help users optimize future grows.

This approach ensures both structured data integrity and a cutting-edge user experience. Let me know if you need further refinements or additional details on any section!
