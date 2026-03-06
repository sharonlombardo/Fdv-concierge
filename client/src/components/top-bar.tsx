import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import HamburgerDrawer from "./hamburger-drawer";

export default function TopBar() {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLanding = location === "/";

  useEffect(() => {
    if (!isLanding) {
      setScrolled(true);
      return;
    }

    // On landing page, transition from transparent to white after scrolling past hero
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.75;
      setScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding]);

  // Always visible — but transparent over hero, white after scroll
  const iconColor = isLanding && !scrolled ? "#ffffff" : "#2c2416";

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          height: 56,
          background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0, 0, 0, 0.06)" : "1px solid transparent",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 16px",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Left — Hamburger */}
        <div style={{ justifySelf: "start" }}>
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
            }}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Center — Logo (dark logo, inverted white over hero) */}
        <div style={{ justifySelf: "center" }}>
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
                src="/logo-circle.jpeg"
                alt="FDV Concierge"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  filter: isLanding && !scrolled ? "invert(1) brightness(2)" : "none",
                  transition: "filter 0.4s ease",
                }}
              />
            </button>
          </Link>
        </div>

        {/* Right — Concierge icon */}
        <div style={{ justifySelf: "end" }}>
          <Link href="/concierge-info">
            <button
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
              }}
              aria-label="Concierge"
            >
              {/* Chat/sparkle icon for concierge */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </button>
          </Link>
        </div>
      </header>

      <HamburgerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
