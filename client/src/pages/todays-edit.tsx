import { GlobalNav } from "@/components/global-nav";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const MOOD_KEYS = [
  "todays-edit-mood-1",
  "todays-edit-mood-2",
  "todays-edit-mood-3",
  "todays-edit-mood-4",
];

const LOOK_KEYS = [
  "todays-edit-look-1",
  "todays-edit-look-2",
  "todays-edit-look-3",
  "todays-edit-look-4",
  "todays-edit-look-5",
  "todays-edit-look-6",
];

export default function TodaysEdit() {
  const { data: imageSlotsData } = useImageSlots();

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
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/">
          <button 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Link>

        <header className="mb-12 text-center">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Today's Edit
          </p>
          <h1 
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4"
            data-testid="text-todays-edit-title"
          >
            Desert Neutrals
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A curated selection of mood, looks, and pieces for the journey ahead.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 text-center">
            Mood
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MOOD_KEYS.map((key, index) => (
              <div 
                key={key}
                className="aspect-[4/5] overflow-hidden rounded-lg bg-muted"
                data-testid={`img-mood-${index + 1}`}
              >
                <img 
                  src={getImageUrl(key)} 
                  alt={`Mood ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 text-center">
            Looks & Objects
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {LOOK_KEYS.map((key, index) => (
              <div 
                key={key}
                className="aspect-square overflow-hidden rounded-lg bg-muted"
                data-testid={`img-look-${index + 1}`}
              >
                <img 
                  src={getImageUrl(key)} 
                  alt={`Look ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center py-12 border-t border-border">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">
            Curated for you
          </p>
        </footer>
      </div>
    </div>
  );
}
