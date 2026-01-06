import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import fdvLogo from '@assets/LOGO_1767219658929.png';
import { 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Sun, 
  Cloud, 
  Wind, 
  Menu, 
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
import { SuitcaseButton } from '@/components/suitcase-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  type JournalPage as JournalPageType,
  type PackingListPage
} from '@/lib/itinerary-data';

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

function isPackingListPage(page: ItineraryPage): page is PackingListPage {
  return 'type' in page && page.type === 'packing-list';
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
  onApplySelfie
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
            <img 
              src={getImageUrl(item.id, item.image, { time: item.time, location, title: item.title, description: item.description, imageType: 'item' })} 
              className="w-full h-full object-cover" 
              alt={item.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=1200';
              }}
            />
            <div className="absolute top-2 right-2">
              <PinButton
                itemType="activity"
                itemId={item.id}
                itemData={{
                  title: item.title,
                  description: item.description || item.body,
                  imageUrl: getImageUrl(item.id, item.image, { time: item.time, location, title: item.title, description: item.description, imageType: 'item' }),
                  time: item.time,
                  location
                }}
                sourceContext="morocco_itinerary"
                aestheticTags={['activity', item.time?.toLowerCase() || '']}
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
                <div className="aspect-[3/4] w-full max-w-md mx-auto bg-muted overflow-hidden rounded-md relative">
                  <img 
                    src={getImageUrl(
                      `${item.id}-wardrobe`,
                      item.commercialWardrobe || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
                      { imageType: 'wardrobe', title: item.title }
                    )} 
                    className="w-full h-full object-cover" 
                    alt="Style recommendation"
                  />
                  <div className="absolute top-3 right-3">
                    <PinButton
                      itemType="look"
                      itemId={`${item.id}-look`}
                      itemData={{
                        title: `${item.title} - The Look`,
                        description: item.wardrobe,
                        imageUrl: getImageUrl(
                          `${item.id}-wardrobe`,
                          item.commercialWardrobe || "",
                          { imageType: 'wardrobe', title: item.title }
                        )
                      }}
                      sourceContext="morocco_itinerary"
                      aestheticTags={['look', 'outfit', 'style']}
                      size="md"
                    />
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <SuitcaseButton
                      itemId={`${item.id}-look`}
                      itemData={{
                        title: `${item.title} - The Look`,
                        description: item.wardrobe,
                        imageUrl: getImageUrl(
                          `${item.id}-wardrobe`,
                          item.commercialWardrobe || "",
                          { imageType: 'wardrobe', title: item.title }
                        )
                      }}
                      sourceContext="morocco_itinerary"
                      aestheticTags={['look', 'outfit', 'style']}
                      size="md"
                    />
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
                            {extra?.shopLink ? (
                              <a 
                                href={extra.shopLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full h-full"
                              >
                                <img 
                                  src={getImageUrl(extraKey, extra?.image || '')} 
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                                  alt={extra?.name || placeholderName}
                                />
                              </a>
                            ) : (
                              <img 
                                src={getImageUrl(extraKey, extra?.image || '')} 
                                className="w-full h-full object-cover" 
                                alt={extra?.name || placeholderName}
                              />
                            )}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <PinButton
                                itemType="product"
                                itemId={extraKey}
                                itemData={{
                                  title: extra?.name || placeholderName,
                                  imageUrl: getImageUrl(extraKey, extra?.image || ''),
                                  shopLink: extra?.shopLink
                                }}
                                sourceContext="morocco_itinerary"
                                aestheticTags={['accessory', placeholderName.toLowerCase()]}
                                size="sm"
                              />
                            </div>
                            <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <SuitcaseButton
                                itemId={extraKey}
                                itemData={{
                                  title: extra?.name || placeholderName,
                                  imageUrl: getImageUrl(extraKey, extra?.image || ''),
                                  shopLink: extra?.shopLink
                                }}
                                sourceContext="morocco_itinerary"
                                aestheticTags={['accessory', placeholderName.toLowerCase()]}
                                size="sm"
                              />
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

interface PackingListItem {
  hidden?: boolean;
  customImage?: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [pageIndex, setPageIndex] = useState(() => {
    // Check for page query param first (from editorial navigation)
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam) {
      const pageNum = parseInt(pageParam, 10);
      if (!isNaN(pageNum) && pageNum >= 0 && pageNum < ITINERARY_DATA.length) {
        return pageNum;
      }
    }
    const saved = localStorage.getItem('fdv_page_index');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  // Clean up query param after reading it (in useEffect to avoid render-time side effects)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('page')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<FlowItem | null>(null);
  const [isShareMode, setIsShareMode] = useState(false);
  const [packingListItems, setPackingListItems] = useState<Record<string, PackingListItem>>(() => {
    const saved = localStorage.getItem('fdv_packing_list');
    return saved ? JSON.parse(saved) : {};
  });

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

  const updatePackingItem = (key: string, updates: Partial<PackingListItem>) => {
    setPackingListItems(prev => {
      const newItems = { ...prev, [key]: { ...prev[key], ...updates } };
      localStorage.setItem('fdv_packing_list', JSON.stringify(newItems));
      return newItems;
    });
  };

  const handlePackingImageUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updatePackingItem(key, { customImage: result, hidden: false });
    };
    reader.readAsDataURL(file);
  };
  
  useEffect(() => { 
    localStorage.setItem('fdv_page_index', pageIndex.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, [pageIndex]);

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

  // Navigation: Overview (editorial) page sits between Intro (index 1) and Travel Notes (index 2)
  const nextPage = () => {
    if (pageIndex === 1) {
      // From Intro, go to Editorial
      setLocation('/editorial');
    } else if (pageIndex < ITINERARY_DATA.length - 1) {
      setPageIndex(pageIndex + 1);
    }
  };
  const prevPage = () => {
    if (pageIndex === 2) {
      // From Travel Notes, go to Editorial
      setLocation('/editorial');
    } else if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };
  const currentPage = ITINERARY_DATA[pageIndex];

  const getPageTitle = (page: ItineraryPage): string => {
    if (isCoverPage(page)) return 'Start';
    if (isDayPage(page)) return `Day ${page.day}: ${page.title.replace('Daily Flow: ', '')}`;
    if ('title' in page) return page.title;
    return '';
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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background transition-colors duration-500 overflow-x-hidden">
      
      <nav className="fixed top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-[50] bg-background/80 backdrop-blur-md border-b border-border">
        <div 
          className="cursor-pointer" 
          onClick={() => setPageIndex(0)}
          data-testid="link-home"
        >
          <img src={fdvLogo} alt="FDV Concierge" className="h-8 w-auto dark:invert" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </nav>

      <div className="pt-32 pb-48 px-6 md:px-12 max-w-5xl mx-auto min-h-screen flex flex-col">
        
        {isCoverPage(currentPage) && (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <h1 
              className="text-[min(16vw,180px)] font-serif font-bold tracking-tighter leading-none m-0 uppercase select-none w-full whitespace-nowrap overflow-visible"
              data-testid="text-cover-title"
            >
              {currentPage.title}
            </h1>
            <div className="h-[2px] w-32 md:w-48 bg-foreground mt-8" />
            <p className="text-[10px] md:text-sm tracking-[1em] font-bold uppercase text-muted-foreground mt-8">
              {currentPage.subtitle}
            </p>
            <div className="w-full max-w-4xl aspect-[4/5] md:aspect-[21/9] relative overflow-hidden mt-12 grayscale shadow-2xl transition-all duration-1000 hover:grayscale-0 rounded-md">
              {(() => {
                const coverUrl = getImageUrl('cover-main', currentPage.image, { imageType: 'cover' });
                return (
                  <img 
                    key={coverUrl}
                    src={coverUrl} 
                    className="w-full h-full object-cover scale-110" 
                    alt={currentPage.title}
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=1200'; 
                    }}
                  />
                );
              })()}
            </div>
            <Button 
              onClick={nextPage} 
              variant="outline"
              className="mt-16 px-12 py-6 text-[11px] font-bold uppercase tracking-[0.4em] rounded-sm"
              data-testid="button-begin"
            >
              BEGIN JOURNEY
            </Button>
          </div>
        )}

        {isIntroPage(currentPage) && (
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto space-y-20 animate-in fade-in duration-1000">
            <h2 className="text-[11px] font-bold tracking-[0.6em] uppercase text-muted-foreground">THE RHYTHM</h2>
            <div className="space-y-16">
              {currentPage.body.map((para, i) => (
                <p 
                  key={i} 
                  className={`text-2xl md:text-3xl lg:text-4xl leading-[1.6] font-serif ${i === currentPage.body.length - 1 ? 'italic font-bold border-t-2 pt-16 border-border' : 'text-muted-foreground'}`}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        {isFieldNotesPage(currentPage) && (
          <div className="flex-1 py-12 animate-in fade-in duration-1000 uppercase">
            <div className="mb-24 text-center">
              <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-6">{currentPage.title}</h2>
              <div className="h-1.5 w-24 bg-foreground mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-x-24 gap-y-20">
              {currentPage.notes.map((note, i) => (
                <div key={i} className="space-y-6 border-l border-border pl-10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.4em]">{note.title}</h3>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-serif normal-case">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isDayPage(currentPage) && (
          <div className="flex-1 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 border-b border-border pb-16">
              <div className="space-y-6">
                <p className="text-[12px] font-bold tracking-[0.5em] uppercase text-muted-foreground">
                  DAY {currentPage.day} — {currentPage.date}
                </p>
                <h2 
                  className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold tracking-tighter leading-none m-0 uppercase"
                  data-testid="text-day-title"
                >
                  {currentPage.title}
                </h2>
                <div className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
                  <MapPin className="w-4 h-4 text-foreground" /> {currentPage.location}
                </div>
              </div>
              <WeatherDisplay weather={currentPage.weather} />
            </div>

            <div className="mb-20 space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.6em] flex items-center gap-3">
                <Info className="w-4 h-4" /> FIELD NOTES
              </h3>
              <div className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-serif italic border-l-2 border-border pl-10 opacity-90 whitespace-pre-wrap">
                {currentPage.fieldNotes}
              </div>
            </div>

            <div className="mb-20">
              <div className="aspect-[21/18] w-full overflow-hidden rounded-md shadow-xl bg-muted relative">
                <img 
                  src={getImageUrl(`day-${currentPage.day}-hero`, currentPage.flow[0]?.image || '', { imageType: 'cover', title: currentPage.title, location: currentPage.location })} 
                  className="w-full h-full object-cover" 
                  alt={`Day ${currentPage.day}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
                <div className="absolute top-3 right-3">
                  <PinButton
                    itemType="image"
                    itemId={`d${currentPage.day}-cover`}
                    itemData={{
                      title: `Day ${currentPage.day}: ${currentPage.title}`,
                      location: currentPage.location,
                      imageUrl: getImageUrl(`day-${currentPage.day}-hero`, currentPage.flow[0]?.image || '', { imageType: 'cover', title: currentPage.title, location: currentPage.location })
                    }}
                    sourceContext="morocco_itinerary"
                    aestheticTags={['cover', 'day', currentPage.location?.toLowerCase() || '']}
                    size="md"
                  />
                </div>
              </div>
            </div>

            <div className="mb-32">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.6em] pb-4 border-b-2 border-foreground mb-16">SCHEDULE</h3>
              <div className="space-y-6">
                {currentPage.flow.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveItem(item)} 
                    className="group w-full text-left p-8 md:p-10 bg-card border border-border hover:border-foreground transition-all rounded-md flex gap-6 md:gap-10 items-start active:scale-[0.99]"
                    data-testid={`button-flow-item-${item.id}`}
                  >
                    <div className="text-[12px] font-bold tracking-widest text-muted-foreground/50 group-hover:text-foreground transition-colors w-20 md:w-24 pt-1 shrink-0">
                      {item.time}
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground group-hover:text-foreground">
                        {item.heading}
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <h4 className="text-2xl md:text-3xl font-serif font-bold tracking-tight leading-none group-hover:opacity-70">
                          {item.title}
                        </h4>
                        {journalEntries[item.id] && (
                          <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter bg-foreground text-background px-2 py-0.5 rounded-full">
                            <CloudUpload className="w-2.5 h-2.5" /> Logged
                          </div>
                        )}
                      </div>
                      <p className="text-base md:text-lg text-muted-foreground line-clamp-2 italic font-serif leading-relaxed opacity-60 group-hover:opacity-100 transition-all">
                        {item.description || item.body}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-3 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-20 border-t-2 border-border flex flex-col items-center">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.6em] mb-12">DAILY MANTRA</h3>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold tracking-widest uppercase italic text-center max-w-2xl leading-relaxed font-serif">
                "{currentPage.mantra}"
              </p>
            </div>
          </div>
        )}

        {isJournalPage(currentPage) && (
          <div className="flex-1 py-12 animate-in fade-in duration-1000">
            <div className="mb-24 text-center">
              <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-6 uppercase">{currentPage.title}</h2>
              <div className="h-1.5 w-24 bg-foreground mx-auto" />
              <p className="text-sm tracking-[0.6em] font-bold uppercase text-muted-foreground mt-12">{currentPage.subtitle}</p>
            </div>
            <div className="space-y-32">
              {Object.keys(journalEntries).length > 0 ? (
                Object.keys(journalEntries).sort().map((key) => {
                  const entry = journalEntries[key];
                  const rawImages = entry.logImages || [];
                  const allImages = rawImages.map(img => typeof img === 'string' ? { src: img, caption: '' } : img);
                  if (entry.logImage && allImages.length === 0) {
                    allImages.push({ src: entry.logImage, caption: '' });
                  }
                  if (!entry.note && !entry.image && allImages.length === 0) return null;
                  const matchingItem = findItemById(key);
                  return (
                    <div key={key} className="space-y-8 group">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(allImages.length > 0 ? allImages : [{ src: entry.image || "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800", caption: '' }]).map((img, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="aspect-square shadow-xl overflow-hidden bg-muted rounded-md">
                              <img 
                                src={img.src} 
                                className="w-full h-full object-cover" 
                                alt={`Memory ${idx + 1}`}
                              />
                            </div>
                            {img.caption && (
                              <p className="text-sm font-serif italic text-muted-foreground">"{img.caption}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="md:col-span-5 space-y-6">
                        <div className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-30 border-b border-border pb-2">
                          REF: {key.toUpperCase()}
                        </div>
                        <p className="text-xl md:text-2xl lg:text-3xl leading-[1.6] font-serif italic opacity-90">
                          "{entry.note || "A moment captured."}"
                        </p>
                        {matchingItem && (
                          <Button 
                            onClick={() => { setActiveItem(matchingItem); setIsShareMode(true); }}
                            variant="outline"
                            className="rounded-full"
                            data-testid={`button-share-journal-${key}`}
                          >
                            <Share2 className="w-3.5 h-3.5 mr-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Share Story</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-md opacity-30 italic uppercase tracking-widest text-[10px]">
                  Memories will persist here once captured.
                </div>
              )}
            </div>
          </div>
        )}

        {isPackingListPage(currentPage) && (
          <div className="flex-1 py-12 animate-in fade-in duration-1000">
            <div className="mb-24 text-center">
              <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-6 uppercase">{currentPage.title}</h2>
              <div className="h-1.5 w-24 bg-foreground mx-auto" />
              <p className="text-sm tracking-[0.6em] font-bold uppercase text-muted-foreground mt-12">{currentPage.subtitle}</p>
            </div>
            {(() => {
              const allItems: { key: string; dayNumber: number; itemTitle: string; time: string; suggestedImage: string; isExtra: boolean; extraName?: string }[] = [];
              ITINERARY_DATA.forEach((page) => {
                if (isDayPage(page)) {
                  page.flow.forEach((item) => {
                    if (item.commercialWardrobe) {
                      allItems.push({
                        key: `${item.id}-wardrobe`,
                        dayNumber: page.day,
                        itemTitle: item.title,
                        time: item.time,
                        suggestedImage: item.commercialWardrobe,
                        isExtra: false,
                      });
                    }
                    // Always add 4 extra slots for each wardrobe item
                    if (item.commercialWardrobe) {
                      for (let idx = 0; idx < 4; idx++) {
                        const extra = item.wardrobeExtras?.[idx];
                        const extraKey = `${item.id}-extra-${idx}`;
                        const hasCustom = hasCustomImage(extraKey);
                        // Only include if there's data or a custom image
                        if (extra || hasCustom) {
                          allItems.push({
                            key: extraKey,
                            dayNumber: page.day,
                            itemTitle: item.title,
                            time: item.time,
                            suggestedImage: extra?.image || '',
                            isExtra: true,
                            extraName: extra?.name || ['Footwear', 'Handbag', 'Jewelry', 'Accessory'][idx],
                          });
                        }
                      }
                    }
                  });
                }
              });

              // Group items by flow item ID for look + accessories layout
              const groupedItems: { 
                lookKey: string; 
                dayNumber: number; 
                itemTitle: string; 
                time: string; 
                suggestedImage: string;
                accessories: typeof allItems;
              }[] = [];

              // Build grouped structure
              allItems.forEach((item) => {
                if (!item.isExtra && !packingListItems[item.key]?.hidden) {
                  // This is a look - find its accessories
                  const flowId = item.key.replace('-wardrobe', '');
                  const accessories = allItems.filter(
                    a => a.isExtra && a.key.startsWith(`${flowId}-extra-`) && !packingListItems[a.key]?.hidden
                  );
                  groupedItems.push({
                    lookKey: item.key,
                    dayNumber: item.dayNumber,
                    itemTitle: item.itemTitle,
                    time: item.time,
                    suggestedImage: item.suggestedImage,
                    accessories,
                  });
                }
              });

              return (
                <>
                  <h3 className="text-[11px] font-bold tracking-[0.5em] uppercase mb-8 flex items-center gap-3">
                    <Sparkles className="w-4 h-4" /> WARDROBE
                  </h3>
                  <div className="space-y-8">
                    {groupedItems.map((group) => {
                      const packingItem = packingListItems[group.lookKey];
                      const displayUrl = packingItem?.customImage || getImageUrl(group.lookKey, group.suggestedImage);

                      return (
                        <div key={group.lookKey} className="flex gap-4">
                          {/* Look on the left - 1/3 width */}
                          <div className="w-1/3 min-w-[100px] group relative">
                            <div className="aspect-[3/4] overflow-hidden bg-muted rounded-md shadow-lg relative">
                              <img 
                                src={displayUrl} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                alt={group.itemTitle}
                              />
                              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <label className="bg-background text-foreground rounded-full p-2 cursor-pointer hover:scale-110 transition-transform">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => e.target.files?.[0] && handlePackingImageUpload(group.lookKey, e.target.files[0])}
                                    data-testid={`input-swap-${group.lookKey}`}
                                  />
                                  <Camera className="w-4 h-4" />
                                </label>
                                <button 
                                  onClick={() => updatePackingItem(group.lookKey, { hidden: true })}
                                  className="bg-background text-foreground rounded-full p-2 hover:scale-110 transition-transform"
                                  data-testid={`button-hide-${group.lookKey}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                                Day {group.dayNumber} · {group.time}
                              </p>
                              <p className="text-sm font-serif font-medium truncate">
                                {group.itemTitle}
                              </p>
                            </div>
                          </div>

                          {/* Accessories on the right - 2/3 width in grid */}
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                            {[0, 1, 2, 3].map((idx) => {
                              const accessory = group.accessories.find(a => a.key.endsWith(`-extra-${idx}`));
                              const extraKey = `${group.lookKey.replace('-wardrobe', '')}-extra-${idx}`;
                              const accPackingItem = packingListItems[extraKey];
                              const hasCustom = hasCustomImage(extraKey);
                              const accDisplayUrl = hasCustom 
                                ? getImageUrl(extraKey, accessory?.suggestedImage || '')
                                : (accPackingItem?.customImage || accessory?.suggestedImage || '');

                              return (
                                <div key={extraKey} className="group relative">
                                  <div className="aspect-square overflow-hidden bg-muted rounded-md shadow-lg relative">
                                    {accDisplayUrl ? (
                                      <img 
                                        src={accDisplayUrl} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        alt={accessory?.extraName || ['Footwear', 'Handbag', 'Jewelry', 'Accessory'][idx]}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                        <Plus className="w-6 h-6" />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                      <label className="bg-background text-foreground rounded-full p-2 cursor-pointer hover:scale-110 transition-transform">
                                        <input 
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden" 
                                          onChange={(e) => e.target.files?.[0] && handlePackingImageUpload(extraKey, e.target.files[0])}
                                          data-testid={`input-swap-${extraKey}`}
                                        />
                                        <Camera className="w-4 h-4" />
                                      </label>
                                      {accDisplayUrl && (
                                        <button 
                                          onClick={() => updatePackingItem(extraKey, { hidden: true })}
                                          className="bg-background text-foreground rounded-full p-2 hover:scale-110 transition-transform"
                                          data-testid={`button-hide-${extraKey}`}
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mt-2 text-center">
                                    <p className="text-[10px] font-medium text-muted-foreground truncate">
                                      {accessory?.extraName || ['Footwear', 'Handbag', 'Jewelry', 'Accessory'][idx]}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Restore hidden items button */}
                  {groupedItems.length < allItems.filter(i => !i.isExtra).length && (
                    <div className="mt-12 text-center">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setPackingListItems({});
                          localStorage.removeItem('fdv_packing_list');
                        }}
                        className="text-[10px] font-bold uppercase tracking-[0.3em]"
                        data-testid="button-restore-items"
                      >
                        Restore Hidden Items
                      </Button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        <footer className="mt-32 border-t border-border pt-16 flex items-center justify-between gap-4">
          <Button 
            onClick={prevPage} 
            disabled={pageIndex === 0} 
            variant="ghost"
            className="flex items-center gap-2 md:gap-4 text-[12px] font-bold uppercase tracking-[0.5em] disabled:opacity-0 transition-all"
            data-testid="button-prev"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" /> 
            <span className="hidden sm:inline">PREV</span>
          </Button>
          <div className="text-[11px] font-bold tracking-[0.8em] text-muted-foreground uppercase">
            {pageIndex + 1} / {ITINERARY_DATA.length}
          </div>
          <Button 
            onClick={nextPage} 
            disabled={pageIndex === ITINERARY_DATA.length - 1}
            variant="ghost"
            className="flex items-center gap-2 md:gap-4 text-[12px] font-bold uppercase tracking-[0.5em] disabled:opacity-0 transition-all"
            data-testid="button-next"
          >
            <span className="hidden sm:inline">NEXT</span> 
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </footer>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-foreground dark:bg-card text-background dark:text-foreground z-[200] flex flex-col justify-center items-center p-8 transition-all duration-500 overflow-y-auto">
          <button 
            onClick={() => setMenuOpen(false)} 
            className="fixed top-6 right-6 z-[210]"
            data-testid="button-close-menu"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-lg space-y-8 text-center py-24">
            {ITINERARY_DATA.map((p, i) => {
              // Insert Overview link right before Travel Notes (field-notes-global page)
              const isBeforeTravelNotes = 'type' in p && p.type === 'field-notes-global';
              return (
                <div key={i}>
                  {isBeforeTravelNotes && (
                    <a 
                      href="/editorial"
                      className="block w-full text-xl md:text-2xl lg:text-3xl uppercase tracking-[0.2em] opacity-25 hover:opacity-100 transition-all transform hover:scale-105 font-serif mb-8"
                      data-testid="link-editorial"
                    >
                      Overview
                    </a>
                  )}
                  <button 
                    className={`block w-full text-xl md:text-2xl lg:text-3xl uppercase tracking-[0.2em] transition-all transform hover:scale-105 font-serif ${pageIndex === i ? 'opacity-100 font-bold italic underline underline-offset-8' : 'opacity-25 hover:opacity-100'}`} 
                    onClick={() => { setPageIndex(i); setMenuOpen(false); }}
                    data-testid={`button-menu-item-${i}`}
                  >
                    {getPageTitle(p)}
                  </button>
                </div>
              );
            })}
            <a 
              href="/packing"
              className="block w-full text-xl md:text-2xl lg:text-3xl uppercase tracking-[0.2em] opacity-25 hover:opacity-100 transition-all transform hover:scale-105 font-serif mt-4"
              data-testid="link-suitcase"
            >
              Suitcase
            </a>
            <div className="pt-12 border-t border-current/20 mt-12 space-y-4">
              <a 
                href="/library"
                className="block w-full text-sm uppercase tracking-[0.3em] opacity-50 hover:opacity-100 transition-all"
                data-testid="link-image-library"
              >
                Image Library
              </a>
              <a 
                href="/rules"
                className="block w-full text-sm uppercase tracking-[0.3em] opacity-50 hover:opacity-100 transition-all"
                data-testid="link-image-rules"
              >
                Image Rules
              </a>
              <a 
                href="/images"
                className="block w-full text-sm uppercase tracking-[0.3em] opacity-50 hover:opacity-100 transition-all"
                data-testid="link-image-management"
              >
                Manual Overrides
              </a>
              <a 
                href="/test-saves"
                className="block w-full text-sm uppercase tracking-[0.3em] opacity-50 hover:opacity-100 transition-all text-amber-500"
                data-testid="link-debug-saves"
              >
                Debug: View Saves
              </a>
            </div>
          </div>
        </div>
      )}

      {activeItem && !isShareMode && (
        <ItemDetailDrawer
          item={activeItem}
          entries={journalEntries}
          status={saveStatus}
          location={isDayPage(currentPage) ? currentPage.location : undefined}
          date={isDayPage(currentPage) ? currentPage.date : undefined}
          onClose={() => setActiveItem(null)}
          onJournalChange={handleJournalChange}
          getImageUrl={getImageUrl}
          hasCustomImage={hasCustomImage}
          onImageUpload={processImage}
          onImagesUpdate={handleImagesUpdate}
          onShare={() => setIsShareMode(true)}
          onApplySelfie={handleApplySelfie}
        />
      )}

      {isShareMode && activeItem && (
        <ShareModal
          item={activeItem}
          entries={journalEntries}
          onClose={() => setIsShareMode(false)}
        />
      )}
    </div>
  );
}
