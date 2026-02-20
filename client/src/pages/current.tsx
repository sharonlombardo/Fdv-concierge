import { useState, useEffect, createContext, useContext } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PinButton } from "@/components/pin-button";
import { SuitcaseButton } from "@/components/suitcase-button";
import { GlobalNav } from "@/components/global-nav";
import { ItemModal, type ItemModalData } from "@/components/item-modal";
import type { EditorialItem } from "@/components/editorial-detail-drawer";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { LoadingImage } from "@/components/loading-image";

type GetImageUrlFn = (assetKey: string) => string;
const ImageContext = createContext<GetImageUrlFn>((key) => "");

function getBucketLabel(bucket: string): string {
  const labelMap: Record<string, string> = {
    "Inspiration": "Inspired",
    "Travel & Experiences": "Travel & Experience",
    "Your Style": "Style",
    "Objects of Desire": "Object of Desire",
    "Daily Rituals": "Ritual",
    "State of Mind": "State of Mind",
    "Culture": "Culture",
  };
  return labelMap[bucket] || bucket;
}

function useGetImageUrl() {
  return useContext(ImageContext);
}

type PinTile = {
  id: string;
  assetKey: string;
  caption: string;
  bucket: string;
  pinType: string;
  imageUrl?: string;
  // Commerce fields (inline editorial curation)
  brand?: string;
  price?: string;
  shopUrl?: string;
  bookUrl?: string;
  title?: string; // Product name override (caption is editorial, title is product name)
};

type PageTurnHeroProps = {
  title: string;
  stateOfMind: string;
  paragraph?: string;
  imageUrl?: string;
  assetKey: string;
  bucket: string;
  pinType: string;
  isOpening?: boolean;
  subhead?: string;
};

type QuoteCardProps = {
  quote: string;
  id: string;
};

type PinGridProps = {
  title: string;
  tiles: PinTile[];
  sourceStory: string;
  onOpenDetail?: (item: EditorialItem) => void;
};

type TwoUpFeatureProps = {
  title: string;
  image1: { assetKey: string; caption: string; bucket: string; pinType: string };
  image2: { assetKey: string; caption: string; bucket: string; pinType: string };
  sourceStory: string;
};

type MotionLoopBlockProps = {
  overlayText: string;
  bucket: string;
  pinType: string;
  id: string;
  sourceStory: string;
  caption?: string;
};

type ClosingLineProps = {
  text: string;
  id: string;
};

type MomentBlockProps = {
  title: string;
  paragraphs: string[];
  assetKey: string;
  bucket: string;
  pinType: string;
  sourceStory: string;
  imagePosition?: "left" | "right";
  bookUrl?: string;
  shopUrl?: string;
};

const NAV_ITEMS = [
  { id: "morocco", label: "Morocco" },
  { id: "hydra", label: "Hydra" },
  { id: "slow-travel", label: "Slow Travel" },
  { id: "retreat", label: "Retreat" },
  { id: "new-york", label: "New York" },
];

function StickyNav({ activeSection }: { activeSection: string }) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fafaf9]/95 dark:bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="overflow-x-auto">
        <div className="flex items-center justify-center gap-6 md:gap-10 py-3 px-6 min-w-max mx-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                activeSection === item.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function PageTurnHero({ title, stateOfMind, paragraph, assetKey, bucket, pinType, isOpening, subhead }: PageTurnHeroProps) {
  const storyTag = assetKey.split('-')[0];
  const getImageUrl = useGetImageUrl();
  const imageUrl = getImageUrl(assetKey);
  
  return (
    <div className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-end" data-testid={`hero-${assetKey}`}>
      <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800">
        {imageUrl ? (
          <LoadingImage
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm uppercase tracking-widest">Image Placeholder</span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute top-4 right-4 z-10">
        <PinButton
          itemType={pinType as any}
          itemId={assetKey}
          itemData={{ 
            title, 
            subtitle: stateOfMind, 
            bucket, 
            sourceStory: title, 
            issueNumber: 1,
            saveType: pinType,
            storyTag,
            editionTag: "current-edition-1",
            editTag: `${storyTag}-edit`,
            assetKey,
            assetUrl: imageUrl
          }}
          sourceContext="the_current_issue_1"
          aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase(), storyTag]}
          size="md"
        />
      </div>
      <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl">
        {isOpening && subhead && (
          <p className="text-white/60 text-sm tracking-widest uppercase mb-2">{subhead}</p>
        )}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium mb-4" data-testid="hero-title">
          {title}
        </h1>
        <p className="text-white/80 text-lg md:text-xl italic mb-4">{stateOfMind}</p>
        {paragraph && (
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
            {paragraph}
          </p>
        )}
      </div>
    </div>
  );
}

