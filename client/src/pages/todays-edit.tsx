import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// GlobalNav removed — TopBar is now app-level in App.tsx
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PinButton } from "@/components/pin-button";
import { LoadingImage } from "@/components/loading-image";
import { ItemModal, type ItemModalData } from "@/components/item-modal";

const MOOD_KEYS = [
  "todays-edit-mood-1",
  "todays-edit-mood-2",
  "todays-edit-mood-3",
  "todays-edit-mood-4",
];

const LOOK_KEYS = [
  "todays-edit-look-1",
  "todays-edit-look-2",
  "todays-edit-look-3",
  "todays-edit-look-4",
  "todays-edit-look-5",
  "todays-edit-look-6",
];

export default function TodaysEdit() {
  const { data: imageSlotsData, isLoading } = useImageSlots();
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  // Check if capsule is already saved
  const { data: capsuleCheck } = useQuery({
    queryKey: ['/api/saves/check', 'todays-edit-capsule'],
    queryFn: async () => {
      const res = await fetch('/api/saves/check/todays-edit-capsule');
      if (!res.ok) return { isPinned: false };
      return res.json();
    },
  });
  const isCapsuleSaved = capsuleCheck?.isPinned ?? false;

  const saveCapsuleMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'edit',
          itemId: 'todays-edit-capsule',
          sourceContext: 'todays_edit',
          aestheticTags: ['edit', 'capsule', 'curated'],
          savedAt: Date.now(),
          metadata: {
            title: 'Your Capsule',
            subtitle: 'Based on your saves',
            bucket: 'my-edits',
          },
          storyTag: 'opening',
          editTag: 'opening-edit',
          title: 'Your Capsule',
        }),
      });
      if (res.status === 400) return { alreadySaved: true };
      if (!res.ok) throw new Error('Failed to save capsule');
      return { alreadySaved: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saves/check', 'todays-edit-capsule'] });
    },
  });

  const getImageUrl = (assetKey: string): string => {
    if (imageSlotsData?.slots) {
      const slot = imageSlotsData.slots.find(s => s.key === assetKey);
      if (slot?.currentUrl) {
        return slot.currentUrl;
      }
    }
    const defaultSlot = IMAGE_SLOTS.find(s => s.key === assetKey);
    return defaultSlot?.defaultUrl || "";
  };

  const openItemModal = (key: string, title: string, pinType: string) => {
    const imageUrl = getImageUrl(key);
    setSelectedItem({
      id: key,
      title,
      bucket: pinType,
      pinType,
      assetKey: key,
      storyTag: "todays-edit",
      imageUrl,
      brand: "FDV Curated",
    });
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* GlobalNav removed — TopBar is now app-level in App.tsx */}
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/">
          <button 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Link>

        <header className="mb-12 text-center">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Based on your saves
          </p>
          <h1 
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4"
            data-testid="text-todays-edit-title"
          >
            Your Capsule
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A curated selection of mood, looks, and pieces for the journey ahead.
          </p>
        </header>

        <section className="mb-16">
          <p className="text-sm text-muted-foreground text-center max-w-xl mx-auto mb-8 leading-relaxed italic">
            We noticed a thread—quiet warmth, natural textures, unhurried beauty. Here's what belongs together.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
              ))
            ) : (
              MOOD_KEYS.map((key, index) => {
                const imageUrl = getImageUrl(key);
                return (
                  <div
                    key={key}
                    className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted group cursor-pointer"
                    data-testid={`img-mood-${index + 1}`}
                    onClick={() => openItemModal(key, `Mood ${index + 1}`, "mood")}
                  >
                    <LoadingImage
                      src={imageUrl}
                      alt={`Mood ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 z-10 flex flex-col items-center -space-y-1">
                      <PinButton
                        itemType="mood"
                        itemId={key}
                        itemData={{
                          title: `Mood ${index + 1}`,
                          imageUrl,
                          storyTag: "todays-edit",
                          editTag: "opening-edit"
                        }}
                        sourceContext="todays_edit"
                        aestheticTags={["mood", "todays-edit"]}
                        size="sm"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 text-center">
            Style & Objects of Desire
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))
            ) : (
              LOOK_KEYS.map((key, index) => {
                const imageUrl = getImageUrl(key);
                return (
                  <div
                    key={key}
                    className="relative aspect-square overflow-hidden rounded-lg bg-muted group cursor-pointer"
                    data-testid={`img-look-${index + 1}`}
                    onClick={() => openItemModal(key, `Look ${index + 1}`, "product")}
                  >
                    <LoadingImage
                      src={imageUrl}
                      alt={`Look ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 z-10 flex flex-col items-center -space-y-1">
                      <PinButton
                        itemType="product"
                        itemId={key}
                        itemData={{
                          title: `Look ${index + 1}`,
                          imageUrl,
                          storyTag: "todays-edit",
                          editTag: "opening-edit"
                        }}
                        sourceContext="todays_edit"
                        aestheticTags={["product", "look", "todays-edit"]}
                        size="sm"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <footer className="text-center py-12 border-t border-border space-y-6">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">
            Curated for you
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!isCapsuleSaved) saveCapsuleMutation.mutate();
            }}
            disabled={saveCapsuleMutation.isPending || isCapsuleSaved}
            className="inline-flex items-center gap-2 py-3 px-8 text-xs tracking-[0.2em] uppercase transition-all"
            style={{
              backgroundColor: isCapsuleSaved ? '#c9a84c' : 'transparent',
              color: isCapsuleSaved ? '#ffffff' : '#1a1a1a',
              border: isCapsuleSaved ? '1px solid #c9a84c' : '1px solid #1a1a1a',
              fontFamily: "'Inter', sans-serif",
              opacity: saveCapsuleMutation.isPending ? 0.5 : 1,
            }}
            data-testid="button-save-capsule"
          >
            <svg width="14" height="14" viewBox="0 0 24 32" fill={isCapsuleSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isCapsuleSaved ? 0 : 2}>
              <circle cx="12" cy="10" r="9" />
              <polygon points="9,18 12,32 15,18" />
            </svg>
            <span>{isCapsuleSaved ? 'Saved to My Edits' : 'Save to My Edits'}</span>
          </button>
        </footer>
      </div>
      <ItemModal
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        source="current"
      />
    </div>
  );
}
