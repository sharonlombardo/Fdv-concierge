import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { HeroAnimation } from "@/components/hero-animation";
import { DESTINATIONS } from "@shared/destinations";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { PinButton } from "@/components/pin-button";
import { getProductByKey, getShopImageUrl } from "@/lib/brand-genome";
import { useUser } from "@/contexts/user-context";

// Typography constants
const CG = "'Cormorant Garamond', Georgia, serif";
const IS = "'Instrument Sans', Inter, sans-serif";

// Products for THE EDIT carousel — hand-curated hero pieces
const EDIT_PRODUCTS = [
  { genomeKey: "look:fildevie:steviecaftan:black.jpg", fallbackTitle: "Stevie Caftan", fallbackBrand: "FIL DE VIE", fallbackPrice: "$825" },
  { genomeKey: "look:fildevie:columndress:black.jpg", fallbackTitle: "Column Dress", fallbackBrand: "FIL DE VIE", fallbackPrice: "$745" },
  { genomeKey: "look:fildevie:estedress:black.jpg", fallbackTitle: "Este Dress", fallbackBrand: "FIL DE VIE", fallbackPrice: "$675" },
  { genomeKey: "look:fildevie:medinadress:black.jpg", fallbackTitle: "Medina Dress", fallbackBrand: "FIL DE VIE", fallbackPrice: "$650" },
  { genomeKey: "beauty:fdv:parfum.jpg", fallbackTitle: "Parfum", fallbackBrand: "FIL DE VIE", fallbackPrice: "$475" },
  { genomeKey: "look:fdv:steviecaftan:black.jpg", fallbackTitle: "Stevie Caftan", fallbackBrand: "FIL DE VIE", fallbackPrice: "$825" },
];

const SLIDE_WIDTH_PERCENT = 68;
const GAP = 3;

// Full-bleed editorial break — placeholder until images arrive
// To add image: set imageSrc="/your-image.jpg" (place file in public/)
type EditorialBreakProps = {
  text: string;
  imageSrc?: string;
  placeholderColor?: string;
};