function QuoteCard({ quote, id, sourceStory }: QuoteCardProps & { sourceStory?: string }) {
  const storyTag = sourceStory?.toLowerCase().replace(/\s+/g, '-') || 'opening';
  return (
    <div className="py-16 md:py-24 px-8 md:px-16 max-w-3xl mx-auto text-center" data-testid={`quote-${id}`}>
      <div className="relative inline-block">
        <p className="font-serif text-2xl md:text-3xl lg:text-4xl italic leading-relaxed text-foreground/90">
          "{quote}"
        </p>
        <div className="absolute -top-2 -right-8 z-10">
          <PinButton
            itemType="quote"
            itemId={id}
            itemData={{
              title: quote,
              bucket: "State of Mind",
              sourceStory: sourceStory || "The Current",
              issueNumber: 1,
              saveType: "quote",
              storyTag,
              editionTag: "current-edition-1",
              editTag: `${storyTag}-edit`
            }}
            sourceContext="the_current_issue_1"
            aestheticTags={["quote", "state-of-mind", storyTag]}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

function MomentBlock({ title, paragraphs, assetKey, bucket, pinType, sourceStory, imagePosition = "left", bookUrl, shopUrl }: MomentBlockProps) {
  const storyTag = sourceStory.toLowerCase().replace(/\s+/g, '-');
  const getImageUrl = useGetImageUrl();
  const imageUrl = getImageUrl(assetKey);
  
  const imageBlock = (
    <div>
      <div className="relative aspect-[4/5] md:aspect-square bg-stone-200 dark:bg-stone-800 rounded-md overflow-hidden">
      {imageUrl ? (
        <LoadingImage 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">Image Placeholder</span>
        </div>
      )}
      <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-0">
        <PinButton
          itemType={pinType as any}
          itemId={assetKey}
          itemData={{
            title,
            bucket,
            sourceStory,
            issueNumber: 1,
            saveType: pinType,
            storyTag,
            editionTag: "current-edition-1",
            editTag: `${storyTag}-edit`,
            assetKey,
            assetUrl: imageUrl
          }}
          sourceContext="the_current_issue_1"
          aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase(), storyTag]}
          size="sm"
        />
        {(pinType === "product" || pinType === "look" || pinType === "style") && (
          <SuitcaseButton
            itemId={assetKey}
            itemData={{
              title,
              imageUrl: imageUrl,
              storyTag,
              editTag: `${storyTag}-edit`
            }}
            sourceContext="the_current_issue_1"
            aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase(), storyTag]}
            size="sm"
          />
        )}
      </div>
      </div>
      <p className="text-[10px] text-center text-muted-foreground/60 italic mt-2">{getBucketLabel(bucket)}</p>
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center">
      <h3 className="font-serif text-xl md:text-2xl font-medium mb-4">{title}</h3>
      <div className="space-y-4">
        {paragraphs.map((para, idx) => {
          const isBrandLine = para.includes("Coming Soon") || para.includes("Coming soon");
          return (
            <p key={idx} className={`leading-relaxed ${isBrandLine ? "italic text-muted-foreground/70 text-sm" : "text-muted-foreground"}`}>
              {para}
            </p>
          );
        })}
      </div>
      {bookUrl && (
        <p className="mt-4">
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "#6b7456" }}
          >
            Book
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      )}
      {shopUrl && (
        <p className="mt-4">
          <a
            href={shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "#6b7456" }}
          >
            Shop
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      )}
    </div>
  );

  return (
    <div className="py-12 md:py-16 px-4 max-w-5xl mx-auto" data-testid={`moment-${assetKey}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </div>
  );
}

function PinGrid({ title, tiles, sourceStory, onOpenDetail }: PinGridProps) {
  const storyTag = sourceStory.toLowerCase().replace(/\s+/g, '-');
  const getImageUrl = useGetImageUrl();
  
  const handleTileClick = (tile: PinTile) => {
    const imageUrl = getImageUrl(tile.assetKey);
    if (onOpenDetail) {
      onOpenDetail({
        id: tile.id,
        title: tile.title || tile.caption,
        description: tile.caption,
        bucket: tile.bucket,
        pinType: tile.pinType,
        assetKey: tile.assetKey,
        storyTag,
        imageUrl,
        brand: tile.brand,
        price: tile.price,
        shopUrl: tile.shopUrl,
        bookUrl: tile.bookUrl,
      });
    }
  };

  return (
    <div className="py-12 md:py-16 px-4 max-w-5xl mx-auto">
      <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-8 text-center">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {tiles.map((tile) => {
          const imageUrl = getImageUrl(tile.assetKey);
          return (
            <div 
              key={tile.id} 
              className="relative group cursor-pointer" 
              data-testid={`tile-${tile.id}`}
              onClick={() => handleTileClick(tile)}
            >
              <div className="aspect-square bg-stone-200 dark:bg-stone-800 rounded-md overflow-hidden transition-transform group-hover:scale-[1.02]">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={tile.caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-widest text-center px-2">
                      {tile.caption}
                    </span>
                  </div>
                )}
              </div>
            <div className="absolute top-1.5 right-1.5 z-10 flex flex-col items-end gap-0" onClick={(e) => e.stopPropagation()}>
              <PinButton
                itemType={tile.pinType as any}
                itemId={tile.id}
                itemData={{
                  title: tile.caption,
                  bucket: tile.bucket,
                  sourceStory,
                  issueNumber: 1,
                  saveType: tile.pinType,
                  storyTag,
                  editionTag: "current-edition-1",
                  editTag: `${storyTag}-edit`,
                  assetKey: tile.assetKey,
                  assetUrl: imageUrl
                }}
                sourceContext="the_current_issue_1"
                aestheticTags={[tile.bucket.toLowerCase(), tile.pinType.toLowerCase(), storyTag]}
                size="sm"
              />
              {(tile.pinType === "product" || tile.pinType === "look" || tile.pinType === "style" || tile.pinType === "item" || tile.pinType === "object") && (
                <SuitcaseButton
                  itemId={tile.id}
                  itemData={{
                    title: tile.caption,
                    imageUrl: imageUrl,
                    storyTag,
                    editTag: `${storyTag}-edit`
                  }}
                  sourceContext="the_current_issue_1"
                  aestheticTags={[tile.bucket.toLowerCase(), tile.pinType.toLowerCase(), storyTag]}
                  size="sm"
                />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground/60 text-center italic mt-2">{getBucketLabel(tile.bucket)}</p>
          </div>
          );
        })}
      </div>
    </div>
  );
}

type EditorialScrollProps = {
  title: string;
  tiles: PinTile[];
  sourceStory: string;
};

function EditorialScroll({ title, tiles, sourceStory }: EditorialScrollProps) {
  const storyTag = sourceStory.toLowerCase().replace(/\s+/g, '-');
  const getImageUrl = useGetImageUrl();

  // Layout configs per card index: vary sizes and positions for magazine feel
  const layouts: Array<{
    wrapper: string;
    imageClass: string;
    imageAspect: string;
    captionClass: string;
    type: "overlay" | "side" | "stacked";
    imagePosition?: "left" | "right";
  }> = [
    // Card 1: Large hero — full width, tall image, text overlaid at bottom
    { wrapper: "relative", imageClass: "w-full", imageAspect: "aspect-[4/5] md:aspect-[16/10]", captionClass: "absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent", type: "overlay" },
    // Card 2: Small — compact, offset right, text underneath
    { wrapper: "md:ml-auto md:w-[45%]", imageClass: "w-full", imageAspect: "aspect-square", captionClass: "mt-4", type: "stacked" },
    // Card 3: Medium — image left, text right, 50/50
    { wrapper: "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10", imageClass: "", imageAspect: "aspect-[3/4]", captionClass: "", type: "side", imagePosition: "left" },
    // Card 4: Large — full width, tall overlay (not ultra-wide)
    { wrapper: "relative", imageClass: "w-full", imageAspect: "aspect-[4/5] md:aspect-[16/10]", captionClass: "absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent", type: "overlay" },
    // Card 5: Medium — text left, image right
    { wrapper: "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10", imageClass: "", imageAspect: "aspect-[3/4]", captionClass: "", type: "side", imagePosition: "right" },
    // Card 6: Small — compact, offset left, text underneath
    { wrapper: "md:mr-auto md:w-[45%]", imageClass: "w-full", imageAspect: "aspect-[4/5]", captionClass: "mt-4", type: "stacked" },
  ];

  function renderCaption(tile: PinTile, isOverlay: boolean) {
    const textColor = isOverlay ? "text-white/90" : "";
    const textStyle = isOverlay ? {} : { color: "#2c2416", opacity: 0.7 };
    const brandStyle = isOverlay ? { opacity: 0.7 } : { opacity: 0.85 };
    const bucketColor = isOverlay ? "text-white/40" : "";
    const bucketStyle = isOverlay ? {} : { color: "#2c2416", opacity: 0.35 };

    return (
      <div className={`flex flex-col justify-center ${isOverlay ? "" : ""}`}>
        {/* Book link */}
        {tile.bookUrl && (
          <p className="mb-3">
            <a
              href={tile.bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-70 ${isOverlay ? "text-white/80" : ""}`}
              style={isOverlay ? {} : { color: "#6b7456" }}
            >
              Book
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        )}

        {/* Shop link */}
        {tile.shopUrl && (
          <p className="mb-3">
            <a
              href={tile.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-70 ${isOverlay ? "text-white/80" : ""}`}
              style={isOverlay ? {} : { color: "#6b7456" }}
            >
              Shop
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        )}

        {/* Caption — split brand attribution line if present */}
        {(() => {
          if (tile.brand) {
            // Find the brand attribution sentence (contains "by BrandName")
            // It's always the last sentence(s), starting from last ". " before "by Brand"
            const byBrandIdx = tile.caption.lastIndexOf(`by ${tile.brand}`);
            if (byBrandIdx > 0) {
              // Walk back to find the start of the brand sentence
              const beforeBy = tile.caption.substring(0, byBrandIdx);
              const lastPeriodSpace = beforeBy.lastIndexOf(". ");
              if (lastPeriodSpace > 0) {
                const mainText = tile.caption.substring(0, lastPeriodSpace + 1).trim();
                const brandLine = tile.caption.substring(lastPeriodSpace + 2).trim();
                return (
                  <div className={`text-sm leading-relaxed ${textColor}`} style={textStyle}>
                    <p>{mainText}</p>
                    <p className="italic mt-2" style={brandStyle}>{brandLine}</p>
                  </div>
                );
              }
            }
          }
          return (
            <p className={`text-sm leading-relaxed ${textColor}`} style={textStyle}>
              {tile.caption}
            </p>
          );
        })()}

      </div>
    );
  }

  function renderPinButtons(tile: PinTile, imageUrl: string, size: "sm" | "md") {
    return (
      <div className={`absolute ${size === "md" ? "top-4 right-4" : "top-2 right-2"} z-10 flex flex-col items-end gap-0`}>
        <PinButton
          itemType={tile.pinType as any}
          itemId={tile.id}
          itemData={{
            title: tile.caption,
            bucket: tile.bucket,
            sourceStory,
            issueNumber: 1,
            saveType: tile.pinType,
            storyTag,
            editionTag: "current-edition-1",
            editTag: `${storyTag}-edit`,
            assetKey: tile.assetKey,
            assetUrl: imageUrl
          }}
          sourceContext="the_current_issue_1"
          aestheticTags={[tile.bucket.toLowerCase(), tile.pinType.toLowerCase(), storyTag]}
          size={size}
        />
        {(tile.pinType === "look" || tile.pinType === "style" || tile.pinType === "product" || tile.pinType === "item" || tile.pinType === "object") && (
          <SuitcaseButton
            itemId={tile.id}
            itemData={{
              title: tile.caption,
              imageUrl: imageUrl,
              storyTag,
              editTag: `${storyTag}-edit`
            }}
            sourceContext="the_current_issue_1"
            aestheticTags={[tile.bucket.toLowerCase(), tile.pinType.toLowerCase(), storyTag]}
            size={size}
          />
        )}
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16 px-4 max-w-5xl mx-auto">
      <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-10 text-center">{title}</h3>
      <div className="space-y-14 md:space-y-20">
        {tiles.map((tile, index) => {
          const imageUrl = getImageUrl(tile.assetKey);
          const layout = layouts[index] || layouts[2]; // fallback to side layout
          const isOverlay = layout.type === "overlay";
          const btnSize = (layout.type === "overlay") ? "md" as const : "sm" as const;

          if (layout.type === "overlay") {
            return (
              <div key={tile.id} className={layout.wrapper} data-testid={`editorial-${tile.id}`}>
                <div className={`${layout.imageClass} ${layout.imageAspect} bg-stone-200 dark:bg-stone-800 rounded-md overflow-hidden`}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={tile.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-xs uppercase tracking-widest">{tile.caption}</span>
                    </div>
                  )}
                </div>
                {renderPinButtons(tile, imageUrl, btnSize)}
                <div className={layout.captionClass}>
                  {renderCaption(tile, true)}
                </div>
              </div>
            );
          }

          if (layout.type === "stacked") {
            return (
              <div key={tile.id} className={layout.wrapper} data-testid={`editorial-${tile.id}`}>
                <div className="relative group">
                  <div className={`${layout.imageAspect} bg-stone-200 dark:bg-stone-800 rounded-md overflow-hidden`}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={tile.caption} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-xs uppercase tracking-widest">{tile.caption}</span>
                      </div>
                    )}
                  </div>
                  {renderPinButtons(tile, imageUrl, btnSize)}
                </div>
                <div className={layout.captionClass}>
                  {renderCaption(tile, false)}
                </div>
              </div>
            );
          }

          // Side layout
          const imageBlock = (
            <div className="relative group">
              <div className={`${layout.imageAspect} bg-stone-200 dark:bg-stone-800 rounded-md overflow-hidden`}>
                {imageUrl ? (
                  <img src={imageUrl} alt={tile.caption} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-widest">{tile.caption}</span>
                  </div>
                )}
              </div>
              {renderPinButtons(tile, imageUrl, btnSize)}
            </div>
          );

          return (
            <div key={tile.id} className={layout.wrapper} data-testid={`editorial-${tile.id}`}>
              {layout.imagePosition === "left" ? (
                <>
                  {imageBlock}
                  {renderCaption(tile, false)}
                </>
              ) : (
                <>
                  {renderCaption(tile, false)}
                  {imageBlock}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TwoUpFeature({ title, image1, image2, sourceStory }: TwoUpFeatureProps) {
  const storyTag = sourceStory.toLowerCase().replace(/\s+/g, '-');
  const getImageUrl = useGetImageUrl();
  const image1Url = getImageUrl(image1.assetKey);
  const image2Url = getImageUrl(image2.assetKey);
  
  return (
    <div className="py-12 md:py-16 px-4 max-w-5xl mx-auto">
      <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-8 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group" data-testid={`two-up-${image1.assetKey}`}>
          <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800 rounded-md overflow-hidden">
            {image1Url ? (
              <img src={image1Url} alt={image1.caption} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-xs uppercase tracking-widest">{image1.caption}</span>
              </div>
            )}
          </div>
          <div className="absolute top-1.5 right-1.5 z-10 flex flex-col items-end gap-0">
            <PinButton
              itemType={image1.pinType as any}
              itemId={image1.assetKey}
              itemData={{
                title: image1.caption,
                bucket: image1.bucket,
                sourceStory,
                issueNumber: 1,
                saveType: image1.pinType,
                storyTag,
                editionTag: "current-edition-1",
                editTag: `${storyTag}-edit`,
                assetKey: image1.assetKey,
                assetUrl: image1Url
              }}
              sourceContext="the_current_issue_1"
              aestheticTags={[image1.bucket.toLowerCase(), image1.pinType.toLowerCase(), storyTag]}
              size="sm"
            />
            {(image1.pinType === "product" || image1.pinType === "look" || image1.pinType === "style") && (
              <SuitcaseButton
                itemId={image1.assetKey}
                itemData={{
                  title: image1.caption,
                  imageUrl: image1Url,
                  storyTag,
                  editTag: `${storyTag}-edit`
                }}
                sourceContext="the_current_issue_1"
                aestheticTags={[image1.bucket.toLowerCase(), image1.pinType.toLowerCase(), storyTag]}
                size="sm"
              />
            )}
          </div>
          <p className="text-[10px] text-center text-muted-foreground/60 italic mt-3">{getBucketLabel(image1.bucket)}</p>
        </div>
        <div className="relative group" data-testid={`two-up-${image2.assetKey}`}>
          <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800 rounded-md overflow-hidden">
            {image2Url ? (
              <img src={image2Url} alt={image2.caption} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-xs uppercase tracking-widest">{image2.caption}</span>
              </div>
            )}
          </div>
          <div className="absolute top-1.5 right-1.5 z-10 flex flex-col items-end gap-0">
            <PinButton
              itemType={image2.pinType as any}
              itemId={image2.assetKey}
              itemData={{
                title: image2.caption,
                bucket: image2.bucket,
                sourceStory,
                issueNumber: 1,
                saveType: image2.pinType,
                storyTag,
                editionTag: "current-edition-1",
                editTag: `${storyTag}-edit`,
                assetKey: image2.assetKey,
                assetUrl: image2Url
              }}
              sourceContext="the_current_issue_1"
              aestheticTags={[image2.bucket.toLowerCase(), image2.pinType.toLowerCase(), storyTag]}
              size="sm"
            />
            {(image2.pinType === "product" || image2.pinType === "look" || image2.pinType === "style") && (
              <SuitcaseButton
                itemId={image2.assetKey}
                itemData={{
                  title: image2.caption,
                  imageUrl: image2Url,
                  storyTag,
                  editTag: `${storyTag}-edit`
                }}
                sourceContext="the_current_issue_1"
                aestheticTags={[image2.bucket.toLowerCase(), image2.pinType.toLowerCase(), storyTag]}
                size="sm"
              />
            )}
          </div>
          <p className="text-[10px] text-center text-muted-foreground/60 italic mt-3">{getBucketLabel(image2.bucket)}</p>
        </div>
      </div>
    </div>
  );
}

function MotionLoopBlock({ overlayText, bucket, pinType, id, sourceStory, caption }: MotionLoopBlockProps) {
  const storyTag = sourceStory.toLowerCase().replace(/\s+/g, '-');
  const getImageUrl = useGetImageUrl();
  const imageUrl = getImageUrl(id);
  
  return (
    <div className="py-12 md:py-16 px-4 max-w-4xl mx-auto">
      <div className="relative aspect-video bg-stone-300 dark:bg-stone-700 rounded-md overflow-hidden" data-testid={`motion-${id}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={overlayText} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground text-sm uppercase tracking-widest">Video Placeholder</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <p className="font-serif text-2xl md:text-3xl text-white italic text-center px-8">{overlayText}</p>
        </div>
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-0">
          <PinButton
            itemType={pinType as any}
            itemId={id}
            itemData={{ 
              title: overlayText, 
              bucket, 
              sourceStory, 
              issueNumber: 1,
              saveType: pinType,
              storyTag,
              editionTag: "current-edition-1",
              editTag: `${storyTag}-edit`,
              assetKey: id,
              assetUrl: imageUrl
            }}
            sourceContext="the_current_issue_1"
            aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase(), storyTag]}
            size="md"
          />
          {(pinType === "product" || pinType === "look" || pinType === "style") && (
            <SuitcaseButton
              itemId={id}
              itemData={{
                title: overlayText,
                imageUrl: imageUrl || "",
                storyTag,
                editTag: `${storyTag}-edit`
              }}
              sourceContext="the_current_issue_1"
              aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase(), storyTag]}
              size="md"
            />
          )}
        </div>
      </div>
      {caption && (
        <div className="mt-6 max-w-2xl mx-auto">
          {(() => {
            const comingSoonIdx = caption.indexOf("Coming soon.");
            if (comingSoonIdx > 0) {
              const mainText = caption.substring(0, comingSoonIdx).trimEnd();
              const brandLine = caption.substring(comingSoonIdx - (caption.substring(0, comingSoonIdx).lastIndexOf(". ") > -1 ? comingSoonIdx - caption.substring(0, comingSoonIdx).lastIndexOf(". ") - 2 : 0));
              // Split at last period before "Coming soon"
              const lastPeriodBeforeBrand = mainText.lastIndexOf(". ");
              const descText = lastPeriodBeforeBrand > 0 ? mainText.substring(0, lastPeriodBeforeBrand + 1) : mainText;
              const brandPart = lastPeriodBeforeBrand > 0 ? mainText.substring(lastPeriodBeforeBrand + 2) + " Coming soon." : "Coming soon.";
              return (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed">{descText}</p>
                  <p className="text-sm italic text-muted-foreground/70 mt-2">{brandPart}</p>
                </>
              );
            }
            return <p className="text-sm text-muted-foreground leading-relaxed">{caption}</p>;
          })()}
        </div>
      )}
    </div>
  );
}

