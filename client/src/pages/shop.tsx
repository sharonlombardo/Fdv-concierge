import { useState } from "react";
import { getAllProducts, type BrandGenomeProduct } from "@/lib/brand-genome";
import { useCustomImages } from "@/hooks/use-custom-images";
import { ItemModal } from "@/components/item-modal";
import type { ItemModalData } from "@/components/item-modal";

export default function ShopPage() {
  const { getImageUrl, hasCustomImage } = useCustomImages();
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get all products from the genome
  const products = getAllProducts();

  const openModal = (product: BrandGenomeProduct) => {
    const imgKey = product.database_match_key || "";
    const imgUrl = hasCustomImage(imgKey)
      ? getImageUrl(imgKey, "")
      : "";

    setSelectedItem({
      id: product.database_match_key || product.name,
      title: `${product.brand} ${product.name}`,
      bucket: "Your Style",
      pinType: "style",
      assetKey: imgKey,
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
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
        <header style={{ textAlign: "center", marginBottom: 40, paddingTop: 8 }}>
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

        {/* Product grid — B&W aesthetic */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 2,
          }}
        >
          {products.map((product) => {
            const imgKey = product.database_match_key || "";
            const imgUrl = hasCustomImage(imgKey)
              ? getImageUrl(imgKey, "")
              : "";

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
                    background: "#eee",
                    overflow: "hidden",
                  }}
                >
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  )}
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
