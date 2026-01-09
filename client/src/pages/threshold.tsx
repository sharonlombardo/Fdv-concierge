import { GlobalNav } from "@/components/global-nav";
import CurrentFeed from "./current";
import { Link } from "wouter";
import { MapPin, Sparkles, Heart, Globe, Bell, ChevronRight } from "lucide-react";
import { useImageSlots } from "@/hooks/use-image-slot";
import { IMAGE_SLOTS } from "@shared/image-slots";

const EXPLORE_CATEGORIES = [
  { id: "destinations", label: "Travel Destinations", icon: MapPin, href: "/current" },
  { id: "experiences", label: "Experiences", icon: Sparkles, href: "/current" },
  { id: "rituals", label: "Rituals", icon: Heart, href: "/current" },
  { id: "culture", label: "Culture", icon: Globe, href: "/current" },
  { id: "concierge", label: "Concierge", icon: Bell, href: "/concierge" },
];

function TodaysEditCard({ getImageUrl }: { getImageUrl: (key: string) => string }) {
  const cardImage = getImageUrl("todays-edit-card");
  return (
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
          <h3 className="font-serif text-2xl md:text-3xl font-medium mb-2">Morocco 2026</h3>
          <p className="text-sm opacity-80 mb-4">A curated journey through Marrakech, the Atlas Mountains, and Essaouira</p>
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide opacity-70 group-hover:opacity-100 transition-opacity">
            <span>View Edit</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ExploreRow() {
  return (
    <div className="py-12 md:py-16 px-6" data-testid="section-explore">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-8 text-center">
          Explore
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {EXPLORE_CATEGORIES.map((category) => (
            <Link key={category.id} href={category.href}>
              <span
                className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                data-testid={`link-explore-${category.id}`}
              >
                {category.label}
              </span>
            </Link>
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
      
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.2)), url('${heroImage}')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-8 text-white">
          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight drop-shadow-lg"
            data-testid="text-threshold-title"
          >
            FIL DE VIE CONCIERGE
          </h1>
          <div className="space-y-4">
            <p className="text-lg md:text-xl opacity-90" data-testid="text-threshold-line1">
              Discover the world of FIL DE VIE.
            </p>
            <p className="text-lg md:text-xl opacity-90" data-testid="text-threshold-line2">
              Places, objects, and experiences worth returning to.
            </p>
          </div>
          <p className="text-base opacity-80 max-w-lg mx-auto leading-relaxed" data-testid="text-threshold-paragraph">
            A collection of places to enter, objects to live with, and moments to come back to.
          </p>
          <div className="pt-8">
            <button
              onClick={handleScrollToContent}
              className="animate-bounce cursor-pointer"
              data-testid="button-scroll-down"
              aria-label="Scroll to content"
            >
              <svg 
                className="w-6 h-6 mx-auto text-muted-foreground/50 hover:text-muted-foreground transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <div id="current-content">
        <ExploreRow />
        
        <section className="px-6 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto">
            <TodaysEditCard getImageUrl={getImageUrl} />
          </div>
        </section>

        <CurrentFeed embedded />
      </div>
    </div>
  );
}
