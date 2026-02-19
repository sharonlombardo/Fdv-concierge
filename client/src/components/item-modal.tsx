import { useQuery } from "@tanstack/react-query";
import { PinButton } from "@/components/pin-button";
import { ExternalLink } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

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

export function ItemModal({ item, open, onOpenChange }: ItemModalProps) {
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
  const imageBg = isProduct ? "bg-[#f5f1e8]" : "bg-stone-200";

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
          className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] rounded-t-2xl bg-[#f5f1e8] shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom data-[state=closed]:duration-300 data-[state=open]:duration-500 focus:outline-none"
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
            <div className="w-10 h-1 rounded-full bg-[#2c2416]/20" />
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
                  <span className="text-[#2c2416]/40 text-sm uppercase tracking-widest">
                    {item.title}
                  </span>
                </div>
              )}

              {/* Pin button overlay — top right of image */}
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
            </div>

            {/* Content area */}
            <div className="px-6 pb-8 pt-5 space-y-4">
              {/* Brand name — small caps, sage */}
              {brand && (
                <p
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{
                    color: "#9ba88d",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {brand}
                </p>
              )}

              {/* Title */}
              <h2
                className="text-xl font-medium leading-snug"
                style={{
                  color: "#2c2416",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {item.title}
              </h2>

              {/* Price — calm, not shouting */}
              {price && (
                <p
                  className="text-sm"
                  style={{ color: "#2c2416", opacity: 0.6 }}
                >
                  {price}
                </p>
              )}

              {/* Atmospheric description */}
              {description && (
                <p
                  className="text-sm leading-relaxed italic"
                  style={{ color: "#2c2416", opacity: 0.7 }}
                >
                  {description}
                </p>
              )}

              {/* Action buttons */}
              {(shopUrl || bookUrl) ? (
                <div className="flex gap-3 pt-2">
                  {shopUrl && (
                    <a
                      href={shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm tracking-wide transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: "#c97d60",
                          color: "#f5f1e8",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <span>Shop{brand ? ` at ${brand}` : ""}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </a>
                  )}
                  {bookUrl && (
                    <a
                      href={bookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm tracking-wide transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: "#6b7456",
                          color: "#f5f1e8",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <span>Book</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </a>
                  )}
                </div>
              ) : brand && (
                <div className="pt-2">
                  <p
                    className="text-xs tracking-[0.15em] uppercase text-center py-3"
                    style={{ color: "#2c2416", opacity: 0.45 }}
                  >
                    Coming Soon
                  </p>
                </div>
              )}

              {/* Bucket label — very subtle, editorial */}
              <p
                className="text-[10px] tracking-widest uppercase text-center pt-2"
                style={{ color: "#2c2416", opacity: 0.35 }}
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
