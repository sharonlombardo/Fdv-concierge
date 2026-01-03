import { Link } from "wouter";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useCustomImages } from "@/hooks/use-custom-images";
import { ITINERARY_DATA, DayPage, FlowItem } from "@/lib/itinerary-data";
import logoImage from "@assets/LOGO_1767219658929.png";

interface DayEditorial {
  dayNumber: number;
  dayLabel: string;
  location: string;
  date: string;
  mantra: string;
  heroImageKey: string;
  heroImageDefault: string;
  flows: FlowEditorial[];
}

interface FlowEditorial {
  id: string;
  time: string;
  title: string;
  eventImageKey: string;
  eventImageDefault: string;
  wardrobeImageKey: string | null;
  wardrobeImageDefault: string | null;
}

function extractEditorialData(): DayEditorial[] {
  const days: DayEditorial[] = [];
  const dayLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
  
  ITINERARY_DATA.forEach((page) => {
    if ('day' in page) {
      const dayPage = page as DayPage;
      const dayIndex = dayPage.day - 1;
      
      const flows: FlowEditorial[] = dayPage.flow.map((flow: FlowItem) => ({
        id: flow.id,
        time: flow.time,
        title: flow.title,
        eventImageKey: flow.id,
        eventImageDefault: flow.image,
        wardrobeImageKey: flow.commercialWardrobe ? `${flow.id}-wardrobe` : null,
        wardrobeImageDefault: flow.commercialWardrobe || null,
      }));
      
      days.push({
        dayNumber: dayPage.day,
        dayLabel: dayLabels[dayIndex] || `Day ${dayPage.day}`,
        location: dayPage.location,
        date: dayPage.date,
        mantra: dayPage.mantra || '"Let each moment unfold with intention."',
        heroImageKey: `day-${dayPage.day}-hero`,
        heroImageDefault: dayPage.flow[0]?.image || '',
        flows,
      });
    }
  });
  
  return days;
}

function HeroSection() {
  return (
    <div className="h-screen relative flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      <div className="relative z-10 text-center text-white">
        <h1 className="font-serif text-[clamp(3.5rem,10vw,8rem)] font-normal tracking-[0.25em] mb-6 drop-shadow-lg">
          MOROCCO
        </h1>
        <p className="text-base md:text-lg font-light tracking-[0.15em] uppercase opacity-90">
          April 3–10, 2026
        </p>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>
    </div>
  );
}

interface ImageCardProps {
  imageUrl: string;
  label?: string;
  aspectRatio?: string;
}

function ImageCard({ imageUrl, label, aspectRatio = "aspect-[3/4]" }: ImageCardProps) {
  return (
    <div className="group">
      <div className={`${aspectRatio} overflow-hidden rounded-md bg-muted`}>
        <img 
          src={imageUrl}
          alt={label || "Editorial image"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      {label && (
        <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mt-3 text-center">
          {label}
        </p>
      )}
    </div>
  );
}

interface DaySectionProps {
  day: DayEditorial;
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
}

function DaySection({ day, getImageUrl, hasCustomImage }: DaySectionProps) {
  const heroImage = hasCustomImage(day.heroImageKey) 
    ? getImageUrl(day.heroImageKey, day.heroImageDefault)
    : day.heroImageDefault;

  return (
    <div className="py-20 md:py-28 border-b border-border">
      {/* Day Header */}
      <div className="text-center mb-16">
        <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Day {day.dayLabel}
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-2">
          {day.location}
        </h2>
        <p className="text-sm text-muted-foreground tracking-wide">{day.date}</p>
      </div>

      {/* Day Hero Image */}
      <div className="mb-16 max-w-2xl mx-auto">
        <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
          <img 
            src={heroImage}
            alt={day.location}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Flow Items - Event + Wardrobe pairs */}
      <div className="space-y-16">
        {day.flows.map((flow) => {
          const eventImage = hasCustomImage(flow.eventImageKey)
            ? getImageUrl(flow.eventImageKey, flow.eventImageDefault)
            : flow.eventImageDefault;
          
          const wardrobeImage = flow.wardrobeImageKey && flow.wardrobeImageDefault
            ? (hasCustomImage(flow.wardrobeImageKey)
              ? getImageUrl(flow.wardrobeImageKey, flow.wardrobeImageDefault)
              : flow.wardrobeImageDefault)
            : null;

          return (
            <div key={flow.id} className="space-y-6">
              <div className="text-center">
                <p className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                  {flow.time}
                </p>
                <h3 className="font-serif text-xl md:text-2xl mt-1">{flow.title}</h3>
              </div>
              
              <div className={`grid gap-6 ${wardrobeImage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
                <ImageCard 
                  imageUrl={eventImage} 
                  aspectRatio="aspect-[4/5]"
                />
                {wardrobeImage && (
                  <ImageCard 
                    imageUrl={wardrobeImage} 
                    aspectRatio="aspect-[4/5]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mantra */}
      <div className="max-w-3xl mx-auto text-center mt-20">
        <p className="font-serif text-xl md:text-2xl lg:text-3xl italic font-light leading-relaxed text-muted-foreground">
          "{day.mantra}"
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
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex justify-between items-center">
          <Link href="/">
            <button className="text-white hover:opacity-70 transition-opacity p-2" data-testid="button-back">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </Link>
          <img src={logoImage} alt="FDV" className="h-5 md:h-6 invert" />
          <div className="w-9 md:w-10" />
        </div>
      </header>

      {/* Hero */}
      <HeroSection />

      {/* Day Sections */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {editorialData.map((day) => (
          <DaySection 
            key={day.dayNumber}
            day={day}
            getImageUrl={getImageUrl}
            hasCustomImage={hasCustomImage}
          />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="py-20 md:py-28 text-center px-4">
        <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal mb-3">The Journey Awaits</p>
        <p className="text-muted-foreground text-base md:text-lg font-light tracking-wide">April 2026</p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
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

      {/* Footer */}
      <footer className="border-t border-border py-10 text-center">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          FDV Concierge
        </p>
      </footer>
    </div>
  );
}
