# FDV Concierge - Landing Scroll Components Reference
## Version 1.0 - January 2026

This document contains all the component code for the FDV Concierge landing page scroll experience.
The landing page includes:
1. **Threshold** - The hero landing with "FIL DE VIE CONCIERGE" title
2. **Today's Edit** - Curated mood/looks/pieces card
3. **The Current** - Magazine-style editorial scroll with 5 story sections

---

## File Structure

```
backups/landing-scroll-v1/
  threshold.tsx      - Landing page hero + Today's Edit card + Current embed
  current.tsx        - "The Current" magazine scroll (Morocco, Hydra, Slow Travel, Retreat, New York)
  todays-edit.tsx    - Today's Edit detail page with mood/looks grids
  COMPONENT-REFERENCE.md - This file
```

---

## 1. Page Flow

When a user arrives at `/` (root):
1. **Hero Section** - Full-screen hero with "FIL DE VIE CONCIERGE" title
2. **Explore Row** - Navigation links to Destinations, Experiences, Rituals, Culture, Concierge
3. **Today's Edit Card** - Clickable card leading to `/todays-edit`
4. **The Current (embedded)** - Full magazine scroll with 5 story sections

---

## 2. Key Components in `threshold.tsx`

### Hero Section
- Full-screen background image with gradient overlay
- Large serif title "FIL DE VIE CONCIERGE"
- Subtitle lines and scroll indicator

### TodaysEditCard
- 4:5 aspect ratio card (16:9 on desktop)
- Background image with gradient
- Links to `/todays-edit`
- Pin button for saving

### ExploreRow
- Horizontal navigation with category links
- Links to: Destinations, Experiences, Rituals, Culture, Concierge

---

## 3. Key Components in `current.tsx` (The Current Magazine)

### Story Sections
Each story is a section with its own ID for sticky navigation:
- `morocco` - Morocco story
- `hydra` - Hydra story
- `slow-travel` - Slow Travel story
- `retreat` - Retreat story
- `new-york` - New York story

### Reusable Blocks
- **PageTurnHero** - Full-height hero with title, state of mind, paragraph
- **QuoteCard** - Centered italic quote with pin button
- **MomentBlock** - Image + text side-by-side (left or right image position)
- **PinGrid** - 2x3 or 3x2 grid of pinnable tiles
- **TwoUpFeature** - Two side-by-side feature images
- **MotionLoopBlock** - Video/motion placeholder with overlay text
- **ClosingLine** - Closing italic text with pin button

### StickyNav
- Sticky navigation bar at top
- Shows current section based on scroll position
- Click to scroll to section

---

## 4. Key Components in `todays-edit.tsx`

### Mood Grid
- 4 mood images in a 2x4 grid (mobile) / 4-column grid (desktop)
- Each image has Pin and Suitcase buttons

### Looks & Objects Grid
- 6 product images in a 3x6 grid
- Each image has Pin and Suitcase buttons

---

## 5. Image Slot Keys Used

### Threshold/Landing
- `landing-hero` - Main hero background
- `todays-edit-card` - Today's Edit card image

### Today's Edit
- `todays-edit-mood-1` through `todays-edit-mood-4` - Mood images
- `todays-edit-look-1` through `todays-edit-look-6` - Look/product images

### The Current (many slots per story)
Each story uses keys like:
- `morocco-hero`, `hydra-hero`, etc. for hero images
- `morocco-style-1`, `morocco-place-1`, etc. for moment blocks
- `morocco-tile-1` through `morocco-tile-6` for grids

---

## 6. Design Patterns

### Typography
- Headings: Serif font (Playfair Display)
- Body: Sans-serif (Inter)
- Labels: Uppercase tracking-widest text-xs

### Colors
- Background: `#fafaf9` (light mode), `background` (dark mode)
- Text: `foreground`, `muted-foreground`
- Gradients: Black overlays on images

### Spacing
- Sections: `py-12 md:py-16` or `py-20 md:py-24`
- Max widths: `max-w-4xl`, `max-w-5xl`, `max-w-6xl`

---

## 7. How to Embed The Current

To embed The Current scroll in another page:

```tsx
import CurrentFeed from "@/pages/current";

function MyPage() {
  return (
    <div>
      {/* Your header content */}
      <CurrentFeed embedded />
    </div>
  );
}
```

The `embedded` prop removes the GlobalNav and header from the Current component.

---

## 8. Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Threshold | Landing page with embedded Current |
| `/current` | CurrentFeed | Standalone Current magazine |
| `/todays-edit` | TodaysEdit | Today's Edit detail page |
| `/destinations` | Destinations | Destination grid page |

---

## Backup Created: January 12, 2026
