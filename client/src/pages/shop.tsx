import { useState } from "react";
import { getAllProducts, getShopImageUrl, type BrandGenomeProduct } from "@/lib/brand-genome";
import { ItemModal } from "@/components/item-modal";
import type { ItemModalData } from "@/components/item-modal";

// Per-product image adjustments for editorial photos with small subjects
// position: where to anchor the crop, scale: zoom factor to fill frame
const IMAGE_ADJUST: Record<string, { position?: string; scale?: number }> = {
  "look:aimeleondore:quarterzipset:black.jpg": { scale: 1.4, position: "center 45%" },
  "look:phoebephilo:cashmeretracksuit:espresso.jpg": { scale: 1.3, position: "center 25%" },
  "fil de vie look grecian dress.jpg": { scale: 1.3, position: "center 30%" },
  "look:fearofgod:leathercoat:espresso.jpg": { scale: 1.8, position: "center 55%" },
  "look:jilsander:silkfluidset:black.jpg": { scale: 1.7, position: "center 40%" },
  "look:therow:cashmeretracksuit:cream.jpg": { scale: 2.4, position: "center 30%" },
};

const CATEGORIES = [
  { key: "ALL", label: "All" },
  { key: "STYLE", label: "Style" },
  { key: "ACCESSORIES", label: "Accessories" },
  { key: "FOOTWEAR", label: "Footwear" },
  { key: "BEAUTY", label: "Beauty" },
  { key: "JEWELRY", label: "Jewelry" },
] as const;

function matchesFilter(product: BrandGenomeProduct, filter: string): boolean {
  if (filter === "ALL") return true;
  const cat = (product.category || "").toUpperCase();
  if (filter === "STYLE") return cat === "LOOK";
  if (filter === "ACCESSORIES") return cat.startsWith("ACCESSORY");
  if (filter === "FOOTWEAR") return cat === "FOOTWEAR";
  if (filter === "BEAUTY") return cat === "BEAUTY";
  if (filter === "JEWELRY") return cat.includes("JEWELRY");
  return true;
}

export default function ShopPage() {
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const products = getAllProducts();

  const getImgUrl = (product: BrandGenomeProduct): string => {
    const key = product.database_match_key || "";
    if (!key) return "";
    return getShopImageUrl(key);
  };

  const filteredProducts = products
    .filter(p => matchesFilter(p, activeFilter))
    .filter(p => {
      const url = getImgUrl(p);
      return url !== "";
    })
    .sort((a, b) => {
      if (a.shop_status === "live" && b.shop_status !== "live") return -1;
      if (b.shop_status === "live" && a.shop_status !== "live") return 1;
      return a.brand.localeCompare(b.brand);
    });

  const openModal = (product: BrandGenomeProduct) => {
    const imgUrl = getImgUrl(product);

    setSelectedItem({
      id: product.database_match_key || product.name,
      title: `${product.brand} ${product.name}`,
      bucket: "Your Style",
      pinType: "style",
      assetKey: product.database_match_key || "",
      storyTag: "shop",
      imageUrl: imgUrl || undefined,
      brand: product.brand,
      price: product.price || undefined,
      shopUrl: product.url || undefined,
      description: product.description || undefined,
      shopStatus: product.shop_status || undefined,
      genomeKey: product.database_match_key || undefined,
    });
    setDrawerOpen(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 70,
        paddingBottom: 80,
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <header style={{ textAlign: "center", marginBottom: 20, paddingTop: 8 }}>
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#1a1a1a",
              marginBottom: 8,
            }}
          >
            Shop
          </h1>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 15,
              fontStyle: "italic",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            Every object, chosen with intention.
          </p>
        </header>

        {/* Category filter pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 16,
            marginBottom: 8,
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 20,
                border: activeFilter === key ? "1px solid #1a1a1a" : "1px solid #d4d0c8",
                background: activeFilter === key ? "#1a1a1a" : "transparent",
                color: activeFilter === key ? "#fff" : "#1a1a1a",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            color: "rgba(0,0,0,0.4)",
            marginBottom: 16,
          }}
        >
          {filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        {/* Product grid — B&W aesthetic, responsive columns */}
        <style>{`
          .shop-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
          }
          @media (min-width: 600px) {
            .shop-grid { grid-template-columns: repeat(3, 1fr); }
          }
          @media (min-width: 900px) {
            .shop-grid { grid-template-columns: repeat(4, 1fr); }
          }
          @media (min-width: 1100px) {
            .shop-grid { grid-template-columns: repeat(5, 1fr); }
          }
        `}</style>
        <div className="shop-grid">
          {filteredProducts.map((product) => {
            const imgUrl = getImgUrl(product);

            return (
              <button
                key={product.database_match_key || product.name}
                onClick={() => openModal(product)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#f5f5f5",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    aspectRatio: "3/4",
                    width: "100%",
                    background: "#e8e4de",
                    overflow: "hidden",
                  }}
                >
                  {imgUrl && (() => {
                    const adj = IMAGE_ADJUST[(product.database_match_key || "").toLowerCase()];
                    return (
                      <img
                        src={imgUrl}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: adj?.position || "center center",
                          transform: adj?.scale ? `scale(${adj.scale})` : undefined,
                        }}
                        loading="lazy"
                      />
                    );
                  })()}
                </div>
                <div style={{ padding: "10px 10px 14px" }}>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#1a1a1a",
                      marginBottom: 2,
                    }}
                  >
                    {product.brand}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      color: "rgba(0,0,0,0.6)",
                      lineHeight: 1.3,
                    }}
                  >
                    {product.name}
                  </p>
                  {product.price && (
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        color: "#1a1a1a",
                        marginTop: 4,
                      }}
                    >
                      {product.price}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product modal */}
      <ItemModal
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={(isOpen) => {
          setDrawerOpen(isOpen);
          if (!isOpen) setSelectedItem(null);
        }}
      />
    </div>
  );
}
