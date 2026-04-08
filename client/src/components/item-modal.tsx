import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { getProductByKey, findProductByPartialKey, type BrandGenomeProduct } from "@/lib/brand-genome";

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
  // Commerce fields (populated from saves table or brand genome)
  brand?: string;
  price?: string;
  shopUrl?: string;
  bookUrl?: string;
  detailDescription?: string;
  category?: string;
  // Brand genome fields
  color?: string;
  sizes?: string[];
  shopStatus?: "live" | "coming_soon";
  genomeKey?: string; // database_match_key for genome lookup
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

/** Get destination label from storyTag */
function getDestinationTag(storyTag: string): string {
  const map: Record<string, string> = {
    morocco: "Morocco",
    hydra: "Hydra",
    "slow-travel": "Slow Travel",
    spain: "Slow Travel",
    retreat: "The Retreat",
    "new-york": "New York",
    newyork: "New York",
    opening: "The Current",
    "todays-edit": "Today's Edit",
  };
  return map[storyTag] || "";
}

export function ItemModal({ item, open, onOpenChange, source = "current" }: ItemModalProps) {
  const fromSuitcase = source === "suitcase";
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  // Reset notify state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setNotifyEmail("");
      setNotifySubmitted(false);
    }
  }, [open]);

  // Fire open_modal event
  useEffect(() => {
    if (open && item) {
      fireEvent("open_modal", item.id, undefined, { title: item.title, pinType: item.pinType, storyTag: item.storyTag });
    }
  }, [open, item?.id]);

  // Try brand genome lookup with multi-level fallback
  const genomeProduct: BrandGenomeProduct | undefined = useMemo(() => {
    // 1. Try exact match on genomeKey (case-insensitive via getProductByKey)
    if (item?.genomeKey) {
      const exact = getProductByKey(item.genomeKey);
      if (exact) return exact;
    }
    // 2. Try extracting filename from imageUrl
    if (item?.imageUrl) {
      const filename = item.imageUrl.split('/').pop()?.split('?')[0] || "";
      if (filename) {
        const fromFilename = getProductByKey(filename);
        if (fromFilename) return fromFilename;
        // Try URL-decoded version
        try {
          const decoded = decodeURIComponent(filename);
          if (decoded !== filename) {
            const fromDecoded = getProductByKey(decoded);
            if (fromDecoded) return fromDecoded;
          }
        } catch {}
      }
    }
    // 3. Try partial key match as last resort
    if (item?.genomeKey) {
      const partial = findProductByPartialKey(item.genomeKey);
      if (partial) return partial;
    }
    return undefined;
  }, [item?.genomeKey, item?.imageUrl]);

  // Debug log for genome data flow verification
  useEffect(() => {
    if (item && open) {
      console.log('[MODAL DEBUG]', {
        genomeKey: item.genomeKey,
        genomeFound: !!genomeProduct,
        genomeBrand: genomeProduct?.brand,
        genomeName: genomeProduct?.name,
        title: item.title,
        imageUrl: item.imageUrl?.substring(0, 80),
      });
    }
  }, [item, genomeProduct, open]);

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

  // Check if item is saved — single source of truth
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
        const res = await fetch("/api/saves", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType: item!.pinType || 'style',
            itemId: item!.id,
            sourceContext: "item_modal",
            aestheticTags: [item!.bucket?.toLowerCase(), item!.pinType?.toLowerCase(), item!.storyTag].filter(Boolean),
            savedAt: Date.now(),
            metadata: { title: item!.title, imageUrl: item!.imageUrl, brand: brand, shopUrl: shopUrl, bookUrl: bookUrl, price: price },
            storyTag: item!.storyTag,
            editionTag: "current-edition-1",
            editTag: `${item!.storyTag}-edit`,
            title: item!.title,
            assetUrl: item!.imageUrl || "",
            brand: brand || undefined,
            price: typeof price === 'number' ? String(price) : (price || undefined),
            shopUrl: shopUrl || undefined,
            bookUrl: bookUrl || undefined,
            category: (() => {
              const key = item!.genomeKey || item!.assetKey || item!.id;
              const product = getProductByKey(key);
              return product?.category || item!.category || undefined;
            })(),
          }),
        });
        // 409 or 400 "Already pinned" — treat as success
        if (res.status === 409 || res.status === 400) {
          const body = await res.json().catch(() => ({}));
          if (body.error === "Already pinned") {
            return;
          }
          console.error('[ItemModal] Save validation failed:', body.details || body.error);
          throw new Error('Save validation failed');
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error('[ItemModal] Save failed:', res.status, body);
          throw new Error('Failed to save');
        }
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["/api/saves/check", item?.id] });
      const previous = queryClient.getQueryData(["/api/saves/check", item?.id]);
      queryClient.setQueryData(["/api/saves/check", item?.id], !isSaved);
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["/api/saves/check", item?.id], context.previous);
      }
      console.error('[ItemModal] Save error:', err);
    },
    onSuccess: () => {
      // Explicitly set pin state so it stays gold without waiting for refetch
      queryClient.setQueryData(["/api/saves/check", item?.id], !isSaved);

      if (!isSaved && item) {
        fireEvent("save_item", item.id, undefined, { source: "modal", title: item.title });
      }

      // Refresh saves list in background
      queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
    },
  });

  const notifyMutation = useMutation({
    mutationFn: async (email: string) => {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          itemTitle: item?.title,
          itemId: item?.id,
          source: "coming_soon_notify",
        }),
      });
    },
    onSuccess: () => {
      setNotifySubmitted(true);
    },
  });

  if (!item) return null;

  // Merge: genome > props > DB
  const brand = genomeProduct?.brand || item.brand || saveDetail?.brand || undefined;
  const price = genomeProduct?.price || item.price || saveDetail?.price || undefined;
  const shopUrl = (genomeProduct?.shop_status === "live" && genomeProduct?.url) || item.shopUrl || saveDetail?.shopUrl || undefined;
  const bookUrl = item.bookUrl || saveDetail?.bookUrl || undefined;
  const description = genomeProduct?.description || item.detailDescription || saveDetail?.detailDescription || item.description || undefined;
  const color = genomeProduct?.color || item.color || undefined;
  const sizes = genomeProduct?.sizes || item.sizes || undefined;
  const shopStatus = genomeProduct?.shop_status || item.shopStatus || (shopUrl ? "live" : "coming_soon");

  const isProduct = ["object", "look", "product", "item", "style", "accessory"].includes(item.pinType);
  const isPlace = item.pinType === "place" || item.pinType === "experience";

  // Products: object-contain (show full garment). Places: object-cover (atmospheric)
  const imageObjectFit = isProduct ? "object-contain" : "object-cover";
  const imageBg = isProduct ? "bg-white" : "bg-[#f5f5f5]";
  const destinationTag = getDestinationTag(item.storyTag);

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

          {/* Close button — top right, 44x44 touch target */}
          <DialogPrimitive.Close
            className="absolute top-3 right-3 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-black/25 hover:bg-black/40 active:bg-black/50 transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="16" y2="16" />
              <line x1="16" y1="2" x2="2" y2="16" />
            </svg>
          </DialogPrimitive.Close>

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
            </div>

            {/* Content area — pb-28 ensures CTA clears fixed bottom nav (~64px) */}
            <div className="px-6 pb-28 pt-5 space-y-4">
              {/* Row 1: Brand (bold italic) + Price (right-aligned) on same line */}
              {(brand || price) && (
                <div className="flex items-baseline justify-between gap-4">
                  {brand && (
                    <p
                      className="text-xs tracking-[0.15em] font-bold italic"
                      style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}
                    >
                      {brand}
                    </p>
                  )}
                  {price && (
                    <p
                      className="text-xs tracking-[0.1em] shrink-0"
                      style={{ color: "#1a1a1a", opacity: 0.6, fontFamily: "'Inter', sans-serif" }}
                    >
                      {price}
                    </p>
                  )}
                </div>
              )}

              {/* Title — genome product name overrides prop title */}
              <h2
                className="text-lg font-medium leading-snug"
                style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}
              >
                {genomeProduct?.name || item.title}
              </h2>

              {/* Color chip */}
              {color && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest uppercase" style={{ color: "#1a1a1a", opacity: 0.5 }}>
                    Color
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "#1a1a1a", opacity: 0.7, fontFamily: "'Inter', sans-serif" }}
                  >
                    {color}
                  </span>
                </div>
              )}

              {/* Size chips */}
              {sizes && sizes.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest uppercase shrink-0" style={{ color: "#1a1a1a", opacity: 0.5 }}>
                    Size
                  </span>
                  <div className="flex gap-1.5">
                    {sizes.map((size) => (
                      <span
                        key={size}
                        className="px-2.5 py-1 text-xs border rounded"
                        style={{
                          color: "#1a1a1a",
                          borderColor: "rgba(26,26,26,0.2)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#1a1a1a", opacity: 0.7, fontFamily: "'Inter', sans-serif" }}
                >
                  {description}
                </p>
              )}

              {/* === SHOP / BOOK / COMING SOON — unified for both sources === */}
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
                        <span>Shop</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </a>
                  ) : (
                    /* Coming Soon + Notify Me — only shown once */
                    <div className="space-y-3">
                      <p
                        className="text-xs tracking-[0.15em] italic text-center py-2"
                        style={{ color: "#1a1a1a", opacity: 0.4, fontFamily: "'Inter', sans-serif" }}
                      >
                        Coming Soon
                      </p>
                      {!notifySubmitted ? (
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="Email for updates"
                            value={notifyEmail}
                            onChange={(e) => setNotifyEmail(e.target.value)}
                            className="flex-1 px-3 py-2.5 text-xs border rounded"
                            style={{
                              borderColor: "rgba(26,26,26,0.2)",
                              color: "#1a1a1a",
                              fontFamily: "'Inter', sans-serif",
                              outline: "none",
                            }}
                            onFocus={(e) => { e.target.style.borderColor = "#1a1a1a"; }}
                            onBlur={(e) => { e.target.style.borderColor = "rgba(26,26,26,0.2)"; }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (notifyEmail.includes("@")) {
                                notifyMutation.mutate(notifyEmail);
                              }
                            }}
                            disabled={notifyMutation.isPending || !notifyEmail.includes("@")}
                            className="px-4 py-2.5 text-xs tracking-[0.1em] uppercase transition-opacity hover:opacity-80 shrink-0"
                            style={{
                              backgroundColor: "#1a1a1a",
                              color: "#ffffff",
                              fontFamily: "'Inter', sans-serif",
                              opacity: notifyMutation.isPending ? 0.5 : 1,
                              borderRadius: "4px",
                            }}
                          >
                            Notify Me
                          </button>
                        </div>
                      ) : (
                        <p
                          className="text-xs text-center py-2 italic"
                          style={{ color: "#1a1a1a", opacity: 0.5, fontFamily: "'Inter', sans-serif" }}
                        >
                          We'll let you know.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {isPlace && (
                <>
                  {item.storyTag === "morocco" ? (
                    <a href="/concierge" className="block">
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#1a1a1a", color: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                      >
                        <span>View Itinerary</span>
                      </button>
                    </a>
                  ) : bookUrl ? (
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
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#1a1a1a", color: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                      >
                        <span>Book</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </a>
                  ) : null}
                </>
              )}

              {/* Book button (separate for products that also have a bookUrl) */}
              {isProduct && bookUrl && (
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
                    style={{
                      backgroundColor: "transparent",
                      color: "#1a1a1a",
                      border: "1px solid #1a1a1a",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <span>Book</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </a>
              )}

              {/* === Save bar — gold when saved === */}
              {fromSuitcase ? (
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
              ) : (
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
              )}

              {/* Destination tag — very subtle */}
              {destinationTag && (
                <p
                  className="text-[10px] tracking-widest uppercase text-center pt-1"
                  style={{ color: "#1a1a1a", opacity: 0.35 }}
                >
                  {destinationTag}
                </p>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
