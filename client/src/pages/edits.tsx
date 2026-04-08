import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { PRESET_CAPSULES, type Capsule } from "@/data/capsule-data";
import { getProductImageUrl } from "@/lib/brand-genome";
import { useUser } from "@/contexts/user-context";
import { useQueryClient } from "@tanstack/react-query";

const LS_SAVED_CAPSULES_KEY = "fdv_saved_capsules";

function getSavedCapsuleIds(): string[] {
  try {
    const raw = localStorage.getItem(LS_SAVED_CAPSULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function EditsPage() {
  const [, navigate] = useLocation();
  const { saveCount, email } = useUser();
  const queryClient = useQueryClient();
  const [savedIds, setSavedIds] = useState<string[]>(getSavedCapsuleIds);

  // Auto-seed "Desert Neutrals" if user has 3+ saves and no capsules yet
  useEffect(() => {
    if (savedIds.length === 0 && saveCount >= 3) {
      const updated = ["desert-neutrals"];
      localStorage.setItem(LS_SAVED_CAPSULES_KEY, JSON.stringify(updated));
      setSavedIds(updated);
    }
  }, [saveCount, savedIds.length]);

  // Sync localStorage with API saves on mount
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
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 70,
        paddingBottom: 100,
        background: "#faf9f6",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px" }}>
        {/* Hero CTA area */}
        <div style={{ textAlign: "center", padding: "32px 0 40px" }}>
          <h1
            style={{
              fontFamily: "Lora, serif",
              fontSize: 28,
              fontWeight: 500,
              color: "#2c2416",
              lineHeight: 1.3,
              marginBottom: 16,
            }}
          >
            {savedCapsules.length > 0 ? "Ready for a new Edit?" : "Your next Edit"}
          </h1>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 15,
              color: "#999",
              lineHeight: 1.7,
              marginBottom: 28,
              maxWidth: 320,
              margin: "0 auto 28px",
            }}
          >
            {hasSaves
              ? "Based on what you've saved, we'll curate a capsule made for you."
              : "Start saving what speaks to you. We'll pull it together."}
          </p>

          {hasSaves ? (
            <Link href="/suitcase?curate=true">
              <button
                style={{
                  background: "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  padding: "14px 32px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Create my Edit
              </button>
            </Link>
          ) : (
            <Link href="/destinations">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c9a84c",
                  cursor: "pointer",
                }}
              >
                Explore Guides →
              </span>
            </Link>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e8e0d4", marginBottom: 24 }} />

        {/* Past edits section */}
        {savedCapsules.length > 0 && (
          <>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c9a84c",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Your Edits
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {savedCapsules.map((capsule) => (
                <CapsuleCard
                  key={capsule.id}
                  capsule={capsule}
                  onTap={() => navigate(`/capsule/${capsule.id}`)}
                />
              ))}
            </div>

            {/* More coming */}
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p
                style={{
                  fontFamily: "Lora, serif",
                  fontSize: 15,
                  fontStyle: "italic",
                  color: "rgba(44, 36, 22, 0.5)",
                  lineHeight: 1.6,
                }}
              >
                As you save more, we'll learn more.
                <br />
                Your next Edit is building itself.
              </p>
            </div>
          </>
        )}

        {savedCapsules.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p
              style={{
                fontFamily: "Lora, serif",
                fontSize: 15,
                fontStyle: "italic",
                color: "rgba(44, 36, 22, 0.5)",
                lineHeight: 1.6,
              }}
            >
              Your first Edit appears here once we've
              <br />
              learned enough about your taste.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Capsule Card ---------- */

function CapsuleCard({
  capsule,
  onTap,
}: {
  capsule: Capsule;
  onTap: () => void;
}) {
  const heroMood = capsule.moodImages[0];
  const heroImage = heroMood ? heroMood.imageUrl : "";
  const isPlaceholder = !heroImage || heroImage.startsWith("data:");

  const dateStr = new Date(capsule.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={onTap}
      style={{
        background: "#ffffff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "3 / 4",
          background: "#f0ece4",
          overflow: "hidden",
        }}
      >
        {!isPlaceholder ? (
          <img
            src={heroImage}
            alt={capsule.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#f0ece4",
            }}
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
            <span style={{ fontFamily: "Lora, serif", fontSize: 20, color: "#9B8D7C" }}>
              {capsule.name}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: 16 }}>
        <h3
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#2c2416",
            margin: 0,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {capsule.name}
        </h3>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#9B8D7C", margin: 0, marginBottom: 6, lineHeight: 1.4 }}>
          {capsule.tagline}
        </p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9B8D7C", margin: 0 }}>
          {capsule.moodImages.length + capsule.accessories.length} pieces · Saved {dateStr}
        </p>
      </div>
    </div>
  );
}
