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

  // Lock body scroll while overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
      {/* Full-screen overlay container */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "#faf9f6",
          display: "flex",
          flexDirection: "column",
          animation: "editorialFadeIn 0.25s ease-out",
        }}
      >
        {/* Close button — overlays the editorial image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 210,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
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
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Scrollable content — editorial image + products */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Editorial image — large, immersive */}
          <div
            style={{
              width: "100%",
              height: "55vh",
              minHeight: 320,
              overflow: "hidden",
              position: "relative",
            }}
          >
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
            {/* Subtle gradient at bottom of editorial image */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: "linear-gradient(transparent, rgba(250,249,246,0.6))",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Shop this look label */}
          <div
            style={{
              padding: "20px 24px 8px",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#9B8D7C",
              }}
            >
              Shop this look
            </span>
          </div>

          {/* Product cards — large, spacious */}
          <div style={{ padding: "8px 24px 120px" }}>
            {products.map((p) => {
              const imgSrc = getProductImage(p);
              return (
                <div
                  key={p.id}
                  onClick={() => onProductTap(p)}
                  style={{
                    display: "flex",
                    gap: 20,
                    padding: "20px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                >
                  {/* Product image — large */}
                  <div
                    style={{
                      width: 100,
                      height: 130,
                      flexShrink: 0,
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "#f0ece4",
                    }}
                  >
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={`${p.brand} ${p.name}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                  </div>

                  {/* Product info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                        fontSize: 15,
                        fontWeight: 500,
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
                          fontSize: 14,
                          color: "#2c2416",
                          marginBottom: 10,
                        }}
                      >
                        {p.price}
                      </div>
                    )}
                    {/* View details link */}
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#c9a84c",
                      }}
                    >
                      View details &rarr;
                    </div>
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
