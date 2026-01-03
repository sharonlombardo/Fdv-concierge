import { Link } from "wouter";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useCustomImages } from "@/hooks/use-custom-images";
import { ITINERARY_DATA, DayPage } from "@/lib/itinerary-data";
import logoImage from "@assets/LOGO_1767219658929.png";

interface DayOverview {
  dayNumber: number;
  dayLabel: string;
  location: string;
  mantra: string;
  lifestyleLabel: string;
  lifestyleImageKey: string;
  wardrobeImageKey: string;
  placeImageKey: string;
  placeImage?: string;
}

function extractEditorialData(): DayOverview[] {
  const days: DayOverview[] = [];
  
  const dayLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
  const lifestyleLabels = [
    'The Arrival', 
    'The Journey', 
    'The Exploration', 
    'The Discovery',
    'The Coast',
    'The Ritual',
    'The Adventure',
    'The Return'
  ];
  
  ITINERARY_DATA.forEach((page) => {
    if ('day' in page) {
      const dayPage = page as DayPage;
      const dayIndex = dayPage.day - 1;
      
      const firstFlow = dayPage.flow.find(f => f.commercialWardrobe);
      
      days.push({
        dayNumber: dayPage.day,
        dayLabel: dayLabels[dayIndex] || `Day ${dayPage.day}`,
        location: dayPage.location,
        mantra: dayPage.mantra || '"Let each moment unfold with intention."',
        lifestyleLabel: lifestyleLabels[dayIndex] || 'The Moment',
        lifestyleImageKey: `day-${dayPage.day}-hero`,
        wardrobeImageKey: firstFlow ? `${firstFlow.id}-wardrobe` : `day-${dayPage.day}-wardrobe`,
        placeImageKey: firstFlow ? `${firstFlow.id}-extra-0` : `day-${dayPage.day}-place`,
        placeImage: firstFlow?.image,
      });
    }
  });
  
  return days;
}

function HeroSection() {
  return (
    <div className="h-screen relative flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background/80"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      
      <div className="relative z-10 text-center text-white">
        <h1 className="font-serif text-[clamp(4rem,12vw,10rem)] font-normal tracking-[0.3em] mb-8 drop-shadow-lg">
          MOROCCO
        </h1>
        <p className="text-lg font-light tracking-[0.1em] uppercase">
          April 3–10, 2026
        </p>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>
    </div>
  );
}

interface DaySectionProps {
  day: DayOverview;
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
}

function DaySection({ day, getImageUrl, hasCustomImage }: DaySectionProps) {
  const lifestyleDefault = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800";
  const wardrobeDefault = "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=800";
  const placeDefault = day.placeImage || "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800";
  
  const lifestyleImage = hasCustomImage(day.lifestyleImageKey) 
    ? getImageUrl(day.lifestyleImageKey, lifestyleDefault) 
    : lifestyleDefault;
  const wardrobeImage = hasCustomImage(day.wardrobeImageKey) 
    ? getImageUrl(day.wardrobeImageKey, '') 
    : getImageUrl(day.wardrobeImageKey, wardrobeDefault);
  const placeImage = hasCustomImage(day.placeImageKey) 
    ? getImageUrl(day.placeImageKey, placeDefault) 
    : placeDefault;

  return (
    <div className="py-24 border-b border-border">
      <div className="text-center mb-12">
        <p className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground mb-2">
          Day {day.dayLabel}
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-normal">
          {day.location}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="group">
          <div className="overflow-hidden rounded-md">
            <img 
              src={lifestyleImage}
              alt={day.lifestyleLabel}
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mt-4 text-center">
            {day.lifestyleLabel}
          </p>
        </div>
        
        <div className="group">
          <div className="overflow-hidden rounded-md">
            <img 
              src={wardrobeImage}
              alt="Your Capsule"
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mt-4 text-center">
            Your Capsule
          </p>
        </div>
        
        <div className="group">
          <div className="overflow-hidden rounded-md">
            <img 
              src={placeImage}
              alt="The Place"
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mt-4 text-center">
            The Place
          </p>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-serif text-2xl md:text-3xl italic font-light leading-relaxed">
          {day.mantra}
        </p>
      </div>
    </div>
  );
}

export default function Editorial() {
  const { getImageUrl, hasCustomImage, isLoading } = useCustomImages();
  const editorialData = extractEditorialData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/">
            <button className="text-white hover:opacity-70 transition-opacity" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <img src={logoImage} alt="FDV" className="h-6 invert" />
          <div className="w-6" />
        </div>
      </header>

      <HeroSection />

      <div className="max-w-7xl mx-auto px-6">
        {editorialData.map((day) => (
          <DaySection 
            key={day.dayNumber}
            day={day}
            getImageUrl={getImageUrl}
            hasCustomImage={hasCustomImage}
          />
        ))}
      </div>

      <div className="py-24 text-center">
        <p className="font-serif text-4xl md:text-5xl font-normal mb-4">The Journey Awaits</p>
        <p className="text-muted-foreground text-lg font-light tracking-wide">April 2026</p>
        
        <div className="mt-12 flex justify-center gap-6">
          <Link href="/">
            <button 
              className="px-8 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors rounded-md text-sm font-medium tracking-wide"
              data-testid="button-view-itinerary"
            >
              View Itinerary
            </button>
          </Link>
          <Link href="/packing">
            <button 
              className="px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md text-sm font-medium tracking-wide"
              data-testid="button-view-suitcase"
            >
              View Suitcase
            </button>
          </Link>
        </div>
      </div>

      <footer className="border-t border-border py-12 text-center">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          FDV Concierge
        </p>
      </footer>
    </div>
  );
}