function ClosingLine({ text, id, sourceStory }: ClosingLineProps & { sourceStory?: string }) {
  const storyTag = sourceStory?.toLowerCase().replace(/\s+/g, '-') || 'opening';
  return (
    <div className="py-12 md:py-16 px-8 max-w-2xl mx-auto text-center" data-testid={`closing-${id}`}>
      <div className="relative inline-block">
        <p className="text-sm md:text-base text-muted-foreground italic">{text}</p>
        <div className="absolute -top-1 -right-6 z-10">
          <PinButton
            itemType="quote"
            itemId={id}
            itemData={{
              title: text,
              bucket: "State of Mind",
              sourceStory: sourceStory || "The Current",
              issueNumber: 1,
              saveType: "quote",
              storyTag,
              editionTag: "current-edition-1",
              editTag: `${storyTag}-edit`
            }}
            sourceContext="the_current_issue_1"
            aestheticTags={["quote", "closing", "state-of-mind", storyTag]}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

function StoryDivider() {
  return <div className="h-px bg-border/50 max-w-xs mx-auto my-8" />;
}

export default function CurrentFeed({ embedded = false }: { embedded?: boolean }) {
  const [activeSection, setActiveSection] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: imageSlotsData } = useImageSlots();

  const handleOpenDetail = (item: EditorialItem) => {
    setSelectedItem({
      ...item,
    });
    setDrawerOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <ImageContext.Provider value={getImageUrl}>
    <div className={embedded ? "" : "min-h-screen bg-[#fafaf9] dark:bg-background"}>
      <ItemModal
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
      {!embedded && (
        <>
          <GlobalNav />
          <header className="text-center py-8 md:py-12 px-4">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2" data-testid="text-current-title">
              THE CURRENT
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-1" data-testid="text-current-issue">
              Issue 1
            </p>
            <p className="text-sm text-muted-foreground tracking-widest uppercase">
              Discover what resonates
            </p>
          </header>
        </>
      )}

      <PageTurnHero
        title="THE CURRENT"
        subhead="Issue 1"
        stateOfMind="A magazine of taste, memory, and places"
        assetKey="opening-cover"
        bucket="Inspiration"
        pinType="mood"
        isOpening
      />

      <StoryDivider />

      {/* MOROCCO */}
      <section id="morocco">
        <PageTurnHero
          title="Morocco, In Full Color"
          stateOfMind="Pattern, Pleasure, Warmth and light."
          paragraph="Marrakech isn't subtle. The walls are terracotta, the tiles are mint and emerald, the air carries orange blossom and dust at the same time. Everything feels saturated — heat, pigment, scent, light. And yet it never feels chaotic. The color lives inside structure: carved cedar doors, tiled courtyards, long stone corridors, desert symmetry. It's maximal — but disciplined. Ancient materials, bold contrast, and silhouettes that hold their own. That tension is what makes it unforgettable."
          assetKey="morocco-hero"
          bucket="Travel & Experiences"
          pinType="place"
        />

        <QuoteCard quote="Beauty doesn't whisper here. It invites." id="morocco-quote-1" sourceStory="Morocco" />

        <MomentBlock
          title="Dressing into the scene"
          paragraphs={[
            "Amanjena, just outside Marrakech.",
            "Desert-toned walls, long shadows, stillness. A black bathing suit against all that sand and clay feels moody and intentional — like ink dropped into sun.",
            "Swimwear by Yves Saint Laurent. Coming Soon."
          ]}
          assetKey="morocco-style-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Morocco"
          imagePosition="left"
        />

        <MomentBlock
          title="The visual pleasure"
          paragraphs={[
            "El Fenn Hotel. Graphic tile, citrus trees overhead.",
            "Pattern here is rhythmic."
          ]}
          assetKey="morocco-texture-1"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Morocco"
          imagePosition="right"
        />

        <EditorialScroll
          title="Pattern and Pleasure"
          sourceStory="Morocco"
          tiles={[
            { id: "morocco-1", assetKey: "morocco-tile-1", caption: "Amanjena, Marrakech. Terracotta heat. Crisp black cotton. The contrast is the point. Gaia Dress by Phoebe Philo — Coming Soon", bucket: "Your Style", pinType: "look", title: "Gaia Dress", brand: "Phoebe Philo" },
            { id: "morocco-2", assetKey: "morocco-tile-2", caption: "Glossy mint tile, carved plaster, filtered light. The kind of green that feels completely natural and completely surreal at the same time.", bucket: "Travel & Experiences", pinType: "place" },
            { id: "morocco-3", assetKey: "morocco-tile-3", caption: "Blush pink against sun-warmed clay. Soft, but never sweet. The color almost disappears into the earth — and that's the beauty of it. Look by Alaïa — Coming Soon", bucket: "Your Style", pinType: "look", brand: "Alaïa" },
            { id: "morocco-4", assetKey: "morocco-tile-4", caption: "El Fenn. Layered ruby red, saffron, emerald, tile, velvet. It's saturated and fearless, but somehow still composed.", bucket: "Travel & Experiences", pinType: "place", bookUrl: "https://el-fenn.com/" },
            { id: "morocco-5", assetKey: "morocco-tile-5", caption: "Black against warm limestone — a long, clean silhouette moving through arches. The dress absorbs the light instead of competing with it. Dress by FIL DE VIE — Coming Soon", bucket: "Your Style", pinType: "look", brand: "Fil de Vie" },
            { id: "morocco-6", assetKey: "morocco-tile-6", caption: "Orange blossom in bloom. That faint citrus-sweet scent in the air — orange blossom drifting through the heat. Color everywhere, but the fragrance is what lingers.", bucket: "Travel & Experiences", pinType: "place" },
          ]}
        />

        <MomentBlock
          title="What travels well here"
          paragraphs={[
            "Choose pieces that feel intentional, not precious. A simple black column dress, a sandal you can walk up the stairs in. A bag to throw over your shoulder. Jewelry that feels like armor.",
            "Dress by FIL DE VIE. Coming soon."
          ]}
          assetKey="morocco-object-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Morocco"
          imagePosition="left"
        />

        <MomentBlock
          title="SHADES OF NEUTRAL"
          paragraphs={[
            "Terracotta walls, late afternoon sunlight on a single plane of red clay.",
            "You start noticing how many shades of 'neutral' exist here."
          ]}
          assetKey="morocco-experience-1"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Morocco"
          imagePosition="right"
        />

        <MotionLoopBlock
          overlayText="Pattern moving in heat"
          bucket="Your Style"
          pinType="style"
          id="morocco-motion-1"
          sourceStory="Morocco"
          caption="El Fenn. A flash of red against layered tile. Pattern on pattern — and then that one bold interruption. Dress by FIL DE VIE. Coming soon."
        />

        <MomentBlock
          title="EVENINGS DONE PROPERLY"
          paragraphs={[
            "El Fenn. Gold light pooling over stone and olive branches. At night the color softens, but it never disappears."
          ]}
          assetKey="morocco-ritual-1"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Morocco"
          imagePosition="left"
          bookUrl="https://el-fenn.com/"
        />

        <ClosingLine text="Save what delights you. You'll want to see it again." id="morocco-closing" sourceStory="Morocco" />
      </section>

      <StoryDivider />

      {/* HYDRA */}
      <section id="hydra">
        {/* #1 — HERO */}
        <PageTurnHero
          title="The Art of Arrival"
          stateOfMind="White stone. Salt water. Nothing extra."
          paragraph="There are no cars waiting. No rush to check in. You step off the ferry and the island lowers the volume for you."
          assetKey="hydra-hero"
          bucket="Travel & Experiences"
          pinType="place"
        />

        {/* QUOTE */}
        <QuoteCard quote="Salt air first. Everything else after." id="hydra-quote-1" sourceStory="Hydra" />

        {/* #2 — MomentBlock: Dressing for Stillness */}
        <MomentBlock
          title="Dressing for Stillness"
          paragraphs={[
            "Hydra.",
            "Hydra favors restraint. Clean lines, bare ankles, nothing that competes with light. A black column against white plaster. Linen that creases intentionally. You dress once here and repeat it with confidence. The discipline is the luxury.",
            "Look by Yves Saint Laurent — Coming Soon"
          ]}
          assetKey="hydra-style-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Hydra"
          imagePosition="left"
        />

        {/* #3 — MomentBlock: Stone, Water, Skin */}
        <MomentBlock
          title="Stone, Water, Skin"
          paragraphs={[
            "Hydra port.",
            "Everything important here is elemental. Stone underfoot. Salt on skin. Light moving slowly across a wall. There is no decoration — only composition."
          ]}
          assetKey="hydra-texture-1"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Hydra"
          imagePosition="right"
        />

        {/* #4–9 — EditorialScroll: 6 varied magazine-style cards */}
        <EditorialScroll
          title="Essentials Only"
          sourceStory="Hydra"
          tiles={[
            { id: "hydra-4", assetKey: "hydra-tile-1", caption: "Wind off the harbor, oversized tailoring thrown over bare skin. Hydra makes even structure feel relaxed. Shirt by Jil Sander. Coming Soon.", bucket: "Your Style", pinType: "style", brand: "Jil Sander" },
            { id: "hydra-5", assetKey: "hydra-tile-2", caption: "Port-side, midday. Shutters, stone, a table for one. Hydra doesn't ask you to perform leisure — it just happens.", bucket: "Travel & Experiences", pinType: "place" },
            { id: "hydra-6", assetKey: "hydra-tile-3", caption: "White against deeper blue. Fabric moving in the breeze. It's less about the outfit and more about how it catches air. Look by Jil Sander. Coming Soon.", bucket: "Your Style", pinType: "style", brand: "Jil Sander" },
            { id: "hydra-7", assetKey: "hydra-tile-4", caption: "Stone stacked into cliff. No symmetry, just instinct and time. Hydra feels built by hand.", bucket: "Travel & Experiences", pinType: "place" },
            { id: "hydra-8", assetKey: "hydra-tile-5", caption: "Black swimwear against chalk-white stone. Clean and unfussy. Swimwear by Eres.", bucket: "Your Style", pinType: "style", brand: "Eres", shopUrl: "https://www.eresparis.com/us/en-US/swimwear-2/011401-3333.html" },
            { id: "hydra-9", assetKey: "hydra-tile-6", caption: "Water so clear it feels architectural. You see every movement, every ripple.", bucket: "Travel & Experiences", pinType: "place" },
          ]}
        />

        {/* Section header: LIGHT AND WATER */}
        <div className="py-12 md:py-16 px-8 max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide uppercase" style={{ color: "#2c2416", opacity: 0.6 }}>Light and Water</h2>
        </div>

        {/* #10 — MomentBlock: What Belongs */}
        <MomentBlock
          title="What Belongs"
          paragraphs={[
            "Bring objects that disappear when worn. A sandal you forget you're wearing. A shirt that flies in the wind. A bag that holds only what's necessary. Hydra edits for you if you let it.",
            "Blouse by Phoebe Philo. Coming soon."
          ]}
          assetKey="hydra-object-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Hydra"
          imagePosition="left"
        />

        {/* #11 — MomentBlock: place */}
        <MomentBlock
          title="Light and Water"
          paragraphs={[
            "Harbor below, stone house above, sea wrapping everything. The palette never tries too hard — blue, white, sun."
          ]}
          assetKey="hydra-light-1"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Hydra"
          imagePosition="right"
        />

        {/* #12 — MomentBlock: Eres swimwear with Shop link */}
        <MomentBlock
          title="Afternoon Swim"
          paragraphs={[
            "Salt, sun, then immersion. Nothing feels more right here than disappearing into water. Swimwear by Eres."
          ]}
          assetKey="hydra-light-2"
          bucket="Your Style"
          pinType="style"
          sourceStory="Hydra"
          imagePosition="left"
          shopUrl="https://www.eresparis.com/us/en-US/swimwear-2/011401-3333.html"
        />

        {/* #13 — MomentBlock: The Daily Flow */}
        <MomentBlock
          title="The Daily Flow"
          paragraphs={[
            "Morning is for water. Midday belongs to shade, conversation and a glass of cold wine. Evening arrives without ceremony. You do less, you feel more.",
            "Look by Dries Van Noten. Coming soon."
          ]}
          assetKey="hydra-ritual-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Hydra"
          imagePosition="right"
        />

        <ClosingLine text="Save what steadies you. Return when you need it." id="hydra-closing" sourceStory="Hydra" />
      </section>

      <StoryDivider />

      {/* SPAIN */}
      <section id="slow-travel">
        {/* #1 — HERO */}
        <PageTurnHero
          title="Stay a Little Longer"
          stateOfMind="Black against stone. Skin warmed by late afternoon."
          paragraph="Spain isn't about urgency — it's about letting the day stretch."
          assetKey="slow-travel-hero"
          bucket="Travel & Experiences"
          pinType="place"
        />

        {/* QUOTE */}
        <QuoteCard quote="The point isn't to see more. It's to stay longer with what feels right." id="slow-travel-quote-1" sourceStory="Spain" />

        {/* #2 — MomentBlock: Editing as Intelligence */}
        <MomentBlock
          title="Editing as Intelligence"
          paragraphs={[
            "Bare shoulders. A single cuff. Clean lines that don't compete with light. Spain rewards restraint — even in heat.",
            "Cuff by Phoebe Philo. Coming Soon."
          ]}
          assetKey="slow-culture-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Spain"
          imagePosition="left"
        />

        {/* #3 — MomentBlock: Stone & Horizon */}
        <MomentBlock
          title="Stone & Horizon"
          paragraphs={[
            "Vertical cliff, striped umbrella, sea moving slowly below. The landscape feels elemental, almost graphic."
          ]}
          assetKey="slow-lunch"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Spain"
          imagePosition="right"
        />

        {/* #4 — MomentBlock: Black swim against pale water */}
        <MomentBlock
          title="Sharp Silhouette"
          paragraphs={[
            "Black swim against pale water and tree shade. The silhouette stays sharp, even when everything else is soft.",
            "Swimwear by FIL DE VIE. Coming soon."
          ]}
          assetKey="slow-museum"
          bucket="Your Style"
          pinType="style"
          sourceStory="Spain"
          imagePosition="left"
        />

        {/* #5 — MomentBlock: Open water, Loro Piana */}
        <MomentBlock
          title="Expansive"
          paragraphs={[
            "Open water. No soundtrack but wind and distant boats. Spain feels expansive without trying.",
            "Look by Loro Piana. Coming soon."
          ]}
          assetKey="slow-tile-2"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Spain"
          imagePosition="right"
        />

        {/* Section header: EDITING IS INTELLIGENCE */}
        <div className="py-12 md:py-16 px-8 max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide uppercase" style={{ color: "#2c2416", opacity: 0.6 }}>Editing is Intelligence</h2>
        </div>

        {/* #6–11 — EditorialScroll: 6 varied magazine-style cards */}
        <EditorialScroll
          title="Editing is Intelligence"
          sourceStory="Spain"
          tiles={[
            { id: "spain-6", assetKey: "slow-tile-1", caption: "Minimal swim, clean cut, nothing ornamental. The body becomes part of the landscape. Sweater by Phoebe Philo.", bucket: "Your Style", pinType: "style", brand: "Phoebe Philo" },
            { id: "spain-7", assetKey: "slow-style-1", caption: "A path carved through stone toward the sea. You walk slower without deciding to. Dress by FIL DE VIE. Coming soon.", bucket: "Travel & Experiences", pinType: "place", brand: "FIL DE VIE" },
            { id: "spain-8", assetKey: "slow-tile-3", caption: "Salt hair, narrow deck, strong sun. Pieces that hold their shape against wind matter here. Swimwear by Eres. Coming soon.", bucket: "Your Style", pinType: "style", brand: "Eres" },
            { id: "spain-9", assetKey: "slow-tile-4", caption: "Heat. Salt. Open sea.", bucket: "Travel & Experiences", pinType: "place" },
            { id: "spain-10", assetKey: "slow-tile-5", caption: "Dark lenses against white sky. The light is unforgiving here — the accessories shouldn't be. Sunglasses by Phoebe Philo.", bucket: "Your Style", pinType: "style", brand: "Phoebe Philo", shopUrl: "https://us.phoebephilo.com/products/bombe-sunglasses-fume-acetate" },
            { id: "spain-11", assetKey: "slow-tile-6", caption: "A cove tucked into rock. Shade feels earned. Water feels earned.", bucket: "Travel & Experiences", pinType: "place" },
          ]}
        />

        {/* Section header: REPEAT WITH INTENTION */}
        <div className="py-12 md:py-16 px-8 max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide uppercase" style={{ color: "#2c2416", opacity: 0.6 }}>Repeat with Intention</h2>
        </div>

        {/* #12 — MomentBlock: RayBan sunglasses with Shop link */}
        <MomentBlock
          title="Gold at the Waterline"
          paragraphs={[
            "Gold at the waterline. Sun, salt, skin. That's enough.",
            "Sunglasses by RayBan."
          ]}
          assetKey="slow-object-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Spain"
          imagePosition="left"
          shopUrl="https://www.ray-ban.com/usa/sunglasses/RB4940wayfarer%20puffer-black/8056262910863"
        />

        {/* #13 — MomentBlock: style */}
        <MomentBlock
          title="Late Afternoon"
          paragraphs={[
            "Late afternoon. Linen, sunglasses, a glass in hand. Spain doesn't perform — it lingers."
          ]}
          assetKey="slow-ritual-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Spain"
          imagePosition="right"
        />

        <ClosingLine text="Save what you want. Let go of the rest." id="slow-travel-closing" sourceStory="Spain" />
      </section>

      <StoryDivider />

      {/* RETREAT */}
      <section id="retreat">
        <PageTurnHero
          title="Into the Desert"
          stateOfMind="A serene sanctuary with modernist lines."
          paragraph="Dust-pink walls. Open corridors. A pool that mirrors the sky. This isn't a resort — it's a recalibration. The desert strips things back. What remains is deliberate."
          assetKey="retreat-hero"
          bucket="Travel & Experiences"
          pinType="place"
        />

        <QuoteCard quote="A serene sanctuary with modernist lines." id="retreat-quote-1" sourceStory="Retreat" />

        <MomentBlock
          title="Sandstone and Sky"
          paragraphs={[
            "Sandstone and sky. The quiet hits first. Then the architecture. Clean geometry against open desert — nothing competes."
          ]}
          assetKey="retreat-ritual-1"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Retreat"
          imagePosition="left"
        />

        <MomentBlock
          title="Morning Ritual"
          paragraphs={[
            "Early yoga. Morning swim. The light is already warm by 7 a.m. Movement here isn't scheduled — it's instinctive."
          ]}
          assetKey="retreat-motion-1"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Retreat"
          imagePosition="right"
        />

        <MomentBlock
          title="Carved Into Rock"
          paragraphs={[
            "A pool carved straight into the rock. Water, stone, sky — nothing else. The palette is the landscape."
          ]}
          assetKey="retreat-place-1"
          bucket="Travel & Experiences"
          pinType="place"
          sourceStory="Retreat"
          imagePosition="left"
        />

        <EditorialScroll
          title="Desert Essentials"
          sourceStory="Retreat"
          tiles={[
            { id: "retreat-1", assetKey: "retreat-tile-1", caption: "A room that opens onto rock and sky. Bare walls. Nothing competing with the view. Look by The Row. Coming soon.", bucket: "Your Style", pinType: "style", brand: "The Row" },
            { id: "retreat-2", assetKey: "retreat-tile-2", caption: "Clean lines. Technical fabric. Modern pieces that make sense against ancient land. Look by Fear Of God. Coming soon.", bucket: "Your Style", pinType: "style", brand: "Fear Of God" },
            { id: "retreat-3", assetKey: "retreat-tile-3", caption: "Late afternoon, stretched out in the sun. The desert has a way of softening you. Cashmere set by Phoebe Philo. Coming soon.", bucket: "Your Style", pinType: "style", brand: "Phoebe Philo" },
            { id: "retreat-4", assetKey: "retreat-tile-4", caption: "Warm stone. Soft light. The kind of quiet you don't rush. Look by Aimé Leon Dore. Coming soon.", bucket: "Your Style", pinType: "style", brand: "Aimé Leon Dore" },
            { id: "retreat-5", assetKey: "retreat-tile-5", caption: "Red rock and still water. Everything blends. Nothing shouts.", bucket: "Travel & Experiences", pinType: "place" },
            { id: "retreat-6", assetKey: "retreat-tile-6", caption: "A long dark line against open desert. Simple. Strong. Enough. Look by Jil Sander. Coming soon.", bucket: "Your Style", pinType: "style", brand: "Jil Sander" },
          ]}
        />

        <MomentBlock
          title="Midday Settles In"
          paragraphs={[
            "Midday settles in. Shade becomes the luxury.",
            "Swimwear by Eres. Coming soon."
          ]}
          assetKey="retreat-object-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Retreat"
          imagePosition="left"
        />

        <MomentBlock
          title="Inside, Cool Stone"
          paragraphs={[
            "Inside, cool stone. Outside, endless heat. That edge between the two is the whole mood.",
            "Look by Fear Of God. Coming soon."
          ]}
          assetKey="retreat-style-1"
          bucket="Your Style"
          pinType="style"
          sourceStory="Retreat"
          imagePosition="right"
        />

        <ClosingLine text="Keep what you want to remember." id="retreat-closing" sourceStory="Retreat" />
      </section>

      <StoryDivider />

      {/* NEW YORK */}
      <section id="new-york">
        <PageTurnHero
          title="The Weekend That Holds"
          stateOfMind="Containment, appetite, and momentum."
          paragraph="New York doesn't slow down for you. You learn how to move inside it. The rhythm is relentless, but it holds you if you let it. This is how the weekend sustains."
          assetKey="newyork-hero"
          bucket="Culture"
          pinType="place"
        />

        <QuoteCard quote="New York isn't conquered. It's edited." id="newyork-quote-1" sourceStory="New York" />

        <MomentBlock
          title="Dressing for the city's pace"
          paragraphs={[
            "New York dressing is about stamina. Clothes that hold their shape at midnight. Shoes you can stand in. A coat that finishes the sentence.",
            "Black works here. So does bone, charcoal, deep brown.",
            "Nothing precious. Everything intentional."
          ]}
          assetKey="newyork-style-1"
          bucket="Your Style"
          pinType="look"
          sourceStory="New York"
          imagePosition="left"
        />

        <MomentBlock
          title="Choosing where to look"
          paragraphs={[
            "You don't rush culture in this city. You let it meet you.",
            "One exhibition. One room you stay in longer than planned. A moment where time loosens its grip.",
            "New York gives generously — if you don't ask for everything."
          ]}
          assetKey="newyork-culture-1"
          bucket="Culture"
          pinType="culture"
          sourceStory="New York"
          imagePosition="right"
        />

        <PinGrid
          title="Night Plan"
          sourceStory="New York"
          tiles={[
            { id: "ny-1", assetKey: "ny-tile-1", caption: "Bar interior", bucket: "Travel & Experiences", pinType: "experience" },
            { id: "ny-2", assetKey: "ny-tile-2", caption: "Dinner table", bucket: "Travel & Experiences", pinType: "experience" },
            { id: "ny-3", assetKey: "ny-tile-3", caption: "Gallery wall", bucket: "Culture", pinType: "place" },
            { id: "ny-4", assetKey: "ny-tile-4", caption: "Coat look", bucket: "Your Style", pinType: "look", title: "Wool Overcoat", brand: "Totême", price: "$890", shopUrl: "https://www.toteme-studio.com" },
            { id: "ny-5", assetKey: "ny-tile-5", caption: "Boot or flat", bucket: "Objects of Desire", pinType: "item", title: "Pointed Leather Flat", brand: "Aeyde", price: "$345", shopUrl: "https://www.aeyde.com" },
            { id: "ny-6", assetKey: "ny-tile-6", caption: "Subway platform", bucket: "Inspiration", pinType: "inspiration" },
          ]}
          onOpenDetail={handleOpenDetail}
        />

        <MomentBlock
          title="Evenings done well"
          paragraphs={[
            "The best nights are edited. A bar that understands lighting. A table that doesn't turn. A meal that unfolds slowly.",
            "You don't need to know everyone. You just need to be exactly where you are."
          ]}
          assetKey="newyork-experience-1"
          bucket="Travel & Experiences"
          pinType="experience"
          sourceStory="New York"
          imagePosition="left"
        />

        <TwoUpFeature
          title="Culture Hour"
          image1={{ assetKey: "ny-culture-1", caption: "Museum stair", bucket: "Culture", pinType: "place" }}
          image2={{ assetKey: "ny-culture-2", caption: "Gallery quiet room", bucket: "Culture", pinType: "place" }}
          sourceStory="New York"
        />

        <MomentBlock
          title="What carries the weekend"
          paragraphs={[
            "A bag that stays close. Sunglasses for the morning after. One piece of jewelry that works everywhere.",
            "New York asks for objects that keep up — not slow you down."
          ]}
          assetKey="newyork-object-1"
          bucket="Objects of Desire"
          pinType="object"
          sourceStory="New York"
          imagePosition="right"
        />

        <PinGrid
          title="Sunday Reset"
          sourceStory="New York"
          tiles={[
            { id: "ny-reset-1", assetKey: "ny-reset-1", caption: "Coffee walk", bucket: "Daily Rituals", pinType: "ritual" },
            { id: "ny-reset-2", assetKey: "ny-reset-2", caption: "Notebook", bucket: "Objects of Desire", pinType: "object", title: "Panama Notebook", brand: "Smythson", price: "$125", shopUrl: "https://www.smythson.com" },
            { id: "ny-reset-3", assetKey: "ny-reset-3", caption: "Sunglasses", bucket: "Objects of Desire", pinType: "item", title: "Triomphe Sunglasses", brand: "Celine", price: "$450", shopUrl: "https://www.celine.com" },
            { id: "ny-reset-4", assetKey: "ny-reset-4", caption: "Empty street morning", bucket: "Inspiration", pinType: "mood" },
          ]}
          onOpenDetail={handleOpenDetail}
        />

        <MomentBlock
          title="Sunday containment"
          paragraphs={[
            "Sunday is for walking. No destination. No performance.",
            "Coffee in hand. Coat open. The city exhales with you.",
            "This is how you stay."
          ]}
          assetKey="newyork-ritual-1"
          bucket="Daily Rituals"
          pinType="ritual"
          sourceStory="New York"
          imagePosition="left"
        />

        <ClosingLine text="Save what sustains you. You'll need it again next week." id="newyork-closing" sourceStory="New York" />
      </section>

      <div className="py-20 text-center">
        <p className="text-xs tracking-widest uppercase text-muted-foreground">End of Issue 1</p>
      </div>
    </div>
    </ImageContext.Provider>
  );
}
