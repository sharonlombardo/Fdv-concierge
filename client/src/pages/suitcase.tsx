import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Briefcase, Package } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

import { ItemModal, type ItemModalData } from "@/components/item-modal";
import { deriveEditTag } from "@/lib/derive-edit-tag";
import { useCustomImages } from "@/hooks/use-custom-images";
import { CuratingAnimation } from "@/components/curating-animation";
import { PRESET_CAPSULES, type Capsule } from "@/data/capsule-data";
import { useUser } from "@/contexts/user-context";
import { getProductByKey, getAllProducts } from "@/lib/brand-genome";

const LS_SAVED_CAPSULES_KEY = "fdv_saved_capsules";

function getSavedCapsuleIds(): string[] {
  try {
    const raw = localStorage.getItem(LS_SAVED_CAPSULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getNextUnsavedCapsule(): typeof PRESET_CAPSULES[0] | null {
  const savedIds = getSavedCapsuleIds();
  return PRESET_CAPSULES.find((c) => !savedIds.includes(c.id)) || null;
}

type SavedItem = {
  id: number;
  itemType: string;
  itemId: string;
  sourceContext: string;
  aestheticTags: string[];
  metadata: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    purchaseIntent?: boolean;
    [key: string]: any;
  };
  savedAt: number;
  editionTag?: string;
  storyTag?: string;
  editTag?: string;
  purchaseStatus?: string;
  title?: string;
  assetUrl?: string;
  brand?: string;
  price?: string;
  shopUrl?: string;
  bookUrl?: string;
  detailDescription?: string;
  category?: string;
  isCurated?: boolean;
};

const VIEW_MODES = [
  { id: "category", label: "By Category" },
  { id: "edit", label: "My Edits" },
];

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "travel-destinations", label: "Travel/Destinations" },
  { id: "style", label: "Your Style" },
  { id: "state-of-mind", label: "State of Mind" },
  { id: "items", label: "Objects of Desire" },
  { id: "daily-rituals", label: "Daily Rituals" },
  { id: "culture", label: "Culture" },
  { id: "experiences", label: "Experiences" },
  { id: "my-edits", label: "My Edits" },
  { id: "my-trips", label: "My Trips" },
];

const EDIT_CARDS = [
  { id: "morocco-edit", name: "Morocco Edit", storyTag: "morocco", color: "bg-amber-100 dark:bg-amber-900/30" },
  { id: "hydra-edit", name: "Hydra Edit", storyTag: "hydra", color: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "slow-travel-edit", name: "Slow Travel Edit", storyTag: "slow-travel", color: "bg-stone-100 dark:bg-stone-800/50" },
  { id: "retreat-edit", name: "Retreat Edit", storyTag: "retreat", color: "bg-green-100 dark:bg-green-900/30" },
  { id: "new-york-edit", name: "New York Edit", storyTag: "new-york", color: "bg-slate-100 dark:bg-slate-800/50" },
  { id: "opening-edit", name: "Today's Edit", storyTag: "opening", color: "bg-rose-100 dark:bg-rose-900/30" },
];

const CURATED_QUOTES = [
  {
    id: "quote-1",
    text: "Travel is not about the destination, but how you feel when you arrive.",
    source: "The Current"
  },
  {
    id: "quote-2", 
    text: "The best journeys answer questions that in the beginning you didn't even think to ask.",
    source: "The Current"
  },
  {
    id: "quote-3",
    text: "Collect moments, not things. But beautiful things help you remember the moments.",
    source: "The Current"
  },
  {
    id: "quote-4",
    text: "Slow down. The view is better when you're not rushing past it.",
    source: "The Current"
  },
  {
    id: "quote-5",
    text: "Every journey begins with a single step into the unknown.",
    source: "The Current"
  },
  {
    id: "quote-6",
    text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
    source: "The Current"
  }
];

function getTypeLabel(itemType: string): string {
  const typeMap: Record<string, string> = {
    look: "Look",
    product: "Product",
    scene: "Scene",
    feature: "Feature",
    quote: "Quote",
    place: "Place",
    activity: "Activity",
    style: "Style",
    image: "Image",
    cover: "Cover",
    accessory: "Accessory",
    destination: "Destination",
    mood: "mood",
    texture: "texture",
    inspiration: "inspiration",
    experience: "experience",
    ritual: "ritual",
    object: "object",
    item: "item",
    culture: "culture",
  };
  return typeMap[itemType] || itemType;
}

function getSourceLabel(sourceContext: string): string {
  if (sourceContext.includes("morocco") || sourceContext.includes("itinerary")) {
    return "from Morocco";
  }
  if (sourceContext.includes("current")) {
    return "from The Current";
  }
  if (sourceContext.includes("todays_edit") || sourceContext.includes("opening")) {
    return "from Today's Edit";
  }
  if (sourceContext.includes("destinations")) {
    return "from Destinations";
  }
  if (sourceContext.includes("packing")) {
    return "from Packing";
  }
  return "";
}

