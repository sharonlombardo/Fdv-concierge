import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import fdvLogo from "@assets/LOGO_1767219658929.png";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/current", label: "The Current" },
  { href: "/suitcase", label: "Suitcase" },
  { href: "/packing", label: "Packing List" },
  { href: "/diary", label: "Travel Diary" },
  { href: "/destinations", label: "Destinations" },
  { href: "/concierge", label: "Concierge" },
  { href: "/image-control", label: "Image Control" },
];

interface GlobalNavProps {
  variant?: "default" | "overlay" | "fixed";
  showBack?: boolean;
  backHref?: string;
  onBack?: () => void;
  hideLogo?: boolean;
}

export function GlobalNav({ variant = "default", showBack = true, backHref, onBack, hideLogo = false }: GlobalNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const isOverlay = variant === "overlay";
  const isFixed = variant === "fixed";
  const textColor = isOverlay ? "text-white" : "text-foreground";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      setLocation(backHref);
    } else {
      window.history.back();
    }
  };

  const navClasses = isFixed
    ? "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    : isOverlay
    ? "absolute top-0 left-0 right-0 z-50"
    : "bg-background border-b border-border";

  return (
    <>
      <nav className={`flex items-center justify-between px-4 md:px-6 py-3 md:py-4 ${navClasses}`}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className={textColor}
            data-testid="button-menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          {showBack && location !== "/" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className={textColor}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
        </div>
        {!hideLogo && (
          <Link href="/" className={isOverlay ? "absolute left-1/2 -translate-x-1/2" : ""}>
            <img
              src={fdvLogo}
              alt="FDV Concierge"
              className={`h-8 md:h-11 w-auto cursor-pointer ${isOverlay ? "brightness-0 invert" : "dark:invert"}`}
              data-testid="nav-logo"
            />
          </Link>
        )}
        <div className="w-[76px] md:w-[84px]" />
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-background animate-in fade-in duration-200">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <img src={fdvLogo} alt="FDV" className="h-8 w-auto dark:invert" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-menu"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8">
              <div className="space-y-6">
                {NAV_LINKS.map((link) => (
                  <Link key={link.label} href={link.href}>
                    <button
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-left font-serif text-3xl md:text-4xl transition-colors ${
                        location === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid={`menu-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
            <div className="px-8 py-6 border-t border-border">
              <img src={fdvLogo} alt="FIL DE VIE CONCIERGE" className="h-6 w-auto dark:invert opacity-50" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function TopNav({ variant = "default" }: { variant?: "default" | "overlay" }) {
  const isOverlay = variant === "overlay";
  const textColor = isOverlay ? "text-white/90" : "text-muted-foreground";
  const hoverColor = isOverlay ? "hover:text-white" : "hover:text-foreground";

  return (
    <nav className={`flex items-center justify-center gap-8 px-6 py-4 ${isOverlay ? "absolute top-0 left-0 right-0 z-50" : ""}`}>
      <Link href="/current">
        <span className={`text-xs tracking-widest uppercase ${textColor} ${hoverColor} transition-colors`} data-testid="topnav-current">
          The Current
        </span>
      </Link>
      <Link href="/suitcase">
        <span className={`text-xs tracking-widest uppercase ${textColor} ${hoverColor} transition-colors`} data-testid="topnav-suitcase">
          Suitcase
        </span>
      </Link>
      <Link href="/concierge">
        <span className={`text-xs tracking-widest uppercase ${textColor} ${hoverColor} transition-colors`} data-testid="topnav-concierge">
          Concierge
        </span>
      </Link>
      <HamburgerMenu variant={variant} />
    </nav>
  );
}

function HamburgerMenu({ variant = "default" }: { variant?: "default" | "overlay" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isOverlay = variant === "overlay";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${isOverlay ? "text-white/90 hover:text-white" : "text-muted-foreground hover:text-foreground"} transition-colors`}
        data-testid="button-hamburger"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-background animate-in fade-in duration-200">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <span className="font-serif text-lg tracking-tight">FDV</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-hamburger"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8">
              <div className="space-y-6">
                {NAV_LINKS.map((link) => (
                  <Link key={link.label} href={link.href}>
                    <button
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-left font-serif text-3xl md:text-4xl transition-colors ${
                        location === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid={`hamburger-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
            <div className="px-8 py-6 border-t border-border">
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                FIL DE VIE CONCIERGE
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
