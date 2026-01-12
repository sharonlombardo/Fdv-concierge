import { ChevronDown } from "lucide-react";
import { ITINERARY_DATA, DayPage, FlowItem } from "@shared/itinerary-data";

export interface DayEditorial {
  dayNumber: number;
  dayLabel: string;
  location: string;
  date: string;
  mantra: string;
  heroImageKey: string;
  heroImageDefault: string;
  flows: FlowEditorial[];
}

export interface WardrobeExtra {
  imageKey: string;
  imageDefault: string;
}

export interface FlowEditorial {
  id: string;
  time: string;
  title: string;
  eventImageKey: string;
  eventImageDefault: string;
  wardrobeImageKey: string | null;
  wardrobeImageDefault: string | null;
  wardrobeExtras: WardrobeExtra[];
}

export function extractEditorialData(): DayEditorial[] {
  const days: DayEditorial[] = [];
  const dayLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
  
  ITINERARY_DATA.forEach((page) => {
    if ('day' in page) {
      const dayPage = page as DayPage;
      const dayIndex = dayPage.day - 1;
      
      const flows: FlowEditorial[] = dayPage.flow.map((flow: FlowItem) => {
        const extras: WardrobeExtra[] = [];
        for (let i = 0; i < 4; i++) {
          extras.push({
            imageKey: `${flow.id}-extra-${i}`,
            imageDefault: '',
          });
        }
        
        return {
          id: flow.id,
          time: flow.time,
          title: flow.title,
          eventImageKey: flow.id,
          eventImageDefault: flow.image,
          wardrobeImageKey: flow.commercialWardrobe ? `${flow.id}-wardrobe` : null,
          wardrobeImageDefault: flow.commercialWardrobe || null,
          wardrobeExtras: extras,
        };
      });
      
      days.push({
        dayNumber: dayPage.day,
        dayLabel: dayLabels[dayIndex] || `Day ${dayPage.day}`,
        location: dayPage.location,
        date: dayPage.date,
        mantra: dayPage.mantra || '"Let each moment unfold with intention."',
        heroImageKey: `d${dayPage.day}-hero`,
        heroImageDefault: dayPage.flow[0]?.image || '',
        flows,
      });
    }
  });
  
  return days;
}

interface ImageCardProps {
  imageUrl: string;
  label?: string;
  aspectRatio?: string;
}

export function ImageCard({ imageUrl, label, aspectRatio = "aspect-[3/4]" }: ImageCardProps) {
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

interface EditorialHeroProps {
  showScrollIndicator?: boolean;
}

export function EditorialHero({ showScrollIndicator = true }: EditorialHeroProps) {
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
        <p className="text-base md:text-lg font-light tracking-[0.15em] uppercase opacity-90 mb-10">
          Atlas Mountains & Marrakech
        </p>
      </div>
      
      {showScrollIndicator && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      )}
    </div>
  );
}

interface EditorialDaySectionProps {
  day: DayEditorial;
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
}

export function EditorialDaySection({ day, getImageUrl, hasCustomImage }: EditorialDaySectionProps) {
  const heroImage = hasCustomImage(day.heroImageKey) 
    ? getImageUrl(day.heroImageKey, day.heroImageDefault)
    : day.heroImageDefault;

  return (
    <div className="py-20 md:py-28 border-b border-border">
      <div className="text-center mb-16">
        <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Day {day.dayLabel}
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-2">
          {day.location}
        </h2>
        <p className="text-sm text-muted-foreground tracking-wide">{day.date}</p>
      </div>

      <div className="mb-16 max-w-2xl mx-auto">
        <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
          <img 
            src={heroImage}
            alt={day.location}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

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
          
          const hasAccessories = flow.wardrobeExtras.some(extra => hasCustomImage(extra.imageKey));
          const hasWardrobeContent = wardrobeImage || hasAccessories;

          return (
            <div key={flow.id} className="space-y-6">
              <div className="text-center">
                <h3 className="font-serif text-xl md:text-2xl">{flow.title}</h3>
              </div>
              
              <div className={`grid gap-6 ${hasWardrobeContent ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
                <ImageCard 
                  imageUrl={eventImage} 
                  aspectRatio="aspect-[4/5]"
                />
                {hasWardrobeContent && (
                  <div className="space-y-4">
                    {wardrobeImage && (
                      <ImageCard 
                        imageUrl={wardrobeImage} 
                        aspectRatio="aspect-[4/5]"
                      />
                    )}
                    {hasAccessories && (
                      <div className="grid grid-cols-4 gap-2">
                        {flow.wardrobeExtras.map((extra, idx) => {
                          if (!hasCustomImage(extra.imageKey)) return null;
                          const extraImage = getImageUrl(extra.imageKey, extra.imageDefault);
                          return (
                            <div key={idx} className="aspect-square overflow-hidden rounded-sm bg-muted">
                              <img 
                                src={extraImage}
                                alt={`Accessory ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto text-center mt-20">
        <p className="font-serif text-xl md:text-2xl lg:text-3xl italic font-light leading-relaxed text-muted-foreground">
          "{day.mantra}"
        </p>
      </div>
    </div>
  );
}

interface EditorialOverviewProps {
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
}

export function EditorialOverview({ getImageUrl, hasCustomImage }: EditorialOverviewProps) {
  const editorialData = extractEditorialData();
  
  return (
    <div className="min-h-screen bg-background">
      <EditorialHero />
      
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {editorialData.map((day) => (
          <EditorialDaySection 
            key={day.dayNumber}
            day={day}
            getImageUrl={getImageUrl}
            hasCustomImage={hasCustomImage}
          />
        ))}
      </div>
      
      <div className="py-20 md:py-28 text-center px-4">
        <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal mb-3">The Journey Awaits</p>
        <p className="text-muted-foreground text-base md:text-lg font-light tracking-wide">April 2026</p>
      </div>
    </div>
  );
}
