import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/user-context";
import { PassageTravelDiarySection } from "@/components/diary/PassageTravelDiarySection";
import { getShopImageUrl } from "@/lib/brand-genome";
import { ConciergeOrb } from "@/components/concierge-orb";
import { getSessionId } from "@/lib/session";
import "@/styles/diary-keepsake.css";

export type Tier = "compass" | "passage" | "trunk";
type Stage = "detail" | "checkout" | "processing" | "success";

const F = {
  serif: "'Cormorant Garamond', Georgia, serif" as const,
  body: "'Lora', Georgia, serif" as const,
  ui: "'Inter', sans-serif" as const,
};

interface TierConfig {
  name: string;
  price: number | null;
  priceDisplay: string;
  priceLabel: string;
  headline: string;
  features: string[];
  primaryCta: string;
  confirmCta: string | null;
  whatHappensNext: string;
  refundPolicy: string;
  successTitle: string;
  conciergeMsg: (destination: string) => string;
  previews: Array<{ src: string; label: string }>;
  phoneCaption: string;
}

const PREVIEW_IMAGES = {
  itinerary: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/morocco%20itiin%20overview%20sample.jpg",
  packing: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/daily%20itinerary%20with%20packing.jpg",
  diary: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/exp-1-large.jpg",
  booking: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/stay-1-large.jpg",
  wardrobe: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-1",
};

const TIER_CONFIG: Record<Tier, TierConfig> = {
  compass: {
    name: "THE COMPASS",
    price: 250,
    priceDisplay: "$250",
    priceLabel: "one-time",
    headline: "A personalized travel capsule: itinerary, wardrobe edit, and packing list.",
    features: [
      "Personalized day-by-day itinerary",
      "Curated wardrobe edit for each day",
      "Packing list tailored to your destination",
      "Restaurant, hotel, and experience suggestions",
      "One round of refinements with your concierge",
      "Delivered as a beautiful digital travel capsule",
    ],
    primaryCta: "Curate My Trip",
    confirmCta: "Confirm & Pay — $250",
    whatHappensNext:
      "The moment you confirm, your concierge opens and the conversation begins. Your personalized itinerary, wardrobe edit, and packing list will be delivered to your Suitcase within 1–2 hours.",
    refundPolicy:
      "Non-refundable once your concierge has started. Full refund within 30 minutes of purchase if curating hasn't begun.",
    successTitle: "Your Compass\nis underway.",
    conciergeMsg: (destination) =>
      `Your Compass is underway. I just need a few details to make it perfect — when are you thinking of going to ${destination}? How long do you have? Who's joining you? And what matters most — the food, the quiet, the art, the shopping? Once I have this, I'll have your itinerary, wardrobe, and packing list ready within 1–2 hours.`,
    previews: [
      { src: PREVIEW_IMAGES.itinerary, label: "Sample itinerary" },
      { src: PREVIEW_IMAGES.packing, label: "Sample packing list" },
    ],
    phoneCaption: "Your itinerary, always with you.",
  },

  passage: {
    name: "THE PASSAGE",
    price: 750,
    priceDisplay: "$750",
    priceLabel: "one-time",
    headline: "Your travel capsule, fully arranged — bookings, wardrobe, confirmations, and in-trip support.",
    features: [
      "Everything in The Compass",
      "Reservations and booking coordination",
      "Complete wardrobe and packing list",
      "Booking confirmations saved to your Suitcase",
      "Personal travel diary / keepsake after the trip",
      "Upload your own wardrobe to mix with FDV curation",
      "Concierge support while you travel — styling, updates, restaurants, weather, directions, small changes",
    ],
    primaryCta: "Curate My Passage",
    confirmCta: "Confirm & Pay — $750",
    whatHappensNext:
      "Your concierge begins immediately — learning about your trip, your style, your preferences. Within 1-2 days, your complete itinerary, all bookings, wardrobe curation, and packing list will be delivered to your Suitcase. Your travel diary begins the moment you arrive.",
    refundPolicy:
      "24-hour cancellation window after purchase. Once bookings are confirmed, the service is non-refundable.",
    successTitle: "Your Passage\nis underway.",
    conciergeMsg: (destination) =>
      `Your Passage is confirmed — the full experience. I'll handle everything from your itinerary to every booking. Let's start: when are you going to ${destination}? How many nights? Who's joining you? What matters most to you on this trip? I'll have everything in your Suitcase within 24 hours.`,
    previews: [
      { src: PREVIEW_IMAGES.diary, label: "Sample Travel Diary" },
      { src: PREVIEW_IMAGES.booking, label: "Sample Booking Confirmation" },
      { src: PREVIEW_IMAGES.wardrobe, label: "Sample Wardrobe Integration" },
    ],
    phoneCaption: "Your full trip, in your pocket.",
  },

  trunk: {
    name: "THE TRUNK",
    price: null,
    priceDisplay: "Price based on your selections",
    priceLabel: "",
    headline: "The complete FDV experience — curated, arranged, packed, and delivered.",
    features: [
      "Everything included in The Passage (and Compass)",
      "Your entire curated wardrobe and travel essentials shipped directly to your door — arrives together, beautifully packaged",
      "Pre-trip ritual moment — a personal gift before your journey begins",
      "White-glove concierge from first click to touchdown",
    ],
    primaryCta: "Begin with Your Concierge",
    confirmCta: null,
    whatHappensNext:
      "Your concierge will guide you through the full experience — building your itinerary, handling every booking, curating your wardrobe piece by piece. Once your selections are made, everything is sourced, coordinated, and shipped to arrive together. A small gift arrives before your departure — a ritual to mark the beginning.",
    refundPolicy:
      "Pricing and cancellation terms are confirmed with your concierge before any commitment.",
    successTitle: "",
    conciergeMsg: (destination) =>
      `I'd love to walk you through The Trunk for ${destination}. This is the full experience — I'll source and ship your entire curated wardrobe, handle every booking, and make sure everything arrives beautifully before you leave. To put together an accurate quote: when are you thinking of going? How many nights? Who's joining you?`,
    previews: [
      { src: "", label: "Sample wardrobe delivery" },
      { src: "", label: "Sample pre-trip gift" },
    ],
    phoneCaption: "Everything we plan, ready when you are.",
  },
};

