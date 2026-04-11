import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { PRESET_CAPSULES, type Capsule } from "@/data/capsule-data";
import { useUser } from "@/contexts/user-context";
import { DESTINATIONS } from "@shared/destinations";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { CuratingAnimation } from "@/components/curating-animation";

const LS_SAVED_CAPSULES_KEY = "fdv_saved_capsules";
const HERO_IMAGE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/MOODBOARD%20copy.jpg.webp";

function getSavedCapsuleIds(): string[] {
  try {
    const raw = localStorage.getItem(LS_SAVED_CAPSULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getCurateCounter(): number {
  try {
    return parseInt(localStorage.getItem("fdv_curate_index") || "0", 10) || 0;
  } catch { return 0; }
}

function consumeNextCapsule(): typeof PRESET_CAPSULES[0] | null {
  const counter = getCurateCounter();
  const capsule = PRESET_CAPSULES[counter % PRESET_CAPSULES.length];
  try { localStorage.setItem("fdv_curate_index", String(counter + 1)); } catch {}
  return capsule;
}

/* ── Gold divider ── */
function GoldDivider() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <div style={{ width: 40, height: 1, backgroundColor: "#c9a84c" }} />
    </div>
  );
}

/* ── Step component for How It Works ── */
function Step({ number, headline, body }: { number: string; headline: string; body: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <div
        style={{
          fontFamily: "Lora, serif",
          fontStyle: "italic",
          fontSize: 42,
          color: "#c9a84c",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {number}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{ width: 40, height: 1, backgroundColor: "#c9a84c" }} />
      </div>
      <h3
        style={{
          fontFamily: "Lora, serif",
          fontStyle: "italic",
          fontSize: 20,
          fontWeight: 500,
          color: "#1a1a1a",
          marginBottom: 8,
        }}
      >
        {headline}
      </h3>
      <p
        style={{
          fontFamily: "Lora, serif",
          fontSize: 16,
          color: "#1a1a1a",
          lineHeight: 1.7,
          opacity: 0.7,
          maxWidth: 360,
          margin: "0 auto",
        }}
      >
        {body}
      </p>
    </div>
  );
}

/* ── Destination Picker Overlay ── */
function DestinationPicker({
  onPick,
  onClose,
}: {
  onPick: (slug: string) => void;
  onClose: () => void;
}) {
  const { data: imageSlotsData } = useImageSlots();

  const getImageUrl = (assetKey: string, fallback: string): string => {
    if (imageSlotsData?.slots) {
      const slot = imageSlotsData.slots.find((s: any) => s.key === assetKey);
      if (slot?.currentUrl) return slot.currentUrl;
    }
    const defaultSlot = IMAGE_SLOTS.find((s: any) => s.key === assetKey);
    return defaultSlot?.defaultUrl || fallback;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#faf9f6",
          borderRadius: 12,
          maxWidth: 440,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "36px 24px 28px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontFamily: "Lora, serif",
            fontStyle: "italic",
            fontSize: 22,
            fontWeight: 500,
            color: "#1a1a1a",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          I don't know you yet — but I will in about 30 seconds.
        </h2>
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 16,
            color: "#1a1a1a",
            opacity: 0.6,
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          Where are you headed?
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {DESTINATIONS.map((dest) => {
            const imageUrl = getImageUrl(dest.imageSlotKey, dest.defaultImage);
            return (
              <button
                key={dest.slug}
                onClick={() => onPick(dest.slug)}
                style={{
                  position: "relative",
                  border: "none",
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "pointer",
                  aspectRatio: "3 / 4",
                  background: "#f0ece4",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 14,
                    right: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Lora, serif",
                      fontSize: 17,
                      fontWeight: 600,
                      color: "#fff",
                      lineHeight: 1.2,
                      marginBottom: 2,
                    }}
                  >
                    {dest.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.7)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {dest.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            display: "block",
            margin: "20px auto 0",
            background: "none",
            border: "none",
            fontFamily: "Lora, serif",
            fontSize: 14,
            color: "#1a1a1a",
            opacity: 0.4,
            cursor: "pointer",
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default function EditsPage() {
  const [, navigate] = useLocation();
  const { saveCount } = useUser();
  const [savedIds, setSavedIds] = useState<string[]>(getSavedCapsuleIds);
  const [showDestPicker, setShowDestPicker] = useState(false);
  const [showCurating, setShowCurating] = useState(false);
  const [curatingCapsule, setCuratingCapsule] = useState<typeof PRESET_CAPSULES[0] | null>(null);

  useEffect(() => {
    if (savedIds.length === 0 && saveCount >= 3) {
      const updated = ["desert-neutrals"];
      localStorage.setItem(LS_SAVED_CAPSULES_KEY, JSON.stringify(updated));
      setSavedIds(updated);
    }
  }, [saveCount, savedIds.length]);

  useEffect(() => {
    async function syncSaves() {
      try {
        const res = await fetch('/api/saves');
        if (res.ok) {
          const apiSaves = await res.json();
          const apiCapsuleIds = apiSaves
            .filter((s: any) => s.itemType === 'edit' && s.itemId?.startsWith('capsule-'))
            .map((s: any) => s.itemId.replace('capsule-', ''));
          const localIds = getSavedCapsuleIds();
          const allIds = [...new Set([...localIds, ...apiCapsuleIds])];
          localStorage.setItem(LS_SAVED_CAPSULES_KEY, JSON.stringify(allIds));
          setSavedIds(allIds);
        }
      } catch (err) {
        console.error('Failed to sync capsule saves:', err);
      }
    }
    syncSaves();
  }, []);

  const savedCapsules = PRESET_CAPSULES.filter((c) => savedIds.includes(c.id));
  const hasSaves = saveCount > 0;

  const handleCreateEdit = () => {
    if (hasSaves) {
      const next = consumeNextCapsule();
      if (next) {
        setCuratingCapsule(next);
        setShowCurating(true);
      }
    } else {
      setShowDestPicker(true);
    }
  };

  const handleDestPick = (_slug: string) => {
    setShowDestPicker(false);
    const next = consumeNextCapsule();
    if (next) {
      setCuratingCapsule(next);
      setShowCurating(true);
    }
  };

  const handleCuratingComplete = () => {
    const ids = getSavedCapsuleIds();
    if (curatingCapsule && !ids.includes(curatingCapsule.id)) {
      const updated = [...ids, curatingCapsule.id];
      localStorage.setItem(LS_SAVED_CAPSULES_KEY, JSON.stringify(updated));
      setSavedIds(updated);
    } else {
      setSavedIds(ids);
    }
    setShowCurating(false);
    if (curatingCapsule) {
      navigate(`/capsule/${curatingCapsule.id}?from=curate`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9" }}>

      {/* ═══ SECTION 1 — HERO ═══ */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "calc(100vh - 56px)",
          marginTop: 56,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${HERO_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* Hero text content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 24px 60px",
            maxWidth: 560,
            margin: "0 auto",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Your Edit
          </div>
          <h1
            style={{
              fontFamily: "Lora, serif",
              fontStyle: "italic",
              fontSize: "clamp(28px, 6vw, 36px)",
              fontWeight: 500,
              color: "#ffffff",
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            A capsule for your trip.
            <br />
            Built around you.
          </h1>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 420,
              margin: "0 auto 32px",
            }}
          >
            Wardrobe, essentials, the right pieces for where you're going — curated by someone paying attention.
          </p>
          <button
            onClick={handleCreateEdit}
            style={{
              background: "#c9a84c",
              color: "#ffffff",
              border: "none",
              padding: "18px 48px",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 7,
              cursor: "pointer",
              width: "100%",
              maxWidth: 340,
            }}
          >
            Create my Edit
          </button>
        </div>
      </div>

      {/* ═══ SECTION 2 — HOW IT WORKS ═══ */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
        <GoldDivider />

        <h2
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#1a1a1a",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          How It Works
        </h2>

        <Step
          number="01"
          headline="Tell us where you're going."
          body="Or just start exploring. We'll take it from there."
        />
        <Step
          number="02"
          headline="Save what stops you."
          body="Every pin sharpens what we know about your taste. But even without saves, we'll build something worth opening."
        />
        <Step
          number="03"
          headline="Your Edit arrives."
          body="A capsule that makes sense for your trip and who you are when you get there. Shop it, pack it, go."
        />
      </div>

      {/* ═══ SECTION 3 — SECOND CTA + PAST EDITS ═══ */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
        <GoldDivider />

        <p
          style={{
            fontFamily: "Lora, serif",
            fontStyle: "italic",
            fontSize: 24,
            fontWeight: 500,
            color: "#1a1a1a",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Ready?
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <button
            onClick={handleCreateEdit}
            style={{
              background: "#c9a84c",
              color: "#ffffff",
              border: "none",
              padding: "18px 48px",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 7,
              cursor: "pointer",
              width: "100%",
              maxWidth: 340,
            }}
          >
            Create my Edit
          </button>
        </div>

        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 14,
            color: "#1a1a1a",
            opacity: 0.45,
            lineHeight: 1.7,
            textAlign: "center",
            marginBottom: 0,
          }}
        >
          Your Edits get sharper over time. The more you use the site, the more precise they become.
        </p>

        <GoldDivider />

        {/* Previous Edits */}
        {savedCapsules.length > 0 ? (
          <>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Previous Edits
            </h2>
            <p
              style={{
                fontFamily: "Lora, serif",
                fontSize: 16,
                color: "#1a1a1a",
                opacity: 0.45,
                lineHeight: 1.6,
                textAlign: "center",
                marginBottom: 28,
              }}
            >
              Your curated capsules live here — and in your{" "}
              <Link href="/suitcase">
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                  Suitcase
                </span>
              </Link>
              .
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 14,
                marginBottom: 40,
              }}
            >
              {savedCapsules.map((capsule) => (
                <CapsuleCard
                  key={capsule.id}
                  capsule={capsule}
                  onTap={() => navigate(`/capsule/${capsule.id}`)}
                />
              ))}
            </div>

            <p
              style={{
                fontFamily: "Lora, serif",
                fontSize: 15,
                fontStyle: "italic",
                color: "rgba(44, 36, 22, 0.45)",
                lineHeight: 1.6,
                textAlign: "center",
                paddingBottom: 60,
              }}
            >
              As you save more, we'll learn more.
              <br />
              Your next Edit is building itself.
            </p>
          </>
        ) : (
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 15,
              fontStyle: "italic",
              color: "rgba(201, 168, 76, 0.6)",
              lineHeight: 1.6,
              textAlign: "center",
              padding: "20px 0 60px",
            }}
          >
            Your first Edit appears here.
          </p>
        )}
      </div>

      {/* Bottom padding for nav */}
      <div style={{ height: 80 }} />

      {/* Destination picker overlay */}
      {showDestPicker && (
        <DestinationPicker
          onPick={handleDestPick}
          onClose={() => setShowDestPicker(false)}
        />
      )}

      {/* Curating animation overlay */}
      {showCurating && curatingCapsule && (
        <CuratingAnimation
          capsuleName={curatingCapsule.name}
          capsuleTagline={curatingCapsule.tagline}
          onComplete={handleCuratingComplete}
        />
      )}
    </div>
  );
}

/* ── Capsule Card ── */

function CapsuleCard({ capsule, onTap }: { capsule: Capsule; onTap: () => void }) {
  const heroMood = capsule.moodImages[0];
  const heroImage = heroMood ? heroMood.imageUrl : "";
  const isPlaceholder = !heroImage || heroImage.startsWith("data:");

  return (
    <div
      onClick={onTap}
      style={{
        background: "#ffffff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }}
    >
      <div style={{ width: "100%", aspectRatio: "3 / 4", background: "#f0ece4", overflow: "hidden" }}>
        {!isPlaceholder ? (
          <img
            src={heroImage}
            alt={capsule.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0ece4",
            }}
          >
            <span style={{ fontFamily: "Lora, serif", fontSize: 16, color: "#9B8D7C" }}>
              {capsule.name}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "12px 10px" }}>
        <h3
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#1a1a1a",
            margin: 0,
            marginBottom: 3,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {capsule.name}
        </h3>
        <p style={{ fontFamily: "Lora, serif", fontSize: 12, color: "#9B8D7C", margin: 0, lineHeight: 1.4 }}>
          {capsule.tagline}
        </p>
      </div>
    </div>
  );
}
