# Overview

CalorieTracker is a full-stack web application for tracking daily food intake and calorie consumption. The application allows users to log food entries, set calorie goals, and view analytics about their eating patterns. It features a responsive design with separate pages for adding food, viewing food logs, analytics, and settings.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js for the REST API server
- **Language**: TypeScript for both frontend and backend consistency
- **API Design**: RESTful endpoints following conventional HTTP methods
- **Validation**: Zod schemas shared between client and server for consistent data validation
- **Storage Layer**: Abstracted storage interface with in-memory implementation (ready for database integration)

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Database**: PostgreSQL (configured but using in-memory storage currently)
- **Schema Management**: Database schema defined in TypeScript with Drizzle schema definitions
- **Migrations**: Drizzle Kit for database migrations and schema management

## Authentication and Authorization
- **Current State**: No authentication implemented (sessions configured but not actively used)
- **Session Storage**: Express sessions with PostgreSQL session store (connect-pg-simple) configured
- **Security**: Basic request logging and error handling middleware

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)
- **Connection**: Configured via DATABASE_URL environment variable

### UI Component Libraries
- **Radix UI**: Headless UI components for accessibility and functionality
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel component for UI interactions

### Development Tools
- **TypeScript**: Type checking and development experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **Vite Plugins**: Development tooling including error overlay and cartographer

### Utility Libraries
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Utility for managing CSS class variants
- **CLSX & Tailwind Merge**: CSS class composition utilities
- **Nanoid**: Unique ID generation
- **CMDK**: Command palette component

### Development Dependencies
- **Replit Integration**: Custom plugins for Replit development environment
- **Runtime Error Overlay**: Development error handling and debugging