import { GlobalNav } from "@/components/global-nav";
import CurrentFeed from "./current";
import { Link } from "wouter";
import { ChevronRight, Pin } from "lucide-react";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";

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
  { id: "travel", label: "Travel / Destinations", href: "/destinations", active: true },
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

  const heroImage = getImageUrl("landing-hero");

  const handleScrollToContent = () => {
    const contentSection = document.getElementById('current-content');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <GlobalNav variant="overlay" />

      {/* LANDING HERO — video background with logo + wordmark */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center bg-black">
        {/* Video background with static image fallback poster */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/landing-video.mp4"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#fafaf9]" />

        <div className="relative z-10 w-full mx-auto flex flex-col items-center text-white flex-1 justify-center">
          {/* Wordmark logo image — white on transparent, HUGE like reference */}
          <img
            src="/logo-wordmark-white.png"
            alt="FIL DE VIE CONCIERGE"
            className="w-[85vw] max-w-[900px] sm:w-[80vw] md:w-[75vw] drop-shadow-lg mb-10 md:mb-14 mx-auto"
            draggable={false}
            data-testid="text-threshold-title"
          />

          {/* Taglines */}
          <p
            className="text-lg font-bold text-white mb-2 drop-shadow-md"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Discover the world of{" "}
            <span className="tracking-[0.15em]">FIL DE VIE</span>
          </p>
          <p
            className="text-lg font-semibold italic text-white mb-16 md:mb-20 drop-shadow-md"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Places, objects, and experiences worth returning to.
          </p>
        </div>

        {/* A STATE OF MIND — anchored near bottom of hero */}
        <div className="relative z-10 pb-10 md:pb-14">
          <button
            onClick={handleScrollToContent}
            className="cursor-pointer group flex flex-col items-center gap-4"
            data-testid="button-scroll-down"
            aria-label="Scroll to content"
          >
            <p
              className="text-white text-xl md:text-2xl tracking-[0.5em] uppercase font-semibold drop-shadow-sm"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              A STATE OF MIND
            </p>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Category navigation — between hero and The Current */}
      <nav
        className="bg-[#fafaf9] border-b border-black/5"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 px-6 py-12 md:py-16 overflow-x-auto">
          {["TRAVEL", "STYLE", "CULTURE", "OBJECTS", "RITUALS"].map((cat) => (
            <span
              key={cat}
              onClick={cat === "TRAVEL" ? () => {
                window.location.href = "/destinations";
              } : undefined}
              className={`text-xs md:text-sm tracking-[0.15em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                cat === "TRAVEL"
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