type ImagePair = { img1: string; img2: string };

// Header pair is fixed per tier across every destination — the imagery
// represents the tier's mood, not the place.
//   Compass — planning/inspiration: Kamini pier + Mandraki Beach Resort
//   Passage — the trip-realized mood: El Fenn + Alaïa Souk Coat editorial
//   Trunk   — the most luxe editorial: Marrakech rooftop sunset + YSL bikini
//             in the Amanjena arched terracotta doorway
const TIER_HEADERS: Record<Tier, ImagePair> = {
  compass: {
    img1: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/hydra_pier_model_white.jpg",
    img2: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/hydra_mandraki_beach.jpg",
  },
  passage: {
    img1: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/stay-1-large.jpg",
    img2: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-3",
  },
  trunk: {
    img1: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/exp-3-break-v2.jpeg",
    img2: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-style-1",
  },
};

// Card thumbnail is still per-destination — it represents the place in the
// user's saved-trips list, not the tier.
const DESTINATION_CARD_IMAGE: Record<string, string> = {
  Morocco: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/Marrakech%2C%20%40amanjena%20copy.jpeg",
  Hydra: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/hydra_coats_villas.jpg",
};

// ─── Sample Booking Confirmation card ───────────────────────────────────────
function SampleBookingConfirmation() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        background: "#faf8f5",
        border: "1px solid rgba(44,36,22,0.1)",
        boxShadow: "0 4px 18px rgba(44,36,22,0.13), 0 1px 4px rgba(44,36,22,0.08)",
        padding: "22px 22px 24px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <span style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "#2c2416" }}>
          FIL DE VIE
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 9px",
            border: "1px solid #c9a84c",
            color: "#a88836",
            fontFamily: F.ui,
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            background: "rgba(201,168,76,0.06)",
          }}
        >
          <span style={{ fontSize: 9 }}>✦</span> Confirmed
        </span>
      </div>

      <p style={{ fontFamily: F.ui, fontSize: 8.5, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)", marginBottom: 6 }}>
        Reservation
      </p>
      <h3 style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 22, color: "#2c2416", margin: "0 0 4px", lineHeight: 1.15 }}>
        Le Jardin Secret
      </h3>
      <p style={{ fontFamily: F.body, fontSize: 11.5, fontStyle: "italic", color: "rgba(44,36,22,0.55)", margin: "0 0 16px" }}>
        Marrakech, Medina
      </p>

      <hr style={{ border: 0, borderTop: "1px solid rgba(44,36,22,0.1)", margin: "0 0 14px" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 14 }}>
        <div>
          <p style={{ fontFamily: F.ui, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(44,36,22,0.45)", margin: "0 0 4px" }}>Date</p>
          <p style={{ fontFamily: F.body, fontSize: 12, color: "#2c2416", margin: 0 }}>April 5, 2026</p>
        </div>
        <div>
          <p style={{ fontFamily: F.ui, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(44,36,22,0.45)", margin: "0 0 4px" }}>Time</p>
          <p style={{ fontFamily: F.body, fontSize: 12, color: "#2c2416", margin: 0 }}>8:30 PM</p>
        </div>
        <div>
          <p style={{ fontFamily: F.ui, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(44,36,22,0.45)", margin: "0 0 4px" }}>Party</p>
          <p style={{ fontFamily: F.body, fontSize: 12, color: "#2c2416", margin: 0 }}>2 guests</p>
        </div>
        <div>
          <p style={{ fontFamily: F.ui, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(44,36,22,0.45)", margin: "0 0 4px" }}>Confirmation</p>
          <p style={{ fontFamily: F.body, fontSize: 12, color: "#2c2416", margin: 0 }}>LJS-4019</p>
        </div>
      </div>

      <hr style={{ border: 0, borderTop: "1px solid rgba(44,36,22,0.1)", margin: "0 0 14px" }} />

      <p style={{ fontFamily: F.body, fontSize: 11.5, fontStyle: "italic", color: "rgba(44,36,22,0.6)", lineHeight: 1.55, margin: "0 0 14px" }}>
        Asked for the courtyard table by the lemon tree. Your concierge has noted no peanuts.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(44,36,22,0.07)" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
        <p style={{ fontFamily: F.ui, fontSize: 9.5, letterSpacing: "0.06em", color: "rgba(44,36,22,0.55)", margin: 0 }}>
          Saved to your Suitcase · Day 03
        </p>
      </div>
    </div>
  );
}

// ─── Sample Wardrobe Integration card ───────────────────────────────────────
function SampleWardrobeIntegration() {
  const items = [
    { src: getShopImageUrl("look:fdv:isadoradress:blk.jpg"), label: "Isadora Dress", source: "yours" as const },
    { src: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-3", label: "Alaïa Souk Coat", source: "curated" as const },
    { src: getShopImageUrl("look:fildevie:columndress:black.jpg"), label: "Column Dress", source: "yours" as const },
    { src: getShopImageUrl("footwear:khaite:otto:wht.jpg"), label: "Robe Slide", source: "curated" as const },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        background: "#faf8f5",
        border: "1px solid rgba(44,36,22,0.1)",
        boxShadow: "0 4px 18px rgba(44,36,22,0.13), 0 1px 4px rgba(44,36,22,0.08)",
        padding: "22px 22px 24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <span style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "#2c2416" }}>
          Day 03 · Wardrobe
        </span>
        <span style={{ fontFamily: F.body, fontSize: 11, fontStyle: "italic", color: "rgba(44,36,22,0.45)" }}>
          Marrakech
        </span>
      </div>

      <h3 style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 20, color: "#2c2416", margin: "0 0 14px", lineHeight: 1.2 }}>
        Yours, with a few additions.
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ position: "relative" }}>
            <div style={{ aspectRatio: "3/4", background: "#f5f0e6", overflow: "hidden", position: "relative" }}>
              <img
                src={it.src}
                alt={it.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  padding: "3px 7px",
                  background: it.source === "yours" ? "rgba(44,36,22,0.85)" : "#c9a84c",
                  color: it.source === "yours" ? "#faf8f5" : "#2c2416",
                  fontFamily: F.ui,
                  fontSize: 7.5,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {it.source === "yours" ? "Yours" : "✦ Curated"}
              </span>
            </div>
            <p style={{ fontFamily: F.body, fontSize: 10, color: "rgba(44,36,22,0.65)", margin: "6px 0 0", textAlign: "center" }}>
              {it.label}
            </p>
          </div>
        ))}
      </div>

      <hr style={{ border: 0, borderTop: "1px solid rgba(44,36,22,0.1)", margin: "4px 0 12px" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: F.ui, fontSize: 9.5, color: "rgba(44,36,22,0.55)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, background: "rgba(44,36,22,0.85)" }} /> 4 yours
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, background: "#c9a84c" }} /> 3 curated
          </span>
        </div>
        <span style={{ fontFamily: F.body, fontSize: 10, fontStyle: "italic", color: "rgba(44,36,22,0.42)" }}>
          + sourced for you
        </span>
      </div>
    </div>
  );
}

// ─── Trunk editorial card (wardrobe delivery + pre-trip gift) ───────────────
function TrunkEditorialCard({
  eyebrow,
  title,
  imageUrl,
  imageAlt,
  caption,
  refLine,
}: {
  eyebrow: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  caption: string;
  refLine: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = imageUrl && !imgFailed;
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        background: "#faf8f5",
        border: "1px solid rgba(44,36,22,0.1)",
        borderRadius: 8,
        boxShadow: "0 4px 18px rgba(44,36,22,0.13), 0 1px 4px rgba(44,36,22,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "11px 16px",
          borderBottom: "1px solid rgba(44,36,22,0.08)",
        }}
      >
        <span style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "#2c2416" }}>
          FIL DE VIE
        </span>
        <span style={{ fontFamily: F.ui, fontSize: 8.5, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "#a88836" }}>
          {eyebrow}
        </span>
      </div>

      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#f5f0e6", overflow: "hidden" }}>
        {showImage ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            onError={() => setImgFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            aria-label={imageAlt}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, #ede5d4 0px, #ede5d4 10px, #e5dcc7 10px, #e5dcc7 20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(44,36,22,0.55)",
              fontFamily: F.ui,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              padding: 16,
              textAlign: "center",
            }}
          >
            {imageAlt}
          </div>
        )}
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <h3 style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 22, color: "#2c2416", margin: "0 0 8px", lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "#8a7e6b", lineHeight: 1.55, margin: "0 0 14px" }}>
          {caption}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 10, borderTop: "1px solid rgba(44,36,22,0.07)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
          <p style={{ fontFamily: F.ui, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,36,22,0.55)", margin: 0 }}>
            {refLine}
          </p>
        </div>
      </div>
    </div>
  );
}

