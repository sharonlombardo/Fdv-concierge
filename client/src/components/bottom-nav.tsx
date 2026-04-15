import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ConciergeOrb } from "./concierge-orb";

// Gold hierarchy:
// Level 1 — Concierge: full animated gold #c9a84c (handled by ConciergeOrb)
// Level 2 — Active page: bright #c9a84c + tiny gold dot
// Level 3 — Inactive: quiet #a08a5c, thin stroke, no animation

const INACTIVE = "#a08a5c";
const ACTIVE = "#c9a84c";

export default function BottomNav() {
  const [location] = useLocation();
  const [orbPressed, setOrbPressed] = useState(false);

  const isHome = location === "/";
  const isSuitcase =
    location.startsWith("/suitcase") ||
    location.startsWith("/my-edits") ||
    location.startsWith("/capsule") ||
    location.startsWith("/my-trips");
  const isPassport = location === "/profile";

  const openHamburger = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-hamburger"));
  };

  const openConcierge = (e: React.MouseEvent) => {
    e.preventDefault();
    setOrbPressed(true);
    setTimeout(() => setOrbPressed(false), 350);
    window.dispatchEvent(new CustomEvent("open-concierge"));
  };

  // Shared icon + label style for supporting tabs
  const iconColor = (active: boolean) => (active ? ACTIVE : INACTIVE);
  const labelStyle = (active: boolean): React.CSSProperties => ({
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    fontWeight: 400,
    fontFamily: "Inter, sans-serif",
    color: active ? ACTIVE : INACTIVE,
    marginTop: 1,
  });

  // Tiny gold active-state dot below icon
  const ActiveDot = () => (
    <div
      style={{
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: ACTIVE,
        marginTop: 3,
        marginBottom: -3,
      }}
    />
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9999]"
      style={{
        height: "calc(76px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingTop: 4,
        backgroundColor: "#1A1A18",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        alignItems: "center",
      }}
    >
      {/* ── HOME ── */}
      <Link href="/">
        <button
          className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer w-full"
          style={{ gap: 0 }}
        >
          {/* Architectural house: clean roofline + minimal body + door */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor(isHome)}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Roofline */}
            <polyline points="2 10 12 2 22 10" />
            {/* Walls */}
            <path d="M4 10v10h16V10" />
            {/* Door — centered, flush to bottom */}
            <rect x="9" y="14" width="6" height="6" rx="0.5" />
          </svg>
          {isHome ? <ActiveDot /> : <div style={{ height: 6 }} />}
          <span style={labelStyle(isHome)}>Home</span>
        </button>
      </Link>

      {/* ── MENU ── */}
      <button
        onClick={openHamburger}
        className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer w-full"
        style={{ gap: 0 }}
      >
        {/* Three elegant horizontal lines */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={INACTIVE}
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        <div style={{ height: 6 }} />
        <span style={labelStyle(false)}>Menu</span>
      </button>

      {/* ── CONCIERGE — living particle orb ── */}
      <button
        onClick={openConcierge}
        className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer w-full"
        style={{ gap: 0, paddingTop: 2 }}
      >
        <ConciergeOrb state={orbPressed ? "pressed" : "idle"} circleSize={28} />
        <span
          style={{
            fontSize: 8,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontWeight: 400,
            fontFamily: "Inter, sans-serif",
            color: ACTIVE,
            marginTop: 1,
          }}
        >
          Concierge
        </span>
      </button>

      {/* ── SUITCASE ── */}
      <Link href="/suitcase">
        <button
          className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer w-full"
          style={{ gap: 0 }}
        >
          {/* Travel suitcase: rectangular case + handle + horizontal band */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor(isSuitcase)}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Case body */}
            <rect x="3" y="8" width="18" height="13" rx="2" />
            {/* Handle */}
            <path d="M8 8V5.5a2.5 2.5 0 015 0V8" />
            {/* Horizontal band — luggage strap */}
            <line x1="3" y1="14" x2="21" y2="14" />
          </svg>
          {isSuitcase ? <ActiveDot /> : <div style={{ height: 6 }} />}
          <span style={labelStyle(isSuitcase)}>Suitcase</span>
        </button>
      </Link>

      {/* ── PASSPORT ── */}
      <Link href="/profile">
        <button
          className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer w-full"
          style={{ gap: 0 }}
        >
          {/* Passport book: rectangle with spine + globe motif */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor(isPassport)}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Book body */}
            <rect x="4" y="2" width="15" height="20" rx="1.5" />
            {/* Spine */}
            <line x1="8" y1="2" x2="8" y2="22" />
            {/* Globe circle (photo area) */}
            <circle cx="14" cy="13" r="4" />
            {/* Globe meridian */}
            <line x1="14" y1="9" x2="14" y2="17" />
            {/* Globe equator */}
            <line x1="10" y1="13" x2="18" y2="13" />
          </svg>
          {isPassport ? <ActiveDot /> : <div style={{ height: 6 }} />}
          <span style={labelStyle(isPassport)}>Passport</span>
        </button>
      </Link>
    </nav>
  );
}
