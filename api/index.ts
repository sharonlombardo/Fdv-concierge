import type { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';
const { Pool } = pg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Image mappings from Vercel Blob (migrated from Replit)
const EMBEDDED_IMAGE_MAPPINGS: Record<string, string> = {
  "opening-cover": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/opening-cover",
  "opening-edit-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/opening-edit-1",
  "opening-edit-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/opening-edit-2",
  "opening-edit-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/opening-edit-4",
  "morocco-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-hero",
  "morocco-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-style-1",
  "morocco-texture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-texture-1",
  "morocco-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-1",
  "morocco-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-2",
  "morocco-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-3",
  "morocco-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-4",
  "morocco-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-5",
  "morocco-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-6",
  "morocco-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-object-1",
  "morocco-experience-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-experience-1",
  "morocco-motion-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-motion-1",
  "morocco-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-ritual-1",
  "hydra-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-hero",
  "hydra-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-style-1",
  "hydra-texture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-texture-1",
  "hydra-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-1",
  "hydra-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-2",
  "hydra-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-3",
  "hydra-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-4",
  "hydra-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-5",
  "hydra-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-tile-6",
  "hydra-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-object-1",
  "hydra-light-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-light-1",
  "hydra-light-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-light-2",
  "hydra-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/hydra-ritual-1",
  "slow-travel-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-travel-hero",
  "slow-culture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-culture-1",
  "slow-lunch": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-lunch",
  "slow-museum": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-museum",
  "slow-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-style-1",
  "slow-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-1",
  "slow-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-2",
  "slow-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-3",
  "slow-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-4",
  "slow-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-5",
  "slow-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-tile-6",
  "slow-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-object-1",
  "slow-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/slow-ritual-1",
  "retreat-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-hero",
  "retreat-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-ritual-1",
  "retreat-motion-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-motion-1",
  "retreat-place-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-place-1",
  "retreat-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-1",
  "retreat-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-2",
  "retreat-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-3",
  "retreat-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-4",
  "retreat-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-5",
  "retreat-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-tile-6",
  "retreat-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-object-1",
  "retreat-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/retreat-style-1",
  "newyork-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-hero",
  "newyork-style-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-style-1",
  "newyork-culture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-culture-1",
  "ny-tile-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-1",
  "ny-tile-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-2",
  "ny-tile-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-3",
  "ny-tile-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-4",
  "ny-tile-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-5",
  "ny-tile-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-tile-6",
  "newyork-experience-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-experience-1",
  "ny-culture-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-culture-1",
  "ny-culture-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-culture-2",
  "newyork-object-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-object-1",
  "ny-reset-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-reset-1",
  "ny-reset-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-reset-2",
  "ny-reset-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-reset-3",
  "ny-reset-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/ny-reset-4",
  "newyork-ritual-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/newyork-ritual-1",
  "transition-frame-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-1",
  "transition-frame-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-2",
  "transition-frame-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-3",
  "transition-frame-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-4",
  "transition-frame-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/transition-frame-5",
  "suitcase-capsule-card": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/suitcase-capsule-card",
  "destination-morocco": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-morocco",
  "destination-hydra": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-hydra",
  "destination-slow-travel": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-slow-travel",
  "destination-retreat": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-retreat",
  "destination-new-york": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/destination-new-york",
  "todays-edit-mood-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-mood-1",
  "todays-edit-mood-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-mood-2",
  "todays-edit-mood-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-mood-3",
  "todays-edit-mood-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-mood-4",
  "todays-edit-look-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-1",
  "todays-edit-look-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-2",
  "todays-edit-look-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-3",
  "todays-edit-look-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-4",
  "todays-edit-look-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-5",
  "todays-edit-look-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-look-6",
  "landing-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/landing-hero",
  "todays-edit-card": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/todays-edit-card",
  "d1-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-hero",
  "d1-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1",
  "d1-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-wardrobe",
  "d1-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-2",
  "d1-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3",
  "d1-3-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-wardrobe",
  "d1-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-4",
  "d1-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-5",
  "d1-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6",
  "d1-6-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-wardrobe",
  "d1-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-7",
  "d2-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-hero",
  "d2-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1",
  "d2-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-wardrobe",
  "d2-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-2",
  "d2-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-3",
  "d2-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4",
  "d2-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-wardrobe",
  "d2-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-5",
  "d2-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-6",
  "d2-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7",
  "d2-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-wardrobe",
  "d2-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-8",
  "d3-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-hero",
  "d3-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1",
  "d3-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-wardrobe",
  "d3-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-2",
  "d3-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-3",
  "d3-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-4",
  "d3-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5",
  "d3-5-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-wardrobe",
  "d3-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-6",
  "d3-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-7",
  "d3-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-8",
  "d3-9": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9",
  "d3-9-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-wardrobe",
  "d4-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-hero",
  "d4-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1",
  "d4-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-wardrobe",
  "d4-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-2",
  "d4-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-3",
  "d4-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4",
  "d4-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-wardrobe",
  "d4-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-5",
  "d4-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-6",
  "d4-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-7",
  "d4-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-8",
  "d4-9": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9",
  "d4-9-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-wardrobe",
  "d4-10": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-10",
  "d5-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-hero",
  "d5-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1",
  "d5-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-wardrobe",
  "d5-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-2",
  "d5-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-3",
  "d5-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-4",
  "d5-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-5",
  "d5-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-6",
  "d5-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7",
  "d5-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-wardrobe",
  "d6-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-hero",
  "d6-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1",
  "d6-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-wardrobe",
  "d6-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-2",
  "d6-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-3",
  "d6-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4",
  "d6-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-wardrobe",
  "d6-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-5",
  "d6-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-6",
  "d6-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-7",
  "d6-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8",
  "d6-8-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-wardrobe",
  "d7-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-hero",
  "d7-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1",
  "d7-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-wardrobe",
  "d7-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-2",
  "d7-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-3",
  "d7-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4",
  "d7-4-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-wardrobe",
  "d7-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-5",
  "d7-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-6",
  "d7-7": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7",
  "d7-7-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-7-wardrobe",
  "d7-8": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-8",
  "d7-9": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-9",
  "d8-hero": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-hero",
  "d8-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1",
  "d8-1-wardrobe": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-wardrobe",
  "d8-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-2",
  "d8-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-3",
  "d8-4": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-4",
  "d8-5": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-5",
  "d8-6": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-6",
  "d1-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-extra-0",
  "d1-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-extra-1",
  "d1-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-extra-2",
  "d1-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-1-extra-3",
  "d1-3-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-extra-0",
  "d1-3-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-extra-1",
  "d1-3-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-extra-2",
  "d1-3-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-3-extra-3",
  "d1-6-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-extra-0",
  "d1-6-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-extra-1",
  "d1-6-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-extra-2",
  "d1-6-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d1-6-extra-3",
  "d2-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-extra-0",
  "d2-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-extra-1",
  "d2-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-extra-2",
  "d2-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-1-extra-3",
  "d2-4-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-extra-0",
  "d2-4-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-extra-1",
  "d2-4-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-extra-2",
  "d2-4-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-4-extra-3",
  "d2-7-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-extra-0",
  "d2-7-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-extra-1",
  "d2-7-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-extra-2",
  "d2-7-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d2-7-extra-3",
  "d3-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-extra-0",
  "d3-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-extra-1",
  "d3-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-extra-2",
  "d3-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-1-extra-3",
  "d3-5-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-extra-0",
  "d3-5-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-extra-1",
  "d3-5-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-extra-2",
  "d3-5-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-5-extra-3",
  "d3-9-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-extra-0",
  "d3-9-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-extra-1",
  "d3-9-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-extra-2",
  "d3-9-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d3-9-extra-3",
  "d4-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-extra-0",
  "d4-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-extra-1",
  "d4-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-extra-2",
  "d4-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-1-extra-3",
  "d4-4-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-extra-0",
  "d4-4-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-extra-1",
  "d4-4-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-extra-2",
  "d4-4-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-4-extra-3",
  "d4-9-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-extra-0",
  "d4-9-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-extra-1",
  "d4-9-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-extra-2",
  "d4-9-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d4-9-extra-3",
  "d5-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-extra-0",
  "d5-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-extra-1",
  "d5-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-extra-2",
  "d5-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-1-extra-3",
  "d5-7-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-extra-0",
  "d5-7-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-extra-1",
  "d5-7-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-extra-2",
  "d5-7-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d5-7-extra-3",
  "d6-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-extra-0",
  "d6-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-extra-1",
  "d6-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-extra-2",
  "d6-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-1-extra-3",
  "d6-4-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-extra-0",
  "d6-4-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-extra-1",
  "d6-4-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-extra-2",
  "d6-4-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-4-extra-3",
  "d6-8-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-extra-0",
  "d6-8-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-extra-1",
  "d6-8-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-extra-2",
  "d6-8-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d6-8-extra-3",
  "d7-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-extra-0",
  "d7-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-extra-1",
  "d7-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-extra-2",
  "d7-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-1-extra-3",
  "d7-4-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-extra-0",
  "d7-4-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-extra-1",
  "d7-4-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-extra-2",
  "d7-4-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d7-4-extra-3",
  "d8-1-extra-0": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-0",
  "d8-1-extra-1": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-1",
  "d8-1-extra-2": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-2",
  "d8-1-extra-3": "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/d8-1-extra-3"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method } = req;
  const path = url?.split('?')[0] || '';

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/images - Return embedded image mappings
    if (path === '/api/images' || path === '/api') {
      const images = Object.entries(EMBEDDED_IMAGE_MAPPINGS).map(([key, imageUrl]) => ({
        id: 0,
        imageKey: key,
        customUrl: imageUrl,
        originalUrl: null,
        label: null,
        updatedAt: Date.now(),
      }));
      return res.status(200).json(images);
    }

    // GET /api/image-slots
    if (path === '/api/image-slots') {
      // Build slots array from mappings
      const slots = Object.entries(EMBEDDED_IMAGE_MAPPINGS).map(([key, imageUrl]) => ({
        key,
        label: key,
        section: 'Images',
        defaultUrl: imageUrl,
        currentUrl: imageUrl,
        hasCustomImage: true,
      }));
      return res.status(200).json({
        slots,
        grouped: {},
        mappings: EMBEDDED_IMAGE_MAPPINGS
      });
    }

    // GET /api/journal
    if (path === '/api/journal') {
      return res.status(200).json({});
    }

    // GET /api/saves
    if (path === '/api/saves' && method === 'GET') {
      const result = await pool.query('SELECT * FROM saves ORDER BY saved_at DESC');
      // Transform snake_case to camelCase for frontend
      const saves = result.rows.map(row => ({
        id: row.id,
        itemType: row.item_type,
        itemId: row.item_id,
        sourceContext: row.source_context,
        aestheticTags: row.aesthetic_tags,
        savedAt: row.saved_at,
        metadata: row.metadata,
        editionTag: row.edition_tag,
        storyTag: row.story_tag,
        editTag: row.edit_tag,
        purchaseStatus: row.purchase_status,
        title: row.title,
        assetUrl: row.asset_url,
        brand: row.brand,
        price: row.price,
        shopUrl: row.shop_url,
        bookUrl: row.book_url,
        detailDescription: row.detail_description,
        category: row.category,
        isCurated: row.is_curated,
      }));
      return res.status(200).json(saves);
    }

    // GET /api/saves/detail/:itemId
    if (path.startsWith('/api/saves/detail/')) {
      const itemId = path.replace('/api/saves/detail/', '');
      const result = await pool.query(
        'SELECT brand, price, shop_url, book_url, detail_description, category, is_curated FROM saves WHERE item_id = $1',
        [itemId]
      );
      if (result.rows.length === 0) {
        return res.status(200).json({});
      }
      const row = result.rows[0];
      return res.status(200).json({
        brand: row.brand,
        price: row.price,
        shopUrl: row.shop_url,
        bookUrl: row.book_url,
        detailDescription: row.detail_description,
        category: row.category,
        isCurated: row.is_curated,
      });
    }

    // GET /api/saves/check/:itemId
    if (path.startsWith('/api/saves/check/')) {
      const itemId = decodeURIComponent(path.replace('/api/saves/check/', ''));
      const result = await pool.query('SELECT id FROM saves WHERE item_id = $1 LIMIT 1', [itemId]);
      return res.status(200).json({ isPinned: result.rows.length > 0 });
    }

    // POST /api/saves — create a new save
    if (path === '/api/saves' && method === 'POST') {
      const body = req.body || {};
      const { itemType, itemId, sourceContext, aestheticTags, savedAt, metadata, editionTag, storyTag, editTag, purchaseStatus, title, assetUrl, brand, price, shopUrl, bookUrl, detailDescription, category, isCurated } = body;

      if (!itemType || !itemId) {
        return res.status(400).json({ error: 'itemType and itemId are required' });
      }

      // Check if already exists
      const existing = await pool.query('SELECT id FROM saves WHERE item_id = $1 LIMIT 1', [itemId]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Already pinned' });
      }

      const result = await pool.query(
        `INSERT INTO saves (item_type, item_id, source_context, aesthetic_tags, saved_at, metadata, edition_tag, story_tag, edit_tag, purchase_status, title, asset_url, brand, price, shop_url, book_url, detail_description, category, is_curated)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
         RETURNING *`,
        [
          itemType,
          itemId,
          sourceContext || null,
          aestheticTags || null,
          savedAt || Date.now(),
          metadata ? JSON.stringify(metadata) : null,
          editionTag || null,
          storyTag || null,
          editTag || null,
          purchaseStatus || null,
          title || null,
          assetUrl || null,
          brand || null,
          price || null,
          shopUrl || null,
          bookUrl || null,
          detailDescription || null,
          category || null,
          isCurated || false,
        ]
      );
      const row = result.rows[0];
      return res.status(200).json({
        id: row.id,
        itemType: row.item_type,
        itemId: row.item_id,
        sourceContext: row.source_context,
        aestheticTags: row.aesthetic_tags,
        savedAt: row.saved_at,
        metadata: row.metadata,
        editionTag: row.edition_tag,
        storyTag: row.story_tag,
        editTag: row.edit_tag,
        purchaseStatus: row.purchase_status,
        title: row.title,
        assetUrl: row.asset_url,
      });
    }

    // DELETE /api/saves/:itemId — remove a save
    if (path.startsWith('/api/saves/') && method === 'DELETE') {
      const itemId = decodeURIComponent(path.replace('/api/saves/', ''));
      await pool.query('DELETE FROM saves WHERE item_id = $1', [itemId]);
      return res.status(200).json({ success: true });
    }

    // PATCH /api/saves/:itemId — update a save
    if (path.startsWith('/api/saves/') && method === 'PATCH') {
      const itemId = decodeURIComponent(path.replace('/api/saves/', ''));
      const { metadata, purchaseStatus } = req.body || {};
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (metadata !== undefined) {
        updates.push(`metadata = $${paramIndex}`);
        values.push(JSON.stringify(metadata));
        paramIndex++;
      }
      if (purchaseStatus !== undefined) {
        updates.push(`purchase_status = $${paramIndex}`);
        values.push(purchaseStatus);
        paramIndex++;
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(itemId);
      const result = await pool.query(
        `UPDATE saves SET ${updates.join(', ')} WHERE item_id = $${paramIndex} RETURNING *`,
        values
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Save not found' });
      }
      return res.status(200).json(result.rows[0]);
    }

    // GET /api/library
    if (path === '/api/library') {
      return res.status(200).json([]);
    }

    // GET /api/rules
    if (path === '/api/rules') {
      return res.status(200).json([]);
    }

    // GET /api/selfies
    if (path === '/api/selfies') {
      return res.status(200).json([]);
    }

    // POST /api/waitlist — coming soon notify me
    if (path === '/api/waitlist' && method === 'POST') {
      const { email, itemTitle, itemId, source } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }
      try {
        await pool.query(
          `INSERT INTO waitlist (email, item_title, item_id, source, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (email, item_id) DO NOTHING`,
          [email, itemTitle || null, itemId || null, source || 'coming_soon_notify']
        );
      } catch (dbError: any) {
        // Table may not exist yet — create it
        if (dbError.code === '42P01') {
          await pool.query(`
            CREATE TABLE IF NOT EXISTS waitlist (
              id SERIAL PRIMARY KEY,
              email TEXT NOT NULL,
              item_title TEXT,
              item_id TEXT,
              source TEXT DEFAULT 'coming_soon_notify',
              created_at TIMESTAMP DEFAULT NOW(),
              UNIQUE(email, item_id)
            )
          `);
          await pool.query(
            'INSERT INTO waitlist (email, item_title, item_id, source, created_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (email, item_id) DO NOTHING',
            [email, itemTitle || null, itemId || null, source || 'coming_soon_notify']
          );
        } else {
          console.warn('Waitlist insert failed:', dbError);
        }
      }
      return res.status(200).json({ success: true });
    }

    // POST /api/events — event tracking
    if (path === '/api/events' && method === 'POST') {
      const { eventType, itemId, destinationUrl, sourcePage, metadata } = req.body || {};
      if (!eventType) {
        return res.status(400).json({ error: 'eventType is required' });
      }
      try {
        await pool.query(
          'INSERT INTO events (event_type, item_id, destination_url, source_page, metadata, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
          [eventType, itemId || null, destinationUrl || null, sourcePage || null, metadata ? JSON.stringify(metadata) : null]
        );
      } catch (dbError) {
        console.warn('Events table insert failed (table may not exist):', dbError);
      }
      return res.status(200).json({ success: true, eventType, itemId });
    }

    // POST handlers (stub for any uncaught POST)
    if (method === 'POST') {
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: 'Not found', path });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
