import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const MAIN_NAV = [
  { id: "cover", label: "Cover", href: "/#cover" },
  { id: "current", label: "The Current", href: "/current" },
  { id: "rhythm", label: "The Rhythm", href: "/#rhythm" },
  { id: "overview", label: "Overview", href: "/#overview" },
  { id: "travel-notes", label: "Travel Notes", href: "/#travel-notes" },
];

const DAY_NAV = [
  { id: "day-1", label: "Day 1: Arrival", href: "/#day-1" },
  { id: "day-2", label: "Day 2: Atlas", href: "/#day-2" },
  { id: "day-3", label: "Day 3: Marrakech", href: "/#day-3" },
  { id: "day-4", label: "Day 4: Culture", href: "/#day-4" },
  { id: "day-5", label: "Day 5: Essaouira", href: "/#day-5" },
  { id: "day-6", label: "Day 6: Food", href: "/#day-6" },
  { id: "day-7", label: "Day 7: Desert", href: "/#day-7" },
  { id: "day-8", label: "Day 8: Return", href: "/#day-8" },
];

const USER_NAV = [
  { id: "packing", label: "Packing List", href: "/packing" },
  { id: "diary", label: "Travel Diary", href: "/diary" },
  { id: "suitcase", label: "Suitcase", href: "/suitcase" },
];

const ADMIN_NAV = [
  { id: "image-control", label: "Image Control", href: "/image-control" },
  { id: "image-management", label: "Image Management", href: "/images" },
  { id: "image-library", label: "Image Library", href: "/library" },
  { id: "image-rules", label: "Image Rules", href: "/rules" },
];

interface SiteNavProps {
  variant?: "light" | "dark";
}

export function SiteNav({ variant = "dark" }: SiteNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const textColor = variant === "light" 
    ? "text-white/90 hover:text-white" 
    : "text-foreground/80 hover:text-foreground";
  
  const iconColor = variant === "light" ? "text-white" : "text-foreground";
  const menuBg = "bg-background dark:bg-background";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100]">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className={`${iconColor} bg-black/20 backdrop-blur-sm hover:bg-black/30`}
            data-testid="button-menu-open"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="bg-black/20 backdrop-blur-sm rounded-md">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[200]" data-testid="nav-overlay">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-0 left-0 bottom-0 w-72 ${menuBg} shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col`}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-serif text-lg tracking-tight">FDV Concierge</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="button-menu-close"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground px-4 py-2">Itinerary</p>
                {MAIN_NAV.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <div
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 rounded-md text-sm tracking-wide transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      data-testid={`nav-link-${item.id}`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="p-4 space-y-1 border-t border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground px-4 py-2">Daily Flow</p>
                {DAY_NAV.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <div
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 rounded-md text-sm tracking-wide transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      data-testid={`nav-link-${item.id}`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="p-4 space-y-1 border-t border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground px-4 py-2">Your Trip</p>
                {USER_NAV.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <div
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 rounded-md text-sm tracking-wide transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      data-testid={`nav-link-${item.id}`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="p-4 space-y-1 border-t border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground/50 px-4 py-2">Admin</p>
                {ADMIN_NAV.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <div
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 rounded-md text-xs tracking-wide transition-colors cursor-pointer text-muted-foreground/50 hover:text-foreground hover:bg-accent/50"
                      data-testid={`nav-link-${item.id}`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Morocco 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
