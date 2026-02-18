import { useState, useMemo } from 'react';
import { ArrowLeft, Check, ChevronDown, Eye, Camera } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCustomImages } from '@/hooks/use-custom-images';
import { SelfieUpload } from '@/components/selfie-upload';
import { ItemModal, type ItemModalData } from '@/components/item-modal';
import {
  ITINERARY_DATA,
  type DayPage,
  type FlowItem,
  type WardrobeExtra
} from '@shared/itinerary-data';
import logoImage from '@assets/LOGO_1767219658929.png';

interface PackingItem {
  id: string;
  imageKey: string;
  name: string;
  brand?: string;
  image: string;
  context: string;
  whyText: string;
  dayNumber: number;
  time: 'Morning' | 'Afternoon' | 'Evening';
  isLook: boolean;
  flowItemId: string;
  extraIndex?: number;
}

interface WardrobeRow {
  flowId: string;
  flowTitle: string;
  items: PackingItem[];
}

interface DayData {
  day: number;
  location: string;
  weather: { temp: number; cond: string };
  venue?: string;
  morning: WardrobeRow[];
  afternoon: WardrobeRow[];
  evening: WardrobeRow[];
}

function extractPackingData(): DayData[] {
  const days: DayData[] = [];

  ITINERARY_DATA.forEach((page) => {
    if ('day' in page) {
      const dayPage = page as DayPage;
      
      const morningRows: WardrobeRow[] = [];
      const afternoonRows: WardrobeRow[] = [];
      const eveningRows: WardrobeRow[] = [];

      const getTimeCategory = (time: string): 'Morning' | 'Afternoon' | 'Evening' => {
        const lower = time.toLowerCase();
        if (lower.includes('morning') || (lower.match(/\d/) && parseInt(lower) < 12)) return 'Morning';
        if (lower.includes('evening') || lower.includes('night')) return 'Evening';
        return 'Afternoon';
      };

      const processFlow = (flow: FlowItem, timeCategory: 'Morning' | 'Afternoon' | 'Evening'): WardrobeRow | null => {
        if (!flow.commercialWardrobe) return null;
        
        const items: PackingItem[] = [];
        
        items.push({
          id: `${flow.id}-look`,
          imageKey: `${flow.id}-wardrobe`,
          name: 'Total Look',
          image: flow.commercialWardrobe,
          context: `${timeCategory} • ${flow.title}`,
          whyText: flow.wardrobe || 'Styled outfit for this activity.',
          dayNumber: dayPage.day,
          time: timeCategory,
          isLook: true,
          flowItemId: flow.id,
        });

        for (let i = 0; i < 4; i++) {
          const extra = flow.wardrobeExtras?.[i];
          if (extra) {
            items.push({
              id: `${flow.id}-extra-${i}`,
              imageKey: `${flow.id}-extra-${i}`,
              name: extra.name,
              image: extra.image,
              context: `${timeCategory} • ${flow.title}`,
              whyText: `Essential item for ${flow.title.toLowerCase()}.`,
              dayNumber: dayPage.day,
              time: timeCategory,
              isLook: false,
              flowItemId: flow.id,
              extraIndex: i,
            });
          } else {
            const placeholderNames = ['Footwear', 'Handbag', 'Jewelry', 'Accessory'];
            items.push({
              id: `${flow.id}-placeholder-${i}`,
              imageKey: `${flow.id}-extra-${i}`,
              name: placeholderNames[i] || 'Item',
              image: '',
              context: `${timeCategory} • ${flow.title}`,
              whyText: 'Add your own item.',
              dayNumber: dayPage.day,
              time: timeCategory,
              isLook: false,
              flowItemId: flow.id,
            });
          }
        }

        return {
          flowId: flow.id,
          flowTitle: flow.title,
          items,
        };
      };

      dayPage.flow.forEach(flow => {
        const timeCategory = getTimeCategory(flow.time);
        const row = processFlow(flow, timeCategory);
        if (row) {
          if (timeCategory === 'Morning') morningRows.push(row);
          else if (timeCategory === 'Afternoon') afternoonRows.push(row);
          else eveningRows.push(row);
        }
      });

      const venues = dayPage.flow
        .filter(f => f.commercialWardrobe)
        .map(f => f.title)
        .slice(0, 2)
        .join(' → ');

      days.push({
        day: dayPage.day,
        location: dayPage.location,
        weather: dayPage.weather,
        venue: venues,
        morning: morningRows,
        afternoon: afternoonRows,
        evening: eveningRows,
      });
    }
  });

  return days;
}

