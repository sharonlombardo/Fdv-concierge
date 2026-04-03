# Hero Animation Shot List
**Last updated:** April 3, 2026
**File:** `client/src/components/hero-animation.tsx`

---

## Timing

| Type | Duration |
|------|----------|
| Still image | 750ms |
| Video clip | 2,000ms |
| Silent text beat | 1,300ms |
| Typewriter text | ~200ms/char + 1s hold |
| Scattered syllables | 3,500ms |
| White card | ~200ms/char + 1.2s hold |

**Full loop:** 57 media items × mixed durations ≈ ~60 seconds

---

## Rules
- Stills always appear in groups of 2+ (never a lone still between videos)
- Previous still stays visible behind current to prevent black flash
- All stills preloaded on mount; next video preloaded via `<link rel=preload>`
- Videos render as `<video autoPlay muted playsInline>` with object-fit: cover
- Media cycling pauses during white card moments

---

## Media Pool — 57 Items (35 stills + 22 videos)

### Morocco Stills (3) — 750ms each
| # | File | Description |
|---|------|-------------|
| 1 | morocco-hero | Morocco hero landscape |
| 2 | morocco-motion-1 | Morocco motion/lifestyle |
| 3 | morocco-ritual-1 | Morocco ritual/detail |

### Morocco Videos (3) — 2s each
| # | File | Description |
|---|------|-------------|
| 4 | hero-video-1.MP4 | Fashion/destination clip |
| 5 | woman in white in water.MP4 | Woman in white dress in water |
| 6 | blowing shirt cliop.mp4 | Fashion editorial — shirt blowing |

### Morocco Stills (5) — 750ms each
| # | File | Description |
|---|------|-------------|
| 7 | morocco blk outfit.jpeg | Morocco black outfit still |
| 8 | destination-morocco | Morocco destination card |
| 9 | morocco cream skirt.jpeg | Morocco cream skirt still |
| 10 | guide-morocco/stay-1-large.jpg | Morocco stay — large editorial |
| 11 | guide-morocco/eat-1-large.jpg | Morocco eat — large editorial |

### Morocco Video (1) — 2s
| # | File | Description |
|---|------|-------------|
| 12 | hero-video-2.MP4 | Fashion/destination clip |

### Hydra Stills (3) — 750ms each
| # | File | Description |
|---|------|-------------|
| 13 | guide-morocco/shop-1-large.jpg | Morocco shop — large editorial |
| 14 | hydra-hero | Hydra hero landscape |
| 15 | hydra_cave_hotel.jpg | Hydra cave hotel |

### Hydra / Greece Videos (3) — 2s each
| # | File | Description |
|---|------|-------------|
| 16 | hydra clip 1.MP4 | Hydra destination clip |
| 17 | greece_water_pan.mp4 | Greece water pan (v2 hi-res) |
| 18 | hydra_black_fringe_caftan_video.mp4 | Hydra black fringe caftan fashion |

### Hydra Stills (2) — 750ms each
| # | File | Description |
|---|------|-------------|
| 19 | hydra-light-1 | Hydra light/atmosphere |
| 20 | hydra-ritual-1 | Hydra ritual/detail |

### Hydra Videos (3) — 2s each
| # | File | Description |
|---|------|-------------|
| 21 | hydra_water_panoramic.mp4 | Hydra water panoramic (v2 hi-res) |
| 22 | hydra_interior_arches.mp4 | Hydra interior arches |
| 23 | hydra_white_look_boar.mp4 | Hydra white look on boat |

### Hydra / Med Stills (2) — 750ms each
| # | File | Description |
|---|------|-------------|
| 24 | destination-hydra | Hydra destination card |
| 25 | med_woman_floating_back.JPG | Woman floating in water |

### Med / Italy Videos (3) — 2s each
| # | File | Description |
|---|------|-------------|
| 26 | (Gemini model in white dress).mp4 | Model in white dress walking by ocean, stone wall |
| 27 | med_blacony_drapes.mp4 | Mediterranean balcony with drapes |
| 28 | striped shirt on boat.mp4 | Fashion — striped shirt on boat |

### Med Stills (3) — 750ms each
| # | File | Description |
|---|------|-------------|
| 29 | SIU Perfume for spring.jpeg | Perfume aesthetic still |
| 30 | amalfi_lunch.jpeg | Amalfi lunch scene |
| 31 | suitcase_open.jpg | Open suitcase lifestyle |

### Italy / Med Videos (6) — 2s each
| # | File | Description |
|---|------|-------------|
| 32 | italy coast.MP4 | Italy coastline clip |
| 33 | portofion_cliffside.mp4 | Portofino cliffside pan |
| 34 | med_stroll.mp4 | Mediterranean stroll |
| 35 | med_interior_drapes.mp4 | Mediterranean interior with drapes |
| 36 | interior of villa.mp4 | Villa interior tour |
| 37 | resort with curtains.mp4 | Resort curtains blowing |

