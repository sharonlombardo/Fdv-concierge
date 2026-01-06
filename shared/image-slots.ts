export interface ImageSlot {
  key: string;
  label: string;
  section: string;
  defaultUrl: string;
  aspectRatio?: string;
  description?: string;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  // Transition Animation Frames
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

  // Desert Neutrals Capsule
  {
    key: "capsule-hero",
    label: "Capsule Hero Image",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600",
    aspectRatio: "16:9",
    description: "Main hero for the capsule collection"
  },
  {
    key: "capsule-item-1",
    label: "Linen Wrap Dress",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Fil de Vie - Base Layer"
  },
  {
    key: "capsule-item-2",
    label: "Relaxed Linen Trousers",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Mara Hoffman - Base Layer"
  },
  {
    key: "capsule-item-3",
    label: "Silk Cami",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Esse - Base Layer"
  },
  {
    key: "capsule-item-4",
    label: "Cotton Poplin Shirt",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Totême - Base Layer"
  },
  {
    key: "capsule-item-5",
    label: "Woven Basket Bag",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Loewe - Statement Piece"
  },
  {
    key: "capsule-item-6",
    label: "Crochet Cover-Up",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Cult Gaia - Statement Piece"
  },
  {
    key: "capsule-item-7",
    label: "Le Chiquito Long",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Jacquemus - Statement Piece"
  },
  {
    key: "capsule-item-8",
    label: "Triomphe Sunglasses",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Celine - Accessory"
  },
  {
    key: "capsule-item-9",
    label: "Gold Hoops",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Agmes - Accessory"
  },
  {
    key: "capsule-item-10",
    label: "Silk Scarf",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Johanna Ortiz - Accessory"
  },
  {
    key: "capsule-item-11",
    label: "Evening Caftan",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Fil de Vie - Evening"
  },
  {
    key: "capsule-item-12",
    label: "Strappy Sandals",
    section: "Desert Neutrals Capsule",
    defaultUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "3:4",
    description: "Aquazzura - Evening"
  },

  // The Current Feed
  {
    key: "current-article-1",
    label: "Article: Riads of Marrakech",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Editorial feature article"
  },
  {
    key: "current-article-2",
    label: "Article: Desert Light",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Editorial feature article"
  },
  {
    key: "current-style-1",
    label: "Style: Earth Tones",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "3:4",
    description: "Style card"
  },
  {
    key: "current-scene-1",
    label: "Scene: Morning Courtyard",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Scene mood image"
  },
  {
    key: "current-quote-1",
    label: "Quote Background",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "16:9",
    description: "Quote card background"
  },
  {
    key: "current-article-3",
    label: "Article: Coastal Essaouira",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Editorial feature article"
  },
  {
    key: "current-style-2",
    label: "Style: Layered Look",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "3:4",
    description: "Style card"
  },
  {
    key: "current-scene-2",
    label: "Scene: Evening Terrace",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    aspectRatio: "1:1",
    description: "Scene mood image"
  },
  {
    key: "current-article-4",
    label: "Article: Atlas Adventure",
    section: "The Current Feed",
    defaultUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    aspectRatio: "16:9",
    description: "Editorial feature article"
  },

  // Suitcase Capsule Card
  {
    key: "suitcase-capsule-card",
    label: "Capsule Card Preview",
    section: "Suitcase",
    defaultUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800",
    aspectRatio: "16:10",
    description: "Desert Neutrals card in Capsules tab"
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
