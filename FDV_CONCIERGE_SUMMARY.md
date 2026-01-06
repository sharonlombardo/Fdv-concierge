# FDV Concierge - Technical & Feature Summary

**Document Version:** January 2026  
**Purpose:** Comprehensive overview for coding collaborators

---

## 1. Project Overview

**FDV Concierge** is a luxury travel companion web application designed for a Morocco 2026 trip (April 3-10, 2026). It provides an elegant, minimalist digital itinerary with travel diary functionality, packing lists, and photo management features.

### Design Philosophy
- **Primary References:** Aman Resorts, Mr Porter, Airbnb Luxe
- **Core Principles:**
  - Luxury minimalism with generous whitespace
  - Photography-first presentation
  - Subtle sophistication (no flashy animations)
  - Curated, purposeful design elements

### Color Palette
- Warm neutral tones with HSL-based CSS variables
- Light/dark mode support via ThemeProvider

### Typography
- **Headings:** Playfair Display (serif, luxury aesthetic)
- **Body:** Inter (clean, readable sans-serif)
- **Additional fonts:** DM Sans, Geist Mono

---

## 2. Key Features

### 2.1 Daily Itinerary (Home Page)
The main experience - an 8-day Morocco trip itinerary with:

- **Day-by-Day Flow:** Each day shows activities organized by Morning, Afternoon, and Evening
- **Daily Mantras:** Inspirational text setting the tone for each day
- **Field Notes:** Contextual travel tips and atmospheric descriptions
- **Interactive Cards:** Tap any activity to open a detailed drawer

### 2.2 Travel Diary / Journal
Within each activity card, users can:
- **Write Notes:** Personal reflections and memories
- **Upload Photos:** Multiple images per activity (up to 4)
- **Instagram Story Export:** Generate beautifully formatted story-ready images with:
  - FDV Concierge branding
  - User's photo
  - Activity title
  - Personal note as a quote
  - Location marker

### 2.3 Wardrobe / Daily Looks
Each day includes a suggested outfit with:
- **Main Look Image:** Full outfit photo with shop links
- **Accessory Slots:** 4 slots per day (Footwear, Handbag, Jewelry, Accessory)
- **Selfie Integration:** Users can upload their own photos to replace accessories

### 2.4 Selfie Upload with Background Removal
- Upload personal photos in the Suitcase/Packing page
- **Client-side AI background removal** using @imgly/background-removal
- Processed selfies stored in database for reuse
- Apply selfies to any accessory slot across the app

### 2.5 Packing List / Suitcase Page
- **Organize View:** Items grouped by category
- **Pack View:** Checklist-style packing interface
- **Your Photos Section:** Selfie upload and management
- Complete wardrobe looks with accessories per day

### 2.6 Editorial Page
- Magazine-style presentation of the trip
- Narrative storytelling format
- High-end visual layout

### 2.7 Image Management System
Admin/power-user features:
- **Image Library:** Upload and tag images for automatic matching
- **Image Rules:** Define criteria for auto-assigning images to activities
- **Custom Image Override:** Replace any default image with custom uploads

---

## 3. Technical Architecture

### 3.1 Frontend Stack
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool with HMR |
| Wouter | Lightweight routing |
| TanStack React Query | Server state management |
| Tailwind CSS | Styling with custom design tokens |
| shadcn/ui | Component library (Radix UI primitives) |
| Lucide React | Icon library |
| Framer Motion | Animations |

### 3.2 Backend Stack
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | HTTP server |
| TypeScript (ESM) | Type-safe server code |
| PostgreSQL | Primary database |
| Drizzle ORM | Type-safe database queries |
| Zod | Runtime schema validation |

### 3.3 Special Libraries
| Library | Purpose |
|---------|---------|
| @imgly/background-removal | Client-side AI background removal for selfies |
| react-hook-form | Form handling |
| date-fns | Date formatting |

---

## 4. File Structure

```
/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── home.tsx           # Main itinerary page
│       │   ├── packing-list.tsx   # Suitcase/packing page
│       │   ├── editorial.tsx      # Magazine-style page
│       │   ├── image-library.tsx  # Image upload management
│       │   ├── image-rules.tsx    # Auto-assignment rules
│       │   └── image-management.tsx # Admin image tools
│       ├── components/
│       │   ├── ui/                # shadcn/ui components
│       │   ├── selfie-upload.tsx  # Selfie upload with BG removal
│       │   ├── selfie-picker-modal.tsx # Reuse selfies modal
│       │   ├── theme-provider.tsx # Light/dark mode
│       │   └── theme-toggle.tsx   # Theme switch button
│       ├── hooks/
│       │   ├── use-custom-images.ts  # Custom image state
│       │   ├── use-selfies.ts        # Selfie management
│       │   └── use-toast.ts          # Toast notifications
│       └── lib/
│           ├── queryClient.ts     # TanStack Query setup
│           └── utils.ts           # Utility functions
├── server/
│   ├── index.ts                   # Express app entry
│   ├── routes.ts                  # API endpoints
│   ├── storage.ts                 # Data persistence layer
│   └── vite.ts                    # Dev server integration
├── shared/
│   └── schema.ts                  # Drizzle schemas + Zod validation
└── attached_assets/               # Static images and assets
```