const SAVE_TYPE_TO_CATEGORY: Record<string, string> = {
  'look': 'style',
  'style': 'style',
  'accessory': 'style',
  'wardrobe': 'style',
  'product': 'style',
  'image': 'travel-destinations',
  'inspire': 'travel-destinations',
  'inspiration': 'state-of-mind',
  'scene': 'travel-destinations',
  'cover': 'travel-destinations',
  'destination': 'travel-destinations',
  'quote': 'state-of-mind',
  'mood': 'state-of-mind',
  'texture': 'state-of-mind',
  'experience': 'experiences',
  'place': 'travel-destinations',
  'feature': 'travel-destinations',
  'object': 'items',
  'item': 'items',
  'article': 'culture',
  'trip': 'my-trips',
  'culture': 'culture',
  'ritual': 'daily-rituals',
  'edit': 'my-edits',
};

function getDestinationLabel(save: SavedItem): string {
  const storyTag = save.storyTag || save.metadata?.storyTag || '';
  const source = save.sourceContext || '';
  const itemId = save.itemId || '';
  const title = (save.title || '').toLowerCase();
  // Morocco: also catch itinerary items (d1-d8 prefix), carousel saves, and packing items
  if (storyTag === 'morocco' || source.includes('morocco') || source.includes('itinerary') ||
      source.includes('packing') || source.includes('carousel') ||
      /^d\d+-/.test(itemId) || source.includes('daily-flow')) return 'Morocco';
  if (storyTag === 'hydra' || source.includes('hydra')) return 'Hydra';
  if (storyTag === 'slow-travel' || storyTag === 'spain' || source.includes('spain') || source.includes('slow') || source.includes('mallorca')) return 'Slow Travel';
  if (storyTag === 'retreat' || source.includes('retreat') || source.includes('utah')) return 'The Retreat';
  if (storyTag === 'new-york' || storyTag === 'newyork' || source.includes('new-york') || source.includes('newyork') || source.includes('ny-')) return 'New York';
  if (storyTag === 'opening' || storyTag === 'todays-edit' || source.includes('opening') || source.includes('todays_edit')) return "Today's Edit";
  return 'Other';
}

function groupByDestination(saves: SavedItem[]): { destination: string; items: SavedItem[] }[] {
  const groups = new Map<string, SavedItem[]>();
  for (const save of saves) {
    const dest = getDestinationLabel(save);
    if (!groups.has(dest)) groups.set(dest, []);
    groups.get(dest)!.push(save);
  }
  // Order: Morocco first, then alphabetical, "Other" last
  const order = ['Morocco', 'Hydra', 'Slow Travel', 'The Retreat', 'New York', "Today's Edit", 'Other'];
  const result: { destination: string; items: SavedItem[] }[] = [];
  for (const dest of order) {
    if (groups.has(dest)) {
      result.push({ destination: dest, items: groups.get(dest)! });
    }
  }
  // Any unlisted destinations
  for (const [dest, items] of groups) {
    if (!order.includes(dest)) {
      result.push({ destination: dest, items });
    }
  }
  return result;
}

// Non-product types should NEVER appear in Your Style or Objects of Desire
const NON_PRODUCT_TYPES = new Set([
  'place', 'trip', 'experience', 'culture', 'ritual', 'editorial', 'mood',
  'texture', 'scene', 'cover', 'destination', 'quote', 'inspiration',
  'image', 'inspire', 'feature', 'article', 'edit', 'activity'
]);

// Title keyword lists for classifyItem (used in classification + backfill)
const FOOTWEAR_KEYWORDS = ['sandal', 'thong', 'mule', 'slipper', 'boot', 'shoe', 'pump', 'loafer', 'sneaker', 'flat', 'heel', 'espadrille', 'clog'];
const BAG_KEYWORDS = ['bag', 'tote', 'clutch', 'wristlette', 'basket', 'pouch', 'satchel', 'handbag', 'purse'];
const JEWELRY_KEYWORDS = ['earring', 'necklace', 'bracelet', 'ring', 'hoops', 'pendant', 'chain', 'cuff', 'bangle'];
const BEAUTY_KEYWORDS = ['sunscreen', 'serum', 'oil', 'cream', 'moistur', 'lipstick', 'parfum', 'perfume', 'fragrance', 'travel mist', 'pool essential', 'plumscreen', 'body oil', 'sun ritual', 'skincare'];
const PLACE_KEYWORDS = ['transfer to', 'mountains', 'afternoon swim', 'morning walk', 'sunset', 'sunrise', 'rooftop', 'poolside', 'garden', 'medina walk', 'souk', 'marketplace'];

