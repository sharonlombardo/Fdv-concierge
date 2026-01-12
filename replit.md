# FDV Concierge

## Overview

FDV Concierge is a luxury travel companion web application designed for a Morocco 2026 trip. It provides an elegant, minimalist digital itinerary with journal functionality, allowing travelers to view their schedule, capture notes, and save photos. The application follows high-end design principles inspired by Aman Resorts, Mr Porter, and Airbnb Luxe.

## User Preferences

Preferred communication style: Simple, everyday language.

## Editorial Components

### morocco-editorial-v1
The main editorial scroll experience for the Morocco 2026 trip. This is a long-form narrative scroll with images and text, displayed as the opening sequence of /concierge before the interactive itinerary.

**Backup Location:** `backups/morocco-editorial-v1/`
- `editorial-sections.tsx` - Reusable components (EditorialOverview, EditorialHero, EditorialDaySection, ImageCard)
- `editorial.tsx` - Standalone editorial page with Save/Acquire buttons
- `itinerary-data.ts` - Complete 8-day itinerary data
- `COMPONENT-REFERENCE.md` - All code in one downloadable reference file

### landing-scroll-v1
The landing page scroll experience at `/` (root). Includes the FIL DE VIE CONCIERGE hero, Today's Edit card, and The Current magazine-style scroll with 5 story sections (Morocco, Hydra, Slow Travel, Retreat, New York).

**Backup Location:** `backups/landing-scroll-v1/`
- `threshold.tsx` - Landing page hero + Today's Edit card + Current embed
- `current.tsx` - "The Current" magazine scroll (5 story sections)
- `todays-edit.tsx` - Today's Edit detail page with mood/looks grids
- `COMPONENT-REFERENCE.md` - All code in one downloadable reference file

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

## Morocco 2026 Complete Itinerary

### Day 1 — Arrival → Atlas Mountains (Friday, April 3, 2026)
**Mantra:** Today is about arrival and decompression. No need to do more.

**MORNING**
- Arrival at Marrakech Menara Airport
- Transfer to the Atlas Mountains

**AFTERNOON**
- Check-in at Kasbah Bab Ourika
- Walk the grounds
- Settle in and rest

**EVENING**
- Dinner at the kasbah
- Early night

---

### Day 2 — Atlas Mountains (Saturday, April 4, 2026)
**Mantra:** Follow the light and your energy. This day is intentionally unstructured.

**Field Notes:** Kasbah Bab Ourika sits above the Ourika Valley, surrounded by olive trees and mountain air. This is a place to slow down before the city. Mornings are quiet. Afternoons invite walking, reading, or a gentle hike through nearby villages. Dress comfortably. Let the landscape set the pace.

**MORNING**
- Breakfast at the kasbah
- Walk the grounds
- Optional short village walk or light hike

**AFTERNOON**
- Lunch at the kasbah
- Pool or terrace time
- Reading, walking, or rest

**EVENING**
- Dinner at the kasbah
- Early night

---

### Day 3 — Atlas Mountains → Marrakech (Sunday, April 5, 2026)
**Mantra:** Spend time wandering the riad before going out. El Fenn reveals itself slowly.

**Field Notes:** El Fenn is your anchor in Marrakech. Spend your first afternoon wandering the riad's courtyards, hidden rooms, and rooftop terraces. Visit the El Fenn gift shop and settle in with snacks and cocktails as the light changes. Days move between architecture, souks, and rest. Evenings are about atmosphere, rooftops, and dressing up just enough.

**MORNING**
- Breakfast at the kasbah
- Final walk and views

**AFTERNOON**
- Transfer to Marrakech
- Optional stop at Anima Garden
- Check-in at El Fenn
- Explore courtyards and hidden rooms
- Visit El Fenn gift shop

**EVENING**
- Rooftop snacks and cocktails at El Fenn
- Dinner at El Fenn rooftop

---

### Day 4 — Marrakech (Monday, April 6, 2026)
**Mantra:** This is a full day. Rest in the afternoon so the evening feels effortless.

**Field Notes:** El Fenn is your anchor in Marrakech. Spend your first afternoon wandering the riad's courtyards, hidden rooms, and rooftop terraces. Visit the El Fenn gift shop and settle in with snacks and cocktails as the light changes. Days move between architecture, souks, and rest. Evenings are about atmosphere, rooftops, and dressing up just enough.

**MORNING**
- Breakfast at the riad
- Dar El Bacha
- Coffee at Bacha Coffee

**AFTERNOON**
- Lunch at Nomad
- Bahia Palace
- Souk Cherifia
- Mustapha Blaoui
- Rest at El Fenn

**EVENING**
- Drinks at Royal Mansour
- Dinner at Dar Yacout

---

### Day 5 — Essaouira Day Trip (Tuesday, April 7, 2026)
**Mantra:** Essaouira is about air and openness. Let the pace stay loose.

**Field Notes:** Essaouira is a pause. The air is cooler, the light softer, and the pace slower. Walk the ramparts, browse small galleries, eat by the water, and ride along the coast. Return to Marrakech before dark, refreshed by the open horizon.

**MORNING**
- Depart Marrakech
- Walk ramparts and old town

**AFTERNOON**
- Lunch at Dar Baba
- Coastal e-bike ride
- Walk along the water

**EVENING**
- Return to Marrakech
- Dinner at +61

---

### Day 6 — Marrakech: Culture & Food (Wednesday, April 8, 2026)
**Mantra:** This is a sensory day. Eat well, rest between moments.

**Field Notes:** Marrakech reveals itself through detail. Stone, pattern, and shadow give way to color and flavor. Mornings move through history and craft; afternoons slow the body down. Food becomes the bridge between culture and rest. Eat well. Pause often. Let the day unfold without rushing to the next thing.

**MORNING**
- Breakfast at the riad
- Saadian Tombs
- MAP Marrakech

**AFTERNOON**
- Lunch at La Famille
- Rest at El Fenn

**EVENING**
- Chef-led cooking workshop at La Maison Arabe
- Optional hammam at El Fenn or La Mamounia
- Dinner at Terrasse des Épices

---

### Day 7 — Marrakech & Agafay Desert (Thursday, April 9, 2026)
**Mantra:** Dress simply but beautifully. The desert does the rest. Evenings get chilly – bring a wrap.

**Field Notes:** The city loosens its grip today. Gardens and museums in the morning give way to open land and long horizons. The desert shifts scale and perspective, especially at dusk, when light softens and sound falls away. Dress simply. Watch the sun. Let the evening do the work.

**MORNING**
- Breakfast at the riad
- Jardin Majorelle
- Yves Saint Laurent Museum

**AFTERNOON**
- Lunch or drinks at Royal Mansour
- Transfer to Agafay Desert

**EVENING**
- Dune buggy ride
- Camel ride at sunset
- Dinner in the desert
- Return to Marrakech

---

### Day 8 — Return (Friday, April 10, 2026)
**Mantra:** The journey continues, just in a different rhythm.

**Field Notes:** Today is about returning gently. The pace shifts back toward the city, but with new ease. Familiar paths feel quieter now. What once demanded attention begins to settle into memory. Unpack slowly. Take a last walk. Let the rhythm soften before the journey home.

**MORNING**
- 07:30 Breakfast at the riad
- 08:30 Final packing
- 09:30 Check-out and departure preparations

**AFTERNOON**
- Transfer to Marrakech Menara Airport
- International flight to New York

**EVENING**
- Arrival in New York