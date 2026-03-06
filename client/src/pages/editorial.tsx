import { Link, useLocation } from "wouter";
import { ChevronDown, ChevronLeft, ChevronRight, Bookmark, Unlock, Check } from "lucide-react";
import { useCustomImages } from "@/hooks/use-custom-images";
import { ITINERARY_DATA, DayPage, FlowItem } from "@shared/itinerary-data";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
// GlobalNav removed — TopBar is now app-level in App.tsx
import { PinButton } from "@/components/pin-button";

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

interface WardrobeExtra {
  imageKey: string;
  imageDefault: string;
}

interface FlowEditorial {
  id: string;
  time: string;
  title: string;
  eventImageKey: string;
  eventImageDefault: string;
  wardrobeImageKey: string | null;
  wardrobeImageDefault: string | null;
  wardrobeExtras: WardrobeExtra[];
}

function extractEditorialData(): DayEditorial[] {
  const days: DayEditorial[] = [];
  const dayLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
  
  ITINERARY_DATA.forEach((page) => {
    if ('day' in page) {
      const dayPage = page as DayPage;
      const dayIndex = dayPage.day - 1;
      
      const flows: FlowEditorial[] = dayPage.flow.map((flow: FlowItem) => {
        // Generate wardrobe extras (4 accessory slots) - always generate regardless of commercialWardrobe
        const extras: WardrobeExtra[] = [];
        for (let i = 0; i < 4; i++) {
          extras.push({
            imageKey: `${flow.id}-extra-${i}`,
            imageDefault: '', // No default - only show if custom image uploaded
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
        heroImageKey: `day-${dayPage.day}-hero`,
        heroImageDefault: dayPage.flow[0]?.image || '',
        flows,
      });
    }
  });
  
  return days;
}

interface HeroSectionProps {
  isSaved: boolean;
  isAcquired: boolean;
  onSave: () => void;
  onAcquire: () => void;
  isPending: boolean;
}

function HeroSection({ isSaved, isAcquired, onSave, onAcquire, isPending }: HeroSectionProps) {
  const heroImageUrl = 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600';
  
  return (
    <div className="h-screen relative flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url('${heroImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      <div className="absolute top-20 right-4 z-20 flex flex-col items-center gap-1">
        <PinButton
          itemType="trip"
          itemId="morocco-trip-2026"
          itemData={{
            title: "Morocco 2026",
            subtitle: "Atlas Mountains & Marrakech",
            imageUrl: heroImageUrl,
            bucket: "my-trips",
            storyTag: "morocco",
            editTag: "morocco-trip",
          }}
          sourceContext="editorial"
          aestheticTags={["trip", "morocco", "travel"]}
          size="sm"
        />
      </div>
      
      <div className="relative z-10 text-center text-white">
        <h1 className="font-serif text-[clamp(3.5rem,10vw,8rem)] font-normal tracking-[0.25em] mb-4 drop-shadow-lg">
          MOROCCO
        </h1>
        <p className="text-base md:text-lg font-light tracking-[0.15em] uppercase opacity-90 mb-6">
          Atlas Mountains & Marrakech
        </p>
        
        <div className="flex items-center justify-center gap-8 mb-10">
          <button
            onClick={() => {
              const el = document.getElementById('editorial-overview');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-medium tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
            data-testid="button-overview"
          >
            Overview
          </button>
          <span className="text-white/40">|</span>
          <button
            onClick={() => {
              const el = document.getElementById('daily-flow');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-medium tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
            data-testid="button-daily-flow"
          >
            Daily Flow
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            onClick={onSave}
            disabled={isPending || isSaved}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-xs tracking-[0.2em] uppercase"
            data-testid="button-save-edit"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Edit Saved
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 mr-2" />
                Save this Edit
              </>
            )}
          </Button>
          
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={onAcquire}
              disabled={isPending || isAcquired}
              className="bg-white text-black hover:bg-white/90 px-8 py-6 text-xs tracking-[0.2em] uppercase"
              data-testid="button-acquire-edit"
            >
              {isAcquired ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Edit Acquired
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Acquire this Edit
                </>
              )}
            </Button>
            <p className="text-xs text-white/60 text-center max-w-xs">
              Unlock the complete itinerary and preparation logic for this Edit.
            </p>
          </div>
        </div>
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
          
          const hasAccessories = flow.wardrobeExtras.some(extra => hasCustomImage(extra.imageKey));
          const hasWardrobeContent = wardrobeImage || hasAccessories;

          return (
            <div key={flow.id} className="space-y-6">
              <div className="text-center">
                <p className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                  {flow.time}
                </p>
                <h3 className="font-serif text-xl md:text-2xl mt-1">{flow.title}</h3>
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
                    {/* Accessory items - show if any have custom images */}
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
  const [, setLocation] = useLocation();
  const { getImageUrl, hasCustomImage, isLoading } = useCustomImages();
  const editorialData = extractEditorialData();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editStatus, setEditStatus] = useState<{ saved: boolean; acquired: boolean }>({ saved: false, acquired: false });

  const { data: existingSave } = useQuery({
    queryKey: ['/api/saves/check', 'morocco-edit-container'],
    queryFn: async () => {
      const res = await fetch(`/api/saves/check/morocco-edit-container`);
      if (!res.ok) return null;
      return res.json();
    }
  });

  const isSaved = editStatus.saved || existingSave?.isPinned;
  const isAcquired = editStatus.acquired || existingSave?.metadata?.editStatus === 'acquired';

  const saveEditMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'edit',
          itemId: 'morocco-edit-container',
          sourceContext: 'editorial_overview',
          editTag: 'morocco-edit',
          storyTag: 'morocco',
          title: 'Morocco 2026',
          assetUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600',
          metadata: {
            editStatus: 'saved',
            dates: 'April 3–10, 2026',
            destination: 'Morocco'
          },
          savedAt: Date.now()
        })
      });
      if (res.status === 400) {
        return { success: true, alreadySaved: true };
      }
      if (!res.ok) throw new Error('Failed to save edit');
      return res.json();
    },
    onSuccess: () => {
      setEditStatus(prev => ({ ...prev, saved: true }));
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saves/check', 'morocco-edit-container'] });
      toast({ description: 'Edit saved to your Suitcase' });
    }
  });

  const acquireEditMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'edit',
          itemId: 'morocco-edit-container',
          sourceContext: 'editorial_overview',
          editTag: 'morocco-edit',
          storyTag: 'morocco',
          title: 'Morocco 2026',
          assetUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600',
          metadata: {
            editStatus: 'acquired',
            dates: 'April 3–10, 2026',
            destination: 'Morocco'
          },
          savedAt: Date.now()
        })
      });
      if (res.status === 400) {
        const updateRes = await fetch(`/api/saves/morocco-edit-container`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metadata: {
              editStatus: 'acquired',
              dates: 'April 3–10, 2026',
              destination: 'Morocco'
            }
          })
        });
        if (!updateRes.ok) throw new Error('Failed to update edit status');
        return { success: true, updated: true };
      }
      if (!res.ok) throw new Error('Failed to acquire edit');
      return res.json();
    },
    onSuccess: () => {
      setEditStatus({ saved: true, acquired: true });
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saves/check', 'morocco-edit-container'] });
      toast({ description: 'Edit acquired! Full itinerary unlocked.' });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* GlobalNav removed — TopBar is now app-level in App.tsx */}

      {/* Hero */}
      <HeroSection 
        isSaved={isSaved}
        isAcquired={isAcquired}
        onSave={() => saveEditMutation.mutate()}
        onAcquire={() => acquireEditMutation.mutate()}
        isPending={saveEditMutation.isPending || acquireEditMutation.isPending}
      />

      {/* Editorial Overview */}
      <div id="editorial-overview" className="scroll-mt-20" />
      
      {/* Day Sections */}
      <div id="daily-flow" className="max-w-5xl mx-auto px-4 md:px-6 scroll-mt-20">
        {editorialData.map((day) => (
          <DaySection 
            key={day.dayNumber}
            day={day}
            getImageUrl={getImageUrl}
            hasCustomImage={hasCustomImage}
          />
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <footer className="mt-32 border-t border-border pt-16 flex items-center justify-between gap-4">
          <Button 
            onClick={() => setLocation('/?page=1')}
            variant="ghost"
            className="flex items-center gap-2 md:gap-4 text-[12px] font-bold uppercase tracking-[0.5em] transition-all"
            data-testid="button-prev"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" /> 
            <span className="hidden sm:inline">PREV</span>
          </Button>
          <div className="text-[11px] font-bold tracking-[0.8em] text-muted-foreground uppercase">
            OVERVIEW
          </div>
          <Button 
            onClick={() => setLocation('/?page=2')}
            variant="ghost"
            className="flex items-center gap-2 md:gap-4 text-[12px] font-bold uppercase tracking-[0.5em] transition-all"
            data-testid="button-next"
          >
            <span className="hidden sm:inline">NEXT</span> 
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </footer>
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
              className="px-8 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors rounded-md text-sm font-medium tracking-wide"
              data-testid="button-view-packing-list"
            >
              View Packing List
            </button>
          </Link>
          <Link href="/suitcase">
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
