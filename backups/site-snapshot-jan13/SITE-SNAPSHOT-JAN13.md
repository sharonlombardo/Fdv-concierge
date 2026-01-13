# FDV Concierge - Complete Site Snapshot
**Date:** January 13, 2026
**Commit:** 5d169f26cad3589c35a777ff95e41719d1403206

## Overview

This snapshot captures the complete FDV Concierge Morocco 2026 experience, ready for the demo.

## Key Features Implemented

### 1. Navigation
- Hamburger menu with all pages including Packing List
- Global nav with back button and logo

### 2. Taste Curation Flow
- Today's Edit hidden from landing page until curated
- "Curate for Me" elegant text link on Suitcase page
- 5-frame cinematic transition animation
- Your Capsule page with poetic headers

### 3. Packing List
- Organized by day and time (morning/afternoon/evening)
- Mark items as packed
- Selfie photo upload with background removal

### 4. Editorial Experience
- Long-form narrative scroll at /concierge
- Pin and Suitcase buttons on all imagery

## Files Included

| File | Purpose |
|------|---------|
| `global-nav.tsx` | Navigation with Packing List link |
| `packing-list.tsx` | Complete packing list page |
| `suitcase.tsx` | Suitcase with Curate for Me button |
| `todays-edit.tsx` | Your Capsule reveal page |
| `threshold.tsx` | Landing page (Today's Edit removed) |
| `trip-transition.tsx` | Cinematic transition animation |
| `App.tsx` | All route registrations |

## Routes

| Path | Page |
|------|------|
| `/` | Landing / Threshold |
| `/current` | The Current magazine |
| `/suitcase` | Saved items |
| `/packing` | Packing List |
| `/destinations` | Destinations |
| `/concierge` | Morocco Editorial + Itinerary |
| `/todays-edit` | Your Capsule (after curation) |
| `/image-control` | Image management |

## To Restore

```bash
cp backups/site-snapshot-jan13/global-nav.tsx client/src/components/
cp backups/site-snapshot-jan13/packing-list.tsx client/src/pages/
cp backups/site-snapshot-jan13/suitcase.tsx client/src/pages/
cp backups/site-snapshot-jan13/todays-edit.tsx client/src/pages/
cp backups/site-snapshot-jan13/threshold.tsx client/src/pages/
cp backups/site-snapshot-jan13/trip-transition.tsx client/src/components/
cp backups/site-snapshot-jan13/App.tsx client/src/
```

## Demo Flow

1. Start at landing page (/)
2. Browse The Current or Concierge
3. Save items with Pin or Suitcase buttons
4. Go to Suitcase (/suitcase)
5. Click "Curate for Me"
6. Watch transition animation
7. Arrive at Your Capsule (/todays-edit)
