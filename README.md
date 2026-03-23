# Adroit Design - Project Documentation

Adroit Design is a full-stack web application designed for a creative agency, featuring a modern frontend, a robust backend, and several third-party integrations for business operations.

## Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (>= 18.0.0)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT & Bcrypt
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/)
- **File Uploads**: [Multer](https://github.com/expressjs/multer)
- **Mailing**: [Nodemailer](https://nodemailer.com/)

## Key Features
- **Project Portfolio**: Dynamic display of architectural and design projects.
- **Service Listings**: Detailed descriptions of agency services.
- **Job Board**: Integration with Odoo for recruitment and application tracking.
- **E-commerce Shop**: Full-fledged shop with product categories, reviews, and coupons.
- **Payment Gateway**: Integration with PayU for secure transactions.
- **Logistics**: Shiprocket integration for automated delivery tracking.
- **Admin Dashboard**: Comprehensive management of site content and shop operations.
- **AI Chatbot**: Intelligent customer support interaction.

## Getting Started

### Prerequisites
- Node.js (>= 18.0.0)
- PostgreSQL Database
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Adroit_design
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   cp .env.example .env
   # Update .env with your local configurations
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database and API credentials
   ```

### Running Locally

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd ..
   npm run dev
   ```

## Documentation
- [Project Structure](./PROJECT_STRUCTURE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Integrations](./INTEGRATIONS.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
