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
          itemType="trip"
          itemId={`trip-${destination.slug}`}
          itemData={{
            title: destination.title,
            imageUrl: imageUrl,
            description: destination.summary,
            storyTag: destination.slug,
            bucket: "my-trips"
          }}
          sourceContext="destinations_overview"
          aestheticTags={["trip", "travel", destination.slug]}
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
