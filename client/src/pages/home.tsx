import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
// GlobalNav removed — TopBar is now app-level in App.tsx
import fdvLogo from '@assets/LOGO_1767219658929.png';
import { 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Sun, 
  Cloud, 
  Wind, 
  X,
  Phone, 
  Navigation, 
  Clock, 
  Info,
  ArrowRight,
  ArrowLeft,
  Camera,
  PenLine,
  CloudUpload,
  Ticket,
  ShoppingBag,
  Sparkles,
  Loader2,
  Share2,
  Save,
  Download,
  Mail,
  FileText,
  Calendar,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useJournal, type JournalEntry } from '@/hooks/use-journal';
import { useCustomImages } from '@/hooks/use-custom-images';
import { SelfiePickerModal } from '@/components/selfie-picker-modal';
import { PinButton } from '@/components/pin-button';
import { ItemModal, type ItemModalData } from '@/components/item-modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { SelfieImage } from '@shared/schema';
import { 
  ITINERARY_DATA, 
  type ItineraryPage, 
  type FlowItem, 
  type DayPage,
  type CoverPage,
  type IntroPage,
  type FieldNotesPage,
  type JournalPage as JournalPageType
} from '@shared/itinerary-data';
import {
  EditorialOverview,
  extractEditorialData,
  EditorialDaySection
} from '@/components/editorial-sections';
import { LoadingImage } from '@/components/loading-image';
import { getProductByKey, getProductDisplayName, isShoppable, SECTION_LOOK_GENOME_KEY, FLOW_LOOK_GENOME_KEY } from '@/lib/brand-genome';

function isDayPage(page: ItineraryPage): page is DayPage {
  return 'day' in page;
}

function isCoverPage(page: ItineraryPage): page is CoverPage {
  return 'type' in page && page.type === 'cover';
}

function isIntroPage(page: ItineraryPage): page is IntroPage {
  return 'type' in page && page.type === 'intro';
}

function isFieldNotesPage(page: ItineraryPage): page is FieldNotesPage {
  return 'type' in page && page.type === 'field-notes-global';
}

function isJournalPage(page: ItineraryPage): page is JournalPageType {
  return 'type' in page && page.type === 'journal';
}

// Calendar link helpers
function getEventDateTime(date: string, time: string): { start: Date; end: Date } {
  // Parse date like "Friday, April 3, 2026"
  const dateMatch = date.match(/(\w+),\s+(\w+)\s+(\d+),\s+(\d+)/);
  if (!dateMatch) {
    // Default to April 3, 2026
    const defaultDate = new Date(2026, 3, 3);
    return { start: defaultDate, end: new Date(defaultDate.getTime() + 2 * 60 * 60 * 1000) };
  }
  
  const monthNames: Record<string, number> = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  
  const month = monthNames[dateMatch[2]] ?? 3;
  const day = parseInt(dateMatch[3]);
  const year = parseInt(dateMatch[4]);
  
  // Parse time like "Morning", "Afternoon", "Evening", "07:30", etc.
  let hour = 9; // default morning
  const timeLower = time.toLowerCase();
  if (timeLower.includes('morning') || timeLower === 'am') hour = 9;
  else if (timeLower.includes('afternoon')) hour = 14;
  else if (timeLower.includes('evening')) hour = 19;
  else if (timeLower.includes('night')) hour = 20;
  else {
    // Try parsing specific time like "07:30"
    const timeMatch = time.match(/(\d{1,2}):?(\d{2})?/);
    if (timeMatch) {
      hour = parseInt(timeMatch[1]);
      if (hour < 6) hour += 12; // Assume PM for times like 7:30
    }
  }
  
  const start = new Date(year, month, day, hour, 0, 0);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hour duration
  
  return { start, end };
}

