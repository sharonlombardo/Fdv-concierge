import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Heart, Package, ShoppingBag, ExternalLink, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

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

type DetailDrawerProps = {
  item: SavedItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PURCHASE_STATUSES = [
  { id: "want", label: "Want", icon: Heart, color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100" },
  { id: "purchased", label: "Owned", icon: Package, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
];

export function DetailDrawer({ item, open, onOpenChange }: DetailDrawerProps) {
  const [localStatus, setLocalStatus] = useState<string | undefined>(item?.purchaseStatus);

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, purchaseStatus }: { itemId: string; purchaseStatus: string }) => {
      await apiRequest("PATCH", `/api/saves/${encodeURIComponent(itemId)}`, { purchaseStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/api/saves/${encodeURIComponent(itemId)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
      onOpenChange(false);
    },
  });

  if (!item) return null;

  const imageUrl = item.assetUrl || item.metadata?.imageUrl;
  const displayTitle = item.title || item.metadata?.title || item.itemId;
  const subtitle = item.metadata?.subtitle;
  const currentStatus = localStatus || item.purchaseStatus;

  const handleStatusChange = (status: string) => {
    const newStatus = currentStatus === status ? undefined : status;
    setLocalStatus(newStatus);
    updateMutation.mutate({ itemId: item.itemId, purchaseStatus: newStatus || "" });
  };

  const getSourceLabel = () => {
    if (item.editionTag) {
      return `From ${item.editionTag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
    if (item.sourceContext?.includes("current")) return "From The Current";
    if (item.sourceContext?.includes("morocco")) return "From Morocco Itinerary";
    return "";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto" data-testid="drawer-detail">
        <SheetHeader className="sr-only">
          <SheetTitle>{displayTitle}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          {imageUrl && (
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 -mx-2">
              <img
                src={imageUrl}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              {getSourceLabel()}
            </p>
            <h2 className="font-serif text-2xl font-medium">{displayTitle}</h2>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{item.itemType}</Badge>
            {item.storyTag && (
              <Badge variant="secondary">{item.storyTag}</Badge>
            )}
            {item.aestheticTags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-sm font-medium mb-3">Status</p>
            <div className="flex gap-2">
              {PURCHASE_STATUSES.map((status) => {
                const Icon = status.icon;
                const isActive = currentStatus === status.id;
                return (
                  <Button
                    key={status.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(status.id)}
                    className={isActive ? status.color : ""}
                    disabled={updateMutation.isPending}
                    data-testid={`button-status-${status.id}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {status.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {item.metadata?.purchaseUrl && (
            <a
              href={item.metadata.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full gap-2" data-testid="button-shop">
                <ShoppingBag className="w-4 h-4" />
                Shop This Item
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          )}

          <div className="border-t border-border pt-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => removeMutation.mutate(item.itemId)}
              disabled={removeMutation.isPending}
              data-testid="button-remove-item"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove from Suitcase
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Saved {new Date(item.savedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
