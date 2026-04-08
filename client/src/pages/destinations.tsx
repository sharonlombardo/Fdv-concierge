import { useRef, useState, useEffect, useCallback } from "react";
import { DESTINATIONS } from "@shared/destinations";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { Link } from "wouter";
import { PinButton } from "@/components/pin-button";

const SLIDE_WIDTH_PERCENT = 68; // % of viewport — ~16% peek each side
const GAP = 3; // px between slides — thin sliver like Zara

export default function Destinations() {
  const { data: imageSlotsData } = useImageSlots();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getImageUrl = (assetKey: string): string => {
    if (imageSlotsData?.slots) {
      const slot = imageSlotsData.slots.find((s: any) => s.key === assetKey);
      if (slot?.currentUrl) return slot.currentUrl;
    }
    const defaultSlot = IMAGE_SLOTS.find((s: any) => s.key === assetKey);
    return defaultSlot?.defaultUrl || "";
  };

  // Compute slide width in px
  const getSlideWidth = useCallback(() => {
    return (window.innerWidth * SLIDE_WIDTH_PERCENT) / 100;
  }, []);

  // Track which slide is active via scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const slideWidth = getSlideWidth() + GAP;
      const index = Math.round(el.scrollLeft / slideWidth);
      setActiveIndex(Math.max(0, Math.min(index, DESTINATIONS.length - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [getSlideWidth]);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = getSlideWidth() + GAP;
    el.scrollTo({ left: index * slideWidth, behavior: "smooth" });
  }, [getSlideWidth]);

  const goNext = () => {
    scrollTo(activeIndex < DESTINATIONS.length - 1 ? activeIndex + 1 : 0);
  };
  const goPrev = () => {
    scrollTo(activeIndex > 0 ? activeIndex - 1 : DESTINATIONS.length - 1);
  };

  // Side padding so first/last slides center with peek space
  const sidePadding = `${(100 - SLIDE_WIDTH_PERCENT) / 2}vw`;

  return (
    <div
      className="fixed inset-0 bg-black"
      style={{ bottom: "calc(60px + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Horizontal scroll-snap container */}
      <div
        ref={scrollRef}
        className="flex items-stretch w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          gap: GAP,
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
        }}
      >
        {DESTINATIONS.map((dest) => {
          const imageUrl = getImageUrl(dest.imageSlotKey) || dest.defaultImage;
          return (
            <div
              key={dest.slug}
              className="relative flex-shrink-0 snap-center rounded-2xl overflow-hidden"
              style={{
                width: `${SLIDE_WIDTH_PERCENT}vw`,
                height: "100%",
              }}
            >
              {/* Full-bleed background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${imageUrl}')`,
                  filter: dest.available ? "none" : "saturate(0.7)",
                }}
              />

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: dest.available
                    ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.05) 70%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.15) 70%)",
                }}
              />

              {/* Pin button — top right */}
              <div className="absolute top-4 right-4 z-10">
                <PinButton
                  itemType="trip"
                  itemId={`trip-${dest.slug}`}
                  itemData={{
                    title: dest.title,
                    imageUrl: imageUrl,
                    description: dest.summary,
                    storyTag: dest.slug,
                    bucket: "my-trips",
                  }}
                  sourceContext="destinations_carousel"
                  aestheticTags={["trip", "travel", dest.slug]}
                  size="md"
                />
              </div>

              {/* Content — bottom center */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-8 pb-14">
                {/* LIVE badge for available destinations */}
                {dest.available && (
                  <span
                    className="mb-4 px-3 py-1 text-[10px] tracking-[0.2em] uppercase rounded-full"
                    style={{
                      border: "1px solid rgba(245,240,235,0.5)",
                      color: "#F5F0EB",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Guide
                  </span>
                )}

                {/* Destination name */}
                <h2
                  className="text-center mb-3"
                  style={{
                    fontFamily: "Lora, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(2.5rem, 8vw, 4rem)",
                    fontWeight: 500,
                    color: "#ffffff",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.1,
                  }}
                >
                  {dest.title}
                </h2>

                {/* One-liner */}
                <p
                  className="text-center max-w-sm mb-8"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#F5F0EB",
                    opacity: 0.85,
                  }}
                >
                  {dest.summary}
                </p>

                {/* CTA */}
                {dest.available ? (
                  <Link href={dest.route}>
                    <button
                      className="px-8 py-3 text-xs tracking-[0.2em] uppercase rounded-full transition-opacity hover:opacity-80"
                      style={{
                        border: "1px solid #F5F0EB",
                        color: "#F5F0EB",
                        backgroundColor: "transparent",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      View Guide
                    </button>
                  </Link>
                ) : (
                  <span
                    className="px-8 py-3 text-xs tracking-[0.2em] uppercase"
                    style={{
                      color: "#F5F0EB",
                      opacity: 0.4,
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Left chevron arrow — always visible */}
      <button
        onClick={goPrev}
        className="absolute z-[70] flex items-center justify-center w-10 h-10 rounded-full transition-opacity hover:opacity-100"
        style={{
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.3)",
          border: "none",
          cursor: "pointer",
          opacity: 0.7,
        }}
        aria-label="Previous destination"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Right chevron arrow — always visible */}
      <button
        onClick={goNext}
        className="absolute z-[70] flex items-center justify-center w-10 h-10 rounded-full transition-opacity hover:opacity-100"
        style={{
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.3)",
          border: "none",
          cursor: "pointer",
          opacity: 0.7,
        }}
        aria-label="Next destination"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {/* Dot indicators — above bottom nav */}
      <div
        className="fixed left-0 right-0 flex justify-center gap-2 z-[70]"
        style={{ bottom: 12 }}
      >
        {DESTINATIONS.map((dest, i) => (
          <button
            key={dest.slug}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === activeIndex ? "#F5F0EB" : "rgba(245,240,235,0.3)",
              transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            onClick={() => scrollTo(i)}
            aria-label={`Go to ${dest.title}`}
          />
        ))}
      </div>

      {/* Hide scrollbar */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