function formatDateForGoogle(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function generateGoogleCalendarUrl(title: string, description: string, location: string, date: string, time: string): string {
  const { start, end } = getEventDateTime(date, time);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `FDV Morocco: ${title}`,
    details: description || title,
    location: location,
    dates: `${formatDateForGoogle(start)}/${formatDateForGoogle(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function generateICSContent(title: string, description: string, location: string, date: string, time: string): string {
  const { start, end } = getEventDateTime(date, time);
  const formatICS = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FDV Concierge//Morocco 2026//EN
BEGIN:VEVENT
DTSTART:${formatICS(start)}
DTEND:${formatICS(end)}
SUMMARY:FDV Morocco: ${title}
DESCRIPTION:${description || title}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
}

function downloadICS(title: string, description: string, location: string, date: string, time: string) {
  const icsContent = generateICSContent(title, description, location, date, time);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fdv-morocco-${title.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function WeatherDisplay({ weather }: { weather: { temp: number; cond: string } }) {
  const getIcon = (cond: string) => {
    const c = cond?.toLowerCase() || '';
    if (c.includes('rain')) return <Cloud className="w-4 h-4" />;
    if (c.includes('wind')) return <Wind className="w-4 h-4" />;
    if (c.includes('cloud')) return <Cloud className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };
  
  return (
    <div className="flex items-center gap-4 bg-card/50 dark:bg-card/30 backdrop-blur px-5 py-2.5 rounded-full border border-border">
      <div className="text-foreground">{getIcon(weather.cond)}</div>
      <div className="flex flex-col">
        <span className="text-[11px] font-bold uppercase tracking-tight leading-none">{weather.temp}°F / {weather.cond}</span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-widest leading-none mt-1">Live Conditions</span>
      </div>
    </div>
  );
}

interface ItemDetailDrawerProps {
  item: FlowItem;
  entries: { [key: string]: JournalEntry };
  status: 'idle' | 'saving' | 'saved';
  location?: string;
  date?: string;
  onClose: () => void;
  onJournalChange: (id: string, note: string) => void;
  getImageUrl: (key: string, defaultUrl: string, context?: { time?: string; location?: string; title?: string; description?: string; imageType?: 'item' | 'wardrobe' | 'cover' }) => string;
  hasCustomImage: (key: string) => boolean;
  onImageUpload: (id: string, file: File, field: string) => void;
  onImagesUpdate: (id: string, images: LocalLogImage[]) => void;
  onShare: () => void;
  onApplySelfie: (imageKey: string, selfie: SelfieImage) => void;
  onOpenProductModal?: (data: { title: string; imageUrl: string; itemId: string; brand?: string; description?: string; shopUrl?: string; pinType?: string; genomeKey?: string }) => void;
}

interface LocalLogImage {
  src: string;
  caption: string;
}

function ItemDetailDrawer({
  item,
  entries,
  status,
  location,
  date,
  onClose,
  onJournalChange,
  getImageUrl,
  hasCustomImage,
  onImageUpload,
  onImagesUpdate,
  onShare,
  onApplySelfie,
  onOpenProductModal
}: ItemDetailDrawerProps) {
  const [selfiePickerOpen, setSelfiePickerOpen] = useState(false);
  const [selfiePickerTarget, setSelfiePickerTarget] = useState<string | null>(null);

  const handleOpenSelfiePicker = (imageKey: string) => {
    setSelfiePickerTarget(imageKey);
    setSelfiePickerOpen(true);
  };

  const handleSelectSelfie = (selfie: SelfieImage) => {
    if (selfiePickerTarget) {
      onApplySelfie(selfiePickerTarget, selfie);
    }
    setSelfiePickerOpen(false);
    setSelfiePickerTarget(null);
  };

  const getExistingImages = (): LocalLogImage[] => {
    const entry = entries[item.id];
    if (entry?.logImages && entry.logImages.length > 0) {
      return entry.logImages.map(img => 
        typeof img === 'string' ? { src: img, caption: '' } : { src: img.src, caption: img.caption || '' }
      );
    }
    if (entry?.logImage) {
      return [{ src: entry.logImage, caption: '' }];
    }
    return [];
  };

  const [localNote, setLocalNote] = useState(entries[item.id]?.note || '');
  const [localLogImages, setLocalLogImages] = useState<LocalLogImage[]>(getExistingImages);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const captionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleNoteChange = useCallback((value: string) => {
    setLocalNote(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onJournalChange(item.id, value);
    }, 800);
  }, [item.id, onJournalChange]);

  const handleImageUpload = useCallback((file: File, field: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (field === 'logImage') {
        setLocalLogImages(prev => [...prev, { src: result, caption: '' }]);
      }
    };
    reader.readAsDataURL(file);
    onImageUpload(item.id, file, field);
  }, [item.id, onImageUpload]);

  const handleRemoveImage = useCallback((index: number) => {
    const newImages = localLogImages.filter((_, i) => i !== index);
    setLocalLogImages(newImages);
    onImagesUpdate(item.id, newImages);
  }, [item.id, localLogImages, onImagesUpdate]);

  const handleCaptionChange = useCallback((index: number, caption: string) => {
    const newImages = localLogImages.map((img, i) => i === index ? { ...img, caption } : img);
    setLocalLogImages(newImages);
    if (captionDebounceRef.current) clearTimeout(captionDebounceRef.current);
    captionDebounceRef.current = setTimeout(() => {
      onImagesUpdate(item.id, newImages);
    }, 800);
  }, [item.id, localLogImages, onImagesUpdate]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (captionDebounceRef.current) clearTimeout(captionDebounceRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-background p-6 md:p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
      <div className="fixed top-6 right-6 z-[10000] flex gap-4">
        <Button 
          onClick={onClose} 
          className="rounded-full"
          data-testid="button-close-detail"
        >
          Close
        </Button>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-16 pb-32 pt-12">
        
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.4em] uppercase text-muted-foreground">
            <Clock className="w-3.5 h-3.5" /> {item.time}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]">
            <Sun className="w-3.5 h-3.5" /> 72°F
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-none" data-testid="text-item-title">
            {item.title}
          </h2>
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted my-6 rounded-md relative">
            <LoadingImage 
              src={getImageUrl(item.id, item.image, { time: item.time, location, title: item.title, description: item.description, imageType: 'item' })} 
              className="w-full h-full object-cover" 
              alt={item.title}
            />
            <div className="absolute top-2 right-2">
              <PinButton
                itemType="experience"
                itemId={item.id}
                itemData={{
                  title: item.title,
                  description: item.description || item.body,
                  imageUrl: getImageUrl(item.id, item.image, { time: item.time, location, title: item.title, description: item.description, imageType: 'item' }),
                  time: item.time,
                  location,
                  editTag: 'morocco-edit',
                  storyTag: 'morocco'
                }}
                sourceContext="morocco_itinerary"
                aestheticTags={['experience', item.time?.toLowerCase() || '']}
                size="md"
              />
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground leading-[1.8] font-serif italic border-l-2 border-border pl-8">
            {item.description || item.body}
          </p>
        </div>

        {(item.contact || item.email || item.address || item.notes || item.map || item.ticketLink) && (
          <div className="pt-8 border-t border-border">
            <h3 className="text-[11px] font-bold tracking-[0.5em] uppercase mb-8 flex items-center gap-3">
              <MapPin className="w-4 h-4" /> LOGISTICS
            </h3>
            <div className="space-y-4">
              {item.address && (
                <div 
                  className="flex items-start gap-4 text-sm font-medium border-b border-border/50 pb-3"
                  data-testid="text-address"
                >
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> 
                  <span>{item.address}</span>
                </div>
              )}
              {item.contact && (
                <a 
                  href={`tel:${item.contact}`} 
                  className="flex items-center gap-4 text-sm font-medium border-b border-border/50 pb-3 hover:border-foreground transition-all"
                  data-testid="link-contact"
                >
                  <Phone className="w-3.5 h-3.5" /> {item.contact}
                </a>
              )}
              {item.email && (
                <a 
                  href={`mailto:${item.email}`} 
                  className="flex items-center gap-4 text-sm font-medium border-b border-border/50 pb-3 hover:border-foreground transition-all"
                  data-testid="link-email"
                >
                  <Mail className="w-3.5 h-3.5" /> {item.email}
                </a>
              )}
              {item.notes && (
                <div 
                  className="flex items-start gap-4 text-sm text-muted-foreground border-b border-border/50 pb-3"
                  data-testid="text-notes"
                >
                  <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> 
                  <span className="italic">{item.notes}</span>
                </div>
              )}
              {item.map && (
                <a 
                  href={item.map} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-sm font-medium border-b border-border/50 pb-3 hover:border-foreground transition-all"
                  data-testid="link-map"
                >
                  <Navigation className="w-3.5 h-3.5" /> Open in Maps
                </a>
              )}
              {item.ticketLink && (
                <a 
                  href={item.ticketLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 text-sm font-medium bg-foreground text-background px-6 py-4 rounded-full hover:opacity-80 transition-all"
                  data-testid="link-tickets"
                >
                  <Ticket className="w-3.5 h-3.5" /> Book Tickets
                </a>
              )}
            </div>
          </div>
        )}

        {/* Calendar Links - Always show for timed events */}
        {date && (
          <div className="pt-8 border-t border-border">
            <h3 className="text-[11px] font-bold tracking-[0.5em] uppercase mb-6 flex items-center gap-3">
              <Calendar className="w-4 h-4" /> ADD TO CALENDAR
            </h3>
            <div className="flex flex-wrap gap-3">
              <a 
                href={generateGoogleCalendarUrl(item.title, item.description || '', location || '', date, item.time)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium border border-border px-4 py-2.5 rounded-full hover:border-foreground transition-all"
                data-testid="link-google-calendar"
              >
                <Calendar className="w-3.5 h-3.5" /> Google Calendar
              </a>
              <button 
                onClick={() => downloadICS(item.title, item.description || '', location || '', date, item.time)}
                className="inline-flex items-center gap-2 text-sm font-medium border border-border px-4 py-2.5 rounded-full hover:border-foreground transition-all"
                data-testid="button-apple-calendar"
              >
                <Download className="w-3.5 h-3.5" /> Apple Calendar
              </button>
            </div>
          </div>
        )}

        {item.wardrobe && (
          <div className="pt-16 border-t border-border">
            <h3 className="text-[11px] font-bold tracking-[0.5em] uppercase mb-8 flex items-center gap-3">
              <Sparkles className="w-4 h-4" /> THE LOOK
            </h3>
            <p className="text-base font-medium italic opacity-70 leading-relaxed mb-8">"{item.wardrobe}"</p>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div
                  className="w-full max-w-xs mx-auto rounded-md relative cursor-pointer"
                  onClick={() => {
                    if (onOpenProductModal) {
                      const lookGenomeKey = FLOW_LOOK_GENOME_KEY[item.id] || SECTION_LOOK_GENOME_KEY[item.id];
                      const gp = lookGenomeKey ? getProductByKey(lookGenomeKey) : undefined;
                      onOpenProductModal({
                        title: gp?.name || `${item.title} - The Look`,
                        imageUrl: getImageUrl(`${item.id}-wardrobe`, item.commercialWardrobe || "", { imageType: 'wardrobe', title: item.title }),
                        itemId: `${item.id}-look`,
                        brand: gp?.brand || undefined,
                        description: gp?.description || item.wardrobe,
                        shopUrl: gp?.url || undefined,
                        pinType: "style",
                        genomeKey: lookGenomeKey || undefined,
                      });
                    }
                  }}
                >
                  <img
                    src={getImageUrl(
                      `${item.id}-wardrobe`,
                      item.commercialWardrobe || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
                      { imageType: 'wardrobe', title: item.title }
                    )}
                    className="rounded-md w-full"
                    onLoad={(e) => {
                      // Force natural aspect ratio display
                      const img = e.currentTarget;
                      img.style.height = 'auto';
                    }}
                    alt="Style recommendation"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    {(() => {
                      const pinGenomeKey = FLOW_LOOK_GENOME_KEY[item.id] || SECTION_LOOK_GENOME_KEY[item.id];
                      const pinProduct = pinGenomeKey ? getProductByKey(pinGenomeKey) : undefined;
                      return (
                        <PinButton
                          itemType="look"
                          itemId={`${item.id}-look`}
                          itemData={{
                            title: pinProduct?.name || `${item.title} - The Look`,
                            description: pinProduct?.description || item.wardrobe,
                            imageUrl: getImageUrl(
                              `${item.id}-wardrobe`,
                              item.commercialWardrobe || "",
                              { imageType: 'wardrobe', title: item.title }
                            ),
                            editTag: 'morocco-edit',
                            storyTag: 'morocco',
                            genomeKey: pinGenomeKey || undefined,
                          }}
                          sourceContext="morocco_itinerary"
                          aestheticTags={['look', 'outfit', 'style']}
                          size="md"
                        />
                      );
                    })()}
                  </div>
                </div>
                <div className="flex justify-between items-center max-w-md mx-auto">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">FDV Recommendation</p>
                  <button className="text-[10px] font-medium underline" data-testid="button-shop-look">Shop Look</button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {[0, 1, 2, 3].map((index) => {
                  const extra = item.wardrobeExtras?.[index];
                  const extraKey = `${item.id}-extra-${index}`;
                  const customImageUrl = hasCustomImage(extraKey) ? getImageUrl(extraKey, '') : null;
                  const hasImage = customImageUrl || extra?.image;
                  const placeholderName = ['Footwear', 'Handbag', 'Jewelry', 'Accessory'][index];
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="aspect-square bg-card border border-border rounded-md overflow-hidden relative group">
                        {hasImage ? (
                          <>
                            <img
                              src={getImageUrl(extraKey, extra?.image || '')}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                              alt={extra?.name || placeholderName}
                              onClick={() => {
                                if (onOpenProductModal) {
                                  onOpenProductModal({
                                    title: extra?.name || placeholderName,
                                    imageUrl: getImageUrl(extraKey, extra?.image || ''),
                                    itemId: extraKey,
                                    shopUrl: extra?.shopLink,
                                    pinType: "product",
                                  });
                                }
                              }}
                            />
                            <div className="absolute top-1 right-1 z-10">
                              <PinButton
                                itemType="product"
                                itemId={extraKey}
                                itemData={{
                                  title: extra?.name || placeholderName,
                                  imageUrl: getImageUrl(extraKey, extra?.image || ''),
                                  shopLink: extra?.shopLink,
                                  editTag: 'morocco-edit',
                                  storyTag: 'morocco'
                                }}
                                sourceContext="morocco_itinerary"
                                aestheticTags={['accessory', placeholderName.toLowerCase()]}
                                size="sm"
                              />
                            </div>
                            <div className="absolute bottom-1 right-1 flex gap-1 z-10">
                              <button
                                onClick={() => handleOpenSelfiePicker(extraKey)}
                                className="p-1.5 bg-background/90 rounded-full h-6 w-6 flex items-center justify-center"
                                data-testid={`button-selfie-${index}`}
                              >
                                <Camera className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenSelfiePicker(extraKey)}
                            className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                            data-testid={`button-add-selfie-${index}`}
                          >
                            <Camera className="w-4 h-4" />
                            <span className="text-[8px] font-medium">ADD</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] font-medium uppercase tracking-wider text-center truncate opacity-60">
                        {extra?.name || placeholderName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="pt-16 border-t border-border">
          <h3 className="text-[11px] font-bold tracking-[0.5em] uppercase mb-8 flex items-center gap-3">
            <PenLine className="w-4 h-4" /> TRAVEL LOG
          </h3>
          
          <textarea 
            placeholder="Record the moment..."
            className="w-full bg-card border border-border p-6 font-serif italic text-lg focus:outline-none focus:border-foreground/20 transition-all min-h-[150px] rounded-md mb-8 resize-none"
            value={localNote}
            onChange={(e) => handleNoteChange(e.target.value)}
            data-testid="textarea-journal"
          />

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localLogImages.map((img, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-square relative group overflow-hidden rounded-md">
                    <img src={img.src} className="w-full h-full object-cover" alt={`Log ${index + 1}`} />
                    <button 
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-remove-image-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input 
                    type="text"
                    placeholder="Add a caption..."
                    className="w-full bg-transparent border-b border-border px-2 py-2 font-serif italic text-sm focus:outline-none focus:border-foreground/40 transition-all"
                    value={img.caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    data-testid={`input-caption-${index}`}
                  />
                </div>
              ))}
              <label className="aspect-square bg-card border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-muted cursor-pointer relative overflow-hidden group rounded-md">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logImage')}
                  data-testid="input-log-image"
                />
                <Camera className="w-6 h-6 opacity-20 group-hover:opacity-100 transition-opacity" />
                <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Add Photo</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={onShare} 
                className="w-full rounded-md"
                data-testid="button-share"
                disabled={localLogImages.length === 0}
              >
                <Share2 className="w-3.5 h-3.5 mr-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Share to Instagram</span>
              </Button>

              <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-md">
                {status === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {status === 'saving' ? 'Saving...' : 'Saved to Log'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SelfiePickerModal
        isOpen={selfiePickerOpen}
        onClose={() => {
          setSelfiePickerOpen(false);
          setSelfiePickerTarget(null);
        }}
        onSelectSelfie={handleSelectSelfie}
        title="Use Your Photo"
      />
    </div>
  );
}

interface ShareModalProps {
  item: FlowItem;
  entries: { [key: string]: JournalEntry };
  onClose: () => void;
}

function ShareModal({ item, entries, onClose }: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FDV Concierge - Morocco 2026',
          text: `Checking in at ${item.title}`,
          url: window.location.href,
        });
      } catch (err) { 
        console.log(err); 
      }
    } else {
      alert("Screenshot this view to share!");
    }
  };

  const generateStoryImage = async (): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    canvas.width = 1080;
    canvas.height = 1920;
    
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const logImagesRaw = entries[item.id]?.logImages || [];
    const firstImage = logImagesRaw.length > 0 
      ? (typeof logImagesRaw[0] === 'string' ? logImagesRaw[0] : logImagesRaw[0].src)
      : entries[item.id]?.logImage;
    const userImage = firstImage || entries[item.id]?.image;
    
    if (userImage && userImage.startsWith('data:')) {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = userImage;
      });
      
      const imgX = 90;
      const imgY = 180;
      const imgWidth = 900;
      const imgHeight = 900;
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
    } else {
      ctx.fillStyle = '#e8e4df';
      ctx.fillRect(90, 180, 900, 900);
      ctx.fillStyle = '#999999';
      ctx.font = '24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Your Photo Here', 540, 640);
      ctx.textAlign = 'left';
    }
    
    ctx.fillStyle = '#999999';
    ctx.font = '600 22px Inter, sans-serif';
    ctx.fillText('FDV CONCIERGE', 90, 100);
    ctx.fillStyle = '#cccccc';
    ctx.fillText(' — MOROCCO 2026', 280, 100);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillText(item.title, 90, 1200);
    
    ctx.font = 'italic 36px Georgia, serif';
    ctx.fillStyle = '#555555';
    const note = entries[item.id]?.note || 'A rhythm found in Morocco.';
    const words = note.split(' ');
    let line = '"';
    let y = 1280;
    for (const word of words) {
      const testLine = line + word + ' ';
      if (ctx.measureText(testLine).width > 900) {
        ctx.fillText(line, 90, y);
        line = word + ' ';
        y += 50;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim() + '"', 90, y);
    
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 1750);
    ctx.lineTo(990, 1750);
    ctx.stroke();
    
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '600 18px Inter, sans-serif';
    ctx.fillText('FDV CONCIERGE', 90, 1800);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const handleSaveToPhotos = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateStoryImage();
      if (!blob) throw new Error('Could not generate image');
      
      const filename = `fdv-morocco-${item.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      const file = new File([blob], filename, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'FDV Concierge - Morocco 2026',
        });
      } else {
        const dataUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(dataUrl);
        alert('Image downloaded. On mobile, long-press the image to save to Photos.');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Save failed:', err);
        alert('Could not save image. Please take a screenshot instead.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-foreground dark:bg-background flex flex-col items-center justify-center p-4">
      <button 
        onClick={onClose} 
        className="fixed top-8 right-8 text-background/50 dark:text-foreground/50 hover:text-background dark:hover:text-foreground transition-colors z-[10000]"
        data-testid="button-close-share"
      >
        <X className="w-8 h-8" />
      </button>
      
      <div ref={cardRef} className="w-full max-w-[400px] max-h-[85vh] overflow-y-auto bg-background dark:bg-card shadow-2xl flex flex-col p-8 relative animate-in fade-in zoom-in-95 duration-700 rounded-md">
        <div className="space-y-6 z-10">
          <img src={fdvLogo} alt="FDV Concierge" className="h-6 w-auto opacity-40 dark:invert" />
          <div className="aspect-square w-full overflow-hidden bg-foreground/5 shadow-xl rounded-md">
            <img 
              src={(() => {
                const first = entries[item.id]?.logImages?.[0];
                if (first) {
                  return typeof first === 'string' ? first : first.src;
                }
                return entries[item.id]?.logImage || entries[item.id]?.image || item.image;
              })()} 
              className="w-full h-full object-cover" 
              alt="Moment" 
            />
          </div>
        </div>
        <div className="space-y-4 z-10 mt-6">
          <h4 className="text-2xl md:text-3xl font-serif font-bold tracking-tight leading-tight">{item.title}</h4>
          <p className="text-base md:text-lg italic opacity-80 leading-relaxed font-serif">
            "{entries[item.id]?.note || "A rhythm found in Morocco."}"
          </p>
          <div className="flex justify-between items-end pt-4 border-t border-border">
            <img src={fdvLogo} alt="FDV Concierge" className="h-4 w-auto opacity-30 dark:invert" />
            <MapPin className="w-3.5 h-3.5 opacity-20" />
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <Button 
          onClick={handleSaveToPhotos} 
          disabled={isDownloading}
          className="rounded-full px-12 py-5"
          data-testid="button-save-photos"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Save to Photos
        </Button>
        <Button 
          onClick={handleNativeShare} 
          variant="outline"
          className="rounded-full px-12 py-5"
          data-testid="button-share-save"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Send via Message
        </Button>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-background/40 dark:text-foreground/40 italic mt-2">
          Tap Save to add to your Photos for Instagram Stories
        </p>
        <Button 
          onClick={onClose} 
          variant="ghost"
          className="rounded-full px-12 py-5 mt-4 text-background/60 dark:text-foreground/60"
          data-testid="button-back-share"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}

function SaveTripButton() {
  const queryClient = useQueryClient();
  const { data: checkData } = useQuery({
    queryKey: ['/api/saves/check', 'morocco-trip-2026'],
    queryFn: async () => {
      const res = await fetch('/api/saves/check/morocco-trip-2026');
      if (!res.ok) return { isPinned: false };
      return res.json();
    },
  });
  const isSaved = checkData?.isPinned ?? false;

  const saveTripMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'trip',
          itemId: 'morocco-trip-2026',
          sourceContext: 'morocco_itinerary',
          aestheticTags: ['morocco', 'trip', 'travel'],
          savedAt: Date.now(),
          metadata: {
            title: 'Morocco \u2014 Atlas Mountains & Marrakech',
            subtitle: 'April 2026',
            imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800',
            bucket: 'my-trips',
          },
          storyTag: 'morocco',
          editionTag: 'morocco-2026',
          editTag: 'morocco-trip',
          title: 'Morocco \u2014 Atlas Mountains & Marrakech',
          assetUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800',
        }),
      });
      if (res.status === 400) return { alreadySaved: true };
      if (!res.ok) throw new Error('Failed to save trip');
      return { alreadySaved: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saves/check', 'morocco-trip-2026'] });
    },
  });

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (!isSaved) saveTripMutation.mutate();
      }}
      disabled={saveTripMutation.isPending || isSaved}
      className="inline-flex items-center gap-2 py-3 px-8 text-xs tracking-[0.2em] uppercase transition-all"
      style={{
        backgroundColor: isSaved ? '#c9a84c' : 'transparent',
        color: isSaved ? '#ffffff' : '#1a1a1a',
        border: isSaved ? '1px solid #c9a84c' : '1px solid #1a1a1a',
        fontFamily: "'Inter', sans-serif",
        opacity: saveTripMutation.isPending ? 0.5 : 1,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 32" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isSaved ? 0 : 2}>
        <circle cx="12" cy="10" r="9" />
        <polygon points="9,18 12,32 15,18" />
      </svg>
      <span>{isSaved ? 'Trip Saved' : 'Save This Trip'}</span>
    </button>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeItem, setActiveItem] = useState<FlowItem | null>(null);
  const [isShareMode, setIsShareMode] = useState(false);
  const [productModalItem, setProductModalItem] = useState<ItemModalData | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const { entries: journalEntries, saveEntry, status: saveStatus } = useJournal();
  const { getImageUrl, hasCustomImage, isLoading: isLoadingImages } = useCustomImages();
  const queryClient = useQueryClient();

  const saveCustomImageMutation = useMutation({
    mutationFn: async ({ imageKey, selfie }: { imageKey: string; selfie: SelfieImage }) => {
      const res = await apiRequest('POST', `/api/images/${imageKey}`, {
        customUrl: selfie.processedUrl,
        label: selfie.name,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
    },
  });

  const handleApplySelfie = (imageKey: string, selfie: SelfieImage) => {
    saveCustomImageMutation.mutate({ imageKey, selfie });
  };

  const handleJournalChange = (itemId: string, note: string) => {
    saveEntry(itemId, { note });
  };

  const handleImagesUpdate = (itemId: string, images: LocalLogImage[]) => {
    saveEntry(itemId, { logImages: images });
  };

  const processImage = (itemId: string, file: File, field: string = 'image') => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) { 
          height *= MAX_WIDTH / width; 
          width = MAX_WIDTH; 
        }
        canvas.width = width; 
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.6);
        
        if (field === 'logImage') {
          const existingImages = journalEntries[itemId]?.logImages || [];
          const normalizedImages = existingImages.map(img => 
            typeof img === 'string' ? { src: img, caption: '' } : img
          );
          if (journalEntries[itemId]?.logImage && normalizedImages.length === 0) {
            normalizedImages.push({ src: journalEntries[itemId].logImage!, caption: '' });
          }
          saveEntry(itemId, { logImages: [...normalizedImages, { src: base64, caption: '' }] });
        } else {
          saveEntry(itemId, { [field]: base64 });
        }
      };
    };
  };

  const findItemById = (id: string): FlowItem | null => {
    for (const page of ITINERARY_DATA) {
      if (isDayPage(page)) {
        const found = page.flow.find(item => item.id === id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleNavBack = () => {
    setLocation('/destinations');
  };

  const openProductModal = (data: { title: string; imageUrl: string; itemId: string; brand?: string; description?: string; shopUrl?: string; pinType?: string; genomeKey?: string }) => {
    // Resolve genome key: use provided key, or derive from itemId (e.g. "d1-1-look" or "d1-1-wardrobe" → "d1-1")
    let resolvedGenomeKey = data.genomeKey;
    if (!resolvedGenomeKey && data.itemId) {
      const flowId = data.itemId.replace(/-(look|wardrobe)$/, '');
      const mapKey = FLOW_LOOK_GENOME_KEY[flowId] || SECTION_LOOK_GENOME_KEY[flowId];
      if (mapKey) resolvedGenomeKey = mapKey;
    }
    // Try genome lookup for rich product data
    const genome = resolvedGenomeKey ? getProductByKey(resolvedGenomeKey) : undefined;
    const displayName = genome ? getProductDisplayName(genome) : data.title;
    const shopUrlResolved = genome && isShoppable(genome) ? genome.url : data.shopUrl;

    console.log('[OPEN MODAL]', { itemId: data.itemId, passedGenomeKey: data.genomeKey, resolvedGenomeKey, genomeName: genome?.name });

    setProductModalItem({
      id: data.itemId,
      title: displayName,
      bucket: "Your Style",
      pinType: data.pinType || "look",
      assetKey: data.itemId,
      storyTag: "morocco",
      imageUrl: data.imageUrl,
      brand: genome?.brand || data.brand,
      price: genome?.price || undefined,
      shopUrl: shopUrlResolved || undefined,
      description: genome?.description || data.description,
      color: genome?.color || undefined,
      sizes: genome?.sizes || undefined,
      shopStatus: genome?.shop_status || undefined,
      genomeKey: resolvedGenomeKey,
    });
    setProductModalOpen(true);
  };

  const editorialData = extractEditorialData();

  return (
    <div className="min-h-screen pb-[80px] bg-background text-foreground font-sans selection:bg-foreground selection:text-background transition-colors duration-500 overflow-x-hidden">

      {/* GlobalNav removed — TopBar is now app-level in App.tsx */}

      {/* STEP 1: Editorial Intro */}
      <section
        style={{
          background: "#faf9f6",
          padding: "48px 24px 32px",
          textAlign: "center",
          borderBottom: "1px solid #e8e0d4",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: 24,
            }}
          >
            MOROCCO — 8 DAYS
          </p>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 19,
              lineHeight: 1.65,
              color: "#2c2416",
              fontWeight: 400,
            }}
          >
            A journey through Marrakech and the Atlas Mountains, curated for
            someone who travels the way they dress — with intention.
          </p>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 19,
              lineHeight: 1.65,
              color: "#2c2416",
              fontWeight: 400,
              marginTop: 20,
            }}
          >
            Every outfit has been considered for the moment it belongs to.
            Every place was chosen because it's worth returning to.
          </p>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 17,
              lineHeight: 1.65,
              color: "rgba(44, 36, 22, 0.6)",
              fontWeight: 400,
              marginTop: 20,
              fontStyle: "italic",
            }}
          >
            Save the pieces that speak to you. They'll be waiting in your Suitcase.
          </p>
        </div>
      </section>

      {/* Editorial Overview - Days 1-8 summary (events + outfits) */}
      <div id="editorial-overview" className="scroll-mt-20" />
      <EditorialOverview
        getImageUrl={getImageUrl}
        hasCustomImage={hasCustomImage}
        onOpenProductModal={openProductModal}
      />

      {/* Save Trip CTA */}
      <div className="py-12 text-center px-4 border-t border-border">
        <SaveTripButton />
      </div>

      {/* STEP 3: Concierge Gate CTA */}
      <section
        style={{
          background: "#faf9f6",
          borderTop: "1px solid #f5f1e8",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: 24,
            }}
          >
            YOUR FDV CONCIERGE
          </p>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 19,
              lineHeight: 1.65,
              color: "#2c2416",
              fontWeight: 400,
            }}
          >
            Everything above is your trip at a glance.
            <br />
            But a glance isn't a plan.
          </p>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 19,
              lineHeight: 1.65,
              color: "#2c2416",
              fontWeight: 400,
              marginTop: 20,
            }}
          >
            Your FDV Concierge turns this overview into a fully orchestrated
            experience — day-by-day logistics, pre-built packing lists,
            restaurant reservations, and a Travel Diary to capture it all.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/daily-flow"
              onClick={(e) => { e.preventDefault(); setLocation("/daily-flow"); }}
              style={{
                display: "inline-block",
                padding: "14px 32px",
                background: "#1a1a1a",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
              }}
            >
              Unlock Daily Flow
            </a>
            <a
              href="/concierge-info"
              onClick={(e) => { e.preventDefault(); setLocation("/concierge-info"); }}
              style={{
                display: "inline-block",
                padding: "14px 32px",
                background: "transparent",
                color: "#1a1a1a",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: 4,
                border: "1.5px solid #1a1a1a",
                cursor: "pointer",
              }}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Daily Flow content removed — now at standalone /daily-flow page */}

      {activeItem && !isShareMode && (
        <ItemDetailDrawer
          item={activeItem}
          entries={journalEntries}
          status={saveStatus}
          location={undefined}
          date={undefined}
          onClose={() => setActiveItem(null)}
          onJournalChange={handleJournalChange}
          getImageUrl={getImageUrl}
          hasCustomImage={hasCustomImage}
          onImageUpload={processImage}
          onImagesUpdate={handleImagesUpdate}
          onShare={() => setIsShareMode(true)}
          onApplySelfie={handleApplySelfie}
          onOpenProductModal={openProductModal}
        />
      )}

      {isShareMode && activeItem && (
        <ShareModal
          item={activeItem}
          entries={journalEntries}
          onClose={() => setIsShareMode(false)}
        />
      )}

      <ItemModal
        item={productModalItem}
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
      />
    </div>
  );
}
