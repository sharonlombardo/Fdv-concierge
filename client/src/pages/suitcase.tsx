import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Briefcase, Sparkles } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useImageSlot } from "@/hooks/use-image-slot";
import { GlobalNav } from "@/components/global-nav";

type EditData = {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  pieceCount: number;
  status: string;
};

function useTodaysEditList(): EditData[] {
  const editCardImage = useImageSlot("suitcase-capsule-card");
  
  return [
    {
      id: "desert-neutrals",
      name: "Desert Neutrals",
      description: "Warm earth tones and natural textures for your Morocco journey",
      heroImage: editCardImage,
      pieceCount: 12,
      status: "ready"
    }
  ];
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
};

const VIEW_MODES = [
  { id: "category", label: "By Category" },
  { id: "edit", label: "By Edit" },
];

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "style", label: "Your Style" },
  { id: "state-of-mind", label: "State of Mind" },
  { id: "culture", label: "Culture" },
  { id: "daily-rituals", label: "Daily Rituals" },
  { id: "places", label: "Travel & Experiences" },
  { id: "items", label: "Objects of Desire" },
  { id: "inspiration", label: "Inspiration" },
  { id: "todays-edit", label: "Today's Edit" },
];

const EDIT_CARDS = [
  { id: "morocco-edit", name: "Morocco Edit", storyTag: "morocco", color: "bg-amber-100 dark:bg-amber-900/30" },
  { id: "hydra-edit", name: "Hydra Edit", storyTag: "hydra", color: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "slow-travel-edit", name: "Slow Travel Edit", storyTag: "slow-travel", color: "bg-stone-100 dark:bg-stone-800/50" },
  { id: "retreat-edit", name: "Retreat Edit", storyTag: "retreat", color: "bg-green-100 dark:bg-green-900/30" },
  { id: "new-york-edit", name: "New York Edit", storyTag: "new-york", color: "bg-slate-100 dark:bg-slate-800/50" },
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
  'image': 'inspiration',
  'inspire': 'inspiration',
  'scene': 'inspiration',
  'cover': 'inspiration',
  'quote': 'state-of-mind',
  'experience': 'places',
  'place': 'places',
  'feature': 'places',
  'product': 'items',
  'object': 'items',
  'item': 'items',
  'article': 'culture',
  'culture': 'culture',
  'ritual': 'daily-rituals',
};

function filterSaves(saves: SavedItem[], tab: string): SavedItem[] {
  switch (tab) {
    case "all":
      return saves;
    case "state-of-mind":
      return saves.filter(s => s.itemType === "quote");
    case "todays-edit":
      return [];
    default:
      return saves.filter(s => SAVE_TYPE_TO_CATEGORY[s.itemType] === tab);
  }
}

function StateOfMindContent() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">From The Current</p>
        <h2 className="font-serif text-2xl">Words to Travel By</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CURATED_QUOTES.map((quote) => (
          <div 
            key={quote.id}
            className="bg-[#f5f1ed] dark:bg-[#2a2825] rounded-md p-8 flex flex-col justify-between min-h-[180px]"
            data-testid={`card-quote-${quote.id}`}
          >
            <p className="font-serif text-lg leading-relaxed text-foreground/80 italic">
              "{quote.text}"
            </p>
            <p className="text-xs text-muted-foreground mt-4 tracking-widest uppercase">
              {quote.source}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedItemCard({ save, onRemove }: { save: SavedItem; onRemove: () => void }) {
  const hasImage = save.metadata?.imageUrl;
  const hasPurchaseIntent = save.metadata?.purchaseIntent === true;

  return (
    <div
      className="group relative bg-white dark:bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      data-testid={`card-saved-${save.id}`}
    >
      <div className="aspect-[3/4] relative">
        {hasImage ? (
          <img
            src={save.metadata.imageUrl}
            alt={save.metadata.title || "Saved item"}
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

        {hasPurchaseIntent && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-xs">
              <Briefcase className="w-3 h-3 mr-1" />
              To Buy
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
          {save.metadata?.title || save.itemId}
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

function TodaysEditTabContent() {
  const editsList = useTodaysEditList();
  
  if (editsList.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-serif text-xl mb-2">No edits yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Keep saving items you love - we'll help you build curated edits based on your taste.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {editsList.map((edit: EditData) => (
        <Link key={edit.id} href={`/suitcase/todays-edit/${edit.id}`}>
          <div 
            className="group relative aspect-[16/10] rounded-md overflow-hidden cursor-pointer"
            data-testid={`card-edit-${edit.id}`}
          >
            <img
              src={edit.heroImage}
              alt={edit.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-xs uppercase tracking-widest">AI Generated</span>
              </div>
              <h3 className="font-serif text-2xl text-white font-medium mb-1">{edit.name}</h3>
              <p className="text-white/70 text-sm mb-3">{edit.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-white/80 text-sm">{edit.pieceCount} pieces</span>
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/20">
                  View Edit
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ByEditView({ saves }: { saves: SavedItem[] }) {
  const uniqueEditTags = Array.from(new Set(saves.map(s => s.editTag).filter(Boolean))) as string[];
  
  const getEditSaves = (editTag: string) => {
    return saves.filter(s => s.editTag === editTag);
  };

  const getTypeCounts = (editSaves: SavedItem[]) => {
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

  const allEditTags = Array.from(new Set([...EDIT_CARDS.map(e => e.id), ...uniqueEditTags]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allEditTags.map((editTag) => {
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
      {allEditTags.length === 0 && (
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

  const filteredSaves = filterSaves(saves, activeTab);

  const itemsToShop = saves.filter((s) => s.metadata?.purchaseIntent).length;

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
          <p className="text-sm text-muted-foreground" data-testid="text-suitcase-stats">
            {saves.length} saves • {itemsToShop} items to shop • {CURATED_QUOTES.length} quotes
          </p>
        </header>

        <div className="flex justify-center gap-2 mb-6">
          {VIEW_MODES.map((mode) => (
            <Button
              key={mode.id}
              variant={viewMode === mode.id ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(mode.id)}
              data-testid={`button-view-${mode.id}`}
            >
              {mode.label}
            </Button>
          ))}
        </div>

        {viewMode === "edit" ? (
          <ByEditView saves={saves} />
        ) : (
          <>
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
              <StateOfMindContent />
            ) : activeTab === "todays-edit" ? (
              <TodaysEditTabContent />
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
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
