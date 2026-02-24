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
  // DESTINATIONS OVERVIEW
  // ========================================
  {
    key: "destination-morocco",
    label: "Morocco Card",
    section: "Destinations",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "4:5",
    description: "Morocco destination card image"
  },
  {
    key: "destination-hydra",
    label: "Hydra Card",
    section: "Destinations",
    defaultUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "4:5",
    description: "Hydra destination card image"
  },
  {
    key: "destination-slow-travel",
    label: "Slow Travel Card",
    section: "Destinations",
    defaultUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "4:5",
    description: "Slow Travel destination card image"
  },
  {
    key: "destination-retreat",
    label: "Retreat Card",
    section: "Destinations",
    defaultUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "4:5",
    description: "Retreat destination card image"
  },
  {
    key: "destination-new-york",
    label: "New York Card",
    section: "Destinations",
    defaultUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "4:5",
    description: "New York destination card image"
  },

  // ========================================
  // TODAY'S EDIT (DESERT NEUTRALS)
  // ========================================
  {
    key: "todays-edit-mood-1",
    label: "Mood 1 (Large)",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Large mood/inspiration image 1"
  },
  {
    key: "todays-edit-mood-2",
    label: "Mood 2 (Large)",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Large mood/inspiration image 2"
  },
  {
    key: "todays-edit-mood-3",
    label: "Mood 3 (Large)",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Large mood/inspiration image 3"
  },
  {
    key: "todays-edit-mood-4",
    label: "Mood 4 (Large)",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Large mood/inspiration image 4"
  },
  {
    key: "todays-edit-look-1",
    label: "Look/Product 1",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Smaller look or product image 1"
  },
  {
    key: "todays-edit-look-2",
    label: "Look/Product 2",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Smaller look or product image 2"
  },
  {
    key: "todays-edit-look-3",
    label: "Look/Product 3",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Smaller look or product image 3"
  },
  {
    key: "todays-edit-look-4",
    label: "Look/Product 4",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Smaller look or product image 4"
  },
  {
    key: "todays-edit-look-5",
    label: "Look/Product 5",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Smaller look or product image 5"
  },
  {
    key: "todays-edit-look-6",
    label: "Look/Product 6",
    section: "Today's Edit",
    defaultUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Smaller look or product image 6"
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
    description: "Main background image for FIL DE VIE CONCIERGE landing (fallback poster)"
  },
  {
    key: "landing-video",
    label: "Landing Page Video",
    section: "Landing Page",
    defaultUrl: "",
    aspectRatio: "16:9",
    description: "MP4 video for FIL DE VIE CONCIERGE landing hero background"
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
  // MOROCCO EDITORIAL: DAY 1 - ARRIVAL
  // ========================================
  {
    key: "d1-hero",
    label: "Day 1 Header Image",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Large image at top of Day 1 section (before event cards)"
  },
  {
    key: "d1-1",
    label: "1. Marrakech Menara Airport",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "First event card - Airport arrival"
  },
  {
    key: "d1-1-wardrobe",
    label: "1. Arrival Style (Wardrobe)",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Wardrobe for airport arrival"
  },
  {
    key: "d1-2",
    label: "2. Transfer to Atlas Mountains",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Second event card - Transfer"
  },
  {
    key: "d1-3",
    label: "3. Check-in at Kasbah",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1505089182331-50e58f00062b?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Third event card - Kasbah check-in"
  },
  {
    key: "d1-3-wardrobe",
    label: "3. Mountain Casual (Wardrobe)",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Wardrobe for Kasbah check-in"
  },
  {
    key: "d1-4",
    label: "4. Walk the Grounds",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1536713009761-0d3815e109d9?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Fourth event card"
  },
  {
    key: "d1-5",
    label: "5. Settle In and Rest",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Fifth event card"
  },
  {
    key: "d1-6",
    label: "6. Dinner at the Kasbah",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Sixth event card - Dinner"
  },
  {
    key: "d1-6-wardrobe",
    label: "6. Evening Knitwear (Wardrobe)",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Wardrobe for dinner"
  },
  {
    key: "d1-7",
    label: "7. Early Night",
    section: "Morocco Editorial: Day 1",
    defaultUrl: "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Seventh event card"
  },

  // ========================================
  // MOROCCO EDITORIAL: DAY 2 - ATLAS MOUNTAINS
  // ========================================
  {
    key: "d2-hero",
    label: "Day 2 Header Image",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Large image at top of Day 2 section"
  },
  {
    key: "d2-1",
    label: "1. Breakfast at the Kasbah",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "First event card"
  },
  {
    key: "d2-1-wardrobe",
    label: "1. Morning Layers (Wardrobe)",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Wardrobe for breakfast"
  },
  {
    key: "d2-2",
    label: "2. Walk the Grounds",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1536713009761-0d3815e109d9?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Second event card"
  },
  {
    key: "d2-3",
    label: "3. Optional Village Walk",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Third event card"
  },
  {
    key: "d2-4",
    label: "4. Lunch at the Kasbah",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Organic garden produce"
  },
  {
    key: "d2-4-wardrobe",
    label: "Afternoon Layers",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Relaxed light and breathable"
  },
  {
    key: "d2-5",
    label: "Pool or Terrace Time",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Mountain midday sun by infinity pool"
  },
  {
    key: "d2-6",
    label: "Reading, Walking, or Rest",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Intentionally unstructured time"
  },
  {
    key: "d2-7",
    label: "Dinner at the Kasbah",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Mountain views and organic cuisine"
  },
  {
    key: "d2-7-wardrobe",
    label: "Mountain Evening Wrap",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Warm knitwear for mountain evening"
  },
  {
    key: "d2-8",
    label: "Early Night",
    section: "Morocco Editorial: Day 2",
    defaultUrl: "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Rest before Marrakech transition"
  },

  // ========================================
  // MOROCCO EDITORIAL: DAY 3 - ATLAS TO MARRAKECH
  // ========================================
  {
    key: "d3-hero",
    label: "Day 3 Header Image",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Large image at top of Day 3 section"
  },
  {
    key: "d3-1",
    label: "1. Breakfast at the Kasbah",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Final breakfast with mountain views"
  },
  {
    key: "d3-1-wardrobe",
    label: "Morning Comfort",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Relaxed linen or cotton"
  },
  {
    key: "d3-2",
    label: "Final Walk and Views",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1536713009761-0d3815e109d9?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Last walk through the grounds"
  },
  {
    key: "d3-3",
    label: "Transfer to Marrakech",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Descend into the Red City"
  },
  {
    key: "d3-4",
    label: "Optional Stop at Anima Garden",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Andre Heller's fantastical garden"
  },
  {
    key: "d3-5",
    label: "Check-in at El Fenn",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1534067783941-51c9c23ea337?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Sanctuary of bold colors and art"
  },
  {
    key: "d3-5-wardrobe",
    label: "Urban Chic Transition",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Polished linen sets"
  },
  {
    key: "d3-6",
    label: "Explore Courtyards",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Hidden corners and art pieces"
  },
  {
    key: "d3-7",
    label: "Visit El Fenn Gift Shop",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1531501410720-c8d437636169?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Curated Moroccan crafts"
  },
  {
    key: "d3-8",
    label: "Rooftop Snacks and Cocktails",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Watch the light change over Medina"
  },
  {
    key: "d3-9",
    label: "Dinner at El Fenn Rooftop",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Sunset views over Koutoubia"
  },
  {
    key: "d3-9-wardrobe",
    label: "Cocktail Attire",
    section: "Morocco Editorial: Day 3",
    defaultUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Elevated but comfortable"
  },

  // ========================================
  // MOROCCO EDITORIAL: DAY 4 - MARRAKECH
  // ========================================
  {
    key: "d4-hero",
    label: "Day 4 Header Image",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Large image at top of Day 4 section"
  },
  {
    key: "d4-1",
    label: "1. Breakfast at the Riad",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Fresh pastries and mint tea"
  },
  {
    key: "d4-1-wardrobe",
    label: "Morning Linen",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Relaxed linen or cotton layers"
  },
  {
    key: "d4-2",
    label: "Dar El Bacha",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Stunning 1910 pasha's palace"
  },
  {
    key: "d4-3",
    label: "Coffee at Bacha Coffee",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Legendary coffee in intricate tilework"
  },
  {
    key: "d4-4",
    label: "Lunch at Nomad",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Modern Moroccan rooftop terrace"
  },
  {
    key: "d4-4-wardrobe",
    label: "Smart Casual",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Light layers for terrace"
  },
  {
    key: "d4-5",
    label: "Badi Palace",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1553522991-71439aa62779?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "16th-century ruined palace"
  },
  {
    key: "d4-6",
    label: "Souk Cherifia",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1531501410720-c8d437636169?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Contemporary Moroccan design"
  },
  {
    key: "d4-7",
    label: "Mustapha Blaoui",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Legendary treasure house"
  },
  {
    key: "d4-8",
    label: "Rest at El Fenn",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Rooftop, pool, or quiet room"
  },
  {
    key: "d4-9",
    label: "Drinks at Royal Mansour",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Opulent hotel cocktails"
  },
  {
    key: "d4-9-wardrobe",
    label: "Evening Elegant",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Dress to match the setting"
  },
  {
    key: "d4-10",
    label: "Dinner at Dar Yacout",
    section: "Morocco Editorial: Day 4",
    defaultUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Legendary Moroccan banquet"
  },

  // ========================================
  // MOROCCO EDITORIAL: DAY 5 - ESSAOUIRA
  // ========================================
  {
    key: "d5-hero",
    label: "Day 5 Header Image",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Large image at top of Day 5 section"
  },
  {
    key: "d5-1",
    label: "1. Depart Marrakech",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Drive to the coast"
  },
  {
    key: "d5-1-wardrobe",
    label: "Coastal Layers",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1577900232427-18219b9166a3?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Windbreaker or light trench"
  },
  {
    key: "d5-2",
    label: "Walk Ramparts",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Walk the ramparts and old town"
  },
  {
    key: "d5-3",
    label: "Lunch at Dar Baba",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Seaside lunch"
  },
  {
    key: "d5-4",
    label: "Coastal E-bike Ride",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Ride along the coast"
  },
  {
    key: "d5-5",
    label: "Walk Along the Water",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Ocean horizon walk"
  },
  {
    key: "d5-6",
    label: "Return to Marrakech",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Return before dark"
  },
  {
    key: "d5-7",
    label: "Dinner at +61",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Evening dinner in Marrakech"
  },
  {
    key: "d5-7-wardrobe",
    label: "Evening Style",
    section: "Morocco Editorial: Day 5",
    defaultUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Relaxed evening attire"
  },

  // ========================================
  // MOROCCO EDITORIAL: DAY 6 - CULTURE & FOOD
  // ========================================
  {
    key: "d6-hero",
    label: "Day 6 Header Image",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Large image at top of Day 6 section"
  },
  {
    key: "d6-1",
    label: "1. Breakfast at the Riad",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Start the day at El Fenn"
  },
  {
    key: "d6-1-wardrobe",
    label: "Morning Layers",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Comfortable linen or cotton"
  },
  {
    key: "d6-2",
    label: "Saadian Tombs",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1553522991-71439aa62779?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Historic royal mausoleums"
  },
  {
    key: "d6-3",
    label: "MAP Marrakech",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Photography museum in Medina"
  },
  {
    key: "d6-4",
    label: "Lunch at La Famille",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Garden lunch spot"
  },
  {
    key: "d6-4-wardrobe",
    label: "Lunch Style",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Light and breathable"
  },
  {
    key: "d6-5",
    label: "Rest at El Fenn",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Afternoon recharge"
  },
  {
    key: "d6-6",
    label: "Cooking Workshop",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "La Maison Arabe cooking class"
  },
  {
    key: "d6-7",
    label: "Optional Hammam",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "El Fenn or La Mamounia spa"
  },
  {
    key: "d6-8",
    label: "Dinner at Terrasse des Epices",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Rooftop dinner in Medina"
  },
  {
    key: "d6-8-wardrobe",
    label: "Evening Attire",
    section: "Morocco Editorial: Day 6",
    defaultUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Elevated evening style"
  },

  // ========================================
  // MOROCCO EDITORIAL: DAY 7 - AGAFAY DESERT
  // ========================================
  {
    key: "d7-hero",
    label: "Day 7 Header Image",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Large image at top of Day 7 section"
  },
  {
    key: "d7-1",
    label: "1. Breakfast at the Riad",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Morning at El Fenn"
  },
  {
    key: "d7-1-wardrobe",
    label: "Morning Comfort",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Relaxed morning layers"
  },
  {
    key: "d7-2",
    label: "Jardin Majorelle",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Iconic cobalt blue gardens"
  },
  {
    key: "d7-3",
    label: "Yves Saint Laurent Museum",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Fashion exhibition and architecture"
  },
  {
    key: "d7-4",
    label: "Lunch at Royal Mansour",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Luxury lunch or drinks"
  },
  {
    key: "d7-4-wardrobe",
    label: "Smart Lunch Style",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Polished for Royal Mansour"
  },
  {
    key: "d7-5",
    label: "Transfer to Agafay Desert",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Drive to the stone desert"
  },
  {
    key: "d7-6",
    label: "Dune Buggy Ride",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Desert adventure"
  },
  {
    key: "d7-7",
    label: "Camel Ride at Sunset",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Classic sunset camel experience"
  },
  {
    key: "d7-7-wardrobe",
    label: "Desert Simple",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1577900232427-18219b9166a3?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Simple and beautiful, bring a wrap"
  },
  {
    key: "d7-8",
    label: "Dinner in the Desert",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Under the stars"
  },
  {
    key: "d7-9",
    label: "Return to Marrakech",
    section: "Morocco Editorial: Day 7",
    defaultUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Night drive back to the city"
  },

  // ========================================
  // MOROCCO EDITORIAL: DAY 8 - RETURN
  // ========================================
  {
    key: "d8-hero",
    label: "Day 8 Header Image",
    section: "Morocco Editorial: Day 8",
    defaultUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Large image at top of Day 8 section"
  },
  {
    key: "d8-1",
    label: "1. Breakfast at the Riad",
    section: "Morocco Editorial: Day 8",
    defaultUrl: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Final breakfast at El Fenn"
  },
  {
    key: "d8-1-wardrobe",
    label: "Travel Layers",
    section: "Morocco Editorial: Day 8",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "4:5",
    description: "Comfortable for the journey home"
  },
  {
    key: "d8-2",
    label: "Final Packing",
    section: "Morocco Editorial: Day 8",
    defaultUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Last morning preparations"
  },
  {
    key: "d8-3",
    label: "Check-out and Departure",
    section: "Morocco Editorial: Day 8",
    defaultUrl: "https://images.unsplash.com/photo-1534067783941-51c9c23ea337?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Farewell to El Fenn"
  },
  {
    key: "d8-4",
    label: "Transfer to Airport",
    section: "Morocco Editorial: Day 8",
    defaultUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Drive to Menara Airport"
  },
  {
    key: "d8-5",
    label: "International Flight",
    section: "Morocco Editorial: Day 8",
    defaultUrl: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Flight to New York"
  },
  {
    key: "d8-6",
    label: "Arrival in New York",
    section: "Morocco Editorial: Day 8",
    defaultUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Journey continues in a different rhythm"
  },

  // ========================================
  // MOROCCO EDITORIAL: WARDROBE EXTRAS
  // These are the 4 accessory slots for each wardrobe item
  // ========================================
  // Day 1 Extras
  { key: "d1-1-extra-0", label: "Arrival Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 arrival accessory 1" },
  { key: "d1-1-extra-1", label: "Arrival Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 arrival accessory 2" },
  { key: "d1-1-extra-2", label: "Arrival Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 arrival accessory 3" },
  { key: "d1-1-extra-3", label: "Arrival Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 arrival accessory 4" },
  { key: "d1-3-extra-0", label: "Kasbah Check-in Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 kasbah accessory 1" },
  { key: "d1-3-extra-1", label: "Kasbah Check-in Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 kasbah accessory 2" },
  { key: "d1-3-extra-2", label: "Kasbah Check-in Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 kasbah accessory 3" },
  { key: "d1-3-extra-3", label: "Kasbah Check-in Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 kasbah accessory 4" },
  { key: "d1-6-extra-0", label: "Kasbah Dinner Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 dinner accessory 1" },
  { key: "d1-6-extra-1", label: "Kasbah Dinner Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 dinner accessory 2" },
  { key: "d1-6-extra-2", label: "Kasbah Dinner Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 dinner accessory 3" },
  { key: "d1-6-extra-3", label: "Kasbah Dinner Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 1 dinner accessory 4" },
  // Day 2 Extras
  { key: "d2-1-extra-0", label: "Day 2 Breakfast Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 breakfast accessory 1" },
  { key: "d2-1-extra-1", label: "Day 2 Breakfast Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 breakfast accessory 2" },
  { key: "d2-1-extra-2", label: "Day 2 Breakfast Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 breakfast accessory 3" },
  { key: "d2-1-extra-3", label: "Day 2 Breakfast Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 breakfast accessory 4" },
  { key: "d2-4-extra-0", label: "Day 2 Lunch Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 lunch accessory 1" },
  { key: "d2-4-extra-1", label: "Day 2 Lunch Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 lunch accessory 2" },
  { key: "d2-4-extra-2", label: "Day 2 Lunch Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 lunch accessory 3" },
  { key: "d2-4-extra-3", label: "Day 2 Lunch Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 lunch accessory 4" },
  { key: "d2-7-extra-0", label: "Day 2 Dinner Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 dinner accessory 1" },
  { key: "d2-7-extra-1", label: "Day 2 Dinner Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 dinner accessory 2" },
  { key: "d2-7-extra-2", label: "Day 2 Dinner Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 dinner accessory 3" },
  { key: "d2-7-extra-3", label: "Day 2 Dinner Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 2 dinner accessory 4" },
  // Day 3 Extras
  { key: "d3-1-extra-0", label: "Day 3 Breakfast Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 breakfast accessory 1" },
  { key: "d3-1-extra-1", label: "Day 3 Breakfast Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 breakfast accessory 2" },
  { key: "d3-1-extra-2", label: "Day 3 Breakfast Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 breakfast accessory 3" },
  { key: "d3-1-extra-3", label: "Day 3 Breakfast Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 breakfast accessory 4" },
  { key: "d3-5-extra-0", label: "El Fenn Check-in Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 el fenn accessory 1" },
  { key: "d3-5-extra-1", label: "El Fenn Check-in Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 el fenn accessory 2" },
  { key: "d3-5-extra-2", label: "El Fenn Check-in Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 el fenn accessory 3" },
  { key: "d3-5-extra-3", label: "El Fenn Check-in Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 el fenn accessory 4" },
  { key: "d3-9-extra-0", label: "Day 3 Dinner Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 dinner accessory 1" },
  { key: "d3-9-extra-1", label: "Day 3 Dinner Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 dinner accessory 2" },
  { key: "d3-9-extra-2", label: "Day 3 Dinner Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 dinner accessory 3" },
  { key: "d3-9-extra-3", label: "Day 3 Dinner Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 3 dinner accessory 4" },
  // Day 4 Extras
  { key: "d4-1-extra-0", label: "Day 4 Breakfast Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 breakfast accessory 1" },
  { key: "d4-1-extra-1", label: "Day 4 Breakfast Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 breakfast accessory 2" },
  { key: "d4-1-extra-2", label: "Day 4 Breakfast Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 breakfast accessory 3" },
  { key: "d4-1-extra-3", label: "Day 4 Breakfast Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 breakfast accessory 4" },
  { key: "d4-4-extra-0", label: "Nomad Lunch Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 lunch accessory 1" },
  { key: "d4-4-extra-1", label: "Nomad Lunch Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 lunch accessory 2" },
  { key: "d4-4-extra-2", label: "Nomad Lunch Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 lunch accessory 3" },
  { key: "d4-4-extra-3", label: "Nomad Lunch Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 lunch accessory 4" },
  { key: "d4-9-extra-0", label: "Royal Mansour Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 evening accessory 1" },
  { key: "d4-9-extra-1", label: "Royal Mansour Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 evening accessory 2" },
  { key: "d4-9-extra-2", label: "Royal Mansour Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 evening accessory 3" },
  { key: "d4-9-extra-3", label: "Royal Mansour Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 4 evening accessory 4" },
  // Day 5 Extras
  { key: "d5-1-extra-0", label: "Day 5 Depart Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 5 depart accessory 1" },
  { key: "d5-1-extra-1", label: "Day 5 Depart Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 5 depart accessory 2" },
  { key: "d5-1-extra-2", label: "Day 5 Depart Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 5 depart accessory 3" },
  { key: "d5-1-extra-3", label: "Day 5 Depart Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 5 depart accessory 4" },
  { key: "d5-7-extra-0", label: "Day 5 Dinner Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 5 dinner accessory 1" },
  { key: "d5-7-extra-1", label: "Day 5 Dinner Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 5 dinner accessory 2" },
  { key: "d5-7-extra-2", label: "Day 5 Dinner Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 5 dinner accessory 3" },
  { key: "d5-7-extra-3", label: "Day 5 Dinner Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 5 dinner accessory 4" },
  // Day 6 Extras
  { key: "d6-1-extra-0", label: "Day 6 Breakfast Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 breakfast accessory 1" },
  { key: "d6-1-extra-1", label: "Day 6 Breakfast Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 breakfast accessory 2" },
  { key: "d6-1-extra-2", label: "Day 6 Breakfast Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 breakfast accessory 3" },
  { key: "d6-1-extra-3", label: "Day 6 Breakfast Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 breakfast accessory 4" },
  { key: "d6-4-extra-0", label: "La Famille Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 lunch accessory 1" },
  { key: "d6-4-extra-1", label: "La Famille Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 lunch accessory 2" },
  { key: "d6-4-extra-2", label: "La Famille Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 lunch accessory 3" },
  { key: "d6-4-extra-3", label: "La Famille Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 lunch accessory 4" },
  { key: "d6-8-extra-0", label: "Terrasse des Epices Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 dinner accessory 1" },
  { key: "d6-8-extra-1", label: "Terrasse des Epices Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 dinner accessory 2" },
  { key: "d6-8-extra-2", label: "Terrasse des Epices Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 dinner accessory 3" },
  { key: "d6-8-extra-3", label: "Terrasse des Epices Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 6 dinner accessory 4" },
  // Day 7 Extras
  { key: "d7-1-extra-0", label: "Day 7 Breakfast Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 breakfast accessory 1" },
  { key: "d7-1-extra-1", label: "Day 7 Breakfast Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 breakfast accessory 2" },
  { key: "d7-1-extra-2", label: "Day 7 Breakfast Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 breakfast accessory 3" },
  { key: "d7-1-extra-3", label: "Day 7 Breakfast Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 breakfast accessory 4" },
  { key: "d7-4-extra-0", label: "Royal Mansour Lunch Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 lunch accessory 1" },
  { key: "d7-4-extra-1", label: "Royal Mansour Lunch Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 lunch accessory 2" },
  { key: "d7-4-extra-2", label: "Royal Mansour Lunch Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 lunch accessory 3" },
  { key: "d7-4-extra-3", label: "Royal Mansour Lunch Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 lunch accessory 4" },
  { key: "d7-7-extra-0", label: "Desert Sunset Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 sunset accessory 1" },
  { key: "d7-7-extra-1", label: "Desert Sunset Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 sunset accessory 2" },
  { key: "d7-7-extra-2", label: "Desert Sunset Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 sunset accessory 3" },
  { key: "d7-7-extra-3", label: "Desert Sunset Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 7 sunset accessory 4" },
  // Day 8 Extras
  { key: "d8-1-extra-0", label: "Day 8 Breakfast Extra 1", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 8 breakfast accessory 1" },
  { key: "d8-1-extra-1", label: "Day 8 Breakfast Extra 2", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 8 breakfast accessory 2" },
  { key: "d8-1-extra-2", label: "Day 8 Breakfast Extra 3", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 8 breakfast accessory 3" },
  { key: "d8-1-extra-3", label: "Day 8 Breakfast Extra 4", section: "Morocco Editorial: Wardrobe Extras", defaultUrl: "", aspectRatio: "1:1", description: "Day 8 breakfast accessory 4" }
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
