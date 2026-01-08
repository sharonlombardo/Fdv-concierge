import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Briefcase, ArrowLeft, Sparkles } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useImageSlot } from "@/hooks/use-image-slot";

type CapsuleData = {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  pieceCount: number;
  status: string;
};

function useCapsulesList(): CapsuleData[] {
  const capsuleCardImage = useImageSlot("suitcase-capsule-card");
  
  return [
    {
      id: "desert-neutrals",
      name: "Desert Neutrals",
      description: "Warm earth tones and natural textures for your Morocco journey",
      heroImage: capsuleCardImage,
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
};

const tabs = [
  { id: "all", label: "All" },
  { id: "style", label: "Your Style" },
  { id: "state-of-mind", label: "State of Mind" },
  { id: "culture", label: "Culture" },
  { id: "daily-rituals", label: "Daily Rituals" },
  { id: "places", label: "Travel & Experiences" },
  { id: "items", label: "Objects of Desire" },
  { id: "inspiration", label: "Inspiration" },
  { id: "capsules", label: "Capsules" },
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

function filterSaves(saves: SavedItem[], tab: string): SavedItem[] {
  switch (tab) {
    case "all":
      return saves;
    case "style":
      return saves.filter(
        (s) =>
          s.itemType === "look" ||
          s.itemType === "style" ||
          s.itemType === "product" ||
          s.itemType === "accessory" ||
          s.itemType === "wardrobe"
      );
    case "state-of-mind":
      return [];
    case "culture":
      return saves.filter(
        (s) => s.itemType === "culture"
      );
    case "daily-rituals":
      return saves.filter(
        (s) => s.itemType === "ritual"
      );
    case "places":
      return saves.filter(
        (s) => s.itemType === "place" || s.itemType === "feature"
      );
    case "items":
      return saves.filter(
        (s) => s.itemType === "product" || s.itemType === "clothing" || s.itemType === "wardrobe"
      );
    case "inspiration":
      return saves.filter(
        (s) => s.itemType === "inspire"
      );
    case "capsules":
      return [];
    default:
      return saves;
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

function CapsulesTabContent() {
  const capsulesList = useCapsulesList();
  
  if (capsulesList.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-serif text-xl mb-2">No capsules yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Keep saving items you love - we'll help you build capsule collections based on your taste.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {capsulesList.map((capsule: CapsuleData) => (
        <Link key={capsule.id} href={`/suitcase/capsules/${capsule.id}`}>
          <div 
            className="group relative aspect-[16/10] rounded-md overflow-hidden cursor-pointer"
            data-testid={`card-capsule-${capsule.id}`}
          >
            <img
              src={capsule.heroImage}
              alt={capsule.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-xs uppercase tracking-widest">AI Generated</span>
              </div>
              <h3 className="font-serif text-2xl text-white font-medium mb-1">{capsule.name}</h3>
              <p className="text-white/70 text-sm mb-3">{capsule.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-white/80 text-sm">{capsule.pieceCount} pieces</span>
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/20">
                  View Capsule
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function SuitcasePage() {
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>

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

        <div className="border-b border-border mb-8">
          <nav className="flex gap-1 overflow-x-auto pb-px -mb-px" data-testid="nav-suitcase-tabs">
            {tabs.map((tab) => (
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
        ) : activeTab === "capsules" ? (
          <CapsulesTabContent />
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
                <h3 className="font-serif text-xl mb-2">No {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} saved yet</h3>
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
      </div>
    </div>
  );
}
