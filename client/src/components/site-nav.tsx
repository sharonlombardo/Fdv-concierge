import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "current", label: "The Current", href: "/current" },
  { id: "packing", label: "Packing List", href: "/packing" },
  { id: "suitcase", label: "Suitcase", href: "/suitcase" },
  { id: "editorial", label: "Editorial", href: "/editorial" },
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
          <div className={`absolute top-0 left-0 bottom-0 w-72 ${menuBg} shadow-2xl animate-in slide-in-from-left duration-300`}>
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
            <div className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-md text-sm tracking-wide transition-colors cursor-pointer ${
                        isActive 
                          ? "bg-accent text-accent-foreground font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                      data-testid={`nav-link-${item.id}`}
                    >
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
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
