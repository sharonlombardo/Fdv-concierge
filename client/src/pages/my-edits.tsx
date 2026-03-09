import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PRESET_CAPSULES, type Capsule } from "@/data/capsule-data";
import { getProductImageUrl } from "@/lib/brand-genome";
import { useUser } from "@/contexts/user-context";

const LS_SAVED_CAPSULES_KEY = "fdv_saved_capsules";

function getSavedCapsuleIds(): string[] {
  try {
    const raw = localStorage.getItem(LS_SAVED_CAPSULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function MyEdits() {
  const [, navigate] = useLocation();
  const { saveCount } = useUser();
  const [savedIds, setSavedIds] = useState<string[]>(getSavedCapsuleIds);

  // Auto-seed "Desert Neutrals" if user has 3+ saves and no capsules yet
  useEffect(() => {
    if (savedIds.length === 0 && saveCount >= 3) {
      const updated = ["desert-neutrals"];
      localStorage.setItem(LS_SAVED_CAPSULES_KEY, JSON.stringify(updated));
      setSavedIds(updated);
    }
  }, [saveCount, savedIds.length]);

  const savedCapsules = PRESET_CAPSULES.filter((c) =>
    savedIds.includes(c.id)
  );

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
        {/* Header */}
        <h1
          style={{
            fontFamily: "Lora, serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#c9a84c",
            marginBottom: 16,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          MY EDITS
        </h1>
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 18,
            color: "#2c2416",
            lineHeight: 1.6,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          Your curated capsules — built from
          <br />
          everything you've saved.
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "#e8e0d4", marginBottom: 24 }} />

        {/* Capsule cards */}
        {savedCapsules.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {savedCapsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onTap={() => navigate(`/capsule/${capsule.id}`)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p
              style={{
                fontFamily: "Lora, serif",
                fontSize: 16,
                fontStyle: "italic",
                color: "rgba(44, 36, 22, 0.55)",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Save more items to unlock your first Edit.
              <br />
              We're watching what catches your eye.
            </p>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#e8e0d4",
            margin: "32px 0 24px",
          }}
        />

        {/* More edits coming */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: 12,
            }}
          >
            MORE EDITS COMING
          </h2>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 16,
              fontStyle: "italic",
              color: "#2c2416",
              lineHeight: 1.6,
            }}
          >
            As you save more, we'll learn more.
            <br />
            Your next Edit is building itself.
          </p>
        </div>
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
  const heroImage = heroMood
    ? heroMood.imageUrl
    : "";
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
      {/* Preview image */}
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
            <span
              style={{
                fontFamily: "Lora, serif",
                fontSize: 20,
                color: "#9B8D7C",
              }}
            >
              {capsule.name}
            </span>
          </div>
        )}
      </div>

      {/* Card info */}
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
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#9B8D7C",
            margin: 0,
            marginBottom: 6,
            lineHeight: 1.4,
          }}
        >
          {capsule.tagline}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            color: "#9B8D7C",
            margin: 0,
          }}
        >
          {capsule.moodImages.length + capsule.accessories.length} pieces · Saved {dateStr}
        </p>
      </div>
    </div>
  );
}
