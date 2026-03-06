import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { MapPin, Camera } from "lucide-react";
import { PinButton } from "@/components/pin-button";
import { ItemModal, type ItemModalData } from "@/components/item-modal";
import { useCustomImages } from "@/hooks/use-custom-images";
import {
  ITINERARY_DATA,
  type ItineraryPage,
  type DayPage,
  type FlowItem,
} from "@shared/itinerary-data";
import {
  getProductByKey,
  getProductDisplayName,
  isShoppable,
  SECTION_LOOK_GENOME_KEY,
  FLOW_LOOK_GENOME_KEY,
  getProductImageUrl,
} from "@/lib/brand-genome";

function isDayPage(page: ItineraryPage): page is DayPage {
  return "day" in page;
}

const DAY_PAGES = ITINERARY_DATA.filter(isDayPage) as DayPage[];

export default function DailyFlowPage() {
  const [, setLocation] = useLocation();
  const [activeDay, setActiveDay] = useState(1);
  const [productModalItem, setProductModalItem] = useState<ItemModalData | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const { getImageUrl } = useCustomImages();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Scroll to day section when day pill tapped
  const scrollToDay = (dayNum: number) => {
    setActiveDay(dayNum);
    const el = dayRefs.current[dayNum - 1];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120; // account for sticky header + selector
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Update active day on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 160;
      for (let i = dayRefs.current.length - 1; i >= 0; i--) {
        const el = dayRefs.current[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveDay(i + 1);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll selector pill into view
  useEffect(() => {
    if (selectorRef.current) {
      const activePill = selectorRef.current.children[activeDay - 1] as HTMLElement;
      if (activePill) {
        activePill.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeDay]);

  const openProductModal = (data: {
    title: string;
    imageUrl: string;
    itemId: string;
    brand?: string;
    description?: string;
    shopUrl?: string;
    pinType?: string;
    genomeKey?: string;
  }) => {
    let resolvedGenomeKey = data.genomeKey;
    if (!resolvedGenomeKey && data.itemId) {
      const flowId = data.itemId.replace(/-(look|wardrobe)$/, "");
      const mapKey = FLOW_LOOK_GENOME_KEY[flowId] || SECTION_LOOK_GENOME_KEY[flowId];
      if (mapKey) resolvedGenomeKey = mapKey;
    }
    const genome = resolvedGenomeKey ? getProductByKey(resolvedGenomeKey) : undefined;
    const displayName = genome ? getProductDisplayName(genome) : data.title;
    const shopUrlResolved = genome && isShoppable(genome) ? genome.url : data.shopUrl;

    setProductModalItem({
      id: data.itemId,
      title: displayName,
      bucket: "Your Style",
      pinType: data.pinType || "look",
      assetKey: data.itemId,
      storyTag: "morocco",
      imageUrl: data.imageUrl,
      brand: genome?.brand || data.brand,
      price: genome?.price || undefined,
      shopUrl: shopUrlResolved || undefined,
      description: genome?.description || data.description,
      color: genome?.color || undefined,
      sizes: genome?.sizes || undefined,
      shopStatus: genome?.shop_status || undefined,
      genomeKey: resolvedGenomeKey,
    });
    setProductModalOpen(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: 100,
        background: "#faf9f6",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Page header */}
      <section
        style={{
          padding: "80px 24px 24px",
          textAlign: "center",
          borderBottom: "1px solid #e8e0d4",
        }}
      >
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 14,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#c9a84c",
            marginBottom: 12,
          }}
        >
          MOROCCO — DAILY FLOW
        </p>
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 18,
            color: "#2c2416",
            lineHeight: 1.6,
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          Your day-by-day itinerary with everything you need.
        </p>
      </section>

      {/* Sticky day selector */}
      <div
        style={{
          position: "sticky",
          top: 56, // below TopBar
          zIndex: 50,
          background: "rgba(250, 249, 246, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e8e0d4",
          padding: "12px 16px",
        }}
      >
        <div
          ref={selectorRef}
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {DAY_PAGES.map((dayPage) => {
            const isActive = activeDay === dayPage.day;
            return (
              <button
                key={dayPage.day}
                onClick={() => scrollToDay(dayPage.day)}
                style={{
                  flexShrink: 0,
                  padding: "8px 18px",
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  background: isActive ? "#c9a84c" : "#f0ebe0",
                  color: isActive ? "#ffffff" : "#2c2416",
                  transition: "background 0.25s, color 0.25s",
                }}
              >
                Day {dayPage.day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day sections */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px" }}>
        {DAY_PAGES.map((dayPage, idx) => (
          <div
            key={dayPage.day}
            ref={(el) => { dayRefs.current[idx] = el; }}
            style={{
              paddingTop: 48,
              paddingBottom: 32,
              borderBottom: idx < DAY_PAGES.length - 1 ? "1px solid #e8e0d4" : "none",
            }}
          >
            {/* Day header */}
            <div style={{ marginBottom: 32 }}>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(44, 36, 22, 0.45)",
                  marginBottom: 8,
                }}
              >
                DAY {dayPage.day} — {dayPage.date}
              </p>
              <h2
                style={{
                  fontFamily: "Lora, serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#2c2416",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                {dayPage.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  fontSize: 13,
                  color: "rgba(44, 36, 22, 0.5)",
                }}
              >
                <MapPin size={14} /> {dayPage.location}
              </div>
            </div>

            {/* Time-of-day flow items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {dayPage.flow.map((item, i) => {
                const wardrobeUrl = item.commercialWardrobe
                  ? getImageUrl(`${item.id}-wardrobe`, item.commercialWardrobe, { imageType: "wardrobe", title: item.title })
                  : null;

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 14,
                      padding: 16,
                      borderRadius: 8,
                      border: "1px solid #e8e0d4",
                      background: "#ffffff",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Outfit thumbnail */}
                    {wardrobeUrl && (
                      <div
                        onClick={() => {
                          const tlGenomeKey = FLOW_LOOK_GENOME_KEY[item.id] || SECTION_LOOK_GENOME_KEY[item.id];
                          const tlProduct = tlGenomeKey ? getProductByKey(tlGenomeKey) : undefined;
                          openProductModal({
                            title: tlProduct?.name || `${item.title} - The Look`,
                            imageUrl: wardrobeUrl,
                            itemId: `${item.id}-look`,
                            brand: tlProduct?.brand || undefined,
                            description: tlProduct?.description || item.wardrobe,
                            shopUrl: tlProduct?.url || undefined,
                            pinType: "style",
                            genomeKey: tlGenomeKey || undefined,
                          });
                        }}
                        style={{
                          width: 72,
                          height: 96,
                          borderRadius: 6,
                          overflow: "hidden",
                          flexShrink: 0,
                          cursor: "pointer",
                          background: "#f5f1e8",
                        }}
                      >
                        <img
                          src={wardrobeUrl}
                          alt="Look"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}

                    {/* Event details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "#c9a84c",
                          marginBottom: 4,
                        }}
                      >
                        {item.time}
                      </p>
                      <h4
                        style={{
                          fontFamily: "Lora, serif",
                          fontSize: 17,
                          fontWeight: 600,
                          color: "#2c2416",
                          margin: "0 0 4px",
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 13,
                          color: "rgba(44, 36, 22, 0.55)",
                          lineHeight: 1.5,
                          margin: 0,
                          fontStyle: "italic",
                        }}
                      >
                        {item.description || item.body}
                      </p>
                      {item.wardrobe && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "rgba(44, 36, 22, 0.4)",
                            marginTop: 6,
                            fontStyle: "italic",
                          }}
                        >
                          {item.wardrobe}
                        </p>
                      )}
                    </div>

                    {/* Pin save button */}
                    <div style={{ flexShrink: 0, paddingTop: 2 }}>
                      <PinButton
                        itemType="style"
                        itemId={item.id}
                        itemData={{
                          title: item.title,
                          location: dayPage.location,
                          imageUrl: wardrobeUrl || item.image || "",
                          editTag: "morocco-edit",
                          storyTag: "morocco",
                        }}
                        sourceContext="morocco_daily_flow"
                        aestheticTags={["daily-flow", `day-${dayPage.day}`]}
                        size="sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Travel Diary section */}
            <div
              style={{
                marginTop: 28,
                background: "#f5f1e8",
                borderRadius: 8,
                border: "1px solid #e8e0d4",
                padding: 16,
              }}
            >
              <p
                style={{
                  fontFamily: "Lora, serif",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#c9a84c",
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                Travel Diary
              </p>
              <textarea
                placeholder="How was your day? What surprised you?"
                style={{
                  width: "100%",
                  minHeight: 80,
                  padding: 12,
                  border: "1px solid #e0d8cc",
                  borderRadius: 6,
                  fontFamily: "Lora, serif",
                  fontSize: 14,
                  color: "#2c2416",
                  background: "#ffffff",
                  resize: "vertical",
                  outline: "none",
                }}
              />
              <div
                style={{
                  marginTop: 12,
                  border: "2px dashed #d4cdbf",
                  borderRadius: 6,
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <Camera size={20} color="rgba(44, 36, 22, 0.3)" />
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(44, 36, 22, 0.35)",
                    fontWeight: 500,
                  }}
                >
                  Add photos
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ItemModal
        item={productModalItem}
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
      />
    </div>
  );
}
