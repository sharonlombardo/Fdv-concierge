import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { PRESET_CAPSULES, type Capsule } from "@/data/capsule-data";
import { useUser } from "@/contexts/user-context";
import { useQueryClient } from "@tanstack/react-query";

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

/* ── Gold divider ── */
function GoldDivider() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <div style={{ width: 40, height: 1, backgroundColor: "#c9a84c" }} />
    </div>
  );
}

export default function EditsPage() {
  const [, navigate] = useLocation();
  const { saveCount, email } = useUser();
  const queryClient = useQueryClient();
  const [savedIds, setSavedIds] = useState<string[]>(getSavedCapsuleIds);

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

  return (
    <div style={{ minHeight: "100vh", paddingTop: 56, paddingBottom: 100, background: "#fafaf9" }}>
      {/* Hero image */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
        <img
          src={HERO_IMAGE}
          alt="Moodboard"
          style={{
            width: "100%",
            maxHeight: 500,
            objectFit: "cover",
            borderRadius: 8,
            display: "block",
            marginTop: 24,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
        {/* Headline */}
        <h1
          style={{
            fontFamily: "Lora, serif",
            fontStyle: "italic",
            fontSize: "clamp(20px, 5vw, 24px)",
            fontWeight: 500,
            color: "#1a1a1a",
            textAlign: "center",
            marginTop: 40,
            marginBottom: 24,
          }}
        >
          Your Edit
        </h1>

        {/* Body copy */}
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 16,
            color: "#1a1a1a",
            lineHeight: 1.7,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          We don't do generic recommendations. We pay attention to what you save — the pieces, the places, the things that stopped your scroll — and we build something from it. A capsule that actually makes sense for where you're going and who you are when you get there.
        </p>

        {/* CTA button — gold */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Link href="/suitcase?curate=true">
            <button
              style={{
                background: "#c9a84c",
                color: "#ffffff",
                border: "none",
                padding: "16px 40px",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: 7,
                cursor: "pointer",
              }}
            >
              Create my Edit
            </button>
          </Link>
        </div>

        {/* Sub-CTA copy */}
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 14,
            color: "#1a1a1a",
            opacity: 0.45,
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          Your Edits get sharper over time. Every pin teaches us something. Save more, use the site, and watch what happens.
        </p>

        {/* Explore Guides link — only when no saves */}
        {!hasSaves && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Link href="/destinations">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c9a84c",
                  cursor: "pointer",
                }}
              >
                Explore Guides →
              </span>
            </Link>
          </div>
        )}

        {/* Gold divider */}
        <GoldDivider />

        {/* Previous Edits section */}
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

            {/* Capsule cards — 2-column grid */}
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
              padding: "20px 0",
            }}
          >
            Your first Edit appears here once we've
            <br />
            learned enough about your taste.
          </p>
        )}
      </div>
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
