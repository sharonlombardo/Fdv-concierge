import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/user-context";

type Stage = "tiers" | "checkout" | "processing" | "success";
type TierKey = "compass" | "passage";

const TIERS: Record<TierKey, { name: string; price: number; headline: string; features: string[] }> = {
  compass: {
    name: "THE COMPASS",
    price: 250,
    headline: "Your trip, shaped to you.",
    features: [
      "Personalized day-by-day itinerary",
      "Curated wardrobe edit for every day",
      "Packing list tailored to your trip",
      "One round of refinements with your concierge",
    ],
  },
  passage: {
    name: "THE PASSAGE",
    price: 750,
    headline: "Every detail handled.",
    features: [
      "Everything in The Compass",
      "Detailed daily flow with real-time logistics",
      "Travel diary + photo journal",
      "All restaurants and hotels booked for you",
      "Unlimited refinements with your concierge",
    ],
  },
};

const DESTINATION_IMAGE: Record<string, string> = {
  Morocco: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/stay-1-large.jpg",
  Hydra: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/hydra_coats_villas.jpg",
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
  const [stage, setStage] = useState<Stage>("tiers");
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);
  const [savedTiers, setSavedTiers] = useState<Set<TierKey>>(new Set());
  const [savingTier, setSavingTier] = useState<TierKey | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { email } = useUser();

  const effectiveEmail = email || userEmail;

  async function saveTrip(tier: TierKey, purchaseStatus: "saved" | "purchased") {
    const tierData = TIERS[tier];
    const imageUrl = DESTINATION_IMAGE[destination] || "";
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
          title: `${destination} — ${tierData.name}`,
          imageUrl,
          bucket: "my-trips",
          tier,
          tierName: tierData.name,
          price: tierData.price,
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

  async function handleHeartTier(tier: TierKey) {
    if (savedTiers.has(tier)) return;
    setSavingTier(tier);
    try {
      await saveTrip(tier, "saved");
      setSavedTiers(prev => new Set(prev).add(tier));
      toast({
        title: "Saved to My Trips",
        description: `${TIERS[tier].name} — ${destination} added to your Suitcase.`,
        duration: 3000,
      });
    } catch {
      toast({ title: "Couldn't save", description: "Try again in a moment.", duration: 2000 });
    } finally {
      setSavingTier(null);
    }
  }

  async function handleConfirmPay() {
    if (!selectedTier) return;
    setStage("processing");

    await new Promise(r => setTimeout(r, 1800));

    try {
      await saveTrip(selectedTier, "purchased");
    } catch {}

    setStage("success");

    setTimeout(() => {
      const tierData = TIERS[selectedTier];
      const questions = DESTINATION_QUESTIONS[destination] || "the food, the quiet, the experiences";
      window.dispatchEvent(
        new CustomEvent("open-concierge", {
          detail: {
            message: `Welcome to your ${destination} trip. I'm building your ${tierData.name} now. To make it perfect — when are you thinking of going? How long do you have? Who's coming with you? And what matters most to you — ${questions}?`,
          },
        })
      );
    }, 1200);
  }

  function handleViewTrip() {
    if (destination === "Morocco" && selectedTier === "compass") {
      navigate("/editorial");
    } else if (destination === "Morocco" && selectedTier === "passage") {
      navigate("/concierge");
    } else {
      navigate("/suitcase");
    }
    onClose();
  }

  const tier = selectedTier ? TIERS[selectedTier] : null;

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
    maxHeight: "92vh",
    overflowY: "auto",
    padding: "28px 20px 52px",
    position: "relative",
  };

  // ─── Tiers ────────────────────────────────────────────────────────────────
  if (stage === "tiers") {
    return (
      <div style={overlay} onClick={onClose}>
        <div style={sheet} onClick={e => e.stopPropagation()}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 1 }}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2c2416" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", textAlign: "center", marginBottom: 10 }}>
            Trip Curation
          </p>
          <h2 style={{ fontFamily: F.serif, fontSize: 28, fontWeight: 400, textAlign: "center", color: "#2c2416", marginBottom: 6, lineHeight: 1.2 }}>
            Your {destination} Trip,<br />Curated
          </h2>
          <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", textAlign: "center", color: "rgba(44,36,22,0.5)", marginBottom: 28 }}>
            Choose how deeply you want us to go.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(["compass", "passage"] as TierKey[]).map(key => {
              const data = TIERS[key];
              const isSaved = savedTiers.has(key);
              const isSaving = savingTier === key;
              return (
                <div
                  key={key}
                  style={{ border: "1px solid rgba(44,36,22,0.12)", background: "#fff", padding: "22px 18px 18px", position: "relative" }}
                >
                  {key === "passage" && (
                    <div style={{ position: "absolute", top: 10, right: 44, background: "#c9a84c", color: "#fff", fontFamily: F.ui, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 7px" }}>
                      Most Complete
                    </div>
                  )}

                  <button
                    onClick={() => handleHeartTier(key)}
                    disabled={isSaved || isSaving}
                    aria-label={isSaved ? "Saved" : "Save to My Trips"}
                    style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: isSaved ? "default" : "pointer", padding: 4, lineHeight: 1 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "#E24B4A" : "none"} stroke={isSaved ? "#E24B4A" : "rgba(44,36,22,0.3)"} strokeWidth={isSaved ? 0 : 1.5}>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,36,22,0.4)", marginBottom: 3 }}>
                      {data.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 3 }}>
                      <span style={{ fontFamily: F.serif, fontSize: 38, fontWeight: 400, color: "#2c2416", lineHeight: 1 }}>
                        ${data.price}
                      </span>
                    </div>
                    <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.55)" }}>
                      {data.headline}
                    </p>
                  </div>

                  <ul style={{ listStyle: "none", margin: "0 0 18px", padding: 0 }}>
                    {data.features.map((f, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 7 }}>
                        <span style={{ color: "#c9a84c", marginTop: 1, flexShrink: 0, fontSize: 12 }}>✦</span>
                        <span style={{ fontFamily: F.ui, fontSize: 13, color: "#2c2416", lineHeight: 1.5 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => { setSelectedTier(key); setStage("checkout"); }}
                    style={{
                      width: "100%",
                      padding: "13px 0",
                      background: key === "passage" ? "#2c2416" : "transparent",
                      color: key === "passage" ? "#fff" : "#2c2416",
                      border: key === "passage" ? "none" : "1px solid rgba(44,36,22,0.6)",
                      fontFamily: F.ui,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Choose {key === "compass" ? "The Compass" : "The Passage"}
                  </button>
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily: F.body, fontSize: 12, fontStyle: "italic", textAlign: "center", color: "rgba(44,36,22,0.3)", marginTop: 18 }}>
            Heart an option to save it to your Suitcase for later.
          </p>
        </div>
      </div>
    );
  }

  // ─── Checkout ─────────────────────────────────────────────────────────────
  if (stage === "checkout" && tier) {
    return (
      <div style={overlay}>
        <div style={sheet}>
          <button
            onClick={() => setStage("tiers")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "0 0 18px", color: "rgba(44,36,22,0.45)", fontFamily: F.ui, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Change
          </button>

          <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 8 }}>
            Order Summary
          </p>
          <h2 style={{ fontFamily: F.serif, fontSize: 28, fontWeight: 400, color: "#2c2416", marginBottom: 22, lineHeight: 1.2 }}>
            {tier.name}
          </h2>

          <div style={{ background: "#fff", border: "1px solid rgba(44,36,22,0.1)", padding: "20px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid rgba(44,36,22,0.07)" }}>
              <div>
                <p style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 600, color: "#2c2416", marginBottom: 2 }}>
                  {destination} — {tier.name}
                </p>
                <p style={{ fontFamily: F.ui, fontSize: 12, color: "rgba(44,36,22,0.45)" }}>
                  {tier.headline}
                </p>
              </div>
              <span style={{ fontFamily: F.serif, fontSize: 24, color: "#2c2416", flexShrink: 0, marginLeft: 12 }}>
                ${tier.price}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
              <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#2c2416" }}>Total</span>
              <span style={{ fontFamily: F.serif, fontSize: 22, color: "#2c2416" }}>${tier.price}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, padding: "12px 14px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <p style={{ fontFamily: F.ui, fontSize: 11, color: "rgba(44,36,22,0.55)", lineHeight: 1.5, margin: 0 }}>
              Secure payment. Your concierge will begin curating within 24 hours of confirmation.
            </p>
          </div>

          <button
            onClick={handleConfirmPay}
            style={{ width: "100%", padding: "16px 0", background: "#2c2416", color: "#fff", border: "none", fontFamily: F.ui, fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: 12 }}
          >
            Confirm &amp; Pay — ${tier.price}
          </button>

          <p style={{ fontFamily: F.body, fontSize: 11, fontStyle: "italic", textAlign: "center", color: "rgba(44,36,22,0.32)", margin: 0 }}>
            Not ready? Your concierge is always available to answer questions first.
          </p>
        </div>
      </div>
    );
  }

  // ─── Processing ───────────────────────────────────────────────────────────
  if (stage === "processing") {
    return (
      <div style={overlay}>
        <div style={{ ...sheet, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "38vh", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid rgba(44,36,22,0.08)", borderTop: "1.5px solid #c9a84c", animation: "spin 1s linear infinite", marginBottom: 24 }} />
          <p style={{ fontFamily: F.serif, fontSize: 24, color: "#2c2416", marginBottom: 6 }}>Processing...</p>
          <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.45)" }}>One moment.</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  if (stage === "success" && tier) {
    return (
      <div style={overlay}>
        <div style={{ ...sheet, textAlign: "center" }}>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 28, color: "#c9a84c" }}>✦</span>
          </div>
          <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 10 }}>
            Confirmed
          </p>
          <h2 style={{ fontFamily: F.serif, fontSize: 30, fontWeight: 400, color: "#2c2416", marginBottom: 10, lineHeight: 1.2 }}>
            Your trip is<br />being curated.
          </h2>
          <p style={{ fontFamily: F.body, fontSize: 14, color: "rgba(44,36,22,0.6)", marginBottom: 4 }}>
            {destination} — {tier.name}
          </p>
          <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.4)", lineHeight: 1.7, marginBottom: 30, maxWidth: 320, margin: "0 auto 30px" }}>
            Your concierge is opening now to begin building your trip.
          </p>

          <button
            onClick={handleViewTrip}
            style={{ width: "100%", padding: "14px 0", background: "#2c2416", color: "#fff", border: "none", fontFamily: F.ui, fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: 10 }}
          >
            {destination === "Morocco" && selectedTier === "compass"
              ? "View Your Morocco Overview →"
              : "Check Your Suitcase →"}
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