### Slow Travel Stills (2) — 750ms each
| # | File | Description |
|---|------|-------------|
| 38 | slow-travel-hero | Slow travel hero image |
| 39 | slow-culture-1 | Slow travel culture |

### Slow Travel Videos (2) — 2s each
| # | File | Description |
|---|------|-------------|
| 40 | mallorca.MP4 | Mallorca destination clip |
| 41 | hero-video-3.MP4 | Fashion/destination clip |

### Slow Travel Stills (3) — 750ms each
| # | File | Description |
|---|------|-------------|
| 42 | slow-museum | Museum/gallery |
| 43 | slow-lunch | Slow lunch scene |
| 44 | destination-slow-travel | Slow travel destination card |

### Retreat Stills (3) — 750ms each
| # | File | Description |
|---|------|-------------|
| 45 | retreat-motion-1 | Retreat motion/lifestyle |
| 46 | retreat-ritual-1 | Retreat ritual/detail |
| 47 | destination-retreat | Retreat destination card |

### New York Stills (3) — 750ms each
| # | File | Description |
|---|------|-------------|
| 48 | new york 1.jpeg | New York street/scene |
| 49 | newyork_swan_room.jpeg | NYC swan room interior |
| 50 | newyork-hero | New York hero image |

### New York Video (1) — 2s
| # | File | Description |
|---|------|-------------|
| 51 | hero-video-4.MP4 | Fashion/destination clip |

### New York Stills (6) — 750ms each
| # | File | Description |
|---|------|-------------|
| 52 | nyc_washington_square.jpeg | Washington Square Park |
| 53 | new york 2.jpeg | New York street/scene |
| 54 | newyork-culture-1 | NYC culture |
| 55 | newyork-experience-1 | NYC experience |
| 56 | newyork-ritual-1 | NYC ritual/detail |
| 57 | destination-new-york | New York destination card |

---

## Text Sequence (overlaid on media, independent timer)

| # | Type | Content | Position | Duration |
|---|------|---------|----------|----------|
| 1-3 | silent | — | — | 1,300ms × 3 |
| 4 | scattered | HO · LA | HO: top-left, LA: bottom-right | 3,500ms |
| 5-6 | silent | — | — | 1,300ms × 2 |
| 7 | text | TRAVEL | center-bottom | ~2,200ms |
| 8-10 | silent | — | — | 1,300ms × 3 |
| 11 | silent | — | — | 1,300ms |
| 12 | whitecard | MOROCCO | lower-left, cream bg | ~2,600ms |
| 13-15 | silent | — | — | 1,300ms × 3 |
| 16 | text | ΓΕΙΑ | bottom-left, large | ~1,800ms |
| 17-18 | silent | — | — | 1,300ms × 2 |
| 19 | text | TIPS | center-bottom | ~1,800ms |
| 20-22 | silent | — | — | 1,300ms × 3 |
| 23 | silent | — | — | 1,300ms |
| 24 | whitecard | HYDRA | lower-left, cream bg | ~2,200ms |
| 25-27 | silent | — | — | 1,300ms × 3 |
| 28 | text | こんにちは | top-right, large | ~2,000ms |
| 29-30 | silent | — | — | 1,300ms × 2 |
| 31 | text | MEMORIES | center-bottom | ~2,600ms |
| 32-34 | silent | — | — | 1,300ms × 3 |
| 35 | scattered | SA · LU · TE | SA: top-left, LU: mid-right, TE: bottom-left | 3,500ms |
| 36-38 | silent | — | — | 1,300ms × 3 |
| 39 | silent | — | — | 1,300ms |
| 40 | whitecard | MALLORCA | lower-left, cream bg | ~2,800ms |
| 41-43 | silent | — | — | 1,300ms × 3 |
| 44 | text | مرحبا | bottom-right, large | ~2,000ms |
| 45-46 | silent | — | — | 1,300ms × 2 |
| 47 | text | SHOP | center-bottom | ~1,800ms |
| 48-49 | silent | — | — | 1,300ms × 2 |
| 50 | text | שלום | top-left, large | ~1,800ms |
| 51-53 | silent | — | — | 1,300ms × 3 |
| 54 | text | HELLO | center-bottom | ~2,000ms |
| 55-57 | silent | — | — | 1,300ms × 3 |

**Text loop total:** ~57 moments ≈ ~82 seconds

---

## Storage Locations

| Prefix | Path |
|--------|------|
| BLOB_BASE | `dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/` |
| GUIDE_BASE | `dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/` |
| VIDEO_BASE | `dzjf7ytng5vblbwy.public.blob.vercel-storage.com/` (root) |
| V2 | `dzjf7ytng5vblbwy.public.blob.vercel-storage.com/4.3/` |

---

## Anti-Flicker System
- All stills preloaded on mount (with 4s fallback timeout)
- Next video preloaded via `<link rel=preload as=video>`
- Previous still rendered behind current as fallback layer
- Fixed silent durations (no randomness) to prevent timing jitter
- Media timer pauses during white card moments
