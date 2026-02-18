import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Package, Briefcase, Map, Loader2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { GlobalNav } from "@/components/global-nav";
import { ItemModal, type ItemModalData } from "@/components/item-modal";
import { deriveEditTag } from "@/lib/derive-edit-tag";

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

const EDIT_DETAIL_TABS = [
  { id: "all", label: "All" },
  { id: "looks", label: "Looks" },
  { id: "experiences", label: "Experiences" },
  { id: "objects", label: "Objects/Items" },
  { id: "rituals", label: "Rituals" },
  { id: "inspiration", label: "Inspiration" },
  { id: "quotes", label: "Quotes" },
  { id: "packing-list", label: "Packing List" },
];

const EDIT_COLORS: Record<string, string> = {
  'morocco-edit': 'bg-amber-100 dark:bg-amber-900/30',
  'hydra-edit': 'bg-blue-100 dark:bg-blue-900/30',
  'slow-travel-edit': 'bg-stone-100 dark:bg-stone-800/50',
  'retreat-edit': 'bg-green-100 dark:bg-green-900/30',
  'new-york-edit': 'bg-slate-100 dark:bg-slate-800/50',
  'opening-edit': 'bg-rose-100 dark:bg-rose-900/30',
};

function filterByTab(saves: SavedItem[], tab: string): SavedItem[] {
  switch (tab) {
    case "all":
      return saves;
    case "looks":
      return saves.filter(s => s.itemType === "look" || s.itemType === "style");
    case "experiences":
      return saves.filter(s => s.itemType === "experience" || s.itemType === "place" || s.itemType === "feature");
    case "objects":
      return saves.filter(s => s.itemType === "product" || s.itemType === "object" || s.itemType === "item");
    case "rituals":
      return saves.filter(s => s.itemType === "ritual");
    case "inspiration":
      return saves.filter(s => s.itemType === "image" || s.itemType === "inspire" || s.itemType === "scene");
    case "quotes":
      return saves.filter(s => s.itemType === "quote");
    case "packing-list":
      return saves.filter(s => 
        s.itemType === "look" || 
        s.itemType === "style" || 
        s.itemType === "product" || 
        s.itemType === "object" || 
        s.itemType === "item"
      );
    default:
      return saves;
  }
}

function getEditDisplayName(editTag: string): string {
  const nameMap: Record<string, string> = {
    'morocco-edit': 'Morocco Edit',
    'hydra-edit': 'Hydra Edit',
    'slow-travel-edit': 'Slow Travel Edit',
    'retreat-edit': 'Retreat Edit',
    'new-york-edit': 'New York Edit',
    'opening-edit': "Today's Edit",
  };
  return nameMap[editTag] || editTag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function SavedItemCard({ save, onRemove, onClick }: { save: SavedItem; onRemove: () => void; onClick: () => void }) {
  const imageUrl = save.assetUrl || save.metadata?.imageUrl;
  const displayTitle = save.title || save.metadata?.title || save.itemId;
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
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 flex items-center justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {save.itemType}
            </span>
          </div>
        )}
        {isOwned && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <Package className="w-3 h-3 mr-1" />
              Owned
            </Badge>
          </div>
        )}
        {isWanted && !isOwned && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
              <Briefcase className="w-3 h-3 mr-1" />
              Want
            </Badge>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          data-testid={`button-remove-${save.id}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <p className="font-medium text-sm truncate">{displayTitle}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {save.itemType}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default function EditDetailPage() {
  const params = useParams();
  const editTag = params.editTag || '';
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const seedAttempted = useRef(false);

  const { data: allSaves = [], isLoading } = useQuery<SavedItem[]>({
    queryKey: ["/api/saves"],
  });

  const MOROCCO_SEED_THRESHOLD = 80;
  
  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/saves/seed/morocco-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error('Failed to seed');
      return res.json();
    },
    onSuccess: (data) => {
      if (data.seeded && data.insertedCount > 0) {
        queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
      }
    },
    onError: () => {
      seedAttempted.current = false;
    },
    onSettled: () => {
      setIsSeeding(false);
    }
  });

  useEffect(() => {
    if (editTag === 'morocco-edit' && !seedAttempted.current && !isLoading && !seedMutation.isPending) {
      const moroccoSaves = allSaves.filter(s => deriveEditTag(s) === 'morocco-edit');
      if (moroccoSaves.length < MOROCCO_SEED_THRESHOLD) {
        seedAttempted.current = true;
        setIsSeeding(true);
        seedMutation.mutate();
      }
    }
  }, [editTag, isLoading, allSaves, seedMutation.isPending]);

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/api/saves/${encodeURIComponent(itemId)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
    },
  });

  const handleItemClick = (save: SavedItem) => {
    const imageUrl = save.assetUrl || save.metadata?.imageUrl || '';
    setSelectedItem({
      id: save.itemId,
      title: save.title || save.metadata?.title || save.itemId,
      subtitle: save.metadata?.subtitle,
      bucket: save.itemType,
      pinType: save.itemType,
      assetKey: save.itemId,
      storyTag: save.storyTag || '',
      imageUrl,
    });
    setDrawerOpen(true);
  };

  const editSaves = allSaves.filter(s => deriveEditTag(s) === editTag);
  const filteredSaves = filterByTab(editSaves, activeTab);
  const editColor = EDIT_COLORS[editTag] || 'bg-stone-100 dark:bg-stone-800/50';

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <GlobalNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/suitcase">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-suitcase">
              <ArrowLeft className="w-4 h-4" />
              Back to Suitcase
            </Button>
          </Link>
        </div>

        <header className={`${editColor} rounded-lg p-8 mb-8`}>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-2" data-testid="text-edit-title">
            {getEditDisplayName(editTag)}
          </h1>
          <p className="text-muted-foreground mb-4" data-testid="text-edit-count">
            {isSeeding ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading packing list...
              </span>
            ) : (
              `${editSaves.length} saved items`
            )}
          </p>
          {editTag === 'morocco-edit' && (
            <Link href="/itinerary/morocco">
              <Button variant="default" className="gap-2" data-testid="button-open-itinerary">
                <Map className="w-4 h-4" />
                Open Itinerary
              </Button>
            </Link>
          )}
        </header>

        <div className="border-b border-border mb-8">
          <nav className="flex gap-1 overflow-x-auto pb-px -mb-px" data-testid="nav-edit-tabs">
            {EDIT_DETAIL_TABS.map((tab) => {
              const count = filterByTab(editSaves, tab.id).length;
              return (
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
                  {tab.label} ({count})
                </button>
              );
            })}
          </nav>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-stone-200 dark:bg-stone-800 rounded-md animate-pulse" />
            ))}
          </div>
        ) : filteredSaves.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No {activeTab === "all" ? "items" : EDIT_DETAIL_TABS.find(t => t.id === activeTab)?.label.toLowerCase()} in this edit yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSaves.map((save) => (
              <SavedItemCard
                key={save.id}
                save={save}
                onRemove={() => removeMutation.mutate(save.itemId)}
                onClick={() => handleItemClick(save)}
              />
            ))}
          </div>
        )}
      </div>
      <ItemModal
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
