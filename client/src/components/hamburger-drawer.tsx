import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";

const MENU_ITEMS = [
  { num: "01", label: "ABOUT", desc: "Who we are + how it works", href: "/about" },
  { num: "02", label: "DESTINATIONS", desc: "The guides", href: "/destinations" },
  { num: "03", label: "SHOP", desc: "The collection", href: "/shop" },
  { num: "04", label: "YOUR CONCIERGE", desc: "Plan, ask, curate", action: "concierge" },
  { num: "05", label: "YOUR SUITCASE", desc: "Saves, edits, trips", href: "/suitcase" },
  { num: "06", label: "YOUR PASSPORT", desc: "Membership + details", href: "/profile" },
  { num: "07", label: "THE CURRENT", desc: "Editorial stories + shopping", href: "/current" },
];

interface HamburgerDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function HamburgerDrawer({ open, onClose }: HamburgerDrawerProps) {
  const [location] = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return location === "/";
    return location === href || location.startsWith(href + "/");
  };

  const handleItemClick = (item: typeof MENU_ITEMS[0]) => {
    onClose();
    if (item.action === "concierge") {
      setTimeout(() => window.dispatchEvent(new CustomEvent("open-concierge")), 100);
    }
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
          background: "rgba(0, 0, 0, 0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer — full-screen slide from left */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "#faf9f6",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header — close button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "20px 24px",
          }}
        >
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Numbered menu items */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 32px",
            gap: 32,
          }}
        >
          {MENU_ITEMS.map((item) => {
            const active = isActive(item.href);
            const content = (
              <button
                onClick={() => handleItemClick(item)}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 16,
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {/* Number */}
                <span
                  style={{
                    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                    fontSize: 12,
                    color: active ? "#c9a84c" : "rgba(44, 36, 22, 0.25)",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                  }}
                >
                  |{item.num}|
                </span>

                {/* Label + description */}
                <div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 16,
                      fontWeight: active ? 600 : 400,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase" as const,
                      color: active ? "#2c2416" : "rgba(44, 36, 22, 0.7)",
                      transition: "color 0.15s ease",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      color: "rgba(44, 36, 22, 0.35)",
                      marginTop: 4,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </button>
            );

            if (item.href) {
              return (
                <Link key={item.num} href={item.href}>
                  {content}
                </Link>
              );
            }
            return <div key={item.num}>{content}</div>;
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(44, 36, 22, 0.25)",
            }}
          >
            Fil de Vie Concierge
          </p>
        </div>
      </div>
    </>
  );
}