function EditorialBreak({ text, imageSrc, placeholderColor = "#2a2420" }: EditorialBreakProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "75vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: placeholderColor,
        backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 40,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(transparent 35%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      <p
        style={{
          position: "relative",
          fontFamily: CG,
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 28,
          lineHeight: 1.35,
          color: "#fff",
          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
          textAlign: "center",
          maxWidth: 320,
          margin: 0,
          padding: "0 24px",
          zIndex: 1,
        }}
      >
        {text}
      </p>
    </div>
  );
}

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

  useEffect(() => {
    // Only redirect once per session — subsequent HOME taps show the landing page
    if (user && !sessionStorage.getItem("fdv_home_redirect")) {
      sessionStorage.setItem("fdv_home_redirect", "1");
      const lastPage = localStorage.getItem("fdv_last_page");
      if (lastPage && lastPage !== "/") {
        navigate(lastPage);
      } else {
        navigate("/guides/morocco");
      }
    }
  }, [user, navigate]);

  const getSlideWidth = useCallback(() => {
    return (window.innerWidth * SLIDE_WIDTH_PERCENT) / 100;
  }, []);

  // Clone-based infinite carousel:
  // displayItems = [clone-of-last, ...real items..., clone-of-first]
  // DOM index 0 = clone of last, DOM 1..count = real, DOM count+1 = clone of first
  const destCount = DESTINATIONS.length;
  const displayItems = [
    { ...DESTINATIONS[destCount - 1], _cloneKey: `${DESTINATIONS[destCount - 1].slug}-start` },
    ...DESTINATIONS.map((d) => ({ ...d, _cloneKey: d.slug })),
    { ...DESTINATIONS[0], _cloneKey: `${DESTINATIONS[0].slug}-end` },
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = getSlideWidth() + GAP;

    // Start at DOM 1 (real index 0 = Morocco) — silent, no animation
    el.scrollLeft = slideWidth;
    setActiveIndex(0);

    let scrollTimer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      const domIdx = Math.round(el.scrollLeft / slideWidth);
      if (domIdx >= 1 && domIdx <= destCount) {
        setActiveIndex(domIdx - 1);
      }
      // After scrolling stops, teleport from clone back to real counterpart
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const di = Math.round(el.scrollLeft / slideWidth);
        if (di === 0) {
          el.scrollTo({ left: destCount * slideWidth, behavior: "auto" });
          setActiveIndex(destCount - 1);
        } else if (di === destCount + 1) {
          el.scrollTo({ left: slideWidth, behavior: "auto" });
          setActiveIndex(0);
        }
      }, 300);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer);
    };
  }, [getSlideWidth, destCount]);

  const goNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = getSlideWidth() + GAP;
    const domIdx = Math.round(el.scrollLeft / slideWidth);
    el.scrollTo({ left: (domIdx + 1) * slideWidth, behavior: "smooth" });
  }, [getSlideWidth]);

  const goPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = getSlideWidth() + GAP;
    const domIdx = Math.round(el.scrollLeft / slideWidth);
    el.scrollTo({ left: (domIdx - 1) * slideWidth, behavior: "smooth" });
  }, [getSlideWidth]);

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
  }).filter((item) => item.imageUrl);

  const sidePadding = `${(100 - SLIDE_WIDTH_PERCENT) / 2}vw`;

  // Suppress the landing page only while the initial redirect hasn't happened yet
  // (avoids a flash before the redirect fires). After that, HOME works normally.
  if (user && !sessionStorage.getItem("fdv_home_redirect")) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5f0" }}>

      {/* ── HERO VIDEO ── */}
      <HeroAnimation />

      {/* ── EDITORIAL BREAK 1 ── */}
      <EditorialBreak
        text="You're going somewhere. We've thought of everything."
        imageSrc="https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/_%20%2810%29%20copy.jpeg"
      />

      {/* ── THE GUIDES label + destination carousel ── */}
      <section style={{ backgroundColor: "#f8f5f0", paddingTop: 56, paddingBottom: 0 }}>
        <p
          style={{
            fontFamily: IS,
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            color: "#8a7e72",
            textAlign: "center",
            margin: "0 0 40px",
          }}
        >
          The Guides
        </p>

        <div style={{ position: "relative" }}>
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
            {displayItems.map((dest) => {
              const imgUrl = getImageUrl(dest.imageSlotKey) || dest.defaultImage;
              return (
                <div
                  key={dest._cloneKey}
                  onClick={() => dest.available && navigate(dest.route)}
                  style={{
                    flex: `0 0 ${SLIDE_WIDTH_PERCENT}vw`,
                    scrollSnapAlign: "center",
                    borderRadius: 0,
                    overflow: "hidden",
                    position: "relative",
                    height: "70vh",
                    minHeight: 480,
                    cursor: dest.available ? "pointer" : "default",
                    flexShrink: 0,
                  }}
                >
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
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: dest.available
                        ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.05) 70%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.15) 70%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "0 32px 56px",
                    }}
                  >
                    {/* Fixed-height badge slot — always same height whether visible or not */}
                    <div
                      style={{
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          fontSize: 10,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase" as const,
                          border: "1px solid rgba(245,240,235,0.5)",
                          color: "#F5F0EB",
                          fontFamily: IS,
                          borderRadius: 999,
                          opacity: dest.available ? 1 : 0,
                        }}
                      >
                        Guide
                      </span>
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: "clamp(2.5rem, 8vw, 4rem)",
                        fontWeight: 500,
                        color: "#ffffff",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        lineHeight: 1.1,
                        textAlign: "center",
                        margin: "0 0 12px",
                      }}
                    >
                      {dest.title}
                    </h2>
                    {/* Fixed-height description — 2 lines max so title stays at same Y on every card */}
                    <div
                      style={{
                        height: 46,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: 32,
                        maxWidth: "80%",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: IS,
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: "#F5F0EB",
                          opacity: 0.85,
                          textAlign: "center",
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as const,
                          overflow: "hidden",
                          width: "100%",
                        } as React.CSSProperties}
                      >
                        {dest.summary}
                      </p>
                    </div>
                    {dest.available ? (
                      <Link href={dest.route}>
                        <span
                          style={{
                            fontSize: 12,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase" as const,
                            color: "#F5F0EB",
                            fontFamily: IS,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          View Guide
                        </span>
                      </Link>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase" as const,
                          color: "#F5F0EB",
                          opacity: 0.4,
                          fontFamily: IS,
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

          {/* Left chevron */}
          <button
            onClick={goPrev}
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
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

          {/* Right chevron */}
          <button
            onClick={goNext}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
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
        </div>
      </section>

      {/* ── EDITORIAL BREAK 2 ── */}
      <div style={{ marginTop: 56 }}>
        <EditorialBreak
          text="The places. The wardrobe. The details."
          imageSrc="https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/IMG_7473.jpg"
        />
      </div>

      {/* ── SHORT STATEMENT + THE EDIT label + script accent ── */}
      <section
        style={{
          backgroundColor: "#f8f5f0",
          padding: "72px 24px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: CG,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 28,
            lineHeight: 1.3,
            letterSpacing: "0.02em",
            color: "#2a2520",
            maxWidth: 320,
            margin: "0 auto 64px",
          }}
        >
          See it. Save it. It's yours.
        </p>

        <p
          style={{
            fontFamily: IS,
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            color: "#8a7e72",
            margin: "0 0 16px",
          }}
        >
          The Edit
        </p>

        <p
          style={{
            fontFamily: CG,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 22,
            color: "#5a5048",
            margin: "8px 0 0",
          }}
        >
          A few things worth having.
        </p>
      </section>

      {/* ── THE EDIT carousel — tiles 40% larger (224px vs 160px) ── */}
      {editItems.length > 0 && (
        <section style={{ backgroundColor: "#f8f5f0", paddingBottom: 56 }}>
          <div
            style={{
              display: "flex",
              gap: 14,
              overflowX: "scroll",
              padding: "24px 24px 0",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
            className="hide-scrollbar"
          >
            {editItems.map((item) => (
              <div
                key={item.genomeKey}
                style={{ flex: "0 0 224px", position: "relative" }}
              >
                <div
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: "#ede9e2",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
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
                <div style={{ padding: "10px 2px 0" }}>
                  <p
                    style={{
                      fontFamily: IS,
                      fontSize: 12,
                      fontWeight: 400,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase" as const,
                      color: "#8a7e72",
                      margin: 0,
                    }}
                  >
                    {item.brand}
                  </p>
                  <p
                    style={{
                      fontFamily: IS,
                      fontSize: 12,
                      fontWeight: 400,
                      color: "#2a2520",
                      margin: "3px 0 0",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontFamily: IS,
                      fontSize: 12,
                      fontWeight: 400,
                      color: "#8a7e72",
                      margin: "3px 0 0",
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

      {/* ── EDITORIAL BREAK 3 ── */}
      <EditorialBreak
        text="Or ask your concierge ✦"
        imageSrc="https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/4.3/IMG_1759.jpeg"
      />

      {/* Bottom padding for nav bar */}
      <div style={{ height: 100, backgroundColor: "#f8f5f0" }} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
