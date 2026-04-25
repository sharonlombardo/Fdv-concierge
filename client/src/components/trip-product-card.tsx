import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/user-context";
import { MOROCCO_DIARY } from "@/components/diary/DiaryData";
import { MobileDayPage } from "@/components/diary/MobileDayPage";
import { MobileDayDetail } from "@/components/diary/MobileDayDetail";
import { getShopImageUrl } from "@/lib/brand-genome";
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
}

const PREVIEW_IMAGES = {
  itinerary: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/morocco%20itiin%20overview%20sample.jpg",
  packing: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/daily%20itinerary%20with%20packing.jpg",
};

const TIER_CONFIG: Record<Tier, TierConfig> = {
  compass: {
    name: "THE COMPASS",
    price: 250,
    priceDisplay: "$250",
    priceLabel: "one-time",
    headline: "Your trip. Your wardrobe. Every detail considered.",
    features: [
      "Personalized day-by-day itinerary",
      "Curated wardrobe edit for every day",
      "Packing list tailored to your trip",
      "One round of changes with your concierge",
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
  },

  passage: {
    name: "THE PASSAGE",
    price: 750,
    priceDisplay: "$750",
    priceLabel: "one-time",
    headline: "Your trip. Your bookings. Your wardrobe. Your story.",
    features: [
      "Personalized day-by-day itinerary",
      "Curated wardrobe edit for every day",
      "Complete packing list tailored to your trip",
      "All reservations and bookings handled",
      "Personal travel diary — a shareable keepsake",
      "Upload your own wardrobe — mix what you own with what we curate",
      "Booking confirmations delivered to your Suitcase",
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
      { src: "", label: "Sample Travel Diary" },
      { src: "", label: "Sample Booking Confirmation" },
      { src: "", label: "Sample Wardrobe Integration" },
    ],
  },

  trunk: {
    name: "THE TRUNK",
    price: null,
    priceDisplay: "Price based on your selections",
    priceLabel: "",
    headline: "Your wardrobe, sourced and shipped. Your trip, handled down to the last detail.",
    features: [
      "Everything included in The Passage",
      "Your entire curated wardrobe — sourced and shipped to you",
      "Coordinated delivery — everything arrives together, beautifully packaged",
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
  },
};

const DESTINATION_IMAGES: Record<string, { card: string; img1: string; img2: string }> = {
  Morocco: {
    card: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/Marrakech%2C%20%40amanjena%20copy.jpeg",
    img1: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/stay-1-large.jpg",
    img2: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/morocco-tile-3",
  },
  Hydra: {
    card: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/hydra_coats_villas.jpg",
    img1: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/hydra_techne_cobble_stone.jpg",
    img2: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/hydra_pier_model_white.jpg",
  },
};

// ─── Sample Travel Diary (interactive — tap photo to expand day detail) ─────
function SampleTravelDiary() {
  const [open, setOpen] = useState(false);
  const day = MOROCCO_DIARY.days[0];

  return (
    <>
      <div className="fdv-diary" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 360,
            boxShadow: "0 4px 18px rgba(44,36,22,0.13), 0 1px 4px rgba(44,36,22,0.08)",
            border: "1px solid rgba(44,36,22,0.07)",
            overflow: "hidden",
            borderRadius: 4,
          }}
        >
          <MobileDayPage data={MOROCCO_DIARY} day={day} onPhotoTap={() => setOpen(true)} />
        </div>
      </div>
      {open && day && (
        <div
          className="fdv-diary"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10300,
            background: "rgba(20, 16, 10, 0.62)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "24px 0",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            animation: "fdv-mdd-fade 0.25s ease",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="mdd-overlay-anim"
            onClick={(e) => e.stopPropagation()}
            style={{ margin: "auto 0" }}
          >
            <MobileDayDetail data={MOROCCO_DIARY} day={day} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

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

function PassageSample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <p style={{ fontFamily: F.body, fontSize: 11, fontStyle: "italic", color: "rgba(44,36,22,0.38)", margin: 0, textAlign: "center" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function PreviewCard({ src, label }: { src: string; label: string }) {
  return (
    <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontFamily: F.body, fontSize: 11, fontStyle: "italic", color: "rgba(44,36,22,0.38)", margin: 0, textAlign: "center" }}>
        {label}
      </p>
      {src ? (
        <img
          src={src}
          alt={label}
          style={{
            width: "100%",
            borderRadius: 10,
            boxShadow: "0 4px 18px rgba(44,36,22,0.13), 0 1px 4px rgba(44,36,22,0.08)",
            display: "block",
            border: "1px solid rgba(44,36,22,0.07)",
          }}
        />
      ) : (
        <div style={{
          width: "100%",
          aspectRatio: "4/3",
          borderRadius: 10,
          background: "rgba(44,36,22,0.03)",
          border: "1px dashed rgba(44,36,22,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontFamily: F.body, fontSize: 11, fontStyle: "italic", color: "rgba(44,36,22,0.22)", textAlign: "center", padding: "0 16px" }}>
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

export function TripProductCard({ destination, tier = "compass", userEmail, onClose }: TripProductCardProps) {
  const [stage, setStage] = useState<Stage>("detail");
  const [nextOpen, setNextOpen] = useState(false);
  const { toast } = useToast();
  const { email } = useUser();

  const effectiveEmail = email || userEmail;
  const images = DESTINATION_IMAGES[destination] ?? DESTINATION_IMAGES.Morocco;
  const cfg = TIER_CONFIG[tier];

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
    await fetch("/api/saves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        itemType: "trip",
        itemId: `trip-${destination.toLowerCase()}-${tier}-${purchaseStatus}`,
        sourceContext: `/guides/${destination.toLowerCase()}`,
        storyTag: destination.toLowerCase(),
        aestheticTags: ["travel", "curated"],
        metadata: {
          title: `${destination} — ${cfg.name}`,
          imageUrl: images.card,
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
        userEmail: effectiveEmail,
      }),
    });
  }

  async function handleSaveForLater() {
    try {
      await saveTrip("saved");
      toast({ title: "Saved to your Suitcase", duration: 3000 });
      onClose();
    } catch {
      toast({ title: "Couldn't save", description: "Try again in a moment.", duration: 2000 });
    }
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
      <div style={overlay} onClick={onClose}>
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

          {/* Two editorial images */}
          <div style={{ display: "flex", gap: 2, height: "36vh", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <img src={images.img1} alt={`${destination} destination`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <img src={images.img2} alt={`${destination} wardrobe`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
              {cfg.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: "#c9a84c", flexShrink: 0, fontSize: 11, marginTop: 3 }}>✦</span>
                  <span style={{ fontFamily: F.body, fontSize: 14, color: "#2c2416", lineHeight: 1.55 }}>{f}</span>
                </li>
              ))}
            </ul>

            {/* Preview cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 26, alignItems: "center" }}>
              {tier === "passage" ? (
                <>
                  <PassageSample label="Sample Travel Diary"><SampleTravelDiary /></PassageSample>
                  <PassageSample label="Sample Booking Confirmation"><SampleBookingConfirmation /></PassageSample>
                  <PassageSample label="Sample Wardrobe Integration"><SampleWardrobeIntegration /></PassageSample>
                </>
              ) : (
                cfg.previews.map((p, i) => (
                  <PreviewCard key={i} src={p.src} label={p.label} />
                ))
              )}
            </div>

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