function PassageSample({ label, intro, children }: { label: string; intro?: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <p style={{ fontFamily: F.body, fontSize: 11, fontStyle: "italic", color: "rgba(44,36,22,0.38)", margin: 0, textAlign: "center" }}>
        {label}
      </p>
      {intro && (
        <p style={{ fontFamily: F.body, fontSize: 14, fontStyle: "italic", color: "#5a5147", lineHeight: 1.55, margin: "4px 0 18px", textAlign: "center", maxWidth: 460 }}>
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}

function PhoneNavBar() {
  const itemStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: F.ui,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: "0.07em",
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
  };

  return (
    <div
      style={{
        background: "#1A1A18",
        padding: "8px 6px 10px",
        display: "flex",
        alignItems: "stretch",
        flexShrink: 0,
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Home */}
      <div style={itemStyle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2 10 12 2 22 10" />
          <path d="M4 10v10h16V10" />
          <rect x="9" y="14" width="6" height="6" rx="0.5" />
        </svg>
        <span style={labelStyle}>Home</span>
      </div>

      {/* Concierge — gold compass orb (center) */}
      <div style={itemStyle}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #e3c478 0%, #c9a84c 55%, #a88937 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 1.5px rgba(201,168,76,0.22), 0 1px 5px rgba(201,168,76,0.40)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#faf8f5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9.5" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#faf8f5" stroke="none" />
          </svg>
        </div>
        <span style={{ ...labelStyle, color: "rgba(255,255,255,0.95)" }}>Concierge</span>
      </div>

      {/* Suitcase */}
      <div style={itemStyle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M8 8V5.5a2.5 2.5 0 015 0V8" />
          <line x1="3" y1="14" x2="21" y2="14" />
        </svg>
        <span style={labelStyle}>Suitcase</span>
      </div>

      {/* Passport */}
      <div style={itemStyle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="18" rx="2.5" />
          <circle cx="12" cy="11" r="3.5" />
        </svg>
        <span style={labelStyle}>Passport</span>
      </div>
    </div>
  );
}

function PhoneFrame({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "84%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Phone bezel */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(180deg, #2a2420 0%, #16120e 100%)",
          borderRadius: 38,
          padding: 8,
          boxShadow:
            "0 22px 44px rgba(44,36,22,0.22), 0 6px 14px rgba(44,36,22,0.12), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Screen — fixed iPhone-proportioned height, content scrolls inside */}
        <div
          style={{
            background: "#faf8f5",
            borderRadius: 30,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: 600,
          }}
        >
          {/* Status bar */}
          <div
            style={{
              height: 28,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 18px 0",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 700, color: "#2c2416", letterSpacing: "0.01em" }}>
              9:41
            </span>
            {/* Dynamic island */}
            <div
              style={{
                position: "absolute",
                top: 6,
                left: "50%",
                transform: "translateX(-50%)",
                width: 62,
                height: 15,
                borderRadius: 8,
                background: "#0a0807",
              }}
            />
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {/* signal */}
              <svg width="11" height="7" viewBox="0 0 12 8" fill="#2c2416">
                <rect x="0" y="6" width="2" height="2" />
                <rect x="3" y="4" width="2" height="4" />
                <rect x="6" y="2" width="2" height="6" />
                <rect x="9" y="0" width="2" height="8" />
              </svg>
              {/* battery */}
              <div
                style={{
                  width: 18,
                  height: 9,
                  border: "0.7px solid #2c2416",
                  borderRadius: 2,
                  padding: "1px",
                  display: "flex",
                  alignItems: "stretch",
                  position: "relative",
                }}
              >
                <div style={{ width: "72%", background: "#2c2416", borderRadius: 0.6 }} />
                <div
                  style={{
                    position: "absolute",
                    right: -2,
                    top: 2.5,
                    width: 1.4,
                    height: 4,
                    background: "#2c2416",
                    borderRadius: 0.5,
                  }}
                />
              </div>
            </div>
          </div>

          {/* App header strip */}
          <div
            style={{
              padding: "6px 16px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderBottom: "0.5px solid rgba(44,36,22,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: F.ui,
                fontSize: 7.5,
                fontWeight: 700,
                letterSpacing: "0.24em",
                color: "#2c2416",
                textTransform: "uppercase",
              }}
            >
              FDV Concierge
            </span>
          </div>

          {/* Content area — scrolls inside the fixed-height phone.
              On iOS Safari, nested scroll inside a scrolling modal needs all
              of: overflow-y: scroll (not auto), -webkit-overflow-scrolling:
              touch (momentum), touch-action: pan-y (claim vertical gestures),
              and overscroll-behavior: contain (don't chain to the modal). */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "scroll",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
              overscrollBehavior: "contain",
              padding: "14px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
            }}
          >
            {children}
          </div>

          {/* FDV nav bar — fixed to the bottom of the phone */}
          <PhoneNavBar />
        </div>
      </div>

      {/* Caption */}
      <p
        style={{
          fontFamily: F.body,
          fontSize: 12.5,
          fontStyle: "italic",
          color: "rgba(44,36,22,0.5)",
          margin: 0,
          textAlign: "center",
          letterSpacing: "0.01em",
          lineHeight: 1.5,
        }}
      >
        {caption}
      </p>
    </div>
  );
}

function PreviewCard({ src, label }: { src: string; label: string }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontFamily: F.body, fontSize: 10, fontStyle: "italic", color: "rgba(44,36,22,0.42)", margin: 0, textAlign: "center" }}>
        {label}
      </p>
      {src ? (
        <img
          src={src}
          alt={label}
          style={{
            width: "100%",
            borderRadius: 6,
            display: "block",
            border: "0.5px solid rgba(44,36,22,0.08)",
          }}
        />
      ) : (
        <div style={{
          width: "100%",
          aspectRatio: "4/3",
          borderRadius: 6,
          background: "rgba(44,36,22,0.03)",
          border: "0.5px dashed rgba(44,36,22,0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontFamily: F.body, fontSize: 10, fontStyle: "italic", color: "rgba(44,36,22,0.28)", textAlign: "center", padding: "0 12px" }}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export interface TripProductCardProps {
  destination: string;
  tier?: Tier;
  userEmail: string;
  onClose: () => void;
}

// Tier ladder for drill-down: tapping the first bullet of a tier opens the
// referenced lower tier on top. Compass is the floor.
const DRILL_TARGET: Partial<Record<Tier, Tier>> = {
  trunk: "passage",
  passage: "compass",
};

export function TripProductCard({ destination, tier = "compass", userEmail, onClose }: TripProductCardProps) {
  const [stage, setStage] = useState<Stage>("detail");
  const [nextOpen, setNextOpen] = useState(false);
  const [drilledTier, setDrilledTier] = useState<Tier | null>(null);
  const { toast } = useToast();
  const { email, user, authLoading, setShowPassportGate, setPendingSaveCallback } = useUser();

  const effectiveEmail = email || userEmail;
  const headerPair = TIER_HEADERS[tier];
  const cardImage = DESTINATION_CARD_IMAGE[destination] ?? DESTINATION_CARD_IMAGE.Morocco;
  const cfg = TIER_CONFIG[tier];
  const drillTo = DRILL_TARGET[tier] ?? null;

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(13, 11, 9, 0.78)",
    backdropFilter: "blur(5px)",
    zIndex: 10200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  };

  const sheet: React.CSSProperties = {
    background: "#faf9f6",
    borderRadius: "16px 16px 0 0",
    maxHeight: "94vh",
    overflowY: "auto",
    position: "relative",
  };

  async function saveTrip(purchaseStatus: "saved" | "purchased") {
    const itemId = `trip-${destination.toLowerCase()}-${tier}-${purchaseStatus}`;
    const res = await fetch("/api/saves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        itemType: "trip",
        itemId,
        sourceContext: `/guides/${destination.toLowerCase()}`,
        storyTag: destination.toLowerCase(),
        aestheticTags: ["travel", "curated"],
        title: `${destination} — ${cfg.name}`,
        assetUrl: cardImage,
        price: cfg.price ? String(cfg.price) : undefined,
        metadata: {
          title: `${destination} — ${cfg.name}`,
          imageUrl: cardImage,
          bucket: "my-trips",
          tier,
          tierName: cfg.name,
          price: cfg.price,
          status: purchaseStatus === "purchased"
            ? (destination === "Morocco" ? "ready" : "curating")
            : "saved",
          purchaseStatus,
          destination,
        },
        userEmail: effectiveEmail || undefined,
        sessionId: getSessionId(),
      }),
    });

    // 400 / 409 "Already pinned" — treat as success (user already saved this trip)
    if (res.status === 400 || res.status === 409) {
      const body = await res.json().catch(() => ({}));
      if (body.error === "Already pinned") return;
      throw new Error(body.error || "Save failed");
    }
    if (!res.ok) {
      throw new Error(`Save failed (${res.status})`);
    }
  }

  async function handleSaveForLater() {
    // Anonymous user: show the Digital Passport gate first, then save once they sign up
    if (!authLoading && !user) {
      setPendingSaveCallback(() => async () => {
        try {
          await saveTrip("saved");
          toast({ description: "Saved to your Suitcase", duration: 3000 });
        } catch (err) {
          console.error("[TripProductCard] Save for later failed:", err);
          toast({ description: "Couldn't save — please try again", duration: 3000 });
        }
        onClose();
      });
      setShowPassportGate(true);
      return;
    }

    try {
      await saveTrip("saved");
      toast({ description: "Saved to your Suitcase", duration: 3000 });
      onClose();
    } catch (err) {
      console.error("[TripProductCard] Save for later failed:", err);
      toast({ description: "Couldn't save — please try again", duration: 3000 });
    }
  }

  function handleAskConcierge() {
    onClose();
    // Defer the open-concierge dispatch to next tick so the modal close
    // animation has a frame to start before the concierge slides up.
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-concierge"));
    }, 0);
  }

  async function handleTrunkBegin() {
    try { await saveTrip("saved"); } catch {}
    window.dispatchEvent(new CustomEvent("open-concierge", {
      detail: { message: cfg.conciergeMsg(destination) },
    }));
    onClose();
  }

  async function handleConfirmPay() {
    setStage("processing");
    await new Promise(r => setTimeout(r, 1800));
    try { await saveTrip("purchased"); } catch {}
    setStage("success");

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-concierge", { detail: { message: cfg.conciergeMsg(destination) } }));
      onClose();
    }, 600);

    setTimeout(() => {
      const readyMsg = `Your ${destination} ${cfg.name} is ready. Open your Suitcase to see everything.`;
      try { sessionStorage.setItem("fdv_trip_ready_message", readyMsg); } catch {}
      window.dispatchEvent(new CustomEvent("trip-ready", { detail: { destination, message: readyMsg } }));
    }, 30000);
  }

  // ─── Detail ───────────────────────────────────────────────────────────────
  if (stage === "detail") {
    return (
      <div style={overlay} onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <div style={sheet} onClick={e => e.stopPropagation()}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 1, zIndex: 2 }}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2c2416" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Two editorial images — pair varies by tier */}
          <div style={{ display: "flex", gap: 2, height: "36vh", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <img src={headerPair.img1} alt={`${destination} ${tier}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <img src={headerPair.img2} alt={`${destination} ${tier} detail`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>

          <div style={{ padding: "28px 22px 52px" }}>
            <p style={{ fontFamily: F.ui, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 8 }}>
              Trip Curation
            </p>
            <h2 style={{ fontFamily: F.serif, fontSize: 34, fontWeight: 400, color: "#2c2416", marginBottom: 6, lineHeight: 1.1 }}>
              {cfg.name}
            </h2>
            <p style={{ fontFamily: F.body, fontSize: 15, fontStyle: "italic", color: "rgba(44,36,22,0.55)", marginBottom: 26, lineHeight: 1.6 }}>
              {cfg.headline}
            </p>

            {/* Features list */}
            <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(44,36,22,0.38)", marginBottom: 14 }}>
              What's included:
            </p>
            <ul style={{ listStyle: "none", margin: "0 0 22px", padding: 0 }}>
              {cfg.features.map((f, i) => {
                const isDrillBullet = i === 0 && !!drillTo;
                return (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#c9a84c", flexShrink: 0, fontSize: 11, marginTop: 3 }}>✦</span>
                    {isDrillBullet ? (
                      <button
                        type="button"
                        onClick={() => setDrilledTier(drillTo!)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          margin: 0,
                          textAlign: "left",
                          cursor: "pointer",
                          fontFamily: F.body,
                          fontSize: 14,
                          color: "#c9a84c",
                          lineHeight: 1.55,
                          textDecoration: "underline",
                          textDecorationThickness: 1,
                          textUnderlineOffset: 3,
                        }}
                        aria-label={`${f} — view details`}
                      >
                        {f}
                      </button>
                    ) : (
                      <span style={{ fontFamily: F.body, fontSize: 14, color: "#2c2416", lineHeight: 1.55 }}>{f}</span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Phone preview — your trip in your pocket */}
            <div style={{ marginBottom: 24 }}>
              <PhoneFrame caption={cfg.phoneCaption}>
                {tier === "passage" ? (
                  <>
                    <PassageSample
                      label="Sample Travel Diary"
                      intro="Your trip becomes a keepsake. Every day documented — your photos, your journal, your moments — designed into a personal travel diary you can share or print. Here's what yours could look like."
                    >
                      <PassageTravelDiarySection />
                    </PassageSample>
                    <PassageSample label="Sample Booking Confirmation"><SampleBookingConfirmation /></PassageSample>
                    <PassageSample label="Sample Wardrobe Integration"><SampleWardrobeIntegration /></PassageSample>
                  </>
                ) : tier === "trunk" ? (
                  <>
                    <PassageSample label="Sample wardrobe delivery">
                      <TrunkEditorialCard
                        eyebrow="The Trunk · Delivery"
                        title="Your Trunk arrives."
                        imageUrl="/images/trunk-wardrobe-delivery.jpg"
                        imageAlt="FDV Concierge trunk packed with wardrobe and accessories"
                        caption="Everything arrives before you leave — beautifully packaged, ready to wear."
                        refLine="Delivered to your door · Day −2"
                      />
                    </PassageSample>
                    <PassageSample label="Sample pre-trip gift">
                      <TrunkEditorialCard
                        eyebrow="The Trunk · Pre-Trip"
                        title="A small ritual, before you go."
                        imageUrl="/images/trunk-pretrip-gift.jpg"
                        imageAlt="FDV pre-trip gift box with passport holder, itinerary card, and perfume"
                        caption="A personal gift before your journey begins — because the trip starts before you leave."
                        refLine="Hand-packed · Day −1"
                      />
                    </PassageSample>
                  </>
                ) : (
                  cfg.previews.map((p, i) => (
                    <PreviewCard key={i} src={p.src} label={p.label} />
                  ))
                )}
              </PhoneFrame>
            </div>

            {/* Have questions? — soft concierge invitation */}
            <button
              type="button"
              onClick={handleAskConcierge}
              aria-label="Talk to your concierge"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                width: "100%",
                margin: "0 auto 26px",
                padding: "16px 18px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: F.ui,
              }}
            >
              <ConciergeOrb state="idle" circleSize={32} palette="gold" />
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 13,
                  fontStyle: "italic",
                  color: "rgba(44,36,22,0.55)",
                  letterSpacing: "0.01em",
                }}
              >
                Have questions? Talk to your concierge
              </span>
            </button>

            {/* Expandable "What happens next?" */}
            <div style={{ borderTop: "1px solid rgba(44,36,22,0.08)", borderBottom: "1px solid rgba(44,36,22,0.08)", marginBottom: 26 }}>
              <button
                onClick={() => setNextOpen(o => !o)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", background: "none", border: "none", cursor: "pointer" }}
              >
                <span style={{ fontFamily: F.ui, fontSize: 12, letterSpacing: "0.04em", color: "#2c2416" }}>What happens next?</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2c2416" strokeWidth="1.5" style={{ transform: nextOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {nextOpen && (
                <div style={{ paddingBottom: 16 }}>
                  <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.55)", lineHeight: 1.7, margin: "0 0 10px" }}>
                    {cfg.whatHappensNext}
                  </p>
                  <p style={{ fontFamily: F.body, fontSize: 12, fontStyle: "italic", color: "rgba(44,36,22,0.32)", lineHeight: 1.6, margin: 0 }}>
                    {cfg.refundPolicy}
                  </p>
                </div>
              )}
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
              <span style={{ fontFamily: F.serif, fontSize: tier === "trunk" ? 18 : 44, fontWeight: 400, fontStyle: tier === "trunk" ? "italic" : "normal", color: "#2c2416", lineHeight: tier === "trunk" ? 1.4 : 1 }}>
                {cfg.priceDisplay}
              </span>
              <span style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.38)" }}>
                {cfg.priceLabel}
              </span>
            </div>

            {/* Primary CTA */}
            <button
              onClick={tier === "trunk" ? handleTrunkBegin : () => setStage("checkout")}
              style={{ width: "100%", padding: "15px 0", background: "#2c2416", color: "#faf9f6", border: "none", fontFamily: F.ui, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", marginBottom: 10 }}
            >
              {cfg.primaryCta}
            </button>

            {/* Save for later */}
            <button
              onClick={handleSaveForLater}
              style={{ width: "100%", padding: "14px 0", background: "transparent", color: "#2c2416", border: "1px solid rgba(44,36,22,0.22)", fontFamily: F.ui, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 7 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Save for Later
            </button>
          </div>
        </div>

        {drilledTier && (
          <TripProductCard
            destination={destination}
            tier={drilledTier}
            userEmail={userEmail}
            onClose={() => setDrilledTier(null)}
          />
        )}
      </div>
    );
  }

  // ─── Checkout (Compass + Passage only) ────────────────────────────────────
  if (stage === "checkout" && cfg.confirmCta) {
    return (
      <div style={overlay}>
        <div style={{ ...sheet, padding: "28px 20px 52px" }}>
          <button
            onClick={() => setStage("detail")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "0 0 18px", color: "rgba(44,36,22,0.45)", fontFamily: F.ui, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 8 }}>
            Order Summary
          </p>
          <h2 style={{ fontFamily: F.serif, fontSize: 28, fontWeight: 400, color: "#2c2416", marginBottom: 22, lineHeight: 1.2 }}>
            {cfg.name}
          </h2>

          <div style={{ background: "#fff", border: "1px solid rgba(44,36,22,0.1)", padding: "20px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid rgba(44,36,22,0.07)" }}>
              <div>
                <p style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 600, color: "#2c2416", marginBottom: 2 }}>
                  {destination} — {cfg.name}
                </p>
                <p style={{ fontFamily: F.ui, fontSize: 12, color: "rgba(44,36,22,0.45)" }}>
                  {cfg.headline}
                </p>
              </div>
              <span style={{ fontFamily: F.serif, fontSize: 24, color: "#2c2416", flexShrink: 0, marginLeft: 12 }}>{cfg.priceDisplay}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
              <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#2c2416" }}>Total</span>
              <span style={{ fontFamily: F.serif, fontSize: 22, color: "#2c2416" }}>{cfg.priceDisplay}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, padding: "12px 14px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <p style={{ fontFamily: F.ui, fontSize: 11, color: "rgba(44,36,22,0.55)", lineHeight: 1.5, margin: 0 }}>
              Secure payment. Your concierge begins immediately after checkout.
            </p>
          </div>

          <button
            onClick={handleConfirmPay}
            style={{ width: "100%", padding: "16px 0", background: "#2c2416", color: "#fff", border: "none", fontFamily: F.ui, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: 12 }}
          >
            {cfg.confirmCta}
          </button>
          <p style={{ fontFamily: F.body, fontSize: 11, fontStyle: "italic", textAlign: "center", color: "rgba(44,36,22,0.32)", margin: 0 }}>
            Not ready? Your concierge is available to answer questions first.
          </p>
        </div>
      </div>
    );
  }

  // ─── Processing ───────────────────────────────────────────────────────────
  if (stage === "processing") {
    return (
      <div style={overlay}>
        <div style={{ ...sheet, padding: "28px 20px 52px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "38vh", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid rgba(44,36,22,0.08)", borderTop: "1.5px solid #c9a84c", animation: "spin 1s linear infinite", marginBottom: 24 }} />
          <p style={{ fontFamily: F.serif, fontSize: 24, color: "#2c2416", marginBottom: 6 }}>Processing...</p>
          <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.45)" }}>One moment.</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ─── Success (brief flash — concierge opens on top) ───────────────────────
  if (stage === "success") {
    return (
      <div style={overlay}>
        <div style={{ ...sheet, padding: "52px 20px 52px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "32vh", textAlign: "center" }}>
          <span style={{ fontSize: 30, color: "#c9a84c", marginBottom: 16 }}>✦</span>
          <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 10 }}>
            Confirmed
          </p>
          <p style={{ fontFamily: F.serif, fontSize: 28, color: "#2c2416", lineHeight: 1.2, marginBottom: 8, whiteSpace: "pre-line" }}>
            {cfg.successTitle}
          </p>
          <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.42)" }}>
            Your concierge is opening now…
          </p>
        </div>
      </div>
    );
  }

  return null;
}
