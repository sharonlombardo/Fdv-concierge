import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Briefcase, Package, Sparkles } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { GlobalNav } from "@/components/global-nav";
import { DetailDrawer } from "@/components/detail-drawer";
import { deriveEditTag } from "@/lib/derive-edit-tag";
import { TripTransition } from "@/components/trip-transition";
import { useCustomImages } from "@/hooks/use-custom-images";

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

function filterSaves(saves: SavedItem[], tab: string): SavedItem[] {
  switch (tab) {
    case "all":
      return saves;
    case "state-of-mind":
      return saves.filter(s => s.itemType === "quote");
    case "my-edits":
      return saves.filter(s => s.itemType === "edit");
    case "my-trips":
      // Include trips, places/destinations, and items explicitly bucketed to my-trips
      return saves.filter(s =>
        s.itemType === "trip" ||
        s.itemType === "place" ||
        s.itemType === "destination" ||
        s.metadata?.bucket === "my-trips"
      );
    case "travel-destinations":
      // Include travel/destination items AND trips/places (shared with my-trips)
      return saves.filter(s =>
        SAVE_TYPE_TO_CATEGORY[s.itemType] === "travel-destinations" ||
        s.itemType === "trip" ||
        s.itemType === "place" ||
        s.itemType === "destination"
      );
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

  return (
    <div
      className="group relative bg-white dark:bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      data-testid={`card-saved-${save.id}`}
      onClick={onClick}
    >
      <div className="aspect-[3/4] relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={save.title || save.metadata?.title || "Saved item"}
            className="w-full h-full object-cover"
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
          {getSourceLabel(save.sourceContext) && (
            <span className="text-xs text-muted-foreground truncate">
              {getSourceLabel(save.sourceContext)}
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
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
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

  const handleRemoveQuote = (quoteId: string) => {
    setRemovedQuotes(prev => {
      const updated = new Set([...prev, quoteId]);
      // Persist to localStorage
      localStorage.setItem('fdv-removed-quotes', JSON.stringify([...updated]));
      return updated;
    });
  };

  const handleCurateClick = () => {
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    navigate("/todays-edit");
  };

  const { data: saves = [], isLoading } = useQuery<SavedItem[]>({
    queryKey: ["/api/saves"],
  });

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
    setSelectedItem(save);
    setDrawerOpen(true);
  };

  const filteredSaves = filterSaves(saves, activeTab);

  const itemsToShop = saves.filter((s) => s.purchaseStatus === 'want').length;

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <GlobalNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-2" data-testid="text-suitcase-title">
            YOUR SUITCASE
          </h1>
          <p className="text-muted-foreground mb-4" data-testid="text-suitcase-subtitle">
            Everything you've saved
          </p>
          <p className="text-sm text-muted-foreground mb-6" data-testid="text-suitcase-stats">
            {saves.length} saves • {itemsToShop} items to shop • {CURATED_QUOTES.length} quotes
          </p>
          <button
            onClick={handleCurateClick}
            disabled={saves.length === 0}
            className="inline-flex items-center gap-2 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            data-testid="button-curate-for-me"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">Curate for Me</span>
          </button>
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

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-stone-200 dark:bg-stone-800 rounded-md animate-pulse" />
                ))}
              </div>
            ) : activeTab === "state-of-mind" ? (
              <StateOfMindContent onRemove={handleRemoveQuote} removedIds={removedQuotes} />
            ) : filteredSaves.length === 0 ? (
              <div className="text-center py-20">
                {saves.length === 0 ? (
                  <>
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl mb-2">Your suitcase is empty</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Start exploring The Current or browse the Morocco itinerary to save things you love.
                    </p>
                    <div className="flex gap-4 justify-center mt-6">
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
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredSaves.map((save) => (
                  <SavedItemCard
                    key={save.id}
                    save={save}
                    onRemove={() => removeMutation.mutate(save.itemId)}
                    onClick={() => handleItemClick(save)}
                    getImageUrl={getImageUrl}
                  />
                ))}
              </div>
            )}
      </div>
      <DetailDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
      <TripTransition
        isActive={showTransition}
        onComplete={handleTransitionComplete}
      />
    </div>
  );
}
