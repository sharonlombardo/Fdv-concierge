import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  MapPin,
  Camera,
  Sun,
  Cloud,
  Wind,
  Info,
  ArrowRight,
  ArrowLeft,
  CloudUpload,
  Loader2,
  Share2,
  Download,
  X,
  Phone,
  Navigation,
  Clock,
  PenLine,
  Calendar,
  Plus,
  Mail,
  FileText,
  Ticket,
  Sparkles,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PinButton } from "@/components/pin-button";
import { ItemModal, type ItemModalData } from "@/components/item-modal";
import { useCustomImages } from "@/hooks/use-custom-images";
import { useJournal, type JournalEntry } from "@/hooks/use-journal";
import { SelfiePickerModal } from "@/components/selfie-picker-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SelfieImage } from "@shared/schema";
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
} from "@/lib/brand-genome";

function isDayPage(page: ItineraryPage): page is DayPage {
  return "day" in page;
}

const DAY_PAGES = ITINERARY_DATA.filter(isDayPage) as DayPage[];

// Weather display component
function WeatherDisplay({ weather }: { weather: { temp: number; cond: string } }) {
  const getIcon = (cond: string) => {
    const c = cond?.toLowerCase() || "";
    if (c.includes("rain")) return <Cloud className="w-4 h-4" />;
    if (c.includes("wind")) return <Wind className="w-4 h-4" />;
    if (c.includes("cloud")) return <Cloud className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        padding: "8px 16px",
        borderRadius: 24,
        border: "1px solid #e8e0d4",
      }}
    >
      <div style={{ color: "#2c2416" }}>{getIcon(weather.cond)}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "#2c2416",
          }}
        >
          {weather.temp}°F / {weather.cond}
        </span>
        <span
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            lineHeight: 1,
            marginTop: 3,
            color: "rgba(44,36,22,0.4)",
          }}
        >
          Live Conditions
        </span>
      </div>
    </div>
  );
}

// Local log image type
interface LocalLogImage {
  src: string;
  caption: string;
}

// InlineFlowDetail — renders INLINE when a schedule item is expanded
// Contains: LOGISTICS, THE LOOK (outfit + accessories), TRAVEL LOG
interface InlineFlowDetailProps {
  item: FlowItem;
  dayLocation?: string;
  dayDate?: string;
  entries: { [key: string]: JournalEntry };
  status: "idle" | "saving" | "saved";
  getImageUrl: (
    key: string,
    defaultUrl: string,
    context?: {
      time?: string;
      location?: string;
      title?: string;
      description?: string;
      imageType?: "item" | "wardrobe" | "cover";
    }
  ) => string;
  hasCustomImage: (key: string) => boolean;
  onJournalChange: (id: string, note: string) => void;
  onImageUpload: (id: string, file: File, field: string) => void;
  onImagesUpdate: (id: string, images: LocalLogImage[]) => void;
  onShare: () => void;
  onApplySelfie: (imageKey: string, selfie: SelfieImage) => void;
  onOpenProductModal?: (data: {
    title: string;
    imageUrl: string;
    itemId: string;
    brand?: string;
    description?: string;
    shopUrl?: string;
    pinType?: string;
    genomeKey?: string;
  }) => void;
}

