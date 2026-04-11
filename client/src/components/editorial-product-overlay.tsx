import { useState, useEffect } from "react";
import { PinButton } from "@/components/pin-button";
import { ItemModal, type ItemModalData } from "@/components/item-modal";
import { getShopImageUrl, getProductByKey } from "@/lib/brand-genome";

export interface EditorialProduct {
  id: string;
  brand: string;
  name: string;
  price: string | null;
  shopUrl: string;
  imageUrl: string;
  genomeKey?: string;
}

interface EditorialProductOverlayProps {
  editorialImageUrl: string;
  editorialImageAlt: string;
  products: EditorialProduct[];
  onClose: () => void;
}

export function EditorialProductOverlay({
  editorialImageUrl,
  editorialImageAlt,
  products,
  onClose,
}: EditorialProductOverlayProps) {
  const [modalItem, setModalItem] = useState<ItemModalData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Lock body scroll while overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleProductTap = (p: EditorialProduct) => {
    const genome = p.genomeKey ? getProductByKey(p.genomeKey) : undefined;
    const studioUrl = p.genomeKey ? getShopImageUrl(p.genomeKey) : "";
    setModalItem({
      id: p.id,
      title: p.name,
      bucket: "wardrobe",
      pinType: "style",
      assetKey: p.id,
      storyTag: "morocco",
      imageUrl: studioUrl || p.imageUrl,
      brand: genome?.brand || p.brand,
      price: genome?.price || p.price || undefined,
      shopUrl: genome?.url || p.shopUrl,
      shopStatus: genome?.shop_status || "live",
      genomeKey: p.genomeKey,
      color: genome?.color,
      sizes: genome?.sizes,
      description: genome?.description,
    });
    setModalOpen(true);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9991,
          background: "#faf9f6",
          borderRadius: "16px 16px 0 0",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        {/* Header bar with close */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px 8px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#9B8D7C",
            }}
          >
            Shop this look
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c2416"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {/* Editorial image */}
          <div
            style={{
              width: "100%",
              maxHeight: "40vh",
              overflow: "hidden",
            }}
          >
            <img
              src={editorialImageUrl}
              alt={editorialImageAlt}
              style={{
                width: "100%",
                height: "40vh",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Product cards */}
          <div style={{ padding: "16px 16px 100px" }}>
            {products.map((p) => {
              const studioUrl = p.genomeKey
                ? getShopImageUrl(p.genomeKey)
                : "";
              const imgSrc = studioUrl || p.imageUrl;
              return (
                <div
                  key={p.id}
                  onClick={() => handleProductTap(p)}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                >
                  {/* Product image */}
                  <div
                    style={{
                      width: 80,
                      height: 100,
                      flexShrink: 0,
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "#f0ece4",
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`${p.brand} ${p.name}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Product info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#9B8D7C",
                        marginBottom: 3,
                      }}
                    >
                      {p.brand}
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#1a1a1a",
                        marginBottom: 4,
                      }}
                    >
                      {p.name}
                    </div>
                    {p.price && (
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13,
                          color: "#2c2416",
                        }}
                      >
                        {p.price}
                      </div>
                    )}
                  </div>

                  {/* Pin button */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ flexShrink: 0 }}
                  >
                    <PinButton
                      itemType="style"
                      itemId={p.id}
                      itemData={{
                        title: `${p.brand} — ${p.name}`,
                        imageUrl: imgSrc,
                        storyTag: "morocco",
                      }}
                      sourceContext="morocco-guide-editorial"
                      aestheticTags={["wardrobe", "style", "morocco"]}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product detail modal (Level 3) */}
      <ItemModal
        item={modalItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
        source="current"
      />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

/** Shoppable indicator icon — shown on tappable editorial images */
export function ShoppableIndicator({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: "absolute",
        bottom: 10,
        right: 10,
        zIndex: 5,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.3)",
        backdropFilter: "blur(8px)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s",
      }}
      aria-label="Shop this image"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    </button>
  );
}
