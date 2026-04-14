import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import HamburgerDrawer from "./hamburger-drawer";

const NAV_LINKS = [
  { label: "ABOUT", href: "/about" },
  { label: "DESTINATIONS", href: "/destinations" },
  { label: "SHOP", href: "/shop" },
];

function isNavActive(href: string, location: string): boolean {
  if (href === "/about") return location === "/about";
  if (href === "/destinations") return location === "/destinations" || location.startsWith("/guides");
  if (href === "/shop") return location === "/shop";
  return false;
}

export default function TopBar() {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setDrawerOpen(true);
    window.addEventListener('open-hamburger', handler);
    return () => window.removeEventListener('open-hamburger', handler);
  }, []);

  const isLanding = location === "/";

  useEffect(() => {
    if (!isLanding) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.75;
      setScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding]);

  const iconColor = isLanding && !scrolled ? "#ffffff" : "#2c2416";
  const navTextColor = isLanding && !scrolled ? "#ffffff" : "#2c2416";
  const navMutedColor = isLanding && !scrolled ? "rgba(255,255,255,0.85)" : "rgba(44,36,22,0.45)";
  const navBorderColor = isLanding && !scrolled ? "rgba(255,255,255,0.8)" : "#1A1A18";

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          background: isLanding && !scrolled ? "transparent" : "rgba(255, 255, 255, 0.97)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: isLanding && !scrolled ? "1px solid transparent" : "1px solid rgba(0, 0, 0, 0.06)",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Row 1: Hamburger left, circular logo centered */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 52,
            padding: "0 12px",
            position: "relative",
          }}
        >
          {/* Hamburger — absolutely positioned left so logo stays centered */}
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: iconColor,
              transition: "color 0.4s ease",
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Circular logo — centered */}
          <Link href="/">
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Home"
            >
              <img
                src={isLanding && !scrolled ? "/logo-circle-white.png" : "/logo-circle.jpeg"}
                alt="FDV Concierge"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                  transition: "opacity 0.4s ease",
                }}
              />
            </button>
          </Link>
        </div>

        {/* Row 2: ABOUT · DESTINATIONS · SHOP — left-aligned */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "0 16px 8px",
          }}
        >
          {NAV_LINKS.map((link) => {
            const active = isNavActive(link.href, location);
            return (
              <Link key={link.href} href={link.href}>
                <button
                  style={{
                    background: "none",
                    border: active ? `0.5px solid ${navBorderColor}` : "0.5px solid transparent",
                    borderRadius: 0,
                    cursor: "pointer",
                    padding: "4px 7px",
                    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: 9,
                    fontWeight: active ? 600 : 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase" as const,
                    color: active ? navTextColor : navMutedColor,
                    transition: "color 0.4s ease, border-color 0.4s ease",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {link.label}
                </button>
              </Link>
            );
          })}
        </nav>
      </header>

      <HamburgerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
