import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { HeroAnimation } from "@/components/hero-animation";
import { DESTINATIONS } from "@shared/destinations";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { PinButton } from "@/components/pin-button";
import { getProductByKey, getShopImageUrl } from "@/lib/brand-genome";
import { useUser } from "@/contexts/user-context";

const BLOB = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/";
const CG = "'Cormorant Garamond', Georgia, serif";
const IS = "'Instrument Sans', Inter, sans-serif";
const AD = "'Architects Daughter', cursive";
const LORA = "'Lora', Georgia, serif";
const CREAM = "#faf9f6";
const INK = "#2c2416";
const MUTED = "#8a7e72";

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

// ── Image layout components ──────────────────────────────────────────────────

function FullBleed({ src, height = "80vh" }: { src: string; height?: string }) {
  return (
    <div style={{ width: "100%", height, overflow: "hidden", flexShrink: 0 }}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

function Contained({ src, height = "65vh" }: { src: string; height?: string }) {
  return (
    <div style={{ margin: "0 24px", height, overflow: "hidden" }}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

function SideBySide({ left, right, height = "50vh" }: { left: string; right: string; height?: string }) {
  return (
    <div style={{ display: "flex", gap: 2, height }}>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <img src={left} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <img src={right} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}

function Collage({ top, bottomLeft, bottomRight }: { top: string; bottomLeft: string; bottomRight: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ height: "55vh", overflow: "hidden" }}>
        <img src={top} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ display: "flex", gap: 2, height: "35vh" }}>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <img src={bottomLeft} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <img src={bottomRight} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>
    </div>
  );
}

// ── Principle block ──────────────────────────────────────────────────────────

function Principle({ num, title, body }: { num: string; title: React.ReactNode; body: string }) {
  return (
    <section style={{ backgroundColor: CREAM, padding: "80px 32px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: LORA,
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
            color: INK,
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: LORA,
            fontSize: 15,
            fontWeight: 300,
            color: INK,
            lineHeight: 1.9,
            margin: "0 0 40px",
            opacity: 0.85,
          }}
        >
          {body}
        </p>
        <p
          style={{
            fontFamily: AD,
            fontSize: 22,
            color: MUTED,
            textAlign: "right" as const,
            margin: 0,
          }}
        >
          {num}
        </p>
      </div>
    </section>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Threshold() {
  const { data: imageSlotsData } = useImageSlots();
  const { user } = useUser();
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const getImageUrl = (assetKey: string): string => {
    if (imageSlotsData?.slots) {
      const slot = imageSlotsData.slots.find((s: any) => s.key === assetKey);
      if (slot?.currentUrl) return slot.currentUrl;
    }
    const defaultSlot = IMAGE_SLOTS.find((s: any) => s.key === assetKey);
    return defaultSlot?.defaultUrl || "";
  };

  useEffect(() => {
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
    el.scrollLeft = slideWidth;
    setActiveIndex(0);
    let scrollTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const domIdx = Math.round(el.scrollLeft / slideWidth);
      if (domIdx >= 1 && domIdx <= destCount) setActiveIndex(domIdx - 1);
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
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(scrollTimer); };
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "landing-subscribe" }),
      });
    } catch {}
    setSubscribed(true);
  };

  if (user && !sessionStorage.getItem("fdv_home_redirect")) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>

      {/* ── S1: HERO VIDEO ── */}
      <HeroAnimation />

      {/* ── Space between hero and manifesto ── */}
      <div style={{ height: 80, backgroundColor: CREAM }} />

      {/* ── S2: MANIFESTO ── */}
      <section style={{ backgroundColor: CREAM, padding: "96px 32px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: AD, fontSize: 52, color: INK, margin: "0 0 10px", lineHeight: 1 }}>
          Travel.
        </p>
        <p
          style={{
            fontFamily: IS,
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase" as const,
            color: MUTED,
            margin: "0 0 52px",
          }}
        >
          A State of Mind
        </p>
        <p
          style={{
            fontFamily: CG,
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: INK,
            lineHeight: 2.3,
            maxWidth: 340,
            margin: "0 auto 52px",
            fontWeight: 400,
          }}
        >
          Some trips you remember for the place. Some for how you felt in it.
          We think about both —{" "}
          <em>the destination, what you bring,</em>
          {" "}and the art of arriving like you already belong there.
        </p>
        <p style={{ fontFamily: AD, fontSize: 24, color: MUTED, margin: 0 }}>
          '26
        </p>
      </section>

      {/* ── S3: FIRST SHOT ── striped shirt relax (seated, head back) */}
      <FullBleed src={`${BLOB}hydra_striped_shirt_relax.jpeg`} />

      {/* ── S4: BRIDGE LINE ── */}
      <section style={{ backgroundColor: CREAM, padding: "80px 32px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: CG,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 26,
            color: INK,
            maxWidth: 320,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          You're going somewhere. We've thought of everything.
        </p>
      </section>

      {/* ── S5: SECOND SHOT ── pier model white (walking through arches) */}
      <FullBleed src={`${BLOB}hydra_pier_model_white.jpg`} height="90vh" />

      {/* ── S6: PRINCIPLE 01/03 ── */}
      <Principle
        num="01/03"
        title={
          <>
            First, <em style={{ fontStyle: "italic" }}>The Destination.</em>
          </>
        }
        body="Start with the place. The one you've been thinking about. We've already been — the hotel you'll dream about long after, the street where the light changes everything, the dinner you'll book again before you've paid the check."
      />

      {/* ── S7: 3-IMAGE COLLAGE ── */}
      <Collage
        top={`${BLOB}hydra_harbor_red_building.jpg`}
        bottomLeft={`${BLOB}hydra_red_boat.jpg`}
        bottomRight={`${BLOB}hydra_luggage_car.jpg`}
      />

      {/* ── S8: PRINCIPLE 02/03 ── */}
      <Principle
        num="02/03"
        title={
          <>
            Second, <em style={{ fontStyle: "italic" }}>What You Bring.</em>
          </>
        }
        body="Every piece considered for the place — what to wear, what to pack, the things between the outfits. We curate it all to where you're going. See it in the guide, tap it, it's yours."
      />

      {/* ── S9: THREE IMAGES ── full bleed + contained + full bleed */}
      <FullBleed src={`${BLOB}hydra_red_bougainvilla.jpg`} />
      <div style={{ height: 24, backgroundColor: CREAM }} />
      <Contained src={`${BLOB}hydra_packed_suitcase_red_stripes.jpg`} height="60vh" />
      <div style={{ height: 24, backgroundColor: CREAM }} />
      <FullBleed src={`${BLOB}hydra_red_window_sill.jpg`} />

      {/* ── S10: PRINCIPLE 03/03 ── */}
      <Principle
        num="03/03"
        title={
          <>
            Third, and the part nobody else does…{" "}
            <em style={{ fontStyle: "italic" }}>We Go With You.</em>
          </>
        }
        body="Tell the concierge where and when. She'll build your itinerary, your wardrobe edit, your packing list — all of it shaped around what you saved and how you travel. Built for you. No one else."
      />

      {/* ── S11: THE GUIDES '26 HEADER ── */}
      <section style={{ backgroundColor: CREAM, paddingTop: 64, paddingBottom: 40, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: 10 }}>
          <p
            style={{
              fontFamily: IS,
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase" as const,
              color: INK,
              margin: 0,
            }}
          >
            The Guides
          </p>
          <p style={{ fontFamily: AD, fontSize: 24, color: MUTED, margin: 0 }}>
            '26
          </p>
        </div>
      </section>

      {/* ── S12: DESTINATION CAROUSEL ── */}
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
                  <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
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
                  <div style={{ height: 46, overflow: "hidden", display: "flex", alignItems: "flex-start", marginBottom: 32, maxWidth: "80%" }}>
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
                      <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#F5F0EB", fontFamily: IS, fontWeight: 500, cursor: "pointer" }}>
                        View Guide
                      </span>
                    </Link>
                  ) : (
                    <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#F5F0EB", opacity: 0.4, fontFamily: IS, fontWeight: 500 }}>
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={goPrev}
          style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.3)", border: "none", cursor: "pointer", opacity: 0.7 }}
          aria-label="Previous destination"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          onClick={goNext}
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.3)", border: "none", cursor: "pointer", opacity: 0.7 }}
          aria-label="Next destination"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      {/* ── S13: FULL BLEED ── coastal villas */}
      <div style={{ marginTop: 56 }}>
        <FullBleed src={`${BLOB}hydra_coast_villas_red_umbrellas.jpg`} />
      </div>

      {/* ── S14: SIDE BY SIDE ── camera + luggage */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <SideBySide
        left={`${BLOB}hydra_green_camera.jpg`}
        right={`${BLOB}hydra_green_luggage_small.jpg`}
      />

      {/* ── S15: STATEMENT LINE ── */}
      <section style={{ backgroundColor: CREAM, padding: "80px 32px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: IS,
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase" as const,
            color: INK,
            margin: 0,
          }}
        >
          The Places, the Wardrobe, the Details
        </p>
      </section>

      {/* ── S16: FULL BLEED ── interior */}
      <FullBleed src={`${BLOB}hydra_interior_cool_cropped.png`} />

      {/* ── S17: FULL BLEED ── red suitcase */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <FullBleed src={`${BLOB}red_suitcase.jpeg`} />

      {/* ── S18: CONTAINED ── malgosia steps */}
      <div style={{ height: 40, backgroundColor: CREAM }} />
      <Contained src={`${BLOB}hydra_malgosia_steps.jpg`} height="70vh" />

      {/* ── S19: FULL BLEED ── back float */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <FullBleed src={`${BLOB}hydra_back_float.jpeg`} />

      {/* ── S20a: FULL BLEED ── harbor lunch stripe awning */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <FullBleed src={`${BLOB}hydra_harbor_lunch_stripe_awning.jpg`} />

      {/* ── S20b: FULL BLEED ── octopus lunch */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <FullBleed src={`${BLOB}hydra_octopus_lunch.jpg`} />

      {/* ── S21: FULL BLEED ── coats villas */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <FullBleed src={`${BLOB}hydra_coats_villas.jpg`} />

      {/* ── S22: CONTAINED CENTERED ── oxblood bag */}
      <div style={{ height: 40, backgroundColor: CREAM }} />
      <Contained src={`${BLOB}travel_bag_oxblood.jpg`} height="60vh" />

      {/* ── S23: CONTAINED ── malgosia wall */}
      <div style={{ height: 24, backgroundColor: CREAM }} />
      <Contained src={`${BLOB}hydra_malgosia_wall.jpg`} height="70vh" />

      {/* ── S24: FULL BLEED ── overview boat */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <FullBleed src={`${BLOB}hydra_overview_boat.jpeg`} />

      {/* ── S25: SIDE BY SIDE ── restaurant + pouch */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <SideBySide
        left={`${BLOB}hydra_restaurant_cobblestone.jpg`}
        right={`${BLOB}hydra_green_pouch.jpg`}
      />

      {/* ── S26: FULL BLEED ── coffee stone */}
      <div style={{ height: 2, backgroundColor: CREAM }} />
      <FullBleed src={`${BLOB}hydra_coffee_stone.jpg`} />

      {/* ── S27: SHOP HEADER ── */}
      <section style={{ backgroundColor: CREAM, padding: "96px 32px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: AD, fontSize: 48, color: INK, margin: "0 0 10px", lineHeight: 1 }}>
          Travel.
        </p>
        <p style={{ fontFamily: IS, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase" as const, color: MUTED, margin: "0 0 10px" }}>
          A State of Mind
        </p>
        <p style={{ fontFamily: AD, fontSize: 24, color: MUTED, margin: 0 }}>
          '26
        </p>
      </section>

      {/* ── S28: THE EDIT HEADER ── */}
      <section style={{ backgroundColor: CREAM, padding: "48px 24px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: IS, fontWeight: 400, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: MUTED, margin: "0 0 16px" }}>
          The Edit
        </p>
        <p style={{ fontFamily: CG, fontStyle: "italic", fontWeight: 300, fontSize: 22, color: INK, margin: 0 }}>
          A few things worth having.
        </p>
      </section>

      {/* ── S29: THE EDIT CAROUSEL ── */}
      {editItems.length > 0 && (
        <section style={{ backgroundColor: CREAM, paddingBottom: 56 }}>
          <div
            style={{ display: "flex", gap: 14, overflowX: "scroll", padding: "24px 24px 0", msOverflowStyle: "none", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            className="hide-scrollbar"
          >
            {editItems.map((item) => (
              <div key={item.genomeKey} style={{ flex: "0 0 224px", position: "relative" }}>
                <div style={{ aspectRatio: "3/4", backgroundColor: "#ede9e2", overflow: "hidden", position: "relative" }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <PinButton
                      itemType="style"
                      itemId={`landing-edit-${item.genomeKey}`}
                      itemData={{ title: item.title, imageUrl: item.imageUrl, brand: item.brand, price: item.price, shopUrl: item.shopUrl, storyTag: "the-edit", genomeKey: item.genomeKey }}
                      sourceContext="landing-edit"
                      size="sm"
                    />
                  </div>
                </div>
                <div style={{ padding: "10px 2px 0" }}>
                  <p style={{ fontFamily: IS, fontSize: 12, fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase" as const, color: MUTED, margin: 0 }}>
                    {item.brand}
                  </p>
                  <p style={{ fontFamily: IS, fontSize: 12, fontWeight: 400, color: INK, margin: "3px 0 0" }}>
                    {item.title}
                  </p>
                  <p style={{ fontFamily: IS, fontSize: 12, fontWeight: 400, color: MUTED, margin: "3px 0 0" }}>
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── S30: CONCIERGE CLOSER ── */}
      <section style={{ backgroundColor: CREAM, padding: "72px 32px 48px", textAlign: "center" }}>
        <p
          onClick={() => window.dispatchEvent(new CustomEvent("open-concierge"))}
          style={{ fontFamily: CG, fontStyle: "italic", fontWeight: 300, fontSize: 22, color: MUTED, margin: "0 0 16px", cursor: "pointer" }}
        >
          Or ask your concierge ✦
        </p>
        <p style={{ fontFamily: IS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: INK, margin: 0, opacity: 0.35 }}>
          FDV Concierge
        </p>
      </section>

      {/* ── S31: EMAIL SIGNUP ── */}
      <section style={{ backgroundColor: CREAM, padding: "0 32px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: CG, fontStyle: "italic", fontWeight: 300, fontSize: 22, color: INK, margin: "0 0 32px" }}>
          Come with us.
        </p>
        {subscribed ? (
          <p style={{ fontFamily: CG, fontStyle: "italic", fontSize: 18, color: MUTED, margin: 0 }}>
            Thank you.
          </p>
        ) : (
          <form
            onSubmit={handleSubscribe}
            style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              style={{
                fontFamily: IS,
                fontSize: 14,
                padding: "14px 20px",
                border: `1px solid rgba(44,36,22,0.2)`,
                backgroundColor: "transparent",
                color: INK,
                outline: "none",
                borderRadius: 0,
              }}
            />
            <button
              type="submit"
              style={{
                fontFamily: IS,
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase" as const,
                padding: "14px 24px",
                backgroundColor: INK,
                color: CREAM,
                border: "none",
                cursor: "pointer",
              }}
            >
              Subscribe
            </button>
          </form>
        )}
      </section>

      {/* Bottom padding for nav bar */}
      <div style={{ height: 100, backgroundColor: CREAM }} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
