# Travel Destinations v1 - Component Reference

**Backup Date:** January 12, 2026

This file contains the complete code for the Travel Destinations page. This is your safekeeping backup that you can download.

## Files Included:
1. `client/src/pages/destinations.tsx` - Destinations page component
2. `shared/destinations.ts` - Destinations data

---

## Features:
- Grid of destination cards (Morocco, Hydra, Slow Travel, Retreat, New York)
- Pin buttons on each destination (upper right)
- Available/locked state for destinations
- Image slot integration for custom images
- Responsive grid layout (1/2/3 columns)

---

## File 1: destinations.tsx

```tsx
import { GlobalNav } from "@/components/global-nav";
import { DESTINATIONS } from "@shared/destinations";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { Link } from "wouter";
import { ChevronRight, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PinButton } from "@/components/pin-button";

function DestinationCard({ 
  destination, 
  getImageUrl 
}: { 
  destination: typeof DESTINATIONS[0];
  getImageUrl: (key: string) => string;
}) {
  const imageUrl = getImageUrl(destination.imageSlotKey) || destination.defaultImage;
  
  const content = (
    <div 
      className={`group relative overflow-hidden rounded-lg aspect-[4/5] ${destination.available ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
    >
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${destination.available ? 'group-hover:scale-105' : ''}`}
        style={{
          backgroundImage: `url('${imageUrl}')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <PinButton
          itemType="destination"
          itemId={`destination-${destination.slug}`}
          itemData={{
            title: destination.title,
            imageUrl: imageUrl,
            description: destination.summary,
            storyTag: destination.slug
          }}
          sourceContext="destinations_overview"
          aestheticTags={["destination", "travel", destination.slug]}
          size="md"
        />
        {!destination.available && (
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
            <Lock className="w-4 h-4 text-white/70" />
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <p className="text-xs font-medium tracking-[0.2em] uppercase opacity-70 mb-2">
          {destination.subtitle}
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-medium mb-2">
          {destination.title}
        </h3>
        <p className="text-sm opacity-80 mb-4 line-clamp-2">
          {destination.summary}
        </p>
        {destination.available && (
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide opacity-70 group-hover:opacity-100 transition-opacity">
            <span>Explore</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );

  if (destination.available) {
    return (
      <Link href={destination.route} data-testid={`link-destination-${destination.slug}`}>
        {content}
      </Link>
    );
  }
  
  return <div data-testid={`card-destination-${destination.slug}-locked`}>{content}</div>;
}

export default function Destinations() {
  const { data: imageSlotsData, isLoading } = useImageSlots();

  const getImageUrl = (assetKey: string): string => {
    if (imageSlotsData?.slots) {
      const slot = imageSlotsData.slots.find(s => s.key === assetKey);
      if (slot?.currentUrl) {
        return slot.currentUrl;
      }
    }
    const defaultSlot = IMAGE_SLOTS.find(s => s.key === assetKey);
    return defaultSlot?.defaultUrl || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Explore
          </p>
          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4"
            data-testid="text-destinations-title"
          >
            Travel Destinations
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Curated itineraries for places worth spending time in
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
            ))
          ) : (
            DESTINATIONS.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} getImageUrl={getImageUrl} />
            ))
          )}
        </div>

        <footer className="text-center py-16 mt-12 border-t border-border">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">
            More destinations coming soon
          </p>
        </footer>
      </div>
    </div>
  );
}
```

---

## File 2: destinations.ts (Data)

```typescript
export interface Destination {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  imageSlotKey: string;
  defaultImage: string;
  route: string;
  available: boolean;
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "morocco",
    title: "Morocco",
    subtitle: "April 2026",
    summary: "A curated journey through Marrakech, the Atlas Mountains, and Essaouira",
    imageSlotKey: "destination-morocco",
    defaultImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    route: "/concierge",
    available: true
  },
  {
    slug: "hydra",
    title: "Hydra",
    subtitle: "Coming Soon",
    summary: "Stone, water, and stillness on a car-free Greek island",
    imageSlotKey: "destination-hydra",
    defaultImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
    route: "/coming-soon/hydra",
    available: false
  },
  {
    slug: "slow-travel",
    title: "Slow Travel",
    subtitle: "Philosophy",
    summary: "Less, but longer. The art of staying somewhere long enough to belong",
    imageSlotKey: "destination-slow-travel",
    defaultImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    route: "/coming-soon/slow-travel",
    available: false
  },
  {
    slug: "retreat",
    title: "Ritual Retreat",
    subtitle: "Coming Soon",
    summary: "Movement, then stillness. Places designed for practice and presence",
    imageSlotKey: "destination-retreat",
    defaultImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
    route: "/coming-soon/retreat",
    available: false
  },
  {
    slug: "new-york",
    title: "New York",
    subtitle: "Coming Soon",
    summary: "The weekend that holds. Culture, food, and a different kind of pace",
    imageSlotKey: "destination-new-york",
    defaultImage: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1200",
    route: "/coming-soon/new-york",
    available: false
  }
];
```

---

## Image Slot Keys:
- `destination-morocco` - Morocco card image
- `destination-hydra` - Hydra card image
- `destination-slow-travel` - Slow Travel card image
- `destination-retreat` - Retreat card image
- `destination-new-york` - New York card image

---

## How to Restore

1. Copy `destinations.tsx` to `client/src/pages/destinations.tsx`
2. Copy `destinations.ts` to `shared/destinations.ts`
3. Ensure route is registered in `client/src/App.tsx`
4. Ensure `PinButton` component exists

---

## Dependencies
- `@/components/global-nav` - Global navigation
- `@/components/pin-button` - Pin save functionality
- `@/hooks/use-image-slot` - Image slot hook
- `@shared/image-slots` - Image slot definitions
- `lucide-react` - Icons
