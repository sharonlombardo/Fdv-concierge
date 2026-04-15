import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { HeroAnimation } from "@/components/hero-animation";
import { DESTINATIONS } from "@shared/destinations";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { PinButton } from "@/components/pin-button";
import { getProductByKey, getShopImageUrl } from "@/lib/brand-genome";
import { useUser } from "@/contexts/user-context";

// Products for THE EDIT carousel — hand-curated hero pieces
const EDIT_PRODUCTS = [
  { genomeKey: "look:fildevie:steviecaftan:black.jpg", fallbackTitle: "Stevie Caftan", fallbackBrand: "FIL DE VIE", fallbackPrice: "$825" },
  { genomeKey: "look:fildevie:columndress:black.jpg", fallbackTitle: "Column Dress", fallbackBrand: "FIL DE VIE", fallbackPrice: "$745" },
  { genomeKey: "look:fildevie:estedress:black.jpg", fallbackTitle: "Este Dress", fallbackBrand: "FIL DE VIE", fallbackPrice: "$675" },
  { genomeKey: "look:fildevie:medinadress:black.jpg", fallbackTitle: "Medina Dress", fallbackBrand: "FIL DE VIE", fallbackPrice: "$650" },
  { genomeKey: "beauty:fdv:parfum.jpg", fallbackTitle: "Parfum", fallbackBrand: "FIL DE VIE", fallbackPrice: "$475" },
  { genomeKey: "look:fdv:steviecaftan:black.jpg", fallbackTitle: "Stevie Caftan", fallbackBrand: "FIL DE VIE", fallbackPrice: "$825" },
];

const SLIDE_WIDTH_PERCENT = 68; // Match destinations page — ~16% peek each side
const GAP = 3; // Thin sliver between cards like Zara

