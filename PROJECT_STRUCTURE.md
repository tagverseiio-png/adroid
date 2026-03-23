# Project Structure - Adroit Design

Adroit Design is organized as a monorepo with separate `frontend` and `backend` codebases.

## Frontend (`/src`)

The frontend is a React application built with Vite, following a component-based architecture.

### Directory Breakdown
- `admin/`: Components and pages for the site's administration dashboard.
- `blog/`: Components and logic for managing and displaying blog posts.
- `components/`: Reusable UI elements:
    - `AIChatbot.jsx`: Interaction logic for the support chatbot.
    - `BackButton.jsx`: Simple navigation helper.
    - `CustomCursor.jsx`: Custom mouse cursor behavior.
    - `Footer.jsx`: The global site footer.
    - `Navigation.jsx`: Header navigation and menus.
    - `Preloader.jsx`: Initial application loading animation.
- `context/`: React context providers for global state management (e.g., Auth, Shop).
- `data/`: Static data and configuration constants.
- `services/`: API integration layer:
    - `api.js`: Main Axios instance and endpoint wrapper.
- `shop/`: Specialized components for the e-commerce functionality.

### Core Files
- `App.jsx`: Main routing configuration.
- `index.css`: Tailwind CSS entry point and global styles.
- `main.jsx`: Application entry point.

---

## Backend (`/backend/src`)

The backend is an Express.js API designed for scalability and performance on lower-resource VMs (e.g., 2GB RAM).

### Directory Breakdown
- `config/`: Configuration files for external services and environment constants.
- `controllers/`: Business logic handlers for API routes:
    - `analyticsController.js`: Statistics and events tracking.
    - `authController.js`: JWT login and user registration.
    - `blogController.js`: Post creation, editing, and deletion.
    - `inquiryController.js`: Processing contact form submissions.
    - `odooController.js`: Direct Odoo API interaction.
    - `projectController.js`: Handling project portfolio items.
    - `shop/`: Management of orders, products, and checkout logic.
    - `uploadController.js`: Multi-part form handling for file storage.
- `middleware/`: Custom Express middleware for:
    - `auth.js`: JWT token verification and user roles.
    - `rateLimit.js`: API request limiting for security.
    - `upload.js`: Managing file uploads via Multer.
- `migrations/`: SQL migration files and scripts for database schema management.
- `routes/`: Express router definitions mapping endpoints to controllers.
- `services/`: Reusable utility functions and external API wrappers.
- `utils/`: Helper functions and common constants.

### Core Files
- `server.js`: Server entry point and database connection logic.
- `app.js`: Express application setup, middleware registration, and routing.
