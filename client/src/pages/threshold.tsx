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
        minHeight: "75vh",
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
          background: "linear-gradient(transparent 45%, rgba(0,0,0,0.38) 100%)",
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
    if (user) {
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

  if (user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5f0" }}>

      {/* ── HERO VIDEO ── */}
      <HeroAnimation />

      {/* ── EDITORIAL BREAK 1 (add imageSrc="/editorial-break-1.jpg" when ready) ── */}
      <EditorialBreak
        text="You're going somewhere. We've thought of everything."
        placeholderColor="#2a2420"
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
                onClick={() => dest.available && navigate(dest.route)}
                style={{
                  flex: `0 0 ${SLIDE_WIDTH_PERCENT}vw`,
                  scrollSnapAlign: "center",
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  height: "70vh",
                  minHeight: 480,
                  cursor: dest.available ? "pointer" : "default",
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
                    background: "linear-gradient(transparent 40%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
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
                      fontFamily: CG,
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
                      fontFamily: CG,
                      fontSize: 16,
                      fontStyle: "italic",
                      fontWeight: 300,
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
                          fontFamily: IS,
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase" as const,
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
                        fontFamily: IS,
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
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

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {DESTINATIONS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i === activeIndex ? "#2a2520" : "rgba(42,37,32,0.2)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── EDITORIAL BREAK 2 (add imageSrc="/editorial-break-2.jpg" when ready) ── */}
      <div style={{ marginTop: 56 }}>
        <EditorialBreak
          text="The places. The wardrobe. The details."
          placeholderColor="#242018"
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

      {/* ── EDITORIAL BREAK 3 (add imageSrc="/editorial-break-3.jpg" when ready) ── */}
      <EditorialBreak
        text="Or ask your concierge ✦"
        placeholderColor="#1e1c18"
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