export default function Threshold() {
  const { data: imageSlotsData } = useImageSlots();
  const { user } = useUser();
  const [, navigate] = useLocation();
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

  // Returning user redirect
  useEffect(() => {
    if (user) {
      const lastPage = localStorage.getItem("fdv_last_page");
      if (lastPage && lastPage !== "/") {
        navigate(lastPage);
      } else {
        navigate("/guides/morocco");
      }
    }
  }, [user, navigate]);

  // Destination carousel scroll tracking
  const getSlideWidth = useCallback(() => {
    return (window.innerWidth * SLIDE_WIDTH_PERCENT) / 100;
  }, []);

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

  // Resolve products for THE EDIT carousel
  const editItems = EDIT_PRODUCTS.map((ep) => {
    const product = getProductByKey(ep.genomeKey);
    const imageUrl = getShopImageUrl(ep.genomeKey);
    return {
      genomeKey: ep.genomeKey,
      title: product?.name || ep.fallbackTitle,
      brand: product?.brand || ep.fallbackBrand,
      price: product?.price || ep.fallbackPrice,
      imageUrl: imageUrl || "",
      shopUrl: product?.shopUrl || "",
    };
  }).filter((item) => item.imageUrl); // Only show items with images

  const sidePadding = `${(100 - SLIDE_WIDTH_PERCENT) / 2}vw`;

  // If authenticated, the useEffect above will redirect — render nothing while redirecting
  if (user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
      {/* === SECTION 1: HERO VIDEO === */}
      <HeroAnimation />

      {/* === SECTION 2: ATMOSPHERIC TEXT === */}
      <section
        style={{
          backgroundColor: "#fafaf9",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 26,
            lineHeight: 1.65,
            color: "#2c2416",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          Pick your destination. We've thought of everything — the places, the wardrobe, the details.
        </p>
      </section>

      {/* === SECTION 3: DESTINATION CARDS CAROUSEL === */}
      <section style={{ backgroundColor: "#fafaf9", paddingBottom: 40 }}>
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: GAP,
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            paddingLeft: sidePadding,
            paddingRight: sidePadding,
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          className="hide-scrollbar"
        >
          {DESTINATIONS.map((dest) => {
            const imgUrl = getImageUrl(dest.imageSlotKey) || dest.defaultImage;
            return (
              <div
                key={dest.slug}
                style={{
                  flex: `0 0 ${SLIDE_WIDTH_PERCENT}vw`,
                  scrollSnapAlign: "center",
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  height: "70vh",
                  minHeight: 480,
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: dest.available ? "none" : "saturate(0.7)",
                  }}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(transparent 40%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
                {/* Text + button */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px 24px 28px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: 34,
                      fontWeight: 400,
                      color: "#fff",
                      margin: 0,
                      lineHeight: 1.2,
                      textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    {dest.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: 16,
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.85)",
                      margin: "6px 0 20px",
                    }}
                  >
                    {dest.subtitle}
                  </p>
                  {dest.available ? (
                    <Link href={dest.route}>
                      <button
                        style={{
                          background: "#fff",
                          color: "#1a1a1a",
                          border: "none",
                          padding: "12px 28px",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                        }}
                      >
                        View Guide
                      </button>
                    </Link>
                  ) : (
                    <button
                      style={{
                        background: "transparent",
                        color: "rgba(255,255,255,0.5)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        padding: "12px 28px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "default",
                      }}
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {DESTINATIONS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i === activeIndex ? "#2c2416" : "rgba(44,36,22,0.2)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </section>

      {/* === SECTION 4A: EDITORIAL CODA === */}
      <section
        style={{
          backgroundColor: "#fafaf9",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 17,
              lineHeight: 1.8,
              color: "#2c2416",
              marginBottom: 24,
            }}
          >
            Everything in our guides is shoppable — see it, love it,{" "}
            <Link href="/shop">
              <span style={{ color: "#c9a84c", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>
                it's yours
              </span>
            </Link>
            . We'll even{" "}
            <span
              onClick={() => window.dispatchEvent(new CustomEvent("open-concierge"))}
              style={{ color: "#c9a84c", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}
            >
              curate your own edit
            </span>
            {" "}— a capsule built around where you're going and how you travel.
          </p>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 17,
              lineHeight: 1.8,
              color: "#2c2416",
              marginBottom: 24,
            }}
          >
            Save what stops you. Your{" "}
            <Link href="/suitcase">
              <span style={{ color: "#c9a84c", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>
                suitcase
              </span>
            </Link>
            {" "}keeps it all.
          </p>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 17,
              lineHeight: 1.8,
              color: "#2c2416",
            }}
          >
            When you're ready, we'll{" "}
            <span
              onClick={() => window.dispatchEvent(new CustomEvent("open-concierge"))}
              style={{ color: "#c9a84c", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}
            >
              build the whole trip
            </span>
            {" "}— wardrobe, itinerary, reservations. All of it.
          </p>
        </div>
      </section>

      {/* === SECTION 4B: THE EDIT — SHOPPABLE CAROUSEL === */}
      {editItems.length > 0 && (
        <section style={{ backgroundColor: "#fafaf9", paddingBottom: 48 }}>
          <div style={{ textAlign: "center", padding: "0 24px 24px" }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(44,36,22,0.35)",
                marginBottom: 6,
              }}
            >
              The Edit
            </p>
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 16,
                fontStyle: "italic",
                color: "rgba(44,36,22,0.55)",
              }}
            >
              A few things worth having.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              overflowX: "scroll",
              padding: "0 24px",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
            className="hide-scrollbar"
          >
            {editItems.map((item) => (
              <div
                key={item.genomeKey}
                style={{
                  flex: "0 0 160px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: "#f0ece4",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <div style={{ position: "absolute", top: 6, right: 6 }}>
                    <PinButton
                      itemType="style"
                      itemId={`landing-edit-${item.genomeKey}`}
                      itemData={{
                        title: item.title,
                        imageUrl: item.imageUrl,
                        brand: item.brand,
                        price: item.price,
                        shopUrl: item.shopUrl,
                        storyTag: "the-edit",
                        genomeKey: item.genomeKey,
                      }}
                      sourceContext="landing-edit"
                      size="sm"
                    />
                  </div>
                </div>
                <div style={{ padding: "8px 2px 0" }}>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(44,36,22,0.4)",
                      margin: 0,
                    }}
                  >
                    {item.brand}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      color: "#2c2416",
                      margin: "2px 0 0",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      color: "rgba(44,36,22,0.5)",
                      margin: "2px 0 0",
                    }}
                  >
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === SECTION 4C: QUIET CLOSER === */}
      <section
        style={{
          backgroundColor: "#fafaf9",
          padding: "40px 24px 100px",
          textAlign: "center",
        }}
      >
        <p
          onClick={() => window.dispatchEvent(new CustomEvent("open-concierge"))}
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 15,
            color: "rgba(44,36,22,0.35)",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(44,36,22,0.6)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(44,36,22,0.35)")}
        >
          Or ask your concierge{" "}
          <span style={{ color: "#c9a84c" }}>✦</span>
        </p>
      </section>

      {/* Hide scrollbar utility */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