// Master classification function — SINGLE source of truth for tab routing
// Returns: 'style-clothing' | 'style-accessory' | 'object' | 'other'
function classifyItem(save: SavedItem): 'style-clothing' | 'style-accessory' | 'object' | 'other' {
  const titleLower = (save.title || save.metadata?.title || '').toLowerCase().trim();
  const itemType = (save.itemType || '').toLowerCase();

  // ===== PHASE 1: Title-based keyword matching (runs FIRST, catches items with missing categories) =====

  // Full outfit/look indicators → clothing (check BEFORE accessory keywords)
  // NOTE: 'puffer' was REMOVED — "Wayfarer Puffer" is RayBan sunglasses, not a jacket
  const lookKeywords = ['the look', 'full look', 'silhouette', 'outfit', 'tailoring', 'ensemble', 'caftan', 'kaftan', 'dress code'];
  if (lookKeywords.some(kw => titleLower.includes(kw))) return 'style-clothing';

  // Footwear → accessory
  if (FOOTWEAR_KEYWORDS.some(kw => titleLower.includes(kw))) return 'style-accessory';
  // Bags → accessory
  if (BAG_KEYWORDS.some(kw => titleLower.includes(kw))) return 'style-accessory';
  // Jewelry → accessory
  if (JEWELRY_KEYWORDS.some(kw => titleLower.includes(kw))) return 'style-accessory';
  // Sunglasses/eyewear → accessory (includes brand-specific terms)
  if (titleLower.includes('sunglass') || titleLower.includes('eyewear') || titleLower.includes('cat eye') || titleLower.includes('aviator') || titleLower.includes('wayfarer') || titleLower.includes('ray-ban') || titleLower.includes('rayban') || titleLower.includes('ray ban')) return 'style-accessory';
  // Watch → accessory
  if (titleLower.includes('watch') || titleLower.includes('timepiece')) return 'style-accessory';
  // Beauty → object
  if (BEAUTY_KEYWORDS.some(kw => titleLower.includes(kw))) return 'object';
  // Knit wrap/shawl → clothing
  if (titleLower.includes('knit wrap') || titleLower.includes('shawl') || titleLower.includes('poncho')) return 'style-clothing';

  // ===== PHASE 2: Database category (if populated) =====
  let cat = (save.category || '').toUpperCase();

  // If no saved category, try live genome lookup
  if (!cat) {
    const key = save.metadata?.genomeKey || save.metadata?.assetKey || save.itemId;
    const product = getProductByKey(key);
    cat = (product?.category || '').toUpperCase();
  }

  if (cat) {
    if (cat === 'BEAUTY') return 'object';
    if (cat === 'LOOK') return 'style-clothing';
    if (cat === 'FOOTWEAR') return 'style-accessory';
    if (cat.startsWith('ACCESSORY')) return 'style-accessory';
    return 'style-clothing';
  }

  // ===== PHASE 3: Filter out non-product editorial items =====

  // Non-product itemTypes
  if (NON_PRODUCT_TYPES.has(itemType)) return 'other';

  // Detect landscape/place images saved with itemType "style" or "look"
  // IMPORTANT: Styled outfit photos ("Dinner at the Kasbah - The Look", "Sharp Silhouette") stay
  const isPlaceTitle = PLACE_KEYWORDS.some(kw => titleLower.includes(kw));
  const brand = save.brand || save.metadata?.brand || '';
  if (isPlaceTitle && !brand) return 'other';

  // No brand + long title likely = editorial image, not product
  if (!brand && titleLower.length > 60) return 'other';

  // ===== PHASE 4: Fallback by itemType =====
  if (['style', 'look', 'wardrobe'].includes(itemType)) return 'style-clothing';
  if (['accessory', 'footwear'].includes(itemType)) return 'style-accessory';
  if (itemType === 'object') return 'object';

  return 'other';
}

// Derived helpers — guaranteed mutually exclusive via classifyItem()
function isStyleItem(save: SavedItem): boolean {
  const c = classifyItem(save);
  return c === 'style-clothing' || c === 'style-accessory';
}

function isObjectItem(save: SavedItem): boolean {
  return classifyItem(save) === 'object';
}

function isClothingItem(save: SavedItem): boolean {
  return classifyItem(save) === 'style-clothing';
}

function isAccessoryItem(save: SavedItem): boolean {
  return classifyItem(save) === 'style-accessory';
}

function filterSaves(saves: SavedItem[], tab: string): SavedItem[] {
  switch (tab) {
    case "all":
      return saves;
    case "state-of-mind":
      return saves.filter(s =>
        s.itemType === "quote" ||
        SAVE_TYPE_TO_CATEGORY[s.itemType] === "state-of-mind"
      );
    case "my-edits":
      return saves.filter(s => s.itemType === "edit");
    case "my-trips":
      return saves.filter(s =>
        s.itemType === "trip" ||
        s.metadata?.bucket === "my-trips"
      );
    case "travel-destinations":
      return saves.filter(s =>
        SAVE_TYPE_TO_CATEGORY[s.itemType] === "travel-destinations" ||
        s.itemType === "place" ||
        s.itemType === "destination"
      );
    case "style":
      return saves.filter(isStyleItem);
    case "items":
      return saves.filter(isObjectItem);
    default:
      return saves.filter(s => SAVE_TYPE_TO_CATEGORY[s.itemType] === tab);
  }
}

