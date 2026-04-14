import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const isHome = location === "/";
  const isSuitcase = location.startsWith("/suitcase") || location.startsWith("/my-edits") || location.startsWith("/capsule") || location.startsWith("/my-trips");
  const isPassport = location === "/profile";

  const openHamburger = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-hamburger"));
  };

  const openConcierge = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-concierge"));
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[80] flex justify-around items-center"
      style={{
        height: "calc(60px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundColor: "#1A1A18",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }}
    >
      {/* HOME */}
      <Link href="/">
        <button
          className="flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer px-2"
          style={{
            color: isHome ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: isHome ? 600 : 400 }}>
            Home
          </span>
        </button>
      </Link>

      {/* MENU */}
      <button
        onClick={openHamburger}
        className="flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer px-2"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 400 }}>
          Menu
        </span>
      </button>

      {/* CONCIERGE — pulsing gold circle, center position */}
      <button
        onClick={openConcierge}
        className="flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer px-2"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#c9a84c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "concierge-pulse 3s ease-in-out infinite",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5z" />
            <path d="M5 17l1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2-1-2-2 1 1-2-2-1 2-1-1-2 2 1z" opacity="0.5" />
          </svg>
        </div>
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 400, color: "#c9a84c" }}>
          Concierge
        </span>
      </button>

      {/* SUITCASE */}
      <Link href="/suitcase">
        <button
          className="flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer px-2"
          style={{
            color: isSuitcase ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="8" width="18" height="13" rx="2" />
            <path d="M8 8V5a2 2 0 012-2h4a2 2 0 012 2v3" />
          </svg>
          <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: isSuitcase ? 600 : 400 }}>
            Suitcase
          </span>
        </button>
      </Link>

      {/* PASSPORT */}
      <Link href="/profile">
        <button
          className="flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer px-2"
          style={{
            color: isPassport ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 00-16 0" />
          </svg>
          <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: isPassport ? 600 : 400 }}>
            Passport
          </span>
        </button>
      </Link>
    </nav>
  );
}
