import { useState } from "react";
import { useLocation } from "wouter";
import { getProductImageUrl, getProductByKey } from "@/lib/brand-genome";
import { PinButton } from "@/components/pin-button";
import { ItemModal, type ItemModalData } from "@/components/item-modal";
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

function getItemImage(item: CapsuleItem): string {
  return getProductImageUrl(item.database_match_key);
}

function buildModalData(item: CapsuleItem): ItemModalData {
  const genome = getProductByKey(item.database_match_key);
  return {
    id: item.database_match_key,
    title: item.name,
    bucket: item.category,
    pinType: item.category === "look" ? "style" : "object",
    assetKey: item.database_match_key,
    storyTag: "capsule",
    imageUrl: getItemImage(item),
    brand: genome?.brand || item.brand,
    price: genome?.price || item.price,
    shopUrl: genome?.shop_status === "live" ? genome.url || undefined : undefined,
    detailDescription: genome?.description,
    genomeKey: item.database_match_key,
    color: genome?.color,
    sizes: genome?.sizes,
    shopStatus: genome?.shop_status,
  };
}

interface CapsuleViewProps {
  capsule: Capsule;
}

export function CapsuleView({ capsule }: CapsuleViewProps) {
  const [, navigate] = useLocation();
  const [modalItem, setModalItem] = useState<ItemModalData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(() =>
    getSavedCapsuleIds().includes(capsule.id)
  );

  const looks = capsule.items.filter((i) => i.category === "look");
  const accessories = capsule.items.filter(
    (i) =>
      i.category === "footwear" ||
      i.category === "bag" ||
      i.category === "accessory" ||
      i.category === "jewelry"
  );
  const beauty = capsule.items.filter((i) => i.category === "beauty");

  const heroItem = looks[0];
  const twoUpItems = looks.slice(1, 3);
  const remainingLooks = looks.slice(3);

  const handleItemTap = (item: CapsuleItem) => {
    setModalItem(buildModalData(item));
    setModalOpen(true);
  };

  const handleSaveEdit = () => {
    saveCapsuleId(capsule.id);
    setSaved(true);
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
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            marginTop: 8,
          }}
        >
          <button
            onClick={() => navigate("/my-edits")}
            style={{
              background: "none",
              border: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#2c2416",
              cursor: "pointer",
              padding: 0,
            }}
          >
            &larr; MY EDITS
          </button>
          {!saved && (
            <button
              onClick={handleSaveEdit}
              style={{
                background: "none",
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#c9a84c",
                cursor: "pointer",
                padding: 0,
              }}
            >
              SAVE EDIT
            </button>
          )}
        </div>

        {/* Capsule header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "Lora, serif",
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#2c2416",
              marginBottom: 16,
            }}
          >
            {capsule.name}
          </h1>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 18,
              fontStyle: "italic",
              color: "#2c2416",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            {capsule.tagline}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#e8e0d4" }} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#9B8D7C",
                whiteSpace: "nowrap",
              }}
            >
              {capsule.mood}
            </span>
            <div style={{ flex: 1, height: 1, background: "#e8e0d4" }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e8e0d4", marginBottom: 24 }} />

        {/* Hero item */}
        {heroItem && (
          <ProductCard
            item={heroItem}
            onTap={() => handleItemTap(heroItem)}
            layout="hero"
          />
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#e8e0d4",
            margin: "24px 0",
          }}
        />

        {/* Two-up items */}
        {twoUpItems.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {twoUpItems.map((item) => (
              <ProductCard
                key={item.database_match_key}
                item={item}
                onTap={() => handleItemTap(item)}
                layout="half"
              />
            ))}
          </div>
        )}

        {/* Remaining looks */}
        {remainingLooks.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {remainingLooks.map((item) => (
              <ProductCard
                key={item.database_match_key}
                item={item}
                onTap={() => handleItemTap(item)}
                layout="half"
              />
            ))}
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#e8e0d4",
            margin: "24px 0",
          }}
        />

        {/* Accessories section */}
        {accessories.length > 0 && (
          <>
            <h2
              style={{
                fontFamily: "Lora, serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c9a84c",
                marginBottom: 16,
              }}
            >
              THE ACCESSORIES
            </h2>
            <div
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                paddingBottom: 8,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {accessories.map((item) => (
                <ProductCard
                  key={item.database_match_key}
                  item={item}
                  onTap={() => handleItemTap(item)}
                  layout="accessory"
                />
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#e8e0d4",
            margin: "24px 0",
          }}
        />

        {/* Beauty section */}
        {beauty.length > 0 && (
          <>
            <h2
              style={{
                fontFamily: "Lora, serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c9a84c",
                marginBottom: 16,
              }}
            >
              THE DETAILS
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  beauty.length === 1 ? "1fr" : "1fr 1fr",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {beauty.map((item) => (
                <ProductCard
                  key={item.database_match_key}
                  item={item}
                  onTap={() => handleItemTap(item)}
                  layout="half"
                />
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#e8e0d4",
            margin: "24px 0",
          }}
        />

        {/* Closing description */}
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 16,
            fontStyle: "italic",
            color: "#2c2416",
            lineHeight: 1.7,
            textAlign: "center",
            margin: "32px 0",
          }}
        >
          {capsule.description}
        </p>

        {/* Save this edit button */}
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
          <div
            style={{
              textAlign: "center",
              marginBottom: 32,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: "#9B8D7C",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            &#10003; SAVED TO MY EDITS
          </div>
        )}
      </div>

      {/* Product modal */}
      <ItemModal
        item={modalItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
        source="current"
      />
    </div>
  );
}

/* ---------- Product Card ---------- */

function ProductCard({
  item,
  onTap,
  layout,
}: {
  item: CapsuleItem;
  onTap: () => void;
  layout: "hero" | "half" | "accessory";
}) {
  const imageUrl = getItemImage(item);
  const isPlaceholder = imageUrl.startsWith("data:");

  const containerStyle: React.CSSProperties =
    layout === "accessory"
      ? { minWidth: 120, flexShrink: 0 }
      : {};

  const imageAspect: React.CSSProperties =
    layout === "accessory"
      ? { width: 120, height: 160, borderRadius: 4, overflow: "hidden" }
      : {
          width: "100%",
          aspectRatio: "3 / 4",
          borderRadius: 4,
          overflow: "hidden",
        };

  return (
    <div style={containerStyle}>
      {/* Image */}
      <div
        onClick={onTap}
        style={{
          ...imageAspect,
          cursor: "pointer",
          position: "relative",
          background: "#f0ece4",
        }}
      >
        {isPlaceholder ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0ece4",
              padding: 12,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#9B8D7C",
              }}
            >
              {item.brand}
            </span>
            <span
              style={{
                fontFamily: "Lora, serif",
                fontSize: 13,
                color: "#2c2416",
                marginTop: 4,
              }}
            >
              {item.name}
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${item.brand} ${item.name}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit:
                item.category === "look" ? "contain" : "cover",
              background: item.category === "look" ? "#f0ece4" : undefined,
            }}
          />
        )}

        {/* Pin button */}
        <div style={{ position: "absolute", top: 6, right: 6 }}>
          <PinButton
            itemType={item.category === "look" ? "style" : "object"}
            itemId={item.database_match_key}
            itemData={{
              title: `${item.brand} — ${item.name}`,
              imageUrl: imageUrl,
              editTag: "capsule",
            }}
            sourceContext="capsule"
            size="sm"
          />
        </div>
      </div>

      {/* Item info */}
      <div style={{ marginTop: 8 }}>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: layout === "accessory" ? 10 : 12,
            letterSpacing: "0.1em",
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
            fontSize: layout === "accessory" ? 13 : 16,
            color: "#2c2416",
            margin: "2px 0 0",
            lineHeight: 1.3,
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: layout === "accessory" ? 12 : 14,
            color: "#9B8D7C",
            margin: "2px 0 0",
          }}
        >
          {item.price}
        </p>
      </div>
    </div>
  );
}
