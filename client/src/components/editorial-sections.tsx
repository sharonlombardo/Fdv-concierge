import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ITINERARY_DATA, DayPage, FlowItem } from "@shared/itinerary-data";
import { PinButton } from "@/components/pin-button";
import { getProductByKey, getProductDisplayName, isShoppable, getShopImageUrl, getSlotProducts, FLOW_LOOK_GENOME_KEY } from "@/lib/brand-genome";

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
  dayNumber: number;
  timeOfDay: "morning" | "afternoon" | "evening";
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

        // Determine time-of-day for packing grid product resolution
        const timeLower = (flow.time || '').toLowerCase();
        let timeOfDay: "morning" | "afternoon" | "evening" = "afternoon";
        if (timeLower.includes('morning') || (timeLower.match(/\d/) && parseInt(timeLower) < 12)) {
          timeOfDay = "morning";
        } else if (timeLower.includes('evening') || timeLower.includes('night')) {
          timeOfDay = "evening";
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
          dayNumber: dayPage.day,
          timeOfDay,
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
  itemId?: string;
  itemTitle?: string;
  showPin?: boolean;
  imageType?: 'place' | 'look' | 'accessory';
  preserveAspectRatio?: boolean;
  onImageClick?: () => void;
}

export function ImageCard({
  imageUrl,
  label,
  aspectRatio = "aspect-[3/4]",
  itemId,
  itemTitle,
  showPin = false,
  imageType = 'place',
  preserveAspectRatio = false,
  onImageClick
}: ImageCardProps) {
  const itemTypeMap = {
    'place': 'place',
    'look': 'look',
    'accessory': 'accessory'
  };
  const pinItemType = itemTypeMap[imageType] || 'place';
  const aestheticTagsMap = {
    'place': ["morocco", "travel", "destination"],
    'look': ["morocco", "wardrobe", "style"],
    'accessory': ["morocco", "accessory", "style"]
  };
  const aestheticTags = aestheticTagsMap[imageType] || ["morocco", "travel"];
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="group relative">
      <div
        className={`${preserveAspectRatio ? '' : aspectRatio} overflow-hidden rounded-md bg-muted relative ${onImageClick ? 'cursor-pointer' : ''}`}
        onClick={onImageClick}
      >
        {!isLoaded && (
          <div className={`${preserveAspectRatio ? 'min-h-[200px]' : 'absolute inset-0'} bg-muted animate-pulse`} />
        )}
        <img
          src={imageUrl}
          alt={label || "Editorial image"}
          className={`w-full ${preserveAspectRatio ? 'h-auto' : 'h-full object-cover'} transition-all duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            setIsLoaded(true);
          }}
          loading="lazy"
          decoding="async"
        />
      </div>
      {showPin && itemId && (
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <PinButton
            itemType={pinItemType}
            itemId={itemId}
            itemData={{
              title: itemTitle || label || "Morocco",
              imageUrl: imageUrl,
              sourceStory: "morocco-2026",
              issueNumber: 1,
              saveType: pinItemType,
              storyTag: "morocco",
              editionTag: "morocco-2026",
              editTag: "morocco-editorial",
              assetKey: itemId,
              assetUrl: imageUrl
            }}
            sourceContext="morocco_editorial"
            aestheticTags={aestheticTags}
            size="sm"
          />
        </div>
      )}
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
        <h1 className="font-serif text-[clamp(3.5rem,10vw,8rem)] font-normal tracking-[0.25em] mb-4 drop-shadow-lg">
          MOROCCO
        </h1>
        <p className="text-base md:text-lg font-light tracking-[0.15em] uppercase opacity-90 mb-6">
          Atlas Mountains & Marrakech
        </p>
        
        <div className="flex items-center justify-center gap-8">
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
  onOpenProductModal?: (data: { title: string; imageUrl: string; itemId: string; brand?: string; description?: string; shopUrl?: string; pinType?: string; genomeKey?: string }) => void;
}

export function EditorialDaySection({ day, getImageUrl, hasCustomImage, onOpenProductModal }: EditorialDaySectionProps) {
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
        <ImageCard
          imageUrl={heroImage}
          itemId={day.heroImageKey}
          itemTitle={`Day ${day.dayNumber} - ${day.location}`}
          aspectRatio="aspect-[4/5]"
          showPin={true}
          imageType="place"
        />
      </div>

      <div className="space-y-16">
        {day.flows.map((flow) => {
          const eventImage = hasCustomImage(flow.eventImageKey)
            ? getImageUrl(flow.eventImageKey, flow.eventImageDefault)
            : flow.eventImageDefault;
          
          // Studio shots take priority for wardrobe images
          const lookGenomeKeyForImage = FLOW_LOOK_GENOME_KEY[flow.id];
          const wardrobeStudioUrl = lookGenomeKeyForImage ? getShopImageUrl(lookGenomeKeyForImage) : '';
          const wardrobeImageFallback = flow.wardrobeImageKey && flow.wardrobeImageDefault
            ? (hasCustomImage(flow.wardrobeImageKey)
              ? getImageUrl(flow.wardrobeImageKey, flow.wardrobeImageDefault)
              : flow.wardrobeImageDefault)
            : null;
          const wardrobeImage = wardrobeStudioUrl || wardrobeImageFallback;
          
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
                  itemId={flow.eventImageKey}
                  itemTitle={flow.title}
                  showPin={true}
                  imageType="place"
                />
                {hasWardrobeContent && (
                  <div className="space-y-4">
                    {wardrobeImage && flow.wardrobeImageKey && (() => {
                      const lookGenomeKey = FLOW_LOOK_GENOME_KEY[flow.id];
                      const lookProduct = lookGenomeKey ? getProductByKey(lookGenomeKey) : undefined;
                      return (
                        <ImageCard
                          imageUrl={wardrobeImage}
                          itemId={flow.wardrobeImageKey}
                          itemTitle={lookProduct?.name || `${flow.title} Look`}
                          showPin={true}
                          imageType="look"
                          preserveAspectRatio={true}
                          onImageClick={onOpenProductModal ? () => onOpenProductModal({
                            title: lookProduct?.name || `${flow.title} - The Look`,
                            imageUrl: wardrobeImage,
                            itemId: flow.wardrobeImageKey!,
                            brand: lookProduct?.brand || undefined,
                            description: lookProduct?.description || undefined,
                            shopUrl: lookProduct?.url || undefined,
                            pinType: "style",
                            genomeKey: lookGenomeKey || undefined,
                          }) : undefined}
                        />
                      );
                    })()}
                    {hasAccessories && (() => {
                      // Resolve accessory products from packing grid: idx 0=footwear, 1=handbag, 2=jewelry, 3=accessory
                      const positionNames = ['footwear', 'handbag', 'jewelry', 'accessory'] as const;
                      const positionLabels = ['Footwear', 'Handbag', 'Jewelry', 'Accessory'];
                      const slotProducts = getSlotProducts(flow.dayNumber, flow.timeOfDay);

                      return (
                      <div className="grid grid-cols-4 gap-2">
                        {flow.wardrobeExtras.map((extra, idx) => {
                          // Resolve product data from packing grid position
                          const position = positionNames[idx];
                          const mapEntry = slotProducts.find(s => s.position === position);
                          const extraGenome = mapEntry?.product;
                          const extraName = extraGenome ? getProductDisplayName(extraGenome) : `${flow.title} ${positionLabels[idx]}`;
                          const extraGenomeKey = mapEntry?.key || undefined;

                          // Studio shots take priority for accessories
                          const extraStudioUrl = extraGenomeKey ? getShopImageUrl(extraGenomeKey) : '';
                          const extraImageFallback = getImageUrl(extra.imageKey, extra.imageDefault);
                          const extraImage = extraStudioUrl || extraImageFallback;
                          if (!extraStudioUrl && !hasCustomImage(extra.imageKey)) return null;

                          return (
                            <div key={idx} className="flex flex-col">
                            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-muted relative group">
                              <img
                                src={extraImage}
                                alt={extraName}
                                className={`w-full h-full object-cover ${onOpenProductModal ? 'cursor-pointer' : ''}`}
                                onClick={onOpenProductModal ? () => onOpenProductModal({
                                  title: extraName,
                                  imageUrl: extraImage,
                                  itemId: extra.imageKey,
                                  brand: extraGenome?.brand || undefined,
                                  description: extraGenome?.description || undefined,
                                  shopUrl: extraGenome && isShoppable(extraGenome) ? extraGenome.url : undefined,
                                  pinType: "style",
                                  genomeKey: extraGenomeKey,
                                }) : undefined}
                              />
                              <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                                <PinButton
                                  itemType="accessory"
                                  itemId={extra.imageKey}
                                  itemData={{
                                    title: extraName,
                                    imageUrl: extraImage,
                                    sourceStory: "morocco-2026",
                                    issueNumber: 1,
                                    saveType: "accessory",
                                    storyTag: "morocco",
                                    editionTag: "morocco-2026",
                                    editTag: "morocco-wardrobe",
                                    assetKey: extraGenomeKey || extra.imageKey,
                                    genomeKey: extraGenomeKey,
                                    assetUrl: extraImage
                                  }}
                                  sourceContext="morocco_editorial"
                                  aestheticTags={["morocco", "accessory", "style"]}
                                  size="sm"
                                />
                              </div>
                            </div>
                            <p className="text-[9px] font-medium uppercase tracking-wider text-center truncate opacity-60 mt-1">
                              {extraGenome?.brand || positionLabels[idx]}
                            </p>
                            </div>
                          );
                        })}
                      </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto text-center mt-20">
        <div className="inline-flex items-center gap-3">
          <p className="font-serif text-xl md:text-2xl lg:text-3xl italic font-light leading-relaxed text-muted-foreground">
            "{day.mantra}"
          </p>
          {/* Glowing gold pin CTA */}
          <a href="/suitcase" className="shrink-0 group">
            <svg
              width="22"
              height="28"
              viewBox="0 0 24 32"
              fill="#c9a84c"
              stroke="none"
              className="transition-all group-hover:scale-110"
              style={{
                filter: "drop-shadow(0 0 6px rgba(201,168,76,0.5))",
              }}
            >
              <circle cx="12" cy="10" r="9" />
              <polygon points="9,18 12,32 15,18" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

interface EditorialOverviewProps {
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
  onOpenProductModal?: (data: { title: string; imageUrl: string; itemId: string; brand?: string; description?: string; shopUrl?: string; pinType?: string; genomeKey?: string }) => void;
}

export function EditorialOverview({ getImageUrl, hasCustomImage, onOpenProductModal }: EditorialOverviewProps) {
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
            onOpenProductModal={onOpenProductModal}
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
