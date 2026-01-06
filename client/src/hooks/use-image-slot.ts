import { useQuery } from "@tanstack/react-query";

interface ImageSlotData {
  key: string;
  label: string;
  section: string;
  defaultUrl: string;
  currentUrl: string;
  hasCustomImage: boolean;
  aspectRatio?: string;
  description?: string;
}

interface ImageSlotsResponse {
  slots: ImageSlotData[];
  grouped: Record<string, ImageSlotData[]>;
}

export function useImageSlots() {
  return useQuery<ImageSlotsResponse>({
    queryKey: ["/api/image-slots"],
  });
}

export function useImageSlot(slotKey: string): string {
  const { data } = useImageSlots();
  
  if (!data) {
    const slot = DEFAULT_SLOTS[slotKey];
    return slot || "";
  }
  
  const slot = data.slots.find(s => s.key === slotKey);
  return slot?.currentUrl || DEFAULT_SLOTS[slotKey] || "";
}

const DEFAULT_SLOTS: Record<string, string> = {
  "transition-frame-1": "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
  "transition-frame-2": "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1200",
  "transition-frame-3": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=1200",
  "transition-frame-4": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200",
  "transition-frame-5": "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=1200",
  "capsule-hero": "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600",
  "capsule-item-1": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
  "capsule-item-2": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
  "capsule-item-3": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=600",
  "capsule-item-4": "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600",
  "capsule-item-5": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600",
  "capsule-item-6": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600",
  "capsule-item-7": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600",
  "capsule-item-8": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
  "capsule-item-9": "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600",
  "capsule-item-10": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
  "capsule-item-11": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600",
  "capsule-item-12": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
  "current-article-1": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
  "current-article-2": "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&q=80&w=1200",
  "current-style-1": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
  "current-scene-1": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600",
  "current-quote-1": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800",
  "current-article-3": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200",
  "current-style-2": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800",
  "current-scene-2": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
  "current-article-4": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
  "suitcase-capsule-card": "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800",
};
