import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/user-context";

type Stage = "detail" | "checkout" | "processing" | "success";

const COMPASS = {
  name: "THE COMPASS",
  price: 250,
  headline: "Your trip. Your wardrobe. Every detail considered.",
  features: [
    "Personalized day-by-day itinerary",
    "Curated wardrobe edit for every day",
    "Packing list tailored to your trip",
    "One round of changes with your concierge",
  ],
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

const DESTINATION_QUESTIONS: Record<string, string> = {
  Morocco: "the food, the souks, the quiet riads, the Atlas",
  Hydra: "the food, the quiet, the swimming, the art",
};

export interface TripProductCardProps {
  destination: string;
  userEmail: string;
  onClose: () => void;
}

export function TripProductCard({ destination, userEmail, onClose }: TripProductCardProps) {
  const [stage, setStage] = useState<Stage>("detail");
  const [nextOpen, setNextOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { email } = useUser();

  const effectiveEmail = email || userEmail;
  const images = DESTINATION_IMAGES[destination] ?? DESTINATION_IMAGES.Morocco;

  const F = {
    serif: "'Cormorant Garamond', Georgia, serif" as const,
    body: "'Lora', Georgia, serif" as const,
    ui: "'Inter', sans-serif" as const,
  };

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
        itemId: `trip-${destination.toLowerCase()}-compass-${purchaseStatus}`,
        sourceContext: `/guides/${destination.toLowerCase()}`,
        storyTag: destination.toLowerCase(),
        aestheticTags: ["travel", "curated"],
        metadata: {
          title: `${destination} — ${COMPASS.name}`,
          imageUrl: images.card,
          bucket: "my-trips",
          tier: "compass",
          tierName: COMPASS.name,
          price: COMPASS.price,
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

  async function handleConfirmPay() {
    setStage("processing");
    await new Promise(r => setTimeout(r, 1800));
    try { await saveTrip("purchased"); } catch {}
    setStage("success");
    setTimeout(() => {
      const questions = DESTINATION_QUESTIONS[destination] ?? "the food, the quiet, the experiences";
      window.dispatchEvent(
        new CustomEvent("open-concierge", {
          detail: {
            message: `Welcome to your ${destination} trip. I'm building your ${COMPASS.name} now. To make it perfect — when are you thinking of going? How long do you have? Who's coming with you? And what matters most to you — ${questions}?`,
          },
        })
      );
    }, 1200);
  }

  function handleViewTrip() {
    navigate(destination === "Morocco" ? "/editorial" : "/suitcase");
    onClose();
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

          {/* Two editorial images side by side */}
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
              {COMPASS.name}
            </h2>
            <p style={{ fontFamily: F.body, fontSize: 15, fontStyle: "italic", color: "rgba(44,36,22,0.55)", marginBottom: 26, lineHeight: 1.6 }}>
              {COMPASS.headline}
            </p>

            <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(44,36,22,0.38)", marginBottom: 14 }}>
              What's included:
            </p>
            <ul style={{ listStyle: "none", margin: "0 0 22px", padding: 0 }}>
              {COMPASS.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: "#c9a84c", flexShrink: 0, fontSize: 11, marginTop: 3 }}>✦</span>
                  <span style={{ fontFamily: F.body, fontSize: 14, color: "#2c2416", lineHeight: 1.55 }}>{f}</span>
                </li>
              ))}
            </ul>

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
                <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.55)", lineHeight: 1.7, paddingBottom: 16, margin: 0 }}>
                  Your concierge will be in touch within the hour to learn about your trip — when you're going, who's coming, and what matters most to you.
                </p>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
              <span style={{ fontFamily: F.serif, fontSize: 44, fontWeight: 400, color: "#2c2416", lineHeight: 1 }}>$250</span>
              <span style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.38)" }}>one-time</span>
            </div>

            <button
              onClick={() => setStage("checkout")}
              style={{ width: "100%", padding: "15px 0", background: "#2c2416", color: "#faf9f6", border: "none", fontFamily: F.ui, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", marginBottom: 10 }}
            >
              Build My Trip
            </button>
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

  // ─── Checkout ─────────────────────────────────────────────────────────────
  if (stage === "checkout") {
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
            {COMPASS.name}
          </h2>

          <div style={{ background: "#fff", border: "1px solid rgba(44,36,22,0.1)", padding: "20px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid rgba(44,36,22,0.07)" }}>
              <div>
                <p style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 600, color: "#2c2416", marginBottom: 2 }}>
                  {destination} — {COMPASS.name}
                </p>
                <p style={{ fontFamily: F.ui, fontSize: 12, color: "rgba(44,36,22,0.45)" }}>
                  {COMPASS.headline}
                </p>
              </div>
              <span style={{ fontFamily: F.serif, fontSize: 24, color: "#2c2416", flexShrink: 0, marginLeft: 12 }}>$250</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
              <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#2c2416" }}>Total</span>
              <span style={{ fontFamily: F.serif, fontSize: 22, color: "#2c2416" }}>$250</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, padding: "12px 14px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <p style={{ fontFamily: F.ui, fontSize: 11, color: "rgba(44,36,22,0.55)", lineHeight: 1.5, margin: 0 }}>
              Secure payment. Your concierge will begin curating within the hour.
            </p>
          </div>

          <button
            onClick={handleConfirmPay}
            style={{ width: "100%", padding: "16px 0", background: "#2c2416", color: "#fff", border: "none", fontFamily: F.ui, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: 12 }}
          >
            Confirm &amp; Pay — $250
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

  // ─── Success ──────────────────────────────────────────────────────────────
  if (stage === "success") {
    return (
      <div style={overlay}>
        <div style={{ ...sheet, padding: "28px 20px 52px", textAlign: "center" }}>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 28, color: "#c9a84c" }}>✦</span>
          </div>
          <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 10 }}>
            Confirmed
          </p>
          <h2 style={{ fontFamily: F.serif, fontSize: 30, fontWeight: 400, color: "#2c2416", marginBottom: 10, lineHeight: 1.2 }}>
            Your trip is<br />being curated.
          </h2>
          <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.4)", lineHeight: 1.7, maxWidth: 300, margin: "0 auto 30px" }}>
            Your concierge is opening now to begin building your trip.
          </p>
          <button
            onClick={handleViewTrip}
            style={{ width: "100%", padding: "14px 0", background: "#2c2416", color: "#fff", border: "none", fontFamily: F.ui, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: 10 }}
          >
            {destination === "Morocco" ? "View Your Morocco Overview →" : "Check Your Suitcase →"}
          </button>
          <button
            onClick={onClose}
            style={{ width: "100%", padding: "13px 0", background: "transparent", color: "rgba(44,36,22,0.45)", border: "1px solid rgba(44,36,22,0.14)", fontFamily: F.ui, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  return null;
}
