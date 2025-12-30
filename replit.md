# FDV Concierge

## Overview

FDV Concierge is a luxury travel companion web application designed for a Morocco 2026 trip. It provides an elegant, minimalist digital itinerary with journal functionality, allowing travelers to view their schedule, capture notes, and save photos. The application follows high-end design principles inspired by Aman Resorts, Mr Porter, and Airbnb Luxe.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local component state for UI
- **Styling**: Tailwind CSS with custom luxury-focused design tokens
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- UI components in `client/src/components/ui/` (shadcn/ui library)
- Custom hooks in `client/src/hooks/` for reusable logic
- Pages in `client/src/pages/` for route-level components
- Shared utilities and data in `client/src/lib/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful JSON endpoints under `/api/`
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Static file serving from built assets

The server uses a simple modular structure:
- `server/index.ts`: Express app setup and middleware
- `server/routes.ts`: API route definitions
- `server/storage.ts`: Data persistence layer (currently in-memory)
- `server/vite.ts`: Development server integration

### Data Storage
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect
- **Current Implementation**: In-memory storage (`MemStorage` class)
- **Schema Location**: `shared/schema.ts` with Zod validation via drizzle-zod

The storage interface (`IStorage`) abstracts data operations, allowing easy migration from in-memory to database storage. Journal entries use a key-value structure with client-side localStorage backup.

### Design System
- **Typography**: Playfair Display (headings), Inter (body), DM Sans, Geist Mono
- **Color Palette**: Warm neutral tones with HSL-based CSS variables
- **Theme Support**: Light/dark mode via ThemeProvider context
- **Component Style**: New York variant of shadcn/ui

## External Dependencies

### UI Framework
- **Radix UI**: Comprehensive set of accessible, unstyled primitives for dialogs, dropdowns, tabs, tooltips, and more
- **shadcn/ui**: Pre-styled component library configured via `components.json`
- **Lucide React**: Icon library

### Data & State
- **TanStack React Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database queries and schema definition
- **Zod**: Runtime schema validation

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for Express (available but not currently used)

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **Replit Plugins**: Development banner, error overlay, and cartographer for Replit environment