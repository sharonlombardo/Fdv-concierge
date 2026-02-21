import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PinButton } from "@/components/pin-button";
import { ExternalLink } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

function fireEvent(eventType: string, itemId?: string, destinationUrl?: string, metadata?: Record<string, any>) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, itemId, destinationUrl, sourcePage: "the_current", metadata }),
  }).catch(() => {}); // Fire-and-forget
}

export type ItemModalData = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  bucket: string;
  pinType: string;
  assetKey: string;
  storyTag: string;
  imageUrl?: string;
  // Commerce fields (populated from saves table)
  brand?: string;
  price?: string;
  shopUrl?: string;
  bookUrl?: string;
  detailDescription?: string;
  category?: string;
};

type ItemModalProps = {
  item: ItemModalData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "suitcase" = opened from Suitcase (already saved), "current" = from The Current/editorial */
  source?: "current" | "suitcase";
};

type SaveDetail = {
  brand?: string | null;
  price?: string | null;
  shopUrl?: string | null;
  bookUrl?: string | null;
  detailDescription?: string | null;
  category?: string | null;
  isCurated?: boolean | null;
};

export function ItemModal({ item, open, onOpenChange, source = "current" }: ItemModalProps) {
  const fromSuitcase = source === "suitcase";
  // Fire open_modal event
  useEffect(() => {
    if (open && item) {
      fireEvent("open_modal", item.id, undefined, { title: item.title, pinType: item.pinType, storyTag: item.storyTag });
    }
  }, [open, item?.id]);

  // Fetch commerce data from saves table
  const { data: saveDetail } = useQuery<SaveDetail>({
    queryKey: ["/api/saves/detail", item?.id],
    queryFn: async () => {
      const res = await fetch(`/api/saves/detail/${encodeURIComponent(item!.id)}`);
      if (!res.ok) return {};
      return res.json();
    },
    enabled: open && !!item?.id,
  });

  const queryClient = useQueryClient();

  // Check if item is saved
  const { data: saveStatus } = useQuery<{ isPinned: boolean }>({
    queryKey: ["/api/saves/check", item?.id],
    queryFn: async () => {
      const res = await fetch(`/api/saves/check/${encodeURIComponent(item!.id)}`);
      if (!res.ok) return { isPinned: false };
      return res.json();
    },
    enabled: open && !!item?.id,
  });

  const isSaved = saveStatus?.isPinned ?? false;

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        await fetch(`/api/saves/${encodeURIComponent(item!.id)}`, { method: "DELETE" });
      } else {
        await fetch("/api/saves", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType: item!.pinType,
            itemId: item!.id,
            sourceContext: "item_modal",
            aestheticTags: [item!.bucket.toLowerCase(), item!.pinType.toLowerCase(), item!.storyTag],
            savedAt: Date.now(),
            metadata: { title: item!.title, imageUrl: item!.imageUrl },
            storyTag: item!.storyTag,
            editionTag: "current-edition-1",
            editTag: `${item!.storyTag}-edit`,
            title: item!.title,
            assetUrl: item!.imageUrl || "",
          }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saves/check", item?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
      if (!isSaved && item) {
        fireEvent("save_item", item.id, undefined, { source: "modal", title: item.title });
      }
    },
  });

  if (!item) return null;

  // Merge: props take priority, then DB data
  const brand = item.brand || saveDetail?.brand || undefined;
  const price = item.price || saveDetail?.price || undefined;
  const shopUrl = item.shopUrl || saveDetail?.shopUrl || undefined;
  const bookUrl = item.bookUrl || saveDetail?.bookUrl || undefined;
  const description = item.detailDescription || saveDetail?.detailDescription || item.description || undefined;

  const isProduct = item.pinType === "object" || item.pinType === "look" || item.pinType === "product" || item.pinType === "item";
  const isPlace = item.pinType === "place" || item.pinType === "experience";

  // Products: object-contain (show full garment). Places: object-cover (atmospheric)
  const imageObjectFit = isProduct ? "object-contain" : "object-cover";
  const imageBg = isProduct ? "bg-[#f5f5f5]" : "bg-[#f5f5f5]";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Frosted glass overlay */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={() => onOpenChange(false)}
        />

        {/* Bottom sheet content */}
        <DialogPrimitive.Content
          className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] rounded-t-2xl bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom data-[state=closed]:duration-300 data-[state=open]:duration-500 focus:outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">
            {item.title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {description || `Details for ${item.title}`}
          </DialogPrimitive.Description>

          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-[#1a1a1a]/20" />
          </div>

          <div className="overflow-y-auto max-h-[calc(92vh-2rem)]">
            {/* Image — 60%+ of modal */}
            <div className={`relative w-full aspect-[3/4] ${imageBg}`}>
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={`w-full h-full ${imageObjectFit}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[#1a1a1a]/40 text-sm uppercase tracking-widest">
                    {item.title}
                  </span>
                </div>
              )}

              {/* Pin button overlay — top right of image (hidden on suitcase modal) */}
              {!fromSuitcase && (
                <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                  <PinButton
                    itemType={item.pinType}
                    itemId={item.id}
                    itemData={{
                      title: item.title,
                      subtitle: item.subtitle,
                      bucket: item.bucket,
                      sourceStory: item.storyTag,
                      issueNumber: 1,
                      saveType: item.pinType,
                      storyTag: item.storyTag,
                      editionTag: "current-edition-1",
                      editTag: `${item.storyTag}-edit`,
                      assetKey: item.assetKey,
                      assetUrl: item.imageUrl || "",
                      imageUrl: item.imageUrl,
                    }}
                    sourceContext="the_current_issue_1"
                    aestheticTags={[
                      item.bucket.toLowerCase(),
                      item.pinType.toLowerCase(),
                      item.storyTag,
                    ]}
                    size="md"
                  />
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="px-6 pb-8 pt-5 space-y-4">
              {/* Brand name — bold italic */}
              {brand && (
                <p
                  className="text-xs tracking-[0.15em] font-bold italic"
                  style={{
                    color: "#1a1a1a",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {brand}
                </p>
              )}

              {/* Title */}
              <h2
                className="text-xl font-medium leading-snug"
                style={{
                  color: "#1a1a1a",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {item.title}
              </h2>

              {/* Price — calm, not shouting */}
              {price && (
                <p
                  className="text-sm"
                  style={{ color: "#1a1a1a", opacity: 0.6 }}
                >
                  {price}
                </p>
              )}

              {/* Atmospheric description */}
              {description && (
                <p
                  className="text-sm leading-relaxed italic"
                  style={{ color: "#1a1a1a", opacity: 0.7 }}
                >
                  {description}
                </p>
              )}

              {fromSuitcase ? (
                <>
                  {/* === SUITCASE MODAL — item is already saved === */}
                  {isProduct && (
                    <>
                      {shopUrl ? (
                        <a
                          href={shopUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                          onClick={(e) => {
                            e.stopPropagation();
                            fireEvent("affiliate_click", item.id, shopUrl, { brand, title: item.title });
                          }}
                        >
                          <button
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                            style={{ backgroundColor: "#1a1a1a", color: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                          >
                            <span>Shop{brand ? ` ${brand}` : ""}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </a>
                      ) : (
                        <p className="text-xs tracking-[0.15em] italic text-center py-3" style={{ color: "#1a1a1a", opacity: 0.4, fontFamily: "'Inter', sans-serif" }}>
                          Coming Soon
                        </p>
                      )}
                      {bookUrl && (
                        <a href={bookUrl} target="_blank" rel="noopener noreferrer" className="block" onClick={(e) => { e.stopPropagation(); fireEvent("book_click", item.id, bookUrl, { title: item.title }); }}>
                          <button className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-all hover:bg-[#1a1a1a] hover:text-white" style={{ backgroundColor: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a", fontFamily: "'Inter', sans-serif" }}>
                            <span>Book</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </a>
                      )}
                    </>
                  )}
                  {isPlace && (
                    <>
                      {item.storyTag === "morocco" ? (
                        <a href="/concierge" className="block">
                          <button className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80" style={{ backgroundColor: "#1a1a1a", color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>
                            <span>View Itinerary</span>
                          </button>
                        </a>
                      ) : bookUrl ? (
                        <a href={bookUrl} target="_blank" rel="noopener noreferrer" className="block" onClick={(e) => { e.stopPropagation(); fireEvent("book_click", item.id, bookUrl, { title: item.title }); }}>
                          <button className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80" style={{ backgroundColor: "#1a1a1a", color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>
                            <span>Book</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </a>
                      ) : null}
                    </>
                  )}
                  {/* Remove from Suitcase — small text link */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveMutation.mutate();
                      onOpenChange(false);
                    }}
                    className="text-xs text-center w-full py-2 transition-opacity hover:opacity-70"
                    style={{ color: "#1a1a1a", opacity: 0.4, fontFamily: "'Inter', sans-serif" }}
                  >
                    Remove from Suitcase
                  </button>
                </>
              ) : (
                <>
                  {/* === CURRENT/EDITORIAL MODAL === */}
                  {/* Save button — pin icon + "Save to Suitcase" */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveMutation.mutate();
                    }}
                    disabled={saveMutation.isPending}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-all"
                    style={{
                      backgroundColor: isSaved ? "#c9a84c" : "transparent",
                      color: isSaved ? "#ffffff" : "#1a1a1a",
                      border: isSaved ? "1px solid #c9a84c" : "1px solid #1a1a1a",
                      fontFamily: "'Inter', sans-serif",
                      opacity: saveMutation.isPending ? 0.5 : 1,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 32" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isSaved ? 0 : 2}>
                      <circle cx="12" cy="10" r="9" />
                      <polygon points="9,18 12,32 15,18" />
                    </svg>
                    <span>{isSaved ? "Saved to Suitcase" : "Save to Suitcase"}</span>
                  </button>

                  {/* SHOP / BOOK buttons */}
                  {shopUrl ? (
                    <a
                      href={shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      onClick={(e) => {
                        e.stopPropagation();
                        fireEvent("affiliate_click", item.id, shopUrl, { brand, title: item.title });
                      }}
                    >
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#1a1a1a", color: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                      >
                        <span>Shop{brand ? ` ${brand}` : ""}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </a>
                  ) : isProduct ? (
                    <p className="text-xs tracking-[0.15em] italic text-center py-3" style={{ color: "#1a1a1a", opacity: 0.4, fontFamily: "'Inter', sans-serif" }}>
                      Coming Soon
                    </p>
                  ) : null}
                  {bookUrl && (
                    <a
                      href={bookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      onClick={(e) => {
                        e.stopPropagation();
                        fireEvent("book_click", item.id, bookUrl, { title: item.title });
                      }}
                    >
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-all hover:bg-[#1a1a1a] hover:text-white"
                        style={{ backgroundColor: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a", fontFamily: "'Inter', sans-serif" }}
                      >
                        <span>Book</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </a>
                  )}
                </>
              )}

              {/* Bucket label — very subtle, editorial */}
              <p
                className="text-[10px] tracking-widest uppercase text-center pt-2"
                style={{ color: "#1a1a1a", opacity: 0.35 }}
              >
                {item.bucket}
              </p>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
