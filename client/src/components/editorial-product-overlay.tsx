import { useEffect } from "react";
import { PinButton } from "@/components/pin-button";
import { getShopImageUrl } from "@/lib/brand-genome";

export interface EditorialProduct {
  id: string;
  brand: string;
  name: string;
  price: string | null;
  shopUrl: string;
  imageUrl: string;
  genomeKey?: string;
  /** Suitcase bucket for save routing. Defaults to "Your Style". */
  bucket?: string;
  /** Pin item type. Defaults to "style". */
  pinType?: string;
}

interface EditorialProductOverlayProps {
  editorialImageUrl: string;
  editorialImageAlt: string;
  products: EditorialProduct[];
  onClose: () => void;
  onProductTap: (product: EditorialProduct) => void;
}

export function EditorialProductOverlay({
  editorialImageUrl,
  editorialImageAlt,
  products,
  onClose,
  onProductTap,
}: EditorialProductOverlayProps) {

  // Lock body scroll while overlay is open, preserving scroll position
  useEffect(() => {
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  const getProductImage = (p: EditorialProduct): string => {
    if (p.genomeKey) {
      const studio = getShopImageUrl(p.genomeKey);
      if (studio) return studio;
    }
    return p.imageUrl;
  };

  return (
    <>
      {/* Full-screen overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          animation: "editorialFadeIn 0.25s ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 210,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            WebkitTapHighlightColor: "transparent",
          }}
          aria-label="Close"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Scrollable product view */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Products — each with large image like Zara */}
          {products.map((p, idx) => {
            const imgSrc = getProductImage(p);
            return (
              <div
                key={p.id}
                onClick={() => onProductTap(p)}
                style={{
                  cursor: "pointer",
                  borderBottom: idx < products.length - 1 ? "1px solid #f0ece4" : "none",
                }}
              >
                {/* Large product image — framed with even padding */}
                <div
                  style={{
                    margin: "20px",
                    aspectRatio: "3 / 4",
                    maxHeight: "65vh",
                    overflow: "hidden",
                    background: "#f0ece4",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${p.brand} ${p.name}`}
                      style={{
                        maxWidth: "85%",
                        maxHeight: "85%",
                        objectFit: "contain",
                        display: "block",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    /* Fallback: show editorial image if no product image */
                    <img
                      src={editorialImageUrl}
                      alt={editorialImageAlt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  {/* Pin button on image */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 5,
                    }}
                  >
                    <PinButton
                      itemType={p.pinType || "style"}
                      itemId={p.id}
                      itemData={{
                        title: `${p.brand} — ${p.name}`,
                        imageUrl: imgSrc,
                        storyTag: "morocco",
                      }}
                      sourceContext="morocco-guide-editorial"
                      aestheticTags={[(p.bucket || "Your Style").toLowerCase(), p.pinType || "style", "morocco"]}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Product details below image */}
                <div style={{ padding: "16px 24px 32px" }}>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#9B8D7C",
                      marginBottom: 6,
                    }}
                  >
                    {p.brand}
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#1a1a1a",
                      marginBottom: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {p.name}
                  </div>
                  {p.price && (
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 15,
                        color: "#1a1a1a",
                      }}
                    >
                      {p.price}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Bottom padding */}
          <div style={{ height: 80 }} />
        </div>
      </div>

      <style>{`
        @keyframes editorialFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