interface ItemCardProps {
  item: PackingItem;
  isPacked: boolean;
  onTogglePack: () => void;
  onOpenModal: () => void;
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
  isLarge?: boolean;
}

function ItemCard({ item, isPacked, onTogglePack, onOpenModal, getImageUrl, hasCustomImage, isLarge }: ItemCardProps) {
  const hasCustom = hasCustomImage(item.imageKey);
  const displayImage = (hasCustom || item.image) ? getImageUrl(item.imageKey, item.image) : '';
  
  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePack();
  };

  return (
    <div 
      className="cursor-pointer group"
      onClick={onOpenModal}
      data-testid={`card-item-${item.id}`}
    >
      <div className={`relative w-full ${isLarge ? 'aspect-[3/4]' : 'aspect-square'} bg-card rounded-md mb-2 overflow-hidden`}>
        {displayImage ? (
          <img 
            src={displayImage}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-muted-foreground text-xs"
            style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted)/0.7) 100%)' }}
          >
            {item.isLook ? 'COMPLETE LOOK' : 'ADD ITEM'}
          </div>
        )}
        
        <div 
          className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-opacity ${
            isPacked 
              ? 'bg-foreground text-background opacity-100' 
              : 'bg-background/90 border border-border opacity-0 group-hover:opacity-100'
          }`}
          onClick={handleCheckClick}
          data-testid={`check-item-${item.id}`}
        >
          {isPacked ? <Check className="w-3 h-3" /> : item.isLook ? <Eye className="w-3 h-3" /> : <Check className="w-3 h-3" />}
        </div>
      </div>
      <p className={`${isLarge ? 'text-sm' : 'text-xs'} text-center text-muted-foreground leading-tight font-light`}>
        {item.name}
      </p>
    </div>
  );
}

interface DaySectionProps {
  dayData: DayData;
  isExpanded: boolean;
  onToggle: () => void;
  viewMode: 'organize' | 'pack';
  packedItems: Set<string>;
  onTogglePack: (id: string) => void;
  onOpenModal: (item: PackingItem) => void;
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
}

function DaySection({ 
  dayData, 
  isExpanded, 
  onToggle, 
  viewMode,
  packedItems,
  onTogglePack,
  onOpenModal,
  getImageUrl,
  hasCustomImage 
}: DaySectionProps) {
  const hasItems = dayData.morning.length > 0 || dayData.afternoon.length > 0 || dayData.evening.length > 0;
  
  if (!hasItems) return null;

  const isPackView = viewMode === 'pack';
  const shouldExpand = isPackView || isExpanded;

  return (
    <div className="bg-card border-b border-border" data-testid={`section-day-${dayData.day}`}>
      <div 
        className={`px-5 py-6 ${isPackView ? '' : 'cursor-pointer hover:bg-muted/30'} transition-colors select-none`}
        onClick={isPackView ? undefined : onToggle}
        data-testid={`header-day-${dayData.day}`}
      >
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-serif text-lg font-normal tracking-wide">Day {dayData.day}</span>
          {!isPackView && (
            <ChevronDown 
              className={`w-4 h-4 text-muted-foreground transition-transform ${shouldExpand ? 'rotate-180' : ''}`} 
            />
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3 font-light">{dayData.location}</p>
        <div className="flex gap-4 text-xs text-muted-foreground/70">
          {dayData.venue && <span>{dayData.venue}</span>}
          <span>{dayData.weather.temp}°F</span>
        </div>
      </div>

      <div 
        className={`overflow-hidden transition-all duration-300 ${
          shouldExpand ? 'max-h-[3000px]' : 'max-h-0'
        }`}
      >
        <div className="px-5 pb-8">
          {dayData.morning.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-normal">Morning</p>
              {dayData.morning.map((row) => {
                const lookItem = row.items.find(item => item.isLook);
                const accessories = row.items.filter(item => !item.isLook);
                return (
                  <div key={row.flowId} className="mb-6">
                    <div className="flex gap-4">
                      {lookItem && (
                        <div className="w-1/3 min-w-[120px]">
                          <ItemCard
                            item={lookItem}
                            isPacked={packedItems.has(lookItem.id)}
                            onTogglePack={() => onTogglePack(lookItem.id)}
                            onOpenModal={() => onOpenModal(lookItem)}
                            getImageUrl={getImageUrl}
                            hasCustomImage={hasCustomImage}
                            isLarge
                          />
                        </div>
                      )}
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        {accessories.map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            isPacked={packedItems.has(item.id)}
                            onTogglePack={() => onTogglePack(item.id)}
                            onOpenModal={() => onOpenModal(item)}
                            getImageUrl={getImageUrl}
                            hasCustomImage={hasCustomImage}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {dayData.afternoon.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-normal">Afternoon</p>
              {dayData.afternoon.map((row) => {
                const lookItem = row.items.find(item => item.isLook);
                const accessories = row.items.filter(item => !item.isLook);
                return (
                  <div key={row.flowId} className="mb-6">
                    <div className="flex gap-4">
                      {lookItem && (
                        <div className="w-1/3 min-w-[120px]">
                          <ItemCard
                            item={lookItem}
                            isPacked={packedItems.has(lookItem.id)}
                            onTogglePack={() => onTogglePack(lookItem.id)}
                            onOpenModal={() => onOpenModal(lookItem)}
                            getImageUrl={getImageUrl}
                            hasCustomImage={hasCustomImage}
                            isLarge
                          />
                        </div>
                      )}
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        {accessories.map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            isPacked={packedItems.has(item.id)}
                            onTogglePack={() => onTogglePack(item.id)}
                            onOpenModal={() => onOpenModal(item)}
                            getImageUrl={getImageUrl}
                            hasCustomImage={hasCustomImage}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {dayData.evening.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-normal">Evening</p>
              {dayData.evening.map((row) => {
                const lookItem = row.items.find(item => item.isLook);
                const accessories = row.items.filter(item => !item.isLook);
                return (
                  <div key={row.flowId} className="mb-6">
                    <div className="flex gap-4">
                      {lookItem && (
                        <div className="w-1/3 min-w-[120px]">
                          <ItemCard
                            item={lookItem}
                            isPacked={packedItems.has(lookItem.id)}
                            onTogglePack={() => onTogglePack(lookItem.id)}
                            onOpenModal={() => onOpenModal(lookItem)}
                            getImageUrl={getImageUrl}
                            hasCustomImage={hasCustomImage}
                            isLarge
                          />
                        </div>
                      )}
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        {accessories.map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            isPacked={packedItems.has(item.id)}
                            onTogglePack={() => onTogglePack(item.id)}
                            onOpenModal={() => onOpenModal(item)}
                            getImageUrl={getImageUrl}
                            hasCustomImage={hasCustomImage}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function PackingList() {
  const { getImageUrl, hasCustomImage, isLoading } = useCustomImages();
  const [viewMode, setViewMode] = useState<'organize' | 'pack'>('organize');
  const [showSelfieSection, setShowSelfieSection] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [packedItems, setPackedItems] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('fdv_packed_items');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const packingData = useMemo(() => extractPackingData(), []);

  const handleOpenModal = (item: PackingItem) => {
    const hasCustom = hasCustomImage(item.imageKey);
    const imageUrl = (hasCustom || item.image) ? getImageUrl(item.imageKey, item.image) : '';
    setSelectedItem({
      id: item.id,
      title: item.name,
      brand: item.brand,
      description: `${item.context} — ${item.whyText}`,
      bucket: item.isLook ? 'Look' : 'Accessory',
      pinType: item.isLook ? 'look' : 'product',
      assetKey: item.imageKey,
      storyTag: 'morocco',
      imageUrl,
    });
    setModalOpen(true);
  };

  const toggleDay = (day: number) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const togglePacked = (id: string) => {
    setPackedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem('fdv_packed_items', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const totalItems = packingData.reduce((acc, d) => 
    acc + d.morning.length + d.afternoon.length + d.evening.length, 0
  );
  const packedCount = packedItems.size;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-5 py-6 text-center">
          <Link href="/">
            <img 
              src={logoImage} 
              alt="FDV" 
              className="h-6 mx-auto mb-2 dark:invert cursor-pointer"
              data-testid="link-logo-home"
            />
          </Link>
          <h1 className="font-serif text-2xl font-light tracking-wide mb-1">Suitcase</h1>
          <p className="text-sm text-muted-foreground font-light">Morocco • April 3–10, 2026</p>
        </div>
      </header>

      <div className="bg-card border-b border-border px-5 py-4 flex justify-center gap-3 flex-wrap">
        <div className="inline-flex">
          <button
            className={`px-6 py-2.5 text-sm font-normal border transition-colors ${
              viewMode === 'organize'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-border hover:bg-muted/50'
            } rounded-l-md border-r-0`}
            onClick={() => setViewMode('organize')}
            data-testid="button-view-organize"
          >
            Organize View
          </button>
          <button
            className={`px-6 py-2.5 text-sm font-normal border transition-colors ${
              viewMode === 'pack'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-border hover:bg-muted/50'
            } rounded-r-md`}
            onClick={() => setViewMode('pack')}
            data-testid="button-view-pack"
          >
            Pack View
          </button>
        </div>
        <Button
          variant={showSelfieSection ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowSelfieSection(!showSelfieSection)}
          className="gap-2"
          data-testid="button-toggle-photos"
        >
          <Camera className="w-4 h-4" />
          My Photos
        </Button>
      </div>

      {showSelfieSection && (
        <div className="bg-card border-b border-border p-5">
          <div className="max-w-lg mx-auto">
            <SelfieUpload />
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {packingData.map((dayData) => (
              <DaySection
                key={dayData.day}
                dayData={dayData}
                isExpanded={expandedDays.has(dayData.day)}
                onToggle={() => toggleDay(dayData.day)}
                viewMode={viewMode}
                packedItems={packedItems}
                onTogglePack={togglePacked}
                onOpenModal={handleOpenModal}
                getImageUrl={getImageUrl}
                hasCustomImage={hasCustomImage}
              />
            ))}
          </>
        )}
      </div>

      <div className="h-24" />

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="max-w-lg mx-auto flex justify-around py-2 pb-5">
          <Link href="/">
            <button className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground" data-testid="nav-home">
              <span className="text-lg">
                <ArrowLeft className="w-5 h-5" />
              </span>
              <span className="text-xs">Home</span>
            </button>
          </Link>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-foreground" data-testid="nav-suitcase">
            <span className="text-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="text-xs">Suitcase</span>
          </button>
          <Link href="/images">
            <button className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground" data-testid="nav-manage">
              <span className="text-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="text-xs">Manage</span>
            </button>
          </Link>
        </div>
      </nav>

      <ItemModal
        item={selectedItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <style>{`
        @media print {
          .fixed, nav, header button {
            display: none !important;
          }
          .max-h-0 {
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}