function StateOfMindContent({ onRemove, removedIds }: { onRemove: (id: string) => void; removedIds: Set<string> }) {
  const visibleQuotes = CURATED_QUOTES.filter(q => !removedIds.has(q.id));

  if (visibleQuotes.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="font-serif text-xl mb-2">No quotes saved</h3>
        <p className="text-muted-foreground">Explore The Current to save inspiring quotes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">From The Current</p>
        <h2 className="font-serif text-2xl">Words to Travel By</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleQuotes.map((quote) => (
          <div
            key={quote.id}
            className="group bg-[#f5f1ed] dark:bg-[#2a2825] rounded-md min-h-[180px]"
            style={{ position: 'relative', overflow: 'hidden' }}
            data-testid={`card-quote-${quote.id}`}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: '12px',
                zIndex: 10
              }}
            >
              <button
                type="button"
                className="w-6 h-6 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/90 flex items-center justify-center"
                onClick={() => onRemove(quote.id)}
                data-testid={`button-remove-quote-${quote.id}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="p-8 flex flex-col justify-between h-full min-h-[180px]">
              <p className="font-serif text-lg leading-relaxed text-foreground/80 italic">
                "{quote.text}"
              </p>
              <p className="text-xs text-muted-foreground mt-4 tracking-widest uppercase">
                {quote.source}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Convert itemId to image lookup key
function getImageKey(itemId: string): string {
  // d1-1-look -> d1-1-wardrobe (for looks)
  // d1-1-extra-0 -> d1-1-extra-0 (for extras)
  if (itemId.endsWith('-look')) {
    return itemId.replace('-look', '-wardrobe');
  }
  return itemId;
}

function SavedItemCard({ save, onRemove, onClick, getImageUrl }: {
  save: SavedItem;
  onRemove: () => void;
  onClick: () => void;
  getImageUrl: (key: string, defaultUrl: string) => string;
}) {
  const imageKey = getImageKey(save.itemId);
  const fallbackUrl = save.assetUrl || save.metadata?.imageUrl || '';
  const imageUrl = getImageUrl(imageKey, fallbackUrl);
  const isOwned = save.purchaseStatus === 'purchased';
  const isWanted = save.purchaseStatus === 'want';

  // Use object-contain for look/wardrobe items to show full outfit without cropping
  // But NOT for place/destination/scene/editorial items — those always fill the card
  const isPlaceType = SAVE_TYPE_TO_CATEGORY[save.itemType] === 'travel-destinations' || save.itemType === 'place' || save.itemType === 'destination';
  const isLookItem = !isPlaceType && (save.itemType === 'look' || save.itemId.includes('-look') || save.itemId.includes('-wardrobe'));

  return (
    <div
      className="group relative bg-white dark:bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      data-testid={`card-saved-${save.id}`}
      onClick={onClick}
    >
      <div className={`aspect-[3/4] relative ${isLookItem ? 'bg-stone-100 dark:bg-stone-800' : ''}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={save.title || save.metadata?.title || "Saved item"}
            className={`w-full h-full ${isLookItem ? 'object-contain' : 'object-cover'}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 flex items-center justify-center">
            <span className="text-stone-400 dark:text-stone-500 text-sm">No image</span>
          </div>
        )}

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 dark:bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          data-testid={`button-remove-${save.id}`}
        >
          <X className="w-4 h-4" />
        </Button>

        {isOwned && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs">
              <Package className="w-3 h-3 mr-1" />
              Owned
            </Badge>
          </div>
        )}
        {isWanted && !isOwned && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-xs">
              <Briefcase className="w-3 h-3 mr-1" />
              Want
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-xs shrink-0">
            {getTypeLabel(save.itemType)}
          </Badge>
          {getDestinationLabel(save) !== 'Other' && (
            <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground truncate">
              {getDestinationLabel(save)}
            </span>
          )}
        </div>
        <h3 className="font-medium text-sm leading-tight line-clamp-2">
          {save.title || save.metadata?.title || save.itemId}
        </h3>
        {save.metadata?.subtitle && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {save.metadata.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function ByEditView({ saves }: { saves: SavedItem[] }) {
  const savesWithEditTag = saves.map(s => ({
    ...s,
    derivedEditTag: deriveEditTag(s)
  }));
  
  const uniqueEditTags = Array.from(new Set(savesWithEditTag.map(s => s.derivedEditTag).filter(Boolean))) as string[];
  
  const getEditSaves = (editTag: string) => {
    return savesWithEditTag.filter(s => s.derivedEditTag === editTag);
  };

  const getTypeCounts = (editSaves: typeof savesWithEditTag) => {
    const counts: Record<string, number> = {};
    editSaves.forEach(s => {
      const type = s.itemType || 'other';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  };

  const getEditDisplayName = (editTag: string) => {
    const found = EDIT_CARDS.find(e => e.id === editTag);
    if (found) return found.name;
    return editTag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getEditColor = (editTag: string) => {
    const found = EDIT_CARDS.find(e => e.id === editTag);
    return found?.color || "bg-stone-100 dark:bg-stone-800/50";
  };

  const editsWithSaves = uniqueEditTags.filter(tag => getEditSaves(tag).length > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {editsWithSaves.map((editTag) => {
        const editSaves = getEditSaves(editTag);
        const typeCounts = getTypeCounts(editSaves);
        
        return (
          <Link key={editTag} href={`/suitcase/edit/${editTag}`}>
            <div 
              className={`${getEditColor(editTag)} rounded-md p-6 min-h-[180px] flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow`}
              data-testid={`card-${editTag}`}
            >
              <div>
                <h3 className="font-serif text-xl font-medium mb-2">{getEditDisplayName(editTag)}</h3>
                <p className="text-2xl font-bold">{editSaves.length}</p>
                <p className="text-sm text-muted-foreground">saved items</p>
              </div>
              {Object.keys(typeCounts).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {Object.entries(typeCounts).slice(0, 4).map(([type, count]) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {count} {type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Link>
        );
      })}
      {editsWithSaves.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No edits yet. Save items from The Current to create edits.</p>
        </div>
      )}
    </div>
  );
}

export default function SuitcasePage() {
  const [viewMode, setViewMode] = useState("category");
  const [activeTab, setActiveTab] = useState("all");
  const [styleSubFilter, setStyleSubFilter] = useState<'all' | 'clothing' | 'accessories'>('all');
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [removedQuotes, setRemovedQuotes] = useState<Set<string>>(() => {
    // Load from localStorage on initial render
    try {
      const stored = localStorage.getItem('fdv-removed-quotes');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [, navigate] = useLocation();
  const { getImageUrl } = useCustomImages();
  const [showCurating, setShowCurating] = useState(false);
  const [curatingCapsule, setCuratingCapsule] = useState<typeof PRESET_CAPSULES[0] | null>(null);
  const { saveCount } = useUser();
  const [savedCapsuleIds, setSavedCapsuleIds] = useState<string[]>(getSavedCapsuleIds);

  // Auto-seed "Desert Neutrals" if user has 3+ saves and no capsules yet
  useEffect(() => {
    if (savedCapsuleIds.length === 0 && saveCount >= 3) {
      const updated = ["desert-neutrals"];
      localStorage.setItem(LS_SAVED_CAPSULES_KEY, JSON.stringify(updated));
      setSavedCapsuleIds(updated);
    }
  }, [saveCount, savedCapsuleIds.length]);

  // Fetch API saves early so we can merge capsule IDs from both sources
  const { data: saves = [], isLoading } = useQuery<SavedItem[]>({
    queryKey: ["/api/saves"],
  });

  // Multi-strategy genome lookup for backfill
  function findCategoryInGenome(save: SavedItem): string | undefined {
    // Strategy 1: Direct key match by itemId
    const p1 = getProductByKey(save.itemId);
    if (p1?.category) return p1.category;

    // Strategy 2: Match by genomeKey or assetKey in metadata
    const metaKey = save.metadata?.genomeKey || save.metadata?.assetKey;
    if (metaKey) {
      const p2 = getProductByKey(metaKey);
      if (p2?.category) return p2.category;
    }

    // Strategy 3: Match by title + brand combination
    const allProducts = getAllProducts();
    if (save.title) {
      const titleLower = save.title.toLowerCase();
      const match = allProducts.find(p => {
        const nameLower = (p.name || '').toLowerCase();
        const brandLower = (p.brand || '').toLowerCase();
        if (!nameLower) return false;
        return titleLower.includes(nameLower) ||
               titleLower === `${brandLower} — ${nameLower}` ||
               (titleLower.includes(nameLower) && save.metadata?.brand?.toLowerCase()?.includes(brandLower));
      });
      if (match?.category) return match.category;
    }

    return undefined;
  }

  // Dedup: remove duplicate saves (server-side, case-insensitive title+brand)
  useEffect(() => {
    if (saves.length === 0) return;
    if (sessionStorage.getItem('saves_deduplicated_v5')) return;

    async function dedup() {
      try {
        await fetch('/api/saves/dedup', { method: 'POST' });
        sessionStorage.setItem('saves_deduplicated_v5', 'true');
        queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      } catch (e) {
        // Silently skip
      }
    }
    dedup();
  }, [saves]);

  // Backfill category + storyTag for existing saves (v7 — removed puffer from lookKeywords)
  useEffect(() => {
    if (saves.length === 0) return;
    if (sessionStorage.getItem('categories_backfilled_v7')) return;

    // Infer a specific genome category from classifyItem + title keywords
    function inferCategory(save: SavedItem): string | undefined {
      const classification = classifyItem(save);
      const tLower = (save.title || save.metadata?.title || '').toLowerCase().trim();

      if (classification === 'style-accessory') {
        if (FOOTWEAR_KEYWORDS.some(kw => tLower.includes(kw))) return 'FOOTWEAR';
        if (BAG_KEYWORDS.some(kw => tLower.includes(kw))) return 'ACCESSORY: BAG';
        if (JEWELRY_KEYWORDS.some(kw => tLower.includes(kw))) return 'ACCESSORY: JEWELRY';
        if (tLower.includes('sunglass') || tLower.includes('cat eye') || tLower.includes('eyewear') || tLower.includes('wayfarer') || tLower.includes('ray-ban') || tLower.includes('rayban') || tLower.includes('ray ban')) return 'ACCESSORY: SUNGLASSES';
        if (tLower.includes('watch') || tLower.includes('timepiece')) return 'ACCESSORY';
        return 'ACCESSORY';
      }
      if (classification === 'style-clothing') return 'LOOK';
      if (classification === 'object') return 'BEAUTY';
      return undefined;
    }

    async function backfill() {
      let updated = 0;
      for (const save of saves) {
        const patch: Record<string, string> = {};

        // Category backfill: infer from classifyItem if missing or wrong
        const inferred = inferCategory(save);
        if (inferred && (save.category || '').toUpperCase() !== inferred) {
          patch.category = inferred;
        }

        // StoryTag backfill: fix missing storyTag for destination items
        if (!save.storyTag) {
          const currentDest = getDestinationLabel(save);
          if (currentDest !== 'Other') {
            const tagMap: Record<string, string> = {
              'Morocco': 'morocco', 'Hydra': 'hydra', 'Slow Travel': 'slow-travel',
              'The Retreat': 'retreat', 'New York': 'new-york', "Today's Edit": 'opening'
            };
            if (tagMap[currentDest]) patch.storyTag = tagMap[currentDest];
          }
        }

        if (Object.keys(patch).length === 0) continue;

        try {
          await fetch(`/api/saves/${encodeURIComponent(save.itemId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch)
          });
          updated++;
        } catch (e) {
          // Silently skip
        }
      }
      sessionStorage.setItem('categories_backfilled_v7', 'true');
      if (updated > 0) {
        queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      }
    }
    backfill();
  }, [saves]);

  // Merge localStorage capsule IDs with API-saved capsule IDs
  const apiCapsuleIds = saves
    .filter((s: SavedItem) => s.itemType === 'edit' && s.itemId?.startsWith('capsule-'))
    .map((s: SavedItem) => s.itemId.replace('capsule-', ''));
  const allCapsuleIds = [...new Set([...savedCapsuleIds, ...apiCapsuleIds])];
  const savedCapsules = PRESET_CAPSULES.filter((c) => allCapsuleIds.includes(c.id));

  const handleCurateForMe = () => {
    const next = getNextUnsavedCapsule();
    if (!next) return;
    setCuratingCapsule(next);
    setShowCurating(true);
  };

  const handleCuratingComplete = () => {
    setShowCurating(false);
    // Refresh saved capsule IDs so My Edits tab shows the new capsule
    setSavedCapsuleIds(getSavedCapsuleIds());
    if (curatingCapsule) {
      navigate(`/capsule/${curatingCapsule.id}`);
    }
  };

  const nextCapsule = getNextUnsavedCapsule();
  const allCurated = !nextCapsule;

  const handleRemoveQuote = (quoteId: string) => {
    setRemovedQuotes(prev => {
      const updated = new Set([...prev, quoteId]);
      // Persist to localStorage
      localStorage.setItem('fdv-removed-quotes', JSON.stringify([...updated]));
      return updated;
    });
  };

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/api/saves/${encodeURIComponent(itemId)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
    },
  });

  const handleItemClick = (save: SavedItem) => {
    if (save.itemType === "trip") {
      navigate("/concierge");
      return;
    }
    const imageKey = getImageKey(save.itemId);
    const imageUrl = getImageUrl(imageKey, save.assetUrl || save.metadata?.imageUrl || '');
    setSelectedItem({
      id: save.itemId,
      title: save.title || save.metadata?.title || save.itemId,
      subtitle: save.metadata?.subtitle,
      description: save.metadata?.description || save.detailDescription,
      bucket: save.itemType,
      pinType: save.itemType,
      assetKey: save.itemId,
      storyTag: save.storyTag || '',
      imageUrl,
      // Commerce: prefer top-level DB columns, fall back to metadata
      brand: save.brand || save.metadata?.brand,
      price: save.price || save.metadata?.price,
      shopUrl: save.shopUrl || save.metadata?.shopUrl || save.metadata?.shopLink,
      bookUrl: save.bookUrl || save.metadata?.bookUrl,
      detailDescription: save.detailDescription || save.metadata?.detailDescription || save.metadata?.description,
      genomeKey: save.metadata?.genomeKey || save.metadata?.assetKey || imageUrl?.split('/').pop()?.split('?')[0] || undefined,
    });
    setDrawerOpen(true);
  };

  const filteredSaves = filterSaves(saves, activeTab);

  // Client-side dedup — multi-key: title+brand, core title+brand, AND image URL
  // Image URL is the most reliable key — same product image = same product regardless of title
  function deduplicateSaves(items: SavedItem[]): SavedItem[] {
    const normalizeStr = (s: string) => (s || '')
      .toLowerCase().trim()
      .replace(/[éèê]/g, 'e').replace(/[àâä]/g, 'a')
      .replace(/[ïîì]/g, 'i').replace(/[ôöò]/g, 'o')
      .replace(/[üûù]/g, 'u').replace(/[ç]/g, 'c')
      .replace(/[—–\-:,\.]/g, ' ').replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ').trim();

    const getCoreTitle = (title: string) => normalizeStr(title)
      .replace(/\b(bag|bags|the|a|an|in|of|mules|thongs|sandals|slippers|earrings|hoops|necklace)\b/g, '')
      .replace(/\s+/g, ' ').trim();

    const seenTitleBrand = new Set<string>();
    const seenCoreTitleBrand = new Set<string>();
    const seenImageUrl = new Set<string>();

    return items.filter(s => {
      const normTitle = normalizeStr(s.title);
      const normBrand = normalizeStr(s.brand || s.metadata?.brand || '');
      const coreTitle = getCoreTitle(s.title);
      const imageUrl = (s.assetUrl || s.metadata?.imageUrl || '').trim();

      // Nothing to dedup on
      if (!normTitle && !normBrand && !imageUrl) return true;

      // Key 1: exact normalized title+brand
      const exactKey = `${normTitle}|${normBrand}`;
      // Key 2: core title (product-type words stripped) + brand
      const coreKey = `${coreTitle}|${normBrand}`;

      // Check ANY key match → duplicate
      const isDupe = seenTitleBrand.has(exactKey) ||
                     seenCoreTitleBrand.has(coreKey) ||
                     (imageUrl && seenImageUrl.has(imageUrl));
      if (isDupe) return false;

      // Record all keys
      seenTitleBrand.add(exactKey);
      seenCoreTitleBrand.add(coreKey);
      if (imageUrl) seenImageUrl.add(imageUrl);
      return true;
    });
  }

  // Apply sub-filter for Your Style tab — uses classifyItem() for consistency
  const subFiltered = activeTab === 'style' && styleSubFilter !== 'all'
    ? filteredSaves.filter(s => {
        if (styleSubFilter === 'clothing') return isClothingItem(s);
        return isAccessoryItem(s);
      })
    : filteredSaves;

  const displayedSaves = deduplicateSaves(subFiltered);

  return (
    <div className="min-h-screen pb-[80px] bg-[#fafaf9] dark:bg-background" style={{ paddingTop: 70 }}>
      {/* TopBar handles navigation at app level */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <header className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-2" data-testid="text-suitcase-title">
            YOUR SUITCASE
          </h1>
          <p className="text-muted-foreground mb-4" data-testid="text-suitcase-subtitle">
            Everything you've saved
          </p>
          <p className="text-sm text-muted-foreground mb-4" data-testid="text-suitcase-stats">
            {saves.length} {saves.length === 1 ? 'item' : 'items'} saved
          </p>
          {saves.length >= 3 && (
            allCurated ? (
              <div
                style={{
                  width: "100%",
                  maxWidth: 360,
                  margin: "0 auto",
                  height: 48,
                  borderRadius: 8,
                  background: "rgba(44, 36, 22, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#9B8D7C",
                }}
              >
                More Edits Coming
              </div>
            ) : (
              <button
                onClick={handleCurateForMe}
                data-testid="button-curate-for-me-header"
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 360,
                  margin: "0 auto",
                  height: 48,
                  borderRadius: 8,
                  background: "#1a1a1a",
                  border: "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#ffffff",
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>Curate for Me</span>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 8,
                    border: "1px solid transparent",
                    background: "linear-gradient(#1a1a1a, #1a1a1a) padding-box, linear-gradient(90deg, transparent, #c9a84c, transparent) border-box",
                    animation: "shimmer 3s ease-in-out infinite",
                  }}
                />
              </button>
            )
          )}
        </header>

        <div className="border-b border-border mb-8">
              <nav className="flex gap-1 overflow-x-auto pb-px -mb-px" data-testid="nav-suitcase-tabs">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "border-foreground text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Sub-filter pills for Your Style tab */}
            {activeTab === 'style' && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 24,
                marginBottom: 20,
                marginTop: -4,
              }}>
                {(['all', 'clothing', 'accessories'] as const).map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setStyleSubFilter(pill)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 11,
                      fontWeight: styleSubFilter === pill ? 600 : 400,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: styleSubFilter === pill ? '#1a1a1a' : '#9B8D7C',
                      cursor: 'pointer',
                      padding: '4px 0',
                      borderBottom: styleSubFilter === pill ? '2px solid #c9a84c' : '2px solid transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-stone-200 dark:bg-stone-800 rounded-md animate-pulse" />
                ))}
              </div>
            ) : activeTab === "state-of-mind" ? (
              <StateOfMindContent onRemove={handleRemoveQuote} removedIds={removedQuotes} />
            ) : activeTab === "my-edits" ? (
              /* My Edits — show saved capsules from localStorage */
              savedCapsules.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480, margin: "0 auto" }}>
                  {savedCapsules.map((capsule) => {
                    const heroMood = capsule.moodImages[0];
                    const heroImage = heroMood ? heroMood.imageUrl : "";
                    const isPlaceholder = !heroImage || heroImage.startsWith("data:");
                    const dateStr = new Date(capsule.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

                    return (
                      <div
                        key={capsule.id}
                        onClick={() => navigate(`/capsule/${capsule.id}`)}
                        style={{
                          background: "#ffffff",
                          borderRadius: 8,
                          overflow: "hidden",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ width: "100%", aspectRatio: "3 / 4", background: "#ffffff", overflow: "hidden" }}>
                          {!isPlaceholder ? (
                            <img
                              src={heroImage}
                              alt={capsule.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
                              <span style={{ fontFamily: "Lora, serif", fontSize: 20, color: "#9B8D7C" }}>{capsule.name}</span>
                            </div>
                          )}
                        </div>
                        <div style={{ padding: 16 }}>
                          <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 600, color: "#2c2416", margin: 0, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {capsule.name}
                          </h3>
                          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#9B8D7C", margin: 0, marginBottom: 6, lineHeight: 1.4 }}>
                            {capsule.tagline}
                          </p>
                          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9B8D7C", margin: 0 }}>
                            {capsule.moodImages.length + capsule.accessories.length} pieces · Saved {dateStr}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ fontFamily: "Lora, serif", fontSize: 16, fontStyle: "italic", color: "rgba(44, 36, 22, 0.55)", lineHeight: 1.6, marginBottom: 24 }}>
                    Save more items to unlock your first Edit.
                    <br />
                    We're watching what catches your eye.
                  </p>
                </div>
              )
            ) : displayedSaves.length === 0 ? (
              <div className="text-center py-20">
                {saves.length === 0 ? (
                  <>
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl mb-2">Your suitcase is empty</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Start exploring The Current or browse the Morocco itinerary to save things you love.
                    </p>
                    <div className="flex flex-col items-center gap-4 mt-6">
                      <div className="flex gap-4 justify-center">
                        <Link href="/current">
                          <Button variant="outline" data-testid="button-explore-current">
                            Explore The Current
                          </Button>
                        </Link>
                        <Link href="/">
                          <Button data-testid="button-browse-itinerary">
                            Browse Itinerary
                          </Button>
                        </Link>
                      </div>
                      {/* Curate for Me only appears with 3+ saves — no button in empty state */}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-serif text-xl mb-2">No {CATEGORY_TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} saved yet</h3>
                    <p className="text-muted-foreground">
                      Explore and save items to see them here.
                    </p>
                  </>
                )}
              </div>
            ) : activeTab === "my-trips" ? (
              <div className="space-y-6">
                {displayedSaves.map((save) => (
                  <Link key={save.id} href="/">
                    <div
                      className="relative overflow-hidden rounded-lg cursor-pointer group"
                      data-testid={`card-trip-${save.id}`}
                    >
                      <div className="aspect-[21/9] relative">
                        {(save.assetUrl || save.metadata?.imageUrl) ? (
                          <img
                            src={save.assetUrl || save.metadata?.imageUrl || ''}
                            alt={save.title || save.metadata?.title || 'Trip'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="font-serif text-2xl md:text-3xl text-white mb-1">
                            {save.title || save.metadata?.title || 'Trip'}
                          </h3>
                          {save.metadata?.subtitle && (
                            <p className="text-sm text-white/70">{save.metadata.subtitle}</p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeMutation.mutate(save.itemId);
                          }}
                          data-testid={`button-remove-trip-${save.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
                {displayedSaves.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No trips saved yet. Visit a destination to save it as a trip.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-10">
                {groupByDestination(displayedSaves).map((group) => (
                  <div key={group.destination}>
                    {/* Destination header — only show if multiple destinations */}
                    {groupByDestination(displayedSaves).length > 1 && (
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">{group.destination}</h3>
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">{group.items.length}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {group.items.map((save) => (
                        <SavedItemCard
                          key={save.id}
                          save={save}
                          onRemove={() => removeMutation.mutate(save.itemId)}
                          onClick={() => handleItemClick(save)}
                          getImageUrl={getImageUrl}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
      <ItemModal
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        source="suitcase"
      />

      {/* Curating Animation Overlay */}
      {showCurating && curatingCapsule && (
        <CuratingAnimation
          capsuleName={curatingCapsule.name}
          capsuleTagline={curatingCapsule.tagline}
          onComplete={handleCuratingComplete}
        />
      )}

      {/* Shimmer keyframes for Curate for Me button */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
