import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { getShopImageUrl, getProductByKey } from "@/lib/brand-genome";
import { PinButton } from "@/components/pin-button";
import { ItemModal, type ItemModalData } from "@/components/item-modal";
import { useUser } from "@/contexts/user-context";
import type { Capsule, CapsuleItem } from "@/data/capsule-data";

const LS_SAVED_CAPSULES_KEY = "fdv_saved_capsules";

function getSavedCapsuleIds(): string[] {
  try {
    const raw = localStorage.getItem(LS_SAVED_CAPSULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCapsuleId(capsuleId: string) {
  const ids = getSavedCapsuleIds();
  if (!ids.includes(capsuleId)) {
    ids.push(capsuleId);
    localStorage.setItem(LS_SAVED_CAPSULES_KEY, JSON.stringify(ids));
  }
}

function removeSavedCapsuleId(capsuleId: string) {
  const ids = getSavedCapsuleIds().filter(id => id !== capsuleId);
  localStorage.setItem(LS_SAVED_CAPSULES_KEY, JSON.stringify(ids));
}

function getItemImage(item: CapsuleItem): string {
  // Use getShopImageUrl to prioritize Gemini studio shots over old itinerary images
  return getShopImageUrl(item.database_match_key);
}

function buildModalData(item: CapsuleItem): ItemModalData {
  const genome = getProductByKey(item.database_match_key);
  return {
    id: item.id,
    title: item.name,
    bucket: item.category,
    pinType: item.pinType as "style" | "object",
    assetKey: item.database_match_key,
    storyTag: "capsule",
    imageUrl: getItemImage(item),
    brand: genome?.brand || item.brand,
    price: genome?.price || item.price,
    shopUrl:
      genome?.shop_status === "live" ? genome.url || undefined : undefined,
    detailDescription: genome?.description,
    genomeKey: item.database_match_key,
    color: genome?.color,
    sizes: genome?.sizes,
    shopStatus: genome?.shop_status,
  };
}

/** Hide scrollbar utility styles */
const hideScrollbar: React.CSSProperties = {
  scrollbarWidth: "none" as const,
  msOverflowStyle: "none" as const,
};

interface CapsuleViewProps {
  capsule: Capsule;
}

export function CapsuleView({ capsule }: CapsuleViewProps) {
  const [, navigate] = useLocation();
  const [modalItem, setModalItem] = useState<ItemModalData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(() =>
    getSavedCapsuleIds().includes(capsule.id),
  );
  const { incrementSaveCount, email } = useUser();
  const queryClient = useQueryClient();

  const handleItemTap = (item: CapsuleItem) => {
    setModalItem(buildModalData(item));
    setModalOpen(true);
  };

  const handleSaveEdit = async () => {
    // Keep localStorage for fast local UI state
    saveCapsuleId(capsule.id);
    setSaved(true);

    // ALSO persist to database via saves API
    try {
      const res = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'edit',
          itemId: `capsule-${capsule.id}`,
          sourceContext: 'my-edits',
          editTag: 'capsule',
          storyTag: capsule.id,
          title: capsule.name,
          assetUrl: capsule.moodImages?.[0]?.imageUrl || '',
          pinType: 'edit',
          metadata: {
            capsuleId: capsule.id,
            capsuleTitle: capsule.name,
            itemCount: (capsule.moodImages?.length || 0) + (capsule.accessories?.length || 0)
          },
          userEmail: email || undefined
        })
      });
      if (res.ok) {
        incrementSaveCount();
        queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      }
    } catch (err) {
      console.error('Failed to save capsule to suitcase:', err);
      // localStorage save still works as fallback
    }
  };

  const handleUnsaveEdit = async () => {
    removeSavedCapsuleId(capsule.id);
    setSaved(false);

    try {
      await fetch(`/api/saves/${encodeURIComponent(`capsule-${capsule.id}`)}`, {
        method: 'DELETE'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
    } catch (err) {
      console.error('Failed to remove capsule from suitcase:', err);
    }
  };

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
      {/* ===== HEADER SECTION ===== */}
      <div style={{ textAlign: "center", padding: "0 16px" }}>
        {/* Back link */}
        <div
          style={{
            textAlign: "left",
            marginBottom: 24,
            marginTop: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => navigate("/my-edits")}
            style={{
              background: "none",
              border: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              letterSpacing: "0.15em",
              color: "#2c2416",
              cursor: "pointer",
              padding: 0,
            }}
          >
            &larr; MY EDITS
          </button>
          <button
            onClick={saved ? handleUnsaveEdit : handleSaveEdit}
            style={{
              background: "none",
              border: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: saved ? "#9B8D7C" : "#c9a84c",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {saved ? "✓ SAVED" : "SAVE EDIT"}
          </button>
        </div>

        {/* Title — italic serif */}
        <h1
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: "#2c2416",
            margin: "0 0 12px",
          }}
        >
          {capsule.name}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 14,
            color: "#6b6560",
            margin: "0 auto 16px",
            maxWidth: 340,
            lineHeight: 1.5,
          }}
        >
          {capsule.tagline}
        </p>

        {/* Editorial copy — italic */}
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontSize: 14,
            color: "#8a7d6b",
            margin: "0 auto 32px",
            maxWidth: 380,
            lineHeight: 1.6,
          }}
        >
          {capsule.editorialCopy}
        </p>
      </div>

      {/* ===== MOOD IMAGES — 2-column grid, NO product labels ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          padding: "0 12px",
          marginTop: 8,
        }}
      >
        {capsule.moodImages.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              aspectRatio: idx === 0 ? "4 / 3" : "3 / 4",
              overflow: "hidden",
              borderRadius: 3,
              background: "#f0ece4",
              gridColumn: idx === 0 ? "1 / -1" : undefined,
            }}
          >
            <img
              src={img.imageUrl}
              alt={img.alt}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
              }}
            />
            {/* Gold pin icon — top right */}
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
              }}
            >
              <PinButton
                itemType="style"
                itemId={`mood-${capsule.id}-${idx}`}
                itemData={{
                  title: img.alt,
                  imageUrl: img.imageUrl,
                  editTag: "capsule",
                  storyTag: capsule.id,
                }}
                sourceContext="capsule"
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== SECTION DIVIDER ===== */}
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#9B8D7C",
            margin: 0,
          }}
        >
          Shop the Look
        </p>
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontSize: 12,
            color: "#a89a88",
            margin: "6px 0 0",
          }}
        >
          {capsule.name} — Every Piece
        </p>
      </div>

      {/* ===== ACCESSORIES SECTION — horizontal scroll ===== */}
      <div style={{ padding: "0 12px", paddingBottom: 24 }}>
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 12,
            ...hideScrollbar,
          }}
        >
          {capsule.accessories.map((item) => (
            <div
              key={item.id}
              style={{
                flex: "none",
                width: item.id === "dn-acc-1" ? "49%" : "38%",
              }}
              className="sm-acc-card"
            >
              {/* Image container */}
              <div
                onClick={() => handleItemTap(item)}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  borderRadius: 4,
                  cursor: "pointer",
                  background: "#f0ece4",
                }}
              >
                <img
                  src={getItemImage(item)}
                  alt={`${item.brand} ${item.name}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                  }}
                />
                {/* Gold pin */}
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    zIndex: 1,
                  }}
                >
                  <PinButton
                    itemType="object"
                    itemId={item.database_match_key}
                    itemData={{
                      title: `${item.brand} — ${item.name}`,
                      imageUrl: getItemImage(item),
                      editTag: "capsule",
                      storyTag: capsule.id,
                      assetKey: item.database_match_key,
                    }}
                    sourceContext="capsule"
                    size="sm"
                  />
                </div>
              </div>
              {/* Brand + name below each */}
              <div style={{ marginTop: 6 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#9B8D7C",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {item.brand}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#2c2416",
                    margin: "2px 0 0",
                    lineHeight: 1.3,
                  }}
                >
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SAVE BUTTON ===== */}
      <div style={{ padding: "0 24px", maxWidth: 480, margin: "0 auto" }}>
        {!saved ? (
          <button
            onClick={handleSaveEdit}
            style={{
              width: "100%",
              height: 48,
              background: "#c9a84c",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              marginBottom: 32,
            }}
          >
            SAVE THIS EDIT
          </button>
        ) : (
          <button
            onClick={handleUnsaveEdit}
            style={{
              width: "100%",
              height: 48,
              background: "transparent",
              border: "1px solid #e8e0d4",
              borderRadius: 8,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9B8D7C",
              cursor: "pointer",
              marginBottom: 32,
            }}
          >
            &#10003; SAVED TO MY EDITS
          </button>
        )}

        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 22, fontStyle: 'italic', color: 'rgba(26, 26, 22, 0.7)', animation: 'softPulse 4s ease-in-out infinite' }}>
            <Link href="/suitcase?curate=true">
              <span style={{ borderBottom: '1px solid rgba(26, 26, 22, 0.3)', cursor: 'pointer' }}>Edit again</span>
            </Link>{' '}anytime. It changes as you save.
          </p>
        </div>
        <style>{`
          @keyframes softPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>

      {/* Product modal */}
      <ItemModal
        item={modalItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
        source="current"
      />

      {/* Hide scrollbar CSS (Webkit) */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 640px) {
          .sm-acc-card {
            width: 18% !important;
          }
        }
      `}</style>
    </div>
  );
}
