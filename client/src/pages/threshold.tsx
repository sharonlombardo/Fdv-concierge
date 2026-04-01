
import CurrentFeed from "./current";
import { Link, useLocation } from "wouter";
import { ChevronRight, Pin } from "lucide-react";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { useState, useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import { useUser } from "@/contexts/user-context";
import { HeroAnimation } from "@/components/hero-animation";

const MOOD_KEYS = [
  "todays-edit-mood-1",
  "todays-edit-mood-2",
  "todays-edit-mood-3",
  "todays-edit-mood-4",
];

const LOOK_KEYS = [
  "todays-edit-look-1",
  "todays-edit-look-2",
  "todays-edit-look-3",
  "todays-edit-look-4",
  "todays-edit-look-5",
  "todays-edit-look-6",
];

const CATEGORY_NAV = [
  { id: "guides", label: "Guides", href: "/guides", active: true },
  { id: "style", label: "Style", href: null, active: false },
  { id: "culture", label: "Culture", href: null, active: false },
  { id: "experiences", label: "Experiences", href: null, active: false },
  { id: "rituals", label: "Rituals", href: null, active: false },
  { id: "objects", label: "Objects of Desire", href: null, active: false },
  { id: "stateofmind", label: "State of Mind", href: null, active: false },
];

function TodaysEditCard({ getImageUrl }: { getImageUrl: (key: string) => string }) {
  const cardImage = getImageUrl("todays-edit-card");
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveAllItems = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const slotsResponse = await fetch('/api/image-slots');
      const slotsData = await slotsResponse.json();
      const slotMap = new Map<string, string>();
      if (slotsData.slots) {
        slotsData.slots.forEach((slot: { key: string; currentUrl: string }) => {
          slotMap.set(slot.key, slot.currentUrl);
        });
      }
      
      const getSlotImage = (key: string): string => {
        return slotMap.get(key) || getImageUrl(key);
      };

      const saveItem = async (itemType: string, itemId: string, title: string, imageUrl: string) => {
        await fetch('/api/saves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemType,
            itemId,
            sourceContext: 'todays_edit',
            aestheticTags: ['todays-edit'],
            savedAt: Date.now(),
            storyTag: 'todays-edit',
            editTag: 'opening-edit',
            title,
            assetUrl: imageUrl,
            metadata: { title, imageUrl, storyTag: 'todays-edit', editTag: 'opening-edit' }
          })
        });
      };

      await saveItem('edit', 'todays-edit-desert-neutrals', "Today's Edit - Desert Neutrals", getSlotImage("todays-edit-card"));
      
      for (let i = 0; i < MOOD_KEYS.length; i++) {
        const key = MOOD_KEYS[i];
        await saveItem('mood', key, `Mood ${i + 1}`, getSlotImage(key));
      }
      
      for (let i = 0; i < LOOK_KEYS.length; i++) {
        const key = LOOK_KEYS[i];
        await saveItem('product', key, `Look ${i + 1}`, getSlotImage(key));
      }
      
      setIsPinned(true);
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
    } catch (err) {
      console.error('Failed to save items:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <Link href="/todays-edit">
        <div 
          className="group relative overflow-hidden rounded-lg aspect-[4/5] md:aspect-[16/9] cursor-pointer"
          data-testid="card-todays-edit"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('${cardImage}')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <p className="text-xs font-medium tracking-[0.2em] uppercase opacity-80 mb-2">Today's Edit</p>
            <h3 className="font-serif text-2xl md:text-3xl font-medium mb-2">Desert Neutrals</h3>
            <p className="text-sm opacity-80 mb-4">A curated selection of mood, looks, and pieces</p>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide opacity-70 group-hover:opacity-100 transition-opacity">
              <span>View Edit</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            saveAllItems();
          }}
          disabled={isSaving || isPinned}
          className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
            isPinned 
              ? 'bg-white text-foreground' 
              : 'bg-black/40 hover:bg-black/60 text-white'
          }`}
          data-testid="button-pin-todays-edit-all"
        >
          <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}

function CategoryNav() {
  return (
    <div className="py-10 md:py-14 px-6 border-b border-border/30" data-testid="section-category-nav">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {CATEGORY_NAV.map((cat, i) => (
            <span key={cat.id} className="flex items-center gap-4 md:gap-8">
              {cat.active && cat.href ? (
                <Link href={cat.href}>
                  <span
                    className="text-xs md:text-sm tracking-[0.12em] uppercase text-foreground hover:opacity-70 transition-opacity cursor-pointer"
                    data-testid={`link-cat-${cat.id}`}
                  >
                    {cat.label}
                  </span>
                </Link>
              ) : (
                <span
                  className="text-xs md:text-sm tracking-[0.12em] uppercase text-muted-foreground/50 cursor-default"
                  data-testid={`link-cat-${cat.id}`}
                >
                  {cat.label}
                </span>
              )}
              {i < CATEGORY_NAV.length - 1 && (
                <span className="text-muted-foreground/30 text-xs">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Threshold() {
  const { isLoggedIn, authLoading } = useUser();
  const [, setLocation] = useLocation();

  // Returning authenticated users skip the hero — go straight to /current
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      setLocation("/current");
    }
  }, [authLoading, isLoggedIn, setLocation]);

  const { data: imageSlotsData } = useImageSlots();
  const getImageUrl = (assetKey: string): string => {
    if (imageSlotsData?.slots) {
      const slot = imageSlotsData.slots.find(s => s.key === assetKey);
      if (slot?.currentUrl) {
        return slot.currentUrl;
      }
    }
    const defaultSlot = IMAGE_SLOTS.find(s => s.key === assetKey);
    return defaultSlot?.defaultUrl || "";
  };

  // While checking auth, show nothing to prevent flash
  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      {/* TopBar handles navigation at app level */}

      {/* ANIMATED HERO — destination photography + greeting words */}
      <HeroAnimation />

      {/* Intro section — orients new users */}
      <section
        className="py-14 md:py-20 px-6"
        style={{ backgroundColor: "#fafaf9" }}
      >
        <div className="max-w-[480px] mx-auto text-center">
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "16px",
              color: "rgba(26, 26, 22, 0.75)",
              lineHeight: 1.7,
              marginBottom: "14px",
            }}
          >
            FIL DE VIE Concierge brings together travel, style, and the objects that belong with both.
          </p>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "16px",
              color: "rgba(26, 26, 22, 0.75)",
              lineHeight: 1.7,
              marginBottom: "14px",
            }}
          >
            Browse, save what you like, and keep it in your Suitcase.
          </p>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "16px",
              color: "rgba(26, 26, 22, 0.55)",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            A place to keep the things you want to come back to — and a way to bring them together when you're ready.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(26, 26, 22, 0.35)",
              marginBottom: "8px",
            }}
          >
            A curated edit, built from what you save.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link href="/suitcase?curate=true">
              <span
                className="inline-block cursor-pointer transition-all hover:opacity-70"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  color: "rgba(26, 26, 22, 0.4)",
                  borderBottom: "1px solid rgba(26, 26, 22, 0.2)",
                  paddingBottom: "2px",
                }}
              >
                Curate for Me →
              </span>
            </Link>
            <span style={{ color: "rgba(26, 26, 22, 0.15)", fontSize: "10px" }}>·</span>
            <Link href="/about">
              <span
                className="inline-block cursor-pointer transition-all hover:opacity-70"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  color: "rgba(26, 26, 22, 0.4)",
                  borderBottom: "1px solid rgba(26, 26, 22, 0.2)",
                  paddingBottom: "2px",
                }}
              >
                The details →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category navigation — between hero and The Current */}
      <nav
        className="bg-[#fafaf9] border-b border-black/5"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 px-6 py-12 md:py-16 overflow-x-auto">
          {["GUIDES", "STYLE", "CULTURE", "OBJECTS", "RITUALS"].map((cat) => (
            <span
              key={cat}
              onClick={cat === "GUIDES" ? () => {
                window.location.href = "/guides";
              } : undefined}
              className={`text-xs md:text-sm tracking-[0.15em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                cat === "GUIDES"
                  ? "text-[#1a1a1a] font-semibold border-b border-[#1a1a1a] pb-1"
                  : "text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70 font-medium"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </nav>

      <div id="current-content">
        <CurrentFeed embedded />
      </div>
    </div>
  );
}
