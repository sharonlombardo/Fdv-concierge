export interface ImageSlot {
  key: string;
  label: string;
  section: string;
  defaultUrl: string;
  aspectRatio?: string;
  description?: string;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  // ========================================
  // THE CURRENT - OPENING
  // ========================================
  {
    key: "opening-cover",
    label: "Opening Cover",
    section: "The Current: Opening",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600",
    aspectRatio: "16:9",
    description: "Main magazine cover hero image"
  },
  {
    key: "opening-edit-1",
    label: "Morning Light",
    section: "The Current: Opening",
    defaultUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Today's Edit grid tile"
  },
  {
    key: "opening-edit-2",
    label: "Linen Layers",
    section: "The Current: Opening",
    defaultUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Today's Edit grid tile"
  },
  {
    key: "opening-edit-3",
    label: "Quiet Moment",
    section: "The Current: Opening",
    defaultUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Today's Edit grid tile"
  },
  {
    key: "opening-edit-4",
    label: "Woven Bag",
    section: "The Current: Opening",
    defaultUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Today's Edit grid tile"
  },
  {
    key: "opening-edit-5",
    label: "Desert Vista",
    section: "The Current: Opening",
    defaultUrl: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Today's Edit grid tile"
  },

  // ========================================
  // THE CURRENT - MOROCCO
  // ========================================
  {
    key: "morocco-hero",
    label: "Morocco Hero",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=1600",
    aspectRatio: "16:9",
    description: "Morocco, In Full Color - main hero"
  },
  {
    key: "morocco-style-1",
    label: "Dressing into the scene",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Style moment block image"
  },
  {
    key: "morocco-texture-1",
    label: "The visual pleasure",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Texture moment block image"
  },
  {
    key: "morocco-tile-1",
    label: "Tile close-up",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Pattern and Pleasure grid"
  },
  {
    key: "morocco-tile-2",
    label: "Rooftop dinner",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Pattern and Pleasure grid"
  },
  {
    key: "morocco-tile-3",
    label: "Linen look",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Pattern and Pleasure grid"
  },
  {
    key: "morocco-tile-4",
    label: "Brass detail",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Pattern and Pleasure grid"
  },
  {
    key: "morocco-tile-5",
    label: "Morning courtyard",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Pattern and Pleasure grid"
  },
  {
    key: "morocco-tile-6",
    label: "Market color",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Pattern and Pleasure grid"
  },
  {
    key: "morocco-object-1",
    label: "What travels well here",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Objects moment block image"
  },
  {
    key: "morocco-experience-1",
    label: "Evenings done properly",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Experience moment block image"
  },
  {
    key: "morocco-motion-1",
    label: "Pattern moving in heat",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Motion loop video placeholder"
  },
  {
    key: "morocco-ritual-1",
    label: "Between places",
    section: "The Current: Morocco",
    defaultUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Ritual moment block image"
  },

  // ========================================
  // THE CURRENT - HYDRA
  // ========================================
  {
    key: "hydra-hero",
    label: "Hydra Hero",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1600",
    aspectRatio: "16:9",
    description: "The Art of Arrival - main hero"
  },
  {
    key: "hydra-style-1",
    label: "Dressing for stillness",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Style moment block image"
  },
  {
    key: "hydra-texture-1",
    label: "Stone, water, skin",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Texture moment block image"
  },
  {
    key: "hydra-tile-1",
    label: "Stone wall",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Essentials Only grid"
  },
  {
    key: "hydra-tile-2",
    label: "Swim morning",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Essentials Only grid"
  },
  {
    key: "hydra-tile-3",
    label: "White linen look",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Essentials Only grid"
  },
  {
    key: "hydra-tile-4",
    label: "Leather sandal",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Essentials Only grid"
  },
  {
    key: "hydra-tile-5",
    label: "Woven bag",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Essentials Only grid"
  },
  {
    key: "hydra-tile-6",
    label: "Late lunch table",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Essentials Only grid"
  },
  {
    key: "hydra-object-1",
    label: "What belongs",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Objects moment block image"
  },
  {
    key: "hydra-light-1",
    label: "Light and Water - Morning",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Two-up feature left image"
  },
  {
    key: "hydra-light-2",
    label: "Light and Water - Afternoon",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Two-up feature right image"
  },
  {
    key: "hydra-ritual-1",
    label: "The daily cadence",
    section: "The Current: Hydra",
    defaultUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Ritual moment block image"
  },

  // ========================================
  // THE CURRENT - SLOW TRAVEL
  // ========================================
  {
    key: "slow-travel-hero",
    label: "Slow Travel Hero",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1600",
    aspectRatio: "16:9",
    description: "Less, But Longer - main hero"
  },
  {
    key: "slow-culture-1",
    label: "Editing as intelligence",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Culture moment block image"
  },
  {
    key: "slow-lunch",
    label: "Long lunch",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Two-up feature left image"
  },
  {
    key: "slow-museum",
    label: "Museum stair",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Two-up feature right image"
  },
  {
    key: "slow-style-1",
    label: "Repetition with intention",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Style moment block image"
  },
  {
    key: "slow-tile-1",
    label: "Same outfit day to night",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Repeat With Intention grid"
  },
  {
    key: "slow-tile-2",
    label: "Folded garment stack",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Repeat With Intention grid"
  },
  {
    key: "slow-tile-3",
    label: "Notebook",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Repeat With Intention grid"
  },
  {
    key: "slow-tile-4",
    label: "Café table",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Repeat With Intention grid"
  },
  {
    key: "slow-tile-5",
    label: "Walking shot",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Repeat With Intention grid"
  },
  {
    key: "slow-tile-6",
    label: "Light on wall",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Repeat With Intention grid"
  },
  {
    key: "slow-object-1",
    label: "What earns space",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Objects moment block image"
  },
  {
    key: "slow-ritual-1",
    label: "The daily anchor",
    section: "The Current: Slow Travel",
    defaultUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Ritual moment block image"
  },

  // ========================================
  // THE CURRENT - RETREAT
  // ========================================
  {
    key: "retreat-hero",
    label: "Retreat Hero",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600",
    aspectRatio: "16:9",
    description: "Movement, Then Stillness - main hero"
  },
  {
    key: "retreat-ritual-1",
    label: "Movement as calibration",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Ritual moment block image"
  },
  {
    key: "retreat-motion-1",
    label: "Breath. Water. Walking.",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Motion loop video placeholder"
  },
  {
    key: "retreat-place-1",
    label: "Architecture that supports practice",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Place moment block image"
  },
  {
    key: "retreat-tile-1",
    label: "Wrap",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "What Belongs grid"
  },
  {
    key: "retreat-tile-2",
    label: "Oil",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "What Belongs grid"
  },
  {
    key: "retreat-tile-3",
    label: "Sandal",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "What Belongs grid"
  },
  {
    key: "retreat-tile-4",
    label: "Mat",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "What Belongs grid"
  },
  {
    key: "retreat-tile-5",
    label: "Quiet corridor",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "What Belongs grid"
  },
  {
    key: "retreat-tile-6",
    label: "Post-practice look",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "What Belongs grid"
  },
  {
    key: "retreat-object-1",
    label: "What belongs in practice",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Objects moment block image"
  },
  {
    key: "retreat-style-1",
    label: "Dressing after movement",
    section: "The Current: Retreat",
    defaultUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Style moment block image"
  },

  // ========================================
  // THE CURRENT - NEW YORK
  // ========================================
  {
    key: "newyork-hero",
    label: "New York Hero",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1600",
    aspectRatio: "16:9",
    description: "The Weekend That Holds - main hero"
  },
  {
    key: "newyork-style-1",
    label: "Dressing for the city's pace",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Style moment block image"
  },
  {
    key: "newyork-culture-1",
    label: "Choosing where to look",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Culture moment block image"
  },
  {
    key: "ny-tile-1",
    label: "Bar interior",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Night Plan grid"
  },
  {
    key: "ny-tile-2",
    label: "Dinner table",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Night Plan grid"
  },
  {
    key: "ny-tile-3",
    label: "Gallery wall",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Night Plan grid"
  },
  {
    key: "ny-tile-4",
    label: "Coat look",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Night Plan grid"
  },
  {
    key: "ny-tile-5",
    label: "Boot or flat",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Night Plan grid"
  },
  {
    key: "ny-tile-6",
    label: "Subway platform",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Night Plan grid"
  },
  {
    key: "newyork-experience-1",
    label: "Evenings done well",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Experience moment block image"
  },
  {
    key: "ny-culture-1",
    label: "Culture Hour - Museum stair",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Two-up feature left image"
  },
  {
    key: "ny-culture-2",
    label: "Culture Hour - Gallery quiet room",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Two-up feature right image"
  },
  {
    key: "newyork-object-1",
    label: "What carries the weekend",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Objects moment block image"
  },
  {
    key: "ny-reset-1",
    label: "Coffee walk",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Sunday Reset grid"
  },
  {
    key: "ny-reset-2",
    label: "Notebook",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Sunday Reset grid"
  },
  {
    key: "ny-reset-3",
    label: "Sunglasses",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Sunday Reset grid"
  },
  {
    key: "ny-reset-4",
    label: "Empty street morning",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Sunday Reset grid"
  },
  {
    key: "newyork-ritual-1",
    label: "Sunday containment",
    section: "The Current: New York",
    defaultUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Ritual moment block image"
  },

  // ========================================
  // OTHER SECTIONS
  // ========================================
  {
    key: "transition-frame-1",
    label: "Frame 1: Desert Architecture",
    section: "Trip Transition",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Remembering what resonated..."
  },
  {
    key: "transition-frame-2",
    label: "Frame 2: Linen/Fabric",
    section: "Trip Transition",
    defaultUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Building your aesthetic..."
  },
  {
    key: "transition-frame-3",
    label: "Frame 3: Kasbah/Hotel",
    section: "Trip Transition",
    defaultUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Finding the places..."
  },
  {
    key: "transition-frame-4",
    label: "Frame 4: Styled Outfit",
    section: "Trip Transition",
    defaultUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Curating your experience..."
  },
  {
    key: "transition-frame-5",
    label: "Frame 5: Desert Sunset",
    section: "Trip Transition",
    defaultUrl: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Creating your journey..."
  },
  {
    key: "suitcase-capsule-card",
    label: "Edit Card Preview",
    section: "Suitcase",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "16:10",
    description: "Desert Neutrals card in Today's Edit tab"
  },

  // ========================================
  // LANDING PAGE (THRESHOLD)
  // ========================================
  {
    key: "landing-hero",
    label: "Landing Page Hero",
    section: "Landing Page",
    defaultUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1600",
    aspectRatio: "16:9",
    description: "Main background image for FIL DE VIE CONCIERGE landing"
  },
  {
    key: "todays-edit-card",
    label: "Today's Edit Card",
    section: "Landing Page",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Morocco 2026 card background"
  },

  // ========================================
  // HOME PAGE - ITINERARY
  // ========================================
  {
    key: "cover-main",
    label: "Main Cover Hero",
    section: "Home: Cover",
    defaultUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:9",
    description: "Morocco trip cover hero image"
  },
  {
    key: "day-1-hero",
    label: "Day 1 Hero",
    section: "Home: Day Heroes",
    defaultUrl: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:18",
    description: "Day 1: Arrival / Atlas Mountains"
  },
  {
    key: "day-2-hero",
    label: "Day 2 Hero",
    section: "Home: Day Heroes",
    defaultUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:18",
    description: "Day 2: Atlas Mountains"
  },
  {
    key: "day-3-hero",
    label: "Day 3 Hero",
    section: "Home: Day Heroes",
    defaultUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:18",
    description: "Day 3: Atlas Mountains → Marrakech"
  },
  {
    key: "day-4-hero",
    label: "Day 4 Hero",
    section: "Home: Day Heroes",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:18",
    description: "Day 4: Marrakech"
  },
  {
    key: "day-5-hero",
    label: "Day 5 Hero",
    section: "Home: Day Heroes",
    defaultUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:18",
    description: "Day 5: Essaouira Day Trip"
  },
  {
    key: "day-6-hero",
    label: "Day 6 Hero",
    section: "Home: Day Heroes",
    defaultUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:18",
    description: "Day 6: Marrakech Culture & Food"
  },
  {
    key: "day-7-hero",
    label: "Day 7 Hero",
    section: "Home: Day Heroes",
    defaultUrl: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:18",
    description: "Day 7: Marrakech & Agafay Desert"
  },
  {
    key: "day-8-hero",
    label: "Day 8 Hero",
    section: "Home: Day Heroes",
    defaultUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "21:18",
    description: "Day 8: Return"
  }
];

export function getSlotsBySection(): Record<string, ImageSlot[]> {
  const grouped: Record<string, ImageSlot[]> = {};
  for (const slot of IMAGE_SLOTS) {
    if (!grouped[slot.section]) {
      grouped[slot.section] = [];
    }
    grouped[slot.section].push(slot);
  }
  return grouped;
}

export function getSlotByKey(key: string): ImageSlot | undefined {
  return IMAGE_SLOTS.find(slot => slot.key === key);
}