function InlineFlowDetail({
  item,
  dayLocation,
  dayDate,
  entries,
  status,
  getImageUrl,
  hasCustomImage,
  onJournalChange,
  onImageUpload,
  onImagesUpdate,
  onShare,
  onApplySelfie,
  onOpenProductModal,
}: InlineFlowDetailProps) {
  const [selfiePickerOpen, setSelfiePickerOpen] = useState(false);
  const [selfiePickerTarget, setSelfiePickerTarget] = useState<string | null>(null);

  const handleOpenSelfiePicker = (imageKey: string) => {
    setSelfiePickerTarget(imageKey);
    setSelfiePickerOpen(true);
  };

  const handleSelectSelfie = (selfie: SelfieImage) => {
    if (selfiePickerTarget) {
      onApplySelfie(selfiePickerTarget, selfie);
    }
    setSelfiePickerOpen(false);
    setSelfiePickerTarget(null);
  };

  const getExistingImages = (): LocalLogImage[] => {
    const entry = entries[item.id];
    if (entry?.logImages && entry.logImages.length > 0) {
      return entry.logImages.map((img) =>
        typeof img === "string"
          ? { src: img, caption: "" }
          : { src: img.src, caption: img.caption || "" }
      );
    }
    if (entry?.logImage) {
      return [{ src: entry.logImage, caption: "" }];
    }
    return [];
  };

  const [localNote, setLocalNote] = useState(entries[item.id]?.note || "");
  const [localLogImages, setLocalLogImages] = useState<LocalLogImage[]>(getExistingImages);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const captionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleNoteChange = useCallback(
    (value: string) => {
      setLocalNote(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onJournalChange(item.id, value);
      }, 800);
    },
    [item.id, onJournalChange]
  );

  const handleImageUpload = useCallback(
    (file: File, field: string) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (field === "logImage") {
          setLocalLogImages((prev) => [...prev, { src: result, caption: "" }]);
        }
      };
      reader.readAsDataURL(file);
      onImageUpload(item.id, file, field);
    },
    [item.id, onImageUpload]
  );

  const handleRemoveImage = useCallback((index: number) => {
    const newImages = localLogImages.filter((_, i) => i !== index);
    setLocalLogImages(newImages);
    onImagesUpdate(item.id, newImages);
  }, [item.id, localLogImages, onImagesUpdate]);

  const handleCaptionChange = useCallback((index: number, caption: string) => {
    const newImages = localLogImages.map((img, i) => i === index ? { ...img, caption } : img);
    setLocalLogImages(newImages);
    if (captionDebounceRef.current) clearTimeout(captionDebounceRef.current);
    captionDebounceRef.current = setTimeout(() => {
      onImagesUpdate(item.id, newImages);
    }, 800);
  }, [item.id, localLogImages, onImagesUpdate]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (captionDebounceRef.current) clearTimeout(captionDebounceRef.current);
    };
  }, []);

  // Wardrobe image
  const wardrobeUrl = item.commercialWardrobe
    ? getImageUrl(`${item.id}-wardrobe`, item.commercialWardrobe, {
        imageType: "wardrobe",
        title: item.title,
      })
    : null;

  return (
    <div style={{ padding: "20px 0", borderTop: "1px solid #e8e0d4", animation: "fadeIn 0.3s ease" }}>
      {/* Full event image */}
      <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", background: "#f0ebe0", marginBottom: 20, position: "relative" }}>
        <img
          src={getImageUrl(item.id, item.image, { time: item.time, location: dayLocation, title: item.title, description: item.description, imageType: "item" })}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=1200"; }}
        />
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <PinButton
            itemType="experience"
            itemId={item.id}
            itemData={{ title: item.title, description: item.description || item.body, imageUrl: getImageUrl(item.id, item.image, { time: item.time, location: dayLocation, title: item.title, description: item.description, imageType: "item" }), time: item.time, location: dayLocation, editTag: "morocco-edit", storyTag: "morocco" }}
            sourceContext="morocco_daily_flow"
            aestheticTags={["experience", item.time?.toLowerCase() || ""]}
            size="md"
          />
        </div>
      </div>

      {/* Description */}
      <p style={{ fontFamily: "Lora, serif", fontSize: 16, lineHeight: 1.7, color: "rgba(44,36,22,0.6)", fontStyle: "italic", borderLeft: "2px solid #e8e0d4", paddingLeft: 20, marginBottom: 24 }}>
        {item.description || item.body}
      </p>

      {/* LOGISTICS */}
      {(item.contact || item.email || item.address || item.notes || item.map || item.ticketLink) && (
        <div style={{ marginBottom: 24, paddingTop: 16, borderTop: "1px solid #e8e0d4" }}>
          <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#2c2416", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={14} /> LOGISTICS
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {item.address && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#2c2416", paddingBottom: 10, borderBottom: "1px solid rgba(232,224,212,0.5)" }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{item.address}</span>
              </div>
            )}
            {item.contact && (
              <a href={`tel:${item.contact}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#2c2416", textDecoration: "none", paddingBottom: 10, borderBottom: "1px solid rgba(232,224,212,0.5)" }}>
                <Phone size={14} style={{ flexShrink: 0 }} /> {item.contact}
              </a>
            )}
            {item.email && (
              <a href={`mailto:${item.email}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#2c2416", textDecoration: "none", paddingBottom: 10, borderBottom: "1px solid rgba(232,224,212,0.5)" }}>
                <Mail size={14} style={{ flexShrink: 0 }} /> {item.email}
              </a>
            )}
            {item.notes && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "rgba(44,36,22,0.6)", fontStyle: "italic", paddingBottom: 10, borderBottom: "1px solid rgba(232,224,212,0.5)" }}>
                <FileText size={14} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{item.notes}</span>
              </div>
            )}
            {item.map && (
              <a href={item.map} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "#2c2416", textDecoration: "none", paddingBottom: 10, borderBottom: "1px solid rgba(232,224,212,0.5)" }}>
                <Navigation size={14} style={{ flexShrink: 0 }} /> Open in Maps
              </a>
            )}
            {item.ticketLink && (
              <a href={item.ticketLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, background: "#1a1a1a", color: "#ffffff", padding: "10px 20px", borderRadius: 24, textDecoration: "none" }}>
                <Ticket size={14} /> Book Tickets
              </a>
            )}
          </div>
        </div>
      )}

      {/* THE LOOK */}
      {item.wardrobe && (
        <div style={{ marginBottom: 24, paddingTop: 16, borderTop: "1px solid #e8e0d4" }}>
          <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#2c2416", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={14} /> THE LOOK
          </h4>
          <p style={{ fontSize: 14, fontWeight: 500, fontStyle: "italic", color: "rgba(44,36,22,0.6)", lineHeight: 1.5, marginBottom: 16 }}>
            "{item.wardrobe}"
          </p>

          {/* Main outfit image */}
          {wardrobeUrl && (
            <div
              style={{ maxWidth: 280, margin: "0 auto 16px", borderRadius: 8, overflow: "hidden", cursor: "pointer", position: "relative" }}
              onClick={() => {
                if (onOpenProductModal) {
                  const lookGenomeKey = FLOW_LOOK_GENOME_KEY[item.id] || SECTION_LOOK_GENOME_KEY[item.id];
                  const gp = lookGenomeKey ? getProductByKey(lookGenomeKey) : undefined;
                  onOpenProductModal({
                    title: gp?.name || `${item.title} - The Look`,
                    imageUrl: wardrobeUrl,
                    itemId: `${item.id}-look`,
                    brand: gp?.brand || undefined,
                    description: gp?.description || item.wardrobe,
                    shopUrl: gp?.url || undefined,
                    pinType: "style",
                    genomeKey: lookGenomeKey || undefined,
                  });
                }
              }}
            >
              <img src={wardrobeUrl} alt="The Look" style={{ width: "100%", height: "auto", borderRadius: 8 }} />
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                {(() => {
                  const pinGenomeKey = FLOW_LOOK_GENOME_KEY[item.id] || SECTION_LOOK_GENOME_KEY[item.id];
                  const pinProduct = pinGenomeKey ? getProductByKey(pinGenomeKey) : undefined;
                  return (
                    <PinButton
                      itemType="look"
                      itemId={`${item.id}-look`}
                      itemData={{ title: pinProduct?.name || `${item.title} - The Look`, description: pinProduct?.description || item.wardrobe, imageUrl: wardrobeUrl, editTag: "morocco-edit", storyTag: "morocco", genomeKey: pinGenomeKey || undefined }}
                      sourceContext="morocco_daily_flow"
                      aestheticTags={["look", "outfit", "style"]}
                      size="md"
                    />
                  );
                })()}
              </div>
            </div>
          )}

          {/* Accessory grid (4 items: footwear, handbag, jewelry, accessory) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, maxWidth: 320, margin: "0 auto" }}>
            {[0, 1, 2, 3].map((index) => {
              const extra = item.wardrobeExtras?.[index];
              const extraKey = `${item.id}-extra-${index}`;
              const customImageUrl = hasCustomImage(extraKey) ? getImageUrl(extraKey, "") : null;
              const hasImage = customImageUrl || extra?.image;
              const placeholderName = ["Footwear", "Handbag", "Jewelry", "Accessory"][index];
              return (
                <div key={index} style={{ textAlign: "center" }}>
                  <div style={{ aspectRatio: "1/1", borderRadius: 6, overflow: "hidden", border: "1px solid #e8e0d4", background: "#f5f1e8", position: "relative" }}>
                    {hasImage ? (
                      <>
                        <img
                          src={getImageUrl(extraKey, extra?.image || "")}
                          alt={extra?.name || placeholderName}
                          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                          onClick={() => {
                            if (onOpenProductModal) {
                              onOpenProductModal({
                                title: extra?.name || placeholderName,
                                imageUrl: getImageUrl(extraKey, extra?.image || ""),
                                itemId: extraKey,
                                shopUrl: extra?.shopLink,
                                pinType: "product",
                              });
                            }
                          }}
                        />
                        <div style={{ position: "absolute", top: 2, right: 2 }}>
                          <PinButton
                            itemType="product"
                            itemId={extraKey}
                            itemData={{ title: extra?.name || placeholderName, imageUrl: getImageUrl(extraKey, extra?.image || ""), shopLink: extra?.shopLink, editTag: "morocco-edit", storyTag: "morocco" }}
                            sourceContext="morocco_daily_flow"
                            aestheticTags={["accessory", placeholderName.toLowerCase()]}
                            size="sm"
                          />
                        </div>
                        <div style={{ position: "absolute", bottom: 2, right: 2 }}>
                          <button
                            onClick={() => handleOpenSelfiePicker(extraKey)}
                            style={{ width: 24, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <Camera size={12} color="#2c2416" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleOpenSelfiePicker(extraKey)}
                        style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "rgba(44,36,22,0.3)" }}
                      >
                        <Camera size={16} />
                        <span style={{ fontSize: 8, fontWeight: 600, textTransform: "uppercase" }}>ADD</span>
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(44,36,22,0.5)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {extra?.name || placeholderName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TRAVEL LOG */}
      <div style={{ marginBottom: 16, paddingTop: 16, borderTop: "1px solid #e8e0d4" }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#2c2416", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <PenLine size={14} /> TRAVEL LOG
        </h4>

        {/* YOUR NOTES */}
        <textarea
          placeholder="Record the moment..."
          value={localNote}
          onChange={(e) => handleNoteChange(e.target.value)}
          style={{ width: "100%", minHeight: 100, padding: 16, border: "1px solid #e0d8cc", borderRadius: 8, fontFamily: "Lora, serif", fontStyle: "italic", fontSize: 15, color: "#2c2416", background: "#ffffff", resize: "vertical", outline: "none", marginBottom: 16 }}
        />

        {/* YOUR PHOTOS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
          {localLogImages.map((img, index) => (
            <div key={index}>
              <div style={{ aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", position: "relative" }}>
                <img src={img.src} alt={`Log ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  onClick={() => handleRemoveImage(index)}
                  style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.8)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Add a caption..."
                value={img.caption}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                style={{ width: "100%", padding: "6px 0", border: "none", borderBottom: "1px solid #e0d8cc", fontFamily: "Lora, serif", fontStyle: "italic", fontSize: 13, color: "#2c2416", background: "transparent", outline: "none", marginTop: 6 }}
              />
            </div>
          ))}
          <label style={{ aspectRatio: "1/1", borderRadius: 8, border: "2px dashed #d4cdbf", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, "logImage"); }} />
            <Camera size={20} color="rgba(44,36,22,0.2)" />
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "rgba(44,36,22,0.3)" }}>Add Photo</span>
          </label>
        </div>

        {/* Share + status */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={onShare}
            disabled={localLogImages.length === 0}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#1a1a1a", color: "#ffffff", border: "none", borderRadius: 24, cursor: localLogImages.length === 0 ? "default" : "pointer", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: localLogImages.length === 0 ? 0.3 : 1 }}
          >
            <Share2 size={14} /> Share to Instagram
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "#f0ebe0", borderRadius: 24, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)" }}>
            {status === "saving" ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
            {status === "saving" ? "Saving..." : "Saved to Log"}
          </div>
        </div>
      </div>

      <SelfiePickerModal
        isOpen={selfiePickerOpen}
        onClose={() => setSelfiePickerOpen(false)}
        onSelectSelfie={handleSelectSelfie}
      />
    </div>
  );
}

export default function DailyFlowPage() {
  const [, setLocation] = useLocation();
  const [activeDay, setActiveDay] = useState(1);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [productModalItem, setProductModalItem] = useState<ItemModalData | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const { entries: journalEntries, saveEntry, status: saveStatus } = useJournal();
  const { getImageUrl, hasCustomImage } = useCustomImages();
  const queryClient = useQueryClient();

  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to day section when day pill tapped
  const scrollToDay = (dayNum: number) => {
    setActiveDay(dayNum);
    const el = dayRefs.current[dayNum - 1];
    if (el) {
      const y =
        el.getBoundingClientRect().top + window.scrollY - 120;
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
      const activePill = selectorRef.current.children[
        activeDay - 1
      ] as HTMLElement;
      if (activePill) {
        activePill.scrollIntoView({
          inline: "center",
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [activeDay]);

  // Selfie / image custom overrides
  const saveCustomImageMutation = useMutation({
    mutationFn: async ({
      imageKey,
      selfie,
    }: {
      imageKey: string;
      selfie: SelfieImage;
    }) => {
      const res = await apiRequest("POST", `/api/images/${imageKey}`, {
        customUrl: selfie.processedUrl,
        label: selfie.name,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
    },
  });

  const handleApplySelfie = (imageKey: string, selfie: SelfieImage) => {
    saveCustomImageMutation.mutate({ imageKey, selfie });
  };

  const handleJournalChange = (itemId: string, note: string) => {
    saveEntry(itemId, { note });
  };

  const handleImagesUpdate = (itemId: string, images: LocalLogImage[]) => {
    saveEntry(itemId, { logImages: images });
  };

  const processImage = (
    itemId: string,
    file: File,
    field: string = "image"
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", 0.6);

        if (field === "logImage") {
          const existingImages =
            journalEntries[itemId]?.logImages || [];
          const normalizedImages = existingImages.map((img) =>
            typeof img === "string"
              ? { src: img, caption: "" }
              : img
          );
          if (
            journalEntries[itemId]?.logImage &&
            normalizedImages.length === 0
          ) {
            normalizedImages.push({
              src: journalEntries[itemId].logImage!,
              caption: "",
            });
          }
          saveEntry(itemId, {
            logImages: [
              ...normalizedImages,
              { src: base64, caption: "" },
            ],
          });
        } else {
          saveEntry(itemId, { [field]: base64 });
        }
      };
    };
  };

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
      const mapKey =
        FLOW_LOOK_GENOME_KEY[flowId] ||
        SECTION_LOOK_GENOME_KEY[flowId];
      if (mapKey) resolvedGenomeKey = mapKey;
    }
    const genome = resolvedGenomeKey
      ? getProductByKey(resolvedGenomeKey)
      : undefined;
    const displayName = genome
      ? getProductDisplayName(genome)
      : data.title;
    const shopUrlResolved =
      genome && isShoppable(genome) ? genome.url : data.shopUrl;

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
          top: 56,
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
            ref={(el) => {
              dayRefs.current[idx] = el;
            }}
            style={{
              paddingTop: 48,
              paddingBottom: 32,
              borderBottom:
                idx < DAY_PAGES.length - 1
                  ? "1px solid #e8e0d4"
                  : "none",
            }}
          >
            {/* Day header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: "1px solid #e8e0d4",
              }}
            >
              <div>
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
                  DAILY FLOW: {dayPage.title}
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
              <WeatherDisplay weather={dayPage.weather} />
            </div>

            {/* Field notes */}
            {dayPage.fieldNotes && (
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Info size={14} color="rgba(44,36,22,0.45)" />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(44, 36, 22, 0.45)",
                    }}
                  >
                    Field Notes
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "Lora, serif",
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "rgba(44,36,22,0.55)",
                    fontStyle: "italic",
                    borderLeft: "2px solid #e8e0d4",
                    paddingLeft: 20,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {dayPage.fieldNotes}
                </div>
              </div>
            )}

            {/* Day hero image */}
            <div
              style={{
                width: "100%",
                aspectRatio: "21/18",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 28,
                background: "#f0ebe0",
                position: "relative",
              }}
            >
              <img
                src={getImageUrl(
                  `day-${dayPage.day}-hero`,
                  dayPage.flow[0]?.image || "",
                  {
                    imageType: "cover",
                    title: dayPage.title,
                    location: dayPage.location,
                  }
                )}
                alt={`Day ${dayPage.day}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=1200";
                }}
              />
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <PinButton
                  itemType="image"
                  itemId={`d${dayPage.day}-cover`}
                  itemData={{
                    title: `Day ${dayPage.day}: ${dayPage.title}`,
                    location: dayPage.location,
                    imageUrl: getImageUrl(
                      `day-${dayPage.day}-hero`,
                      dayPage.flow[0]?.image || "",
                      {
                        imageType: "cover",
                        title: dayPage.title,
                        location: dayPage.location,
                      }
                    ),
                    editTag: "morocco-edit",
                    storyTag: "morocco",
                  }}
                  sourceContext="morocco_daily_flow"
                  aestheticTags={[
                    "cover",
                    "day",
                    dayPage.location?.toLowerCase() || "",
                  ]}
                  size="md"
                />
              </div>
            </div>

            {/* Schedule header */}
            <div
              style={{
                marginBottom: 16,
                paddingBottom: 10,
                borderBottom: "2px solid #2c2416",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#2c2416",
                }}
              >
                SCHEDULE
              </span>
            </div>

            {/* Schedule flow items — tap to expand INLINE */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {dayPage.flow.map((item, i) => {
                const isExpanded = expandedItemId === item.id;
                const wardrobeUrl = item.commercialWardrobe
                  ? getImageUrl(
                      `${item.id}-wardrobe`,
                      item.commercialWardrobe,
                      {
                        imageType: "wardrobe",
                        title: item.title,
                      }
                    )
                  : null;

                return (
                  <div key={i} id={`flow-card-${item.id}`}>
                  <button
                    onClick={() => {
                      const newId = isExpanded ? null : item.id;
                      setExpandedItemId(newId);
                      if (newId) {
                        // Scroll the card to the top of the viewport after expansion renders
                        setTimeout(() => {
                          const el = document.getElementById(`flow-card-${item.id}`);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }
                    }}
                    style={{
                      display: "flex",
                      gap: 14,
                      padding: 16,
                      borderRadius: isExpanded ? "8px 8px 0 0" : 8,
                      border: isExpanded ? "1px solid #2c2416" : "1px solid #e8e0d4",
                      borderBottom: isExpanded ? "none" : undefined,
                      background: isExpanded ? "#faf9f6" : "#ffffff",
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) (e.currentTarget as HTMLButtonElement).style.borderColor = "#2c2416";
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8e0d4";
                    }}
                  >
                    {/* Outfit thumbnail */}
                    {wardrobeUrl && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          const tlGenomeKey =
                            FLOW_LOOK_GENOME_KEY[item.id] ||
                            SECTION_LOOK_GENOME_KEY[item.id];
                          const tlProduct = tlGenomeKey
                            ? getProductByKey(tlGenomeKey)
                            : undefined;
                          openProductModal({
                            title:
                              tlProduct?.name ||
                              `${item.title} - The Look`,
                            imageUrl: wardrobeUrl,
                            itemId: `${item.id}-look`,
                            brand:
                              tlProduct?.brand || undefined,
                            description:
                              tlProduct?.description ||
                              item.wardrobe,
                            shopUrl:
                              tlProduct?.url || undefined,
                            pinType: "style",
                            genomeKey:
                              tlGenomeKey || undefined,
                          });
                        }}
                        style={{
                          width: 64,
                          height: 80,
                          borderRadius: 6,
                          overflow: "hidden",
                          flexShrink: 0,
                          cursor: "pointer",
                          background: "#f5f1e8",
                          border: "1px solid #e8e0d4",
                        }}
                      >
                        <img
                          src={wardrobeUrl}
                          alt="Look"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {/* Event details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "Lora, serif",
                            fontSize: 17,
                            fontWeight: 600,
                            color: "#2c2416",
                            margin: 0,
                          }}
                        >
                          {item.title}
                        </h4>
                        {journalEntries[item.id] && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 9,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              background: "#2c2416",
                              color: "#ffffff",
                              padding: "2px 6px",
                              borderRadius: 10,
                            }}
                          >
                            <CloudUpload size={10} /> Logged
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "#c9a84c",
                          marginTop: 4,
                          marginBottom: 0,
                        }}
                      >
                        {item.time}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "rgba(44, 36, 22, 0.55)",
                          lineHeight: 1.5,
                          margin: "4px 0 0",
                          fontStyle: "italic",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.description || item.body}
                      </p>
                    </div>

                    {/* Expand indicator + Pin */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                      }}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <PinButton
                          itemType="style"
                          itemId={item.id}
                          itemData={{
                            title: item.title,
                            location: dayPage.location,
                            imageUrl:
                              wardrobeUrl ||
                              item.image ||
                              "",
                            editTag: "morocco-edit",
                            storyTag: "morocco",
                          }}
                          sourceContext="morocco_daily_flow"
                          aestheticTags={[
                            "daily-flow",
                            `day-${dayPage.day}`,
                          ]}
                          size="sm"
                        />
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} color="#2c2416" />
                      ) : (
                        <ChevronDown size={16} color="rgba(44,36,22,0.2)" />
                      )}
                    </div>
                  </button>

                  {/* INLINE EXPANSION — LOGISTICS + THE LOOK + TRAVEL LOG */}
                  {isExpanded && (
                    <div style={{ border: "1px solid #2c2416", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "0 16px 16px", background: "#faf9f6" }}>
                      <InlineFlowDetail
                        item={item}
                        dayLocation={dayPage.location}
                        dayDate={dayPage.date}
                        entries={journalEntries}
                        status={saveStatus}
                        getImageUrl={getImageUrl}
                        hasCustomImage={hasCustomImage}
                        onJournalChange={handleJournalChange}
                        onImageUpload={processImage}
                        onImagesUpdate={handleImagesUpdate}
                        onShare={() => {}}
                        onApplySelfie={handleApplySelfie}
                        onOpenProductModal={openProductModal}
                      />
                    </div>
                  )}
                  </div>
                );
              })}
            </div>

            {/* Daily mantra */}
            {dayPage.mantra && (
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 24,
                  borderTop: "1px solid #e8e0d4",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(44,36,22,0.35)",
                    marginBottom: 12,
                  }}
                >
                  DAILY MANTRA
                </p>
                <p
                  style={{
                    fontFamily: "Lora, serif",
                    fontSize: 20,
                    fontWeight: 700,
                    fontStyle: "italic",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#2c2416",
                    lineHeight: 1.5,
                    maxWidth: 500,
                    margin: "0 auto",
                  }}
                >
                  "{dayPage.mantra}"
                </p>
              </div>
            )}

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
