// GlobalNav removed — TopBar is now app-level in App.tsx
import { useRoute } from "wouter";
import { Sparkles, Heart, Globe, Bell, MapPin } from "lucide-react";

const PAGE_CONFIG: Record<string, { title: string; subtitle: string; icon: typeof Sparkles }> = {
  experiences: {
    title: "Experiences",
    subtitle: "Curated moments worth traveling for",
    icon: Sparkles,
  },
  rituals: {
    title: "Rituals",
    subtitle: "Practices that ground and restore",
    icon: Heart,
  },
  culture: {
    title: "Culture",
    subtitle: "Art, architecture, and the stories they hold",
    icon: Globe,
  },
  "concierge-services": {
    title: "Concierge",
    subtitle: "Your personal travel companion",
    icon: Bell,
  },
  hydra: {
    title: "Hydra",
    subtitle: "Coming Soon",
    icon: MapPin,
  },
  "slow-travel": {
    title: "Slow Travel",
    subtitle: "Coming Soon",
    icon: MapPin,
  },
  retreat: {
    title: "Ritual Retreat",
    subtitle: "Coming Soon",
    icon: MapPin,
  },
  "new-york": {
    title: "New York",
    subtitle: "Coming Soon",
    icon: MapPin,
  },
};

export default function ComingSoon() {
  const [, params] = useRoute("/coming-soon/:page");
  const page = params?.page || "experiences";
  const config = PAGE_CONFIG[page] || PAGE_CONFIG.experiences;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* GlobalNav removed — TopBar is now app-level in App.tsx */}
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-8">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <h1 
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4"
          data-testid="text-coming-soon-title"
        >
          {config.title}
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          {config.subtitle}
        </p>
        
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
            Coming Soon
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground mt-12 tracking-widest uppercase">
          FDV Concierge
        </p>
      </div>
    </div>
  );
}
