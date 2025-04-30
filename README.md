# Clinic Queue Manager - Frontend (Client)

This directory contains the React frontend for the Clinic Queue Manager application, built using Vite and styled with Tailwind CSS. It allows patients to book slots, view queue status, and manage their bookings, while providing an interface for admins to manage the queue after logging in.

## Core Technologies

*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Fast frontend build tool and development server.
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **React Router:** Library for handling routing within the React application.
*   **Axios:** Promise-based HTTP client for making API requests to the backend.
*   **@heroicons/react:** UI icons library.

## Prerequisites

*   Node.js (v16 or later recommended)
*   npm or yarn
*   The backend server (`../server`) must be running for the application to function fully.

## Setup and Installation

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables (Optional - for Demo):**
    *   If you want to display the demo admin credentials on the login page *during development only*, create a `.env` file in the `client/` directory: `touch .env`
    *   Add the following (**WARNING: REMOVE BEFORE PRODUCTION!**):

    ```dotenv
    # client/.env

    # --- DEMO ONLY ---
    # Default credentials displayed on login form for easy testing.
    # MUST start with VITE_
    # REMOVE BEFORE PRODUCTION!
    VITE_DEMO_ADMIN_USERNAME=admin
    VITE_DEMO_ADMIN_PASSWORD=your_chosen_plain_text_password # Use the *plain text* password here
    # --- /DEMO ONLY ---
    ```
    *   Ensure `client/.env` is added to your project's `.gitignore` file.

## Running the Frontend

1.  **Ensure the backend server (`../server`) is running.**
2.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
    Vite will typically start the server on `http://localhost:3000` (or the port configured in `vite.config.js`) and open it in your browser.

## Development Proxy

*   The `vite.config.js` file is configured with a development proxy. Any requests made from the frontend to `/api/...` will be automatically forwarded to the backend server (assumed to be running on `http://localhost:5000` by default). This avoids CORS issues during development.

## Key Features & Components

*   **Patient View:**
    *   **Booking Form (`src/components/BookingForm.jsx`):** Allows patients to enter their name and book a slot. Displays success message with Booking ID or errors.
    *   **Queue Display (`src/components/QueueDisplay.jsx`):** Shows the current number of waiting patients and identifiers for the currently served and next patients. Auto-refreshes periodically.
    *   **Status Checker (`src/components/StatusChecker.jsx`):** Allows patients to enter their Booking ID to see their current status (Waiting/Position, Done, Cancelled) and provides an option to cancel if waiting.
*   **Admin View:**
    *   **Admin Login Page (`src/pages/AdminLoginPage.jsx`):** Secure login form for administrators. (Displays demo credentials if configured in `.env`).
    *   **Admin Dashboard (`src/pages/AdminPage.jsx`):** (Protected Route) Displays the active waiting queue in detail. Allows admins to mark patients as 'Done' and log out.
*   **Routing (`src/App.jsx`):**
    *   `/`: Home page (Booking Form + Queue Display).
    *   `/status`: Patient Status Check/Cancel page.
    *   `/admin/login`: Admin login page.
    *   `/admin`: Protected admin dashboard.
*   **Shared Components:**
    *   `AlertMessage.jsx`: Reusable component for displaying success/error/info messages.
    *   `LoadingSpinner.jsx`: Reusable loading indicator.
    *   `ProtectedRoute.jsx`: Component to protect routes based on authentication state.
*   **API Communication (`src/api.js`):** Contains functions using Axios (with `withCredentials: true`) to interact with the backend API endpoints.

## Styling

*   **Tailwind CSS:** Used extensively for styling all components. Configuration is in `tailwind.config.js` and base styles/directives are in `src/index.css`.
*   **Heroicons:** Used for icons throughout the interface.

## Future Improvements

*   Implement real-time updates using WebSockets instead of polling.
*   Enhance accessibility (ARIA attributes, keyboard navigation).
*   Add more sophisticated loading/skeleton states.
*   Improve responsive design for various screen sizes.
*   Add frontend form validation libraries if needed.
*   Implement state management (like Zustand or Redux Toolkit) if complexity grows.
*   Add automated tests (e.g., using Vitest and React Testing Library).