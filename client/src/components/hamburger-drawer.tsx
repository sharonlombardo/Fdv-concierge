import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useUser } from "@/contexts/user-context";

const MENU_ITEMS: { label: string; href?: string; text?: string }[] = [
  { label: "Home", href: "/" },
  { label: "✨ Curate for Me", href: "/suitcase?curate=true" },
  { label: "_section", text: "DISCOVER" },
  { label: "The Current", href: "/current" },
  { label: "Guides", href: "/guides" },
  { label: "Shop", href: "/shop" },
  { label: "The Details", href: "/about" },
  { label: "_section", text: "YOUR TRIPS" },
  { label: "Itinerary Overview", href: "/concierge" },
  { label: "Daily Flow", href: "/daily-flow" },
  { label: "Packing Lists", href: "/packing" },
  { label: "Travel Diary", href: "/diary" },
  { label: "_section", text: "YOUR SUITCASE" },
  { label: "Suitcase", href: "/suitcase" },
  { label: "My Edits", href: "/my-edits" },
  { label: "My Trips", href: "/my-trips" },
  { label: "_divider" },
  { label: "Concierge", href: "/concierge-info" },
  { label: "Chat with Concierge", href: "/concierge-chat" },
  { label: "Profile", href: "/profile" },
];

interface HamburgerDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function HamburgerDrawer({ open, onClose }: HamburgerDrawerProps) {
  const [location] = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useUser();

  // Close on escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location === href || location.startsWith(href + "/");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(0, 0, 0, 0.3)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer — slides from left */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          zIndex: 999,
          background: "#faf9f6",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: open ? "4px 0 24px rgba(0,0,0,0.08)" : "none",
        }}
      >
        {/* Header — close button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <span
            style={{
              fontFamily: "Lora, serif",
              fontSize: 16,
              fontWeight: 500,
              color: "#2c2416",
              letterSpacing: "0.04em",
            }}
          >
            FDV
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              color: "#2c2416",
            }}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 0",
          }}
        >
          {MENU_ITEMS.map((item, idx) => {
            if (item.label === "_section") {
              return (
                <div key={`section-${idx}`} style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "rgba(26, 26, 22, 0.3)",
                  marginTop: 20,
                  marginBottom: 8,
                  padding: "0 20px",
                  textTransform: "uppercase" as const,
                }}>
                  {item.text}
                </div>
              );
            }
            if (item.label === "_divider") {
              return <div key={`divider-${idx}`} style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "16px 0" }} />;
            }
            const active = isActive(item.href!);
            return (
              <Link key={item.label} href={item.href!}>
                <button
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "12px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#2c2416" : "rgba(44, 36, 22, 0.6)",
                    letterSpacing: "0.02em",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = "rgba(44, 36, 22, 0.85)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = "rgba(44, 36, 22, 0.6)";
                  }}
                >
                  {/* Gold active indicator bar */}
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 3,
                        borderRadius: "0 2px 2px 0",
                        background: "#c9a84c",
                      }}
                    />
                  )}
                  {item.label}
                  {item.label === "Profile" && isLoggedIn && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#c9a84c",
                        marginLeft: 8,
                        display: "inline-block",
                      }}
                    />
                  )}
                </button>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(44, 36, 22, 0.3)",
            }}
          >
            Fil de Vie Concierge
          </p>
        </div>
      </div>
    </>
  );
}
