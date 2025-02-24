# Flow 1: User Profile Setup and Indoor Management

This flow outlines how a user, after logging in with Clerk, sets up their profile and manages their Indoor environments.

---

## 1. Login & Profile Setup

- **Login via Clerk:**  
  Users authenticate through Clerk. Once logged in, the app retrieves the user's profile data (e.g., user ID, email).

- **Profile Display:**  
  The user’s profile (or a summary thereof) is displayed on the dashboard, allowing for basic edits if needed.

---

## 2. Dashboard / Indoors List Page

- **Dashboard Home:**

  - **Central Hub:** After login, the user is directed to a dashboard.
  - **Indoors List:** The dashboard displays a list or grid of all Indoor environments associated with the user.
  - **Navigation:** A sidebar or top navigation bar links to key sections (e.g., Indoors, Grows, Plants, Analytics).

- **Indoors List Component:**
  - Fetches all Indoor records from the database where `createdBy` matches the current user's ID.
  - Displays key details for each Indoor (name, location, etc.) in a card or list format.
  - Allows users to select an Indoor for detailed view, editing, or deletion.

---

## 3. Creating a New Indoor

- **Navigation Action:**

  - A "Create New Indoor" button is prominently available on the dashboard.

- **Indoor Creation Form:**

  - Opens in a modal or on a dedicated page.
  - Fields include:
    - **Name:** The title of the indoor environment.
    - **Location:** Where the indoor is situated (e.g., Garage, Basement).
    - **Dimensions:** The size (e.g., "4x4").
    - **Lighting:** Information about the lighting system (e.g., "600W LED").
    - **Ventilation:** Details about the ventilation setup.
    - **Recommended Conditions:** A JSON input for ideal conditions (e.g., `{ "temp": "20-26C", "humidity": "40-50%" }`).

- **Submission & Update:**
  - Upon form submission, the frontend calls an API endpoint to create the Indoor.
  - The new Indoor is saved in the database with the current user's Clerk ID as `createdBy`.
  - The dashboard list updates to include the newly created Indoor.

---

## 4. Navigation Flow

- **Main Navigation:**

  - Users can navigate via a sidebar or top bar with links such as:
    - Dashboard
    - Indoors
    - Grows
    - Plants
    - Analytics

- **Indoor Details:**
  - Clicking on an Indoor card shows a detailed view, with options to edit or delete the Indoor.
  - This detailed view may also serve as an entry point for starting a new Grow cycle in that Indoor.

---

## 5. Data Architecture & State Management

- **User Identification:**

  - The Clerk user ID is used as the key identifier for all related records (e.g., filtering Indoors where `createdBy = user.id`).

- **Database Entities:**

  - **User:** Stores Clerk user details.
  - **Indoor:** Stores indoor environment data along with a `createdBy` field.
  - **Grow, Plant, etc.:** Relate to Indoor via foreign keys.

- **Fetching Data:**
  - The frontend makes API calls (e.g., GET `/api/indoors?userId=...`) to retrieve data for display.
  - Tools like React Query or simple `useState` hooks can manage the data state and revalidation.

---

## Summary of Flow

1. **User logs in** via Clerk and lands on the dashboard.
2. The **dashboard displays** the user's profile and a list of Indoor environments.
3. The user **creates a new Indoor** using a standard UI form.
4. The new Indoor is saved (with `createdBy` set to the user's Clerk ID) and appears in the Indoors list.
5. The user can then **navigate** to manage their Indoor details, start a new Grow cycle, and access other functionalities.

This flow ensures that the user has a clear, structured experience for setting up their grow environment, forming the foundation for later integrating AI features and a comprehensive analytics dashboard.