---

## 5. Database Schema

### Tables

**users**
- id (varchar, primary key, UUID)
- username (text, unique)
- password (text)

**custom_images**
- imageKey (varchar, primary key) - e.g., "d1-cover", "d2-3"
- customUrl (text) - base64 or URL
- originalUrl (text)
- label (text)
- updatedAt (bigint)

**image_library**
- id (serial, primary key)
- imageUrl (text)
- name (text)
- tags (text array) - e.g., ["marrakech", "morning"]
- category (text) - general, location, activity, time
- priority (integer)
- createdAt (bigint)

**image_rules**
- id (serial, primary key)
- name (text)
- imageType (text) - item, wardrobe, cover
- matchLocation (text array)
- matchTime (text array)
- matchKeywords (text array)
- assignTags (text array)
- priority (integer)
- enabled (integer)
- createdAt (bigint)

**selfie_images**
- id (serial, primary key)
- name (text)
- originalUrl (text) - before processing
- processedUrl (text) - background removed
- createdAt (bigint)

---

## 6. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/custom-images | Get all custom images |
| POST | /api/custom-images | Save/update a custom image |
| DELETE | /api/custom-images/:key | Delete a custom image |
| GET | /api/image-library | Get all library images |
| POST | /api/image-library | Add image to library |
| DELETE | /api/image-library/:id | Remove from library |
| GET | /api/image-rules | Get assignment rules |
| POST | /api/image-rules | Create/update rule |
| DELETE | /api/image-rules/:id | Delete rule |
| GET | /api/selfies | Get all user selfies |
| POST | /api/selfies | Upload new selfie |
| PATCH | /api/selfies/:id | Update selfie |
| DELETE | /api/selfies/:id | Delete selfie |

---

## 7. Morocco 2026 Itinerary Summary

| Day | Date | Location | Highlights |
|-----|------|----------|------------|
| 1 | Apr 3 | Arrival > Atlas | Marrakech airport, Kasbah Bab Ourika |
| 2 | Apr 4 | Atlas Mountains | Rest day, village walks, pool |
| 3 | Apr 5 | Atlas > Marrakech | Anima Garden, El Fenn riad |
| 4 | Apr 6 | Marrakech | Dar El Bacha, Bahia Palace, Royal Mansour, Dar Yacout |
| 5 | Apr 7 | Essaouira Day Trip | Ramparts, Dar Baba, coastal e-bike |
| 6 | Apr 8 | Marrakech Culture | Saadian Tombs, MAP, La Maison Arabe cooking |
| 7 | Apr 9 | Marrakech + Desert | Majorelle, YSL Museum, Agafay Desert sunset |
| 8 | Apr 10 | Departure | Flight to New York |

---

## 8. Key User Flows

### Viewing the Itinerary
1. Open app > lands on Home page
2. Scroll through days (horizontal day selector at top)
3. Tap any activity card to expand details

### Adding Journal Entry
1. Tap activity card to open drawer
2. Scroll to "Your Journal" section
3. Type note in text area (auto-saves)
4. Tap camera icon to add photos (up to 4)
5. Tap "Share to Instagram" to generate story image

### Using Selfie Feature
1. Navigate to Suitcase page
2. Scroll to "Your Photos" section
3. Click "Add Photo" and select image
4. Wait for background removal processing
5. Selfie appears in gallery
6. On any day's outfit, hover over accessory slot
7. Click camera icon to open selfie picker
8. Select selfie to apply it

---

## 9. Environment Variables

| Variable | Purpose |
|----------|---------|
| DATABASE_URL | PostgreSQL connection string |
| SESSION_SECRET | Express session encryption |

---

## 10. Development Commands

```bash
# Start development server
npm run dev

# Push database schema changes
npm run db:push

# Build for production
npm run build
```

---

## 11. Design System Quick Reference

### Spacing Scale
- Small: 4px, 8px
- Medium: 12px, 16px
- Large: 24px, 32px

### Border Radius
- Default: rounded-md (6px)
- Full circles: rounded-full

### Shadows
- Minimal use, only for floating elements
- Cards rely on subtle borders

### Interactive States
- Use hover-elevate and active-elevate-2 utilities
- Never custom hover:bg-* on buttons

---

## 12. Notes for Collaborators

1. **No manual Vite config changes** - The setup is pre-configured
2. **Use shadcn/ui components** - Don't recreate buttons, cards, etc.
3. **TanStack Query v5** - Use object form: `useQuery({ queryKey: ['key'] })`
4. **Image keys** - Follow pattern: `{dayId}-{type}-{index}` (e.g., "d4-extra-2")
5. **Selfie processing** - Happens client-side, no server costs
6. **localStorage backup** - Journal entries sync to localStorage for offline

---

*Generated: January 2026*
